import { BaseBindingData, ClassData, ModuleData, FuncData, VarData } from "../BindingData";
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { ClassEmitter } from "./ClassEmitter";
import { ModuleEmitter } from "./ModuleEmitter";
import { FuncEmitter } from "./FuncEmitter";
import { VarEmitter } from "./VarEmitter";

export function CreateEmitter(data:BaseBindingData,writter:Writter):Emitter{
    if(ClassData.IsMyType(data)){
        return new ClassEmitter(data,writter);
    }else if(ModuleData.IsMyType(data)){
        return new ModuleEmitter(data,writter);
    }else if(FuncData.IsMyType(data)){
        return new FuncEmitter(data,writter);
    }else if(VarData.IsMyType(data)){
        return new VarEmitter(data,writter);
    }else{
        throw new Error("no Emitter match");
    }
}