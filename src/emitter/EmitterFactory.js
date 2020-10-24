"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClassEmitter_1 = require("./ClassEmitter");
const NamespaceEmitter_1 = require("./NamespaceEmitter");
const FuncEmitter_1 = require("./FuncEmitter");
const VarEmitter_1 = require("./VarEmitter");
const JSBClass_1 = require("../binding/JSBClass");
const JSBNamespace_1 = require("../binding/JSBNamespace");
const JSBFunction_1 = require("../binding/JSBFunction");
const JSBVar_1 = require("../binding/JSBVar");
const JSBModule_1 = require("../binding/JSBModule");
const ModuleEmitter_1 = require("./ModuleEmitter");
function CreateEmitter(data, writter) {
    if (JSBClass_1.JSBClass.IsMyType(data)) {
        return new ClassEmitter_1.ClassEmitter(data, writter);
    }
    else if (JSBNamespace_1.JSBNamespace.IsMyType(data)) {
        return new NamespaceEmitter_1.NamespaceEmitter(data, writter);
    }
    else if (JSBFunction_1.JSBFunction.IsMyType(data)) {
        return new FuncEmitter_1.FuncEmitter(data, writter);
    }
    else if (JSBVar_1.JSBVar.IsMyType(data)) {
        return new VarEmitter_1.VarEmitter(data, writter);
    }
    else if (JSBModule_1.JSBModule.IsMyType(data)) {
        return new ModuleEmitter_1.ModuleEmitter(data, writter);
    }
    else {
        throw new Error("no Emitter match");
    }
}
exports.CreateEmitter = CreateEmitter;
//# sourceMappingURL=EmitterFactory.js.map