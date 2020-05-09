
export interface IExport{
    export(name:string,value:string):void;
}

export interface Emitter{
    emitDefine():void;
    emitBinding():void;
    setExport(exp:IExport):void;
}