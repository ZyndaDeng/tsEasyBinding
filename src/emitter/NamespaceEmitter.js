"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterFactory_1 = require("./EmitterFactory");
class NamespaceEmitter {
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
        this.w.writeText("jsb::Value ns=ctx.getOrNewObject(ctx.global(),\"" + this.data.name + "\");").newLine();
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
        this.w.writeText("ns.setProperty(\"" + name + "\"," + value + ");");
    }
}
exports.NamespaceEmitter = NamespaceEmitter;
//# sourceMappingURL=NamespaceEmitter.js.map