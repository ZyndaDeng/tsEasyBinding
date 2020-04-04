"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BindingData_1 = require("../BindingData");
const ClassEmitter_1 = require("./ClassEmitter");
const ModuleEmitter_1 = require("./ModuleEmitter");
const FuncEmitter_1 = require("./FuncEmitter");
const VarEmitter_1 = require("./VarEmitter");
function CreateEmitter(data, writter) {
    if (BindingData_1.ClassData.IsMyType(data)) {
        return new ClassEmitter_1.ClassEmitter(data, writter);
    }
    else if (BindingData_1.ModuleData.IsMyType(data)) {
        return new ModuleEmitter_1.ModuleEmitter(data, writter);
    }
    else if (BindingData_1.FuncData.IsMyType(data)) {
        return new FuncEmitter_1.FuncEmitter(data, writter);
    }
    else if (BindingData_1.VarData.IsMyType(data)) {
        return new VarEmitter_1.VarEmitter(data, writter);
    }
    else {
        throw new Error("no Emitter match");
    }
}
exports.CreateEmitter = CreateEmitter;
//# sourceMappingURL=EmitterFactory.js.map