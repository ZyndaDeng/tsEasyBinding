
#pragma once
#include <string>
#include "Object.h"
class Element :public Object{
    public:
    Element(const std::string& name):name(name) {}
    const std::string& getName() const { return name; }
    void setName(const std::string& name) { this->name = name; }
    int getX() const { return x; }
    int getY() const { return y; }
    void setX(int x) { this->x = x; }
    void setY(int y) { this->y = y; }
    virtual const char* getType() const { return "Element"; }
    virtual ~Element() {}
    private:
    std::string name;
    int x;
    int y;
};