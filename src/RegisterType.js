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
        getFunc(val, idx) {
            return "String n" + idx + "= JS_ToCString(ctx, " + val + ");";
        }
        setFunc() {
            return "js_push_urho3d_string(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["String"] = Urho3DStringArg;
    // class StringHashArg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "StringHash";
    //     }
    //     setFunc(): string {
    //         return "js_push_urho3d_string(ctx,ret.ToString());"
    //     }
    // }
    ArgDatas_1.registerArgs["StringHash"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Bone"] = ArgDatas_1.DefaultTypeArg;
    // class Vector2Arg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "Vector2";
    //     }
    //     checkFunc(idx: number): string {
    //         return "duk_is_object(ctx," + idx + ")";
    //     }
    //     getFunc(val:string,idx: number): string {
    //         return "Vector2 n" + idx + "= js_to_Vector2(ctx, " + idx + ");"
    //     }
    //     setFunc(): string {
    //         return "js_push_Vector2(ctx,ret);"
    //     }
    // }
    ArgDatas_1.registerArgs["Vector2"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["Vector2Like"] = ArgDatas_1.DefaultTypeArg;
    ArgDatas_1.registerArgs["IntVector2"] = ArgDatas_1.DefaultTypeArg;
    // class Vector3Arg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "Vector3";
    //     }
    //     checkFunc(idx: number): string {
    //         return "duk_is_object(ctx," + idx + ")";
    //     }
    //     getFunc(val:string,idx: number): string {
    //         return "Vector3 n" + idx + "= js_to_Vector3(ctx, " + idx + ");"
    //     }
    //     setFunc(): string {
    //         return "js_push_Vector3(ctx,ret);"
    //     }
    // }
    ArgDatas_1.registerArgs["Vector3"] = ArgDatas_1.DefaultTypeArg;
    //registerArgs["Vector3Like"] = Vector3Arg
    ArgDatas_1.registerArgs["IntVector3"] = ArgDatas_1.DefaultTypeArg;
    // class Vector4Arg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "Vector4";
    //     }
    //     checkFunc(idx: number): string {
    //         return "duk_is_object(ctx," + idx + ")";
    //     }
    //     getFunc(idx: number): string {
    //         return "Vector4 n" + idx + "= js_to_Vector4(ctx, " + idx + ");"
    //     }
    //     setFunc(): string {
    //         return "js_push_Vector4(ctx,ret);"
    //     }
    // }
    ArgDatas_1.registerArgs["Vector4"] = ArgDatas_1.DefaultTypeArg;
    //registerArgs["Vector4Like"] = DefaultTypeArg
    // class PackageEntryArg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "PackageEntry";
    //     }
    //     checkFunc(idx: number): string {
    //         return "duk_is_object(ctx," + idx + ")";
    //     }
    //     getFunc(idx: number): string {
    //         throw new Error("no defined");
    //     }
    //     setFunc(): string {
    //         return "js_push_PackageEntry(ctx,ret);"
    //     }
    // }
    ArgDatas_1.registerArgs["PackageEntry"] = ArgDatas_1.DefaultTypeArg;
    // class ColorArg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "Color";
    //     }
    //     checkFunc(idx: number): string {
    //         return "duk_is_object(ctx," + idx + ")";
    //     }
    //     getFunc(idx: number): string {
    //         return "Color n" + idx + "= js_to_Color(ctx, " + idx + ");"
    //     }
    //     setFunc(): string {
    //         return "js_push_Color(ctx,ret);"
    //     }
    // }
    ArgDatas_1.registerArgs["Color"] = ArgDatas_1.DefaultTypeArg;
    //registerArgs["ColorLike"] = ColorArg
    // class RectArg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "Rect";
    //     }
    //     checkFunc(idx: number): string {
    //         return "duk_is_object(ctx," + idx + ")";
    //     }
    //     getFunc(idx: number): string {
    //         return "Rect n" + idx + "= js_to_Rect(ctx, " + idx + ");"
    //     }
    //     setFunc(): string {
    //         return "js_push_Rect(ctx,ret);"
    //     }
    // }
    ArgDatas_1.registerArgs["Rect"] = ArgDatas_1.DefaultTypeArg;
    //registerArgs["RectLike"] = RectArg
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
    ArgDatas_1.registerArgs["Controls"] = ArgDatas_1.DefaultTypeArg;
    //registerArgs["Model"] = DefaultTypeArg
    class StringVectorArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "StringVector";
        }
        checkFunc(val) {
            return "JS_IsArray(ctx," + val + ")";
        }
        getFunc(val, idx) {
            return "StringVector n" + idx + "; js_to_normal_array(ctx," + val + ",n" + idx + ",JS_ToCString);";
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
        checkFunc(val) {
            return "!JS_IsUndefined(" + val + ")";
        }
        getFunc(val, idx) {
            return "Variant n" + idx + "; js_to_Variant(ctx, " + val + ",n" + idx + ");";
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
        checkFunc(val) {
            return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
        }
        getFunc(val, idx) {
            return "VariantMap n" + idx + "; js_object_to_VariantMap(ctx, " + val + ",n" + idx + ");";
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
        checkFunc(val) {
            return "js_is_native(ctx," + val + "," + this.type + "::GetTypeInfoStatic()->bindingId)";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return `js_push_native_object(ctx,ret,ret->GetTypeInfo()->bindingId);`;
        }
    }
    ArgDatas_1.registerArgs["ComponentMap[K]"] = ComponentMapArg;
    ArgDatas_1.registerArgs["Component"] = ComponentMapArg;
    ArgDatas_1.registerArgs["K"] = ArgDatas_1.StringArg;
    class ResourceMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Resource";
        }
        checkFunc(val) {
            return "js_is_native(ctx," + val + "," + this.type + "::GetTypeInfoStatic()->bindingId)";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return `js_push_native_object(ctx,ret,ret->GetTypeInfo()->bindingId);`;
        }
    }
    ArgDatas_1.registerArgs["ResourceMap[K]"] = ResourceMapArg;
    class UIElementMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "UIElement";
        }
        checkFunc(val) {
            return "js_is_native(ctx," + val + "," + this.type + "::GetTypeInfoStatic()->bindingId)";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return `js_push_native_object(ctx,ret,ret->GetTypeInfo()->bindingId);`;
        }
    }
    ArgDatas_1.registerArgs["UIElementMap[K]"] = UIElementMapArg;
    ArgDatas_1.registerArgs["UIElement"] = UIElementMapArg;
    class TouchStateArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "TouchState";
        }
        checkFunc(val) {
            return "JS_IsObject(" + val + ")";
        }
        getFunc(val, idx) {
            throw new Error("not defined");
        }
        setFunc() {
            return "js_push_TouchState(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["TouchState"] = TouchStateArg;
    class ILogicComponentArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "LogicComponent";
        }
        checkFunc(val) {
            return "JS_IsObject(" + val + ")";
        }
        getFunc(val, idx) {
            return "SharedPtr< JsDelegate> n" + idx + "(new JsDelegate(jsGetContext(ctx)));void* ptrArg = duk_get_heapptr(ctx, " + idx + ");NativeRetainJs(ctx, ptrArg, n" + idx + ");";
        }
        setFunc() {
            throw new Error("not defined");
        }
    }
    ArgDatas_1.registerArgs["ILogicComponent"] = ILogicComponentArg;
}
exports.RegisterType = RegisterType;
function RegisterCustomize() {
    SysEmitter_1.customize["Node_ScriptComponent"] = `
    JSValue js_Node_ScriptComponent(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
{
	if (JS_IsConstructor(ctx,argv[0])
		&& (argc <= 1 || JS_IsInteger(argv[1]))
		&& (argc <= 2 || JS_IsInteger(argv[2]))
		) {
		if (argc == 1) {
			Node* native = js_to_native_object<Node>(ctx, this_val);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret = com->createInstance({ctx,argv[0]});
			native->AddComponent(com, 0, REPLICATED);
			return ret.v;
		}
		else if (argc == 2) {
			Node* native = js_to_native_object<Node>(ctx, this_val);
			CreateMode n1 = (CreateMode)JS_VALUE_GET_INT(argv[1]);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret = com->createInstance({ ctx,argv[0] });
			native->AddComponent(com, 0, n1);
			return ret.v;

		}
		else if (argc == 3) {
			Node* native = js_to_native_object<Node>(ctx, this_val);
			CreateMode n1 = (CreateMode)JS_VALUE_GET_INT(argv[1]);
			unsigned n2 = JS_VALUE_GET_INT(argv[2]);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret = com->createInstance({ ctx,argv[0] });
			native->AddComponent(com, n2, n1);
			return ret.v;

		}
		else {
			JS_ThrowTypeError(ctx, "invalid argument value: 3");
		}
	}
	JS_ThrowTypeError(ctx, "arguments value not match");
}`;
}
exports.RegisterCustomize = RegisterCustomize;
//# sourceMappingURL=RegisterType.js.map