#pragma once

#include<Duktape/duktape.h>



#define jsNewObjWithNative "jsNewObjWithNative"


struct js_property
{
	const char *key;
	duk_c_function get;
	duk_c_function set;
};

class RefCounted;//
class String;//

RefCounted *getNativeByPtr(void *heapptr, bool allowNull = false);
void *getPtrByNative(RefCounted *obj);
void AddObject(void *heapptr, RefCounted *obj);
void RemoveObject(void *heapptr);

duk_ret_t default_finalizer(duk_context *ctx);

void js_push_native_object(duk_context *ctx, RefCounted *obj, String className);

template <typename T>
T *js_to_native_object(duk_context *ctx, int index)
{
	if (!duk_is_object(ctx, index))
		return NULL;

	return (T *)getNativeByPtr(duk_get_heapptr(ctx, index));
}

template <typename T>
bool js_is_native(duk_context *ctx, int index)
{
	return duk_is_object(ctx, index);
}

// template <typename T>
// void js_push_native_array(duk_context* ctx, const Vector<T>& arr)
// {
// 	duk_idx_t arr_idx = duk_push_array(ctx);
// 	int idx = 0;
// 	for (auto i : arr) {
// 		js_push_native_object(ctx, i, i->GetTypeName());
// 		duk_put_prop_index(ctx, arr_idx, idx);
// 		idx++;
// 	}
// }

// template <typename T>
// void js_push_native_array(duk_context* ctx, const PODVector<T*>& arr)
// {
// 	duk_idx_t arr_idx = duk_push_array(ctx);
// 	int idx = 0;
// 	for (auto i : arr) {
// 		js_push_native_object(ctx, i, i->GetTypeName());
// 		duk_put_prop_index(ctx, arr_idx, idx);
// 		idx++;
// 	}
// }

// template <typename T>
// void js_to_native_array(duk_context* ctx, int narg, PODVector<T>& arr) {
// 	arr.Clear();
// 	duk_enum(ctx, narg, DUK_ENUM_ARRAY_INDICES_ONLY);
// 	while (duk_next(ctx, -1 /*enum_index*/, 1 /*get_value*/))
// 	{
// 		/* [ ... enum key ] */
// 		auto value = js_to_native_object<T>(ctx, -1);
// 		arr.Push(value);
// 		duk_pop_2(ctx); /* pop_key & value*/
// 	}
// 	duk_pop(ctx);
// }


void js_open_module(duk_context *ctx, const char* moduleName);
void js_close_module(duk_context*ctx,const char* moduleName);
void js_push_current_module(duk_context *ctx);

//push已注册的对象的一个实例
void js_push_instance(duk_context *ctx, String className);
//push已注册的对象的构造函数
void js_push_ctor(duk_context *ctx, String className);
//绑定类
void jsb_Class(duk_context *ctx, String className, String extend, duk_c_function constructor, const duk_function_list_entry *functions, const duk_function_list_entry *staticFuncs, const js_property *prop);
//绑定函数
void jsb_func(duk_context* ctx, String funcName, duk_c_function func, int argCount);
