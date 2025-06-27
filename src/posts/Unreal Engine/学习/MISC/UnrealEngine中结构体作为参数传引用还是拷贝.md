---
date: 2025-06-27
tag:
  - AI_GEN

---

# UnrealEngine中结构体作为参数传引用还是拷贝
```
:class SMyCustomWidget : public SCompoundWidget
{ 
    public: 
    void Construct(const FArguments& InArgs) 
    {
        // ...
    }
}
```
Q:这段代码中const FArguments& InArgs为什么要用引用，为什么不用拷贝？

***

A:(Grok)在代码中，const FArguments& InArgs 使用引用而不是拷贝，主要有以下几个原因：

1.  性能优化：\
    FArguments 是一个结构体，通常包含多个成员变量（如属性、回调等）。如果使用拷贝，会创建 FArguments 的完整副本，这会增加内存分配和复制的开销。使用 const 引用避免了拷贝，只传递原始对象的引用，性能更高，尤其是在 FArguments 可能包含大量数据时。
2.  避免不必要的修改：\
    使用 const 引用确保 InArgs 在 Construct 函数中不会被意外修改。FArguments 是 Slate 框架中用来传递 widget 初始化参数的结构体，设计上只需要读取数据，而不需要修改。const 引用清楚地表达了这种只读意图，同时保持高效。
3.  Slate 框架的设计约定：\
    Slate 框架中的 Construct 函数通常以 const FArguments& 作为参数，这是 Unreal Engine 的标准做法。这种设计统一了代码风格，并确保开发者在构造 widget 时不会意外修改传入的参数。
4.  避免潜在的拷贝构造问题：\
    如果 FArguments 包含不可拷贝的成员（例如某些智能指针或非拷贝构造的对象），直接拷贝可能导致编译错误或运行时问题。引用避免了这些问题，因为它不依赖于对象的拷贝构造函数。

总结：使用 const FArguments& 是为了高效传递参数、防止意外修改、遵循 Slate 框架的设计规范，同时避免潜在的拷贝构造问题。这是 C++ 中处理复杂结构体参数的常见做法。

Q:那Unreal engine中，FVector用引用还是拷贝？

***

在 Unreal Engine 中，FVector 是否使用引用（FVector& 或 const FVector&）还是拷贝（FVector）取决于具体的使用场景和设计需求。以下是详细分析：

1\. FVector 的特性

*   FVector 是一个轻量级结构体，包含三个 float 成员（X、Y、Z），占用 12 字节（在 32 位或 64 位系统中）。
*   它是一个值类型，设计上允许频繁拷贝，且拷贝成本较低（相比复杂结构体如 FArguments）。
*   FVector 的拷贝构造函数和赋值操作是高效的，没有额外的动态内存分配或复杂逻辑。

2\. 使用引用的场景

FVector 使用引用（FVector& 或 const FVector&）的原因和场景包括：

*   性能优化（微优化）：虽然 FVector 拷贝成本低，但在高性能场景（如大规模循环、实时物理计算或渲染），传递引用可以进一步减少内存复制开销。例如，在函数参数中：


    cpp

        void UpdatePosition(const FVector& NewPosition);

    使用 const FVector& 避免拷贝，适合只读场景。
*   修改原始对象：如果函数需要修改传入的 FVector，必须使用非 const 引用：

    cpp

        void ModifyVector(FVector& Vector);
*   Slate 或其他复杂系统中的一致性：在 Unreal 的 Slate 框架或其他需要统一接口的地方，可能会使用 const FVector& 以保持与框架中其他参数传递方式一致（如 FArguments）。
*   避免不必要拷贝的习惯：在 C++ 中，传递复杂对象的 const 引用是惯例，即使 FVector 拷贝开销小，开发者可能为了代码一致性而选择引用。

3\. 使用拷贝的场景

FVector 直接拷贝（FVector）的原因和场景包括：

*   简单性和安全性：拷贝创建独立副本，避免意外修改原始对象。尤其在多线程代码或需要确保数据隔离时，拷贝更安全：

    cpp

        FVector GetOffset() const { return FVector(1.0f, 2.0f, 3.0f); }
*   低拷贝成本：FVector 仅 12 字节，拷贝开销远小于复杂结构体（如 FArguments 或 TArray）。在大多数情况下，拷贝的性能影响可以忽略不计。
*   值语义：FVector 设计为值类型，拷贝符合其语义，直观且易于理解。例如：

    cpp

        FVector NewPosition = OldPosition + FVector(10.0f, 0.0f, 0.0f);

    这种场景下，拷贝是自然且高效的。
*   返回值的常见做法：函数返回 FVector 时通常直接返回拷贝，因为 C++ 的返回优化（RVO/NRVO）会消除拷贝开销：

    cpp

        FVector GetLocation() const { return Location; }

4\. Unreal Engine 中的实际用法

*   Unreal 源码中的模式：

    *   在 Unreal Engine 的源码中，FVector 既可能以拷贝传递，也可能以引用传递，具体取决于函数的语义。例如：

        *   只读参数：常用 const FVector&（如 SetActorLocation(const FVector& NewLocation)）。
        *   修改参数：使用 FVector&（如 FVector::Normalize()）。
        *   返回值或简单传递：直接用 FVector（如 FVector::CrossProduct(const FVector A, const FVector B)）。
    *   在高性能代码（如物理引擎或渲染管线），Unreal 倾向于用 const FVector& 来避免拷贝。
    *   在 Blueprint 暴露的函数中，FVector 通常以拷贝传递，因为蓝图调用频率较低，且拷贝更符合蓝图的简单语义。
