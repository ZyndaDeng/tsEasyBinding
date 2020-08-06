import * as ts from "typescript"
import { buildArgData, ArgData } from "../ArgDatas";
import { Writter } from "../writter";
import { Emitter, IExport } from "./Emitter";
import { JSBFunction } from "../binding/JSBFunction";

export class FuncEmitter implements Emitter {
   
    protected w: Writter;

    constructor(protected data: JSBFunction, writter: Writter) {
        this.w = writter;
    }

    protected checkArgs(a: ArgData, idx: number) {
        let ret = a.checkFunc("argv[" + idx + "]");
        if (a.ignore) {
            ret = "(argc<=" + idx + "||" + ret + ")";
        }
        return ret;
    }

    emitDefine(): void {
        let w = this.w;
        w.writeText("JSValue " + this.name() + "(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)").writeLeftBracket().newLine();
        let next = "";
        if (this.data.args.length > 0) {
            w.writeText("if(").newLine();

            for (let i = 0; i < this.data.args.length; i++) {
                let a = this.data.args[i];
                w.writeText(next + this.checkArgs(a,i)).newLine();
                next = "&&";
            }
            w.writeText(")").writeLeftBracket().newLine();
        }

        let argsInside = "("
        next = "";
        for (let i = 0; i < this.data.args.length; i++) {
            let a = this.data.args[i];
            w.writeText(a.getFunc("argv["+i+"]",i)).newLine();
            argsInside += next + "n" + i;
            next = ",";
        }
        argsInside += ")";
        if (this.data.returnType) {
            w.writeText("auto ret=" + this.data.name + argsInside + ";").newLine();
            w.writeText("return ").writeText(this.data.returnType.setFunc()).newLine();
        } else {
            w.writeText(this.data.name + argsInside + ";").newLine();
            w.writeText("return JS_UNDEFINED;");
        }
        if (this.data.args.length > 0) {
            w.newLine().writeRightBracket().newLine();
        }else{
            w.newLine();
        }
        w.writeText( `JS_ThrowTypeError(ctx, "`+this.name()+` invalid argument value: ` + this.data.args.length + `");`).newLine();
        w.writeText("return JS_UNDEFINED;").newLine();
        w.writeRightBracket().newLine().newLine();
    }
    emitBinding(): void {
        //this.w.writeText("ctx.newFunc(" + this.name() + ",\"" + this.data.name + "\");");
    }

    name() {
        return "js_func_" + this.data.name;
    }

    setExport(exp: IExport): void {
       exp.export(this.data.name,"ctx.newFunc(" + this.name() + ",\"" + this.data.name + "\")")
    }


   

}