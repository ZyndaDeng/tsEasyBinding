import { BaseBindingData } from "../BindingData";
import { Writter } from "../writter";
import { Emitter } from "./Emitter";



export interface IEmitterFactory{
    createEmitter(data:BaseBindingData,writter:Writter):Emitter
}