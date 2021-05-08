import { ArgData, ArgDataBase, DefaultPtrTypeArg, DefaultRefTypeArg, DefaultTypeArg, RegisterTypeMap, StringArg } from "../ArgDatas";
import { BindingPackage } from "../BindingPackage";
import { BindingConfig, SysEmitter } from "../emitter/SysEmitter";
import * as ts from "typescript"
import { JSBClass } from "../binding/JSBClass";

export function unrealConfig(){
    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(`
#include "UEApiHeaders.h"
#include "CoreMinimal.h"
#include "JavaScript/easyBindings/ValTran.h"
#include "JavaScript/easyBindings/BindingSys.h"
`,
    "ContainerApi",
    [
        "../YoungGame/tsSrc/UE/Container.ts"
    ]));
    arr.push(new BindingPackage(`
    #include "UEApiHeaders.h"
    #include "CoreMinimal.h"
    #include "JavaScript/easyBindings/ValTran.h"
    #include "JavaScript/easyBindings/BindingSys.h"
    `,
    "GameFrameWorkApi",
    [
        "../YoungGame/tsSrc/UE/GameFrameWork.ts"
    ]));
    
    
    let config:BindingConfig={
        packages:arr,
        cppPath:"../YoungGame/Source/YoungGame/JavaScript/easyBindings/jsbApis/",
        registerTypes:registerType(),
        customize:registerCustomize(),
    }

    let sysEmit=new SysEmitter(config);
    sysEmit.emit();
}

function registerType(){
    let ret:RegisterTypeMap={};
    
    return ret;
}

function registerCustomize() {
    let ret:{[name:string]:string}={};
    

return ret;
}