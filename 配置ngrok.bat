@echo off
chcp 65001 >nul 2>&1
title 配置 ngrok
cd /d "%~dp0"

echo.
echo ========================================
echo   配置 ngrok
echo ========================================
echo.

echo 检查 ngrok 是否已安装...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ngrok 未安装！
    echo.
    echo 请先安装 ngrok：
    echo 1. 访问 https://ngrok.com/download
    echo 2. 下载 Windows 版本
    echo 3. 解压到任意目录
    echo 4. 将 ngrok.exe 添加到系统 PATH
    echo    或将其放在此目录下
    echo.
    echo 或者从 Microsoft Store 安装
    echo.
    pause
    exit /b 1
)

echo ngrok 已安装！
echo.
echo 正在配置 authtoken...
ngrok config add-authtoken 38KkMPCCCH7qcExCRiVkeUARnMj_4iB5hj52jBjGL9Je3nG8T

if %errorlevel% equ 0 (
    echo.
    echo ✅ authtoken 配置成功！
    echo.
    echo 现在可以启动穿透服务了
) else (
    echo.
    echo ❌ authtoken 配置失败
    echo 请检查网络连接或 authtoken 是否正确
)

echo.
pause
