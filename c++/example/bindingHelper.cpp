#include "bindingHelper.h"


JSValue js_push_native_object(JSContext* ctx, Base::Object* obj) {
	if (!obj)return JS_UNDEFINED;
	auto classId = obj->getType()->getScriptClassId();
	if (classId == 0)classId = js_Object_id;
	JSValue v = JS_NewObjectClass(ctx, classId);
	Add_Object(v, obj);// JS_SetOpaque(v, obj);
	return v;
}

void native_finalizer(JSRuntime* rt, JSValue val)
{
	Remove_Object(val);
}
