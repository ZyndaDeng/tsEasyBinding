"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writter_1 = require("../writter");
class VarEmitter {
    constructor(data, w) {
        this.data = data;
        this.w = w;
    }
    funcName() {
        return "js_var_" + this.data.name;
    }
    emitDefine() {
        let w = new writter_1.Writter("");
        w.writeText("jsb::Value " + this.funcName() + "(const jsb::Context& ctx)").writeLeftBracket().newLine();
        w.writeText("auto ret=" + this.data.nativeName + ";").newLine();
        w.writeText(this.data.arg.setFunc()).newLine();
        w.writeText("ctx.newValue(" + this.data.arg.setFunc() + ");").newLine();
        w.writeRightBracket().newLine();
    }
    emitBinding() {
        //this.w.writeText(this.funcName()+"(ctx);");
    }
    setExport(exp) {
        exp.export(this.data.name, this.funcName() + "(ctx);");
    }
}
exports.VarEmitter = VarEmitter;
//# sourceMappingURL=VarEmitter.js.map