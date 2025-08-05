---
date: 2025-08-06
tag:
  - AI_GEN

---

# 关于CMake的一些问题

## target_include_directories(MyApp PRIVATE ${CMAKE_SOURCE_DIR}/src/header)中PRIVATE什么意思

目标对头文件的可见性。PRIVATE只给当前目标用，PUBLIC也给其他引用当前的目标或库用。

| 关键词         | 含义                                     |
| ----------- | -------------------------------------- |
| `PRIVATE`   | 仅当前目标需要这些 include 路径或库，**不会传播给依赖它的目标** |
| `PUBLIC`    | 当前目标需要，同时**依赖它的其他目标也需要**               |
| `INTERFACE` | 当前目标**自己不需要**，但是它的使用者（依赖者）**需要**       |

## CMAKE_SOURCE_DIR是内置变量吗？
是的，类似其他内置变量还有：
| 变量名                        | 含义                                          |
| -------------------------- | ------------------------------------------- |
| `CMAKE_SOURCE_DIR`         | 顶层 CMake 项目的根目录（通常是你放 `CMakeLists.txt` 的地方） |
| `CMAKE_CURRENT_SOURCE_DIR` | 当前处理的 `CMakeLists.txt` 所在目录                 |
| `CMAKE_BINARY_DIR`         | 构建目录（即 `cmake ..` 时的 build 目录）              |
| `CMAKE_CURRENT_BINARY_DIR` | 当前处理目录对应的 build 目录                          |

## CMake想用通配符或者 for 循环添加多个cpp文件
### 手动列出 + `foreach(...)`（可选组合）

你也可以手动列文件名 + foreach 循环构建变量，比如文件非常分散时：

```cmake
set(SRC_NAMES main math utils io)
set(SRC_DIR src)
set(SRC_FILES "")

foreach(name IN LISTS SRC_NAMES)
    list(APPEND SRC_FILES "${SRC_DIR}/${name}.cpp")
endforeach()

add_executable(MyApp ${SRC_FILES})
```
---

### 多目录项目用 GLOB\_RECURSE（递归搜索）通配符匹配

```cmake
file(GLOB_RECURSE SRC_FILES CONFIGURE_DEPENDS
    "${CMAKE_SOURCE_DIR}/src/*.cpp"
)

add_executable(MyApp ${SRC_FILES})
```

加上 `CONFIGURE_DEPENDS` 可以在你新加文件后自动触发重新配置。这个是一个可选项，可以不加。

## file 的参数和add_executable， target_include_directories不统一呢，file路径是字符串，后者是变量
### 🧠 简洁回答：

| 命令                                | 参数是字符串             | 参数是变量 |
| --------------------------------- | ------------------ | ----- |
| `file(GLOB ...)`                  | ✅ 是路径字符串（带通配符）     |       |
| `add_executable(...)`             | ✅ 是变量（或具体的文件列表）    |       |
| `target_include_directories(...)` | ✅ 是路径变量或字符串（不带通配符） |       |

---

### 🔍 深度解析：

#### 1️⃣ `file(GLOB VAR "src/*.cpp")`

* `file()` 是 **一个操作命令**，会：

  * **执行通配符匹配**
  * 把结果列表赋值到变量 `VAR` 中
* 参数 `"src/*.cpp"` 是一个 **字符串字面量**，你写的是匹配规则
* 它的结果必须是变量（如 `${VAR}`）才能传给 `add_executable` 等命令

```cmake
file(GLOB SRC_FILES "src/*.cpp")  # 匹配通配符，结果写入变量
add_executable(MyApp ${SRC_FILES})  # 使用变量
```

---

#### 2️⃣ `add_executable(MyApp main.cpp foo.cpp)` / `add_executable(MyApp ${SRC_FILES})`

* `add_executable` 只接受 **文件列表**
* 这个文件列表可以是：

  * 一个个文件名字符串
  * 或一个变量（变量中存了多个文件名）

✅ 不支持通配符，也不会帮你匹配路径。

---

#### 3️⃣ `target_include_directories(MyApp PRIVATE include/)`

* 可以写字符串，也可以写变量，但本质是「一组目录路径」，**不支持通配符**
* 这些目录只是让编译器加到 `-I` 参数中
* 一般这样写没问题：

```cmake
target_include_directories(MyApp PRIVATE include/ ${EXTRA_INCLUDE_DIRS})
```

---

### 🎯 小总结（通俗类比）：

| CMake命令                        | 你写的是...               | 背后含义                  |
| ------------------------------ | --------------------- | --------------------- |
| `file(GLOB VAR "src/*.cpp")`   | 💬 描述一个“查询规则”         | CMake 帮你“执行查询”，结果放进变量 |
| `add_executable(MyApp ${VAR})` | 📦 塞入“一个已有列表变量”       | 只是读取变量的内容，不支持通配符      |
| `target_include_directories()` | 🧭 列出“路径清单”（变量或字符串均可） | 把这些路径加到 `-I` 编译参数     |

