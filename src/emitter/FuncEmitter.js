"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FuncEmitter {
    constructor(data, writter) {
        this.data = data;
        this.w = writter;
    }
    emitDefine() {
        let w = this.w;
        w.writeText("duk_ret_t " + this.name() + "(duk_context *ctx)").writeLeftBracket().newLine();
        let next = "";
        if (this.data.args.length > 0) {
            w.writeText("if(").newLine();
            for (let i = 0; i < this.data.args.length; i++) {
                let a = this.data.args[i];
                w.writeText(next + a.checkFunc(i)).newLine();
                next = "&&";
            }
            w.writeText(")").writeLeftBracket().newLine();
        }
        let argsInside = "(";
        next = "";
        for (let i = 0; i < this.data.args.length; i++) {
            let a = this.data.args[i];
            w.writeText(a.getFunc(i)).newLine();
            argsInside += next + "n" + i;
            next = ",";
        }
        argsInside += ")";
        if (this.data.returnType) {
            w.writeText("auto ret=" + this.data.name + argsInside + ";").newLine();
            w.writeText(this.data.returnType.setFunc()).newLine();
            w.writeText("return 1;");
        }
        else {
            w.writeText(this.data.name + argsInside + ";").newLine();
            w.writeText("return 0;");
        }
        if (this.data.args.length > 0) {
            w.newLine().writeRightBracket().newLine();
        }
        else {
            w.newLine();
        }
        w.writeRightBracket().newLine().newLine();
    }
    emitBinding() {
        this.w.writeText("jsb_func(ctx,\"" + this.data.name + "\"," + this.name() + "," + this.data.args.length + ");");
    }
    name() {
        return "js_func_" + this.data.name;
    }
    register() {
        if (this.data)
            return "jsInitFunc(ctx,\"" + this.data.name + "\"," + this.name() + "," + this.data.args.length + ");";
        throw new Error("data undfined");
    }
}
exports.FuncEmitter = FuncEmitter;
//# sourceMappingURL=FuncEmitter.js.map