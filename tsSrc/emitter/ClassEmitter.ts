
import { ArgData } from "../ArgDatas";
import { Emitter, IExport } from "./Emitter";
import { Writter } from "../writter";
import { customize } from "./SysEmitter";
import { JSBClass, MethodData, GetterData } from "../binding/JSBClass";



export class ClassEmitter implements Emitter{
 

    emitDefine(): void {
        
        this.w.newLine();
        this.buildCtor();
        this.w.newLine();
        for (let k in this.data.methods) {
            let f = this.data.methods[k];
            this.buildFunc(this.w,f) ;
            this.w.newLine().newLine();
        }
        for (let k in this.data.getters) {
            let g = this.data.getters[k];
             this.buildGetter(this.w,g);
        }
        this.w.newLine();
        this.buildMain(this.w);
        this.w.newLine();

    }
    emitBinding(): void {
        //this.w.writeText(this.apiName()+"(ctx);");
    }

    setExport(exp: IExport): void {
        exp.export(this.data.name,this.apiName()+"(ctx)");
    }



    constructor(protected data: JSBClass,protected w:Writter) {

    }

   


    apiName(){
        return "jsapi_init_"+ this.data.name;
    }
    /**
     * 创建对象的绑定主函数
     */
    protected buildMain(w:Writter) {
        w.writeText("jsb::Value "+this.apiName()+ "(const jsb::Context& ctx)").newLine().writeLeftBracket().newLine();
        
        
        let funcs = new Array<MethodData>();
        let staticFuncs = new Array<MethodData>();
        for (let k in this.data.methods) {
            let f = this.data.methods[k];
            if (f.isStatic) {
                staticFuncs.push(f);
            } else {
                funcs.push(f);
            }
        }
        if(funcs.length>0||this.data.getters){
            w.writeText("static const JSCFunctionListEntry functions[] = ").newLine().writeLeftBracket().newLine();
            for (let f of funcs) {
                w.writeText("JSB_CFUNC_DEF(\"" + f.name + "\", 0," + this.functionName(f) + "),").newLine();
            }
            if (this.data.getters) {
                for (let k in this.data.getters) {
                    let g = this.data.getters[k];
                    w.writeText("JSB_CGETSET_DEF(\"" + g.name + "\"," + this.getterName(g, true) + "," + this.getterName(g, false) + "),").newLine();
                }
            } 
            w.writeRightBracket().writeText(";").newLine();
        }
       
        if (staticFuncs.length > 0) {
            w.writeText("static const JSCFunctionListEntry staticFuncs[] = ").newLine().writeLeftBracket().newLine();
            for (let f of staticFuncs) {
                w.writeText("JSB_CFUNC_DEF(\"" + f.name + "\", 0," + this.functionName(f) + "),").newLine();
            }
            w.writeRightBracket().writeText(";").newLine();
        } else {
            //w.writeText("duk_function_list_entry staticFuncs[] = {{NULL,NULL}};").newLine();
        }
       
       let extendId="0";
       if(this.data.extend.length>0){
           extendId=this.data.extend+"::GetTypeInfoStatic()->bindingId";
       }
       let finalizer="default_finalizer"
        w.writeText("jsb::JSBClass c(ctx,&("+this.classId()+"),\"" + this.data.name + "\"," + this.ctorName() +","+finalizer+ "," + extendId + ");" ).newLine();
       w.writeText("return c.ctor;").newLine();
        w.writeRightBracket().newLine();
    }

    /**
     * 创建构造函数
     */
    protected buildCtor() {
        let w=this.w;
        w.writeText("JSValue " + this.ctorName() + "(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)").newLine();
        w.writeLeftBracket().newLine();
        
        
       this.buildNativeCtor(w) ;
       w.newLine();
       w.writeText("if(native)").writeLeftBracket().newLine();
       w.writeText("JSValue ret = JS_NewObjectClass(ctx, "+this.classId()+");").newLine();
       w.writeText("Add_Object(ret,native);").newLine();
       w.writeText("return ret;").newLine();
       w.writeRightBracket().newLine();
       w.writeText("return JS_UNDEFINED;").newLine();
      
       w.writeRightBracket().newLine().newLine();
    }

    /**
     * 打印本地函数运行语句 并且返回结果
     * @param f 
     * @param argCount 
     */
    protected buildRunNetiveFunc(w:Writter, f: MethodData, args: ArgData[]) {
        let nativeName = this.data.name;
        if (this.data.nativeName) nativeName = this.data.nativeName;
        if (f.isStatic) {
           // let func = "";
            let argsInside = "(";
            let next = "";
            let argCount=args.length;
            for (let i = 0; i < argCount; i++) {
                let ref="";
                if(args[i].ref)ref="*";
                argsInside += next +ref+ "n" + i;
                next = ","
            }
            argsInside += ");";
            if (f.returnType) {
                w.writeText("auto ret=" + nativeName + "::" + f.nativeName + argsInside).newLine();
                w.writeText("return ").writeText(f.returnType.setFunc()).newLine();
            } else {
                w.writeText(nativeName + "::" + f.nativeName + argsInside).newLine();
                w.writeText("return JS_UNDEFINED;").newLine();
            }
        } else {
            w.writeText(nativeName + "* native=js_to_native_object<" + nativeName + ">(ctx,this_val);").newLine();
            this.buildNativeFunc(w,f, args);
            w.newLine();
        }
    }

