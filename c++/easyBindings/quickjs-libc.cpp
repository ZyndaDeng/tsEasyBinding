/*
 * QuickJS C library
 *
 * Copyright (c) 2017-2019 Fabrice Bellard
 * Copyright (c) 2017-2019 Charlie Gordon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
#include <stdlib.h>
#include <stdio.h>
#include <stdarg.h>
#include <inttypes.h>
#include <string.h>
#include <assert.h>
#include <errno.h>
#include <fcntl.h>
#include <time.h>
#include <signal.h>
#include <limits.h>
#include <sys/stat.h>
#if defined(_WIN32)
#include <windows.h>
#include <conio.h>
#ifndef PATH_MAX
#define PATH_MAX MAX_PATH
#endif
#else
#include <unistd.h>
#include <dirent.h>
#include <dlfcn.h>
#include <termios.h>
#include <sys/ioctl.h>
#include <sys/time.h>
#include <sys/wait.h>
#if defined(__APPLE__)
typedef sig_t sighandler_t;
#endif
#endif


#include "JSEnv.h"
extern "C"
{
#include "./quickjs/cutils.h"
#include "./quickjs/list.h"
#include "./quickjs/quickjs-libc.h"
//#include "./quickjs/quickjsInternal.h"
//#include "./quickjs/JSContext.h"
}



static void js_std_dbuf_init(JSContext* ctx, DynBuf* s)
{
    dbuf_init2(s, JS_GetRuntime(ctx), (DynBufReallocFunc*)js_realloc_rt);
}

/* TODO:
   - add worker
   - add minimal VT100 emulation for win32
   - add socket calls
*/


static uint64_t os_pending_signals;
static int eval_script_recurse;
static int (*os_poll_func)(JSContext* ctx);



