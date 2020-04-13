"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BindingPackage_1 = require("./BindingPackage");
const SysEmitter_1 = require("./emitter/SysEmitter");
const RegisterType_1 = require("./RegisterType");
function main() {
    let arr = new Array();
    arr.push(new BindingPackage_1.BindingPackage(`#include "Resource/Resource.h"
    #include "Resource/Image.h"
    #include "Resource/JSONValue.h"
    #include "Resource/JSONFile.h"
    #include "Resource/XMLElement.h"
    #include "Resource/XMLFile.h"
    #include "Resource/ResourceCache.h"
    #include "Resource/Localization.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "ResourceApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Resource.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Core/Context.h"
    #include "Core/Object.h"
    #include "Core/ProcessUtils.h"
    #include "Core/StringUtils.h"
    #include "Core/Variant.h"
    #include "IO/VectorBuffer.h"
    #include "Core/Spline.h"
    #include "Core/Timer.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "CoreApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Core.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Math/MathDefs.h"
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
using namespace Urho3D;`, "MathApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Math.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Engine/Console.h"
    #include "Engine/DebugHud.h"
    #include "Engine/Engine.h"
    #include "UI/Text.h"
    #include "UI/BorderImage.h"
    #include "UI/Button.h"
    #include "UI/LineEdit.h"
    #include "Resource/XMLFile.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "EngineApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Engine.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Audio/Audio.h"
    #include "IO/File.h"
    #include "Audio/Sound.h"
    #include "Audio/SoundListener.h"
    #include "Audio/SoundSource.h"
    #include "Audio/SoundSource3D.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "AudioApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Audio.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Input/Controls.h"
    #include "IO/File.h"
    #include "Input/Input.h"
    #include "Input/InputEvents.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "InputApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Input.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "IO/Compression.h"
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
using namespace Urho3D;`, "IOApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/IO.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Scene/ValueAnimation.h"
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
using namespace Urho3D;`, "SceneApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Scene.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Physics/CollisionShape.h"
    #include "Physics/Constraint.h"
    #include "Physics/PhysicsWorld.h"
    #include "Physics/RigidBody.h"
    #include "Graphics/Model.h"
    #include "Physics/RaycastVehicle.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "PhysicsApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Physics.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Graphics/GraphicsDefs.h"
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
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "GraphicsApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Graphics.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "IO/File.h"
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
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "UIApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/UI.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "IK/IKSolver.h"
    #include "IK/IKConstraint.h"
    #include "IK/IKEffector.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "IKApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/IK.ts"
    ]));
    arr.push(new BindingPackage_1.BindingPackage(`#include "Network/Connection.h"
    #include "Network/HttpRequest.h"
    #include "Network/Network.h"
    #include "Scene/Scene.h"
    #include "Input/Controls.h"
    #include "Network/NetworkPriority.h"
    #include <JavaScript/easyBindings/ValTran.h>
#include <JavaScript/easyBindings/BindingSys.h>
using namespace Urho3D;`, "NetworkApi", [
        "../zyndaurho3d/game/tsSrc/Urho3D/Network.ts"
    ]));
    let config = {
        packages: arr,
        cppPath: "../zyndaurho3d/Source/Urho3D/JavaScript/easyBindings/jsbApis/",
    };
    RegisterType_1.RegisterType();
    RegisterType_1.RegisterCustomize();
    let sysEmit = new SysEmitter_1.SysEmitter(config);
    sysEmit.emit();
}
main();
//# sourceMappingURL=main.js.map