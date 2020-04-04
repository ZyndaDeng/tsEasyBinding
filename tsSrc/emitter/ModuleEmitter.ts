import { ModuleData } from "../BindingData";
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { CreateEmitter } from "./EmitterFactory";



export class ModuleEmitter implements Emitter{
    emitDefine(): void {
        for(let d of this.data.members){
            let emitter=CreateEmitter(d,this.w);
            emitter.emitDefine();
        }
    }
    emitBinding(): void {
        this.w.writeOpenModule(this.data.name).newLine();
        for(let d of this.data.members){
            let emitter=CreateEmitter(d,this.w);
            emitter.emitBinding();
            this.w.newLine();
        }
        this.w.writeCloseModule(this.data.name).newLine();
    }

    
    constructor(protected data:ModuleData,protected w:Writter){

    }


}

