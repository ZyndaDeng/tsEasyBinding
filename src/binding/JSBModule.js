"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSBModule = void 0;
const BindingData_1 = require("../BindingData");
class JSBModule extends BindingData_1.BaseBindingData {
    constructor(name) {
        if (name[0] == "\"") {
            name = name.replace("\"", "");
            name = name.replace("\"", "");
        }
        super(name);
        this.bindingType = "module";
        this.members_ = [];
    }
    static IsMyType(data) {
        return data.bindingType == "module";
    }
    addMember(m) {
        //if (this.members_[m.name]) throw new Error("member[" + m.name + "] aready in module[" + this.name + "]");
        m.parent = this;
        this.members_.push(m);
    }
    get members() {
        return this.members_;
    }
}
exports.JSBModule = JSBModule;
//# sourceMappingURL=JSBModule.js.map