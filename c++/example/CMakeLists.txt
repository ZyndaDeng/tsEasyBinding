
# 指定项目名称
project(example)

#要编译的文件
aux_source_directory(. SRC_FILES)

add_library(${PROJECT_NAME} STATIC ${SRC_FILES} )

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET ${PROJECT_NAME} PROPERTY CXX_STANDARD 20)
endif()