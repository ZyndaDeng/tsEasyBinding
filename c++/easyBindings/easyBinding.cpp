#include "easyBinding.h"

namespace jsb
{
    //Context* Context::instance_ = nullptr;

     JSBModule::JSBModule(JSContext* ctx, const char* name) :
        ctx(ctx)
        , name(name)
        , exports(JS_GetRuntime(ctx))
    {
        m = JS_NewCModule(ctx, name, [](JSContext* ctx, JSModuleDef* m) noexcept {
            
                auto context = (Context*)JS_GetContextOpaque(ctx);
                if (!context)return -1;
            auto it = std::find_if(context->modules.begin(), context->modules.end(),
                [m](const JSBModule& module) { return module.m == m; });
            if (it == context->modules.end())
                return -1;

            for (const auto& e : it->exports)
            {
                if (JS_SetModuleExport(ctx, m, e.first, JS_DupValue(ctx, e.second.v)) != 0)
                    return -1;
            }
            return 0;
            });
        assert(m);
        /*if (!m)
            throw exception{};*/
    }
}