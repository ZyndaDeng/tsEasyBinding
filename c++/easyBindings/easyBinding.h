#pragma once

//#define CONFIG_BIGNUM
#include "qjsHelper.h"

#include <vector>
#include <string_view>
#include <string>
#include <cassert>
#include <memory>
#include <cstddef>
#include <algorithm>
#include <tuple>
#include <functional>
#include <stdexcept>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

//#ifdef _MSC_VER
//typedef JSValue JSCGetter(JSContext* ctx, JSValueConst this_val);
//typedef JSValue JSCSetter(JSContext* ctx, JSValueConst this_val, JSValueConst val);
//typedef JSValue JSCGetterMagic(JSContext* ctx, JSValueConst this_val, int magic);
//typedef JSValue JSCSetterMagic(JSContext* ctx, JSValueConst this_val, JSValueConst val, int magic);
//typedef JSValue JSCIteratorNext(JSContext* ctx, JSValueConst this_val,
//    int argc, JSValueConst* argv, int* pdone, int magic);
//static JSCFunctionListEntry getGetSetDef(const char* name, JSCGetter* fgetter, JSCSetter* fsetter) {
//    JSCFunctionListEntry ret{ name, JS_PROP_CONFIGURABLE,JS_DEF_CGETSET,0,{} };
//    ret.u.getset.get.getter = fgetter;
//    ret.u.getset.set.setter = fsetter;
//    return ret;
//}
//static JSCFunctionListEntry getGetSetMagicDef(const char* name, JSCGetter* fgetter, JSCSetter* fsetter, int16_t magic) {
//    JSCFunctionListEntry ret{ name, JS_PROP_CONFIGURABLE,JS_DEF_CGETSET_MAGIC,magic,{} };
//    ret.u.getset.get.getter = fgetter;
//    ret.u.getset.set.setter = fsetter;
//    return ret;
//}
//static JSCFunctionListEntry getStringDef(const char* name, const char* cstr, uint8_t prop_flags) {
//    JSCFunctionListEntry ret{ name, prop_flags,JS_DEF_PROP_STRING,0,{} };
//    ret.u.str = cstr;
//    return ret;
//}
//static JSCFunctionListEntry getObjectDef(const char* name, JSCFunctionListEntry* tab,int len, uint8_t prop_flags) {
//    JSCFunctionListEntry ret{ name, prop_flags,JS_DEF_OBJECT,0,{} };
//    ret.u.prop_list.tab = tab;
//    ret.u.prop_list.len = len;
//    return ret;
//}
//#define JSB_CFUNC_DEF(name, length, func1) { name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_CFUNC, 0,  { length, JS_CFUNC_generic, {  func1 } } }
//#define JSB_CFUNC_MAGIC_DEF(name, length, func1, magic) { name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_CFUNC, magic, { length, JS_CFUNC_generic_magic, { func1 } } }
//#define JSB_CFUNC_SPECIAL_DEF(name, length, cproto, func1) { name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_CFUNC, 0,  { length, JS_CFUNC_ ## cproto, {  func1 } } }
//#define JSB_ITERATOR_NEXT_DEF(name, length, func1, magic) { name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_CFUNC, magic, { length, JS_CFUNC_iterator_next, {  func1 } } }
//#define JSB_CGETSET_DEF(name, fgetter, fsetter) getGetSetDef(name,fgetter,fsetter)
//#define JSB_CGETSET_MAGIC_DEF(name, fgetter, fsetter, magic) getGetSetMagicDef(name, fgetter, fsetter, magic)
//#define JSB_PROP_STRING_DEF(name, cstr, prop_flags) getStringDef(name, cstr, prop_flags)
//#define JSB_PROP_INT32_DEF(name, val, prop_flags) { name, prop_flags, JS_DEF_PROP_INT32, 0,  val }
//#define JSB_PROP_INT64_DEF(name, val, prop_flags) { name, prop_flags, JS_DEF_PROP_INT64, 0,  val }
//#define JSB_PROP_DOUBLE_DEF(name, val, prop_flags) { name, prop_flags, JS_DEF_PROP_DOUBLE, 0,  val }
//#define JSB_PROP_UNDEFINED_DEF(name, prop_flags) { name, prop_flags, JS_DEF_PROP_UNDEFINED, 0,  0 }
//#define JSB_OBJECT_DEF(name, tab, len, prop_flags) getObjectDef(name, tab, len, prop_flags)
//#define JSB_ALIAS_DEF(name, from) { name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_ALIAS, 0,  { from, -1 } }
//#define JSB_ALIAS_BASE_DEF(name, from, base) { name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_ALIAS, 0, { from, base } }
//#else
#define JSB_CFUNC_DEF(name, length, func1) JS_CFUNC_DEF(name, length, func1)
#define JSB_CFUNC_MAGIC_DEF(name, length, func1, magic) JS_CFUNC_MAGIC_DEF(name, length, func1, magic)
#define JSB_CFUNC_SPECIAL_DEF(name, length, cproto, func1) JS_CFUNC_SPECIAL_DEF(name, length, cproto, func1)
#define JSB_ITERATOR_NEXT_DEF(name, length, func1, magic) JS_ITERATOR_NEXT_DEF(name, length, func1, magic)
#define JSB_CGETSET_DEF(name, fgetter, fsetter) JS_CGETSET_DEF(name, fgetter, fsetter)
#define JSB_CGETSET_MAGIC_DEF(name, fgetter, fsetter, magic) JS_CGETSET_MAGIC_DEF(name, fgetter, fsetter, magic)
#define JSB_PROP_STRING_DEF(name, cstr, prop_flags) JS_PROP_STRING_DEF(name, cstr, prop_flags)
#define JSB_PROP_INT32_DEF(name, val, prop_flags) JS_PROP_INT32_DEF(name, val, prop_flags)
#define JSB_PROP_INT64_DEF(name, val, prop_flags) JS_PROP_INT64_DEF(name, val, prop_flags)
#define JSB_PROP_DOUBLE_DEF(name, val, prop_flags) JS_PROP_DOUBLE_DEF(name, val, prop_flags)
#define JSB_PROP_UNDEFINED_DEF(name, prop_flags) JS_PROP_UNDEFINED_DEF(name, prop_flags)
#define JSB_OBJECT_DEF(name, tab, len, prop_flags) JS_OBJECT_DEF(name, tab, len, prop_flags)
#define JSB_ALIAS_DEF(name, from) JS_ALIAS_DEF(name, from)
#define JSB_ALIAS_BASE_DEF(name, from, base) JS_ALIAS_BASE_DEF(name, from, base)
//#endif

