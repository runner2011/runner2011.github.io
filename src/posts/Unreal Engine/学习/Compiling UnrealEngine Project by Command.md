---
date: 2025-06-08
tag:
  - English

---

# Compiling UnrealEngine Project by Command

I found sometimes I just want to tune a little code. Open full solution file of Visual studio is annoying. If you're same, you can use below command to compile unreal project code:

```bash
UnrealBuildTool.exe YourProjectName Platform BuildConfig -project="[Path]\YourProjectName.uproject"
```

**UnrealBuildTool** in the \Engine\Binaries\DotNET folder in your Unreal Engine. 

**Platform** is like Win64, IOS, or Android and so on.

**BuildConfig** is Development, Debug, or Shipping and so on.

For eg.

```bash
UnrealBuildTool.exe MyTestProject Win64 Development -project="C:\UE_Projs\MyTestProject\MyTestProject.uproject"
```

**Need Notice, above cmd is for *Standalone***, If you want to compile for **Editor**, should replace the target with [YourProjectNameEditor]

```bash
UnrealBuildTool.exe MyTestProjectEditor Win64 Development -project="C:\UE_Projs\MyTestProject\MyTestProject.uproject"
```