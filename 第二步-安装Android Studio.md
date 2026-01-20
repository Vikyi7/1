# 第二步：安装 Android Studio

Java 已安装成功 ✅，现在开始安装 Android Studio。

---

## 📥 第一步：下载 Android Studio

1. **打开浏览器**，访问：https://developer.android.com/studio

2. **点击绿色的 "Download Android Studio" 按钮**

3. **等待下载完成**（文件大小约 1GB，需要一些时间）

---

## 📦 第二步：安装 Android Studio

1. **找到下载的文件**（通常在 `下载` 文件夹）
   - 文件名：`android-studio-xxxxx-windows.exe`

2. **双击运行**安装程序

3. **安装步骤**：
   - 点击 **"Next"**（下一步）
   - 点击 **"Next"**（选择安装组件，默认全选即可）
   - 选择安装路径（默认：`C:\Program Files\Android\Android Studio`）
   - 点击 **"Next"**
   - 点击 **"Install"**（安装）
   - 等待安装完成（可能需要 10-20 分钟）
   - 点击 **"Finish"**（完成）

---

## ⚙️ 第三步：首次启动配置

1. **启动 Android Studio**（首次启动较慢，请耐心等待）

2. **如果提示导入设置**：
   - 选择 **"Do not import settings"**（不导入设置）
   - 点击 **"OK"**

3. **欢迎界面配置**：
   - 点击 **"Next"**
   - 选择 **"Standard"**（标准安装）
   - 点击 **"Next"**
   - 选择主题（Light 或 Dark，随你喜欢）
   - 点击 **"Next"**
   - 点击 **"Next"**（确认组件）
   - 点击 **"Finish"**（开始下载 SDK）

4. **等待下载完成**（可能需要 10-30 分钟，取决于网速）
   - 会下载 Android SDK、构建工具等
   - 进度条会显示下载状态

5. **完成后点击 "Finish"**

---

## 🔧 第四步：配置 Android SDK 路径

### 4.1 找到 SDK 路径

Android SDK 通常安装在：
```
C:\Users\你的用户名\AppData\Local\Android\Sdk
```

### 4.2 配置环境变量

1. 按 `Win + X` → **"系统"** → **"高级系统设置"** → **"环境变量"**

2. **添加 ANDROID_HOME**：
   - 在 **"系统变量"** 点击 **"新建"**
   - 变量名：`ANDROID_HOME`
   - 变量值：`C:\Users\你的用户名\AppData\Local\Android\Sdk`
   - 点击 **"确定"**

3. **添加到 PATH**：
   - 找到 **"Path"** 变量，点击 **"编辑"**
   - 点击 **"新建"**，依次添加：
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\tools\bin`
   - 点击 **"确定"** → **"确定"** → **"确定"**

4. **关闭所有命令行窗口**，重新打开

---

## ✅ 第五步：验证安装

1. **打开新的命令行窗口**（`Win + R` → `cmd`）

2. **输入以下命令验证**：
   ```cmd
   adb version
   ```

3. **如果显示版本号**，说明配置成功 ✅

---

## 📋 安装完成后

告诉我安装完成，我会继续指导你：
- **第三步**：初始化 Android 项目
- **第四步**：构建 APK

---

## ❓ 常见问题

### Q: 下载很慢怎么办？
**A**: 
- 使用 VPN 或代理
- 或使用国内镜像源（需要手动配置）

### Q: 安装时提示需要管理员权限？
**A**: 
- 右键点击安装程序
- 选择 **"以管理员身份运行"**

### Q: 首次启动一直卡在下载？
**A**: 
- 检查网络连接
- 如果很慢，可以稍等或使用 VPN

---

**安装完成后告诉我！** 🚀










