@echo off
chcp 65001 >nul
echo ========================================
echo   配置 Java 环境变量
echo ========================================
echo.

REM 查找 Java 安装路径
echo [1/3] 正在查找 Java 安装路径...

set "JAVA_PATH="

REM 检查常见安装路径
if exist "C:\Program Files\Java\jdk-25" (
    set "JAVA_PATH=C:\Program Files\Java\jdk-25"
    echo 找到 Java: %JAVA_PATH%
) else if exist "C:\Program Files\Java\jdk-25.0.1" (
    set "JAVA_PATH=C:\Program Files\Java\jdk-25.0.1"
    echo 找到 Java: %JAVA_PATH%
) else (
    echo 未在默认路径找到 Java，请手动输入安装路径
    echo.
    set /p JAVA_PATH="请输入 Java 安装路径（例如: C:\Program Files\Java\jdk-25）: "
)

if "%JAVA_PATH%"=="" (
    echo [错误] 未找到 Java 安装路径
    pause
    exit /b 1
)

REM 验证路径
if not exist "%JAVA_PATH%\bin\java.exe" (
    echo [错误] 路径不正确，找不到 java.exe
    echo 请确认路径是否正确
    pause
    exit /b 1
)

echo.
echo [2/3] 配置环境变量...
echo.

REM 使用 setx 设置系统环境变量（需要管理员权限）
echo 正在设置 JAVA_HOME...
setx JAVA_HOME "%JAVA_PATH%" /M >nul 2>&1
if errorlevel 1 (
    echo [警告] 设置 JAVA_HOME 失败，可能需要管理员权限
    echo 请手动配置环境变量（见下方说明）
) else (
    echo [成功] JAVA_HOME 已设置为: %JAVA_PATH%
)

REM 检查 PATH 中是否已包含 %JAVA_HOME%\bin
echo.
echo [3/3] 检查 PATH 环境变量...

for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "CURRENT_PATH=%%b"

echo %CURRENT_PATH% | findstr /C:"%JAVA_HOME%\bin" >nul
if errorlevel 1 (
    echo 正在添加 %JAVA_HOME%\bin 到 PATH...
    setx PATH "%CURRENT_PATH%;%JAVA_HOME%\bin" /M >nul 2>&1
    if errorlevel 1 (
        echo [警告] 添加 PATH 失败，可能需要管理员权限
        echo 请手动配置环境变量（见下方说明）
    ) else (
        echo [成功] PATH 已更新
    )
) else (
    echo [提示] PATH 中已包含 Java
)

echo.
echo ========================================
echo   配置完成！
echo ========================================
echo.
echo 重要提示：
echo 1. 请关闭所有命令行窗口
echo 2. 重新打开命令行窗口
echo 3. 运行以下命令验证：
echo    java -version
echo.
echo 如果仍然提示找不到 java，请：
echo 1. 重启电脑
echo 2. 或手动配置环境变量（见下方说明）
echo.
pause










