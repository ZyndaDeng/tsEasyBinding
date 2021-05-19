"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeEmitter {
    constructor() {
        this.argDatas = [];
    }
    pushData(data) {
        this.argDatas.push(data);
    }
    emitDeclare(w) {
        for (let d of this.argDatas) {
            w.writeText(d.toFunc()).writeText(";").newLine();
            w.writeText(d.pushFunc()).writeText(";").newLine().newLine();
        }
    }
    emitDefine(w) {
        for (let d of this.argDatas) {
            w.writeText(d.toFunc()).writeLeftBracket().newLine();
            w.writeText(d.nativeType + "* ret=(" + d.nativeType + "*)JS_GetOpaque(thisObj, js_" + d.type + "_id);").newLine();
            w.writeText("if(ret)").writeLeftBracket().newLine();
            w.writeText("return *ret;").newLine();
            w.writeRightBracket().newLine();
            w.writeText("static " + d.nativeType + " nullRet;").newLine();
            w.writeText("return nullRet;").newLine();
            w.writeRightBracket();
            w.newLine();
            w.writeText(d.pushFunc()).writeLeftBracket().newLine();
            w.writeText(d.nativeType + "* ret=new " + d.nativeType + "(v);").newLine();
            w.writeText("JSValue jv = JS_NewObjectClass(ctx, js_" + d.type + "_id);").newLine();
            w.writeText("JS_SetOpaque(jv, vec);").newLine();
            w.writeText("return jv;").newLine();
            w.writeRightBracket();
            w.newLine();
        }
    }
}
exports.TypeEmitter = TypeEmitter;
//# sourceMappingURL=TypeEmitter.js.map