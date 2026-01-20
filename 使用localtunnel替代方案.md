# 🔄 使用 localtunnel 替代方案

如果 ngrok 持续无法连接，可以使用 **localtunnel**（更简单，无需注册）

## ✅ 优势

- ✅ 无需注册账号
- ✅ 无需配置 authtoken
- ✅ 安装简单
- ✅ 连接稳定

## 🚀 快速开始

### 1. 安装 localtunnel（如果还没安装）

```bash
npm install -g localtunnel
```

### 2. 启动前端穿透

```bash
lt --port 5175
```

会显示类似：
```
your url is: https://xxx.loca.lt
```

### 3. 启动后端穿透（新窗口）

```bash
lt --port 3000
```

会显示类似：
```
your url is: https://yyy.loca.lt
```

### 4. 配置后端地址

1. **复制后端地址**（如：`https://yyy.loca.lt`）
2. **更新 .env 文件**：
   ```
   VITE_API_URL=https://yyy.loca.lt
   ```
3. **重启前端服务器**

### 5. 在手机浏览器中打开

打开前端地址（如：`https://xxx.loca.lt`）

## 📝 完整命令

**窗口1 - 前端穿透：**
```bash
lt --port 5175 --print-requests
```

**窗口2 - 后端穿透：**
```bash
lt --port 3000 --print-requests
```

**窗口3 - 前端服务器（如果还没运行）：**
```bash
npm run dev
```

## ⚠️ 注意事项

1. **地址会变化**：每次重启 localtunnel，地址可能会变化
2. **需要更新配置**：如果后端地址变化，需要更新 `.env` 文件并重启前端
3. **保持运行**：需要保持电脑运行，关闭后手机无法访问

## 🎯 推荐使用

如果 ngrok 有问题，**localtunnel 是更好的选择**，因为：
- 更简单
- 无需配置
- 连接更稳定

现在就试试 localtunnel 吧！
