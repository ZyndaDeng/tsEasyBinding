import { JSBClass } from "../../binding/JSBClass";
import { JSBFunction } from "../../binding/JSBFunction";
import { JSBModule } from "../../binding/JSBModule";
import { JSBNamespace } from "../../binding/JSBNamespace";
import { JSBVar } from "../../binding/JSBVar";
import { BaseBindingData } from "../../BindingData";
import { Constructor } from "../../utils";
import { Writter } from "../../writter";
import { ClassEmitter } from "./ClassEmitter";
import { Emitter } from "../Emitter";
import { IEmitterFactory } from "../EmitterFactory";
import { FuncEmitter } from "./FuncEmitter";
import { ModuleEmitter } from "./ModuleEmitter";
import { NamespaceEmitter } from "./NamespaceEmitter";
import { VarEmitter } from "./VarEmitter";


export class QjsEmitterFactory implements IEmitterFactory{

    constructor(){

    }

    
    createEmitter(data: BaseBindingData, writter: Writter): Emitter {
        if(JSBClass.IsMyType(data)){
            return new  ClassEmitter(data,writter);
        }else if(JSBNamespace.IsMyType(data)){
            return new NamespaceEmitter(data,writter,this);
        }else if(JSBFunction.IsMyType(data)){
            return new FuncEmitter(data,writter);
        }else if(JSBVar.IsMyType(data)){
            return new VarEmitter(data,writter);
        }else if(JSBModule.IsMyType(data)){
            return new ModuleEmitter(data,writter,this);
        }else{
            throw new Error("no Emitter match");
        }
    }


}


