"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BindingData_1 = require("../BindingData");
const fs = __importStar(require("fs"));
const Sys_1 = require("../Sys");
const ts = __importStar(require("typescript"));
const writter_1 = require("../writter");
const EmitterFactory_1 = require("./EmitterFactory");
const TsEmitter_1 = require("../TsEmitter");
exports.customize = {};
exports.enumDefined = new Array();
class SysEmitter {
    constructor(config) {
        this.config = config;
        //this.enumDefined = [];
        this.moduleStack = [];
        this.processData = [];
        // this.shouldFirstDefineList = [];
        // this.undefineList = {};
    }
    openModule(module) {
        this.moduleStack.push(module);
    }
    closeModule() {
        if (this.moduleStack.length == 0) {
            throw new Error("no module to close");
        }
        this.moduleStack.pop();
    }
    addData(data) {
        if (this.moduleStack.length > 0) {
            let mod = this.moduleStack[this.moduleStack.length - 1];
            mod.addMember(data);
        }
        else {
            this.processData.push(data);
        }
    }
    // checkDefined(data: string, extraModule?: Array<string>) {
    //     let ret = [];
    //     if (extraModule) {
    //         throw new Error("unsupport");
    //     } else {
    //         for (let i = this.moduleStack.length - 1; i >= 0; i--) {
    //             let mod = this.moduleStack[i];
    //             let members = mod.members;
    //             for (let k in members) {
    //             }
    //         }
    //     }
    // }
    getSourceFile(tsFiles) {
        let ret = new Array();
        for (let f of tsFiles) {
            f = Sys_1.Sys.getFullFileName(f);
            let data = fs.readFileSync(f, { encoding: "UTF-8" });
            let sourceFile = ts.createSourceFile(f, data, ts.ScriptTarget.ES5, true);
            for (let n of sourceFile.statements) {
                ret.push(n);
            }
        }
        return ret;
    }
    readSourceFile(sf) {
        if (ts.isClassDeclaration(sf) && this.isDeclare(sf)) {
            let classData = new BindingData_1.ClassData(sf);
            this.addData(classData);
        }
        else if (ts.isFunctionDeclaration(sf) && this.isDeclare(sf)) {
            let funcData = new BindingData_1.FuncData(sf);
            this.addData(funcData);
        }
        else if (ts.isVariableDeclaration(sf) && this.isDeclare(sf)) {
            let varData = new BindingData_1.VarData(sf);
            this.addData(varData);
        }
        else if (ts.isEnumDeclaration(sf)) {
            exports.enumDefined.push(sf.name.getText());
        }
        else if (ts.isModuleDeclaration(sf)) {
            let mod = new BindingData_1.ModuleData(sf.name.getText());
            this.addData(mod);
            this.openModule(mod);
            let body = sf.body;
            if (body && ts.isModuleBlock(body)) {
                for (let n of body.statements) {
                    this.readSourceFile(n);
                }
            }
            this.closeModule();
        }
    }
    isDeclare(node) {
        if (node.modifiers) {
            for (let m of node.modifiers) {
                if (m.kind == ts.SyntaxKind.DeclareKeyword) {
                    return true;
                }
            }
        }
        return false;
    }
    packageName(pack) {
        return "js_" + pack.name + "_package_api";
    }
    writeTs(p) {
        let ret = "";
        for (let f of p.tsFiles) {
            f = Sys_1.Sys.getFullFileName(f);
            let data = fs.readFileSync(f, { encoding: "UTF-8" });
            let ts = new TsEmitter_1.TsEmitter(data);
            ret += ts.emit();
        }
        return ret;
    }
    emit() {
        let arr = this.config.packages;
        let idx = 0;
        for (let a of arr) {
            this.processData.splice(0);
            let sf = this.getSourceFile(a.tsFiles);
            for (let n of sf) {
                this.readSourceFile(n);
            }
            if (this.config.tsLibPath) {
                let dts = this.writeTs(a);
                fs.writeFile(Sys_1.Sys.getFullFileName(this.config.tsLibPath + a.name + ".ts"), dts, { encoding: "UTF-8" }, (err) => {
                    if (err) {
                        console.log("文件写入失败:" + err.message);
                    }
                    else {
                        console.log("写入ts成功:" + a.name);
                    }
                });
            }
            let writter = new writter_1.Writter(a.includeStr).newLine();
            writter.writeText("#include <JavaScript/easyBindings/ValTran.h>").newLine();
            writter.writeText("#include <JavaScript/easyBindings/BindingSys.h>").newLine();
            writter.writeText("using namespace Urho3D;").newLine().newLine();
            let emitters = new Array();
            for (let d of this.processData) {
                emitters.push(EmitterFactory_1.CreateEmitter(d, writter));
            }
            for (let e of emitters) {
                e.emitDefine();
            }
            writter.newLine();
            writter.writeText("void " + this.packageName(a) + "(duk_context* ctx)").writeLeftBracket().newLine();
            for (let e of emitters) {
                e.emitBinding();
            }
            writter.newLine().writeRightBracket().newLine();
            fs.writeFile(Sys_1.Sys.getFullFileName(this.config.cppPath + a.name + ".cpp"), writter.str, { encoding: "UTF-8" }, (err) => {
                if (err) {
                    console.log("文件写入失败:" + err.message);
                }
                else {
                    console.log("写入成功:" + a.name);
                }
                idx++;
                if (idx == arr.length) {
                    console.log("运行完毕");
                }
            });
        }
    }
}
exports.SysEmitter = SysEmitter;
//# sourceMappingURL=SysEmitter.js.map