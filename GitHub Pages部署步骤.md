# GitHub Pages 部署步骤 - 详细指南

## 📝 在 GitHub Dashboard 上操作

### 第一步：创建新仓库

1. **点击左侧的 "Create repository" 按钮**（绿色按钮）
   - 就在左侧边栏 "Create your first project" 区域

2. **填写仓库信息**
   - **Repository name**：输入仓库名称，如 `yixin-app`
   - **Description**（可选）：输入描述，如 "一心应用"
   - **选择 Public**（必须选择 Public，GitHub Pages 免费版只支持公开仓库）
   - **不要勾选** "Add a README file"（因为我们已经有文件了）
   - **不要勾选** "Add .gitignore" 和 "Choose a license"

3. **点击绿色的 "Create repository" 按钮**

---

### 第二步：上传 dist 文件夹内容

创建仓库后，会进入仓库页面。按以下步骤操作：

#### 方法A：使用网页上传（最简单）

1. **点击 "uploading an existing file" 链接**
   - 在仓库页面中间，会看到这个选项

2. **上传文件**
   - 打开 `F:\06\dist` 文件夹
   - **全选所有文件**（Ctrl+A）
   - **拖拽到浏览器页面**，或点击 "choose your files" 选择文件
   - 上传的文件包括：
     - index.html
     - manifest.webmanifest
     - vite.svg
     - assets 文件夹（包含所有 JS 和 CSS）
     - 其他所有文件

3. **提交**
   - 在页面底部，输入提交信息（如："Initial commit"）
   - 点击绿色的 "Commit changes" 按钮

#### 方法B：使用 Git 命令行（推荐，但需要安装 Git）

如果你已经安装了 Git，可以使用命令行：

```bash
cd dist
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/yixin-app.git
git push -u origin main
```

---

### 第三步：启用 GitHub Pages

1. **进入仓库设置**
   - 在仓库页面，点击顶部的 **"Settings"** 标签

2. **找到 Pages 选项**
   - 在左侧菜单中，向下滚动找到 **"Pages"** 选项
   - 点击进入

3. **配置 Pages**
   - **Source**：选择 **"Deploy from a branch"**
   - **Branch**：选择 **"main"**（或 "master"）
   - **Folder**：选择 **"/ (root)"**
   - 点击 **"Save"** 按钮

4. **等待部署**
   - 等待几分钟（通常 1-3 分钟）
   - 页面会显示你的网址，格式：`https://你的用户名.github.io/yixin-app/`

---

### 第四步：访问应用

1. **复制网址**
   - 在 Settings → Pages 页面，会显示你的网址
   - 格式：`https://你的用户名.github.io/yixin-app/`

2. **访问测试**
   - 在浏览器中打开这个网址
   - 确认可以正常显示"一心"应用

3. **手机安装**
   - iPhone：Safari → 分享 → 添加到主屏幕
   - Android：Chrome → 安装应用

---

## ⚠️ 重要提示

### 路径问题

GitHub Pages 默认部署在子路径下（如 `/yixin-app/`），需要修改配置：

1. **修改 vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/yixin-app/',  // 改为你的仓库名称
     // ... 其他配置
   })
   ```

2. **重新构建**
   ```bash
   npm run build
   ```

3. **重新上传 dist 文件夹内容**

### 或者使用根路径

如果你想使用根路径（`https://你的用户名.github.io/`），需要：

1. **创建特殊仓库**
   - 仓库名称必须是：`你的用户名.github.io`
   - 例如：如果用户名是 `zhangsan`，仓库名必须是 `zhangsan.github.io`

2. **这样网址就是**：`https://你的用户名.github.io/`（没有子路径）

---

## 🎯 快速检查清单

- [ ] 创建了仓库（Public）
- [ ] 上传了 dist 文件夹的所有内容
- [ ] 在 Settings → Pages 中启用了 Pages
- [ ] 等待了几分钟让部署完成
- [ ] 获得了网址并测试访问

---

## 💡 小贴士

1. **更新应用**
   - 修改代码后，运行 `npm run build`
   - 重新上传 dist 文件夹内容到 GitHub
   - 会自动更新

2. **自定义域名**（可选）
   - 在 Settings → Pages 中可以绑定自己的域名

3. **查看部署状态**
   - 在仓库的 "Actions" 标签可以查看部署状态

---

## ✅ 完成！

现在你的应用已经：
- ✅ 部署到 GitHub Pages
- ✅ 获得免费网址
- ✅ 可以在手机上安装

享受你的应用吧！🎉
