# Android 打包详细教程（从零开始）

本教程将一步一步教你如何将 **缘心福** 应用打包成 Android APK 文件。

---

## 📋 准备工作清单

在开始之前，请确认：
- [ ] Windows 电脑（本教程基于 Windows）
- [ ] 已安装 Node.js（项目已配置，应该已安装）
- [ ] 网络连接正常
- [ ] 至少 5GB 可用磁盘空间

---

## 第一步：安装 Java JDK

### 1.1 下载 JDK

1. 打开浏览器，访问：https://www.oracle.com/java/technologies/downloads/
2. 选择 **Java 17** 或 **Java 21**（推荐 Java 17，更稳定）
3. 选择 **Windows** → **x64 Installer**（.exe 文件）
4. 点击下载（文件大小约 180MB）

**或者使用 OpenJDK（免费，无需注册）：**
- 访问：https://adoptium.net/
- 选择 **Temurin 17 (LTS)**
- 选择 **Windows** → **x64** → **JDK**
- 下载 `.msi` 安装程序

### 1.2 安装 JDK

1. 双击下载的 `.exe` 或 `.msi` 文件
2. 点击 **"下一步"** → **"下一步"**
3. **重要**：记住安装路径，通常是：
   - `C:\Program Files\Java\jdk-17`
   - 或 `C:\Program Files\Eclipse Adoptium\jdk-17`
4. 点击 **"安装"**，等待完成
5. 点击 **"关闭"**

### 1.3 验证安装

1. 按 `Win + R`，输入 `cmd`，按回车
2. 在命令行中输入：
   ```cmd
   java -version
   ```
3. 如果显示版本号（如 `java version "17.0.x"`），说明安装成功 ✅
4. 如果显示 `'java' 不是内部或外部命令`，需要配置环境变量（见下一步）

### 1.4 配置 JAVA_HOME 环境变量

**如果 `java -version` 命令失败，按以下步骤配置：**

1. 右键点击 **"此电脑"** → **"属性"**
2. 点击 **"高级系统设置"**
3. 点击 **"环境变量"**
4. 在 **"系统变量"** 区域，点击 **"新建"**
5. 变量名：`JAVA_HOME`
6. 变量值：JDK 安装路径（如 `C:\Program Files\Java\jdk-17`）
7. 点击 **"确定"**
8. 找到 **"Path"** 变量，点击 **"编辑"**
9. 点击 **"新建"**，添加：`%JAVA_HOME%\bin`
10. 点击 **"确定"** → **"确定"** → **"确定"**
11. **关闭所有命令行窗口**，重新打开，再次运行 `java -version` 验证

---

## 第二步：安装 Android Studio

### 2.1 下载 Android Studio

1. 访问：https://developer.android.com/studio
2. 点击 **"Download Android Studio"**（绿色按钮）
3. 文件大小约 1GB，下载需要一些时间

### 2.2 安装 Android Studio

1. 双击下载的 `.exe` 文件
2. 点击 **"Next"** → **"Next"**
3. **重要**：勾选以下组件（默认已勾选）：
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device
4. 选择安装路径（默认即可，或自定义）
5. 点击 **"Next"** → **"Install"**
6. 等待安装完成（可能需要 10-20 分钟）
7. 点击 **"Finish"**

### 2.3 首次启动配置

1. 启动 Android Studio（首次启动较慢，请耐心等待）
2. 如果提示 **"Import Android Studio Settings"**，选择 **"Do not import settings"**
3. 点击 **"Next"** → **"Standard"** → **"Next"**
4. 选择主题（Light 或 Dark），点击 **"Next"**
5. 点击 **"Next"** → **"Finish"**
6. 等待下载和配置完成（可能需要 10-30 分钟，取决于网速）
7. 完成后点击 **"Finish"**

### 2.4 配置 Android SDK

