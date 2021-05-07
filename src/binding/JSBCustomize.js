"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSBCommonClass = exports.JSBCustomize = exports.JSBRefArgs = exports.JSBGetSet = exports.JSBNativeName = void 0;
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
function JSBGetSet(node) {
    var _a;
    let jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags) {
        for (let t of jsDocTags) {
            if (t.tagName.text == "GetSet") {
                let comment = (_a = t.comment) === null || _a === void 0 ? void 0 : _a.trim();
                if (comment) {
                    return comment;
                }
                break;
            }
        }
    }
}
exports.JSBGetSet = JSBGetSet;
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
function JSBCommonClass(node) {
    let jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags) {
        for (let t of jsDocTags) {
            if (t.tagName.text == "bindCommonClass") {
                //let comment=t.comment?.trim();
                return true;
                break;
            }
        }
    }
    return false;
}
exports.JSBCommonClass = JSBCommonClass;
//# sourceMappingURL=JSBCustomize.js.map