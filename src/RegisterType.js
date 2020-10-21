"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgDatas_1 = require("./ArgDatas");
const SysEmitter_1 = require("./emitter/SysEmitter");
const JSBClass_1 = require("./binding/JSBClass");
function RegisterType() {
    class Urho3DStringArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "String";
        }
        getFunc(val, idx) {
            return "String n" + idx + "= js_to_string(ctx, " + val + ");";
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
    ArgDatas_1.registerArgs["Skeleton"] = ArgDatas_1.DefaultRefTypeArg;
    ArgDatas_1.registerArgs["BiasParameters"] = ArgDatas_1.DefaultRefTypeArg;
    ArgDatas_1.registerArgs["CascadeParameters"] = ArgDatas_1.DefaultRefTypeArg;
    ArgDatas_1.registerArgs["FocusParameters"] = ArgDatas_1.DefaultRefTypeArg;
    ArgDatas_1.registerArgs["PhysicsRaycastResult"] = ArgDatas_1.DefaultRefTypeArg;
    //registerArgs["Serializer"] = DefaultPtrTypeArg
    //registerArgs["Deserializer"] = DefaultPtrTypeArg
    ArgDatas_1.registerArgs["ColorFrame"] = ArgDatas_1.DefaultPtrTypeArg;
    ArgDatas_1.registerArgs["TextureFrame"] = ArgDatas_1.DefaultPtrTypeArg;
    ArgDatas_1.registerArgs["XMLElement"] = ArgDatas_1.DefaultRefTypeArg;
    ArgDatas_1.registerArgs["XPathResultSet"] = ArgDatas_1.DefaultRefTypeArg;
    ArgDatas_1.registerArgs["XPathQuery"] = ArgDatas_1.DefaultRefTypeArg;
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
    class VectorBufferArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "VectorBuffer";
        }
        checkFunc(val) {
            return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
        }
        getFunc(val, idx) {
            return "VectorBuffer n" + idx + "; js_to_buffer(ctx," + val + ",n" + idx + ");";
        }
        setFunc() {
            return "js_push_vectorbuffer(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["VectorBuffer"] = VectorBufferArg;
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
    class AttributeInfoArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "AttributeInfo";
        }
        checkFunc(val) {
            return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
        }
        getFunc(val, idx) {
            throw new Error("not defined");
        }
        setFunc() {
            return "js_push_ref<" + this.type + ">(ctx,ret" + ",js_" + this.type + "_id)";
        }
    }
    ArgDatas_1.registerArgs["AttributeInfo"] = AttributeInfoArg;
    class AttributeInfoVectorArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "AttributeInfo";
        }
        checkFunc(val) {
            throw new Error("not defined");
        }
        getFunc(val, idx) {
            throw new Error("not defined");
        }
        setFunc() {
            return "js_push_Attributes(ctx, ret);";
        }
    }
    ArgDatas_1.registerArgs["AttributeInfoVector"] = AttributeInfoVectorArg;
    class DeserializerArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Deserializer";
        }
        checkFunc(val) {
            return "js_is_Deserializer(ctx," + val + ")";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return "js_push_urho3d_object(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Deserializer"] = DeserializerArg;
    class SerializerArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Serializer";
        }
        checkFunc(val) {
            return "js_is_Serializer(ctx," + val + ")";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return "js_push_urho3d_object(ctx,ret);";
        }
    }
    ArgDatas_1.registerArgs["Serializer"] = SerializerArg;
    class ComponentMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "Component";
        }
        checkFunc(val) {
            var _a;
            let classId = (_a = JSBClass_1.JSBClass.classes[this.type]) === null || _a === void 0 ? void 0 : _a.classId;
            if (!classId)
                classId = this.type + "::GetTypeInfoStatic()->bindingId";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return `js_push_urho3d_object(ctx,ret);`;
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
            var _a;
            let classId = (_a = JSBClass_1.JSBClass.classes[this.type]) === null || _a === void 0 ? void 0 : _a.classId;
            if (!classId)
                classId = this.type + "::GetTypeInfoStatic()->bindingId";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return `js_push_urho3d_object(ctx,ret);`;
        }
    }
    ArgDatas_1.registerArgs["ResourceMap[K]"] = ResourceMapArg;
    class UIElementMapArg extends ArgDatas_1.ArgDataBase {
        constructor(p, def) {
            super(p, def);
            this.type = "UIElement";
        }
        checkFunc(val) {
            var _a;
            let classId = (_a = JSBClass_1.JSBClass.classes[this.type]) === null || _a === void 0 ? void 0 : _a.classId;
            if (!classId)
                classId = this.type + "::GetTypeInfoStatic()->bindingId";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val, idx) {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");";
        }
        setFunc() {
            return `js_push_urho3d_object(ctx,ret);`;
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
    return JS_UNDEFINED;
}`;
    SysEmitter_1.customize["Node_GetComponents"] = `
JSValue js_Node_GetComponents(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
{
	if (argc >= 1 && JS_IsString(argv[0])
		&& (argc <= 1 || JS_IsBool(argv[1]))
		) {
		if (argc == 1) {
			const char* n0 = JS_ToCString(ctx, argv[0]);
			Node* native = js_to_native_object<Node>(ctx, this_val);
			PODVector<Component*> ret; native->GetComponents(ret,n0);
			return js_push_native_array(ctx, ret);

		}
		else if (argc == 2) {
			const char* n0 = JS_ToCString(ctx, argv[0]);
			bool n1 = JS_VALUE_GET_BOOL(argv[1]) ? true : false;
			Node* native = js_to_native_object<Node>(ctx, this_val);
			PODVector<Component*> ret; native->GetComponents(ret, n0, n1);
			return js_push_native_array(ctx, ret);

		}
		else {
			JS_ThrowTypeError(ctx, "js_Node_GetComponents invalid argument value: 2");
		}
	}
    JS_ThrowTypeError(ctx, "js_Node_GetComponents arguments value not match");
    return JS_UNDEFINED;
}`;
    SysEmitter_1.customize["FileSystem_ScanDir"] = `
JSValue js_FileSystem_ScanDir(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
{
	if (argc >= 4 && JS_IsString(argv[0]) && JS_IsString(argv[1]) && JS_IsNumber(argv[2]) && JS_IsBool(argv[3])
		) {
		if (argc == 4) {
			String n0 = JS_ToCString(ctx, argv[0]);
			String n1 = JS_ToCString(ctx, argv[1]);
			unsigned n2; JS_ToUint32(ctx, &n2, argv[2]);
			bool n3 = JS_ToBool(ctx, argv[3]);
			FileSystem* native = js_to_native_object<FileSystem>(ctx, this_val);
			StringVector ret; native->ScanDir(ret,n0,n1,n2,n3);
			return js_push_StringVector(ctx, ret);

		}
		else {
			JS_ThrowTypeError(ctx, "js_FileSystem_ScanDir invalid argument value: 4");
		}
	}
    JS_ThrowTypeError(ctx, "js_FileSystem_ScanDir arguments value not match");
    return JS_UNDEFINED;
}
`;
    SysEmitter_1.customize["PhysicsWorld_RaycastSingle"] = `
JSValue js_PhysicsWorld_RaycastSingle(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=2&&js_is_native(ctx,argv[0],js_Ray_id)
	&&JS_IsNumber(argv[1])
	&&(argc<=2||JS_IsInteger(argv[2]))
	){
		if(argc==2){
			Ray n0= js_to_Ray(ctx, argv[0]);
			double  n1=0.0; JS_ToFloat64(ctx,&n1,argv[1]);
			PhysicsWorld* native=js_to_native_object<PhysicsWorld>(ctx,this_val);
			PhysicsRaycastResult ret;native->RaycastSingle(ret,n0, n1);
			return js_push_PhysicsRaycastResult(ctx,ret);

		}else if(argc==3){
			Ray n0= js_to_Ray(ctx, argv[0]);
			double  n1=0.0; JS_ToFloat64(ctx,&n1,argv[1]);
			unsigned n2= (unsigned)JS_VALUE_GET_INT(argv[2]);
			PhysicsWorld* native=js_to_native_object<PhysicsWorld>(ctx,this_val);
			PhysicsRaycastResult ret;native->RaycastSingle(ret,n0,n1,n2);
			return js_push_PhysicsRaycastResult(ctx, ret);

		}else{
			JS_ThrowTypeError(ctx, "js_PhysicsWorld_RaycastSingle invalid argument value: 4");
		}
	}
    JS_ThrowTypeError(ctx, "js_PhysicsWorld_RaycastSingle arguments value not match");
    return JS_UNDEFINED;
}
`;
    SysEmitter_1.customize["ListView_SetSelections"] = `
JSValue js_ListView_SetSelections(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=1&&JS_IsArray(ctx,argv[0])
	){
		if(argc==1){
			PODVector<unsigned> n0; js_to_normal_array(ctx,argv[0],n0,js_to_number);
			ListView* native=js_to_native_object<ListView>(ctx,this_val);
			native->SetSelections(n0);
			return JS_UNDEFINED;

		}else{
			JS_ThrowTypeError(ctx, "js_ListView_SetSelections invalid argument value: 1");
		}
	}
    JS_ThrowTypeError(ctx, "js_ListView_SetSelections arguments value not match");
    return JS_UNDEFINED;
}
`;
    // customize["UIElement_LoadXML"]=`
    // JSValue js_UIElement_LoadXML(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
    // {
    // 	if (argc >= 1 && JS_IsString(argv[0])
    // 		) {
    // 		if (argc == 1) {
    // 			String n0 = JS_ToCString(ctx, argv[0]);
    // 			UIElement* native = js_to_native_object<UIElement>(ctx, this_val);
    // 			File file(native->GetContext());
    // 			if (!file.Open(n0, FILE_READ))
    // 				return JS_NewBool(ctx,  0);;
    // 			auto ret=native->LoadXML(file);
    // 			return JS_NewBool(ctx, ret ? 1 : 0);
    // 		}
    // 		else {
    // 			JS_ThrowTypeError(ctx, "js_UIElement_LoadXML invalid argument value: 1");
    // 		}
    // 	}
    // 	JS_ThrowTypeError(ctx, "js_UIElement_LoadXML arguments value not match");
    // }
    // `
    // customize["UIElement_SaveXML"]=`
    // JSValue js_UIElement_SaveXML(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
    // {
    // 	if (argc >= 1 && JS_IsString(argv[0])
    // 		&& (argc <= 1 || JS_IsString( argv[1]))
    // 		) {
    // 		if (argc == 1) {
    // 			String n0 = JS_ToCString(ctx, argv[0]);
    // 			UIElement* native = js_to_native_object<UIElement>(ctx, this_val);
    // 			File file(native->GetContext());
    // 			if (!file.Open(n0, FILE_WRITE))
    // 				return JS_NewBool(ctx,0);;
    // 			auto ret = native->SaveXML(file);
    // 			return JS_NewBool(ctx, ret ? 1 : 0);
    // 		}
    // 		else if (argc == 2) {
    // 			String n0 = JS_ToCString(ctx, argv[0]);
    // 			String n1 = JS_ToCString(ctx, argv[1]);
    // 			UIElement* native = js_to_native_object<UIElement>(ctx, this_val);
    // 			File file(native->GetContext());
    // 			if (!file.Open(n0, FILE_WRITE))
    // 				return JS_NewBool(ctx, 0);;
    // 			auto ret = native->SaveXML(file,n1);
    // 			return JS_NewBool(ctx, ret ? 1 : 0);
    // 		}
    // 		else {
    // 			JS_ThrowTypeError(ctx, "js_UIElement_SaveXML invalid argument value: 2");
    // 		}
    // 	}
    // 	JS_ThrowTypeError(ctx, "js_UIElement_SaveXML arguments value not match");
    // }
    // `
}
exports.RegisterCustomize = RegisterCustomize;
//# sourceMappingURL=RegisterType.js.map