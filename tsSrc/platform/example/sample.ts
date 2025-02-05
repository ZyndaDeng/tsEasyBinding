import { RegisterTypeMap } from "../../ArgDatas";
import { JSBClass } from "../../binding/JSBClass";
import { BindingPackage } from "../../BindingPackage";
import { BindingConfig, SysEmitter } from "../../emitter/SysEmitter";


class MyJSBClass extends JSBClass{
    protected defaultGetter(name:string,isGet:boolean){
        let f = name.charAt(0);
        let otherChars = name.substring(1);
        f = f.toUpperCase();
        let getOrSet = isGet ? "get" : "set";
        return {name:getOrSet + f + otherChars,isFunc:true};
    }

    get classId(){
        if(this.isInstanceof(JSBClass.classes["Object"])){
            return this.nativeName + "::GetType()->scriptClassId";
        }else{
            return "js_"+this.nativeName+"_id";
        }  
    }
}

export function sampleConfig(){
    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "exampleApi",
        ["c++/example/tsProj/example.d.ts"]
    ))
    

    let config:BindingConfig={
        packages:arr,
        cppPath:"c++/example/ScriptBinding/",
        jsbClassCtor:MyJSBClass,
        registerTypes:registerType(),
        customize:registerCustomize(),
    }
    //外部的enum
    
    //enumDefined.push("FileEvent")
    

    let sysEmit=new SysEmitter(config);
    sysEmit.emit();
}

function registerType() {
    let ret:RegisterTypeMap={};

    return ret;
}

//一些无法用该工具生成的放在这个函数处理
function registerCustomize() {
    let ret:{[name:string]:string}={};

    return ret;
}