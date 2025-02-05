#include "bindingImport.h"

static JSValue js_Element_constructor(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	Element* native=nullptr;
	if(JS_IsString(argv[0])
	){
		if(argc==1){
			const char* n0= js_to_cstring(ctx,argv[0]);
			 native=new Element(n0);
		}else{
			JS_ThrowTypeError(ctx, "js_Element_constructor invalid argument value: 1");
		}
	}


	if(native){
		JSValue ret = JS_NewObjectClass(ctx, js_Element_id);
		Add_Object(ret,native);
		return ret;
	}
	return JS_UNDEFINED;
}


static JSValue js_Element_getType(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=0){
		if(argc==0){
			Element* native=js_to_native_object<Element>(ctx,this_val);
			auto ret=native->getType();
			return js_push_native_object(ctx,ret,undefined);

		}else{
			JS_ThrowTypeError(ctx, "js_Element_getType invalid argument value: 0");
		}
	}
	JS_ThrowTypeError(ctx, "js_Element_getType arguments value not match");
	 return JS_UNDEFINED;
}


static JSValue js_Element_get_name(JSContext* ctx, JSValueConst this_val)
{
	Element *native = js_to_native_object<Element>(ctx, this_val);
	auto ret=native->getName();
	return JS_NewString(ctx,ret);
}

static JSValue js_Element_set_name(JSContext* ctx, JSValueConst this_val, JSValueConst val)
{
	const char* n0= js_to_cstring(ctx,val);
	Element *native = js_to_native_object<Element>(ctx, this_val);
	native->setName(n0);
	return JS_UNDEFINED;
}

static JSValue js_Element_get_x(JSContext* ctx, JSValueConst this_val)
{
	Element *native = js_to_native_object<Element>(ctx, this_val);
	auto ret=native->getX();
	return JS_NewInt32(ctx,ret);
}

static JSValue js_Element_set_x(JSContext* ctx, JSValueConst this_val, JSValueConst val)
{
	int n0= JS_VALUE_GET_INT(val);
	Element *native = js_to_native_object<Element>(ctx, this_val);
	native->setX(n0);
	return JS_UNDEFINED;
}

static JSValue js_Element_get_y(JSContext* ctx, JSValueConst this_val)
{
	Element *native = js_to_native_object<Element>(ctx, this_val);
	auto ret=native->getY();
	return JS_NewInt32(ctx,ret);
}

static JSValue js_Element_set_y(JSContext* ctx, JSValueConst this_val, JSValueConst val)
{
	int n0= JS_VALUE_GET_INT(val);
	Element *native = js_to_native_object<Element>(ctx, this_val);
	native->setY(n0);
	return JS_UNDEFINED;
}


static void js_Element_finalizer(JSRuntime* rt, JSValue val)
{
	Element* native=(Element*) JS_GetOpaque(val, js_Element_id);delete native;
}


static jsb::Value jsapi_init_Element( jsb::Context& ctx)
{
	static const JSCFunctionListEntry functions[] = 
	{
		JSB_CFUNC_DEF("getType", 0,js_Element_getType),
		JSB_CGETSET_DEF("name",js_Element_get_name,js_Element_set_name),
		JSB_CGETSET_DEF("x",js_Element_get_x,js_Element_set_x),
		JSB_CGETSET_DEF("y",js_Element_get_y,js_Element_set_y),
	};
	jsb::JSBClass c(ctx,(JSClassID*)&(js_Element_id),"Element",js_Element_constructor,native_finalizer,0);
	c.setMembers(functions, countof(functions));
	return c.ctor;
}


static JSValue js_Button_constructor(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	Button* native=nullptr;
	JS_ThrowTypeError(ctx, "js_Button_constructor obj can not new");


	if(native){
		JSValue ret = JS_NewObjectClass(ctx, js_Button_id);
		Add_Object(ret,native);
		return ret;
	}
	return JS_UNDEFINED;
}


static JSValue js_Button_getType(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=0){
		if(argc==0){
			Button* native=js_to_native_object<Button>(ctx,this_val);
			auto ret=native->getType();
			return js_push_native_object(ctx,ret,undefined);

		}else{
			JS_ThrowTypeError(ctx, "js_Button_getType invalid argument value: 0");
		}
	}
	JS_ThrowTypeError(ctx, "js_Button_getType arguments value not match");
	 return JS_UNDEFINED;
}


