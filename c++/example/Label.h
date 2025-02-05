#pragma once

#include "Element.h"
#include <string>

class Label :public Element{
public:
    virtual ~Label(){}
     const char* getType() const { return "Label"; }
    const std::string& getText() const { return text; }
    void setText(const std::string& text) { this->text = text; }
private:
    std::string text;
};