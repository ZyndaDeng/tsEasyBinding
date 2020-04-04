"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writter_1 = require("./writter");
class VarEmitter {
    constructor(arg, name) {
        this.name = name;
        this.data = arg;
    }
    emit() {
        let w = new writter_1.Writter("");
        w.writeText("duk_ret_t " + this.funcName() + "(duk_context *ctx)").writeLeftBracket().newLine();
        w.writeText("duk_get_global_string(ctx, jsPackageName);").newLine();
        w.writeText(this.data.setFunc()).newLine();
        w.writeText(`duk_put_prop_string(ctx, -2, "` + this.name + `");`).newLine();
        w.writeText("duk_pop(ctx);").newLine();
        w.writeRightBracket().newLine();
        return w;
    }
    funcName() {
        return "js_var_" + this.name;
    }
    register() {
        return this.funcName() + "(ctx);";
    }
}
exports.VarEmitter = VarEmitter;
//# sourceMappingURL=VarEmitter.js.map