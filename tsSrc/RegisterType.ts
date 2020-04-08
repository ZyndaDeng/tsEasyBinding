import * as ts from "typescript"
import { ArgDataBase, registerArgs, DefaultTypeArg, StringArg } from "./ArgDatas";
import { customize } from "./emitter/SysEmitter";

export function RegisterType() {

    class Urho3DStringArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "String";
        }
        getFunc(idx: number): string {
            return "String n" + idx + "= duk_require_string(ctx, " + idx + ");"
        }
        setFunc(): string {
            return "js_push_urho3d_string(ctx,ret);"
        }
    }
    registerArgs["String"] = Urho3DStringArg

    class StringHashArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "StringHash";
        }
        setFunc(): string {
            return "js_push_urho3d_string(ctx,ret.ToString());"
        }
    }
    registerArgs["StringHash"] = StringHashArg

    class Vector2Arg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Vector2";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
            return "Vector2 n" + idx + "= js_to_Vector2(ctx, " + idx + ");"
        }
        setFunc(): string {
            return "js_push_Vector2(ctx,ret);"
        }
    }
    registerArgs["Vector2"] = Vector2Arg
    registerArgs["Vector2Like"] = Vector2Arg

    registerArgs["IntVector2"] = DefaultTypeArg

    class Vector3Arg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Vector3";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
            return "Vector3 n" + idx + "= js_to_Vector3(ctx, " + idx + ");"
        }
        setFunc(): string {
            return "js_push_Vector3(ctx,ret);"
        }
    }
    registerArgs["Vector3"] = Vector3Arg
    registerArgs["Vector3Like"] = Vector3Arg

    registerArgs["IntVector3"] = DefaultTypeArg

    class Vector4Arg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Vector4";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
            return "Vector4 n" + idx + "= js_to_Vector4(ctx, " + idx + ");"
        }
        setFunc(): string {
            return "js_push_Vector4(ctx,ret);"
        }
    }
    registerArgs["Vector4"] = Vector4Arg
    registerArgs["Vector4Like"] = Vector4Arg

    class PackageEntryArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "PackageEntry";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
            throw new Error("no defined");
        }
        setFunc(): string {
            return "js_push_PackageEntry(ctx,ret);"
        }
    }
    registerArgs["PackageEntry"] = PackageEntryArg

    class ColorArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Color";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
            return "Color n" + idx + "= js_to_Color(ctx, " + idx + ");"
        }
        setFunc(): string {
            return "js_push_Color(ctx,ret);"
        }
    }
    registerArgs["Color"] = ColorArg
    registerArgs["ColorLike"] = ColorArg

    class RectArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Rect";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
            return "Rect n" + idx + "= js_to_Rect(ctx, " + idx + ");"
        }
        setFunc(): string {
            return "js_push_Rect(ctx,ret);"
        }
    }
    registerArgs["Rect"] = RectArg
    registerArgs["RectLike"] = RectArg

    
    registerArgs["IntRect"] = DefaultTypeArg
    registerArgs["Matrix2"] = DefaultTypeArg
    registerArgs["Matrix3"] = DefaultTypeArg
    registerArgs["Matrix4"] = DefaultTypeArg
    registerArgs["Matrix3x4"] = DefaultTypeArg
    registerArgs["BoundingBox"] = DefaultTypeArg
    registerArgs["Plane"] = DefaultTypeArg
    registerArgs["ResourceRef"] = DefaultTypeArg
    registerArgs["ResourceRefList"] = DefaultTypeArg
    registerArgs["Quaternion"] = DefaultTypeArg
    registerArgs["Frustum"] = DefaultTypeArg
    registerArgs["Ray"] = DefaultTypeArg
    registerArgs["Polyhedron"] = DefaultTypeArg
    registerArgs["Sphere"] = DefaultTypeArg
    //registerArgs["Model"] = DefaultTypeArg

    class StringVectorArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "StringVector";
        }
        checkFunc(idx: number): string {
            return "duk_is_array(ctx," + idx + ")";
        }
        getFunc(idx: number): string {
                return "StringVector n"+idx+"; js_to_normal_array(ctx,"+idx+",n"+idx+",duk_to_string);"
        }
        setFunc(): string {
                return "js_push_StringVector(ctx,ret);"    
        }
    }
    registerArgs["StringVector"]=StringVectorArg;

    class VariantArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Variant";
        }
        checkFunc(idx: number): string {
            return "!duk_is_null_or_undefined(ctx," + idx + ")";
        }
        getFunc(idx: number): string {

            return "Variant n" + idx + "; js_to_Variant(ctx, " + idx + ",n" + idx + ");"

        }
        setFunc(): string {
            return "js_push_Variant(ctx,ret);"
        }
    }
    registerArgs["Variant"] = VariantArg

    class VariantMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "VariantMap";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {

            return "VariantMap n" + idx + "; js_object_to_VariantMap(ctx, " + idx + ",n" + idx + ");"

        }
        setFunc(): string {
            return "js_push_VariantMap(ctx,ret);"
        }
    }
    registerArgs["VariantMap"] = VariantMapArg

    class ComponentMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Component";
        }
        checkFunc(idx: number): string {
            return "js_is_native(ctx," + idx + ",\""+ this.type+"\")";
        }
        getFunc(idx: number): string {
       
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + idx + ");"
        }
        setFunc(): string {
            return `if(ret)js_push_native_object(ctx,ret,ret->GetTypeName());else duk_push_undefined(ctx);`
        }
    }
    registerArgs["ComponentMap[K]"] = ComponentMapArg
    registerArgs["Component"] = ComponentMapArg
    registerArgs["K"]=StringArg;

    class UIElementMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "UIElement";
        }
        checkFunc(idx: number): string {
            return "js_is_native(ctx," + idx + ",\""+ this.type+"\")";
        }
        getFunc(idx: number): string {
       
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + idx + ");"
        }
        setFunc(): string {
            return `if(ret)js_push_native_object(ctx,ret,ret->GetTypeName());else duk_push_undefined(ctx);`
        }
    }
    registerArgs["UIElementMap[K]"] = UIElementMapArg
    registerArgs["UIElement"] = UIElementMapArg

    class TouchStateArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "TouchState";
        }
        checkFunc(idx: number): string {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx: number): string {

           throw new Error("not defined");

        }
        setFunc(): string {
            return "js_push_TouchState(ctx,ret);"
        }
    }
    registerArgs["VariantMap"] = VariantMapArg
}

