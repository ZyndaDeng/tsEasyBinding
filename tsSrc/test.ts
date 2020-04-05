import * as fs from "fs"
import * as ts from "typescript"
import { JSBRefArgs } from "./binding/JSBCustomize";
import { Sys } from "./Sys";


 let data = fs.readFileSync(Sys.getFullFileName("tsSrc/testFile.ts"), { encoding: "UTF-8" });
 let sourceFile = ts.createSourceFile("testFile", data, ts.ScriptTarget.ES5, true);
            for (let n of sourceFile.statements) {
                JSBRefArgs(n);
            }