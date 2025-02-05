#pragma once
#include "../easyBindings/easyBinding.h"
#include "Object.h"

extern JSClassID  js_Object_id;

template<typename T>
bool js_is_native(JSContext* ctx, JSValueConst thisObj) {
	return js_is_native(ctx, thisObj, T::GetType()->scriptClassId);
}

#define Add_Object(thisObj,obj) JS_SetOpaque(thisObj, obj);obj->AddRef();
#define Remove_Object(thisObj) Base::Object* ref = (Base::Object*)JS_GetOpaqueUnSafe(thisObj);\
if(ref)ref->ReleaseRef();


JSValue js_push_native_object(JSContext* ctx, Object* obj);
inline JSValue js_push(JSContext* ctx, Object* obj) {
	return	js_push_native_object(ctx,obj);
}

void native_finalizer(JSRuntime* rt, JSValue val);