
import * as ts from "typescript"
import { enumDefined } from "./emitter/SysEmitter";

export interface ArgData {
    type: string;
    ignore?: boolean;
    /**是否引用类型 */
    ref?:boolean;
    checkFunc(idx: number): string;
    getFunc(idx: number): string;
    setFunc(): string;
}

export let registerArgs:{[name:string]:new(p: ts.TypeNode, def?: boolean) => ArgData}={};

export class ArgDataBase implements ArgData {
    type: string;
    ignore?: boolean;
    ref?:boolean;
    checkFunc(idx: number): string {
        return "duk_is_string(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        return "const char* n" + idx + "= duk_require_string(ctx, " + idx + ");"
    }
    setFunc(): string {
        return "duk_push_string(ctx,ret);"
    }
    constructor(p: ts.TypeNode, ignore?: boolean) {
        this.type = "string";
        //if(p.initializer){
        this.ignore = ignore;
        //}
    }

}

export class StringArg extends ArgDataBase {

}


export class IntArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "int";
    }
    checkFunc(idx: number): string {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        return "int n" + idx + "= duk_require_int(ctx, " + idx + ");"
    }
    setFunc(): string {
        return "duk_push_int(ctx,ret);"
    }
}

export class EnumArg extends ArgDataBase {
    constructor(protected enumName: string, p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "int";
    }
    checkFunc(idx: number): string {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx: number): string {

        return this.enumName + " n" + idx + "=(" + this.enumName + ") duk_require_int(ctx, " + idx + ");"

    }
    setFunc(): string {
        return "duk_push_int(ctx,ret);"
    }
}

export class UIntArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "uint";
    }
    checkFunc(idx: number): string {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        return "unsigned n" + idx + "= duk_require_uint(ctx, " + idx + ");"
    }
    setFunc(): string {
        return "duk_push_uint(ctx,ret);"
    }
}

export class NumberArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "number";
    }
    checkFunc(idx: number): string {
        return "duk_is_number(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        return "duk_double_t  n" + idx + "= duk_require_number(ctx, " + idx + ");"
    }
    setFunc(): string {
        return "duk_push_number(ctx,ret);"
    }
}

export class BoolArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "bool";
    }
    checkFunc(idx: number): string {
        return "duk_is_boolean(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        return "bool n" + idx + "= duk_require_boolean(ctx, " + idx + ") ? true : false;"
    }
    setFunc(): string {
        return "duk_push_boolean(ctx,ret?1:0);"
    }
}

export class ArrayArg extends ArgDataBase {
    constructor(protected typeName:string,p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "Array";
    }
    checkFunc(idx: number): string {
        return "duk_is_array(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        if(this.typeName=="String"||this.typeName=="string"){
            return "StringVector n"+idx+"; js_to_normal_array(ctx,"+idx+",n"+idx+",duk_to_string);"
        }else if(this.typeName=="Variant"){
            return "VariantVector n"+idx+"; js_to_VariantVector(ctx,"+idx+",n"+idx+");"
        }else if(this.typeName=="number"){
            return "Vector<float> n"+idx+"; js_to_normal_array(ctx,"+idx+",n"+idx+",duk_to_number);"
        }else{
            return "PODVector<"+this.typeName+"*> n"+idx+"; js_to_native_array(ctx,"+idx+",n"+idx+");"
        }
       
        //return "Vector2 n" + idx + "= js_to_vector2(ctx, " + idx + ");"
    }
    setFunc(): string {
        if(this.typeName=="String"||this.typeName=="string"){
            return "js_push_StringVector(ctx,ret);"
        }else if(this.typeName=="Variant"){
            return "js_push_VariantVector(ctx,ret);"
        }else if(this.typeName=="int"||this.typeName=="number"||this.typeName=="uint"){
            return "js_push_normal_array(ctx,ret,duk_push_number);"
        }
        return "js_push_native_array(ctx,ret);"
    }
}

export class DefaultTypeArg extends ArgDataBase{
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(idx: number): string {
        return "duk_is_object(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
        return this.type+" n" + idx + "= js_to_"+this.type+"(ctx, " + idx + ");"
    }
    setFunc(): string {
        return "js_push_"+this.type+"(ctx,ret);"
    }
}



export class NativeArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(idx: number): string {
        return "js_is_native<" + this.type + ">(ctx," + idx + ")";
    }
    getFunc(idx: number): string {
       
        return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + idx + ");"
    }
    setFunc(): string {
        return `js_push_native_object(ctx,ret,"` + this.type + `");`
    }
}

export function buildArgData(p: ts.TypeNode, def: boolean | undefined): ArgData {
    let ret: ArgData | undefined = undefined;
    if (p.kind == ts.SyntaxKind.NumberKeyword) {
        ret = new NumberArg(p, def);
    } else if (p.kind == ts.SyntaxKind.StringKeyword) {
        ret = new StringArg(p, def);
    } else if (p.kind == ts.SyntaxKind.BooleanKeyword) {
        ret = new BoolArg(p, def);
    } else {
        let t = p.getText();
        if (enumDefined.includes(t)) {
            ret = new EnumArg(t, p, def);
        } else if (t.includes("Array")) {
            if(ts.isTypeReferenceNode(p)){
                if(p.typeArguments){
                    let typeName=p.typeArguments[0].getText();
                    ret = new ArrayArg(typeName,p, def);
                }else{
                    throw new Error("Array type argument can not be null");
                }
            } else{
                throw new Error("Array type argument can not be null");
            } 
        }else if ("int" == t) {
            ret = new IntArg(p, def);
        } else if ("uint" == t) {
            ret = new UIntArg(p, def);
        } else if(registerArgs[t]){
            ret=new registerArgs[t](p,def);
        }else {
            ret = new NativeArg(p, def);
        }
    }
    return ret;
}