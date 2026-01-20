# 移动端 App 打包分发指南

本指南将帮助你为 **缘心福** 应用生成 iOS 和 Android 安装包，并提供多种分发方式。

---

## 📱 目录

1. [Android 打包（Windows 可操作）](#android-打包)
2. [iOS 打包（需要 Mac）](#ios-打包)
3. [分发方式](#分发方式)
4. [快速开始脚本](#快速开始脚本)

---

## 🤖 Android 打包

### 前置要求

1. **安装 Java JDK 17+**
   - 下载：https://www.oracle.com/java/technologies/downloads/
   - 或使用 OpenJDK：https://adoptium.net/

2. **安装 Android Studio**
   - 下载：https://developer.android.com/studio
   - 安装时选择 "Android SDK" 和 "Android SDK Platform"

3. **配置环境变量**
   ```powershell
   # 添加到系统环境变量
   ANDROID_HOME = C:\Users\你的用户名\AppData\Local\Android\Sdk
   JAVA_HOME = C:\Program Files\Java\jdk-17
   
   # 添加到 PATH
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   %JAVA_HOME%\bin
   ```

### 步骤 1：初始化 Android 项目

```powershell
# 安装 Capacitor Android 插件
npm install @capacitor/android

# 添加 Android 平台
npx cap add android

# 同步代码到 Android 项目
npm run build
npx cap sync android
```

### 步骤 2：在 Android Studio 中构建

1. **打开 Android Studio**
   ```powershell
   npx cap open android
   ```

2. **配置签名密钥（用于发布）**
   - 在 Android Studio 中：`Build` → `Generate Signed Bundle / APK`
   - 选择 `Android App Bundle`（推荐）或 `APK`
   - 创建新的密钥库（KeyStore）或使用现有的
   - 填写密钥信息并保存

3. **构建 Release 版本**
   - `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - 或使用命令行：
     ```powershell
     cd android
     .\gradlew assembleRelease
     ```
   - APK 文件位置：`android/app/build/outputs/apk/release/app-release.apk`

### 步骤 3：生成 AAB（用于 Google Play）

```powershell
cd android
.\gradlew bundleRelease
```

AAB 文件位置：`android/app/build/outputs/bundle/release/app-release.aab`

---

## 🍎 iOS 打包

### 前置要求

1. **Mac 电脑**（必须）
2. **Xcode 14+**
   - 从 App Store 安装
3. **Apple Developer 账号**（$99/年，用于发布到 App Store）
   - 注册：https://developer.apple.com/

### 步骤 1：初始化 iOS 项目

```bash
# 在 Mac 上执行
npm install @capacitor/ios
npx cap add ios
npm run build
npx cap sync ios
```

### 步骤 2：在 Xcode 中配置

1. **打开项目**
   ```bash
   npx cap open ios
   ```

2. **配置签名**
   - 选择项目 → `Signing & Capabilities`
   - 选择你的 Team（需要 Apple Developer 账号）
   - 修改 Bundle Identifier（如果需要）

3. **配置 App 信息**
   - 修改 Display Name、Version、Build Number
   - 添加 App Icon 和 Launch Screen

### 步骤 3：构建 IPA

#### 方式 A：通过 Xcode（推荐）

1. 选择设备：`Any iOS Device (arm64)`
2. `Product` → `Archive`
3. 等待构建完成
4. 在 Organizer 窗口：
   - 点击 `Distribute App`
   - 选择分发方式：
     - **App Store Connect**：上传到 App Store
     - **Ad Hoc**：直接安装到指定设备（需要注册设备 UDID）
     - **Enterprise**：企业内部分发（需要 Enterprise 账号）
     - **Development**：开发测试

#### 方式 B：命令行构建

```bash
# 构建 Archive
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath ios/App.xcarchive \
  archive

# 导出 IPA
xcodebuild -exportArchive \
  -archivePath ios/App.xcarchive \
  -exportPath ios/dist \
  -exportOptionsPlist ios/ExportOptions.plist
```

---

## 📦 分发方式

### 1. **直接安装 APK（Android）**

**适用场景**：个人使用、小范围测试

**步骤**：
1. 将 `app-release.apk` 传输到 Android 手机
2. 在手机上：`设置` → `安全` → 开启 `允许安装未知来源应用`
3. 点击 APK 文件安装

**优点**：简单快速，无需审核  
**缺点**：用户需要手动信任来源

---

### 2. **Google Play 商店（Android）**

**适用场景**：正式发布，面向所有用户

**步骤**：
1. 注册 Google Play 开发者账号（$25 一次性费用）
2. 访问：https://play.google.com/console
3. 创建新应用
4. 上传 AAB 文件
5. 填写应用信息、截图、隐私政策等
6. 提交审核（通常 1-3 天）

**优点**：官方渠道，用户信任度高  
**缺点**：需要审核，需要支付费用

---

### 3. **App Store（iOS）**

**适用场景**：正式发布，面向所有用户

**步骤**：
1. 注册 Apple Developer 账号（$99/年）
2. 在 Xcode 中：`Product` → `Archive` → `Distribute App` → `App Store Connect`
3. 访问：https://appstoreconnect.apple.com/
4. 创建新应用
5. 填写应用信息、截图、隐私政策等
6. 提交审核（通常 1-7 天）

**优点**：官方渠道，用户信任度高  
**缺点**：审核严格，需要支付年费

---

### 4. **TestFlight（iOS 测试）**

**适用场景**：iOS 内测分发

**步骤**：
1. 在 App Store Connect 中创建应用
2. 上传构建版本
3. 添加测试用户（最多 10,000 人）
4. 用户通过 TestFlight App 安装

**优点**：官方测试渠道，最多 10,000 测试用户  
**缺点**：需要 Apple Developer 账号

---

### 5. **Ad Hoc 分发（iOS）**

**适用场景**：小范围测试（最多 100 台设备）

**步骤**：
1. 在 Apple Developer 后台注册设备 UDID
2. 在 Xcode 中：`Product` → `Archive` → `Distribute App` → `Ad Hoc`
3. 生成 IPA 文件
4. 通过邮件、网盘等方式分发给用户
5. 用户通过 iTunes 或第三方工具安装

**优点**：无需审核，适合内测  
**缺点**：设备数量限制，需要注册 UDID

---

### 6. **企业内部分发（iOS Enterprise）**

**适用场景**：企业内部应用

**要求**：
- Apple Enterprise Developer 账号（$299/年）
- 仅限企业内部使用

**步骤**：
1. 在 Xcode 中：`Product` → `Archive` → `Distribute App` → `Enterprise`
2. 生成 IPA 和 manifest.plist
3. 部署到企业内网服务器
4. 用户通过 Safari 访问安装链接

---

### 7. **PWA（渐进式 Web App）**

**适用场景**：无需应用商店，通过浏览器安装

**优点**：
- ✅ 无需审核
- ✅ 跨平台（iOS + Android）
- ✅ 自动更新
- ✅ 无需开发者账号费用

**步骤**：
1. 确保已配置 PWA（项目已配置）
2. 部署到 HTTPS 服务器
3. 用户在浏览器中访问网站
4. 点击"添加到主屏幕"

**当前项目已支持 PWA**，用户可以通过浏览器直接安装！

---

## 🚀 快速开始脚本

### Android 一键打包脚本

创建 `build-android.bat`：

```batch
@echo off
echo 正在构建 Android APK...

REM 构建 Web 应用
echo [1/3] 构建 Web 应用...
call npm run build
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

REM 同步到 Android
echo [2/3] 同步到 Android 项目...
call npx cap sync android
if errorlevel 1 (
    echo 同步失败！
    pause
    exit /b 1
)

REM 打开 Android Studio
echo [3/3] 打开 Android Studio...
echo 请在 Android Studio 中：Build → Build Bundle(s) / APK(s) → Build APK(s)
call npx cap open android

echo.
echo 完成！APK 文件位置：android\app\build\outputs\apk\release\app-release.apk
pause
```

### iOS 一键打包脚本（Mac）

创建 `build-ios.sh`：

```bash
#!/bin/bash
echo "正在构建 iOS IPA..."

# 构建 Web 应用
echo "[1/3] 构建 Web 应用..."
npm run build
if [ $? -ne 0 ]; then
    echo "构建失败！"
    exit 1
fi

# 同步到 iOS
echo "[2/3] 同步到 iOS 项目..."
npx cap sync ios
if [ $? -ne 0 ]; then
    echo "同步失败！"
    exit 1
fi

# 打开 Xcode
echo "[3/3] 打开 Xcode..."
echo "请在 Xcode 中：Product → Archive → Distribute App"
npx cap open ios

echo ""
echo "完成！"
```

---

## 📝 注意事项

### Android

1. **最低 SDK 版本**：建议 Android 5.0 (API 21) 或更高
2. **目标 SDK 版本**：建议 Android 13 (API 33) 或更高
3. **权限配置**：在 `android/app/src/main/AndroidManifest.xml` 中配置所需权限
4. **ProGuard**：发布版本建议启用代码混淆

### iOS

1. **最低 iOS 版本**：建议 iOS 13.0 或更高
2. **权限配置**：在 `ios/App/App/Info.plist` 中配置所需权限（如相机、麦克风）
3. **App Icon**：需要提供多种尺寸的图标
4. **隐私政策**：App Store 审核需要提供隐私政策链接

### 通用

1. **版本号管理**：每次发布前更新版本号
2. **测试**：在真实设备上充分测试
3. **性能优化**：确保应用启动速度和运行流畅度
4. **错误处理**：添加完善的错误处理和用户提示

---

## 🆘 常见问题

### Q: Android 构建失败，提示 "SDK location not found"
**A**: 设置 `ANDROID_HOME` 环境变量，或创建 `android/local.properties` 文件：
```
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

### Q: iOS 构建失败，提示 "No signing certificate"
**A**: 在 Xcode 中配置 Signing & Capabilities，选择你的 Team。

### Q: 如何获取 iOS 设备 UDID？
**A**: 
- 方法 1：连接设备到 Mac，在 Xcode 的 Window → Devices 中查看
- 方法 2：在设备上：设置 → 通用 → 关于本机 → 找到 UDID

### Q: 可以直接在 Windows 上打包 iOS 吗？
**A**: 不可以，iOS 打包必须在 Mac 上进行。可以考虑：
- 使用 Mac 虚拟机（违反 Apple 许可协议）
- 使用云 Mac 服务（如 MacStadium、AWS Mac instances）
- 使用 CI/CD 服务（如 GitHub Actions、GitLab CI）

---

## 📚 相关资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android 开发者指南](https://developer.android.com/guide)
- [iOS 开发者指南](https://developer.apple.com/documentation/)
- [Google Play 发布指南](https://support.google.com/googleplay/android-developer)
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/)

---

**祝打包顺利！** 🎉










