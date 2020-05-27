import * as ts from "typescript"
import { ArgDataBase, registerArgs, DefaultTypeArg, StringArg, DefaultRefTypeArg, DefaultPtrTypeArg } from "./ArgDatas";
import { customize } from "./emitter/SysEmitter";

export function RegisterType() {

    class Urho3DStringArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "String";
        }
        getFunc(val:string,idx: number): string {
            return "String n" + idx + "= JS_ToCString(ctx, " + val + ");"
        }
        setFunc(): string {
            return "js_push_urho3d_string(ctx,ret);"
        }
    }
    registerArgs["String"] = Urho3DStringArg

    // class StringHashArg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "StringHash";
    //     }
    //     setFunc(): string {
    //         return "js_push_urho3d_string(ctx,ret.ToString());"
    //     }
    // }
    registerArgs["StringHash"] = DefaultTypeArg
    registerArgs["Bone"] = DefaultTypeArg

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
    registerArgs["Vector2"] = DefaultTypeArg
    registerArgs["Vector2Like"] = DefaultTypeArg

    registerArgs["IntVector2"] = DefaultTypeArg

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
    registerArgs["Vector3"] = DefaultTypeArg
    //registerArgs["Vector3Like"] = Vector3Arg

    registerArgs["IntVector3"] = DefaultTypeArg

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
    registerArgs["Vector4"] = DefaultTypeArg
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
    registerArgs["PackageEntry"] = DefaultTypeArg

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
    registerArgs["Color"] = DefaultTypeArg
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
    registerArgs["Rect"] = DefaultTypeArg
    //registerArgs["RectLike"] = RectArg

    
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
    registerArgs["Controls"] = DefaultTypeArg
    registerArgs["Skeleton"] = DefaultRefTypeArg
    registerArgs["BiasParameters"] = DefaultRefTypeArg
    registerArgs["CascadeParameters"] = DefaultRefTypeArg
    registerArgs["FocusParameters"] = DefaultRefTypeArg
    registerArgs["PhysicsRaycastResult"] = DefaultRefTypeArg
    registerArgs["Serializer"]=DefaultPtrTypeArg
    registerArgs["Deserializer"]=DefaultPtrTypeArg
    //registerArgs["Model"] = DefaultTypeArg

    class StringVectorArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "StringVector";
        }
        checkFunc(val: string): string {
            return "JS_IsArray(ctx," + val + ")";
        }
        getFunc(val: string,idx:number): string {
            return "StringVector n"+idx+"; js_to_normal_array(ctx,"+val+",n"+idx+",JS_ToCString);"
        }
        setFunc(): string {
                return "js_push_StringVector(ctx,ret);"    
        }
    }
    registerArgs["StringVector"]=StringVectorArg;

    class VectorBufferArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "VectorBuffer";
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
        }
        getFunc(val: string,idx:number): string {
            return "VectorBuffer n"+idx+"; js_to_buffer(ctx,"+val+",n"+idx+");"
        }
        setFunc(): string {
                return "js_push_vectorbuffer(ctx,ret);"    
        }
    }
    registerArgs["VectorBuffer"]=VectorBufferArg;

    class VariantArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Variant";
        }
        checkFunc(val: string): string {
            return "!JS_IsUndefined(" + val + ")";
        }
        getFunc(val: string,idx: number): string {

            return "Variant n" + idx + "; js_to_Variant(ctx, " + val + ",n" + idx + ");"

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
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
        }
        getFunc(val: string,idx: number): string {
            return "VariantMap n" + idx + "; js_object_to_VariantMap(ctx, " + val + ",n" + idx + ");"
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
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
        }
        getFunc(val: string,idx:number): string {
           
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_urho3d_object(ctx,ret);`
        }
    }
    
    registerArgs["ComponentMap[K]"] = ComponentMapArg
    registerArgs["Component"] = ComponentMapArg
    registerArgs["K"]=StringArg;

    class ResourceMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Resource";
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
        }
        getFunc(val: string,idx:number): string {
           
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_urho3d_object(ctx,ret);`
        }
    }
    registerArgs["ResourceMap[K]"] = ResourceMapArg

    class UIElementMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "UIElement";
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
        }
        getFunc(val: string,idx:number): string {
           
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_urho3d_object(ctx,ret);`
        }
    }
    registerArgs["UIElementMap[K]"] = UIElementMapArg
    registerArgs["UIElement"] = UIElementMapArg

    class TouchStateArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "TouchState";
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
        getFunc(val: string,idx:number): string {
           throw new Error("not defined");
        }
        setFunc(): string {
            return "js_push_TouchState(ctx,ret);"
        }
    }
    registerArgs["TouchState"] = TouchStateArg

    class ILogicComponentArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "LogicComponent";
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
        getFunc(val: string,idx: number): string {

            return "SharedPtr< JsDelegate> n"+idx+"(new JsDelegate(jsGetContext(ctx)));void* ptrArg = duk_get_heapptr(ctx, "+idx+");NativeRetainJs(ctx, ptrArg, n"+idx+");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
    }
    registerArgs["ILogicComponent"] = ILogicComponentArg
}

export function RegisterCustomize(){

    customize["Node_ScriptComponent"]=`
    JSValue js_Node_ScriptComponent(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
{
	if (JS_IsConstructor(ctx,argv[0])
		&& (argc <= 1 || JS_IsInteger(argv[1]))
		&& (argc <= 2 || JS_IsInteger(argv[2]))
		) {
		if (argc == 1) {
			Node* native = js_to_native_object<Node>(ctx, this_val);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret = com->createInstance({ctx, argv[0]});
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
}`
}