#pragma once

#include "./quickjs/quickjs.h"
#include <string>



std::string system_load_file(JSContext* ctx, const char* filename);
void system_print(const char* info);
void system_logError(const char* info);
void system_logErrorf(const char* info);