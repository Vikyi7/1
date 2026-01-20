# 缘心福消息服务器

## 功能特性

- ✅ RESTful API 接口
- ✅ WebSocket 实时通信
- ✅ 用户注册/登录
- ✅ 好友申请/通过
- ✅ 实时消息发送/接收
- ✅ 消息撤回（2分钟内）
- ✅ 消息删除
- ✅ 未读消息计数

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

### 3. 开发模式（自动重启）

```bash
npm run dev
```

## API 接口

### 用户相关

- `POST /api/register` - 注册用户
- `POST /api/login` - 登录
- `GET /api/users/search?q=关键词` - 搜索用户

### 好友相关

- `GET /api/friends` - 获取好友列表
- `POST /api/friends/request` - 发送好友申请
- `POST /api/friends/approve` - 通过好友申请
- `GET /api/friends/requests/incoming` - 获取收到的申请

### 消息相关

- `GET /api/messages/:friendId` - 获取聊天记录

## WebSocket 事件

### 客户端发送

- `login` - 用户登录
- `send_message` - 发送消息
- `revoke_message` - 撤回消息
- `delete_message` - 删除消息
- `mark_read` - 标记已读

### 服务器推送

- `new_message` - 新消息
- `message_sent` - 消息发送确认
- `message_revoked` - 消息已撤回
- `message_deleted` - 消息已删除
- `friend_request` - 收到好友申请
- `friend_approved` - 好友申请已通过
- `friend_updated` - 好友信息更新
- `read_updated` - 已读状态更新

## 数据存储

数据存储在 `server/data/` 目录下的 JSON 文件中：
- `users.json` - 用户数据
- `friends.json` - 好友关系
- `messages.json` - 聊天消息
- `requests.json` - 好友申请

## 环境变量

- `PORT` - 服务器端口（默认 3000）

