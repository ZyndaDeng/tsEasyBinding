import * as ts from "typescript"
import { BaseBindingData, BindingData } from "../BindingData";
import { ArgData, buildArgData } from "../ArgDatas";

export class JSBFunction extends BaseBindingData {
    bindingType: "func"
    returnType?: ArgData;
    args: ArgData[];
    constructor(node: ts.FunctionDeclaration) {
        let name = node.name?.getText();
        if (!name) throw new Error("function name undfined");
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
                    let ad = buildArgData(p.type, def);
                    // if(refArgs.includes(p.name.getText())){
                    //     ad.ref=true;
                    // }
                    this.args.push(ad);
                } else {
                    throw new Error("parameter type undfined");
                }
            }
        }
        if (node.type && node.type.kind != ts.SyntaxKind.VoidKeyword) {
            this.returnType = buildArgData(node.type, undefined);
        }
    }

    static IsMyType(data:BindingData):data is JSBFunction{
        return data.bindingType=="func";
    }
}