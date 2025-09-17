---
date: 2025-09-17
tag:
  - AI

---

# ML常用数学符号介绍

### 常见数学符号及其在 AI/ML 中的用法

在人工智能和机器学习的文献或公式中，经常会用到一些标准的数学符号。下面我按照类别给你整理：

---

#### 代数与集合论

* **ℝ**：实数集合（Real numbers），常用于定义参数空间或输入输出空间，例如：
  $x \in \mathbb{R}^n$ 表示一个 n 维实数向量。
* **ℕ**：自然数集合（Natural numbers），常用于索引或样本数量。
* **∈**：属于（element of），如 $x \in \mathbb{R}^n$。
* **⊂, ⊆**：子集（subset, subset or equal）。
* **∪, ∩**：并集、交集。

---

#### 向量与矩阵

* **x, y**：小写字母一般表示向量。
* **X, W, A**：大写字母常表示矩阵。
* **xᵢ**：向量的第 i 个分量。
* **Xᵀ**：转置（transpose）。
* **‖x‖, ‖x‖₂**：向量的范数（norm），通常是二范数 (Euclidean norm)。
* **I**：单位矩阵（identity matrix）。
* **tr(A)**：矩阵的迹（trace），即对角线元素之和。
* **det(A)**：行列式（determinant）。

---

#### 概率与统计

* **P(A)**：事件 A 的概率。
* **p(x)**：随机变量 x 的概率密度函数 (PDF) 或概率质量函数 (PMF)。
* **𝔼\[·]**：期望（expectation），如 $\mathbb{E}[x]$。
* **Var(x)**：方差（variance）。
* **Cov(x, y)**：协方差（covariance）。
* **∼**：服从分布，如 $x \sim \mathcal{N}(\mu, \sigma^2)$ 表示服从正态分布。
* **KL(p‖q)**：KL 散度（Kullback–Leibler divergence），用于衡量两个分布的差异。

---

#### 微积分

* **∂, ∇**：偏导数、梯度符号。

  * $\frac{\partial f}{\partial x}$：f 对 x 的偏导数。
  * $\nabla f$：f 的梯度向量。
* **∫ f(x) dx**：积分。
* **∑, ∏**：求和与连乘。

---

#### 优化与线性代数

* **argmax, argmin**：取使函数最大化/最小化的自变量。

  * $\arg\max_{\theta} L(\theta)$：找到使损失函数最大的参数。
* **λ**：常用来表示正则化系数（L2/L1 正则化）。
* **σ(z)**：激活函数符号，尤其是 sigmoid。
* **ReLU(x) = max(0, x)**：常见激活函数。

---

#### 信息论与深度学习专用

* **H(p)**：熵（entropy）。
* **CE(p, q)**：交叉熵（cross entropy）。
* **δᵢⱼ**：Kronecker delta（克罗内克 δ），i=j 时为 1，否则为 0。
* **⊙**：Hadamard 乘积（element-wise product）。
* **⊗**：张量积（tensor product）。

---

#### 示例：逻辑回归的符号

逻辑回归模型通常写作：

$$
p(y=1|x) = \sigma(w^\top x + b), \quad
\sigma(z) = \frac{1}{1+e^{-z}}
$$

其中：

* $w \in \mathbb{R}^n$：参数向量
* $x \in \mathbb{R}^n$：输入特征
* $b \in \mathbb{R}$：偏置项
* $\sigma(\cdot)$：sigmoid 函数
