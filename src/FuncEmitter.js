"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const ArgDatas_1 = require("./ArgDatas");
const writter_1 = require("./writter");
class FuncEmitter {
    constructor(node) {
        //this.data=null;
        this.readData(node);
    }
    readData(node) {
        var _a;
        let name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.getText();
        if (!name)
            throw new Error("function name undfined");
        this.data = {
            isStatic: true,
            name: name,
            args: []
        };
        if (node.parameters) {
            for (let p of node.parameters) {
                if (p.type) {
                    let def = undefined;
                    if (p.questionToken) {
                        def = true;
                    }
                    let ad = ArgDatas_1.buildArgData(p.type, def);
                    // if(refArgs.includes(p.name.getText())){
                    //     ad.ref=true;
                    // }
                    this.data.args.push(ad);
                }
                else {
                    throw new Error("parameter type undfined");
                }
            }
        }
        if (node.type && node.type.kind != ts.SyntaxKind.VoidKeyword) {
            this.data.returnType = ArgDatas_1.buildArgData(node.type, undefined);
        }
    }
    emit() {
        if (!this.data)
            throw new Error("data undfined");
        let w = new writter_1.Writter("");
        w.writeText("duk_ret_t " + this.name() + "(duk_context *ctx)").writeLeftBracket().newLine();
        w.writeText("if(").newLine();
        let next = "";
        for (let i = 0; i < this.data.args.length; i++) {
            let a = this.data.args[i];
            w.writeText(next + a.checkFunc(i)).newLine();
            next = "&&";
        }
        w.writeText(")").writeLeftBracket().newLine();
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
        w.newLine().writeRightBracket().newLine();
        w.writeRightBracket().newLine().newLine();
        return w.str;
    }
    name() {
        if (this.data)
            return "js_func_" + this.data.name;
        throw new Error("data undfined");
    }
    register() {
        if (this.data)
            return "jsInitFunc(ctx,\"" + this.data.name + "\"," + this.name() + "," + this.data.args.length + ");";
        throw new Error("data undfined");
    }
}
exports.FuncEmitter = FuncEmitter;
//# sourceMappingURL=FuncEmitter.js.map