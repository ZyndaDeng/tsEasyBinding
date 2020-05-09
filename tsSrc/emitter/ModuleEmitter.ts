
import { Writter } from "../writter";
import { Emitter, IExport } from "./Emitter";
import { CreateEmitter } from "./EmitterFactory";
import { JSBModule } from "../binding/JSBModule";



export class ModuleEmitter implements Emitter{
    
    emitDefine(): void {
        for(let d of this.data.members){
            let emitter=CreateEmitter(d,this.w);
            emitter.emitDefine();
        }
    }
    emitBinding(): void {
        //this.w.writeOpenModule(this.data.name).newLine();
        this.w.writeText("jsb::Value ns=ctx.getOrNewObject(ctx.global(),\""+this.data.name+"\");");
        for(let d of this.data.members){
            let emitter=CreateEmitter(d,this.w);
            emitter.emitBinding();
            emitter.setExport(this);
            this.w.newLine();
        }
        //this.w.writeCloseModule(this.data.name).newLine();
    }

    setExport(exp: IExport): void {
        throw new Error("Method not implemented.");
    }

    export(name:string,value:string):void{
        this.w.writeText("ns.setProperty(\""+name+"\","+value+");");
    }
    
    constructor(protected data:JSBModule,protected w:Writter){

    }


}

