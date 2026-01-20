@echo off
chcp 65001 >nul 2>&1
title 启动 ngrok 手机访问
cd /d "%~dp0"

echo.
echo ========================================
echo   启动 ngrok 内网穿透（手机访问）
echo ========================================
echo.

echo 检查 ngrok 是否已安装...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ngrok 未安装！
    echo 请先运行 配置ngrok.bat 或手动安装 ngrok
    echo.
    pause
    exit /b 1
)

echo ngrok 已安装！
echo.

echo 正在启动后端穿透（端口 3000）...
start "后端穿透" cmd /k "ngrok http 3000"

timeout /t 3 /nobreak >nul

echo 正在启动前端穿透（端口 5174）...
start "前端穿透" cmd /k "ngrok http 5174"

echo.
echo ========================================
echo   重要提示
echo ========================================
echo.
echo 1. 两个 ngrok 窗口已打开
echo.
echo 2. 查看后端地址：
echo    - 打开浏览器访问 http://localhost:4040
echo    - 或查看后端穿透窗口
echo    - 复制 HTTPS 地址（如: https://xxx.ngrok-free.app）
echo.
echo 3. 查看前端地址：
echo    - 打开浏览器访问 http://localhost:4041
echo    - 或查看前端穿透窗口
echo    - 复制 HTTPS 地址（如: https://yyy.ngrok-free.app）
echo.
echo 4. 配置后端地址：
echo    - 创建 .env 文件，添加：
echo      VITE_API_URL=你的后端地址
echo    - 重启前端服务器
echo.
echo 5. 在手机浏览器中打开前端地址
echo.
echo ========================================
echo   按任意键关闭此窗口（服务会继续运行）
echo ========================================
pause >nul
