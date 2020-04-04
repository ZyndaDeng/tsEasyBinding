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
exports.registerArgs = {};
class ArgDataBase {
    constructor(p, ignore) {
        this.type = "string";
        //if(p.initializer){
        this.ignore = ignore;
        //}
    }
    checkFunc(idx) {
        return "duk_is_string(ctx," + idx + ")";
    }
    getFunc(idx) {
        return "const char* n" + idx + "= duk_require_string(ctx, " + idx + ");";
    }
    setFunc() {
        return "duk_push_string(ctx,ret);";
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
    checkFunc(idx) {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx) {
        return "int n" + idx + "= duk_require_int(ctx, " + idx + ");";
    }
    setFunc() {
        return "duk_push_int(ctx,ret);";
    }
}
exports.IntArg = IntArg;
class EnumArg extends ArgDataBase {
    constructor(enumName, p, def) {
        super(p, def);
        this.enumName = enumName;
        this.type = "int";
    }
    checkFunc(idx) {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx) {
        return this.enumName + " n" + idx + "=(" + this.enumName + ") duk_require_int(ctx, " + idx + ");";
    }
    setFunc() {
        return "duk_push_int(ctx,ret);";
    }
}
exports.EnumArg = EnumArg;
class UIntArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "uint";
    }
    checkFunc(idx) {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx) {
        return "unsigned n" + idx + "= duk_require_uint(ctx, " + idx + ");";
    }
    setFunc() {
        return "duk_push_uint(ctx,ret);";
    }
}
exports.UIntArg = UIntArg;
class NumberArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "number";
    }
    checkFunc(idx) {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx) {
        return "duk_double_t  n" + idx + "= duk_require_number(ctx, " + idx + ");";
    }
    setFunc() {
        return "duk_push_number(ctx,ret);";
    }
}
exports.NumberArg = NumberArg;
class BoolArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = "bool";
    }
    checkFunc(idx) {
        return "duk_is_boolean(ctx," + idx + ")";
    }
    getFunc(idx) {
        return "bool n" + idx + "= duk_require_boolean(ctx, " + idx + ") ? true : false;";
    }
    setFunc() {
        return "duk_push_boolean(ctx,ret?1:0);";
    }
}
exports.BoolArg = BoolArg;
class ArrayArg extends ArgDataBase {
    constructor(typeName, p, def) {
        super(p, def);
        this.typeName = typeName;
        this.type = "Array";
    }
    checkFunc(idx) {
        return "duk_is_array(ctx," + idx + ")";
    }
    getFunc(idx) {
        if (this.typeName == "String" || this.typeName == "string") {
            return "StringVector n" + idx + "; js_to_normal_array(ctx," + idx + ",n" + idx + ",duk_to_string);";
        }
        else if (this.typeName == "Variant") {
            return "VariantVector n" + idx + "; js_to_VariantVector(ctx," + idx + ",n" + idx + ");";
        }
        else if (this.typeName == "number") {
            return "Vector<float> n" + idx + "; js_to_normal_array(ctx," + idx + ",n" + idx + ",duk_to_number);";
        }
        else {
            return "PODVector<" + this.typeName + "*> n" + idx + "; js_to_native_array(ctx," + idx + ",n" + idx + ");";
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
        else if (this.typeName == "int" || this.typeName == "number" || this.typeName == "uint") {
            return "js_push_normal_array(ctx,ret,duk_push_number);";
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
    checkFunc(idx) {
        return "duk_is_object(ctx," + idx + ")";
    }
    getFunc(idx) {
        return this.type + " n" + idx + "= js_to_" + this.type + "(ctx, " + idx + ");";
    }
    setFunc() {
        return "js_push_" + this.type + "(ctx,ret);";
    }
}
exports.DefaultTypeArg = DefaultTypeArg;
class NativeArg extends ArgDataBase {
    constructor(p, def) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(idx) {
        return "js_is_native<" + this.type + ">(ctx," + idx + ")";
    }
    getFunc(idx) {
        return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + idx + ");";
    }
    setFunc() {
        return `js_push_native_object(ctx,ret,"` + this.type + `");`;
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