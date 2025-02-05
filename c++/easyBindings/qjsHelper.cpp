#include "qjsHelper.h"

//JSValue js_push(JSContext* ctx, int arg)
//{
//    return  JS_NewInt32(ctx, arg);
//}
//
//JSValue js_push(JSContext* ctx, unsigned arg)
//{
//    return  JS_NewUint32(ctx, arg);
//}
//
//JSValue js_push(JSContext* ctx, uint8_t arg)
//{
//    return  JS_NewUint32(ctx, arg);
//}
//
//JSValue js_push(JSContext* ctx, double arg) {
//    return JS_NewFloat64(ctx, arg);
//}
//JSValue js_push(JSContext* ctx, float arg) {
//    return JS_NewFloat64(ctx, arg);
//}
//JSValue js_push(JSContext* ctx, const char* arg) {
//    return JS_NewString(ctx, arg);
//}
//JSValue js_push(JSContext* ctx, bool arg) {
//    return JS_NewBool(ctx, arg);
//}

void js_to(JSContext* ctx, JSValueConst thisObj, int* arg) {
    JS_ToInt32(ctx, arg, thisObj);
}

void js_to(JSContext* ctx, JSValueConst thisObj, unsigned int* arg)
{
    uint32_t ret = 0;
    JS_ToUint32(ctx, &ret, thisObj);
    *arg = ret;
}

void js_to(JSContext* ctx, JSValueConst thisObj, uint8_t* arg) {
    uint32_t ret = 0;
    JS_ToUint32(ctx, &ret, thisObj);
    *arg = (uint8_t)ret;
}

void js_to(JSContext* ctx, JSValueConst thisObj, double* arg) {
    JS_ToFloat64(ctx, arg, thisObj);
}

void js_to(JSContext* ctx, JSValueConst thisObj, float* arg) {
    double t = 0; JS_ToFloat64(ctx, &t, thisObj);
    *arg = t;
}

void js_to(JSContext* ctx, JSValueConst thisObj, bool* arg) {
    *arg= JS_ToBool(ctx,  thisObj);
}

bool js_is_native(JSContext* ctx, JSValueConst thisObj, JSClassID classId)
{
    // JSValue proto = JS_GetClassProto(ctx, id);
     //if (JS_IsNull(proto))return false;

    JSValue proto = JS_GetClassProto(ctx, classId);
    bool ret = JS_IsPrototypeOf(ctx, proto, thisObj) == 1;
    JS_FreeValue(ctx, proto);

    return ret;
}

void js_default_finalizer(JSRuntime* rt, JSValue val)
{
    void* native = JS_GetOpaqueUnSafe(val);
    delete native;
}