static JSValue js_printf_internal(JSContext* ctx,
    int argc, JSValueConst* argv, FILE* fp)
{
    char fmtbuf[32];
    uint8_t cbuf[UTF8_CHAR_LEN_MAX + 1];
    JSValue res;
    DynBuf dbuf;
    const char* fmt_str;
    const uint8_t* fmt, * fmt_end;
    const uint8_t* p;
    char* q;
    int i, c, len;
    size_t fmt_len;
    int32_t int32_arg;
    int64_t int64_arg;
    double double_arg;
    const char* string_arg;
    enum { PART_FLAGS, PART_WIDTH, PART_DOT, PART_PREC, PART_MODIFIER } part;
    int modsize;
    /* Use indirect call to dbuf_printf to prevent gcc warning */
    int (*dbuf_printf_fun)(DynBuf * s, const char* fmt, ...) = dbuf_printf;

    js_std_dbuf_init(ctx, &dbuf);

    if (argc > 0) {
        fmt_str = JS_ToCStringLen(ctx, &fmt_len, argv[0]);
        if (!fmt_str)
            goto fail;

        i = 1;
        fmt = (const uint8_t*)fmt_str;
        fmt_end = fmt + fmt_len;
        while (fmt < fmt_end) {
            for (p = fmt; fmt < fmt_end && *fmt != '%'; fmt++)
                continue;
            dbuf_put(&dbuf, p, fmt - p);
            if (fmt >= fmt_end)
                break;
            q = fmtbuf;
            *q++ = *fmt++;  /* copy '%' */
            part = PART_FLAGS;
            modsize = 0;
            for (;;) {
                if (q >= fmtbuf + sizeof(fmtbuf) - 1)
                    goto invalid;

                c = *fmt++;
                *q++ = c;
                *q = '\0';

                switch (c) {
                case '1': case '2': case '3':
                case '4': case '5': case '6':
                case '7': case '8': case '9':
                    if (part != PART_PREC) {
                        if (part <= PART_WIDTH)
                            part = PART_WIDTH;
                        else
                            goto invalid;
                    }
                    continue;

                case '0': case '#': case '+': case '-': case ' ': case '\'':
                    if (part > PART_FLAGS)
                        goto invalid;
                    continue;

                case '.':
                    if (part > PART_DOT)
                        goto invalid;
                    part = PART_DOT;
                    continue;

                case '*':
                    if (part < PART_WIDTH)
                        part = PART_DOT;
                    else if (part == PART_DOT)
                        part = PART_MODIFIER;
                    else
                        goto invalid;

                    if (i >= argc)
                        goto missing;

                    if (JS_ToInt32(ctx, &int32_arg, argv[i++]))
                        goto fail;
                    q += snprintf(q, fmtbuf + sizeof(fmtbuf) - q, "%d", int32_arg);
                    continue;

                case 'h':
                    if (modsize != 0 && modsize != -1)
                        goto invalid;
                    modsize--;
                    part = PART_MODIFIER;
                    continue;
                case 'l':
                    q--;
                    if (modsize != 0 && modsize != 1)
                        goto invalid;
                    modsize++;
                    part = PART_MODIFIER;
                    continue;

                case 'c':
                    if (i >= argc)
                        goto missing;
                    if (JS_IsString(argv[i])) {
                        string_arg = JS_ToCString(ctx, argv[i++]);
                        if (!string_arg)
                            goto fail;
                        int32_arg = unicode_from_utf8((uint8_t*)string_arg, UTF8_CHAR_LEN_MAX, &p);
                        JS_FreeCString(ctx, string_arg);
                    }
                    else {
                        if (JS_ToInt32(ctx, &int32_arg, argv[i++]))
                            goto fail;
                    }
                    /* handle utf-8 encoding explicitly */
                    if ((unsigned)int32_arg > 0x10FFFF)
                        int32_arg = 0xFFFD;
                    /* ignore conversion flags, width and precision */
                    len = unicode_to_utf8(cbuf, int32_arg);
                    dbuf_put(&dbuf, cbuf, len);
                    break;

                case 'd':
                case 'i':
                case 'o':
                case 'u':
                case 'x':
                case 'X':
                    if (i >= argc)
                        goto missing;
                    if (modsize > 0) {
                        if (JS_ToInt64(ctx, &int64_arg, argv[i++]))
                            goto fail;
                        q[1] = q[-1];
                        q[-1] = q[0] = 'l';
                        q[2] = '\0';
                        dbuf_printf_fun(&dbuf, fmtbuf, (long long)int64_arg);
                    }
                    else {
                        if (JS_ToInt32(ctx, &int32_arg, argv[i++]))
                            goto fail;
                        dbuf_printf_fun(&dbuf, fmtbuf, int32_arg);
                    }
                    break;

                case 's':
                    if (i >= argc)
                        goto missing;
                    string_arg = JS_ToCString(ctx, argv[i++]);
                    if (!string_arg)
                        goto fail;
                    dbuf_printf_fun(&dbuf, fmtbuf, string_arg);
                    JS_FreeCString(ctx, string_arg);
                    break;

                case 'e':
                case 'f':
                case 'g':
                case 'a':
                case 'E':
                case 'F':
                case 'G':
                case 'A':
                    if (i >= argc)
                        goto missing;
                    if (JS_ToFloat64(ctx, &double_arg, argv[i++]))
                        goto fail;
                    dbuf_printf_fun(&dbuf, fmtbuf, double_arg);
                    break;

                case '%':
                    dbuf_putc(&dbuf, '%');
                    break;

                default:
                    /* XXX: should support an extension mechanism */
                invalid:
                    JS_ThrowTypeError(ctx, "invalid conversion specifier in format string");
                    goto fail;
                missing:
                    JS_ThrowReferenceError(ctx, "missing argument for conversion specifier");
                    goto fail;
                }
                break;
            }
        }
        JS_FreeCString(ctx, fmt_str);
    }
    if (dbuf.error) {
        res = JS_ThrowOutOfMemory(ctx);
    }
    else {
        if (fp) {
            len = fwrite(dbuf.buf, 1, dbuf.size, fp);
            res = JS_NewInt32(ctx, len);
        }
        else {
            res = JS_NewStringLen(ctx, (char*)dbuf.buf, dbuf.size);
        }
    }
    dbuf_free(&dbuf);
    return res;

fail:
    dbuf_free(&dbuf);
    return JS_EXCEPTION;
}