#define MakeDupValue(ctx,obj) (ctx,JS_DupValue(ctx, thisObj))
namespace jsb
{

    class Value
    {
    public:
        JSValue v;
        JSContext* ctx = nullptr;

    public:
        /** Use context.newValue(val) instead */
        //template <typename T>
        //Value(JSContext* ctx, T&& val) : ctx(ctx)
        //{
        //    v = js_traits<std::decay_t<T>>::wrap(ctx, std::forward<T>(val));
        //   /* if (JS_IsException(v))
        //        throw exception{};*/
        //}

        //用已经dup的JSValue创建Value
        Value(JSContext* ctx, JSValue v) :
            ctx(ctx)
            , v(v) {
             //qjs获得的值通常已经引用过一次 所以这里不再引用
           //if(ctx) JS_DupValue(ctx, v);
        }

        ~Value()
        {
            if (ctx) JS_FreeValue(ctx, v);
        }

        Value(const Value& rhs)
        {
            ctx = rhs.ctx;
            v = JS_DupValue(ctx, rhs.v);
        }

        Value(Value&& rhs)
        {
            std::swap(ctx, rhs.ctx);
            v = rhs.v;
        }

        Value& operator=(Value rhs)
        {
            std::swap(ctx, rhs.ctx);
            std::swap(v, rhs.v);
            return *this;
        }

        bool operator==(JSValueConst other) const
        {
            return JS_VALUE_GET_TAG(v) == JS_VALUE_GET_TAG(other) && JS_VALUE_GET_PTR(v) == JS_VALUE_GET_PTR(other);
        }

        bool operator!=(JSValueConst other) const { return !((*this) == other); }


        /** Returns true if 2 values are the same (equality for arithmetic types or point to the same object) */
        bool operator==(const Value& rhs) const
        {
            return ctx == rhs.ctx && (*this == rhs.v);
        }

        bool operator!=(const Value& rhs) const { return !((*this) == rhs); }

#pragma region Check
        inline bool isError() const { return JS_IsError(ctx, v); }
        inline bool isUndefined() const { return JS_IsUndefined(v); }
#pragma endregion

#pragma region To
       inline std::string toString() {
            size_t len = 0;
            const char* cstr = JS_ToCStringLen(ctx, &len, v);
            std::string str(cstr, len);
            JS_FreeCString(ctx, cstr);
            return str;
        }
       
