

#pragma once

#include "Element.h"

class Input :public Element{
public:
    virtual ~Input(){}
     const char* getType() const { return "Input"; }
};