inline static  JSValue js_require_internal(JSContext* ctx, const char* fileName) {
    auto jsFile(system_load_file(ctx, fileName));
   if(jsFile.size()<=0)return JS_EXCEPTION;

        int eval_flags = JS_EVAL_TYPE_GLOBAL;
        JSValue ret;
        if (JS_DetectModule(jsFile.c_str(), jsFile.size())) {
            eval_flags = JS_EVAL_TYPE_MODULE;
        }

        if ((eval_flags & JS_EVAL_TYPE_MASK) == JS_EVAL_TYPE_MODULE) {
            /* for the modules, we compile then run to be able to set import.meta */
            ret = JS_Eval(ctx, jsFile.c_str(),
                jsFile.size(),
                fileName,
                eval_flags | JS_EVAL_FLAG_COMPILE_ONLY);
            if (!JS_IsException(ret)) {
                js_module_set_import_meta(ctx, ret, TRUE, TRUE);
                ret = JS_EvalFunction(ctx, ret);
            }
        }
        else {
            ret = JS_Eval(ctx, jsFile.c_str(),
                jsFile.size(),
                fileName,
                eval_flags);
        }
        return ret;
    
    
}

int JS_Require(JSContext* ctx, const char* fileName)
{
    JSValue ret = js_require_internal(ctx, fileName);
    if (JS_IsException(ret)) {
        js_std_dump_error(ctx);
        JS_FreeValue(ctx, ret);
        return FALSE;
    }

    JS_FreeValue(ctx, ret);
    return TRUE;
}

/* load and evaluate a file */
static JSValue js_loadScript(JSContext* ctx, JSValueConst this_val,
    int argc, JSValueConst* argv)
{
    const char* filename;
    JSValue ret;

    filename = JS_ToCString(ctx, argv[0]);
    if (!filename)
        return JS_EXCEPTION;

    ret = js_require_internal(ctx, filename);
    JS_FreeCString(ctx, filename);
    return ret;
}

typedef JSModuleDef* (JSInitModuleFunc)(JSContext* ctx,
    const char* module_name);



static JSModuleDef* js_module_loader_so(JSContext* ctx,
    const char* module_name)
{
    JS_ThrowReferenceError(ctx, "shared library modules are not supported yet");
    return NULL;
}


int js_module_set_import_meta(JSContext* ctx, JSValueConst func_val,
    JS_BOOL use_realpath, JS_BOOL is_main)
{
    JSModuleDef* m;
    char buf[PATH_MAX + 16];
    JSValue meta_obj;
    JSAtom module_name_atom;
    const char* module_name;

    assert(JS_VALUE_GET_TAG(func_val) == JS_TAG_MODULE);
    m = (JSModuleDef*)JS_VALUE_GET_PTR(func_val);

    module_name_atom = JS_GetModuleName(ctx, m);
    module_name = JS_AtomToCString(ctx, module_name_atom);
    JS_FreeAtom(ctx, module_name_atom);
    if (!module_name)
        return -1;
    if (!strchr(module_name, ':')) {
        strcpy(buf, "file://");
#if !defined(_WIN32)
        /* realpath() cannot be used with modules compiled with qjsc
           because the corresponding module source code is not
           necessarily present */
        if (use_realpath) {
            char* res = realpath(module_name, buf + strlen(buf));
            if (!res) {
                JS_ThrowTypeError(ctx, "realpath failure");
                JS_FreeCString(ctx, module_name);
                return -1;
            }
        }
        else
#endif
        {
            pstrcat(buf, sizeof(buf), module_name);
        }
    }
    else {
        pstrcpy(buf, sizeof(buf), module_name);
    }
    JS_FreeCString(ctx, module_name);

    meta_obj = JS_GetImportMeta(ctx, m);
    if (JS_IsException(meta_obj))
        return -1;
    JS_DefinePropertyValueStr(ctx, meta_obj, "url",
        JS_NewString(ctx, buf),
        JS_PROP_C_W_E);
    JS_DefinePropertyValueStr(ctx, meta_obj, "main",
        JS_NewBool(ctx, is_main),
        JS_PROP_C_W_E);
    JS_FreeValue(ctx, meta_obj);
    return 0;
}

