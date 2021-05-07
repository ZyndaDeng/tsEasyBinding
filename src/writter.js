"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writter = void 0;
const enter = "\n";
const tab = "\t";
class Writter {
    constructor(str) {
        this.str = str;
        this.tabCount = 0;
        this.isNewLine_ = true;
    }
    newLine() {
        this.str += enter;
        this.isNewLine_ = true;
        return this;
    }
    writeText(s) {
        this.isNewLine();
        this.str += s;
        return this;
    }
    writeLeftBracket() {
        this.isNewLine();
        this.tabCount++;
        this.str += "{";
        return this;
    }
    writeRightBracket() {
        this.tabCount--;
        this.isNewLine();
        this.str += "}";
        return this;
    }
    writeOpenModule(modName) {
        return this.writeText("js_open_module(ctx,\"" + modName + "\");");
    }
    writeCloseModule(modName) {
        return this.writeText("js_close_module(ctx,\"" + modName + "\");");
    }
    isNewLine() {
        let ret = this.isNewLine_;
        if (this.isNewLine_) {
            for (let i = 0; i < this.tabCount; i++) {
                this.str += tab;
            }
            this.isNewLine_ = false;
        }
        return ret;
    }
}
exports.Writter = Writter;
//# sourceMappingURL=writter.js.map