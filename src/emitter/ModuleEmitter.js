"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterFactory_1 = require("./EmitterFactory");
class ModuleEmitter {
    constructor(data, w) {
        this.data = data;
        this.w = w;
    }
    emitDefine() {
        for (let d of this.data.members) {
            let emitter = EmitterFactory_1.CreateEmitter(d, this.w);
            emitter.emitDefine();
        }
    }
    emitBinding() {
        this.w.writeOpenModule(this.data.name).newLine();
        for (let d of this.data.members) {
            let emitter = EmitterFactory_1.CreateEmitter(d, this.w);
            emitter.emitBinding();
            this.w.newLine();
        }
        this.w.writeCloseModule(this.data.name).newLine();
    }
}
exports.ModuleEmitter = ModuleEmitter;
//# sourceMappingURL=ModuleEmitter.js.map