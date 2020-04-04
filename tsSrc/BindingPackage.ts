

export class BindingPackage {

    constructor(includeStr: string, name: string, dtsFiles: Array<string>) {
        this.includeStr = includeStr;
        this.name = name;
        this.tsFiles = dtsFiles;
       // this.defArr = [];
    }

    includeStr: string;
    tsFiles: Array<string>;
    name: string;
   // defArr: Array<string>;

//     protected readSourceFile(sf: ts.Statement) {
//         let ret = "";
//         if (ts.isClassDeclaration(sf) && this.isDeclare(sf)) {
//             let classData = new ClassData(sf);
//             let emitter = new DukEmitter(classData);
//             ret += emitter.buildCpp();
//             this.defArr.push(emitter.apiName() + "(ctx);");
//         } else if (ts.isFunctionDeclaration(sf) && this.isDeclare(sf)) {
//             let emitter = new FuncEmitter(sf);
//             ret += emitter.emit();
//             this.defArr.push(emitter.register());
//         } else if (ts.isVariableDeclaration(sf) && this.isDeclare(sf)) {
//             if (sf.type) {
//                 let arg = buildArgData(sf.type, undefined);
//                 let emitter = new VarEmitter(arg, sf.name.getText());
//                 ret += emitter.emit();
//                 this.defArr.push(emitter.register());
//             }
//         } else if (ts.isEnumDeclaration(sf)) {
//             enumDefined.push(sf.name.getText());
//         } else if (ts.isModuleDeclaration(sf)) {
//             let body = sf.body;
//             if (body && ts.isModuleBlock(body)) {
//                 for (let n of body.statements) {
//                     ret += this.readSourceFile(n);
//                 }
//             }
//         }
//         return ret;
//     }

//     isDeclare(node: ts.Statement) {
//         if (node.modifiers) {
//             for (let m of node.modifiers) {
//                 if (m.kind == ts.SyntaxKind.DeclareKeyword) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     getSourceFile(){
//         let ret=new Array<ts.Statement>();
//         for (let f of this.dtsFiles) {
//             f = Sys.getFullFileName(f);
//             let data = fs.readFileSync(f, { encoding: "UTF-8" });
//             let sourceFile = ts.createSourceFile(f, data, ts.ScriptTarget.ES5, true);
//             for (let n of sourceFile.statements) {
//                 ret .push(n);
//             }
//         }
//         return ret;
//     }

//   protected  writeCpp() {
//         let ret = ""
//         ret += this.includeStr + "\n";
//         ret += "#include <JavaScript/toJs.h>" + "\n";
//         ret += "using namespace Urho3D;" + "\n";
//         for (let f of this.dtsFiles) {
//             f = Sys.getFullFileName(f);
//             let data = fs.readFileSync(f, { encoding: "UTF-8" });
//             let sourceFile = ts.createSourceFile(f, data, ts.ScriptTarget.ES5, true);
//             for (let n of sourceFile.statements) {
//                 ret += this.readSourceFile(n);
//             }
//         }

//         ret += "void js_" + this.name + "_all_api(duk_context* ctx){" + "\n";
//         for (let s of this.defArr) {
//             ret += s + "\n";
//         }
//         ret += "}" + "\n";
//         return ret;
//     }

//     writeDts() {
//         let ret = ""
//         for (let f of this.dtsFiles) {
//             f = Sys.getFullFileName(f);
//             let data = fs.readFileSync(f, { encoding: "UTF-8" });
//             let ts = new TsEmitter(data);
//             ret += ts.emit();
//         }
//         return ret;
//     }
}