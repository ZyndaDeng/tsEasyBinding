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
        w.writeText("duk_ret_t " + this.funcName() + "(duk_context *ctx)").writeLeftBracket().newLine();
        w.writeText("duk_get_global_string(ctx, jsPackageName);").newLine();
        w.writeText(this.data.arg.setFunc()).newLine();
        w.writeText(`duk_put_prop_string(ctx, -2, "` + this.data.name + `");`).newLine();
        w.writeText("duk_pop(ctx);").newLine();
        w.writeRightBracket().newLine();
    }
    emitBinding() {
        this.w.writeText(this.funcName() + "(ctx);");
    }
}
exports.VarEmitter = VarEmitter;
//# sourceMappingURL=VarEmitter.js.map