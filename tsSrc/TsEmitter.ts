

export class TsEmitter{
     constructor(protected srcStr:string){

     }

     emit(){
         let arr=this.srcStr.split("\n");
         let ret="";
         for(let s of arr){
             let tmp=s.trim();
             if(tmp.indexOf("@")!=0){
                 ret+=s+"\n";
             }
         }
         return ret;
     }
}