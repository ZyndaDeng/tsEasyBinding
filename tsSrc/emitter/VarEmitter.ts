import { ArgData } from "../ArgDatas";
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { JSBVar } from "../binding/JSBVar";

export class VarEmitter implements Emitter{
    

   
    constructor(protected data:JSBVar,protected w:Writter){
        
    }

    protected funcName(){
        return "js_var_" +this.data.name ;
    }

    emitDefine(): void {
        let w=new Writter("");
        w.writeText("duk_ret_t " + this.funcName() + "(duk_context *ctx)").writeLeftBracket().newLine();
        w.writeText("duk_get_global_string(ctx, jsPackageName);").newLine();
        w.writeText("auto ret=" + this.data.nativeName  + ";").newLine();
        w.writeText(this.data.arg.setFunc()).newLine();
        w.writeText(`duk_put_prop_string(ctx, -2, "`+this.data.name+`");`).newLine();
        w.writeText("duk_pop(ctx);").newLine();
        w.writeRightBracket().newLine();
    }
    emitBinding(): void {
       this.w.writeText(this.funcName()+"(ctx);");
    }
}