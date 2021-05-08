import { ArgData, ArgDataBase, DefaultPtrTypeArg, DefaultRefTypeArg, DefaultTypeArg, RegisterTypeMap, StringArg } from "../ArgDatas";
import { BindingPackage } from "../BindingPackage";
import { BindingConfig, SysEmitter } from "../emitter/SysEmitter";
import * as ts from "typescript"
import { JSBClass } from "../binding/JSBClass";

export function urho3dConfig(){
    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(`#include "Resource/Resource.h"
    #include "Resource/Image.h"
    #include "Resource/JSONValue.h"
    #include "Resource/JSONFile.h"
    #include "Resource/XMLElement.h"
    #include "Resource/XMLFile.h"
    #include "Resource/ResourceCache.h"
    #include "Resource/Localization.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "ResourceApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Resource.ts"
    ]));
    arr.push(new BindingPackage(`#include "Core/Context.h"
    #include "Core/Object.h"
    #include "Core/ProcessUtils.h"
    #include "Core/StringUtils.h"
    #include "Core/Variant.h"
    #include "IO/VectorBuffer.h"
    #include "Core/Spline.h"
    #include "Core/Timer.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "CoreApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Core.ts"
    ]));
    arr.push(new BindingPackage(`#include "Math/MathDefs.h"
    #include "Math/BoundingBox.h"
    #include "Math/Color.h"
    #include "Math/Frustum.h"
    #include "Math/Matrix3.h"
    #include "Math/Matrix3x4.h"
    #include "Math/Matrix4.h"
    #include "Math/Plane.h"
    #include "Math/Polyhedron.h"
    #include "Math/Quaternion.h"
    #include "Math/Random.h"
    #include "Math/Ray.h"
    #include "Math/Rect.h"
    #include "Math/Sphere.h"
    #include "Math/StringHash.h"
    #include "Math/Vector2.h"
    #include "Math/Vector3.h"
    #include "Math/Vector4.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "MathApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Math.ts"
    ]));
    
    arr.push(new BindingPackage(`#include "Engine/Console.h"
    #include "Engine/DebugHud.h"
    #include "Engine/Engine.h"
    #include "UI/Text.h"
    #include "UI/BorderImage.h"
    #include "UI/Button.h"
    #include "UI/LineEdit.h"
    #include "Resource/XMLFile.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "EngineApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Engine.ts"
    ]));
    arr.push(new BindingPackage(`#include "Audio/Audio.h"
    #include "IO/File.h"
    #include "Audio/Sound.h"
    #include "Audio/SoundListener.h"
    #include "Audio/SoundSource.h"
    #include "Audio/SoundSource3D.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "AudioApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Audio.ts"
    ]));
    arr.push(new BindingPackage(`#include "Input/Controls.h"
    #include "IO/File.h"
    #include "Input/Input.h"
    #include "Input/InputEvents.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "InputApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Input.ts"
    ]));
    arr.push(new BindingPackage(`#include "IO/Compression.h"
    #include "IO/Deserializer.h"
    #include "IO/File.h"
    #include "IO/FileSystem.h"
    #include "IO/Log.h"
    #include "IO/NamedPipe.h"
    #include "IO/PackageFile.h"
    #include "IO/Serializer.h"
    #include "IO/VectorBuffer.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "IOApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/IO.ts"
    ]));
    arr.push(new BindingPackage(`#include "Scene/ValueAnimation.h"
    #include "Scene/ObjectAnimation.h"
    #include "Scene/Serializable.h"
    #include "Scene/Animatable.h"
    #include "Scene/Component.h"
    #include "IO/File.h"
    #include "JavaScript/JsComponent.h"
    #include "Scene/Node.h"
    #include "Resource/ResourceCache.h"
    #include "Scene/Scene.h"
    #include "Network/Connection.h"
    #include "Scene/SplinePath.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "SceneApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Scene.ts"
    ]));
    arr.push(new BindingPackage(`#include "Physics/CollisionShape.h"
    #include "Physics/Constraint.h"
    #include "Physics/PhysicsWorld.h"
    #include "Physics/RigidBody.h"
    #include "Graphics/Model.h"
    #include "Graphics/CustomGeometry.h"
    #include "Physics/RaycastVehicle.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "PhysicsApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Physics.ts"
    ]));
    arr.push(new BindingPackage(`#include "Graphics/GraphicsDefs.h"
    #include "Graphics/Drawable.h"
    #include "Graphics/AnimatedModel.h"
    #include "Graphics/Animation.h"
    #include "Graphics/AnimationController.h"
    #include "Graphics/AnimationState.h"
    #include "Graphics/BillboardSet.h"
    #include "Graphics/Camera.h"
    #include "Graphics/CustomGeometry.h"
    #include "Graphics/DebugRenderer.h"
    #include "Graphics/DecalSet.h"
    #include "IO/File.h"
    #include "Graphics/Graphics.h"
    #include "Graphics/Light.h"
    #include "Graphics/Material.h"
    #include "Graphics/VertexBuffer.h"
    #include "Graphics/IndexBuffer.h"
    #include "Graphics/Geometry.h"
    #include "Graphics/Model.h"
    #include "Graphics/Octree.h"
    #include "Graphics/OctreeQuery.h"
    #include "Graphics/ParticleEffect.h"
    #include "Graphics/ParticleEmitter.h"
    #include "Graphics/Renderer.h"
    #include "Graphics/RenderPath.h"
    #include "Graphics/RenderSurface.h"
    #include "Graphics/RibbonTrail.h"
    #include "Graphics/Skeleton.h"
    #include "Graphics/Skybox.h"
    #include "Graphics/StaticModel.h"
    #include "Graphics/StaticModelGroup.h"
    #include "Graphics/Technique.h"
    #include "Graphics/Terrain.h"
    #include "Graphics/TerrainPatch.h"
    #include "Graphics/Texture.h"
    #include "Graphics/Texture2D.h"
    #include "Graphics/Texture2DArray.h"
    #include "Graphics/Texture3D.h"
    #include "Graphics/TextureCube.h"
    #include "Graphics/Viewport.h"
    #include "Graphics/Zone.h"
    #include "Scene/Scene.h"
    #include "Scene/ValueAnimation.h"
    #include "Math/Polyhedron.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "GraphicsApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Graphics.ts"
    ]));
    arr.push(new BindingPackage(`#include "IO/File.h"
    #include "UI/UIElement.h"
    #include "UI/BorderImage.h"
    #include "UI/Button.h"
    #include "UI/CheckBox.h"
    #include "UI/Cursor.h"
    #include "UI/FileSelector.h"
    #include "UI/Font.h"
    #include "UI/LineEdit.h"
    #include "UI/Menu.h"
    #include "UI/MessageBox.h"
    #include "UI/ProgressBar.h"
    #include "UI/DropDownList.h"
    #include "UI/Slider.h"
    #include "UI/ScrollBar.h"
    #include "UI/ScrollView.h"
    #include "UI/ListView.h"
    #include "UI/Sprite.h"
    #include "UI/Text.h"
    #include "UI/Text3D.h"
    #include "UI/ToolTip.h"
    #include "UI/UI.h"
    #include "UI/Window.h"
    #include "UI/View3D.h"
    #include "UI/UIComponent.h"
    #include "Scene/Scene.h"
    #include "Graphics/Texture2D.h"
    #include "Graphics/Viewport.h"
    #include "Graphics/Camera.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`
    ,
    "UIApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/UI.ts"
    ]));
    arr.push(new BindingPackage(`#include "IK/IKSolver.h"
    #include "IK/IKConstraint.h"
    #include "IK/IKEffector.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "IKApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/IK.ts"
    ]));
    arr.push(new BindingPackage(`#include "Network/Connection.h"
    #include "Network/HttpRequest.h"
    #include "Network/Network.h"
    #include "Scene/Scene.h"
    #include "Input/Controls.h"
    #include "Network/NetworkPriority.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`,
    "NetworkApi",
    [
        "../zyndaurho3d/game/tsSrc/Urho3D/Network.ts"
    ]));
    
    let config:BindingConfig={
        packages:arr,
        cppPath:"../zyndaurho3d/Source/Urho3D/JavaScript/easyBindings/jsbApis/",
        registerTypes:registerType(),
        customize:registerCustomize(),
    }

    let sysEmit=new SysEmitter(config);
    sysEmit.emit();
}