       template<typename T>
       void to(T* arg) const{
           js_to(ctx, v, arg);
       }
#pragma endregion

#pragma region Property
       inline Value get(const char* k) const {
            return Value(ctx, JS_GetPropertyStr(ctx, v, k));
        }

       inline  Value get(JSAtom prop) const {
            return Value(ctx, JS_GetProperty(ctx, v, prop));
        }

       inline uint32_t length() {
           uint32_t length = 0;
           JSValue lenValue = JS_GetProperty(ctx, v, JS_ATOM_length);
           if (JS_IsException(lenValue))return 0;
           if (JS_ToUint32(ctx, &length, lenValue))return 0;
           return length;
       }

       inline Value at(uint32_t idx) const {
            return Value(ctx, JS_GetPropertyUint32(ctx, v, idx));
        }

       inline void setProperty(const char* k, JSValueConst v) const {
            JS_SetPropertyStr(ctx, v, k, v);
        }

       template<typename T>
        void set(const char* k, T v)const {
            JS_SetPropertyStr(ctx, v, k, js_push(v));
       }
       

        const Value operator [](const char* k) const {
            return get(k);
        }
        const Value operator [](uint32_t idx) const {
            return at(idx);
        }
#pragma endregion
        template< typename T>
        inline JSValue call(const Value& thisValue, T arg) const{
            return js_call(ctx, v, thisValue.v, arg);
        }
       
        JSValue release() // dont call freevalue
        {
            ctx = nullptr;
            return v;
        }

        /** Implicit conversion to JSValue (rvalue only). Example: JSValue v = std::move(value); */
        operator JSValue()&& { return release(); }

        void addProperty(const JSCFunctionListEntry* list, int listCount) const{
            JS_SetPropertyFunctionList(ctx, v, list,listCount);
        }

        void setPrototype(const Value& proto) const {
            JS_SetPrototype(ctx, v, proto.v);
        }
       

    };

    /** A custom allocator that uses js_malloc_rt and js_free_rt
 */
        template <typename T>
    struct allocator
    {
        JSRuntime* rt;
        using value_type = T;
        using propagate_on_container_move_assignment = std::true_type;
        using propagate_on_container_copy_assignment = std::true_type;

        constexpr allocator(JSRuntime* rt) noexcept : rt{ rt }
        {}

        allocator(JSContext* ctx) noexcept : rt{ JS_GetRuntime(ctx) }
        {}

        template <class U>
        constexpr allocator(const allocator<U>& other) noexcept : rt{ other.rt }
        {}

        [[nodiscard]] T* allocate(std::size_t n)
        {
            if (auto p = static_cast<T*>(js_malloc_rt(rt, n * sizeof(T)))) return p;
            throw std::bad_alloc();
        }

        void deallocate(T* p, std::size_t) noexcept
        {
            js_free_rt(rt, p);
        }

        template <class U>
        bool operator ==(const allocator<U>& other) const
        {
            return rt == other.rt;
        }

        template <class U>
        bool operator !=(const allocator<U>& other) const
        {
            return rt != other.rt;
        }
    };

class Runtime
{
public:
    JSRuntime *rt;

    Runtime()
    {
        rt = JS_NewRuntime();
        if (!rt)
            throw std::runtime_error{"jsb: Cannot create runtime"};
    }

    // noncopyable
    Runtime(const Runtime &) = delete;

    ~Runtime()
    {
        JS_FreeRuntime(rt);
    }
};

class Context;
class JSBModule {
    friend class Context;

    JSModuleDef* m;
    JSContext* ctx;
    

    using nvp = std::pair<const char*, Value>;
    std::vector<nvp, allocator<nvp>> exports;
public:
    const char* name;
    JSBModule(JSContext* ctx, const char* name) ;

    ~JSBModule() {
        name;
    }

    JSBModule& add(const char* name, JSValue value)
    {
        exports.push_back({ name, {ctx, value} });
        JS_AddModuleExport(ctx, m, name);
        return *this;
    }

    JSBModule& add(const char* name, Value value)
    {
        assert(value.ctx == ctx);
        exports.push_back({ name, std::move(value) });
        JS_AddModuleExport(ctx, m, name);
        return *this;
    }

};

class Context
{
public:
    JSContext* ctx;
    JSValue oprValue;

    std::vector<JSBModule, allocator<JSBModule>> modules;

    Context(Runtime& rt) : Context(rt.rt)
    {}

