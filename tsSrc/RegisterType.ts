import * as ts from "typescript"
import { ArgDataBase, registerArgs, DefaultTypeArg, StringArg } from "./ArgDatas";
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
            return "js_is_native(ctx," + val + ",js_"+ this.type+"_id)";
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
            return "js_is_native(ctx," + val + ","+ this.type+"::GetTypeInfoStatic()->bindingId)";
        }
        getFunc(val: string,idx:number): string {
           
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_native_object(ctx,ret,` + this.type + `::GetTypeInfoStatic()->bindingId);`
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
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ","+ this.type+"::GetTypeInfoStatic()->bindingId)";
        }
        getFunc(val: string,idx:number): string {
           
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_native_object(ctx,ret,` + this.type + `::GetTypeInfoStatic()->bindingId);`
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

    customize["Node_ScriptComponent"]=`
    duk_ret_t js_Node_ScriptComponent(duk_context* ctx)
{
	if (duk_is_constructable(ctx, 0)
		&& (duk_is_number(ctx, 1) || !duk_is_valid_index(ctx, 1))
		&& (duk_is_number(ctx, 2) || !duk_is_valid_index(ctx, 2))
		) {
		if (duk_get_top(ctx) == 1) {
			void* ptr = duk_get_heapptr(ctx, 0);
			duk_push_this(ctx);
			Node* native = js_to_native_object<Node>(ctx, -1);
			duk_pop(ctx);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret =com->createInstance(ptr);
			native->AddComponent(com,0, REPLICATED);
			duk_push_heapptr(ctx,ret);
			return 1;

		}
		else if (duk_get_top(ctx) == 2) {
			void* ptr = duk_get_heapptr(ctx, 0);
			CreateMode n1 = (CreateMode)duk_require_int(ctx, 1);
			duk_push_this(ctx);
			Node* native = js_to_native_object<Node>(ctx, -1);
			duk_pop(ctx);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret =com->createInstance(ptr);
			native->AddComponent(com, 0, n1);
			duk_push_heapptr(ctx,ret);
			return 1;

		}
		else if (duk_get_top(ctx) == 3) {
			void* ptr = duk_get_heapptr(ctx, 0);
			CreateMode n1 = (CreateMode)duk_require_int(ctx, 1);
			unsigned n2 = duk_require_uint(ctx, 2);
			duk_push_this(ctx);
			Node* native = js_to_native_object<Node>(ctx, -1);
			duk_pop(ctx);
			SharedPtr<JsComponent> com(new JsComponent(jsGetContext(ctx)));
			auto ret =com->createInstance(ptr);
			native->AddComponent(com, n2, n1);
			duk_push_heapptr(ctx,ret);
			return 1;

		}
		else {
			duk_error(ctx, DUK_ERR_TYPE_ERROR, "invalid argument value: 3");
		}
	}
	duk_error(ctx, DUK_ERR_TYPE_ERROR, "arguments value not match");
}`
}