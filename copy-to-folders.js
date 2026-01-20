const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'dist');
const websiteDir = path.join(__dirname, '网站');

// 复制目录函数
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 复制构建产物到网站文件夹
console.log('正在复制构建产物到网站文件夹...');
if (fs.existsSync(websiteDir)) {
  fs.rmSync(websiteDir, { recursive: true, force: true });
}
copyDir(sourceDir, websiteDir);
console.log('复制完成！');


