import { BindingData, BaseBindingData, IModule } from "../BindingData";
import * as fs from "fs"
import { Sys } from "../Sys";
import * as ts from "typescript"
import { Writter } from "../writter";
import { Emitter } from "./Emitter";
import { ClassEmitter } from "./qjs/ClassEmitter";
import { JSBNamespace } from "../binding/JSBNamespace";
import { JSBClass } from "../binding/JSBClass";
import { JSBFunction } from "../binding/JSBFunction";
import { JSBVar } from "../binding/JSBVar";
import { JSBModule } from "../binding/JSBModule";
import { RegisterMyType, RegisterTypeMap } from "../ArgDatas";
import { Constructor } from "../utils";
import { IEmitterFactory } from "./EmitterFactory";
import { QjsEmitterFactory } from "./qjs/QjsEmitterFactory";
import { V8EmitterFactory } from "./v8/V8EmitterFactory";

export interface IBindingPackage {
    includeStr: string;
    tsFiles: Array<string>;
    name: string;
}

export type JsEngine="v8"|"qjs"

export interface BindingConfig {
    packages: IBindingPackage[];
    cppPath: string;
    outputModulePath?:string
    registerTypes:RegisterTypeMap;
    engine:JsEngine;
    /**自定义的转换函数 */
    customize: { [name: string]: string }
    jsbClassCtor?:Constructor<JSBClass>
}

 export let customize: { [name: string]: string } = {};

export let enumDefined = new Array<string>();

type ModuleData = BaseBindingData & IModule;
export class SysEmitter {

    protected moduleStack: Array<ModuleData>;
    protected processData: Array<BaseBindingData>;
    protected isInDeclare: boolean;
    protected jsbClassCtor:Constructor<JSBClass>
    protected emitterFactory:IEmitterFactory

    constructor(protected config: BindingConfig) {
        //this.enumDefined = [];
        this.moduleStack = [];
        this.processData = [];
        this.isInDeclare = false;
        // this.shouldFirstDefineList = [];
        // this.undefineList = {};
        //let ctor:Constructor<JSBClass>=JSBClass;
        this.jsbClassCtor=JSBClass;
        if(config.jsbClassCtor){
            this.jsbClassCtor=config.jsbClassCtor;
        }
        if(config.engine=="qjs"){
            this.emitterFactory=new QjsEmitterFactory();
        }else{
            this.emitterFactory=new V8EmitterFactory();
        }
        
    }

    openModule(module: ModuleData) {
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

        if (ts.isClassDeclaration(sf)) {
            if (this.isDeclare(sf) || this.isInDeclare) {
                let classData = new this.jsbClassCtor(sf);
                this.addData(classData);
            }
        } else if (ts.isFunctionDeclaration(sf)) {
            if (this.isDeclare(sf) || this.isInDeclare) {
                let funcData = new JSBFunction(sf);
                this.addData(funcData);
            }
        } else if (ts.isVariableDeclaration(sf)) {
            if (this.isDeclare(sf) || this.isInDeclare) {
                let varData = new JSBVar(sf);
                this.addData(varData);
            }
        } else if (ts.isEnumDeclaration(sf)) {
            enumDefined.push(sf.name.getText());
        } else if (ts.isModuleDeclaration(sf)) {
            let mod: ModuleData | undefined = undefined;
            if (this.isDeclare(sf)) {
                //因为module和namespace都是ModuleDeclaration 这里只能用不完全正确的规则区分
                mod = new JSBModule(sf.name.getText());
                this.isInDeclare = true;
            } else {
                mod = new JSBNamespace(sf.name.getText());
            }
            this.addData(mod);
            this.openModule(mod);
            let body = sf.body;
            if (body && ts.isModuleBlock(body)) {
                for (let n of body.statements) {
                    this.readSourceFile(n);
                }
            }
            this.closeModule();
            this.isInDeclare = false;
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
        RegisterMyType(this.config.registerTypes);
        Object.assign(customize,this.config.customize);

        let arr = this.config.packages;
        let idx = 0;
        let process = new Array<Array<BaseBindingData>>();
        for (let a of arr) {
            this.processData = [];//.splice(0);
            let sf = this.getSourceFile(a.tsFiles);
            for (let n of sf) {
                this.readSourceFile(n);
            }
            process.push(this.processData);
        }

        let mWritter=new Writter("");
        for (let i = 0; i < arr.length; i++) {
            let a = arr[i];
            let pData = process[i];
            this.processData.splice(0);
            let sf = this.getSourceFile(a.tsFiles);
            for (let n of sf) {
                this.readSourceFile(n);
            }

            let writter = new Writter(a.includeStr).newLine();
            let emitters = new Array<Emitter>();
            for (let d of pData) {
                emitters.push(this.emitterFactory.createEmitter(d, writter));
            }
            for (let e of emitters) {
                e.emitDefine();
            }
            writter.newLine();
            if(this.config.engine=="v8"){
                writter.writeText(" void " + this.packageName(a) + "( V8JS::JSContext* ctx)").writeLeftBracket().newLine();
            }else{
                writter.writeText(" void " + this.packageName(a) + "( jsb::Context& ctx)").writeLeftBracket().newLine();
            }
            
            
            
            for (let e of emitters) {
                e.emitBinding();
            }

            if(this.config.outputModulePath){
                for(let d of pData){
                    if( d instanceof JSBModule){
                        let members=d.members;
                        for(let m of members){
                            mWritter.writeText("export const "+m.name+"="+d.name+"."+m.name).newLine();
                        }
                    }
                   
                }
            }
           
            writter.newLine().writeRightBracket().newLine();
            fs.writeFile(Sys.getFullFileName(this.config.cppPath+"jsbApis/" + a.name + ".cpp"), writter.str, { encoding: "UTF-8" }, (err) => {
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

        if(this.config.outputModulePath){
                
            fs.writeFile(Sys.getFullFileName(this.config.outputModulePath),mWritter.str,{ encoding: "UTF-8" }, (err) => {
                if (err) {
                    console.log("文件写入失败:" + err.message);
                } else {
                    console.log("写入成功:" + this.config.outputModulePath);
                }
            })
        }
    }

}