"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleEmitter = void 0;
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
        //this.w.writeOpenModule(this.data.name).newLine();
        this.w.writeText("jsb::JSBModule& m=ctx.getOrNewModule(\"" + this.data.name + "\");").newLine();
        for (let d of this.data.members) {
            let emitter = EmitterFactory_1.CreateEmitter(d, this.w);
            emitter.emitBinding();
            emitter.setExport(this);
            this.w.newLine();
        }
        //this.w.writeCloseModule(this.data.name).newLine();
    }
    setExport(exp) {
        throw new Error("Method not implemented.");
    }
    export(name, value) {
        this.w.writeText("m.add(\"" + name + "\"," + value + ");");
    }
}
exports.ModuleEmitter = ModuleEmitter;
//# sourceMappingURL=ModuleEmitter.js.map