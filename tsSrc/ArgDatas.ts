
import * as ts from "typescript"
import { enumDefined } from "./emitter/SysEmitter";
import { JSBClass } from "./binding/JSBClass";


export type RegisterTypeMap={[name:string]:new(p: ts.TypeNode, def?: boolean) => ArgData};

export interface TypeData{
    nativeType:string;
    type: string;
    ref?:boolean;
    toFunc():string;
    pushFunc():string;
    //isInternal:boolean;
}
export interface ArgData {
    typeData?:TypeData;
    type: string;
    ignore?: boolean;
    /**是否引用类型 */
    ref?:boolean;
    checkFunc(val: string): string;
    getFunc(val: string,idx:number): string;
    setFunc(): string;
}

 let registerArgs:RegisterTypeMap={};

 export function RegisterMyType(types:RegisterTypeMap){
     Object.assign(registerArgs,types);
 }

export class ArgDataBase implements ArgData {
    
    type: string;
    ignore?: boolean;
    ref?:boolean;
    checkFunc(val: string): string {
        return "JS_IsString(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "const char* n" + idx + "= js_to_cstring(ctx," + val + ");"
    }
    setFunc(): string {
        return "JS_NewString(ctx,ret)"
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
        return "int n" + idx + "; js_to(context," + val + ",n" + idx + ");"
    }
    setFunc(): string {
        return "JS_NewInt32(ctx,ret)"
    }
}

export class Int64Arg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = "int64";
    }
    checkFunc(val: string): string {
        return "JS_IsInteger(" + val + ")";
    }
    getFunc(val: string,idx:number): string {
        return "long long n" + idx + "; js_to(context," + val + ",n" + idx + ");"
    }
    setFunc(): string {
        return "JS_NewInt64(ctx,ret)"
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
        return this.enumName + " n" + idx + "; js_to(context," + val + ",(int&)n" + idx + ");"
        
    }
    setFunc(): string {
        return "JS_NewInt32(ctx,(int)ret)"
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
        return "unsigned n" + idx + "; js_to(context," + val + ",n" + idx + ");"
    }
    setFunc(): string {
        return "JS_NewInt32(ctx,ret)"
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
         return "double n" + idx + "; js_to(context," + val + ",n" + idx + ");"
        
    }
    setFunc(): string {
        return "JS_NewFloat64(ctx,ret)"
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
        //return "bool n" + idx + "= JS_VALUE_GET_BOOL(" + val + ") ? true : false;"
        return "bool n" + idx + "; js_to(context," + val + ",n" + idx + ");"
        
    }
    setFunc(): string {
        return "JS_NewBool(ctx,ret?1:0)"
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
            return "Vector<Base::String> n"+idx+"; js_to_vector(ctx,"+val+",n"+idx+");"
        }else if(this.typeName=="Variant"){
            return "VariantVector n"+idx+"; js_to_VariantVector(ctx,"+val+",n"+idx+");"
        }else if(this.typeName=="number"){
            return "Vector<float> n"+idx+"; js_to_vector(ctx,"+val+",n"+idx+");"
        }else if(this.typeName=="PointLike<float>"){
            return "Vector<Point<float>> n"+idx+"; js_to_vector(ctx,"+val+",n"+idx+");"
        }else{
            return "Vector<"+this.typeName+"> n"+idx+"; js_to_vector(ctx,"+val+",n"+idx+");"
        }
       
        //return "Vector2 n" + idx + "= js_to_vector2(ctx, " + idx + ");"
    }
    setFunc(): string {
        // if(this.typeName=="String"||this.typeName=="string"){
        //     return "js_push_StringVector(ctx,ret);"
        // }else if(this.typeName=="Variant"){
        //     return "js_push_VariantVector(ctx,ret);"
        // }else if(this.typeName=="int"||this.typeName=="uint"){
        //     return "js_push_normal_array(ctx,ret,JS_NewInt32);"
        // }else if(this.typeName=="number"){
        //     return "js_push_normal_array(ctx,ret,JS_NewFloat64);"
        // }
        return "js_pushArray(ctx,ret)"
    }
}

export class DefaultTypeArg extends ArgDataBase{
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val: string): string {
        return "js_is_native(ctx," + val + ",js_"+this.type+"_id)";
    }
    getFunc(val: string,idx:number): string {
        return this.type+" n" + idx + "= js_to_"+this.type+"(ctx, " + val + ");"
    }
    setFunc(): string {
        return "js_push_"+this.type+"(ctx,ret)"
    }
}

export class DefaultRefTypeArg extends ArgDataBase{
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val: string): string {
        return "js_is_native(ctx," + val + ",js_"+this.type+"_id)";
    }
    getFunc(val: string,idx:number): string {
        return this.type+" n" + idx + "= js_to_ref<"+this.type+">(ctx, " + val + ",js_"+this.type+"_id);"
    }
    setFunc(): string {
        return "js_push_copy<"+this.type+">(ctx,ret,js_"+this.type+"_id)"
    }
}

export class DefaultPtrTypeArg extends ArgDataBase{
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val: string): string {
        return "js_is_native(ctx," + val + ",js_"+this.type+"_id)";
    }
    getFunc(val: string,idx:number): string {
        return this.type+"* n" + idx + "= js_to_ptr<"+this.type+">(ctx, " + val + ",js_"+this.type+"_id);"
    }
    setFunc(): string {
        return "js_push_ptr<"+this.type+">(ctx,ret,js_"+this.type+"_id)"
    }
}



export class NativeArg extends ArgDataBase {
    constructor(p: ts.TypeNode, def?: boolean) {
        super(p, def);
        this.type = p.getText();
    }
    checkFunc(val: string): string {
        let jsbclass=JSBClass.classes[this.type];
        //let classId=jsbclass?.classId;
        let type=jsbclass?jsbclass.nativeName:this.type;
        //if(!classId)classId=type + "::GetType()->scriptClassId";
        return "JS_IsNative("+type+",ctx," + val +")";
    }
    getFunc(val: string,idx:number): string {
        let jsbclass=JSBClass.classes[this.type];
        let type=jsbclass?jsbclass.nativeName:this.type;
        return type + "* n" + idx + "=JS_ToNativeObj(" + type + ",ctx," + val + ");"
    }
    setFunc(): string {
        // let classId=JSBClass.classes[this.type]?.classId;
        // if(classId&&classId.endsWith("->scriptClassId")){
        //     //classId="ret->GetTypeInfo()->bindingId";
        //     return `js_push_native_object(ctx,ret)`
        // }
        // return `js_push_native_object(ctx,ret,` +classId  + `)`

       return "js_pushObject(ctx,ret)"
        
        
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
        if (enumDefined.includes(t)) {//枚举类型
            if(registerArgs[t]){
                ret=new registerArgs[t](p,def);
            }else{
                ret = new EnumArg(t, p, def);
            }  
        } else if (t.includes("Array")&&t!="ArrayBuffer") {
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
        }else if ("int64" == t) {
            ret = new Int64Arg(p, def);
        } else if ("uint" == t) {
            ret = new UIntArg(p, def);
        } else if ("float" == t) {
            ret = new NumberArg(p, def);
        }else if(registerArgs[t]){
            ret=new registerArgs[t](p,def);
        }else {
            ret = new NativeArg(p, def);
        }
    }
    return ret;
}