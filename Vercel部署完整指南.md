# Vercel 部署完整指南

## 🚀 使用 Vercel 部署"一心"应用

### 为什么选择 Vercel？
- ✅ 全球 CDN，访问速度快
- ✅ 自动 HTTPS
- ✅ 自动部署（连接 GitHub 后）
- ✅ 免费额度充足
- ✅ 专业稳定

---

## 第一步：登录 Vercel

### 方法一：命令行登录（推荐）

1. **打开命令行**
   - 按 `Win + R`
   - 输入 `cmd`，按回车

2. **进入项目目录**
   ```bash
   cd F:\06
   ```

3. **登录 Vercel**
   ```bash
   vercel login
   ```
   
   - 会打开浏览器
   - 选择登录方式：
     - **Continue with GitHub**（如果有 GitHub 账号，推荐）
     - **Continue with Email**（使用邮箱注册/登录）
   - 完成登录后，回到命令行

### 方法二：网页登录

1. 访问：https://vercel.com
2. 注册/登录账号
3. 然后回到命令行使用 `vercel` 命令

---

## 第二步：部署应用

### 首次部署

在命令行中运行：
```bash
vercel --prod
```

**按提示操作**：

1. **Set up and deploy?** 
   - 直接按回车（选择 Yes）

2. **Which scope?**
   - 直接按回车（使用你的账号）

3. **Link to existing project?**
   - 输入 `N` 然后按回车（创建新项目）

4. **What's your project's name?**
   - 直接按回车（使用默认名称，如 `yixin`）
   - 或输入自定义名称

5. **In which directory is your code located?**
   - 输入 `./` 然后按回车（当前目录）

6. **Want to override the settings?**
   - 输入 `N` 然后按回车（使用默认设置）

**等待部署完成**（约1-2分钟）

### 部署完成后

你会看到类似这样的信息：
```
✅ Production: https://yixin-abc123.vercel.app
```

**这就是你的应用网址！** 复制它。

---

## 第三步：手机安装

### iPhone/iPad

1. 用 **Safari** 打开你的网址
2. 点击底部的**分享按钮**
3. 选择 **"添加到主屏幕"**
4. 点击 **"添加"**
5. ✅ 完成！

### Android

1. 用 **Chrome** 打开你的网址
2. 点击 **"安装应用"** 提示
3. ✅ 完成！

---

## 后续更新部署

当你修改代码后，重新部署：

1. **构建应用**
   ```bash
   npm run build
   ```

2. **部署**
   ```bash
   vercel --prod
   ```

3. **完成！**
   - 会自动更新到同一个网址
   - 用户下次打开时会自动更新

---

## 连接 GitHub（可选，推荐）

连接 GitHub 后，每次推送代码会自动部署：

1. **在 Vercel 网页中**
   - 访问：https://vercel.com/dashboard
   - 点击项目
   - 进入 Settings → Git
   - 连接 GitHub 仓库

2. **自动部署**
   - 每次 `git push` 后自动部署
   - 无需手动运行命令

---

## 常见问题

### 问题1：登录失败
**解决**：
- 确保网络连接正常
- 在浏览器中手动访问 https://vercel.com 注册账号
- 然后回到命令行运行 `vercel login`

### 问题2：部署失败
**解决**：
- 确保已运行 `npm run build`
- 确保 `dist` 文件夹存在
- 检查网络连接

### 问题3：找不到项目
**解决**：
- 运行 `vercel link` 链接到现有项目
- 或运行 `vercel --prod` 创建新项目

### 问题4：网址无法访问
**解决**：
- 等待几分钟（DNS 传播需要时间）
- 清除浏览器缓存
- 检查部署状态：https://vercel.com/dashboard

---

## 查看部署状态

访问：https://vercel.com/dashboard

可以查看：
- ✅ 所有部署记录
- ✅ 部署日志
- ✅ 访问统计
- ✅ 域名设置

---

## 完成！

现在你的应用已经：
- ✅ 部署到 Vercel
- ✅ 获得全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 可以在手机上安装

享受你的应用吧！🎉
