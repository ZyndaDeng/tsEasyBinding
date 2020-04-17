"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SysEmitter_1 = require("./SysEmitter");
class ClassEmitter {
    constructor(data, w) {
        this.data = data;
        this.w = w;
    }
    emitDefine() {
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
        this.buildMain(this.w);
        this.w.newLine();
    }
    emitBinding() {
        this.w.writeText(this.apiName() + "(ctx);");
    }
    apiName() {
        return "jsapi_init_" + this.data.name;
    }
    /**
     * 创建对象的绑定主函数
     */
    buildMain(w) {
        w.writeText("void " + this.apiName() + "(duk_context* ctx)").newLine().writeLeftBracket().newLine();
        w.writeText("duk_function_list_entry functions[] = ").newLine().writeLeftBracket().newLine();
        let funcs = new Array();
        let staticFuncs = new Array();
        for (let k in this.data.methods) {
            let f = this.data.methods[k];
            if (f.isStatic) {
                staticFuncs.push(f);
            }
            else {
                funcs.push(f);
            }
        }
        for (let f of funcs) {
            w.writeText("{\"" + f.name + "\"," + this.functionName(f) + ",DUK_VARARGS},").newLine();
        }
        w.writeText("{NULL,NULL}").newLine();
        w.writeRightBracket().writeText(";").newLine();
        if (staticFuncs.length > 0) {
            w.writeText("duk_function_list_entry staticFuncs[] = ").newLine().writeLeftBracket().newLine();
            for (let f of staticFuncs) {
                w.writeText("{\"" + f.name + "\"," + this.functionName(f) + ",DUK_VARARGS},").newLine();
            }
            w.writeText("{NULL,NULL}").newLine();
            w.writeRightBracket().writeText(";").newLine();
        }
        else {
            w.writeText("duk_function_list_entry staticFuncs[] = {{NULL,NULL}};").newLine();
        }
        if (this.data.getters) {
            w.writeText("js_property props[]= ").newLine();
            w.writeLeftBracket().newLine();
            for (let k in this.data.getters) {
                let g = this.data.getters[k];
                w.writeText("{\"" + g.name + "\"," + this.getterName(g, true) + "," + this.getterName(g, false) + "},").newLine();
            }
            w.writeText("{NULL,NULL,NULL}").newLine();
            w.writeRightBracket().writeText(";").newLine();
        }
        else {
            w.writeText("js_property props[]={{NULL,NULL}};").newLine();
        }
        w.writeText("jsb_Class(ctx,\"" + this.data.name + "\",\"" + this.data.extend + "\"," + this.ctorName() + ",functions,staticFuncs,props);").newLine();
        w.writeRightBracket().newLine();
    }
    /**
     * 创建构造函数
     */
    buildCtor() {
        let w = this.w;
        w.writeText("duk_ret_t " + this.ctorName() + "(duk_context *ctx)").newLine();
        w.writeLeftBracket().newLine();
        w.writeText("if (!duk_is_constructor_call(ctx))").writeLeftBracket().newLine();
        w.writeText("return DUK_RET_TYPE_ERROR;").newLine();
        w.writeRightBracket().newLine().newLine();
        w.writeText("int top=duk_get_top(ctx);").newLine();
        w.writeText("duk_push_this(ctx);//[this]").newLine();
        w.writeText("void *ptr = duk_get_heapptr(ctx, -1);").newLine().newLine();
        w.writeText("duk_pop(ctx);//[]").newLine();
        this.buildNativeCtor(w);
        w.newLine();
        w.writeText("duk_push_heapptr(ctx,ptr);//[this]").newLine();
        w.writeText("AddObject(ctx,ptr,native,isWeak);").newLine();
        w.writeText("if(!isWeak)").writeLeftBracket().newLine();
        w.writeText("duk_push_c_function(ctx, default_finalizer, DUK_VARARGS);").newLine();
        w.writeText("duk_set_finalizer(ctx,-2);").newLine();
        w.writeRightBracket().newLine();
        w.writeText("duk_pop(ctx);//[]").newLine();
        w.writeText("return 0;").newLine();
        w.writeRightBracket().newLine().newLine();
    }
    /**
     * 打印本地函数运行语句 并且返回结果
     * @param f
     * @param argCount
     */
    buildRunNetiveFunc(w, f, args) {
        let nativeName = this.data.name;
        if (this.data.nativeName)
            nativeName = this.data.nativeName;
        if (f.isStatic) {
            // let func = "";
            let argsInside = "(";
            let next = "";
            let argCount = args.length;
            for (let i = 0; i < argCount; i++) {
                let ref = "";
                if (args[i].ref)
                    ref = "*";
                argsInside += next + ref + "n" + i;
                next = ",";
            }
            argsInside += ");";
            if (f.returnType) {
                w.writeText("auto ret=" + nativeName + "::" + f.nativeName + argsInside).newLine();
                w.writeText(f.returnType.setFunc()).newLine();
                w.writeText("return 1;").newLine();
            }
            else {
                w.writeText(nativeName + "::" + f.nativeName + argsInside).newLine();
                w.writeText("return 0;").newLine();
            }
        }
        else {
            w.writeText("duk_push_this(ctx);").newLine();
            w.writeText(nativeName + "* native=js_to_native_object<" + nativeName + ">(ctx,-1);").newLine();
            w.writeText("duk_pop(ctx);").newLine();
            this.buildNativeFunc(w, f, args);
            w.newLine();
        }
    }
    /**创建带特定函数的条件语句 */
    buildFuncWithArgs(w, f, args) {
        //判断函数类型条件语句
        w.writeText("if(");
        let next = "";
        let minCount = args.length; //最少参数个数
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].ignore) {
                minCount--;
            }
            else {
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
        }
        else {
            w.writeText("duk_get_top(ctx)==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc = () => {
            w.writeText("if(");
        };
        //判断函数个数条件语句
        for (let i = minCount; i <= args.length; i++) {
            nextFunc();
            w.writeText("duk_get_top(ctx)==" + i + ")").writeLeftBracket().newLine();
            for (let j = 0; j < i; j++) {
                let a = args[j];
                w.writeText(this.buildArgs(a, j)).newLine();
            }
            this.buildRunNetiveFunc(w, f, args.slice(0, i));
            nextFunc = () => {
                w.writeRightBracket().writeText("else if(");
            };
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText(`duk_error(ctx, DUK_ERR_TYPE_ERROR, "invalid argument value: ` + args.length + `");`).newLine().writeRightBracket();
    }
    /**
     * 创建函数定义
     * @param f
     */
    buildFunc(w, f) {
        if (f.customize) {
            w.writeText(SysEmitter_1.customize[f.customize]);
        }
        else {
            w.writeText("duk_ret_t " + this.functionName(f) + "(duk_context *ctx)").newLine();
            w.writeLeftBracket().newLine();
            let next = () => { w.writeText(""); };
            this.buildFuncWithArgs(w, f, f.args);
            w.newLine();
            if (f.othersArgs) {
                next = () => { w.writeRightBracket().writeText("else "); };
                for (let args of f.othersArgs) {
                    next();
                    this.buildFuncWithArgs(w, f, args);
                    w.newLine();
                }
            }
            //next = "}";
            w.writeRightBracket().newLine();
            w.writeText(`duk_error(ctx, DUK_ERR_TYPE_ERROR, "arguments value not match");`).newLine();
            w.writeRightBracket().newLine();
        }
    }
    functionName(f) {
        return "js_" + this.data.name + "_" + f.name;
    }
    /**
     * 创建函数定义
     * @param f
     */
    buildGetter(w, g) {
        if (g.get) {
            w.writeText("duk_ret_t " + this.getterName(g, true) + "(duk_context *ctx)").newLine();
            w.writeLeftBracket().newLine();
            let nativeName = this.data.name;
            if (this.data.nativeName)
                nativeName = this.data.nativeName;
            w.writeText("duk_push_this(ctx);").newLine();
            w.writeText(nativeName + " *native = js_to_native_object<" + nativeName + ">(ctx, -1);").newLine();
            w.writeText("duk_pop(ctx);").newLine().newLine();
            w.writeText("auto ret=native->" + g.get + "();").newLine();
            w.writeText(this.buildReturn(g.type)).newLine();
            w.writeText("return 1;").newLine();
            w.writeRightBracket().newLine();
        }
        w.newLine();
        if (g.set) {
            w.writeText("duk_ret_t " + this.getterName(g, false) + "(duk_context *ctx)").newLine();
            w.writeLeftBracket().newLine();
            let nativeName = this.data.name;
            if (this.data.nativeName)
                nativeName = this.data.nativeName;
            w.writeText(g.type.getFunc(0)).newLine();
            w.writeText("duk_push_this(ctx);").newLine();
            w.writeText(nativeName + " *native = js_to_native_object<" + nativeName + ">(ctx, -1);").newLine();
            w.writeText("duk_pop(ctx);").newLine().newLine();
            w.writeText("native->" + g.set + "(n0);").newLine();
            w.writeText("return 0;").newLine();
            w.writeRightBracket().newLine();
        }
        w.newLine();
    }
    getterName(g, isGetter) {
        if (isGetter) {
            if (!g.get)
                return "NULL";
            return "js_" + this.data.name + "_get_" + g.name;
        }
        else {
            if (!g.set)
                return "NULL";
            return "js_" + this.data.name + "_set_" + g.name;
        }
    }
    ctorName() {
        return "js_" + this.data.name + "_constructor";
    }
    /**
     * 创建参数的赋值语句 如:int n0=duk_require_int(ctx,0);
     * @param a
     * @param idx
     */
    buildArgs(a, idx) {
        return a.getFunc(idx);
    }
    checkArgs(a, idx) {
        let ret = a.checkFunc(idx);
        if (a.ignore) {
            ret = "(" + ret + "||!duk_is_valid_index(ctx," + idx + "))";
        }
        return ret;
    }
    buildReturn(returnType) {
        return returnType.setFunc();
    }
    /**
     * 创建本地对象new语句
     */
    buildNativeCtor(w) {
        let nativeName = this.data.nativeName;
        w.writeText("bool isWeak=false;").newLine();
        w.writeText(nativeName + "* native=nullptr;").newLine();
        w.writeText("duk_push_heap_stash(ctx);//[stash]").newLine();
        w.writeText("duk_get_prop_string(ctx,-1,jsNewObjWithNative);//[stash,pointer]").newLine();
        w.writeText("if(duk_is_pointer(ctx,-1))").writeLeftBracket().newLine();
        w.writeText("native=(" + nativeName + " *)duk_get_pointer(ctx,-1);").newLine();
        w.writeText("duk_get_prop_string(ctx,-2,jsIsWeakObj);//[stash,pointer,isWeak]").newLine();
        w.writeText("isWeak=duk_to_boolean(ctx,-1);").newLine();
        w.writeText("duk_pop(ctx);//[stash,pointer]").newLine();
        w.writeText("duk_push_nan(ctx);//[stash,pointer,nan]").newLine();
        w.writeText("duk_put_prop_string(ctx,-3,jsNewObjWithNative);//[stash,pointer]").newLine();
        w.writeText("duk_push_nan(ctx);//[stash,pointer,nan]").newLine();
        w.writeText("duk_put_prop_string(ctx,-3,jsIsWeakObj);//[stash,pointer]").newLine();
        w.writeText("duk_pop_2(ctx);//[]").newLine();
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText("duk_pop_2(ctx);//[]").newLine();
        if (this.data.ctor) {
            this.buildCtorWithArg(w, this.data.ctor);
            if (this.data.othersCtor) {
                for (let args of this.data.othersCtor) {
                    w.writeRightBracket().writeText("else ");
                    this.buildCtorWithArg(w, args);
                }
            }
            w.writeRightBracket().newLine();
        }
        else {
            this.buildCtorFunc(w, undefined);
        }
        w.newLine();
        w.writeRightBracket().newLine();
        w.newLine();
    }
    buildCtorFunc(w, args) {
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
        }
        else {
            ctorFunc = `duk_error(ctx, DUK_ERR_TYPE_ERROR, "obj can not new");`;
        }
        w.writeText(ctorFunc).newLine();
    }
    /**带特定参数个数的构造函数 */
    buildCtorWithArg(w, args) {
        //判断函数类型条件语句
        w.writeText("if(");
        let next = "";
        let minCount = args.length; //最少参数个数
        for (let i = args.length - 1; i > 0; i--) {
            if (args[i].ignore) {
                minCount--;
            }
            else {
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
        }
        else {
            w.writeText("top==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc = () => {
            w.writeText("if(");
        };
        //判断函数个数条件语句
        for (let i = minCount; i <= args.length; i++) {
            nextFunc();
            w.writeText("top==" + i + ")").writeLeftBracket().newLine();
            for (let j = 0; j < i; j++) {
                let a = args[j];
                w.writeText(this.buildArgs(a, j)).newLine();
            }
            this.buildCtorFunc(w, args.slice(0, i));
            nextFunc = () => {
                w.writeRightBracket().writeText("else if(");
            };
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText(`duk_error(ctx, DUK_ERR_TYPE_ERROR, "invalid argument value: ` + args.length + `");`).newLine().writeRightBracket();
        w.newLine();
    }
    /**
     * 创建本地函数调用语句，包括push入栈操作
     * @param f
     */
    buildNativeFunc(w, f, args) {
        if (f.returnType) {
            w.writeText("auto ret=");
        }
        w.writeText("native->" + f.nativeName + "(");
        let next = "";
        let argCount = args.length;
        for (let i = 0; i < argCount; i++) {
            w.writeText(next);
            let ref = "";
            if (args[i].ref)
                ref = "*";
            w.writeText(ref + "n" + i);
            next = ",";
        }
        next = ");";
        w.writeText(next).newLine();
        if (f.returnType) {
            w.writeText(this.buildReturn(f.returnType)).newLine();
            w.writeText("return 1;").newLine();
        }
        else {
            w.writeText("return 0;").newLine();
        }
    }
}
exports.ClassEmitter = ClassEmitter;
//# sourceMappingURL=ClassEmitter.js.map