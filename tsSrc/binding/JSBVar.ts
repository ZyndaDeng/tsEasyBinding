import { BaseBindingData, BindingData } from "../BindingData";
import * as ts from "typescript"
import { ArgData, buildArgData } from "../ArgDatas";

/**
 * 绑定变量
 */
export class JSBVar extends BaseBindingData{
    bindingType:"var"
    arg:ArgData
    nativeName:string
    constructor(node:ts.VariableDeclaration){
        
        if (node.type) {
            super(node.name.getText())
            this.arg = buildArgData(node.type, undefined);
            this.nativeName=name;
        }else{
            throw new Error("type undefine");
            
        }
        this.bindingType="var";
    }
    /**
     * 绑定数据是否该类型
     * @param data 
     */
    static IsMyType(data:BindingData):data is JSBVar{
        return data.bindingType=="var";
    }
}