JSModuleDef* js_module_loader(JSContext* ctx,
    const char* module_name, void* opaque)
{
    JSModuleDef* m;

    if (has_suffix(module_name, ".so")) {
        m = js_module_loader_so(ctx, module_name);
    }
    else {

        JSValue func_val;

        /* compile the module */
        auto str(system_load_file(ctx, module_name));
        func_val = JS_Eval(ctx, str.c_str(), str.size(), module_name,
            JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY);
        //js_free(ctx, buf);
        if (JS_IsException(func_val)) {
            JS_FreeValue(ctx, func_val);
            return NULL;
        }

        /* XXX: could propagate the exception */
        js_module_set_import_meta(ctx, func_val, TRUE, FALSE);
        /* the module is already referenced, so we must free it */
        m = (JSModuleDef*)JS_VALUE_GET_PTR(func_val);
        JS_FreeValue(ctx, func_val);
    }
    return m;
}

//static JSValue js_std_exit(JSContext *ctx, JSValueConst this_val,
//                           int argc, JSValueConst *argv)
//{
//    int status;
//    if (JS_ToInt32(ctx, &status, argv[0]))
//        status = -1;
//    exit(status);
//    return JS_UNDEFINED;
//}
//
//static JSValue js_std_getenv(JSContext *ctx, JSValueConst this_val,
//                           int argc, JSValueConst *argv)
//{
//    const char *name, *str;
//    name = JS_ToCString(ctx, argv[0]);
//    if (!name)
//        return JS_EXCEPTION;
//    str = getenv(name);
//    JS_FreeCString(ctx, name);
//    if (!str)
//        return JS_UNDEFINED;
//    else
//        return JS_NewString(ctx, str);
//}
//
//static JSValue js_std_gc(JSContext *ctx, JSValueConst this_val,
//                         int argc, JSValueConst *argv)
//{
//    JS_RunGC(JS_GetRuntime(ctx));
//    return JS_UNDEFINED;
//}

static int interrupt_handler(JSRuntime* rt, void* opaque)
{
    return (os_pending_signals >> SIGINT) & 1;
}

static JSValue js_evalScript(JSContext* ctx, JSValueConst this_val,
    int argc, JSValueConst* argv)
{
    const char* str;
    size_t len;
    JSValue ret;
    str = JS_ToCStringLen(ctx, &len, argv[0]);
    if (!str)
        return JS_EXCEPTION;
    if (++eval_script_recurse == 1) {
        /* install the interrupt handler */
        JS_SetInterruptHandler(JS_GetRuntime(ctx), interrupt_handler, NULL);
    }
    ret = JS_Eval(ctx, str, len, "<evalScript>", JS_EVAL_TYPE_GLOBAL);
    JS_FreeCString(ctx, str);
    if (--eval_script_recurse == 0) {
        /* remove the interrupt handler */
        JS_SetInterruptHandler(JS_GetRuntime(ctx), NULL, NULL);
        os_pending_signals &= ~((uint64_t)1 << SIGINT);
        /* convert the uncatchable "interrupted" error into a normal error
           so that it can be caught by the REPL */
        if (JS_IsException(ret))
            JS_ResetUncatchableError(ctx);
    }
    return ret;
}







