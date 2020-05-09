import { BindingData,  BaseBindingData } from "../BindingData";
import * as fs from "fs"
import { Sys } from "../Sys";
import * as ts from "typescript"
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { ClassEmitter } from "./ClassEmitter";
import { ModuleEmitter } from "./ModuleEmitter";
import { FuncEmitter } from "./FuncEmitter";
import { CreateEmitter } from "./EmitterFactory";
import { JSBModule } from "../binding/JSBModule";
import { JSBClass } from "../binding/JSBClass";
import { JSBFunction } from "../binding/JSBFunction";
import { JSBVar } from "../binding/JSBVar";

export interface IBindingPackage {
    includeStr: string;
    tsFiles: Array<string>;
    name: string;
}

export interface BindingConfig {
    packages: IBindingPackage[];
    cppPath: string;
}

export let customize:{[name:string]:string}={};

export let enumDefined = new Array<string>();
export class SysEmitter {



    protected moduleStack: Array<JSBModule>;
    protected processData: Array<BaseBindingData>;

    constructor(protected config: BindingConfig) {
        //this.enumDefined = [];
        this.moduleStack = [];
        this.processData = [];
        // this.shouldFirstDefineList = [];
        // this.undefineList = {};
    }

    openModule(module: JSBModule) {
        this.moduleStack.push(module);
    }

    closeModule() {
        if (this.moduleStack.length == 0) {
            throw new Error("no module to close");
        }
        this.moduleStack.pop();
    }

    addData(data: BaseBindingData) {
        if (this.moduleStack.length > 0) {
            let mod = this.moduleStack[this.moduleStack.length - 1];
            mod.addMember(data);
        } else {
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

    getSourceFile(tsFiles: Array<string>) {
        let ret = new Array<ts.Statement>();
        for (let f of tsFiles) {
            f = Sys.getFullFileName(f);
            let data = fs.readFileSync(f, { encoding: "UTF-8" });
            let sourceFile = ts.createSourceFile(f, data, ts.ScriptTarget.ES5, true);
            for (let n of sourceFile.statements) {
                ret.push(n);
            }
        }
        return ret;
    }

    protected readSourceFile(sf: ts.Statement) {

        if (ts.isClassDeclaration(sf) && this.isDeclare(sf)) {
            let classData = new JSBClass(sf);
            this.addData(classData);
        } else if (ts.isFunctionDeclaration(sf) && this.isDeclare(sf)) {
            let funcData = new JSBFunction(sf);
            this.addData(funcData);
        } else if (ts.isVariableDeclaration(sf) && this.isDeclare(sf)) {
            let varData = new JSBVar(sf);
            this.addData(varData);
        } else if (ts.isEnumDeclaration(sf)) {
            enumDefined.push(sf.name.getText());
        } else if (ts.isModuleDeclaration(sf)) {
            let mod = new JSBModule(sf.name.getText());
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

    isDeclare(node: ts.Statement) {
        if (node.modifiers) {
            for (let m of node.modifiers) {
                if (m.kind == ts.SyntaxKind.DeclareKeyword) {
                    return true;
                }
            }
        }
        return false;
    }

    packageName(pack: IBindingPackage) {
        return "js_" + pack.name + "_package_api";
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

            let writter = new Writter(a.includeStr).newLine();
            let emitters = new Array<Emitter>();
            for (let d of this.processData) {
                emitters.push(CreateEmitter(d, writter));
            }
            for (let e of emitters) {
                e.emitDefine();
            }
            writter.newLine();
            writter.writeText("void " + this.packageName(a) + "(const jsb::Context& ctx)").writeLeftBracket().newLine();
            for (let e of emitters) {
                e.emitBinding();
            }
            writter.newLine().writeRightBracket().newLine();
            fs.writeFile(Sys.getFullFileName(this.config.cppPath + a.name + ".cpp"), writter.str, { encoding: "UTF-8" }, (err) => {
                if (err) {
                    console.log("文件写入失败:" + err.message);
                } else {
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