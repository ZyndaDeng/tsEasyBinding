
import { Writter } from "../../writter";
import { Emitter, IExport } from "../Emitter";
import { JSBVar } from "../../binding/JSBVar";

export class VarEmitter implements Emitter{
    
    

   
    constructor(protected data:JSBVar,protected w:Writter){
        
    }

    protected funcName(){
        return "js_var_" +this.data.name ;
    }

    emitDefine(): void {
        let w=new Writter("");
        w.writeText("jsb::Value " + this.funcName() + "(const jsb::Context& ctx)").writeLeftBracket().newLine();
        w.writeText("auto ret=" + this.data.nativeName  + ";").newLine();
        w.writeText(this.data.arg.setFunc()).newLine();
        w.writeText("ctx.newValue("+this.data.arg.setFunc()+");").newLine();
        w.writeRightBracket().newLine();
    }
    emitBinding(): void {
       //this.w.writeText(this.funcName()+"(ctx);");
    }

    setExport(exp:IExport): void {
        exp.export(this.data.name,this.funcName()+"(ctx);");
    }
}