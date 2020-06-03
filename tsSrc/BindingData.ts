import * as ts from "typescript"
import { ArgData, buildArgData } from "./ArgDatas";

export type BindingType = "func" | "class" | "module" | "var"|"namespace"
export interface BindingData {
    bindingType: BindingType;
    getModule(): Array<string> | undefined;
}

export abstract class BaseBindingData implements BindingData {
    parent?: BaseBindingData
    name: string;
    abstract bindingType: BindingType;
    constructor(name: string) {
        this.name = name;
    }
    getModule(): Array<string> | undefined {
        let ret: Array<string> | undefined = undefined;
        if (this.parent) {
            ret = [];
            for (let p: BaseBindingData | undefined = this.parent; p != undefined; p = p.parent) {
                if (p) ret.push(p.name);
            }
        }
        return ret;
    }
}

export interface IModule{
    addMember(m: BaseBindingData):void;
}








