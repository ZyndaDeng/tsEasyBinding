import * as ts from "typescript"
import { MethodData } from "./JSBClass";


interface INativeName{
    nativeName:string
}

export function JSBNativeName(arg:INativeName,node:ts.Node){
    let jsDocTags=ts.getJSDocTags(node);
    if(jsDocTags){
        for(let t of jsDocTags){
            if(t.tagName.text=="nativeName"){
                let nativeName=t.comment?.trim();
                if(nativeName){
                    arg.nativeName=nativeName;
                }else{
                    throw new Error("nativeName has not name to set");
                }            
                break;
            }
        }
    }
}

export function JSBRefArgs(node:ts.Node){
    let jsDocTags=ts.getJSDocTags(node);
    if(jsDocTags){
        for(let t of jsDocTags){
            if(t.tagName.text=="refArgs"){
                let comment=t.comment;
                if(comment){
                    return comment.trim().split(",");
                }
                break;
            }
        }
    }
}

export function JSBCustomize(node:ts.Node){
    let jsDocTags=ts.getJSDocTags(node);
    if(jsDocTags){
        for(let t of jsDocTags){
            if(t.tagName.text=="bindCustomize"){
                let comment=t.comment?.trim();
                return comment;
                break;
            }
        }
    }
}

export function JSBCommonClass(node:ts.Node){
    let jsDocTags=ts.getJSDocTags(node);
    if(jsDocTags){
        for(let t of jsDocTags){
            if(t.tagName.text=="bindCommonClass"){
                //let comment=t.comment?.trim();
                return true;
                break;
            }
        }
    }
    return false;
}