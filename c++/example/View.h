#pragma once

#include "Element.h"
#include <vector>
#include <memory>
class View :public Object{
public:
    void addElement(Element* element){
        auto sharedElement = std::shared_ptr<Element>(element);
        elements.push_back(sharedElement);
    }
    Element* getElementByName(const char* name){
        for(auto& element : elements){
            if(strcmp(element->getName().c_str(), name) == 0){
                return element.get();
            }
        }
        return nullptr;
    }
    private:
    std::vector<std::shared_ptr<Element>> elements;
};