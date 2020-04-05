"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const ts = __importStar(require("typescript"));
const JSBCustomize_1 = require("./binding/JSBCustomize");
const Sys_1 = require("./Sys");
let data = fs.readFileSync(Sys_1.Sys.getFullFileName("tsSrc/testFile.ts"), { encoding: "UTF-8" });
let sourceFile = ts.createSourceFile("testFile", data, ts.ScriptTarget.ES5, true);
for (let n of sourceFile.statements) {
    JSBCustomize_1.JSBRefArgs(n);
}
//# sourceMappingURL=test.js.map