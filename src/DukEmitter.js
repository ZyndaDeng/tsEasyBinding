"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enter = "\n";
const tab = "\t";
class DukEmitter {
    constructor(data) {
        this.data = data;
    }
    buildCpp() {
        let ret = "";
        // ret += "#include <JavaScript/toJs.h>" + enter;
        // ret += "using namespace Urho3D;" + enter;
        ret += enter;
        ret += this.buildCtor() + enter;
        ret += enter;
        for (let k in this.data.methods) {
            let f = this.data.methods[k];
            ret += this.buildFunc(f) + enter;
            ret += enter;
        }
        for (let k in this.data.getters) {
            let g = this.data.getters[k];
            ret += this.buildGetter(g);
        }
        ret += enter;
        ret += this.buildMain() + enter;
        return ret;
    }
    apiName() {
        return "jsapi_init_" + this.data.name;
    }
    /**
     * 创建对象的绑定主函数
     */
    buildMain() {
        let ret = "void " + this.apiName() + "(duk_context* ctx)" + enter;
        ret += "{" + enter;
        ret += tab + "duk_function_list_entry functions[] = " + enter;
        ret += tab + "{" + enter;
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
            ret += tab + tab + "{\"" + f.name + "\"," + this.functionName(f) + ",DUK_VARARGS}," + enter;
        }
        ret += tab + tab + "{NULL,NULL}" + enter;
        ret += tab + "};" + enter;
        if (staticFuncs.length > 0) {
            ret += tab + "duk_function_list_entry staticFuncs[] = " + enter;
            ret += tab + "{" + enter;
            for (let f of staticFuncs) {
                ret += tab + tab + "{\"" + f.name + "\"," + this.functionName(f) + ",DUK_VARARGS}," + enter;
            }
            ret += tab + tab + "{NULL,NULL}" + enter;
            ret += tab + "};" + enter;
        }
        else {
            ret += tab + "duk_function_list_entry staticFuncs[] = {{NULL,NULL}};" + enter;
        }
        if (this.data.getters) {
            ret += tab + "js_property props[]= " + enter;
            ret += tab + "{" + enter;
            for (let k in this.data.getters) {
                let g = this.data.getters[k];
                ret += tab + tab + "{\"" + g.name + "\"," + this.getterName(g, true) + "," + this.getterName(g, false) + "}," + enter;
            }
            ret += tab + tab + "{NULL,NULL,NULL}" + enter;
            ret += tab + "};" + enter;
        }
        else {
            ret += tab + "js_property props[]={{NULL,NULL}};" + enter;
        }
        ret += tab + "jsInitClass(ctx,\"" + this.data.name + "\",\"" + this.data.extend + "\"," + this.ctorName() + ",functions,staticFuncs,props);" + enter;
        ret += "}" + enter;
        return ret;
    }
    /**
     * 创建构造函数
     */
    buildCtor() {
        let ret = "duk_ret_t " + this.ctorName() + "(duk_context *ctx)" + enter;
        ret += "{" + enter;
        ret += ` 
            if (!duk_is_constructor_call(ctx)) {
                return DUK_RET_TYPE_ERROR;
            }
    
            /* Get access to the default instance. */
            duk_push_this(ctx);  /* -> stack: [  this ] */
            void *ptr = duk_get_heapptr(ctx, -1);
    
            `;
        let idx = 0;
        if (this.data.ctor) {
            for (let a of this.data.ctor) {
                ret += tab + this.buildArgs(a, idx) + enter;
                idx++;
            }
        }
        ret += this.buildNativeCtor() + enter;
        ret += `         AddObject(ptr,native);
            duk_push_c_function(ctx, RefCounted_finalizer, DUK_VARARGS);
            duk_set_finalizer(ctx,-2);
            duk_pop(ctx);
            /* Return undefined: default instance will be used. */
            return 0;
    }`;
        return ret;
    }
    /**
     * 打印本地函数运行语句 并且返回结果
     * @param f
     * @param argCount
     */
    buildRunNetiveFunc(f, args) {
        let ret = "";
        let nativeName = this.data.name;
        if (this.data.nativeName)
            nativeName = this.data.nativeName;
        if (f.isStatic) {
            let func = "";
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
                func = "auto ret=" + nativeName + "::" + f.name + argsInside + enter;
                func += tab + tab + f.returnType.setFunc() + enter;
                func += tab + tab + "return 1;";
            }
            else {
                func = nativeName + "::" + f.name + argsInside + enter;
                func += tab + tab + "return 0;";
            }
            ret += func + enter;
        }
        else {
            ret += `duk_push_this(ctx);  /* -> stack: [  this ] */` + enter;
            ret += nativeName + "* native=js_to_native_object<" + nativeName + ">(ctx,-1);" + enter;
            ret += tab + tab + "duk_pop(ctx);//[]" + enter;
            ret += this.buildNativeFunc(f, args) + enter;
        }
        return ret;
    }
    /**创建带特点函数的条件语句 */
    buildFuncWithArgs(f, args) {
        //判断函数类型条件语句
        let ret = "if(";
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
                ret += tab + next + this.checkArgs(a, idx) + enter;
                next = "&&";
                idx++;
            }
        }
        else {
            ret += "duk_get_top(ctx)==0";
        }
        ret += "){" + enter;
        next = "if(";
        //判断函数个数条件语句
        for (let i = minCount; i <= args.length; i++) {
            ret += next + "duk_get_top(ctx)==" + i + "){" + enter;
            for (let j = 0; j < i; j++) {
                let a = args[j];
                ret += tab + this.buildArgs(a, j) + enter;
            }
            ret += this.buildRunNetiveFunc(f, args.slice(0, i));
            next = "}else if(";
        }
        next = "}else{";
        ret += next + enter;
        ret += `duk_error(ctx, DUK_ERR_TYPE_ERROR, "invalid argument value: ` + args.length + `");` + enter;
        ret += "}";
        return ret;
    }
    /**
     * 创建函数定义
     * @param f
     */
    buildFunc(f) {
        let ret = "duk_ret_t " + this.functionName(f) + "(duk_context *ctx)" + enter;
        ret += "{" + enter;
        let next = "";
        ret += this.buildFuncWithArgs(f, f.args) + enter;
        if (f.othersArgs) {
            next = "}else ";
            for (let args of f.othersArgs) {
                ret += next + this.buildFuncWithArgs(f, args) + enter;
            }
        }
        next = "}";
        ret += next + enter;
        ret += `duk_error(ctx, DUK_ERR_TYPE_ERROR, "arguments value not match");` + enter;
        ret += "}" + enter;
        return ret;
    }
    functionName(f) {
        return "js_" + this.data.name + "_" + f.name;
    }
    /**
     * 创建函数定义
     * @param f
     */
    buildGetter(g) {
        let ret = "";
        if (g.get) {
            ret += "duk_ret_t " + this.getterName(g, true) + "(duk_context *ctx)" + enter;
            ret += "{" + enter;
            let nativeName = this.data.name;
            if (this.data.nativeName)
                nativeName = this.data.nativeName;
            ret += `duk_push_this(ctx); /* -> stack: [  this ] */
			` + nativeName + ` *native = js_to_native_object<` + nativeName + `>(ctx, -1);
            duk_pop(ctx); //[]
            `;
            ret += "auto ret=native->" + g.get + "();" + enter;
            ret += tab + tab + this.buildReturn(g.type) + enter;
            ret += tab + tab + "return 1;";
            ret += "}" + enter;
        }
        ret += enter;
        if (g.set) {
            ret += "duk_ret_t " + this.getterName(g, false) + "(duk_context *ctx)" + enter;
            ret += "{" + enter;
            let nativeName = this.data.name;
            if (this.data.nativeName)
                nativeName = this.data.nativeName;
            ret += g.type.getFunc(0) + enter;
            ret += `duk_push_this(ctx); /* -> stack: [  this ] */
			` + nativeName + ` *native = js_to_native_object<` + nativeName + `>(ctx, -1);
            duk_pop(ctx); //[]
            `;
            ret += "native->" + g.set + "(n0);" + enter;
            ret += tab + tab + "return 0;";
            ret += "}" + enter;
        }
        ret += enter;
        return ret;
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
    buildNativeCtor() {
        let nativeName = this.data.name;
        if (this.data.nativeName)
            nativeName = this.data.nativeName;
        let ctorFunc = " native=new " + nativeName + "(jsGetContext(ctx)";
        let next = ",";
        let idx = 0;
        if (this.data.ctor) {
            for (let a of this.data.ctor) {
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
        let ret = nativeName + `* native=nullptr;
            duk_push_heap_stash(ctx);//[this ,stash]
            duk_get_prop_string(ctx,-1,jsNewObjWithNative);//[this ,stash,pointer]
            if(duk_is_pointer(ctx,-1)){
                native=(` + nativeName + `*)duk_get_pointer(ctx,-1);
                duk_push_nan(ctx);//[this ,stash,pointer,nan]
                duk_put_prop_string(ctx,-3,jsNewObjWithNative);//[this ,stash,pointer]
            }else{
                ` + ctorFunc + `
            }
            duk_pop_n(ctx,2);//[this]
            `;
        return ret;
    }
    /**
     * 创建本地函数调用语句，包括push入栈操作
     * @param f
     */
    buildNativeFunc(f, args) {
        let ret = tab + tab + "";
        if (f.returnType) {
            ret += "auto ret=";
        }
        ret += "native->" + f.name + "(";
        let next = "";
        let argCount = args.length;
        for (let i = 0; i < argCount; i++) {
            ret += next;
            let ref = "";
            if (args[i].ref)
                ref = "*";
            ret += ref + "n" + i;
            next = ",";
        }
        next = ");";
        ret += next + enter;
        if (f.returnType) {
            ret += tab + tab + this.buildReturn(f.returnType) + enter;
            ret += tab + tab + "return 1;";
        }
        else {
            ret += tab + tab + "return 0;";
        }
        return ret;
    }
}
exports.DukEmitter = DukEmitter;
//# sourceMappingURL=DukEmitter.js.map