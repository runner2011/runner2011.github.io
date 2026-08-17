---
tag:
  - AI_GEN
date: 2026-08-17
---

# 熵与Temperature

要理解为什么熵是

$$
H(p)=-\sum_i p_i\log p_i
$$

最好的办法不是先背公式，而是先问：

> **我们到底希望“信息量”满足什么性质？**

假设一个事件发生的概率是 $p$。概率越小，事件越“意外”，它发生时给你的信息就应该越多。

例如：

* “太阳明天升起”，概率几乎 1，没什么信息。
* “我连续抛 20 次硬币全是正面”，概率极小，信息量很大。

所以我们想定义一个函数：

$$
I(p)
$$

表示“概率为 $p$ 的事件发生时带来的信息量”。

我们希望它至少满足三个性质。

第一，概率越小，信息越大：

$$
p\downarrow \Rightarrow I(p)\uparrow
$$

第二，如果某件事一定发生：

$$
p=1
$$

那就没有新信息：

$$
I(1)=0
$$

第三，也是最关键的：如果两个独立事件一起发生，信息量应该相加。

假设事件 A 概率为 $p$，事件 B 概率为 $q$，而且二者独立，那么：

$$
P(A\cap B)=pq
$$

我们希望：

$$
I(pq)=I(p)+I(q)
$$

什么函数满足“乘法变加法”？

就是对数：

$$
\log(pq)=\log p+\log q
$$

但由于 $0<p\le1$，所以：

$$
\log p\le0
$$

而信息量应该是正的，于是定义：

$$
\boxed{I(p)=-\log p}
$$

这就是所谓的 **self-information（自信息）**。

例如：

$$
p=\frac12
$$

如果用 $\log_2$：

$$
I(p)
=

-\log_2\frac12
=1
$$

也就是 1 bit。

如果：

$$
p=\frac18
$$

那么：

$$
I(p)
=

-\log_2\frac18
=3
$$

也就是 3 bit。

所以：

$$
\boxed{\text{越罕见的事件，发生时提供的信息越多}}
$$

---

接下来，熵就很自然了。

一个随机变量不是只有一个事件，而是有很多可能结果：

$$
x_1,x_2,\dots,x_n
$$

概率分别为：

$$
p_1,p_2,\dots,p_n
$$

如果最终发生的是 $x_i$，你获得的信息量是：

$$
-\log p_i
$$

但在事情发生之前，我们不知道到底哪个结果会出现。

所以我们问：

> **平均而言，一次观察能给我多少信息？**

那当然就是对信息量取期望：

$$
H
=

\sum_i p_i I(p_i)
$$

代入：

$$
I(p_i)=-\log p_i
$$

得到：

$$
\boxed{
H(p)
=

-\sum_i p_i\log p_i
}
$$

所以熵本质上就是：

$$
\boxed{\text{平均惊讶程度}}
$$

或者：

$$
\boxed{\text{平均信息量}}
$$

---

举个非常简单的例子。

假设硬币是公平的：

$$
P(H)=P(T)=\frac12
$$

每个结果的信息量：

$$
-\log_2\frac12=1\text{ bit}
$$

所以熵：

$$
H
=

\frac12\times1
+
\frac12\times1
=1
$$

即：

$$
\boxed{H=1\text{ bit}}
$$

这符合直觉：抛一次公平硬币，要知道结果，需要 1 bit。

现在假设这个硬币非常偏：

$$
P(H)=0.99,\qquad P(T)=0.01
$$

熵：

$$
H
=

-0.99\log_2(0.99)
-0.01\log_2(0.01)
$$

大约：

$$
H\approx0.081
$$

bit。

为什么这么低？

因为你几乎知道结果一定是正面。

所以：

$$
\boxed{\text{不确定性很低}}
$$

---

这也解释了一个很重要的性质：

如果一个分布完全确定：

$$
p=(1,0,0,\dots)
$$

那么：

$$
H=0
$$

因为你已经知道结果是什么。

而如果 $n$ 个结果完全均匀：

$$
p_i=\frac1n
$$

那么：

$$
H=-\sum_i\frac1n\log\frac1n
$$

因为一共有 $n$ 项：

$$
H=-\log\frac1n\log n
$$

所以：

$$
\boxed{
H_{\max}=\log n
}
$$

也就是说：

> 在结果数量固定的情况下，均匀分布的不确定性最大。

这件事马上就和你刚刚问的 temperature 连起来了。

Temperature 越高：

$$
p_i
$$

越趋向均匀，于是：

