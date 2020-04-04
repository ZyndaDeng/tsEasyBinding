
import * as path from "path"
import * as fs from "fs"
import * as ts from "typescript"


import { BindingPackage } from "./BindingPackage";
import { Sys } from "./Sys";
import { BindingConfig, SysEmitter } from "./emitter/SysEmitter";
import { RegisterType, RegisterCustomize } from "./RegisterType";







function main() {



    let arr = new Array<BindingPackage>();
    arr.push(new BindingPackage(`#include <cstdio>
    #include "Resource/Image.h"
    #include "Resource/JSONValue.h"
    #include "Resource/JSONFile.h"
    #include "Resource/XMLElement.h"
    #include "Resource/XMLFile.h"
    #include "Resource/ResourceCache.h"
    #include "Resource/Localization.h"`,
    "ResourceApi",
    [
        "../MyProj/dts/Resource.ts"
    ]));
   
    

    let config:BindingConfig={
        packages:arr,
        cppPath:"./easyBindings/jsbApis/",
        tsLibPath:"../MyProj/tsSrc/lib/"
    }

    RegisterType();
    RegisterCustomize();

    let sysEmit=new SysEmitter(config);
    sysEmit.emit();
   
}



main();
