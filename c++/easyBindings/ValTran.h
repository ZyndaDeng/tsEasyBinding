#pragma once

#include <Duktape/duktape.h>


//在这里定义你的转换函数 如：
//Rect js_to_Rect(duk_context *ctx, int narg);
//void js_push_Rect(duk_context *ctx, const Rect &v);





template<typename T, typename F>
void js_to_normal_array(duk_context* ctx, int narg, T& ret, F getFunc) {
	ret.Clear();
	duk_enum(ctx, narg, DUK_ENUM_ARRAY_INDICES_ONLY);

	while (duk_next(ctx, -1 /*enum_index*/, 1 /*get_value*/))
	{
		/* [ ... enum key ] */
		auto value = getFunc(ctx, -1);
		ret.Push(value);
		duk_pop_2(ctx); /* pop_key & value*/
	}
	duk_pop(ctx); /* pop enum object */
}

template<typename T, typename F>
void js_push_normal_array(duk_context *ctx, const T &arr,F setFunc)
{
    duk_idx_t arr_idx = duk_push_array(ctx);
    int idx = 0;
    for (auto i = arr.Begin(); i != arr.End(); ++i)
    {
        setFunc(ctx, (*i));
        duk_put_prop_index(ctx, arr_idx, idx);
        idx++;
    }
}

