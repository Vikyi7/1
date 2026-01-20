@echo off
chcp 65001 >nul 2>&1
title 启动 ngrok 内网穿透
cd /d "%~dp0"

echo.
echo ========================================
echo   启动 ngrok 内网穿透
echo ========================================
echo.

echo 检查 ngrok 是否已安装...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ngrok 未安装！
    echo.
    echo 请按以下步骤操作：
    echo 1. 访问 https://ngrok.com/download
    echo 2. 下载 Windows 版本
    echo 3. 解压到任意目录（如 C:\ngrok\）
    echo 4. 将 ngrok.exe 添加到系统 PATH
    echo    或将其放在此目录下
    echo.
    echo 然后注册账号获取 Authtoken：
    echo https://dashboard.ngrok.com/signup
    echo.
    pause
    exit /b 1
)

echo.
echo 正在启动后端穿透（端口 3000）...
start "后端穿透" cmd /k "ngrok http 3000"

timeout /t 3 /nobreak >nul

echo 正在启动前端开发服务器...
start "前端开发服务器" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo 正在启动前端穿透（端口 5173）...
start "前端穿透" cmd /k "ngrok http 5173"

echo.
echo ========================================
echo   重要提示
echo ========================================
echo.
echo 1. 等待几秒钟，两个 ngrok 窗口会显示地址
echo    访问 http://localhost:4040 查看后端地址
echo    访问 http://localhost:4041 查看前端地址
echo.
echo 2. 复制后端 HTTPS 地址（如: https://xxx.ngrok-free.app）
echo    创建 .env 文件，添加：
echo    VITE_API_URL=你的后端地址
echo.
echo 3. 复制前端 HTTPS 地址（如: https://yyy.ngrok-free.app）
echo    在手机浏览器中打开这个地址
echo.
echo 4. 如果地址变化，需要更新 .env 并重启前端
echo.
echo ========================================
echo   按任意键关闭此窗口（服务会继续运行）
echo ========================================
pause >nul
