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
        //记录继承关系
        this.extend = "";
        if (dec.heritageClauses) {
            let node = dec.heritageClauses[0];
            let t = node.types[0];
            this.extend = t.expression.getText();
        }
        JSBClass.classes[this.name] = this;
        this.defaultData(dec);
        JSBCustomize_1.JSBNativeName(this, dec);
        if (JSBCustomize_1.JSBCommonClass(dec)) {
            this.finalizer = "js_" + this.name + "_finalizer";
        }
        this.bindingType = "class";
        // this.includes="";
        this.methods = {};
        this.getters = {};
        //this.ctor = [];
        this.readClass(dec);
    }
    //默认初始值
    defaultData(dec) {
        this.nativeName = this.name;
        this.finalizer = "default_finalizer";
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
            if (!md.override)
                md.override = [];
            let arr = new Array();
            let returnType = undefined;
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
                        arr.push(ad);
                    }
                    else {
                        throw new Error("parameter type undfined");
                    }
                }
            }
            if (met.type && met.type.kind != ts.SyntaxKind.VoidKeyword) {
                returnType = ArgDatas_1.buildArgData(met.type, undefined);
            }
            md.override.push({ returnType: returnType, args: arr });
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
        let self = { nativeName: "" };
        let ret = this.defaultGetter(name, isGet);
        JSBCustomize_1.JSBNativeName(self, met);
        if (self.nativeName != "") {
            ret.name = self.nativeName;
        }
        let getset = JSBCustomize_1.JSBGetSet(met);
        if (getset) {
            ret.name = getset;
            ret.isFunc = false;
        }
        return ret;
    }
    /**
    * 设置默认的getset变量对应规则
    */
    defaultGetter(name, isGet) {
        return { name: name, isFunc: false };
    }
    readGetAccessor(met) {
        let isStatic = false;
        if (met.modifiers) {
            for (let a of met.modifiers) {
                if (a.kind == ts.SyntaxKind.StaticKeyword) {
                    isStatic = true;
                    break;
                }
            }
        }
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
                type: ArgDatas_1.buildArgData(met.type, undefined),
                isStatic: isStatic
            };
            this.getters[name] = gd;
        }
    }
    readSetAccessor(met) {
        let isStatic = false;
        if (met.modifiers) {
            for (let a of met.modifiers) {
                if (a.kind == ts.SyntaxKind.StaticKeyword) {
                    isStatic = true;
                    break;
                }
            }
        }
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
                type: ArgDatas_1.buildArgData(p.type, undefined),
                isStatic: isStatic
            };
            this.getters[name] = gd;
        }
    }
    get classId() {
        return "js_" + this.nativeName + "_id";
    }
    isInstanceof(jsbClass) {
        let cur = this;
        // if(this.name=="Object"){
        //     return true;
        // }
        while (cur) {
            if (cur == jsbClass) {
                return true;
            }
            cur = JSBClass.classes[cur.extend];
        }
        return false;
    }
}
exports.JSBClass = JSBClass;
JSBClass.classes = {};
//# sourceMappingURL=JSBClass.js.map