
import { ArgData } from "../../ArgDatas";
import { Emitter, IExport } from "../Emitter";
import { Writter } from "../../writter";
import { customize } from "../SysEmitter";
import { JSBClass, MethodData, GetterData } from "../../binding/JSBClass";



export class ClassEmitter implements Emitter {


    protected getExtendName(){
        if(this.data.extend.length>0){
            return "\""+this.data.extend+"\""
        }
        return "nullptr";
    }

    emitDefine(): void {

        this.w.newLine();
        this.buildCtor();
        this.w.newLine();
        for (let k in this.data.methods) {
            let f = this.data.methods[k];
            this.buildFunc(this.w, f);
            this.w.newLine().newLine();
        }
        for (let k in this.data.getters) {
            let g = this.data.getters[k];
            this.buildGetter(this.w, g);
        }
        this.w.newLine();
       
        this.w.newLine();
        this.buildMain(this.w);
        this.w.newLine();

    }
    emitBinding(): void {
        //this.w.writeText(this.apiName()+"(ctx);");
    }

    setExport(exp: IExport): void {
        exp.export(this.data.name, this.apiName() + "(ctx)");
    }

    protected hasOpr:boolean;
    constructor(protected data: JSBClass, protected w: Writter) {
        this.hasOpr=false;
    }


    apiName() {
        return "jsapi_init_" + this.data.name;
    }
    /**
     * 创建对象的绑定主函数
     */
    protected buildMain(w: Writter) {
        w.writeText("static v8::Local<v8::Value> " + this.apiName() + "(V8JS::JSContext* ctx)").newLine().writeLeftBracket().newLine();

        let extendName=this.getExtendName();
        w.writeText("V8JS::JSClass c(ctx,\"" + this.data.name + "\"," + this.ctorName() + "," + extendName + ");").newLine();
       
        for(let k in this.data.methods){
            let f=this.data.methods[k];
            let func="setMember"
            if(f.isStatic)func="setStaticMember"
            w.writeText("c."+func+"(\""+f.name+"\","+ this.functionName(f)+");").newLine();
                
        }
        for(let k in this.data.getters){
            let g=this.data.getters[k];
            let func="setMember"
            if(g.isStatic)func="setStaticMember"
            w.writeText("c."+func+"(\"" + g.name + "\"," + this.getterName(g, true) + "," + this.getterName(g, false) + ");").newLine();
        }
       // if(this.hasOpr)w.writeText("ctx.setDefOpr(c.prototype);").newLine();
       w.writeText("return c.ctor->GetFunction(ctx->getCtx()).ToLocalChecked();").newLine();
        w.writeRightBracket().newLine();

    }

    // protected buildFinalizer() {
    //     let w = this.w;
    //     w.writeText("static void " + this.finalizerName() + "(JSRuntime* rt, JSValue val)").newLine();
    //     w.writeLeftBracket().newLine();
    //     w.writeText(this.data.nativeName + "* native=(" + this.data.nativeName + "*) JS_GetOpaque(val, " + this.data.classId + ");");
    //     w.writeText("delete native;").newLine();

    //     w.writeRightBracket().newLine().newLine();
    // }

    /**
     * 创建构造函数
     */
    protected buildCtor() {
        let w = this.w;
        w.writeText("static void " + this.ctorName() + "(const v8::FunctionCallbackInfo<v8::Value>& args)").newLine();
        w.writeLeftBracket().newLine();

        this.buildNativeCtor(w);
        w.newLine();
        w.writeText("if(native)").writeLeftBracket().newLine();
        w.writeText("auto self=args.This();").newLine();
        w.writeText("self->SetAlignedPointerInInternalField(0, native);").newLine();
        w.writeText("auto ref = new V8Ref(native, isolate, self);").newLine();
     
        w.writeRightBracket().newLine();
       
        w.writeRightBracket().newLine().newLine();
    }

    /**
     * 打印本地函数运行语句 并且返回结果
     * @param f 
     * @param argCount 
     */
    protected buildRunNetiveFunc(w: Writter, f: MethodData, args: ArgData[],returnType:ArgData|undefined) {
        let nativeName = this.data.name;
        if (this.data.nativeName) nativeName = this.data.nativeName;
        if (f.isStatic) {
            // let func = "";
            let argsInside = "(";
            let next = "";
            let argCount = args.length;
            for (let i = 0; i < argCount; i++) {
                let ref = "";
                if (args[i].ref) ref = "*";
                argsInside += next + ref + "n" + i;
                next = ","
            }
            argsInside += ");";
            if (returnType) {
                w.writeText("auto ret=" + nativeName + "::" + f.nativeName + argsInside).newLine();
                w.writeText("args.GetReturnValue().Set(").writeText(returnType.setFunc()).writeText(")").newLine();
                w.writeText("return; ");
               // w.writeText("return ").writeText(returnType.setFunc()).newLine();
            } else {
                w.writeText(nativeName + "::" + f.nativeName + argsInside).newLine();
                w.writeText("return; ");
                //w.writeText("return JS_UNDEFINED;").newLine();
            }
        } else {
            w.writeText(nativeName + "* native=static_cast<" + nativeName + "*>(args.This()->GetAlignedPointerFromInternalField(0));").newLine();
            this.buildNativeFunc(w, f, args,returnType);
            w.newLine();
        }
    }

   

