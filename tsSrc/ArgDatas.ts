
import * as ts from "typescript"
import { enumDefined } from "./emitter/SysEmitter";
import { JSBClass } from "./binding/JSBClass";

export interface ArgData {
    type: string;
    ignore?: boolean;
    /**是否引用类型 */
    ref?:boolean;
    checkFunc(val: string): string;
    getFunc(val: string,idx:number): string;
    setFunc(): string;
}

export let registerArgs:{[name:string]:new(p: ts.TypeNode, def?: boolean) => ArgData}={};

export class ArgDataBase implements ArgData {
    type: string;
    ignore?: boolean;
    ref?:boolean;
    checkFunc(val: string): string {
        return "JS_IsString(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "const char* n" + idx + "= JS_ToCString(ctx," + val + ");"
    }
    setFunc(): string {
        return "JS_NewString(ctx,ret);"
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
    checkFunc(val: string): string {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "int n" + idx + "= JS_VALUE_GET_INT(" + val + ");"
    }
    setFunc(): string {
        return "JS_NewInt32(ctx,ret);"
    }
}

export class EnumArg extends ArgDataBase {
    constructor(protected enumName: string, p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "int";
    }
    checkFunc(val: string): string {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return this.enumName + " n" + idx + "=(" + this.enumName + ") JS_VALUE_GET_INT(" + val + ");"
    }
    setFunc(): string {
        return "JS_NewInt32(ctx,ret);"
    }
}

export class UIntArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "uint";
    }
    checkFunc(val: string): string {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "unsigned n" + idx + "= (unsigned)JS_VALUE_GET_INT(" + val + ");"
    }
    setFunc(): string {
        return "JS_NewInt32(ctx,ret);"
    }
}

export class NumberArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "number";
    }
    checkFunc(val: string): string {
        return "JS_IsNumber(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "double  n" + idx + "=0.0; JS_ToFloat64(ctx,&n"+idx+"," + val + ");"
    }
    setFunc(): string {
        return "JS_NewFloat64(ctx,ret);"
    }
}

export class BoolArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "bool";
    }
    checkFunc(val: string): string {
        return "JS_IsBool(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "bool n" + idx + "= JS_VALUE_GET_BOOL(" + val + ") ? true : false;"
    }
    setFunc(): string {
        return "JS_NewBool(ctx,ret?1:0);"
    }
}

export class ArrayArg extends ArgDataBase {
    constructor(protected typeName:string,p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "Array";
    }
    checkFunc(val: string): string {
        return "JS_IsArray(ctx," + val + ")";
    }
    getFunc(val: string,idx:number): string {
        if(this.typeName=="String"||this.typeName=="string"){
            return "StringVector n"+idx+"; js_to_normal_array(ctx,"+val+",n"+idx+",JS_ToCString);"
        }else if(this.typeName=="Variant"){
            return "VariantVector n"+idx+"; js_to_VariantVector(ctx,"+val+",n"+idx+");"
        }else if(this.typeName=="number"){
            return "Vector<float> n"+idx+"; js_to_normal_array(ctx,"+val+",n"+idx+",js_to_number);"
        }else{
            return "PODVector<"+this.typeName+"*> n"+idx+"; js_to_native_array(ctx,"+val+",n"+idx+");"
        }
       
        //return "Vector2 n" + idx + "= js_to_vector2(ctx, " + idx + ");"
    }
    setFunc(): string {
        if(this.typeName=="String"||this.typeName=="string"){
            return "js_push_StringVector(ctx,ret);"
        }else if(this.typeName=="Variant"){
            return "js_push_VariantVector(ctx,ret);"
        }else if(this.typeName=="int"||this.typeName=="uint"){
            return "js_push_normal_array(ctx,ret,JS_NewInt32);"
        }else if(this.typeName=="number"){
            return "js_push_normal_array(ctx,ret,JS_NewFloat64);"
        }
        return "js_push_native_array(ctx,ret);"
    }
}

export class DefaultTypeArg extends ArgDataBase{
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val: string): string {
        return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
    }
    getFunc(val: string,idx:number): string {
        return this.type+" n" + idx + "= js_to_"+this.type+"(ctx, " + val + ");"
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
    checkFunc(val: string): string {
        // let classId=JSBClass.classes[this.type]?.classId;
        // if(!classId)classId=this.type + "::GetTypeInfoStatic()->bindingId";
        return "js_is_native(ctx," + val + ",\""+ this.type+"\")";
    }
    getFunc(val: string,idx:number): string {
       
        return this.type + "* n" + idx + "=js_to_native_object<" + this.type + ">(ctx," + val + ");"
    }
    setFunc(): string {
        let classId=JSBClass.classes[this.type]?.classId;
        if(classId.endsWith("->bindingId")){
            //classId="ret->GetTypeInfo()->bindingId";
            return `js_push_urho3d_object(ctx,ret);`
        }
        
        return `js_push_native_object(ctx,ret,` +classId  + `);`
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