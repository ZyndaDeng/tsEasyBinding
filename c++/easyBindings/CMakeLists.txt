
# 指定项目名称
project(easyBinding)

#要编译的文件
aux_source_directory(. SRC_FILES)
aux_source_directory(quickjs QJS_SRC)

add_library(${PROJECT_NAME} STATIC ${SRC_FILES} ${QJS_SRC}  "quickjs/vs/msvc-defs.c")

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET ${PROJECT_NAME} PROPERTY CXX_STANDARD 20)
endif()