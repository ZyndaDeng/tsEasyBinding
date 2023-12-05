import * as path from "path"


export let Sys={

    getFullFileName:(fileName:string)=>{
        if(path.isAbsolute(fileName)){
            return fileName;
        }
        return path.normalize(__dirname+"../../"+fileName);
    },

}