1. 在 Android Studio 中，点击 **"More Actions"** → **"SDK Manager"**
   - 或：`File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
2. 在 **"SDK Platforms"** 标签页：
   - ✅ 勾选 **Android 13.0 (Tiramisu)** API Level 33
   - ✅ 勾选 **Android 12.0 (S)** API Level 31（最低支持）
3. 在 **"SDK Tools"** 标签页，确保以下已勾选：
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Google Play services
4. 点击 **"Apply"** → **"OK"**，等待下载完成

### 2.5 配置 ANDROID_HOME 环境变量

1. 找到 Android SDK 路径（通常在）：
   - `C:\Users\你的用户名\AppData\Local\Android\Sdk`
2. 右键点击 **"此电脑"** → **"属性"** → **"高级系统设置"** → **"环境变量"**
3. 在 **"系统变量"** 区域，点击 **"新建"**
4. 变量名：`ANDROID_HOME`
5. 变量值：SDK 路径（如 `C:\Users\你的用户名\AppData\Local\Android\Sdk`）
6. 点击 **"确定"**
7. 找到 **"Path"** 变量，点击 **"编辑"**
8. 添加以下路径（如果不存在）：
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
9. 点击 **"确定"** → **"确定"** → **"确定"**
10. **关闭所有命令行窗口**，重新打开

### 2.6 验证 Android SDK 安装

1. 打开新的命令行窗口（cmd）
2. 输入以下命令验证：
   ```cmd
   adb version
   ```
3. 如果显示版本号，说明配置成功 ✅

---

## 第三步：初始化 Android 项目

### 3.1 打开项目目录

1. 打开文件资源管理器
2. 导航到项目目录：`D:\06`
3. 在地址栏输入 `cmd` 并按回车（会在当前目录打开命令行）

### 3.2 安装 Capacitor Android 插件

在命令行中执行：

```cmd
npm install @capacitor/android
```

等待安装完成（可能需要 1-2 分钟）

### 3.3 添加 Android 平台

继续在命令行中执行：

```cmd
npx cap add android
```

等待完成，你会看到：
- ✅ 创建了 `android` 文件夹
- ✅ 生成了 Android 项目文件

### 3.4 验证项目结构

检查是否生成了以下文件/文件夹：
- `android/` 文件夹
- `android/app/` 文件夹
- `android/app/build.gradle` 文件

如果都存在，说明初始化成功 ✅

---

## 第四步：构建 Web 应用

### 4.1 构建项目

在命令行中执行：

```cmd
npm run build
```

等待构建完成，你会看到：
- ✅ 生成了 `dist/` 文件夹
- ✅ 包含编译后的 HTML、CSS、JS 文件

### 4.2 同步到 Android 项目

继续执行：

```cmd
npx cap sync android
```

这个命令会：
- 将 `dist/` 中的文件复制到 Android 项目
- 更新 Android 项目配置
- 安装必要的插件

等待完成，看到 `✅ Sync complete` 表示成功 ✅

---

## 第五步：在 Android Studio 中构建 APK

### 5.1 打开 Android Studio 项目

**方式 1：使用命令行（推荐）**
```cmd
npx cap open android
```

**方式 2：手动打开**
1. 打开 Android Studio
2. 点击 `File` → `Open`
3. 选择 `D:\06\android` 文件夹
4. 点击 `OK`

### 5.2 等待 Gradle 同步

1. Android Studio 会自动开始 **Gradle Sync**（同步项目）
2. 底部状态栏会显示进度
3. 首次同步可能需要 5-15 分钟（下载依赖）
4. 等待看到 `Gradle sync finished` ✅

**如果同步失败：**
- 检查网络连接
- 点击 `File` → `Invalidate Caches` → `Invalidate and Restart`
- 或检查 `android/build.gradle` 中的仓库配置

### 5.3 配置签名（可选，用于发布）

**如果是测试版本，可以跳过此步，直接构建 Debug APK**

1. 在 Android Studio 中，点击 `Build` → `Generate Signed Bundle / APK`
2. 选择 `APK`，点击 `Next`
3. 点击 `Create new...` 创建新的密钥库
4. 填写信息：
   - **Key store path**: 选择保存位置（如 `D:\06\android\app\release.keystore`）
   - **Password**: 设置密码（记住它！）
   - **Alias**: 密钥别名（如 `release`）
   - **Password**: 别名密码（可以与密钥库密码相同）
   - **Validity**: 25（年）
   - **Certificate**: 填写你的信息
5. 点击 `OK` → `Next`
6. 选择 `release`，勾选 `V1 (Jar Signature)` 和 `V2 (Full APK Signature)`
7. 点击 `Finish`
8. 等待构建完成

### 5.4 构建 Debug APK（测试版本）

1. 点击菜单：`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. 等待构建完成（底部会显示进度）
3. 构建完成后，会弹出通知
4. 点击 `locate` 查看 APK 文件位置