*   性能权衡：

    *   在现代 CPU 上，拷贝 FVector 的开销通常很小（几个 CPU 周期）。但在性能敏感场景（如每帧调用数千次），引用可能更优。
    *   如果函数调用频率低（如初始化或事件处理），拷贝和引用的性能差异几乎可以忽略。

5\. 选择引用还是拷贝的建议

*   用引用（const FVector& 或 FVector&）：

    *   函数需要修改传入的 FVector。
    *   在性能敏感的代码中（例如，循环中处理大量 FVector）。
    *   需要与 Unreal 框架的其他接口保持一致（如 Slate 或某些 API）。
    *   传递给只读函数，且希望明确表达不修改意图。
*   用拷贝（FVector）：

    *   函数逻辑需要独立副本以避免修改原始数据。
    *   代码简单性优先，且性能不是瓶颈（例如，蓝图相关或低频调用）。
    *   返回值或临时计算场景（得益于 RVO 优化）。
    *   遵循值语义，直观且符合 FVector 的设计。

6\. 与 FArguments 的对比

*   与 FArguments 不同，FVector 的拷贝成本低，结构简单，没有复杂的成员（如指针或动态分配）。因此，FVector 使用拷贝的场景比 FArguments 更常见。
*   FArguments 通常包含大量数据或复杂对象，拷贝成本高，因此 Slate 框架中强制使用 const FArguments&。

7\. 总结

在 Unreal Engine 中，FVector 既可以用引用也可以用拷贝：

*   引用（const FVector& 或 FVector&）：适合性能敏感场景、需要修改对象或与框架接口保持一致。
*   拷贝（FVector）：适合简单场景、值语义明确、性能影响可忽略时。
*   推荐：在大多数情况下，拷贝 FVector 是可以接受的，因为其开销小且代码更直观。但在高性能代码或需要修改时，优先考虑引用。参考 Unreal 源码和上下文选择最合适的传递方式。

如果你有具体代码或场景需要进一步分析，可以提供更多细节，我可以帮你判断！

Q\:ENGINE\_API bool SetActorLocation(const FVector& NewLocation, bool bSweep=false, FHitResult\* OutSweepHitResult=nullptr, ETeleportType Teleport = ETeleportType::None);\
ENGINE\_API bool SetActorRotation(FRotator NewRotation, ETeleportType Teleport = ETeleportType::None);\
不统一。

***

A:(ChatGPT)好！你这个发现非常棒，说明你对 Unreal Engine 的 API 设计风格开始捕捉到细节差异了。我们来**认真拆透**这个现象：

***

## 📌 为什么 `SetActorRotation(FRotator NewRotation)` 是按值传递？

### 🎯 关键点：

**FRotator 本质上是个小对象（3 个 float，12 字节）**，和 FVector 大小完全一样，但它却按值传递。那为什么不统一成引用？

> 答案是：**这里不涉及复杂 ABI 风险，而且该函数的调用频率较低，参数固定，不涉及返回值结构，也没有 FHitResult 这种指针参数的 ABI 连锁依赖**。

***

### 📖 Unreal 官方 API 设计的潜规则：

在 Unreal 引擎里，**如果一个跨模块函数：**

*   参数是简单小对象（POD：Plain Old Data）
*   **没有 FHitResult 指针或 TArray/FString 这些堆内存结构**
*   不涉及返回引用或引用链传递
*   没有 delegate/bindable callback

**就可以按值传递。**

***

## 📊 两者对比看看：

### `SetActorLocation`

```
bool SetActorLocation(const FVector& NewLocation, bool bSweep = false, FHitResult* OutSweepHitResult = nullptr, ETeleportType Teleport = ETeleportType::None);

```

✔️ 涉及：

*   `FVector` 位置
*   `FHitResult*` 指针（堆内存结构）
*   多个参数，且与物理/碰撞子系统交互复杂，调用路径长 → ABI 风险大\
    → 必须用 `const FVector&`

***

### `SetActorRotation`

```
bool SetActorRotation(FRotator NewRotation, ETeleportType Teleport = ETeleportType::None);

```

✔️ 涉及：

*   `FRotator` 12B 小对象，拷贝成本极低
*   没有 FHitResult，物理交互单一，内部调用链简单
*   Unreal 编译器强制 inline 多（`FORCEINLINE` 很多），热重载/ABI风险相对较小
*   **主要是 Blueprint 或 C++ 用户简单调用**

→ 所以直接按值传递，性能反而更好。

***

## 📌 实际 Unreal 源码里很多类似情况：

比如 `FQuat`、`FLinearColor`、`FVector4`、`FName` 也大多按值传递，**只要不涉及 FHitResult/TArray/FString 指针链/Delegate 就没 ABI 风险**。

***

## ✅ 最终结论：

| 函数                 | 传参方式             | 原因                                 |
| :----------------- | :--------------- | :--------------------------------- |
| `SetActorLocation` | `const FVector&` | 有 FHitResult 指针链，物理子系统交互复杂，ABI 风险高 |
| `SetActorRotation` | `FRotator` 值传    | 小对象，无指针链，调用链简单，按值快且安全              |

***

### 📌 其实 Unreal API 不是“所有小对象都引用” 或 “所有小对象都值传”，而是**结合 ABI 风险、调用链复杂度、热重载稳定性**综合判断的。

***

如果你想，我可以帮你总结一份【Unreal Engine API 传参规范实践手册（精简版）】，把这些易混地方一次理清。要不要？🔥
