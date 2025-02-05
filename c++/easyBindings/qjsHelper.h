#pragma once

extern "C"
{
#include "./quickjs/quickjs.h"
#include "./quickjs/quickjs-libc.h"
}
//#include "easyBinding.h"

inline JSValue js_push(JSContext* ctx, int arg)
{
	return  JS_NewInt32(ctx, arg);
}

inline JSValue js_push(JSContext* ctx, unsigned arg)
{
	return  JS_NewUint32(ctx, arg);
}

inline JSValue js_push(JSContext* ctx, uint8_t arg)
{
	return  JS_NewUint32(ctx, arg);
}

inline JSValue js_push(JSContext* ctx, double arg) {
	return JS_NewFloat64(ctx, arg);
}
inline JSValue js_push(JSContext* ctx, float arg) {
	return JS_NewFloat64(ctx, arg);
}
inline JSValue js_push(JSContext* ctx, const char* arg) {
	return JS_NewString(ctx, arg);
}
inline JSValue js_push(JSContext* ctx, bool arg) {
	return JS_NewBool(ctx, arg);
}

void js_to(JSContext* ctx, JSValueConst thisObj, int* arg);
void js_to(JSContext* ctx, JSValueConst thisObj, unsigned int* arg);
void js_to(JSContext* ctx, JSValueConst thisObj, uint8_t* arg);
void js_to(JSContext* ctx, JSValueConst thisObj, double* arg);
void js_to(JSContext* ctx, JSValueConst thisObj, float* arg);
//void js_to(JSContext* ctx, JSValueConst thisObj, std::string* arg);
void js_to(JSContext* ctx, JSValueConst thisObj, bool* arg);


template< typename T>
void js_set_prop(JSContext* ctx, JSValue thisObj, const char* name, T val)
{
	JS_SetPropertyStr(ctx, thisObj, name, js_push(val));
}

template <typename T>
T* js_to_native_object(JSContext* ctx, JSValueConst thisObj)
{
	if (!JS_IsObject(thisObj))
		return nullptr;

	return (T*)JS_GetOpaqueUnSafe(thisObj);
}

bool js_is_native(JSContext* ctx, JSValueConst thisObj, JSClassID classId);

#pragma region array
template<typename T, typename F>
void js_to_normal_array(JSContext* ctx, JSValueConst thisObj, T& ret, F getFunc) {
	ret.Clear();

	uint32_t length = 0;
	JSValue lenValue = JS_GetProperty(ctx, thisObj, JS_ATOM_length);
	if (JS_IsException(lenValue))goto fail;
	if (JS_ToUint32(ctx, &length, lenValue))goto fail;
	for (int i = 0; i < length; i++) {
		JSValue item = JS_GetPropertyUint32(ctx, thisObj, i);
		auto value = getFunc(ctx, item);
		ret.Push(value);
	}
fail:
	{}
}

template<typename T>
JSValue js_push_normal_array(JSContext* ctx, const T& arr)
{
	JSValue jsArr = JS_NewArray(ctx);
	int idx = 0;
	for (auto i : arr) {
		if (JS_DefinePropertyValueUint32(ctx, jsArr, idx, js_push(ctx, i), 0) < 0) {
			JS_FreeValue(ctx, jsArr);
			jsArr = JS_EXCEPTION;
			break;
		}
		idx++;
	}
	return jsArr;
}

#pragma endregion



void js_default_finalizer(JSRuntime* rt, JSValue val);

template< typename ...Args>
JSValue js_call(JSContext* ctx, JSValueConst funcObj, JSValueConst thisObj,  Args ...args) {
	int size = sizeof...(args);
	JSValue argv[] = { (js_push(ctx, args))... };
	auto ret=JS_Call(ctx, funcObj, thisObj, size, argv);
	for (int i = 0; i < size; i++) {
		JS_FreeValue(ctx, argv[i]);
	}

	if (JS_IsException(ret))
		js_std_dump_error(ctx);

	return ret;
}

template< typename T>
inline JSValue js_call(JSContext* ctx, JSValueConst funcObj, JSValueConst thisObj,  T arg) {
	
	JSValue argv=js_push(ctx, arg);
	auto ret = JS_Call(ctx, funcObj, thisObj, 1, &argv);
	JS_FreeValue(ctx, argv);
	
	if (JS_IsException(ret))
		js_std_dump_error(ctx);
	return ret;
}