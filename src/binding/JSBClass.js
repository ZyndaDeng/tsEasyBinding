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
const ArgDatas_1 = require("../ArgDatas");
const BindingData_1 = require("../BindingData");
const JSBCustomize_1 = require("./JSBCustomize");
class JSBClass extends BindingData_1.BaseBindingData {
    constructor(dec) {
        super(dec.name ? dec.name.text : "");
        this.nativeName = this.name;
        JSBCustomize_1.JSBNativeName(this, dec);
        this.finalizer = "default_finalizer";
        if (JSBCustomize_1.JSBCommonClass(dec)) {
            this.finalizer = "js_" + this.nativeName + "_finalizer";
        }
        this.bindingType = "class";
        this.extend = "";
        if (dec.heritageClauses) {
            let node = dec.heritageClauses[0];
            let t = node.types[0];
            this.extend = t.expression.getText();
        }
        // this.includes="";
        this.methods = {};
        this.getters = {};
        //this.ctor = [];
        this.readClass(dec);
    }
    static IsMyType(data) {
        return data.bindingType == "class";
    }
    readClass(dec) {
        for (let m of dec.members) {
            if (ts.isMethodDeclaration(m)) {
                this.readMethod(m);
            }
            else if (ts.isConstructorDeclaration(m)) {
                this.readCtor(m);
            }
            else if (ts.isGetAccessorDeclaration(m)) {
                this.readGetAccessor(m);
            }
            else if (ts.isSetAccessorDeclaration(m)) {
                this.readSetAccessor(m);
            }
        }
    }
    readMethod(met) {
        let isStatic = false;
        let customizeName;
        if (met.modifiers) {
            for (let a of met.modifiers) {
                if (a.kind == ts.SyntaxKind.StaticKeyword) {
                    isStatic = true;
                    break;
                }
            }
        }
        let refArgs = JSBCustomize_1.JSBRefArgs(met);
        customizeName = JSBCustomize_1.JSBCustomize(met);
        let name = met.name.getText();
        if (this.methods[name]) {
            //这是该函数的重载
            let md = this.methods[name];
            if (!md.othersArgs)
                md.othersArgs = [];
            let arr = new Array();
            if (met.parameters) {
                for (let p of met.parameters) {
                    if (p.type) {
                        let def = undefined;
                        if (p.questionToken) {
                            def = true;
                        }
                        let ad = ArgDatas_1.buildArgData(p.type, def);
                        if (refArgs && refArgs.includes(p.getText())) {
                            ad.ref = true;
                        }
                        arr.push(ad);
                    }
                    else {
                        throw new Error("parameter type undfined");
                    }
                }
            }
            md.othersArgs.push(arr);
        }
        else {
            //添加该函数
            let md = {
                isStatic: isStatic,
                name: name,
                nativeName: name,
                args: []
            };
            if (customizeName)
                md.customize = customizeName;
            JSBCustomize_1.JSBNativeName(md, met);
            if (met.parameters) {
                for (let p of met.parameters) {
                    if (p.type) {
                        let def = undefined;
                        if (p.questionToken) {
                            def = true;
                        }
                        let ad = ArgDatas_1.buildArgData(p.type, def);
                        if (refArgs && refArgs.includes(p.name.getText())) {
                            ad.ref = true;
                        }
                        md.args.push(ad);
                    }
                    else {
                        throw new Error("parameter type undfined");
                    }
                }
            }
            if (met.type && met.type.kind != ts.SyntaxKind.VoidKeyword) {
                md.returnType = ArgDatas_1.buildArgData(met.type, undefined);
            }
            this.methods[name] = md;
        }
    }
    readCtor(met) {
        let arr = this.ctor;
        if (arr) {
            arr = new Array();
            if (!this.othersCtor) {
                this.othersCtor = [];
            }
            this.othersCtor.push(arr);
        }
        else {
            this.ctor = [];
            arr = this.ctor;
        }
        if (met.parameters) {
            for (let p of met.parameters) {
                if (p.type) {
                    let def = undefined;
                    if (p.questionToken) {
                        def = true;
                    }
                    arr.push(ArgDatas_1.buildArgData(p.type, def));
                }
                else {
                    throw new Error("parameter type undfined");
                }
            }
        }
    }
    GetterName(met, isGet) {
        let name = met.name.getText();
        let ret = { nativeName: "" };
        JSBCustomize_1.JSBNativeName(ret, met);
        if (ret.nativeName != "") {
            return ret.nativeName;
        }
        return this.defalutGetter(name, isGet);
    }
    defalutGetter(name, isGet) {
        let f = name.charAt(0);
        let otherChars = name.substring(1);
        f = f.toUpperCase();
        let getOrSet = isGet ? "Get" : "Set";
        return getOrSet + f + otherChars;
    }
    readGetAccessor(met) {
        let name = met.name.getText();
        if (!met.type)
            throw new Error("class:" + this.name + " getter " + name + " type undfined");
        if (this.getters[name]) {
            //已经存在setter
            let gd = this.getters[name];
            if (gd.get) {
                throw new Error("class:" + this.name + " getter " + name + " aready set");
            }
            gd.get = this.GetterName(met, true);
        }
        else {
            let gd = {
                name: name,
                get: this.GetterName(met, true),
                type: ArgDatas_1.buildArgData(met.type, undefined)
            };
            this.getters[name] = gd;
        }
    }
    readSetAccessor(met) {
        let name = met.name.getText();
        let p = met.parameters[0];
        if (!p.type)
            throw new Error("class:" + this.name + " setter " + name + " type undfined");
        if (this.getters[name]) {
            //已经存在getter
            let gd = this.getters[name];
            if (gd.set) {
                throw new Error("class:" + this.name + " setter " + name + " aready set");
            }
            gd.set = this.GetterName(met, false);
        }
        else {
            let gd = {
                name: name,
                set: this.GetterName(met, false),
                type: ArgDatas_1.buildArgData(p.type, undefined)
            };
            this.getters[name] = gd;
        }
    }
}
exports.JSBClass = JSBClass;
//# sourceMappingURL=JSBClass.js.map