static JSValue js_Button_click(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=0){
		if(argc==0){
			Button* native=js_to_native_object<Button>(ctx,this_val);
			native->click();
			return JS_UNDEFINED;

		}else{
			JS_ThrowTypeError(ctx, "js_Button_click invalid argument value: 0");
		}
	}
	JS_ThrowTypeError(ctx, "js_Button_click arguments value not match");
	 return JS_UNDEFINED;
}


static JSValue js_Button_setOnClick(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=1&&js_is_native(ctx,argv[0],ButtonClick::GetType()->scriptClassId)
	){
		if(argc==1){
			ButtonClick* n0=js_to_native_object<ButtonClick>(ctx,argv[0]);
			Button* native=js_to_native_object<Button>(ctx,this_val);
			native->setOnClick(n0);
			return JS_UNDEFINED;

		}else{
			JS_ThrowTypeError(ctx, "js_Button_setOnClick invalid argument value: 1");
		}
	}
	JS_ThrowTypeError(ctx, "js_Button_setOnClick arguments value not match");
	 return JS_UNDEFINED;
}



static void js_Button_finalizer(JSRuntime* rt, JSValue val)
{
	Button* native=(Button*) JS_GetOpaque(val, js_Button_id);delete native;
}


static jsb::Value jsapi_init_Button( jsb::Context& ctx)
{
	static const JSCFunctionListEntry functions[] = 
	{
		JSB_CFUNC_DEF("getType", 0,js_Button_getType),
		JSB_CFUNC_DEF("click", 0,js_Button_click),
		JSB_CFUNC_DEF("setOnClick", 0,js_Button_setOnClick),
	};
	jsb::JSBClass c(ctx,(JSClassID*)&(js_Button_id),"Button",js_Button_constructor,native_finalizer,Element::GetType()->scriptClassId);
	c.setMembers(functions, countof(functions));
	return c.ctor;
}


static JSValue js_Input_constructor(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	Input* native=nullptr;
	JS_ThrowTypeError(ctx, "js_Input_constructor obj can not new");


	if(native){
		JSValue ret = JS_NewObjectClass(ctx, js_Input_id);
		Add_Object(ret,native);
		return ret;
	}
	return JS_UNDEFINED;
}


static JSValue js_Input_getType(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=0){
		if(argc==0){
			Input* native=js_to_native_object<Input>(ctx,this_val);
			auto ret=native->getType();
			return js_push_native_object(ctx,ret,undefined);

		}else{
			JS_ThrowTypeError(ctx, "js_Input_getType invalid argument value: 0");
		}
	}
	JS_ThrowTypeError(ctx, "js_Input_getType arguments value not match");
	 return JS_UNDEFINED;
}



static void js_Input_finalizer(JSRuntime* rt, JSValue val)
{
	Input* native=(Input*) JS_GetOpaque(val, js_Input_id);delete native;
}


static jsb::Value jsapi_init_Input( jsb::Context& ctx)
{
	static const JSCFunctionListEntry functions[] = 
	{
		JSB_CFUNC_DEF("getType", 0,js_Input_getType),
	};
	jsb::JSBClass c(ctx,(JSClassID*)&(js_Input_id),"Input",js_Input_constructor,native_finalizer,Element::GetType()->scriptClassId);
	c.setMembers(functions, countof(functions));
	return c.ctor;
}


static JSValue js_Label_constructor(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	Label* native=nullptr;
	JS_ThrowTypeError(ctx, "js_Label_constructor obj can not new");


	if(native){
		JSValue ret = JS_NewObjectClass(ctx, js_Label_id);
		Add_Object(ret,native);
		return ret;
	}
	return JS_UNDEFINED;
}


static JSValue js_Label_getType(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=0){
		if(argc==0){
			Label* native=js_to_native_object<Label>(ctx,this_val);
			auto ret=native->getType();
			return js_push_native_object(ctx,ret,undefined);

		}else{
			JS_ThrowTypeError(ctx, "js_Label_getType invalid argument value: 0");
		}
	}
	JS_ThrowTypeError(ctx, "js_Label_getType arguments value not match");
	 return JS_UNDEFINED;
}


