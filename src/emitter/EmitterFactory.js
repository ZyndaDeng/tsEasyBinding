"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClassEmitter_1 = require("./ClassEmitter");
const ModuleEmitter_1 = require("./ModuleEmitter");
const FuncEmitter_1 = require("./FuncEmitter");
const VarEmitter_1 = require("./VarEmitter");
const JSBClass_1 = require("../binding/JSBClass");
const JSBModule_1 = require("../binding/JSBModule");
const JSBFunction_1 = require("../binding/JSBFunction");
const JSBVar_1 = require("../binding/JSBVar");
function CreateEmitter(data, writter) {
    if (JSBClass_1.JSBClass.IsMyType(data)) {
        return new ClassEmitter_1.ClassEmitter(data, writter);
    }
    else if (JSBModule_1.JSBModule.IsMyType(data)) {
        return new ModuleEmitter_1.ModuleEmitter(data, writter);
    }
    else if (JSBFunction_1.JSBFunction.IsMyType(data)) {
        return new FuncEmitter_1.FuncEmitter(data, writter);
    }
    else if (JSBVar_1.JSBVar.IsMyType(data)) {
        return new VarEmitter_1.VarEmitter(data, writter);
    }
    else {
        throw new Error("no Emitter match");
    }
}
exports.CreateEmitter = CreateEmitter;
//# sourceMappingURL=EmitterFactory.js.map