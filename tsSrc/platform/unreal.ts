import { ArgData, ArgDataBase, DefaultPtrTypeArg, DefaultRefTypeArg, DefaultTypeArg, RegisterTypeMap, StringArg } from "../ArgDatas";
import { BindingPackage } from "../BindingPackage";
import { BindingConfig, SysEmitter } from "../emitter/SysEmitter";
import * as ts from "typescript"
import { JSBClass } from "../binding/JSBClass";


class MyJSBClass extends JSBClass{

    
    get classId(){
        
        if(this.isInstanceof(JSBClass.classes["Object"])){
            return "js_get_classID(ctx,"+this.nativeName + "::Class())->classID";
        }else{
            return "js_"+this.nativeName+"_id";
        }  
    }
}

export function unrealConfig(){
    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(`
#include "UEApiHeaders.h"
#include "CoreMinimal.h"
#include "../ValTran.h"
#include "../BindingSys.h"
`,
    "ContainerApi",
    [
        "../YoungGame/tsSrc/UE/Container.ts"
    ]));
    // arr.push(new BindingPackage(`
    // #include "UEApiHeaders.h"
    // #include "CoreMinimal.h"
    // #include "../ValTran.h"
    // #include "../BindingSys.h"
    // `,
    // "GameFrameWorkApi",
    // [
    //     "../YoungGame/tsSrc/UE/GameFrameWork.ts"
    // ]));
    
    
    let config:BindingConfig={
        packages:arr,
        cppPath:"../YoungGame/Source/YoungGame/JavaScript/easyBindings/jsbApis/",
        registerTypes:registerType(),
        customize:registerCustomize(),
        jsbClassCtor:MyJSBClass,
    }

    let sysEmit=new SysEmitter(config);
    sysEmit.emit();
}

function registerType(){
    let ret:RegisterTypeMap={};
    class UnrealStringArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "FString";
        }
        getFunc(val: string, idx: number): string {
            return "FString n" + idx + "= js_to_string(ctx, " + val + ");"
        }
        setFunc(): string {
            return "js_push_unreal_string(ctx,ret);"
        }
    }
    ret["FString"] = UnrealStringArg
    return ret;
}

function registerCustomize() {
    let ret:{[name:string]:string}={};
    

return ret;
}