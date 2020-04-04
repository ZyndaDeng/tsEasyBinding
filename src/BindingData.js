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
const ArgDatas_1 = require("./ArgDatas");
class BaseBindingData {
    constructor(name) {
        this.name = name;
    }
    getModule() {
        let ret = undefined;
        if (this.parent) {
            ret = [];
            for (let p = this.parent; p != undefined; p = p.parent) {
                if (p)
                    ret.push(p.name);
            }
        }
        return ret;
    }
}
exports.BaseBindingData = BaseBindingData;
class ModuleData extends BaseBindingData {
    constructor(name) {
        super(name);
        this.bindingType = "module";
        this.members_ = [];
    }
    static IsMyType(data) {
        return data.bindingType == "module";
    }
    addMember(m) {
        //if (this.members_[m.name]) throw new Error("member[" + m.name + "] aready in module[" + this.name + "]");
        m.parent = this;
        this.members_.push(m);
    }
    // removeMember(arg: BaseBindingData | string) {
    //     if (typeof arg == "string") {
    //         let m = this.members_[arg];
    //         if (m) {
    //             m.parent = undefined;
    //             delete this.members_[arg];
    //         }
    //     } else {
    //         let m = this.members_[arg.name];
    //         if (m && m == arg) {
    //             m.parent = undefined;
    //             delete this.members_[arg.name];
    //         } else {
    //             throw new Error("that is not the member of this module");
    //         }
    //     }
    // }
    get members() {
        return this.members_;
    }
}
exports.ModuleData = ModuleData;
class VarData extends BaseBindingData {
    constructor(node) {
        if (node.type) {
            super(node.name.getText());
            this.arg = ArgDatas_1.buildArgData(node.type, undefined);
        }
        else {
            throw new Error("type undefine");
        }
        this.bindingType = "var";
    }
    static IsMyType(data) {
        return data.bindingType == "var";
    }
}
exports.VarData = VarData;
class FuncData extends BaseBindingData {
    constructor(node) {
        var _a;
        let name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.getText();
        if (!name)
            throw new Error("function name undfined");
        super(name);
        this.bindingType = "func";
        this.args = [];
        if (node.parameters) {
            for (let p of node.parameters) {
                if (p.type) {
                    let def = undefined;
                    if (p.questionToken) {
                        def = true;
                    }
                    let ad = ArgDatas_1.buildArgData(p.type, def);
                    // if(refArgs.includes(p.name.getText())){
                    //     ad.ref=true;
                    // }
                    this.args.push(ad);
                }
                else {
                    throw new Error("parameter type undfined");
                }
            }
        }
        if (node.type && node.type.kind != ts.SyntaxKind.VoidKeyword) {
            this.returnType = ArgDatas_1.buildArgData(node.type, undefined);
        }
    }
    static IsMyType(data) {
        return data.bindingType == "func";
    }
}
exports.FuncData = FuncData;
class ClassData extends BaseBindingData {
    constructor(dec) {
        super(dec.name ? dec.name.text : "");
        //this.name = dec.name ? dec.name.text : "";
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
        let refArgs = new Array();
        if (met.decorators) {
            for (let d of met.decorators) {
                if (d.expression) {
                    if (ts.isCallExpression(d.expression)) {
                        if (d.expression.expression.getText() == "refArgs") {
                            for (let a of d.expression.arguments) {
                                refArgs.push(a.getText());
                            }
                        }
                        else if (d.expression.expression.getText() == "customize") {
                            customizeName = d.expression.arguments[0].getText();
                        }
                    }
                }
            }
        }
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
                        if (refArgs.includes(p.getText())) {
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
                args: []
            };
            if (customizeName)
                md.customize = customizeName;
            if (met.parameters) {
                for (let p of met.parameters) {
                    if (p.type) {
                        let def = undefined;
                        if (p.questionToken) {
                            def = true;
                        }
                        let ad = ArgDatas_1.buildArgData(p.type, def);
                        if (refArgs.includes(p.name.getText())) {
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
        if (met.decorators) {
            for (let d of met.decorators) {
                if (ts.isCallExpression(d.expression)) {
                    if (d.expression.expression.getText() == "nativeName") {
                        let a = d.expression.arguments[0];
                        return a.getText();
                    }
                }
            }
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
exports.ClassData = ClassData;
//# sourceMappingURL=BindingData.js.map