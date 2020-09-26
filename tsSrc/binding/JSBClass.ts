import * as ts from "typescript"
import { ArgData, buildArgData } from "../ArgDatas";
import { BaseBindingData, BindingData } from "../BindingData";
import { JSBCustomize, JSBRefArgs, JSBNativeName, JSBCommonClass, JSBGetSet } from "./JSBCustomize";

export interface MethodData {
    isStatic: boolean;
    name: string;
    nativeName:string;
    returnType?: ArgData;
    args: ArgData[];
    override?:Array<{ returnType?: ArgData;args: ArgData[];}>;
    customize?:string;
}


type GetSet={name:string,isFunc:boolean};
export interface GetterData {
    name: string;
    get?: GetSet;
    set?: GetSet;
    type: ArgData;
    isStatic:boolean;
}

export class JSBClass extends BaseBindingData {


    constructor(dec: ts.ClassDeclaration) {
        super(dec.name ? dec.name.text : "");
        this.nativeName=this.name;
        JSBNativeName(this,dec);
        this.finalizer="default_finalizer";
        if(JSBCommonClass(dec)){
            this.finalizer="js_"+this.nativeName+"_finalizer";
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
        JSBClass.classes[this.name]=this;
    }

    static IsMyType(data: BindingData): data is JSBClass {
        return data.bindingType == "class";
    }

    protected readClass(dec: ts.ClassDeclaration) {
        for (let m of dec.members) {
            if (ts.isMethodDeclaration(m)) {
                this.readMethod(m);
            } else if (ts.isConstructorDeclaration(m)) {
                this.readCtor(m);
            } else if (ts.isGetAccessorDeclaration(m)) {
                this.readGetAccessor(m);
            } else if (ts.isSetAccessorDeclaration(m)) {
                this.readSetAccessor(m);
            }
        }
    }

    protected readMethod(met: ts.MethodDeclaration) {
        let isStatic = false;
        let customizeName:string|undefined;
        if (met.modifiers) {
            for (let a of met.modifiers) {
                if (a.kind == ts.SyntaxKind.StaticKeyword) {
                    isStatic = true;
                    break;
                }
            }
        }
        let refArgs = JSBRefArgs(met);
        customizeName=JSBCustomize(met); 
        
        let name = met.name.getText();
        if (this.methods[name]) {
            //这是该函数的重载
            let md = this.methods[name];
            if (!md.override) md.override = [];
            let arr = new Array<ArgData>();
            let returnType:ArgData|undefined=undefined;
            if (met.parameters) {
                for (let p of met.parameters) {
                    if (p.type) {
                        let def = undefined;
                        if (p.questionToken) {
                            def = true;
                        }
                        let ad = buildArgData(p.type, def);
                        if (refArgs&&refArgs.includes(p.getText())) {
                            ad.ref = true;
                        }
                        arr.push(ad);
                    } else {
                        throw new Error("parameter type undfined");
                    }
                }
            }
            if (met.type && met.type.kind != ts.SyntaxKind.VoidKeyword) {
                returnType = buildArgData(met.type, undefined);
            }
            md.override.push({returnType:returnType,args:arr});
        } else {
            //添加该函数
            let md: MethodData = {
                isStatic: isStatic,
                name: name,
                nativeName:name,
                args: []
            }
            if(customizeName)md.customize=customizeName;
            JSBNativeName(md,met);
            if (met.parameters) {
                for (let p of met.parameters) {
                    if (p.type) {
                        let def = undefined;
                        if (p.questionToken) {
                            def = true;
                        }
                        let ad = buildArgData(p.type, def);
                        if (refArgs&&refArgs.includes(p.name.getText())) {
                            ad.ref = true;
                        }
                        md.args.push(ad);
                    } else {
                        throw new Error("parameter type undfined");
                    }
                }
            }
            if (met.type && met.type.kind != ts.SyntaxKind.VoidKeyword) {
                md.returnType = buildArgData(met.type, undefined);
            }
            this.methods[name] = md;
        }
    }


    protected readCtor(met: ts.ConstructorDeclaration) {
        let arr = this.ctor;
        if (arr) {
            arr = new Array<ArgData>();
            if (!this.othersCtor) {
                this.othersCtor = [];
            }
            this.othersCtor.push(arr);
        } else {
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
                    arr.push(buildArgData(p.type, def));
                } else {
                    throw new Error("parameter type undfined");
                }
            }
        }
    }

    protected GetterName(met: ts.SetAccessorDeclaration | ts.GetAccessorDeclaration, isGet: boolean) :GetSet{
        let name = met.name.getText();
        let self={nativeName:""};
        let ret={name:name,isFunc:true};
        JSBNativeName(self,met);
        if(self.nativeName!=""){
            ret.name=self.nativeName;   
        }else{
            ret=this.defalutGetter(name, isGet);
        }
        let getset=JSBGetSet(met);
        if(getset){
            ret.name=getset;
            ret.isFunc=false;
        }
        return ret;
    }
    protected defalutGetter(name: string, isGet: boolean) {
        let f = name.charAt(0);
        let otherChars = name.substring(1);
        f = f.toUpperCase();
        let getOrSet = isGet ? "Get" : "Set";
        return {name:getOrSet + f + otherChars,isFunc:true};
    }

    protected readGetAccessor(met: ts.GetAccessorDeclaration) {
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
        } else {
            let gd: GetterData = {
                name: name,
                get: this.GetterName(met, true),
                type: buildArgData(met.type, undefined),
                isStatic:isStatic
            };
            this.getters[name] = gd;
        }
    }

    protected readSetAccessor(met: ts.SetAccessorDeclaration) {
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
        } else {
            let gd: GetterData = {
                name: name,
                set: this.GetterName(met, false),
                type: buildArgData(p.type, undefined),
                isStatic:isStatic
            };
            this.getters[name] = gd;
        }
    }

    get classId(){
        if(this.isInstanceof(JSBClass.classes["Object"])){
            return this.nativeName + "::GetTypeInfoStatic()->bindingId";
        }else{
            return "js_"+this.nativeName+"_id";
        }  
    }

    isInstanceof(jsbClass:JSBClass){
        let cur:JSBClass|undefined=this;
        // if(this.name=="Object"){
        //     return true;
        // }
        while(cur){
            if(cur==jsbClass){
                return true;
            }
            cur=JSBClass.classes[cur.extend];
        }
        return false;
    }

    // protected hasSetCtor: boolean;
    // includes:string;
    //name: string;
    bindingType: "class";
    nativeName: string;
    extend: string;
    finalizer:string;
    ctor?: Array<ArgData>;
    customizeName?:string; 
    othersCtor?: Array<Array<ArgData>>;
    getters: { [key: string]: GetterData };
    methods: { [key: string]: MethodData };
    static classes:{ [key: string]: JSBClass }={};
}