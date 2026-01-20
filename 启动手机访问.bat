@echo off
chcp 65001 >nul 2>&1
title 启动手机访问服务
cd /d "%~dp0"

echo.
echo ========================================
echo   启动手机访问服务（内网穿透）
echo ========================================
echo.

echo 检查 localtunnel 是否已安装...
where lt >nul 2>&1
if %errorlevel% neq 0 (
    echo localtunnel 未安装，正在安装...
    call npm install -g localtunnel
    if %errorlevel% neq 0 (
        echo 安装失败，请手动运行: npm install -g localtunnel
        pause
        exit /b 1
    )
)

echo.
echo 正在启动后端服务器穿透（端口 3000）...
start "后端穿透" cmd /k "lt --port 3000 --print-requests"

timeout /t 3 /nobreak >nul

echo 正在启动前端开发服务器...
start "前端开发服务器" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo 正在启动前端穿透（端口 5173）...
start "前端穿透" cmd /k "lt --port 5173 --print-requests"

echo.
echo ========================================
echo   重要提示
echo ========================================
echo.
echo 1. 等待几秒钟，两个穿透窗口会显示地址
echo.
echo 2. 复制后端地址（如: https://xxx.loca.lt）
echo    创建 .env 文件，添加：
echo    VITE_API_URL=你的后端地址
echo.
echo 3. 复制前端地址（如: https://yyy.loca.lt）
echo    在手机浏览器中打开这个地址
echo.
echo 4. 如果前端地址变化，需要更新 .env 并重启前端
echo.
echo ========================================
echo   按任意键关闭此窗口（服务会继续运行）
echo ========================================
pause >nul