$$
H(p)\uparrow
$$

Temperature 越低：

$$
p_i
$$

越集中到少数几个 token 上，于是：

$$
H(p)\downarrow
$$

极端情况：

$$
T\to0
$$

softmax 接近 one-hot：

$$
p=(1,0,0,\dots)
$$

于是：

$$
H\to0
$$

而：

$$
T\to\infty
$$

softmax 接近均匀分布：

$$
p_i=\frac1N
$$

于是：

$$
H\to\log N
$$

所以 temperature 可以理解成：

$$
\boxed{\text{控制概率分布熵的旋钮}}
$$

---

现在再来看统计物理，就会突然清楚很多。

假设一个物理系统有很多微观状态：

$$
i=1,2,\dots
$$

每个状态出现概率是：

$$
p_i
$$

Gibbs entropy：

$$
S=-k_B\sum_i p_i\ln p_i
$$

你会发现它和信息论熵：

$$
H=-\sum_i p_i\ln p_i
$$

完全一样，只差：

$$
k_B
$$

所以：

$$
\boxed{S=k_BH}
$$

物理上它表示：

> **我们对系统具体处在哪个微观状态有多大的不确定性。**

如果系统只有一个可能状态：

$$
p_1=1
$$

那么：

$$
S=0
$$

如果有很多状态而且差不多等可能：

$$
p_i\approx\frac1N
$$

那么：

$$
S\approx k_B\ln N
$$

这就是著名的 Boltzmann 公式：

$$
\boxed{S=k_B\ln\Omega}
$$

其中：

$$
\Omega
$$

表示可能的微观状态数。

---

这和 LLM 的联系也非常直接。

假设模型预测下一个 token：

$$
p(\text{cat})=0.9
$$

$$
p(\text{dog})=0.05
$$

$$
p(\text{car})=0.05
$$

那么 entropy 很低：

$$
H(p)\text{ 较小}
$$

模型非常确定。

如果模型预测：

$$
p(\text{cat})
=============

# p(\text{dog})

# p(\text{car})

\frac13
$$

那么 entropy 更大：

$$
H(p)=\log 3
$$

模型很不确定。

所以在机器学习里：

$$
\boxed{\text{entropy = 模型预测分布的不确定程度}}
$$

---

再往前一步，就会自然出现你在深度学习里经常看到的 **cross entropy**。

如果真实答案是：

$$
y
$$

模型给真实答案的概率是：

$$
p(y)
$$

那么损失：

$$
L=-\log p(y)
$$

注意，这正是刚才的信息量：

$$
\boxed{I(y)=-\log p(y)}
$$

如果模型认为正确答案概率很高：

$$
p(y)=0.99
$$

那么：

$$
-\log0.99\approx0
$$

损失很小。

如果模型认为正确答案概率很低：

$$
p(y)=0.001
$$

那么：

$$
-\log0.001
$$

很大。

所以神经网络里最常见的 cross-entropy loss，从信息论角度就是：

> **正确答案发生之后，模型有多“惊讶”。**

一个好模型应该对真实数据：

$$
\text{不惊讶}
$$

也就是让：

$$
-\log p(y)
$$

尽可能小。

---

所以你可以把整条逻辑记成：

$$
\boxed{
\text{事件概率 }p
}
$$

$$
\downarrow
$$

$$
\boxed{
\text{单次信息量 }
I(p)=-\log p
}
$$

$$
\downarrow
$$

对所有可能事件取平均：

$$
\boxed{
H(p)
====

-\sum_i p_i\log p_i
}
$$

这就是 entropy。

然后：

$$
\text{entropy}
\longrightarrow
\text{cross entropy}
\longrightarrow
\text{LLM loss}
$$

另一边：

$$
\text{entropy}
\longrightarrow
\text{maximum entropy}
\longrightarrow
\text{Boltzmann distribution}
\longrightarrow
\text{softmax}
$$

所以你现在其实已经站在了一个很关键的交叉点上：

$$
\boxed{
\text{信息论}
\leftrightarrow
\text{统计物理}
\leftrightarrow
\text{机器学习}
}
$$

它们之所以老是出现同一个

$$
-\sum p\log p
$$

并不是巧合，而是因为它们都在研究同一个根本问题：

$$
\boxed{\text{面对很多可能状态，我们有多不确定？}}
$$

下一步最值得理解的是 **为什么最大熵 + 平均能量约束会推导出 Boltzmann distribution / softmax**。这一步一旦懂了，你之前关于 temperature 的问题就会彻底闭环。
