#include "BindingSys.h"


duk_ret_t default_finalizer(duk_context *ctx)
{
    RemoveObject(duk_get_heapptr(ctx, 0));
    return 0;
}

void jsb_Class(duk_context *ctx, String className, String extend, duk_c_function constructor, const duk_function_list_entry *functions, const duk_function_list_entry *staticFuncs, const js_property *prop)
{
    js_push_current_module(ctx);          //[Package]
    duk_get_global_string(ctx, "__extends");           //[Package,__extends]
    duk_push_c_function(ctx, constructor, DUK_VARARGS); //[Package,__extends,constructor]
    void* ptr = duk_get_heapptr(ctx, -1);
    if (extend.Empty())
    {
        duk_push_null(ctx); //[Package,__extends,className,null]
    }
    else
    {
        duk_get_prop_string(ctx, -3, extend.CString()); //[Package,__extends,constructor,extend]
        assert(!duk_is_undefined(ctx, -1));
    }
    duk_call(ctx, 2);           //[Package,retval]
    duk_pop(ctx); //[Package]
    duk_push_heapptr(ctx, ptr); //[Package,constructor]
    if (staticFuncs)
    {
        duk_put_function_list(ctx, -1, staticFuncs); //[Package,constructor[..]=[..]]
    }
    duk_get_prop_string(ctx, -1,"prototype");                //[Package,constructor,prototype]
    if(functions)duk_put_function_list(ctx, -1, functions); //[Package,constructor,prototype[..]=[..]]
    if (prop)
    {
        auto obj_idx = duk_get_top_index(ctx);
        auto p = prop;
        duk_uidx_t flag = -1;
        while (p->key != NULL)
        {
            flag = 0;
            duk_push_string(ctx, p->key);
            if (p->get)
            {
                duk_push_c_function(ctx, p->get, 0);
                flag = flag | DUK_DEFPROP_HAVE_GETTER;
            }
            if (p->set)
            {
                duk_push_c_function(ctx, p->set, 1);
                flag = flag | DUK_DEFPROP_HAVE_SETTER;
            }
            duk_def_prop(ctx, obj_idx, flag| DUK_DEFPROP_SET_ENUMERABLE | DUK_DEFPROP_CLEAR_CONFIGURABLE);
            p++;
        }
    }
    duk_pop(ctx);//[Package,constructor]
    duk_put_prop_string(ctx, -2, className.CString()); //[Package.className=constructor]
    duk_pop_n(ctx, 1); //[]
}

void jsb_func(duk_context* ctx, String funcName, duk_c_function func, int argCount)
{
    js_push_current_module(ctx);          //[Package]
    duk_push_c_function(ctx, func, argCount); //[Package,func]
    duk_put_prop_string(ctx, -2, funcName.CString());//[Package]
    duk_pop(ctx);
}

HashMap<void *, RefCounted *> heapToObject_;
HashMap<RefCounted *, void *> objectToHeap_;
//HashMap<void*, RefCounted*> heapToObject_;
void AddObject(void *heapptr, RefCounted *obj)
{
    heapToObject_[heapptr] = obj;
    objectToHeap_[obj] = heapptr;
    obj->AddRef();
}
void RemoveObject(void *heapptr)
{
    HashMap<void *, RefCounted *>::Iterator hitr = heapToObject_.Find(heapptr);
    assert(hitr != heapToObject_.End());
    RefCounted *ref = heapToObject_[heapptr];
    ref->ReleaseRef();
    heapToObject_.Erase(hitr);
    auto oitr = objectToHeap_.Find(ref);
    objectToHeap_.Erase(oitr);
}

RefCounted *getNativeByPtr(void *heapptr, bool allowNull)
{
    return heapToObject_[heapptr];
}

void *getPtrByNative(RefCounted *obj)
{
    return objectToHeap_[obj];
}

String currentModule_=String();
void js_open_module(duk_context* ctx, const char* moduleName)
{
    //duk_get_global_string(ctx,moduleName);
    if(currentModule_.Empty()){
        currentModule_=moduleName;
        duk_push_object(ctx);
	    duk_put_global_string(ctx, moduleName);
    }
    else{
        assert(currentModule_==moduleName);
    }
}

void js_close_module(duk_context* ctx, const char* moduleName)
{
   // duk_pop(ctx);
    //currentModule_.Clear();
}

void js_push_current_module(duk_context *ctx){
    if(currentModule_.Empty()){
        assert(true);
    }else{
        duk_get_global_string(ctx,currentModule_.CString());
    }
}

void js_push_instance(duk_context *ctx, String className)
{
    js_push_current_module(ctx);         //[Package]
    duk_get_prop_string(ctx, -1, className.CString()); //[Package,className]
    void *ptr = duk_get_heapptr(ctx, -1);
    duk_pop_n(ctx, 2);          //[]
    duk_push_heapptr(ctx, ptr); //[ptr];
    duk_pnew(ctx, 0);           //[obj]
}

void js_push_ctor(duk_context* ctx,String className)
{
    js_push_current_module(ctx);         //[Package]
    duk_get_prop_string(ctx, -1, className.CString()); //[Package,className]
    void *ptr = duk_get_heapptr(ctx, -1);
    duk_pop_n(ctx, 2);          //[]
    duk_push_heapptr(ctx, ptr); //[ptr];
}

void js_push_native_object(duk_context *ctx, RefCounted *obj, String className)
{
    void *ptr = getPtrByNative(obj);
    if (ptr)
    {
        duk_push_heapptr(ctx, ptr);
    }
    else
    {
        duk_push_heap_stash(ctx);                         //[stash]
        duk_push_pointer(ctx, obj);                       //[stash,obj]
        duk_put_prop_string(ctx, -2, jsNewObjWithNative); //[stash[jsNewObjWithNative]=obj]
        duk_pop(ctx);                                     //[]
        js_push_instance(ctx, className);
    }
}