export function RegisterCustomize(){
    customize["ResourceCache_GetResource"]=
    `
    duk_ret_t js_ResourceCache_GetResource(duk_context *ctx)
    {
        if(duk_is_string(ctx,0)
        &&duk_is_string(ctx,1)
        &&(duk_is_boolean(ctx,2)||!duk_is_valid_index(ctx,2))
        ){
            if(duk_get_top(ctx)==2){
                String n0= duk_require_string(ctx, 0);
                String n1= duk_require_string(ctx, 1);
                duk_push_this(ctx);
                ResourceCache* native=js_to_native_object<ResourceCache>(ctx,-1);
                duk_pop(ctx);
                auto ret=native->GetResource(n0,n1);
                js_push_native_object(ctx,ret,ret->GetTypeName());
                return 1;
    
            }else if(duk_get_top(ctx)==3){
                String n0= duk_require_string(ctx, 0);
                String n1= duk_require_string(ctx, 1);
                bool n2= duk_require_boolean(ctx, 2) ? true : false;
                duk_push_this(ctx);
                ResourceCache* native=js_to_native_object<ResourceCache>(ctx,-1);
                duk_pop(ctx);
                auto ret=native->GetResource(n0,n1,n2);
                js_push_native_object(ctx,ret,ret->GetTypeName());
                return 1;
    
            }else{
                duk_error(ctx, DUK_ERR_TYPE_ERROR, "invalid argument value: 3");
            }
        }
        duk_error(ctx, DUK_ERR_TYPE_ERROR, "arguments value not match");
    }
    `
}