    Context(JSRuntime* rt) : modules{ rt }
    {
        ctx = JS_NewContext(rt);
        JS_SetContextOpaque(ctx, this);
        if (!ctx)
            throw std::runtime_error{ "jsb: Cannot create context" };
       
       /* std::string s = " Operators.create({\
            \"+\"(a, b) {\
            return a.oprAdd(b)\
        },\
            \"-\"(a, b) {\
                return a.oprSub(b)\
            },\
                \"*\"(a, b) {\
                    return a.oprMult(b);\
                },\
                    \"/\"(a, b) {\
                    return a.oprDiv(b);\
                },\
                    \"==\"(a, b ) {\
                    return a.equals(b);\
                }\
    },{\
            left: Number,\
            \"*\"(a, b) {\
            return b.oprMult(a);\
        }\
    },\
    {\
        right: Number,\
        \"*\"(a, b) {\
            return a.oprMult(b);\
        }\
    });";
        JS_AddIntrinsicOperators(ctx);
        oprValue = JS_Eval(ctx, s.c_str(), s.length(), "<opr>", JS_EVAL_TYPE_GLOBAL);
        if (JS_IsException(oprValue)) {
            js_std_dump_error(ctx);
        }*/
       // instance_ = this;

    }

    ~Context() {
        JS_FreeValue(ctx, oprValue);
        JS_SetContextOpaque(ctx, nullptr);
        JS_FreeContext(ctx);
        //instance_ = nullptr;
    }


    int setDefOpr(const Value& v) const {
        JSValue opset_obj;

        if (!JS_IsObject(v.v)) /* in case the prototype is not defined */
            return 0;
        opset_obj =oprValue;
        if (JS_IsException(opset_obj))
            return -1;
        /* cannot be modified by the user */
        JS_DupValue(ctx, oprValue);
        JS_DefinePropertyValue(ctx, v.v, JS_ATOM_Symbol_operatorSet,
            opset_obj, 0);
        return 0;
    }

    /** returns globalThis */
    Value global() const { return Value{ ctx, JS_GetGlobalObject(ctx) }; }

    /** returns new Object() */
    Value newObject() const { return Value{ ctx, JS_NewObject(ctx) }; }

    Value getOrNewObject(const Value& v, const char* key) const{
        Value ret = v.get(key);
        if (!ret.isUndefined()) {
            return ret;
        }
        Value n = newObject();
        v.setProperty(key, n.v);
        return n;
    }

     JSBModule& getOrNewModule(const char* key)   {
        auto it = std::find_if(modules.begin(), modules.end(),
            [key](const JSBModule& module) { return strcmp(module.name, key) == 0; });
        if (it == modules.end()) {
            JSBModule m(ctx, key);
            modules.emplace_back(m);
           
            return modules.back();
        }
        else {
            return *it;
        }
    }

    Value newValue(JSValueConst v)const { return Value{ ctx,v }; }

    Value newFunc(JSCFunction* cFunc,const char* name) const { return Value{ ctx, JS_NewCFunction(ctx,cFunc,name,0) }; }

   /* static Context* Get() {
        return instance_;
    }*/
private:
    //static Context* instance_;
};



class JSBClass {
public:
    const char* name;
    Value prototype;
    //Module* module;
    Value ctor;
    const Context& context;
    //JSClassID id;
public:
    explicit JSBClass(const Context& context,JSClassID* id,  const char* name, JSCFunction* ctorFunc, JSClassFinalizer* finalizer, JSClassID extend = 0) :
        name(name)
        , ctor(context.ctx, JS_NewCFunction2(context.ctx, ctorFunc, name, 0, JS_CFUNC_constructor, 0))
        , prototype(context.newObject())
        , context(context)
    {
        JSClassDef def
        {
            name,
            finalizer
        };
        JS_NewClassID(id);
        //jsb_registerClassID(name, id);
        int e = JS_NewClass(JS_GetRuntime(context.ctx), *id, &def);
        if (extend) {
            JSValueConst proto = JS_GetClassProto(context.ctx, extend);
            JS_SetPrototype(context.ctx, prototype.v, proto);
            JS_FreeValue(context.ctx, proto);
        }
        JS_SetConstructor(context.ctx, ctor.v, prototype.v);
        JS_SetClassProto(context.ctx, *id,JS_DupValue(context.ctx, prototype.v));
    }

    ~JSBClass() {
        
    }

    JSBClass(const JSBClass&) = delete;

    void setMembers(const JSCFunctionListEntry* list, int listCount) {
        prototype.addProperty(list, listCount);
    }

    void setStaticMembers(const JSCFunctionListEntry* list, int listCount) {
        ctor.addProperty(list, listCount);
    }
};



} // namespace jsb