/* urlGet */

#define URL_GET_PROGRAM "curl -s -i"
#define URL_GET_BUF_SIZE 4096

static int http_get_header_line(FILE* f, char* buf, size_t buf_size,
    DynBuf* dbuf)
{
    int c;
    char* p;

    p = buf;
    for (;;) {
        c = fgetc(f);
        if (c < 0)
            return -1;
        if ((p - buf) < buf_size - 1)
            *p++ = c;
        if (dbuf)
            dbuf_putc(dbuf, c);
        if (c == '\n')
            break;
    }
    *p = '\0';
    return 0;
}

static int http_get_status(const char* buf)
{
    const char* p = buf;
    while (*p != ' ' && *p != '\0')
        p++;
    if (*p != ' ')
        return 0;
    while (*p == ' ')
        p++;
    return atoi(p);
}

static int get_bool_option(JSContext* ctx, BOOL* pbool,
    JSValueConst obj,
    const char* option)
{
    JSValue val;
    val = JS_GetPropertyStr(ctx, obj, option);
    if (JS_IsException(val))
        return -1;
    if (!JS_IsUndefined(val)) {
        *pbool = JS_ToBool(ctx, val);
    }
    JS_FreeValue(ctx, val);
    return 0;
}





static void call_handler(JSContext* ctx, JSValueConst func)
{
    JSValue ret, func1;
    /* 'func' might be destroyed when calling itself (if it frees the
       handler), so must take extra care */
    func1 = JS_DupValue(ctx, func);
    ret = JS_Call(ctx, func1, JS_UNDEFINED, 0, NULL);
    JS_FreeValue(ctx, func1);
    if (JS_IsException(ret))
        js_std_dump_error(ctx);
    JS_FreeValue(ctx, ret);
}


static JSValue make_obj_error(JSContext* ctx,
    JSValue obj,
    int err)
{
    JSValue arr;
    if (JS_IsException(obj))
        return obj;
    arr = JS_NewArray(ctx);
    if (JS_IsException(arr))
        return JS_EXCEPTION;
    JS_DefinePropertyValueUint32(ctx, arr, 0, obj,
        JS_PROP_C_W_E);
    JS_DefinePropertyValueUint32(ctx, arr, 1, JS_NewInt32(ctx, err),
        JS_PROP_C_W_E);
    return arr;
}

static JSValue make_string_error(JSContext* ctx,
    const char* buf,
    int err)
{
    return make_obj_error(ctx, JS_NewString(ctx, buf), err);
}




#if defined(_WIN32)
#define OS_PLATFORM "win32"
#elif defined(__APPLE__)
#define OS_PLATFORM "darwin"
#elif defined(EMSCRIPTEN)
#define OS_PLATFORM "js"
#else
#define OS_PLATFORM "linux"
#endif

#define OS_FLAG(x) JS_PROP_INT32_DEF(#x, x, JS_PROP_CONFIGURABLE )



/**********************************************************/

static JSValue js_print(JSContext* ctx, JSValueConst this_val,
    int argc, JSValueConst* argv)
{
    int i;
    const char* str;
    size_t len;
    std::string out;
    for (i = 0; i < argc; i++) {
        if (i != 0)
            out +=' ';
        str = JS_ToCStringLen(ctx, &len, argv[i]);
        if (!str)
            return JS_EXCEPTION;
         out += str;
        JS_FreeCString(ctx, str);
    }
    system_print(out.c_str());
    //putchar('\n');
    return JS_UNDEFINED;

}

void js_init_print(JSContext* ctx) {
    JSValue global_obj;
    global_obj = JS_GetGlobalObject(ctx);

    JS_SetPropertyStr(ctx, global_obj, "print",
        JS_NewCFunction(ctx, js_print, "print", 1));
    JS_FreeValue(ctx, global_obj);
}

