import * as fs from "fs"
import * as ts from "typescript"
import { JSBRefArgs } from "./binding/JSBCustomize";
import { Sys } from "./Sys";


//  let data = fs.readFileSync(Sys.getFullFileName("tsSrc/testFile.ts"), { encoding: "UTF-8" });
//  let sourceFile = ts.createSourceFile("testFile", data, ts.ScriptTarget.ES5, true);
//             for (let n of sourceFile.statements) {
//                 JSBRefArgs(n);
//             }


class SubArr{
    end:number
    constructor(protected arr:Array<number>,public start:number){
       
        this.end=start;
    }
    value(){
        let ret=this.arr[this.start];
        for(let i=this.start+1;i<=this.end;i++){
            ret+=this.arr[i];
        }
        return ret;
    }
}
function build(arr:Array<number>){
    let max=new SubArr(arr,0);
    let cur=new SubArr(arr,0);
    for(let i=1 ;i<arr.length;i++){
        if(cur.value()>max.value()){
            max=cur;
        }
        let curV=cur.value();
        if(curV+arr[i]<curV||curV+arr[i]<arr[i]){
            cur=new SubArr(arr,i);
            if(cur.value()>max.value()){
                max=cur;
            }
        }else{
            cur.end=i;
        }
    }
    return max;
}

let arr=[-3,-4,-2,-6,-7,0];
let max=build(arr);
console.log("最大数组是:" + max.start+","+max.end);