**APK 文件位置：**
```
D:\06\android\app\build\outputs\apk\debug\app-debug.apk
```

### 5.5 构建 Release APK（发布版本）

1. 点击菜单：`Build` → `Select Build Variant`
2. 在底部面板中，将 `app` 的 `Active Build Variant` 改为 `release`
3. 点击菜单：`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
4. 等待构建完成

**APK 文件位置：**
```
D:\06\android\app\build\outputs\apk\release\app-release.apk
```

---

## 第六步：安装到手机测试

### 6.1 传输 APK 到手机

**方式 1：USB 连接**
1. 用 USB 线连接手机到电脑
2. 在手机上选择 **"文件传输"** 模式
3. 将 APK 文件复制到手机存储

**方式 2：通过网盘/邮件**
1. 将 APK 上传到网盘（如百度网盘、OneDrive）
2. 在手机上下载

**方式 3：通过 ADB 直接安装（需要开启 USB 调试）**
```cmd
adb install D:\06\android\app\build\outputs\apk\debug\app-debug.apk
```

### 6.2 在手机上安装

1. 在手机文件管理器中找到 APK 文件
2. 点击 APK 文件
3. 如果提示 **"禁止安装未知来源应用"**：
   - 打开 **设置** → **安全**（或 **应用**）
   - 开启 **"允许安装未知来源应用"**
4. 点击 **"安装"**
5. 安装完成后，点击 **"打开"** 启动应用

---

## 🎉 完成！

恭喜！你已经成功将应用打包成 Android APK 了！

---

## 📝 后续步骤

### 优化应用

1. **添加应用图标**
   - 准备 512x512 和 1024x1024 的图标
   - 替换 `android/app/src/main/res/mipmap-*/ic_launcher.png`

2. **修改应用名称**
   - 编辑 `android/app/src/main/res/values/strings.xml`
   - 修改 `app_name` 的值

3. **配置权限**
   - 编辑 `android/app/src/main/AndroidManifest.xml`
   - 添加所需权限（如相机、网络等）

### 发布到 Google Play

1. 注册 Google Play 开发者账号（$25）
2. 访问：https://play.google.com/console
3. 创建新应用
4. 上传 AAB 文件（不是 APK）
5. 填写应用信息
6. 提交审核

---

## ❓ 常见问题

### Q: Gradle 同步失败，提示 "Connection timed out"
**A**: 
- 检查网络连接
- 尝试使用 VPN 或代理
- 或配置国内镜像源

### Q: 构建失败，提示 "SDK location not found"
**A**: 
- 检查 `ANDROID_HOME` 环境变量是否正确
- 或在 `android/local.properties` 文件中添加：
  ```
  sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
  ```

### Q: APK 安装后无法打开
**A**: 
- 检查手机 Android 版本是否支持（建议 Android 5.0+）
- 查看 Android Studio 的 Logcat 查看错误信息
- 确保所有权限都已授予

### Q: 如何获取手机的 UDID（用于 Ad Hoc 分发）？
**A**: 
- 连接手机到电脑
- 在命令行执行：`adb devices`
- 或使用：`adb shell settings get secure android_id`

---

## 🆘 需要帮助？

如果遇到问题：
1. 检查错误信息，在 Google 搜索解决方案
2. 查看 Android Studio 的 Logcat 输出
3. 参考官方文档：https://capacitorjs.com/docs/android

**祝你打包顺利！** 🚀










