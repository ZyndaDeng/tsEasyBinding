"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
function JSBNativeName(arg, node) {
    var _a;
    let jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags) {
        for (let t of jsDocTags) {
            if (t.tagName.text == "nativeName") {
                let nativeName = (_a = t.comment) === null || _a === void 0 ? void 0 : _a.trim();
                if (nativeName) {
                    arg.nativeName = nativeName;
                }
                else {
                    throw new Error("nativeName has not name to set");
                }
                break;
            }
        }
    }
}
exports.JSBNativeName = JSBNativeName;
function JSBRefArgs(node) {
    let jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags) {
        for (let t of jsDocTags) {
            if (t.tagName.text == "refArgs") {
                let comment = t.comment;
                if (comment) {
                    return comment.trim().split(",");
                }
                break;
            }
        }
    }
}
exports.JSBRefArgs = JSBRefArgs;
function JSBCustomize(node) {
    var _a;
    let jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags) {
        for (let t of jsDocTags) {
            if (t.tagName.text == "bindCustomize") {
                let comment = (_a = t.comment) === null || _a === void 0 ? void 0 : _a.trim();
                return comment;
                break;
            }
        }
    }
}
exports.JSBCustomize = JSBCustomize;
//# sourceMappingURL=JSBCustomize.js.map