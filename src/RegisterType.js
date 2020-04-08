"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgDatas_1 = require("./ArgDatas");
const SysEmitter_1 = require("./emitter/SysEmitter");
function RegisterType() {
    class Urho3DStringArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "String";
        }
        getFunc(idx) {
            return "String n" + idx + "= duk_require_string(ctx, " + idx + ");";
        }
        setFunc() {
            return "js_push_urho3d_string(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["String"] = Urho3DStringArg;
    class StringHashArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "StringHash";
        }
        setFunc() {
            return "js_push_urho3d_string(ctx,ret.ToString());";
        }
    }
    ArgDatas_1.registerArgs["StringHash"] = StringHashArg;
    class Vector2Arg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Vector2";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "Vector2 n" + idx + "= js_to_Vector2(ctx, " + idx + ");";
        }
        setFunc() {
            return "js_push_Vector2(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Vector2"] = Vector2Arg;
    ArgDatas_1.registerArgs["Vector2Like"] = Vector2Arg;
    ArgDatas_1.registerArgs["IntVector2"] = ArgDatas_1.DefaultTypeArg;
    class Vector3Arg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Vector3";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "Vector3 n" + idx + "= js_to_Vector3(ctx, " + idx + ");";
        }
        setFunc() {
            return "js_push_Vector3(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Vector3"] = Vector3Arg;
    ArgDatas_1.registerArgs["Vector3Like"] = Vector3Arg;
    ArgDatas_1.registerArgs["IntVector3"] = ArgDatas_1.DefaultTypeArg;
    class Vector4Arg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Vector4";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "Vector4 n" + idx + "= js_to_Vector4(ctx, " + idx + ");";
        }
        setFunc() {
            return "js_push_Vector4(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Vector4"] = Vector4Arg;
    ArgDatas_1.registerArgs["Vector4Like"] = Vector4Arg;
    class PackageEntryArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "PackageEntry";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            throw new Error("no defined");
        }
        setFunc() {
            return "js_push_PackageEntry(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["PackageEntry"] = PackageEntryArg;
    class ColorArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Color";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "Color n" + idx + "= js_to_Color(ctx, " + idx + ");";
        }
        setFunc() {
            return "js_push_Color(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Color"] = ColorArg;
    ArgDatas_1.registerArgs["ColorLike"] = ColorArg;
    class RectArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Rect";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "Rect n" + idx + "= js_to_Rect(ctx, " + idx + ");";
        }
        setFunc() {
            return "js_push_Rect(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Rect"] = RectArg;
    ArgDatas_1.registerArgs["RectLike"] = RectArg;
    ArgDatas_1.registerArgs["IntRect"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Matrix2"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Matrix3"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Matrix4"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Matrix3x4"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["BoundingBox"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Plane"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["ResourceRef"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["ResourceRefList"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Quaternion"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Frustum"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Ray"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Polyhedron"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Sphere"] = ArgDatas_1.DefaultTypeArg;
    //registerArgs["Model"] = DefaultTypeArg
    class StringVectorArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "StringVector";
        }
        checkFunc(idx) {
            return "duk_is_array(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "StringVector n" + idx + "; js_to_normal_array(ctx," + idx + ",n" + idx + ",duk_to_string);";
        }
        setFunc() {
            return "js_push_StringVector(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["StringVector"] = StringVectorArg;
    class VariantArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Variant";
        }
        checkFunc(idx) {
            return "!duk_is_null_or_undefined(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "Variant n" + idx + "; js_to_Variant(ctx, " + idx + ",n" + idx + ");";
        }
        setFunc() {
            return "js_push_Variant(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Variant"] = VariantArg;
    class VariantMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "VariantMap";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            return "VariantMap n" + idx + "; js_object_to_VariantMap(ctx, " + idx + ",n" + idx + ");";
        }
        setFunc() {
            return "js_push_VariantMap(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["VariantMap"] = VariantMapArg;
    class ComponentMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Component";
        }
        checkFunc(idx) {
            return "js_is_native(ctx," + idx + ",\"" + this.type + "\")";
        }
        getFunc(idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + idx + ");";
        }
        setFunc() {
            return `if(ret)js_push_native_object(ctx,ret,ret->GetTypeName());else duk_push_undefined(ctx);`;
        }
    }
    ArgDatas_1.registerArgs["ComponentMap[K]"] = ComponentMapArg;
    ArgDatas_1.registerArgs["Component"] = ComponentMapArg;
    ArgDatas_1.registerArgs["K"] = ArgDatas_1.StringArg;
    class UIElementMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "UIElement";
        }
        checkFunc(idx) {
            return "js_is_native(ctx," + idx + ",\"" + this.type + "\")";
        }
        getFunc(idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + idx + ");";
        }
        setFunc() {
            return `if(ret)js_push_native_object(ctx,ret,ret->GetTypeName());else duk_push_undefined(ctx);`;
        }
    }
    ArgDatas_1.registerArgs["UIElementMap[K]"] = UIElementMapArg;
    ArgDatas_1.registerArgs["UIElement"] = UIElementMapArg;
    class TouchStateArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "TouchState";
        }
        checkFunc(idx) {
            return "duk_is_object(ctx," + idx + ")";
        }
        getFunc(idx) {
            throw new Error("not defined");
        }
        setFunc() {
            return "js_push_TouchState(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["VariantMap"] = VariantMapArg;
}
exports.RegisterType = RegisterType;
function RegisterCustomize() {
    SysEmitter_1.customize["ResourceCache_GetResource"] =
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
    `;
}
exports.RegisterCustomize = RegisterCustomize;
//# sourceMappingURL=RegisterType.js.map