    /**创建带特定函数的条件语句 */
    protected buildFuncWithArgs(w:Writter,f: MethodData, args: ArgData[]) {
       
        w.writeText("if(");
        let next = "";

        let minCount = args.length;//最少参数个数
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].ignore) {
                minCount--;
            } else {
                break;
            }
        }
        if (args.length > 0) {
            let idx = 0;
            for (let a of args) {
                w.writeText(next +this.checkArgs(a, idx)).newLine();
                next = "&&";
                idx++;
            }
        } else {
            w.writeText("argc==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc=()=>{
            w.writeText("if(");
        }
        //判断函数个数条件语句
        for (let i = minCount; i <= args.length; i++) {
            nextFunc();
            w.writeText("argc==" + i + ")").writeLeftBracket().newLine();
           
            for (let j = 0; j < i; j++) {
                let a = args[j];
                w.writeText(this.buildArgs(a, j)).newLine();
            }
           this.buildRunNetiveFunc(w,f, args.slice(0,i));
           nextFunc=()=>{
               w.writeRightBracket().writeText("else if(")
           }
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText(`JS_ThrowTypeError(ctx, "invalid argument value: ` + args.length + `");`).newLine().writeRightBracket();
    }

    /**
     * 创建函数定义
     * @param f 
     */
    protected buildFunc(w:Writter,f: MethodData) {
        if(f.customize){
            w.writeText(customize[f.customize]);
        }else{
            w.writeText( "JSValue " + this.functionName(f) + "(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)").newLine();
            w.writeLeftBracket().newLine();
           
            let next = ()=>{w.writeText("")}
           this.buildFuncWithArgs(w,f, f.args) ;
           w.newLine();
            if (f.othersArgs) {
                next = ()=>{w.writeRightBracket().writeText("else ");}
                for (let args of f.othersArgs) {
                    next();
                    this.buildFuncWithArgs(w,f, args) ;
                    w.newLine();
                }
            }
            //next = "}";
            w.writeRightBracket().newLine();
            w.writeText(`JS_ThrowTypeError(ctx, "arguments value not match");`).newLine();
            w.writeRightBracket().newLine();
        }
       
    }


    protected functionName(f: MethodData) {
        return "js_" + this.data.name + "_" + f.name;
    }

    /**
     * 创建函数定义
     * @param f 
     */
    protected buildGetter(w:Writter, g: GetterData) {
        
        if (g.get) {
            w.writeText("JSValue " + this.getterName(g, true) + "(JSContext* ctx, JSValueConst this_val)").newLine();
            w.writeLeftBracket().newLine();

            let nativeName = this.data.name;
            if (this.data.nativeName) nativeName = this.data.nativeName;
            
            w.writeText(nativeName+" *native = js_to_native_object<"+nativeName+">(ctx, this_val);").newLine();
            w.writeText("auto ret=native->" + g.get + "();").newLine();
            w.writeText("return ").writeText(this.buildReturn(g.type)).newLine();
            w.writeRightBracket().newLine();
        }
        w.newLine();
        if(g.set){
            w.writeText("JSValue " + this.getterName(g, false) + "(JSContext* ctx, JSValueConst this_val, JSValueConst val)").newLine();
            w.writeLeftBracket().newLine();

            let nativeName = this.data.name;
            if (this.data.nativeName) nativeName = this.data.nativeName;
            w.writeText(g.type.getFunc("val",0)).newLine();
            w.writeText(nativeName+" *native = js_to_native_object<"+nativeName+">(ctx, this_val);").newLine();
            w.writeText("native->" + g.set + "(n0);").newLine();
            w.writeText("return JS_UNDEFINED;").newLine();
            w.writeRightBracket().newLine();

        }
        w.newLine();

    }

    protected getterName(g: GetterData, isGetter: boolean) {
        if (isGetter) {
            if (!g.get) return "NULL";
            return "js_" + this.data.name + "_get_" + g.name;
        } else {
            if (!g.set) return "NULL";
            return "js_" + this.data.name + "_set_" + g.name;
        }
    }

    protected ctorName() {
        return "js_" + this.data.name + "_constructor";
    }

    protected classId(){
        return this.data.nativeName+"::GetTypeInfoStatic()->bindingId";
    }

    /**
     * 创建参数的赋值语句 如:int n0=js_toInt32(ctx,obj);
     * @param a 
     * @param idx 
     */
    protected buildArgs(a: ArgData, idx: number) {
        return a.getFunc("argv["+idx+"]",idx);
    }

    protected checkArgs(a: ArgData, idx: number) {
        let ret = a.checkFunc("argv["+idx+"]");
        if (a.ignore) {
            ret = "(argc<=" + idx + "||"+ ret + ")";
        }
        return ret;
    }

    protected buildReturn(returnType: ArgData) {
        return returnType.setFunc();
    }
    /**
     * 创建本地对象new语句
     */
    protected buildNativeCtor(w:Writter) {
        let nativeName = this.data.nativeName;

        //w.writeText("bool isWeak=false;").newLine();
        w.writeText(nativeName + "* native=nullptr;").newLine();
        // w.writeText("duk_push_heap_stash(ctx);//[stash]").newLine();
        // w.writeText("duk_get_prop_string(ctx,-1,jsNewObjWithNative);//[stash,pointer]").newLine();
        // w.writeText("if(duk_is_pointer(ctx,-1))").writeLeftBracket().newLine();
        // w.writeText("native=("+nativeName+" *)duk_get_pointer(ctx,-1);").newLine();
        // w.writeText("duk_get_prop_string(ctx,-2,jsIsWeakObj);//[stash,pointer,isWeak]").newLine();
        // w.writeText("isWeak=duk_to_boolean(ctx,-1);").newLine();
        // w.writeText("duk_pop(ctx);//[stash,pointer]").newLine();
        // w.writeText("duk_push_nan(ctx);//[stash,pointer,nan]").newLine();
        // w.writeText("duk_put_prop_string(ctx,-3,jsNewObjWithNative);//[stash,pointer]").newLine();
        // w.writeText("duk_push_nan(ctx);//[stash,pointer,nan]").newLine();
        // w.writeText("duk_put_prop_string(ctx,-3,jsIsWeakObj);//[stash,pointer]").newLine();
        // w.writeText("duk_pop_2(ctx);//[]").newLine();
        // w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        // w.writeText("duk_pop_2(ctx);//[]").newLine();
        if(this.data.ctor){
            this.buildCtorWithArg(w,this.data.ctor);
            if(this.data.othersCtor){
                for(let args of this.data.othersCtor){
                    w.writeRightBracket().writeText("else ");
                    this.buildCtorWithArg(w,args);
                }
            }
            w.writeRightBracket().newLine();
        }else{
            this.buildCtorFunc(w,undefined);
        }
        w.newLine();
        
    }

    protected buildCtorFunc(w:Writter,args:ArgData[]|undefined){
        let nativeName = this.data.nativeName;
        let ctorFunc = " native=new " + nativeName + "(jsGetContext(ctx)";
        let next = ",";
        let idx = 0;
        if (args) {
            for (let a of args) {
                ctorFunc += next;
                ctorFunc += "n" + idx;
                next = ",";
                idx++;
            }
            next = ");";
            ctorFunc += next;
        } else {
            ctorFunc = `JS_ThrowTypeError(ctx, "obj can not new");`
        }
        w.writeText(ctorFunc).newLine();
    }

    /**带特定参数个数的构造函数 */
    protected buildCtorWithArg(w:Writter,args:ArgData[]){
        //判断函数类型条件语句
        w.writeText("if(");
        let next = "";

        let minCount = args.length;//最少参数个数
        for (let i = args.length - 1; i > 0; i--) {
            if (args[i].ignore) {
                minCount--;
            } else {
                break;
            }
        }
        if (args.length > 0) {
            let idx = 0;
            for (let a of args) {
                w.writeText(next +this.checkArgs(a, idx)).newLine();
                next = "&&";
                idx++;
            }
        } else {
            w.writeText("argc==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc=()=>{
            w.writeText("if(");
        }
        //判断函数个数条件语句
        for (let i = minCount; i <= args.length; i++) {
            nextFunc();
            w.writeText("argc==" + i + ")").writeLeftBracket().newLine();
            for (let j = 0; j < i; j++) {
                let a = args[j];
                w.writeText(this.buildArgs(a, j)).newLine();
            }
           this.buildCtorFunc(w, args.slice(0,i));
           nextFunc=()=>{
               w.writeRightBracket().writeText("else if(")
           }
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText(`JS_ThrowTypeError(ctx, "invalid argument value: ` + args.length + `");`).newLine().writeRightBracket();
        w.newLine();
    }
    /**
     * 创建本地函数调用语句，包括push入栈操作
     * @param f 
     */
    protected buildNativeFunc(w:Writter, f: MethodData, args: ArgData[]) {
        
        if (f.returnType) {
            w.writeText("auto ret=");
        }
        w.writeText("native->" + f.nativeName + "(");
        let next = "";

        let argCount=args.length;
        for (let i = 0; i < argCount; i++) {
            w.writeText(next);
            let ref="";
            if(args[i].ref)ref="*";
            w.writeText(ref+ "n" + i);
            next = ",";
        }
        next = ");";
        w.writeText(next).newLine();
        if (f.returnType) {
            w.writeText("return ").writeText(this.buildReturn(f.returnType)).newLine();
        } else {
            w.writeText("return JS_UNDEFINED;").newLine();
        }
    }


}