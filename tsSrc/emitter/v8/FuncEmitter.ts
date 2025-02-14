import { JSBFunction } from "../../binding/JSBFunction";
import { Writter } from "../../writter";
import { Emitter, IExport } from "../Emitter";


export class FuncEmitter implements Emitter{

    protected w: Writter;

    constructor(protected data: JSBFunction, writter: Writter) {
        this.w = writter;
    }

    protected writeV8BaseArg(w:Writter){
        w.writeText("auto isolate = args.GetIsolate();").newLine();
        w.writeText("auto context = isolate->GetCurrentContext();").newLine();
        w.writeText("auto ctx = JS_GetContext(context);").newLine();
    }

    emitDefine(): void {
        let w = this.w;
        w.writeText("static void " + this.name() + "(const v8::FunctionCallbackInfo<v8::Value>& args)").writeLeftBracket().newLine();
        this.writeV8BaseArg(w);
        let next = "";
        if (this.data.args.length > 0) {
            w.writeText("if(").newLine();

            for (let i = 0; i < this.data.args.length; i++) {
                let a = this.data.args[i];
                w.writeText(next + a.checkFunc("args["+i+"]")).newLine();
                next = "&&";
            }
            w.writeText(")").writeLeftBracket().newLine();
        }

        let argsInside = "("
        next = "";
        for (let i = 0; i < this.data.args.length; i++) {
            let a = this.data.args[i];
            w.writeText(a.getFunc("args["+i+"]",i)).newLine();
            argsInside += next + "n" + i;
            next = ",";
        }
        argsInside += ")";
        if (this.data.returnType) {
            w.writeText("auto ret=" + this.data.name + argsInside + ";").newLine();
            w.writeText("args.GetReturnValue().Set(").writeText(this.data.returnType.setFunc()).writeText(");").newLine();
        } else {
            w.writeText(this.data.name + argsInside + ";").newLine();
            //w.writeText("return JS_UNDEFINED;");
        }
        if (this.data.args.length > 0) {
            w.newLine().writeRightBracket().newLine();
        }else{
            w.newLine();
        }
        w.writeRightBracket().newLine().newLine();
    }
    emitBinding(): void {
        //this.w.writeText("ctx.newFunc(" + this.name() + ",\"" + this.data.name + "\");");
    }

    name() {
        return "js_func_" + this.data.name;
    }

    setExport(exp: IExport): void {
       exp.export(this.data.name,"JS_NewFunction(ctx," + this.name() + ")")
    }

}