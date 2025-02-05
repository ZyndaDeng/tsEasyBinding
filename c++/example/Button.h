#pragma once
#include "Element.h"
#include <functional>


class Button :public Element{

public:
Button():
onClick(nullptr){}
    virtual ~Button(){}
     const char* getType() const { return "Button"; }
     void click(){
        if(onClick)onClick(this);
     }
     void setOnClick(std::function<void(Button*)> onClick){
        this->onClick = onClick;
     }
protected:
     std::function<void(Button*)> onClick;
};