static JSValue js_Label_get_text(JSContext* ctx, JSValueConst this_val)
{
	Label *native = js_to_native_object<Label>(ctx, this_val);
	auto ret=native->getText();
	return JS_NewString(ctx,ret);
}

static JSValue js_Label_set_text(JSContext* ctx, JSValueConst this_val, JSValueConst val)
{
	const char* n0= js_to_cstring(ctx,val);
	Label *native = js_to_native_object<Label>(ctx, this_val);
	native->setText(n0);
	return JS_UNDEFINED;
}


static void js_Label_finalizer(JSRuntime* rt, JSValue val)
{
	Label* native=(Label*) JS_GetOpaque(val, js_Label_id);delete native;
}


static jsb::Value jsapi_init_Label( jsb::Context& ctx)
{
	static const JSCFunctionListEntry functions[] = 
	{
		JSB_CFUNC_DEF("getType", 0,js_Label_getType),
		JSB_CGETSET_DEF("text",js_Label_get_text,js_Label_set_text),
	};
	jsb::JSBClass c(ctx,(JSClassID*)&(js_Label_id),"Label",js_Label_constructor,native_finalizer,Element::GetType()->scriptClassId);
	c.setMembers(functions, countof(functions));
	return c.ctor;
}


static JSValue js_View_constructor(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	View* native=nullptr;
	JS_ThrowTypeError(ctx, "js_View_constructor obj can not new");


	if(native){
		JSValue ret = JS_NewObjectClass(ctx, js_View_id);
		Add_Object(ret,native);
		return ret;
	}
	return JS_UNDEFINED;
}


static JSValue js_View_addElement(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=1&&js_is_native(ctx,argv[0],js_Element_id)
	){
		if(argc==1){
			Element* n0=js_to_native_object<Element>(ctx,argv[0]);
			View* native=js_to_native_object<View>(ctx,this_val);
			native->addElement(n0);
			return JS_UNDEFINED;

		}else{
			JS_ThrowTypeError(ctx, "js_View_addElement invalid argument value: 1");
		}
	}
	JS_ThrowTypeError(ctx, "js_View_addElement arguments value not match");
	 return JS_UNDEFINED;
}


static JSValue js_View_getElementByName(JSContext* ctx, JSValueConst this_val,int argc, JSValueConst* argv)
{
	if(argc>=1&&JS_IsString(argv[0])
	){
		if(argc==1){
			const char* n0= js_to_cstring(ctx,argv[0]);
			View* native=js_to_native_object<View>(ctx,this_val);
			auto ret=native->getElementByName(n0);
			return js_push_native_object(ctx,ret,undefined);

		}else{
			JS_ThrowTypeError(ctx, "js_View_getElementByName invalid argument value: 1");
		}
	}
	JS_ThrowTypeError(ctx, "js_View_getElementByName arguments value not match");
	 return JS_UNDEFINED;
}



static void js_View_finalizer(JSRuntime* rt, JSValue val)
{
	View* native=(View*) JS_GetOpaque(val, js_View_id);delete native;
}


static jsb::Value jsapi_init_View( jsb::Context& ctx)
{
	static const JSCFunctionListEntry functions[] = 
	{
		JSB_CFUNC_DEF("addElement", 0,js_View_addElement),
		JSB_CFUNC_DEF("getElementByName", 0,js_View_getElementByName),
	};
	jsb::JSBClass c(ctx,(JSClassID*)&(js_View_id),"View",js_View_constructor,native_finalizer,0);
	c.setMembers(functions, countof(functions));
	return c.ctor;
}


 void js_exampleApi_package_api( jsb::Context& ctx){
	jsb::JSBModule& m=ctx.getOrNewModule("example");
	m.add("Element",jsapi_init_Element(ctx));
	m.add("Button",jsapi_init_Button(ctx));
	m.add("Input",jsapi_init_Input(ctx));
	m.add("Label",jsapi_init_Label(ctx));
	m.add("View",jsapi_init_View(ctx));

}
