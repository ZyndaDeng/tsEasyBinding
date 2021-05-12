import { ArgData } from "../ArgDatas";
import { Writter } from "../writter";

export interface MemberMap{

}
export interface TypeDefineData{
    push:Array<string>;
    to:Array<string>;
}
export class TypeEmitter{


    constructor(protected data:ArgData,protected w:Writter){
        
    }

    emitDeclare(){
        
        this.w.writeText();
    }

    emitDefine(){

    }
}