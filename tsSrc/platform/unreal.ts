import { ArgData, ArgDataBase, DefaultPtrTypeArg, DefaultRefTypeArg, DefaultTypeArg, IntArg, NumberArg, RegisterTypeMap, StringArg, UIntArg } from "../ArgDatas";
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
        cppPath:"../YoungGame/Source/YoungGame/JavaScript/",
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
    


    class UnrealTypeArg extends ArgDataBase{
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = p.getText();
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",js_F"+this.type+"_id)";
        }
        getFunc(val: string,idx:number): string {
            return "F"+this.type+" n" + idx + "= js_to_"+this.type+"(ctx, " + val + ");"
        }
        setFunc(): string {
            return "js_push_"+this.type+"(ctx,ret);"
        }
    }

    class FloatArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "float";
        }
        checkFunc(val: string): string {
            return "JS_IsNumber(" + val + ")";
        }
        getFunc(val: string,idx:number): string {
            return "float  n" + idx + "=0.0; JS_ToFloat64(ctx,&n"+idx+"," + val + ");"
        }
        setFunc(): string {
            return "JS_NewFloat64(ctx,ret);"
        }
    }

    class UnrealEnumArg extends ArgDataBase {
        protected enumName;
        constructor( p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "int";
            this.enumName=p.getText();
        }
        checkFunc(val: string): string {
            return "JS_IsInteger(" + val + ")";
        }
        getFunc(val: string,idx:number): string {
            return this.enumName + "::Type n" + idx + "=(" + this.enumName + "::Type) JS_VALUE_GET_INT(" + val + ");"
        }
        setFunc(): string {
            return "JS_NewInt32(ctx,ret);"
        }
    }

    ret["EAxis"]=UnrealEnumArg
    ret["FString"] = UnrealStringArg
    ret["uint8"]=UIntArg
    ret["uint32"]=UIntArg
    ret["float"]=NumberArg
    ret["Guid"] = UnrealTypeArg
    ret["Box2D"] = UnrealTypeArg
    ret["Color"] = UnrealTypeArg
    ret["LinearColor"] = UnrealTypeArg
    ret["Quat"] = UnrealTypeArg
    ret["Rotator"] = UnrealTypeArg
    ret["Transform"] = UnrealTypeArg
    ret["Vector"] = UnrealTypeArg
    ret["Vector2D"] = UnrealTypeArg
    ret["Vector4"] = UnrealTypeArg
    ret["IntPoint"] = UnrealTypeArg
    ret["IntVector"] = UnrealTypeArg
    return ret;
}

function registerCustomize() {
    let ret:{[name:string]:string}={};
    

return ret;
}