import { ArgDataBase, RegisterTypeMap, StringArg } from "../../ArgDatas";
import { BindingPackage } from "../../BindingPackage";
import { JSBClass } from "../../binding/JSBClass";
import * as ts from "typescript"
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

export function invaderConfig(){
    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "CoreApi",
        ["E:/Users/Mozat/share/Invader_Clone/tsProj/once/Core.d.ts"]
    ))
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "VirtualSystemApi",
        ["E:/Users/Mozat/share/Invader_Clone/tsProj/once/VirtualSystem.d.ts"]
    ))
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "MathApi",
        ["E:/Users/Mozat/share/Invader_Clone/tsProj/once/Math.d.ts"]
    ))
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "InvaderApi",
        ["E:/Users/Mozat/share/Invader_Clone/tsProj/invaderNative/invader.d.ts"]
    ))

    let config:BindingConfig={
        packages:arr,
        cppPath:"E:/Users/Mozat/share/Invader_Clone/libs/Once/Src/ScriptBinding/",
        jsbClassCtor:MyJSBClass,
        registerTypes:registerType(),
        customize:registerCustomize(),
    }

    let sysEmit=new SysEmitter(config);
    sysEmit.emit();
}

function registerType(){
    let ret:RegisterTypeMap={};
    class BaseStringArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "String";
        }
        getFunc(val: string, idx: number): string {
            return "String n" + idx + "= js_to_string(ctx, " + val + ");"
        }
        setFunc(): string {
            return "js_push_base_string(ctx,ret);"
        }
    }
    ret["String"] = BaseStringArg

    class IPaintArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "IPaint";
        }
        getFunc(val: string, idx: number): string {
            return "IPaint n" + idx + "; js_set_IPaint(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_IPaint(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["IPaint"] = IPaintArg

    class ITextFormatArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ITextFormat";
        }
        getFunc(val: string, idx: number): string {
            return "ITextFormat n" + idx + "; js_set_ITextFormat(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_ITextFormat(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ITextFormat"] = ITextFormatArg

    class PointFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Point";
        }
        getFunc(val: string, idx: number): string {
            return "Point<float> n" + idx + "; js_set_Point(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Point<float>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Point<float>"] = PointFArg
    class PointIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Point";
        }
        getFunc(val: string, idx: number): string {
            return "Point<int> n" + idx + "; js_set_Point(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Point<int>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Point<int>"] = PointIArg

    class SizeIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Size";
        }
        getFunc(val: string, idx: number): string {
            return "Size<int> n" + idx + "; js_set_Size(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Size<int>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Size<int>"] = SizeIArg

    class SizeUIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Size";
        }
        getFunc(val: string, idx: number): string {
            return "Size<unsigned int> n" + idx + "; js_set_Size(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Size<unsigned int>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Size<uint>"] = SizeUIArg

    class SizeFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Size";
        }
        getFunc(val: string, idx: number): string {
            return "Size<float> n" + idx + "; js_set_Size(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Size<float>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Size<float>"] = SizeFArg

    class RectFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Rect";
        }
        getFunc(val: string, idx: number): string {
            return "Rect<float> n" + idx + "; js_set_Rect(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Rect<float>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Rect<float>"] = RectFArg

    class RRectFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "RRect";
        }
        getFunc(val: string, idx: number): string {
            return "RRect<float> n" + idx + "; js_set_RRect(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_RRect<float>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["RRect<float>"] = RRectFArg

    class BorderArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Border";
        }
        getFunc(val: string, idx: number): string {
            return "Border<float> n" + idx + "; js_set_Border(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Border<float>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Border<float>"] = BorderArg

    class ColorBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Color";
        }
        getFunc(val: string, idx: number): string {
            return "Color<byte> n" + idx + "; js_set_Color(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_Color<byte>(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Color<byte>"] = ColorBArg

    class Matrix3Arg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Matrix3";
        }
        getFunc(val: string, idx: number): string {
            return "Matrix3 n" + idx + "; js_set_Matrix3(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            throw new Error("can not set matrix3")
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Matrix3"] = Matrix3Arg

    class ITextureUVArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ITextureUV";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "=js_to_tex(ctx, " + val +  ");"
        }
        setFunc(): string {
            throw new Error("can not set matrix3")
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ITextureUV"] = ITextureUVArg

    class WindowDrawCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "WindowDrawCB";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_WindowDrawCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["WindowDrawCB"] = WindowDrawCBArg

    class MouseEventCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "MouseCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_MouseEventCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["MouseCallback"] = MouseEventCBArg

    class KeyEventCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "KeyboardCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_KeyboardEventCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["KeyboardCallback"] = KeyEventCBArg

    class TouchEventCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "TouchCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_TouchEventCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["TouchCallback"] = TouchEventCBArg

    class LoopEventCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "LoopCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_LoopCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["LoopCallback"] = LoopEventCBArg

    ret["K"] = BaseStringArg;
    class ServiceNamesArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Object";
        }
        checkFunc(val: string): string {
            let classId = JSBClass.classes[this.type]?.classId;
            if (!classId) classId = "js_Object_id";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val: string, idx: number): string {

            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_native_object(ctx,ret);`
        }
    }
    ret["ServiceNames[K]"] = ServiceNamesArg

    return ret;
}

function registerCustomize() {
    let ret:{[name:string]:string}={};

    return ret;
}