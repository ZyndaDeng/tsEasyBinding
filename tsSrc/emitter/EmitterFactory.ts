import { BaseBindingData } from "../BindingData";
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { ClassEmitter } from "./ClassEmitter";
import { ModuleEmitter } from "./ModuleEmitter";
import { FuncEmitter } from "./FuncEmitter";
import { VarEmitter } from "./VarEmitter";
import { JSBClass } from "../binding/JSBClass";
import { JSBModule } from "../binding/JSBModule";
import { JSBFunction } from "../binding/JSBFunction";
import { JSBVar } from "../binding/JSBVar";

export function CreateEmitter(data:BaseBindingData,writter:Writter):Emitter{
    if(JSBClass.IsMyType(data)){
        return new ClassEmitter(data,writter);
    }else if(JSBModule.IsMyType(data)){
        return new ModuleEmitter(data,writter);
    }else if(JSBFunction.IsMyType(data)){
        return new FuncEmitter(data,writter);
    }else if(JSBVar.IsMyType(data)){
        return new VarEmitter(data,writter);
    }else{
        throw new Error("no Emitter match");
    }
}