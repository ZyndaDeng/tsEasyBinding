"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BindingData_1 = require("../BindingData");
const ArgDatas_1 = require("../ArgDatas");
/**
 * 绑定变量
 */
class JSBVar extends BindingData_1.BaseBindingData {
    constructor(node) {
        if (node.type) {
            super(node.name.getText());
            this.arg = ArgDatas_1.buildArgData(node.type, undefined);
            this.nativeName = name;
        }
        else {
            throw new Error("type undefine");
        }
        this.bindingType = "var";
    }
    /**
     * 绑定数据是否该类型
     * @param data
     */
    static IsMyType(data) {
        return data.bindingType == "var";
    }
}
exports.JSBVar = JSBVar;
//# sourceMappingURL=JSBVar.js.map