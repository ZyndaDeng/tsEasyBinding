"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FuncEmitter {
    constructor(data, writter) {
        this.data = data;
        this.w = writter;
    }
    checkArgs(a, idx) {
        let ret = a.checkFunc("argv[" + idx + "]");
        if (a.ignore) {
            ret = "(argc<=" + idx + "||" + ret + ")";
        }
        return ret;
    }
    emitDefine() {
        let w = this.w;
        w.writeText("JSValue " + this.name() + "(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)").writeLeftBracket().newLine();
        this.buildFuncWithArgs(w);
        // let next = "";
        // if (this.data.args.length > 0) {
        //     w.writeText("if(").newLine();
        //     for (let i = 0; i < this.data.args.length; i++) {
        //         let a = this.data.args[i];
        //         w.writeText(next + this.checkArgs(a,i)).newLine();
        //         next = "&&";
        //     }
        //     w.writeText(")").writeLeftBracket().newLine();
        // }
        // let argsInside = "("
        // next = "";
        // for (let i = 0; i < this.data.args.length; i++) {
        //     let a = this.data.args[i];
        //     w.writeText(a.getFunc("argv["+i+"]",i)).newLine();
        //     argsInside += next + "n" + i;
        //     next = ",";
        // }
        // argsInside += ")";
        // if (this.data.returnType) {
        //     w.writeText("auto ret=" + this.data.name + argsInside + ";").newLine();
        //     w.writeText("return ").writeText(this.data.returnType.setFunc()).newLine();
        // } else {
        //     w.writeText(this.data.name + argsInside + ";").newLine();
        //     w.writeText("return JS_UNDEFINED;");
        // }
        // if (this.data.args.length > 0) {
        //     w.newLine().writeRightBracket().newLine();
        // }else{
        //     w.newLine();
        // }
        // w.writeText( `JS_ThrowTypeError(ctx, "`+this.name()+` invalid argument value: ` + this.data.args.length + `");`).newLine();
        // w.writeText("return JS_UNDEFINED;").newLine();
        w.newLine().writeRightBracket().newLine().newLine();
    }
    emitBinding() {
        //this.w.writeText("ctx.newFunc(" + this.name() + ",\"" + this.data.name + "\");");
    }
    /**创建带特定函数的条件语句 */
    buildFuncWithArgs(w) {
        let minCount = this.data.args.length; //最少参数个数
        for (let i = this.data.args.length - 1; i >= 0; i--) {
            if (this.data.args[i].ignore) {
                minCount--;
            }
            else {
                break;
            }
        }
        w.writeText("if(argc>=" + minCount + "");
        let next = "&&";
        if (this.data.args.length > 0) {
            let idx = 0;
            for (let a of this.data.args) {
                w.writeText(next + this.checkArgs(a, idx)).newLine();
                next = "&&";
                idx++;
            }
        }
        else {
            //w.writeText("argc==0");
        }
        w.writeText(")").writeLeftBracket().newLine();
        let nextFunc = () => {
            w.writeText("if(");
        };
        //判断函数个数条件语句
        for (let i = minCount; i <= this.data.args.length; i++) {
            nextFunc();
            w.writeText("argc==" + i + ")").writeLeftBracket().newLine();
            for (let j = 0; j < i; j++) {
                let a = this.data.args[j];
                w.writeText(this.buildArgs(a, j)).newLine();
            }
            this.buildRunNetiveFunc(w, this.data.args.slice(0, i), this.data.returnType);
            nextFunc = () => {
                w.writeRightBracket().writeText("else if(");
            };
        }
        w.writeRightBracket().writeText("else").writeLeftBracket().newLine();
        w.writeText(`JS_ThrowTypeError(ctx, "` + this.name() + ` invalid argument value: ` + this.data.args.length + `");`).newLine();
        w.writeText(" return JS_UNDEFINED;").newLine().writeRightBracket().newLine().writeRightBracket();
    }
    /**
     * 创建参数的赋值语句 如:int n0=js_toInt32(ctx,obj);
     * @param a
     * @param idx
     */
    buildArgs(a, idx) {
        return a.getFunc("argv[" + idx + "]", idx);
    }
    /**
     * 打印本地函数运行语句 并且返回结果
     * @param f
     * @param argCount
     */
    buildRunNetiveFunc(w, args, returnType) {
        let nativeName = this.data.name;
        //if (this.data.nativeName) nativeName = this.data.nativeName;
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
        if (returnType) {
            w.writeText("auto ret=" + nativeName + argsInside).newLine();
            w.writeText("return ").writeText(returnType.setFunc()).newLine();
        }
        else {
            w.writeText(nativeName + argsInside).newLine();
            w.writeText("return JS_UNDEFINED;").newLine();
        }
    }
    name() {
        return "js_func_" + this.data.name;
    }
    setExport(exp) {
        exp.export(this.data.name, "ctx.newFunc(" + this.name() + ",\"" + this.data.name + "\")");
    }
}
exports.FuncEmitter = FuncEmitter;
//# sourceMappingURL=FuncEmitter.js.map