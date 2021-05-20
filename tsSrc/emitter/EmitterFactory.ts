import { BaseBindingData } from "../BindingData";
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { ClassEmitter } from "./ClassEmitter";
import { NamespaceEmitter } from "./NamespaceEmitter";
import { FuncEmitter } from "./FuncEmitter";
import { VarEmitter } from "./VarEmitter";
import { JSBClass } from "../binding/JSBClass";
import { JSBNamespace } from "../binding/JSBNamespace";
import { JSBFunction } from "../binding/JSBFunction";
import { JSBVar } from "../binding/JSBVar";
import { JSBModule } from "../binding/JSBModule";
import { ModuleEmitter } from "./ModuleEmitter";
import { Constructor } from "../utils";

 let DefaultClassEmitter:Constructor<ClassEmitter>=ClassEmitter

export function SetDefaultClassEmitter(ctor:Constructor<ClassEmitter>=ClassEmitter){
    DefaultClassEmitter=ctor;
}

export function CreateEmitter(data:BaseBindingData,writter:Writter):Emitter{
    if(JSBClass.IsMyType(data)){
        return new DefaultClassEmitter(data,writter);
    }else if(JSBNamespace.IsMyType(data)){
        return new NamespaceEmitter(data,writter);
    }else if(JSBFunction.IsMyType(data)){
        return new FuncEmitter(data,writter);
    }else if(JSBVar.IsMyType(data)){
        return new VarEmitter(data,writter);
    }else if(JSBModule.IsMyType(data)){
        return new ModuleEmitter(data,writter);
    }else{
        throw new Error("no Emitter match");
    }
}