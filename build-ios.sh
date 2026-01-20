#!/bin/bash

echo "========================================"
echo "   iOS 打包脚本"
echo "========================================"
echo ""

# 检查是否在 Mac 上运行
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "[错误] iOS 打包必须在 Mac 上运行！"
    exit 1
fi

# 检查是否已安装 Capacitor iOS
if [ ! -d "node_modules/@capacitor/ios" ]; then
    echo "[检查] 未检测到 @capacitor/ios，正在安装..."
    npm install @capacitor/ios
    if [ $? -ne 0 ]; then
        echo "[错误] 安装失败！"
        exit 1
    fi
fi

# 检查是否已添加 iOS 平台
if [ ! -d "ios" ]; then
    echo "[检查] 未检测到 iOS 项目，正在初始化..."
    npx cap add ios
    if [ $? -ne 0 ]; then
        echo "[错误] 初始化失败！"
        exit 1
    fi
fi

# 构建 Web 应用
echo "[1/4] 构建 Web 应用..."
npm run build
if [ $? -ne 0 ]; then
    echo "[错误] Web 应用构建失败！"
    exit 1
fi
echo "[成功] Web 应用构建完成"
echo ""

# 同步到 iOS
echo "[2/4] 同步代码到 iOS 项目..."
npx cap sync ios
if [ $? -ne 0 ]; then
    echo "[错误] 同步失败！"
    exit 1
fi
echo "[成功] 同步完成"
echo ""

# 打开 Xcode
echo "[3/4] 打开 Xcode..."
echo ""
echo "========================================"
echo "   接下来的步骤："
echo "========================================"
echo "1. 等待 Xcode 打开项目"
echo "2. 选择设备：Any iOS Device (arm64)"
echo "3. 点击菜单：Product → Archive"
echo "4. 等待构建完成"
echo "5. 在 Organizer 窗口："
echo "   - 点击 Distribute App"
echo "   - 选择分发方式（App Store / Ad Hoc 等）"
echo "========================================"
echo ""
npx cap open ios

echo ""
echo "[4/4] 完成！"
echo ""
exit 0










