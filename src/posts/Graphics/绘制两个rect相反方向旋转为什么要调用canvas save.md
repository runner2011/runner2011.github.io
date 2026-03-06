---
date: 2025-12-23
tag:
  - Graphics
  - AI_GEN

---

# 绘制两个rect相反方向旋转为什么要调用canvas save

## Code
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  Edit gemini_ver_mod.html:         // 画一些旋转的粒子或线条... =>         // 画一些旋转的粒子或线条...  │
│                                                                                                            │
│  96   angle += 30 / (radius + 10);                                                                         │
│  97   const a = 2; //6                                                                                     │
│  98   for (let i = 0; i < a; i++) {                                                                        │
│  99 -     canvasCtx.rotate(angle + (i * Math.PI / 3));                                                     │
│  99 +     canvasCtx.save();                                                                                │
│ 100 +     const direction = (i === 0) ? 1 : -1;                                                            │
│ 101 +     canvasCtx.rotate(direction * angle + (i * Math.PI / 4)); // Offset of 45 deg                     │
│ 102       canvasCtx.strokeRect(-radius/2, -radius/2, radius, radius);                                      │
│ 103 +     canvasCtx.restore();                                                                             │
│ 104   }                                                                                                    │
│ 105                                                                                                        │
│ 106   // 画粒子点                                                                                          │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ The two rectangles now rotate in opposite directions (one clockwise, one counter-clockwise) with a slight
  initial offset.

## canvasCtx.save()什么意思

✦ canvasCtx.save() 是 HTML5 Canvas API 中的一个方法，它的作用是 保存当前画布的所有状态。

  想象 Canvas 的状态就像是一个游戏存档。当你调用 save()
  时，浏览器会把当前的“画笔设置”和“坐标系状态”拍一张快照，存进一个栈（Stack）里。

  它保存了什么？
   1. 变换矩阵 (Transformation Matrix)： 包括 translate (平移), rotate (旋转), scale
      (缩放)。这是最重要的，也是我刚才用它的原因。
   2. 样式属性： strokeStyle (线条颜色), fillStyle (填充颜色), lineWidth (线宽), shadowBlur (阴影) 等等。
   3. 裁剪区域 (Clipping Region)。

  为什么要用它？
  在刚才的代码中：

   1 for (let i = 0; i < a; i++) {
   2     canvasCtx.save(); // 1. 存档：记住现在的状态（中心点未旋转的状态）
   3     
   4     const direction = (i === 0) ? 1 : -1;
   5     canvasCtx.rotate(direction * angle + ...); // 2. 旋转坐标系
   6     canvasCtx.strokeRect(...); // 3. 画矩形
   7     
   8     canvasCtx.restore(); // 4. 读档：恢复到第1步的状态
   9 }

  如果不使用 save() 和 restore()，Canvas 的状态是累加的。
   * 没有 save/restore： 第一个矩形旋转了 30 度，第二个矩形如果想反向转 30
     度，它实际上是在第一个矩形的基础上转的，结果会乱套。
   * 有 save/restore： 每次画矩形前都从“干净”的状态开始，画完后立刻恢复，互不干扰。

## 似乎用opengl api绘制多个rect的transform并不需要做这个？

✦ 你说得很对！你的直觉非常敏锐。

  这主要取决于你指的是 现代 OpenGL (Modern OpenGL / Programmable Pipeline) 还是 旧版 OpenGL (Legacy / Fixed
  Function)。

  1. 现代 OpenGL (Shader 时代)
  确实不需要像 Canvas 这样 `save/restore`。

  在现代图形编程（OpenGL 3.0+, Vulkan, DirectX, WebGL）中，绘制逻辑通常是这样的：

   * 独立的矩阵计算：你在 CPU 端（代码里）为每一个物体单独计算一个 模型矩阵 (Model Matrix)。
       * 矩形 A 的矩阵 = 平移(x,y) * 旋转(30度) * 缩放(1,1)
       * 矩形 B 的矩阵 = 平移(x,y) * 旋转(-30度) * 缩放(1,1)
   * 传递给 GPU：当你画矩形 A 时，把 矩阵 A 传给 Shader；画矩形 B 时，把 矩阵 B 传给 Shader。
   * 无状态干扰：GPU 在画矩形 B 时，根本不知道刚才画矩形 A 用了什么矩阵。它们是完全独立的绘制指令 (Draw
     Call)。

  Canvas 2D 的设计逻辑比较像一个“状态机”。它只有一个全局的“画笔/坐标系”。如果你把坐标系转了 30
  度，后面画的所有东西都会歪 30 度，直到你把它转回来（或者用 restore 读档）。

  2. 旧版 OpenGL (glBegin/glEnd 时代)
  其实，早期的 OpenGL (1.x / 2.x) 和 Canvas 非常像。它也有：
   * glPushMatrix()  (对应 ctx.save())
   * glPopMatrix() (对应 ctx.restore())

  那时也是靠操作全局矩阵堆栈来画图的。但这种方式效率较低，在现代高性能图形开发中已经被淘汰了。

  总结：
   * Canvas 2D：由于是简化的高级 API，沿用了“状态机”模式，所以需要 save/restore 来隔离状态。
   * 现代 OpenGL：基于数据驱动，每个物体带着自己的矩阵数据去渲染，互不干扰，所以不需要这种“存档/读档”的操作。

