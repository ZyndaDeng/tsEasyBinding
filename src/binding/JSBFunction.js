"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSBFunction = void 0;
const ts = __importStar(require("typescript"));
const BindingData_1 = require("../BindingData");
const ArgDatas_1 = require("../ArgDatas");
class JSBFunction extends BindingData_1.BaseBindingData {
    constructor(node) {
        var _a;
        let name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.getText();
        if (!name)
            throw new Error("function name undfined");
        super(name);
        this.bindingType = "func";
        this.args = [];
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
                    this.args.push(ad);
                }
                else {
                    throw new Error("parameter type undfined");
                }
            }
        }
        if (node.type && node.type.kind != ts.SyntaxKind.VoidKeyword) {
            this.returnType = ArgDatas_1.buildArgData(node.type, undefined);
        }
    }
    static IsMyType(data) {
        return data.bindingType == "func";
    }
}
exports.JSBFunction = JSBFunction;
//# sourceMappingURL=JSBFunction.js.map