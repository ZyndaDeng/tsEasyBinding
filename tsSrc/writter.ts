
const enter = "\n";
const tab = "\t";
export class Writter{

    constructor(str:string){
        this.str=str;
        this.tabCount=0;
        this.isNewLine_=true;
    }

    newLine(){
        this.str+=enter;
        this.isNewLine_=true;
        return this;
    }

    writeText(s:string){
        this.isNewLine();
        this.str+=s;
        return this;
    }

    writeLeftBracket(){
        this.isNewLine();
        this.tabCount++;
        this.str+="{";
        return this;
    }

    writeRightBracket(){
        this.tabCount--;
        this.isNewLine();
        this.str+="}";
        return this;
    }

    writeOpenModule(modName:string){
       return this.writeText("js_open_module(ctx,\""+modName+"\");");
    }

    writeCloseModule(modName:string){
        return this.writeText("js_close_module(ctx,\""+modName+"\");");
    }

    protected isNewLine(){
        let ret=this.isNewLine_;
        if(this.isNewLine_){
            for(let i=0;i<this.tabCount;i++){
                this.str+=tab;
            }
            this.isNewLine_=false;
        }
        return ret;
    }



    str:string;

    protected tabCount:number;
    protected isNewLine_:boolean;
}