"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBindingData = void 0;
class BaseBindingData {
    constructor(name) {
        this.name = name;
    }
    getModule() {
        let ret = undefined;
        if (this.parent) {
            ret = [];
            for (let p = this.parent; p != undefined; p = p.parent) {
                if (p)
                    ret.push(p.name);
            }
        }
        return ret;
    }
}
exports.BaseBindingData = BaseBindingData;
//# sourceMappingURL=BindingData.js.map