    /**创建带特定函数的条件语句 */
    protected buildFuncWithArgs(w: Writter, f: MethodData, args: ArgData[],returnType:ArgData|undefined) {

        let minCount = args.length;//最少参数个数
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].ignore) {
                minCount--;
            } else {
                break;
            }
        }
        
        w.writeText("auto argc=args.Length();").newLine();
        w.writeText("if(argc>="+minCount+"");
        let next = "&&";
        if (args.length > 0) {
            let idx = 0;
            for (let a of args) {
                w.writeText(next + this.checkArgs(a, idx)).newLine();
                next = "&&";
                idx++;
            }
        } else {
            //w.writeText("argc==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc = () => {
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
            this.buildRunNetiveFunc(w, f, args.slice(0, i),returnType);
            nextFunc = () => {
                w.writeRightBracket().writeText("else if(")
            }
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText( `JS_ThrowTypeError(ctx, "`+this.functionName(f)+` invalid argument value: ` + args.length + `");`).newLine().writeRightBracket();
    }

    /**
     * 创建函数定义
     * @param f 
     */
    protected buildFunc(w: Writter, f: MethodData) {
        if (f.customize) {
            w.writeText(customize[f.customize]);
        } else {
            w.writeText("static void " + this.functionName(f) + "(const v8::FunctionCallbackInfo<v8::Value>& args)").newLine();
            w.writeLeftBracket().newLine();

            let next = () => { w.writeText("") }
            this.writeV8BaseArg(w);
            this.buildFuncWithArgs(w, f, f.args,f.returnType);
            w.newLine();
            if (f.override) {
                next = () => { w.writeRightBracket().writeText("else "); }
                for (let args of f.override) {
                    next();
                    this.buildFuncWithArgs(w, f, args.args,args.returnType);
                    w.newLine();
                }
            }
            //next = "}";
            w.writeRightBracket().newLine();
            w.writeText( `JS_ThrowTypeError(ctx, "`+this.functionName(f)+` arguments value not match");`).newLine();
           // w.writeText(" return JS_UNDEFINED;").newLine();
            w.writeRightBracket().newLine();
        }

    }

    


    protected functionName(f: MethodData) {
        return "js_" + this.data.name + "_" + f.name;
    }

    /**
     * 创建访问器定义
     * @param f 
     */
    protected buildGetter(w: Writter, g: GetterData) {

        if (g.get) {
            w.writeText("static void " + this.getterName(g, true) + "(v8::Local<v8::String> property, const v8::PropertyCallbackInfo<v8::Value>& args)").newLine();
            w.writeLeftBracket().newLine();

            this.writeV8BaseArg(w);
            let nativeName = this.data.name;
            if (this.data.nativeName) nativeName = this.data.nativeName;
            let nameEnd = "()";
            if (!g.get.isFunc) {
                nameEnd = ""
            }
            if (g.isStatic) {
                w.writeText("auto ret=" + nativeName + "::" + g.get.name + nameEnd + ";").newLine();
                w.writeText("args.GetReturnValue().Set(").writeText(this.buildReturn(g.type)).writeText(")").newLine();
                w.writeRightBracket().newLine();
            } else {
                w.writeText(nativeName + "* native=static_cast<" + nativeName + "*>(args.This()->GetAlignedPointerFromInternalField(0));").newLine();
                w.writeText("auto ret=native->" + g.get.name + nameEnd + ";").newLine();
                w.writeText("args.GetReturnValue().Set(").writeText(this.buildReturn(g.type)).writeText(");").newLine();
                w.writeRightBracket().newLine();
            }
        }
        w.newLine();
        if (g.set) {
            w.writeText("static void " + this.getterName(g, false) + "(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::PropertyCallbackInfo<void>& args)").newLine();
            w.writeLeftBracket().newLine();
            this.writeV8BaseArg(w);

            let nativeName = this.data.name;
            if (this.data.nativeName) nativeName = this.data.nativeName;
            w.writeText(g.type.getFunc("value", 0)).newLine();
            if(g.isStatic){
                if (g.set.isFunc) w.writeText(nativeName+"::" + g.set.name + "(n0);").newLine();
                else w.writeText(nativeName+"::"  + g.set.name + "=n0;").newLine();
                //w.writeText("return JS_UNDEFINED;").newLine();
                w.writeRightBracket().newLine();
            }else{
                w.writeText(nativeName + "* native=static_cast<" + nativeName + "*>(args.This()->GetAlignedPointerFromInternalField(0));").newLine();
                if (g.set.isFunc) w.writeText("native->" + g.set.name + "(n0);").newLine();
                else w.writeText("native->" + g.set.name + "=n0;").newLine();
                //w.writeText("return JS_UNDEFINED;").newLine();
                w.writeRightBracket().newLine();
            }
           

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

    // protected finalizerName(){
    //     return "js_" + this.data.name + "_finalizer";
    // }

    // protected classId() {
    //     if(this.data.finalizer=="default_finalizer")
    //         return this.data.nativeName + "::GetTypeInfoStatic()->bindingId";
    //     return "js_"+this.data.nativeName+"_id";
    //     return 
    // }

    /**
     * 创建参数的赋值语句 如:int n0=js_toInt32(ctx,obj);
     * @param a 
     * @param idx 
     */
    protected buildArgs(a: ArgData, idx: number) {
        return a.getFunc("args[" + idx + "]", idx);
    }

    protected checkArgs(a: ArgData, idx: number) {
        let ret = a.checkFunc("args[" + idx + "]");
        if (a.ignore) {
            ret = "(args.Length()<=" + idx + "||" + ret + ")";
        }
        return ret;
    }

    protected buildReturn(returnType: ArgData) {
        return returnType.setFunc();
    }

    protected writeV8BaseArg(w:Writter){
        w.writeText("auto isolate = args.GetIsolate();").newLine();
        w.writeText("auto context = isolate->GetCurrentContext();").newLine();
        w.writeText("auto ctx = JS_GetContext(context);").newLine();
    }
    /**
     * 创建本地对象new语句
     */
    protected buildNativeCtor(w: Writter) {
        let nativeName = this.data.nativeName;

        this.writeV8BaseArg(w);
        w.writeText(nativeName + "* native=nullptr;").newLine();
        if (this.data.ctor) {
            w.writeText("auto argc=args.Length();").newLine();
            this.buildCtorWithArg(w, this.data.ctor);
            if (this.data.othersCtor) {
                for (let args of this.data.othersCtor) {
                    w.writeRightBracket().writeText("else ");
                    this.buildCtorWithArg(w, args);
                }
            }
            w.writeRightBracket().newLine();
        } else {
            this.buildCtorFunc(w, undefined);
        }
        w.newLine();

    }

    static IsUrho3d:boolean;

    protected buildCtorFunc(w: Writter, args: ArgData[] | undefined) {
        let nativeName = this.data.nativeName;
        let ctorFunc = " native=new " + nativeName + "(";
        let next = "";
        if(this.data.finalizer!="default_finalizer"){
            ctorFunc=" native=new " + nativeName + "(";
            next = "";
        }else if(ClassEmitter.IsUrho3d){
            ctorFunc=" native=new " + nativeName + "(jsGetContext(ctx)";
            next = ",";
        }
        
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
            ctorFunc =  `JS_ThrowTypeError(ctx, "`+this.ctorName()+` obj can not new");`
        }
        w.writeText(ctorFunc).newLine();
    }

    /**带特定参数个数的构造函数 */
    protected buildCtorWithArg(w: Writter, args: ArgData[]) {
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
                w.writeText(next + this.checkArgs(a, idx)).newLine();
                next = "&&";
                idx++;
            }
        } else {
            w.writeText("argc==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc = () => {
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
            this.buildCtorFunc(w, args.slice(0, i));
            nextFunc = () => {
                w.writeRightBracket().writeText("else if(")
            }
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText(`JS_ThrowTypeError(ctx, "`+this.ctorName()+` invalid argument value: ` + args.length + `");`).newLine().writeRightBracket();
        w.newLine();
    }
    /**
     * 创建本地函数调用语句，包括push入栈操作
     * @param f 
     */
    protected buildNativeFunc(w: Writter, f: MethodData, args: ArgData[],returnType:ArgData|undefined) {

        if (returnType) {
            w.writeText("auto ret=");
        }
        if(!this.buildOprFunc(w,f)){
        w.writeText("native->" + f.nativeName + "(");
        let next = "";

        let argCount = args.length;
        for (let i = 0; i < argCount; i++) {
            w.writeText(next);
            let ref = "";
            if (args[i].ref) ref = "*";
            w.writeText(ref + "n" + i);
            next = ",";
        }
        next = ");";
        w.writeText(next).newLine();
    }else{
        this.hasOpr=true;
    }
        if (returnType) {
            w.writeText("args.GetReturnValue().Set(").writeText(this.buildReturn(returnType)).writeText(");").newLine();
            w.writeText("return; ");
           // w.writeText("return ").writeText(this.buildReturn(returnType)).newLine();
        } else {
            w.writeText("return; ");
           // w.writeText("return JS_UNDEFINED;").newLine();
        }
    }

    protected buildOprFunc(w: Writter, f: MethodData) {
        let ret=false;
        
        let oprMaps:{[k:string]:string}={
            ["oprAdd"]:"+",
            ["oprSub"]:"-",
            ["oprMult"]:"*",
            ["oprDiv"]:"/",
            ["oprAddTo"]:"+=",
            ["oprSubTo"]:"-=",
            ["oprMultTo"]:"*=",
            ["oprDivTo"]:"/=",
        }
        ret=oprMaps[f.name]!=undefined;
        if(ret){
           let op=oprMaps[f.name];
           w.writeText("*native" + op + "n0;").newLine();
        }
        return ret;
    }


}