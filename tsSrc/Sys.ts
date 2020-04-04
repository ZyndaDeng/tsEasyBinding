import * as path from "path"

export let Sys={

    getFullFileName:(fileName:string)=>{
        return path.normalize(__dirname+"../../"+fileName);
    }
}
