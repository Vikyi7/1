@echo off
chcp 65001 >nul
echo ========================================
echo    Android 打包脚本
echo ========================================
echo.

REM 检查是否已安装 Capacitor Android
if not exist "node_modules\@capacitor\android" (
    echo [检查] 未检测到 @capacitor/android，正在安装...
    call npm install @capacitor/android
    if errorlevel 1 (
        echo [错误] 安装失败！
        pause
        exit /b 1
    )
)

REM 检查是否已添加 Android 平台
if not exist "android" (
    echo [检查] 未检测到 Android 项目，正在初始化...
    call npx cap add android
    if errorlevel 1 (
        echo [错误] 初始化失败！
        pause
        exit /b 1
    )
)

REM 构建 Web 应用
echo [1/4] 构建 Web 应用...
call npm run build
if errorlevel 1 (
    echo [错误] Web 应用构建失败！
    pause
    exit /b 1
)
echo [成功] Web 应用构建完成
echo.

REM 同步到 Android
echo [2/4] 同步代码到 Android 项目...
call npx cap sync android
if errorlevel 1 (
    echo [错误] 同步失败！
    pause
    exit /b 1
)
echo [成功] 同步完成
echo.

REM 检查 Android Studio 是否安装
where android-studio >nul 2>&1
if errorlevel 1 (
    echo [提示] 未检测到 Android Studio 命令行工具
    echo [提示] 将尝试直接打开项目文件夹
    echo.
)

REM 打开 Android Studio
echo [3/4] 打开 Android Studio...
echo.
echo ========================================
echo   接下来的步骤：
echo ========================================
echo 1. 等待 Android Studio 打开项目
echo 2. 等待 Gradle 同步完成
echo 3. 点击菜单：Build → Build Bundle(s) / APK(s) → Build APK(s)
echo 4. 等待构建完成
echo 5. APK 文件位置：
echo    android\app\build\outputs\apk\release\app-release.apk
echo ========================================
echo.
call npx cap open android

echo.
echo [4/4] 完成！
echo.
echo 提示：如果 Android Studio 没有自动打开，请手动打开：
echo       android 文件夹
echo.
pause










