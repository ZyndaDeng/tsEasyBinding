#ifndef QUICKJS_INTERNAL_H
#define QUICKJS_INTERNAL_H

struct JSVarRef;
struct JSStackFrame;
 JSValue JS_EvalFunctionInternal(JSContext* ctx, JSValue fun_obj,
    JSValueConst this_obj,
    JSVarRef** var_refs, JSStackFrame* sf);

struct JSContext;
struct JSFunctionDef;
JSValue js_create_function(JSContext* ctx, JSFunctionDef* fd);
struct JSFunctionBytecode;
int find_line_num(JSContext* ctx, JSFunctionBytecode* b,
    uint32_t pc_value);
const char* get_func_name(JSContext* ctx, JSValueConst func);
BOOL js_class_has_bytecode(JSClassID class_id);
int get_leb128(uint32_t* pval, const uint8_t* buf,
    const uint8_t* buf_end);
int get_sleb128(int32_t* pval, const uint8_t* buf,
    const uint8_t* buf_end);
struct JSParseState;
void js_parse_init(JSContext* ctx, JSParseState* s,
    const char* input, size_t input_len,
    const char* filename);
void skip_shebang(JSParseState* s);
JSFunctionDef* js_new_function_def(JSContext* ctx,
    JSFunctionDef* parent,
    BOOL is_eval,
    BOOL is_func_expr,
    const char* filename, int line_num);
void js_free_function_def(JSContext* ctx, JSFunctionDef* fd);
int add_closure_var(JSContext* ctx, JSFunctionDef* s,
    BOOL is_local, BOOL is_arg,
    int var_idx, JSAtom var_name,
    BOOL is_const, BOOL is_lexical,
    JSVarKindEnum var_kind);
int add_closure_variables(JSContext* ctx, JSFunctionDef* s,
    JSFunctionBytecode* b, int scope_idx);
int push_scope(JSParseState* s);
int js_parse_program(JSParseState* s);
struct JSToken;
void free_token(JSParseState* s, JSToken* token);
#endif //QUICKJS_INTERNAL_H