function registerType(){
    let ret:RegisterTypeMap={};
    class Urho3DStringArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "String";
        }
        getFunc(val: string, idx: number): string {
            return "String n" + idx + "= js_to_string(ctx, " + val + ");"
        }
        setFunc(): string {
            return "js_push_urho3d_string(ctx,ret);"
        }
    }
    ret["String"] = Urho3DStringArg

    // class StringHashArg extends ArgDataBase {
    //     constructor(p: ts.TypeNode, def?: boolean) {
    //         super(p, def);
    //         this.type = "StringHash";
    //     }
    //     setFunc(): string {
    //         return "js_push_urho3d_string(ctx,ret.ToString());"
    //     }
    // }
    ret["StringHash"] = DefaultTypeArg
    ret["Bone"] = DefaultTypeArg

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
    ret["Vector2"] = DefaultTypeArg
    ret["Vector2Like"] = DefaultTypeArg

    ret["IntVector2"] = DefaultTypeArg

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
    ret["Vector3"] = DefaultTypeArg
    //registerArgs["Vector3Like"] = Vector3Arg

    ret["IntVector3"] = DefaultTypeArg

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
    ret["Vector4"] = DefaultTypeArg
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
    ret["PackageEntry"] = DefaultTypeArg

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
    ret["Color"] = DefaultTypeArg
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
    ret["Rect"] = DefaultTypeArg
    //registerArgs["RectLike"] = RectArg


    ret["IntRect"] = DefaultTypeArg
    ret["Matrix2"] = DefaultTypeArg
    ret["Matrix3"] = DefaultTypeArg
    ret["Matrix4"] = DefaultTypeArg
    ret["Matrix3x4"] = DefaultTypeArg
    ret["BoundingBox"] = DefaultTypeArg
    ret["Plane"] = DefaultTypeArg
    ret["ResourceRef"] = DefaultTypeArg
    ret["ResourceRefList"] = DefaultTypeArg
    ret["Quaternion"] = DefaultTypeArg
    ret["Frustum"] = DefaultTypeArg
    ret["Ray"] = DefaultTypeArg
    ret["Polyhedron"] = DefaultTypeArg
    ret["Sphere"] = DefaultTypeArg
    ret["Controls"] = DefaultTypeArg
    ret["Skeleton"] = DefaultRefTypeArg
    ret["BiasParameters"] = DefaultRefTypeArg
    ret["CascadeParameters"] = DefaultRefTypeArg
    ret["FocusParameters"] = DefaultRefTypeArg
    ret["PhysicsRaycastResult"] = DefaultRefTypeArg
    //registerArgs["Serializer"] = DefaultPtrTypeArg
    //registerArgs["Deserializer"] = DefaultPtrTypeArg
    ret["ColorFrame"] = DefaultPtrTypeArg
    ret["TextureFrame"] = DefaultPtrTypeArg
    ret["XMLElement"]=DefaultRefTypeArg
    ret["XPathResultSet"]=DefaultRefTypeArg
    ret["XPathQuery"]=DefaultRefTypeArg
    //registerArgs["Model"] = DefaultTypeArg

    class StringVectorArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "StringVector";
        }
        checkFunc(val: string): string {
            return "JS_IsArray(ctx," + val + ")";
        }
        getFunc(val: string, idx: number): string {
            return "StringVector n" + idx + "; js_to_normal_array(ctx," + val + ",n" + idx + ",JS_ToCString);"
        }
        setFunc(): string {
            return "js_push_StringVector(ctx,ret);"
        }
    }
    ret["StringVector"] = StringVectorArg;

    class VectorBufferArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "VectorBuffer";
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
        }
        getFunc(val: string, idx: number): string {
            return "VectorBuffer n" + idx + "; js_to_buffer(ctx," + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_vectorbuffer(ctx,ret);"
        }
    }
    ret["VectorBuffer"] = VectorBufferArg;

    class VariantArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Variant";
        }
        checkFunc(val: string): string {
            return "!JS_IsUndefined(" + val + ")";
        }
        getFunc(val: string, idx: number): string {

            return "Variant n" + idx + "; js_to_Variant(ctx, " + val + ",n" + idx + ");"

        }
        setFunc(): string {
            return "js_push_Variant(ctx,ret);"
        }
    }
    ret["Variant"] = VariantArg

    class VariantMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "VariantMap";
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
        }
        getFunc(val: string, idx: number): string {
            return "VariantMap n" + idx + "; js_object_to_VariantMap(ctx, " + val + ",n" + idx + ");"
        }
        setFunc(): string {
            return "js_push_VariantMap(ctx,ret);"
        }
    }
    ret["VariantMap"] = VariantMapArg

    class AttributeInfoArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "AttributeInfo";
        }
        checkFunc(val: string): string {
            return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
        }
        getFunc(val: string, idx: number): string {
            throw new Error("not defined");
        }
        setFunc(): string {
            return "js_push_ref<"+this.type+">(ctx,ret"+ ",js_" + this.type + "_id)";
        }
    }
    ret["AttributeInfo"] = AttributeInfoArg

    class AttributeInfoVectorArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "AttributeInfo";
        }
        checkFunc(val: string): string {
            throw new Error("not defined");
        }
        getFunc(val: string, idx: number): string {
            throw new Error("not defined");
        }
        setFunc(): string {
            return "js_push_Attributes(ctx, ret);";
        }
    }
    ret["AttributeInfoVector"] = AttributeInfoVectorArg

    class DeserializerArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Deserializer";
        }
        checkFunc(val: string): string {
            return "js_is_Deserializer(ctx," + val + ")";
        }
        getFunc(val: string, idx: number): string {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return "js_push_urho3d_object(ctx,ret);"
        }
    }
    ret["Deserializer"] = DeserializerArg;

    class SerializerArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Serializer";
        }
        checkFunc(val: string): string {
            return "js_is_Serializer(ctx," + val + ")";
        }
        getFunc(val: string, idx: number): string {
            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return "js_push_urho3d_object(ctx,ret);"
        }
    }
    ret["Serializer"] = SerializerArg;

    class ComponentMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Component";
        }
        checkFunc(val: string): string {
            let classId = JSBClass.classes[this.type]?.classId;
            if (!classId) classId = this.type + "::GetTypeInfoStatic()->bindingId";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val: string, idx: number): string {

            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_urho3d_object(ctx,ret);`
        }
    }

    ret["ComponentMap[K]"] = ComponentMapArg
    ret["Component"] = ComponentMapArg
    ret["K"] = StringArg;

    class ResourceMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "Resource";
        }
        checkFunc(val: string): string {
            let classId = JSBClass.classes[this.type]?.classId;
            if (!classId) classId = this.type + "::GetTypeInfoStatic()->bindingId";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val: string, idx: number): string {

            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_urho3d_object(ctx,ret);`
        }
    }
    ret["ResourceMap[K]"] = ResourceMapArg

    class UIElementMapArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "UIElement";
        }
        checkFunc(val: string): string {
            let classId = JSBClass.classes[this.type]?.classId;
            if (!classId) classId = this.type + "::GetTypeInfoStatic()->bindingId";
            return "js_is_native(ctx," + val + "," + classId + ")";
        }
        getFunc(val: string, idx: number): string {

            return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
        }
        setFunc(): string {
            return `js_push_urho3d_object(ctx,ret);`
        }
    }
    ret["UIElementMap[K]"] = UIElementMapArg
    ret["UIElement"] = UIElementMapArg

    class TouchStateArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "TouchState";
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
        getFunc(val: string, idx: number): string {
            throw new Error("not defined");
        }
        setFunc(): string {
            return "js_push_TouchState(ctx,ret);"
        }
    }
    ret["TouchState"] = TouchStateArg

    class ILogicComponentArg extends ArgDataBase {
        constructor(p: ts.TypeNode, def?: boolean) {
            super(p, def);
            this.type = "LogicComponent";
        }
        checkFunc(val: string): string {
            return "JS_IsObject(" + val + ")";
        }
        getFunc(val: string, idx: number): string {

            return "SharedPtr< JsDelegate> n" + idx + "(new JsDelegate(jsGetContext(ctx)));void* ptrArg = duk_get_heapptr(ctx, " + idx + ");NativeRetainJs(ctx, ptrArg, n" + idx + ");"
        }
        setFunc(): string {
            throw new Error("not defined");
        }
    }
    ret["ILogicComponent"] = ILogicComponentArg
    return ret;
}

function registerCustomize() {
    let ret:{[name:string]:string}={};
    ret["Node_ScriptComponent"] = `
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
}`
ret["Node_GetComponents"] = `
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
}`
ret["FileSystem_ScanDir"]=`
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
`
ret["PhysicsWorld_RaycastSingle"]=`
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
`
ret["ListView_SetSelections"]=`
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
`
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

return ret;
}