# -*- coding: utf-8 -*-
import os
import shutil

# 复制目录函数
def copy_dir(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
    print(f'已复制 {src} 到 {dest}')

# 获取当前目录
base_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(base_dir, 'dist')
website_dir = os.path.join(base_dir, '网站')

# 复制构建产物到网站文件夹
if os.path.exists(dist_dir):
    print('正在复制构建产物到网站文件夹...')
    copy_dir(dist_dir, website_dir)
    print('复制完成！')
else:
    print(f'错误：找不到 {dist_dir} 目录')


