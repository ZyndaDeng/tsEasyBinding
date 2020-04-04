"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TsEmitter {
    constructor(srcStr) {
        this.srcStr = srcStr;
    }
    emit() {
        let arr = this.srcStr.split("\n");
        let ret = "";
        for (let s of arr) {
            let tmp = s.trim();
            if (tmp.indexOf("@") != 0) {
                ret += s + "\n";
            }
        }
        return ret;
    }
}
exports.TsEmitter = TsEmitter;
//# sourceMappingURL=TsEmitter.js.map