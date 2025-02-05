import { ArgDataBase, RegisterTypeMap, StringArg } from "../../ArgDatas";
import { BindingPackage } from "../../BindingPackage";
import { JSBClass } from "../../binding/JSBClass";
import * as ts from "typescript"
import { BindingConfig, SysEmitter, enumDefined } from "../../emitter/SysEmitter";


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

export function onceConfig(){
    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "CoreApi",
        ["E:/Users/Mozat/Documents/Once/tsProj/once/Core.d.ts"]
    ))
    arr.push(new BindingPackage(
        `#include "bindingImport.h"`,
        "VirtualSystemApi",
        ["E:/Users/Mozat/Documents/Once/tsProj/once/VirtualSystem.d.ts"]
    ))
    

    let config:BindingConfig={
        packages:arr,
        cppPath:"E:/Users/Mozat/Documents/Once/Src/ScriptBinding/",
        jsbClassCtor:MyJSBClass,
        registerTypes:registerType(),
        customize:registerCustomize(),
    }
    //外部的enum
    enumDefined.push("ImagePixelFormat")
    enumDefined.push("AttributeType")
    enumDefined.push("PrimitiveType")
    enumDefined.push("TextDrawAlign")
    enumDefined.push("UrlType")
    enumDefined.push("FileEvent")
    

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

    class ArrayBufferArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ArrayBuffer";
        }
        getFunc(val: string, idx: number): string {
            return "ArrayBuffer n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ArrayBuffer"] = ArrayBufferArg

    class VertexAttributeArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "VertexAttribute";
        }
        getFunc(val: string, idx: number): string {
            return "VertexAttribute n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["VertexAttribute"] = VertexAttributeArg

    class ITextFormatArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ITextFormat";
        }
        getFunc(val: string, idx: number): string {
            return "ITextFormat n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            throw new Error("can not set ITextFormat")
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ITextFormat"] = ITextFormatArg

    class IPaintArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "IPaint";
        }
        getFunc(val: string, idx: number): string {
            return "IPaint n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_IPaint(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["IPaint"] = IPaintArg

    class PointFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "PointLike";
        }
        getFunc(val: string, idx: number): string {
            return "Point<float> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["PointLike<float>"] = PointFArg
    class PointIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "PointLike";
        }
        getFunc(val: string, idx: number): string {
            return "Point<int> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["PointLike<int>"] = PointIArg

    class PointUIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "PointLike";
        }
        getFunc(val: string, idx: number): string {
            return "Point<unsigned> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["PointLike<uint>"] = PointUIArg

    class SizeIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "SizeLike";
        }
        getFunc(val: string, idx: number): string {
            return "Size<int> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["SizeLike<int>"] = SizeIArg

    class SizeUArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "SizeLike";
        }
        getFunc(val: string, idx: number): string {
            return "Size<unsigned> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["SizeLike<uint>"] = SizeUArg

    class RectIArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "RectLike";
        }
        getFunc(val: string, idx: number): string {
            return "Rect<int> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["RectLike<int>"] = RectIArg

    class RectFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "RectLike";
        }
        getFunc(val: string, idx: number): string {
            return "Rect<float> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["RectLike<float>"] = RectFArg

    class RRectFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "RRectLike";
        }
        getFunc(val: string, idx: number): string {
            return "RRect<float> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["RRectLike<float>"] = RRectFArg

    class ColorBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ColorLike";
        }
        getFunc(val: string, idx: number): string {
            return "Color<byte> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ColorLike<byte>"] = ColorBArg

    class ColorFArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ColorLike";
        }
        getFunc(val: string, idx: number): string {
            return "Color<float> n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ColorLike<float>"] = ColorFArg

    class Matrix3Arg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Matrix3Like";
        }
        getFunc(val: string, idx: number): string {
            return "Matrix3 n" + idx + "; js_to(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["Matrix3Like"] = Matrix3Arg

    class CharGraphArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ICharGraph";
        }
        getFunc(val: string, idx: number): string {
           throw new Error("can not get ICharGraph")
        }
        setFunc(): string {
           return "js_push(ctx,ret);"
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
    }
    ret["ICharGraph"] = CharGraphArg

    class WindowSetupCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "WindowSetupCB";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_WindowSetupCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["WindowSetupCB"] = WindowSetupCBArg

    class WindowRunCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "WindowRunCB";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_WindowRunCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["WindowRunCB"] = WindowRunCBArg

    class MouseBtnCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "MouseBtnCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_MouseBtnCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["MouseBtnCallback"] = MouseBtnCBArg

    class MouseMoveCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "MouseMoveCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_MouseMoveCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["MouseMoveCallback"] = MouseMoveCBArg

    class ReadFileCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "ReadFileCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_ReadFileCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["ReadFileCallback"] = ReadFileCBArg

    class WatchFileCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "WatchFileCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_WatchFileCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "JS_IsFunction(ctx," + val + ")";
        }
    }
    ret["WatchFileCallback"] = WatchFileCBArg

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
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["KeyboardCallback"] = KeyEventCBArg
    class CharInputCBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "CharInputCallback";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_CharInputCB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["CharInputCallback"] = CharInputCBArg

    class SizeICBArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "SizeICB";
        }
        getFunc(val: string, idx: number): string {
            return "auto n" + idx + "= js_to_SizeICB(ctx, JS_UNDEFINED," + val  + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
        checkFunc(val: string): string {
            return "(JS_IsFunction(ctx," + val + ")||JS_IsUndefined(" + val + "))";
        }
    }
    ret["SizeICB"] = SizeICBArg

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

    class ResourceNamesArg extends ArgDataBase {
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
    ret["ResourceType[K]"] = ResourceNamesArg

    return ret;
}

function registerCustomize() {
    let ret:{[name:string]:string}={};

    return ret;
}