void js_std_add_helpers(JSContext* ctx, int argc, char** argv)
{
    JSValue global_obj, console, args;
    int i;

    /* XXX: should these global definitions be enumerable? */
    global_obj = JS_GetGlobalObject(ctx);

    console = JS_NewObject(ctx);
    JS_SetPropertyStr(ctx, console, "log",
        JS_NewCFunction(ctx, js_print, "log", 1));
    JS_SetPropertyStr(ctx, global_obj, "console", console);

    /* same methods as the mozilla JS shell */
    args = JS_NewArray(ctx);
    for (i = 0; i < argc; i++) {
        JS_SetPropertyUint32(ctx, args, i, JS_NewString(ctx, argv[i]));
    }
    JS_SetPropertyStr(ctx, global_obj, "scriptArgs", args);

    JS_SetPropertyStr(ctx, global_obj, "print",
        JS_NewCFunction(ctx, js_print, "print", 1));
    JS_SetPropertyStr(ctx, global_obj, "__loadScript",
        JS_NewCFunction(ctx, js_loadScript, "__loadScript", 1));

    JS_FreeValue(ctx, global_obj);

}

void js_std_free_handlers(JSRuntime* rt)
{

}

void js_std_dump_error(JSContext* ctx)
{
    JSValue exception_val, val;
    const char* stack;
    BOOL is_error;

    exception_val = JS_GetException(ctx);
    is_error = JS_IsError(ctx, exception_val);
    if (!is_error)
        system_logError("Throw: ");
    js_print(ctx, JS_NULL, 1, (JSValueConst*)&exception_val);
    if (is_error) {
        val = JS_GetPropertyStr(ctx, exception_val, "stack");
        if (!JS_IsUndefined(val)) {
            stack = JS_ToCString(ctx, val);
            system_logErrorf( stack);
            JS_FreeCString(ctx, stack);
        }
        JS_FreeValue(ctx, val);
    }
    JS_FreeValue(ctx, exception_val);
}

/* main loop which calls the user JS callbacks */
void js_std_loop(JSContext* ctx)
{
    JSContext* ctx1;
    int err;

    /* execute the pending jobs */
    for (;;) {
        err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx1);
        if (err <= 0) {
            if (err < 0) {
                js_std_dump_error(ctx1);
            }
            break;
        }
    }
}
//void js_std_loop(JSContext *ctx)
//{
//    JSContext *ctx1;
//    int err;
//
//    for(;;) {
//        /* execute the pending jobs */
//        for(;;) {
//            err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx1);
//            if (err <= 0) {
//                if (err < 0) {
//                    js_std_dump_error(ctx1);
//                }
//                break;
//            }
//        }
//
//        if (!os_poll_func || os_poll_func(ctx))
//            break;
//    }
//}

void js_std_eval_binary(JSContext* ctx, const uint8_t* buf, size_t buf_len,
    int load_only)
{
    JSValue obj, val;
    obj = JS_ReadObject(ctx, buf, buf_len, JS_READ_OBJ_BYTECODE);
    if (JS_IsException(obj))
        goto exception;
    if (load_only) {
        if (JS_VALUE_GET_TAG(obj) == JS_TAG_MODULE) {
            js_module_set_import_meta(ctx, obj, FALSE, FALSE);
        }
    }
    else {
        if (JS_VALUE_GET_TAG(obj) == JS_TAG_MODULE) {
            if (JS_ResolveModule(ctx, obj) < 0) {
                JS_FreeValue(ctx, obj);
                goto exception;
            }
            js_module_set_import_meta(ctx, obj, FALSE, TRUE);
        }
        val = JS_EvalFunction(ctx, obj);
        if (JS_IsException(val)) {
        exception:
            js_std_dump_error(ctx);
            exit(1);
        }
        JS_FreeValue(ctx, val);
    }
}

