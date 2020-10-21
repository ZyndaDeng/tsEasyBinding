"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const SysEmitter_1 = require("./emitter/SysEmitter");
const JSBClass_1 = require("./binding/JSBClass");
exports.registerArgs = {};
class ArgDataBase {
    constructor(p, ignore) {
        this.type = "string";
        //if(p.initializer){
        this.ignore = ignore;
        //}
    }
    checkFunc(val) {
        return "JS_IsString(" + val + ")";
    }
    getFunc(val, idx) {
        return "const char* n" + idx + "= js_to_cstring(ctx," + val + ");";
    }
    setFunc() {
        return "JS_NewString(ctx,ret);";
    }
}
exports.ArgDataBase = ArgDataBase;
class StringArg extends ArgDataBase {
}
exports.StringArg = StringArg;
class IntArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "int";
    }
    checkFunc(val) {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val, idx) {
        return "int n" + idx + "= JS_VALUE_GET_INT(" + val + ");";
    }
    setFunc() {
        return "JS_NewInt32(ctx,ret);";
    }
}
exports.IntArg = IntArg;
class EnumArg extends ArgDataBase {
    constructor(enumName, p, def) {
        super(p, def);
        this.enumName = enumName;
        this.type = "int";
    }
    checkFunc(val) {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val, idx) {
        return this.enumName + " n" + idx + "=(" + this.enumName + ") JS_VALUE_GET_INT(" + val + ");";
    }
    setFunc() {
        return "JS_NewInt32(ctx,ret);";
    }
}
exports.EnumArg = EnumArg;
class UIntArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "uint";
    }
    checkFunc(val) {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val, idx) {
        return "unsigned n" + idx + "= (unsigned)JS_VALUE_GET_INT(" + val + ");";
    }
    setFunc() {
        return "JS_NewInt32(ctx,ret);";
    }
}
exports.UIntArg = UIntArg;
class NumberArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "number";
    }
    checkFunc(val) {
        return "JS_IsNumber(" + val + ")";
    }
    getFunc(val, idx) {
        return "double  n" + idx + "=0.0; JS_ToFloat64(ctx,&n" + idx + "," + val + ");";
    }
    setFunc() {
        return "JS_NewFloat64(ctx,ret);";
    }
}
exports.NumberArg = NumberArg;
class BoolArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "bool";
    }
    checkFunc(val) {
        return "JS_IsBool(" + val + ")";
    }
    getFunc(val, idx) {
        return "bool n" + idx + "= JS_VALUE_GET_BOOL(" + val + ") ? true : false;";
    }
    setFunc() {
        return "JS_NewBool(ctx,ret?1:0);";
    }
}
exports.BoolArg = BoolArg;
class ArrayArg extends ArgDataBase {
    constructor(typeName, p, def) {
        super(p, def);
        this.typeName = typeName;
        this.type = "Array";
    }
    checkFunc(val) {
        return "JS_IsArray(ctx," + val + ")";
    }
    getFunc(val, idx) {
        if (this.typeName == "String" || this.typeName == "string") {
            return "StringVector n" + idx + "; js_to_normal_array(ctx," + val + ",n" + idx + ",JS_ToCString);";
        }
        else if (this.typeName == "Variant") {
            return "VariantVector n" + idx + "; js_to_VariantVector(ctx," + val + ",n" + idx + ");";
        }
        else if (this.typeName == "number") {
            return "Vector<float> n" + idx + "; js_to_normal_array(ctx," + val + ",n" + idx + ",js_to_number);";
        }
        else {
            return "PODVector<" + this.typeName + "*> n" + idx + "; js_to_native_array(ctx," + val + ",n" + idx + ");";
        }
        //return "Vector2 n" + idx + "= js_to_vector2(ctx, " + idx + ");"
    }
    setFunc() {
        if (this.typeName == "String" || this.typeName == "string") {
            return "js_push_StringVector(ctx,ret);";
        }
        else if (this.typeName == "Variant") {
            return "js_push_VariantVector(ctx,ret);";
        }
        else if (this.typeName == "int" || this.typeName == "uint") {
            return "js_push_normal_array(ctx,ret,JS_NewInt32);";
        }
        else if (this.typeName == "number") {
            return "js_push_normal_array(ctx,ret,JS_NewFloat64);";
        }
        return "js_push_native_array(ctx,ret);";
    }
}
exports.ArrayArg = ArrayArg;
class DefaultTypeArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val) {
        return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
    }
    getFunc(val, idx) {
        return this.type + " n" + idx + "= js_to_" + this.type + "(ctx, " + val + ");";
    }
    setFunc() {
        return "js_push_" + this.type + "(ctx,ret);";
    }
}
exports.DefaultTypeArg = DefaultTypeArg;
class DefaultRefTypeArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val) {
        return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
    }
    getFunc(val, idx) {
        return this.type + " n" + idx + "= js_to_ref<" + this.type + ">(ctx, " + val + ",js_" + this.type + "_id);";
    }
    setFunc() {
        return "js_push_copy<" + this.type + ">(ctx,ret,js_" + this.type + "_id);";
    }
}
exports.DefaultRefTypeArg = DefaultRefTypeArg;
class DefaultPtrTypeArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val) {
        return "js_is_native(ctx," + val + ",js_" + this.type + "_id)";
    }
    getFunc(val, idx) {
        return this.type + "* n" + idx + "= js_to_ptr<" + this.type + ">(ctx, " + val + ",js_" + this.type + "_id);";
    }
    setFunc() {
        return "js_push_ptr<" + this.type + ">(ctx,ret,js_" + this.type + "_id);";
    }
}
exports.DefaultPtrTypeArg = DefaultPtrTypeArg;
class NativeArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = p.getText();
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
        var _a;
        let classId = (_a = JSBClass_1.JSBClass.classes[this.type]) === null || _a === void 0 ? void 0 : _a.classId;
        if (!classId) {
            throw new Error(this.type + " has not register");
        }
        if (classId.endsWith("->bindingId")) {
            //classId="ret->GetTypeInfo()->bindingId";
            return `js_push_urho3d_object(ctx,ret);`;
        }
        return `js_push_native_object(ctx,ret,` + classId + `);`;
    }
}
exports.NativeArg = NativeArg;
function buildArgData(p, def) {
    let ret = undefined;
    if (p.kind == ts.SyntaxKind.NumberKeyword) {
        ret = new NumberArg(p, def);
    }
    else if (p.kind == ts.SyntaxKind.StringKeyword) {
        ret = new StringArg(p, def);
    }
    else if (p.kind == ts.SyntaxKind.BooleanKeyword) {
        ret = new BoolArg(p, def);
    }
    else {
        let t = p.getText();
        if (SysEmitter_1.enumDefined.includes(t)) {
            ret = new EnumArg(t, p, def);
        }
        else if (t.includes("Array")) {
            if (ts.isTypeReferenceNode(p)) {
                if (p.typeArguments) {
                    let typeName = p.typeArguments[0].getText();
                    ret = new ArrayArg(typeName, p, def);
                }
                else {
                    throw new Error("Array type argument can not be null");
                }
            }
            else {
                throw new Error("Array type argument can not be null");
            }
        }
        else if ("int" == t) {
            ret = new IntArg(p, def);
        }
        else if ("uint" == t) {
            ret = new UIntArg(p, def);
        }
        else if (exports.registerArgs[t]) {
            ret = new exports.registerArgs[t](p, def);
        }
        else {
            ret = new NativeArg(p, def);
        }
    }
    return ret;
}
exports.buildArgData = buildArgData;
//# sourceMappingURL=ArgDatas.js.map