---
date: 2026-08-16
tag:
  - AI_GEN
---

# RL目录

## 第一阶段：基础强化学习

  1. 多臂老虎机（Multi-Armed Bandit）
  2. 策略迭代（Policy Iteration）
  3. 价值迭代（Value Iteration）
  4. 蒙特卡洛控制（Monte Carlo Control）
  5. SARSA
  6. Expected SARSA
  7. Double Q-learning
  8. TD(λ) / Eligibility Traces

  ## 第二阶段：深度价值学习

  9. DQN
  10. Experience Replay（经验回放机制）
  11. Target Network（目标网络机制）
  12. Double DQN
  13. Dueling DQN
  14. Prioritized Experience Replay（PER）
  15. Rainbow DQN
  16. Distributional DQN（C51 / QR-DQN）

  其中经验回放和目标网络可以合并进 DQN 主图，不必单独做成完整算法图。

  ## 第三阶段：策略梯度与 Actor-Critic

  17. REINFORCE
  18. Actor-Critic
  19. Advantage Actor-Critic（A2C）
  20. A3C
  21. TRPO
  22. PPO

  PPO 是目前最值得重点制作的策略梯度流程图。

  ## 第四阶段：连续动作控制

  23. DDPG
  24. TD3
  25. SAC

  这三种算法适合制作并排对比图，重点比较：

  - Actor 和 Critic 的数量
  - 确定性或随机策略
  - 目标网络更新
  - 探索噪声
  - 熵正则化

  ## 第五阶段：基于模型的方法

  26. Dyna-Q
  27. Model-Based Policy Optimization（MBPO）
  28. Monte Carlo Tree Search（MCTS）
  29. AlphaZero
  30. MuZero

  ## 第六阶段：高级与应用方向

  31. Hindsight Experience Replay（HER）
  32. Hierarchical RL / Options
  33. Imitation Learning / Behavioral Cloning
  34. GAIL
  35. Offline RL
  36. Conservative Q-Learning（CQL）
  37. Implicit Q-Learning（IQL）
  38. Decision Transformer

  ## 第七阶段：多智能体强化学习

  39. Independent Q-learning（IQL，注意与离线 RL 的 IQL 重名）
  40. MADDPG
  41. VDN
  42. QMIX
  43. MAPPO

  ## 推荐的主线制作清单

  如果目标是覆盖“主流算法”，建议优先完成下面 16 张：

  1. Q-learning（已完成）
  2. SARSA
  3. Value Iteration
  4. Monte Carlo Control
  5. DQN
  6. Double DQN
  7. Rainbow DQN
  8. REINFORCE
  9. Actor-Critic / A2C
  10. TRPO
  11. PPO
  12. DDPG
  13. TD3
  14. SAC
  15. Dyna-Q
  16. MuZero

  之后再制作一张总览分类图，将它们连接成：

```
  强化学习
  ├── 基于价值
  │   ├── Q-learning / SARSA
  │   └── DQN 系列
  ├── 基于策略
  │   └── REINFORCE / TRPO / PPO
  ├── Actor-Critic
  │   └── A2C / DDPG / TD3 / SAC
  ├── 基于模型
  │   └── Dyna-Q / MuZero
  ├── 离线强化学习
  └── 多智能体强化学习
```