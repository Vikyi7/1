// Vercel Serverless Function 适配
// 这个文件用于 Vercel 部署，将 Express 应用导出为 serverless function

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 数据存储文件 - 使用 /tmp 目录（Vercel 的临时目录）
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FRIENDS_FILE = path.join(DATA_DIR, 'friends.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

// 确保数据目录存在
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

ensureDataDir();

// 初始化数据文件
const initDataFile = (filePath, defaultValue = {}) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
};

initDataFile(USERS_FILE, {});
initDataFile(FRIENDS_FILE, {});
initDataFile(MESSAGES_FILE, {});
initDataFile(REQUESTS_FILE, []);

// 读取数据
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件失败 ${filePath}:`, error);
    return {};
  }
};

// 写入数据
const writeData = (filePath, data) => {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`写入文件失败 ${filePath}:`, error);
    return false;
  }
};

// 用户认证
const authenticate = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: '未授权' });
  }
  req.userId = userId;
  next();
};

// API 路由

// 注册用户
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  const users = readData(USERS_FILE);
  
  if (users[email.toLowerCase()]) {
    return res.status(400).json({ error: '该邮箱已被注册' });
  }

  const userId = Date.now().toString();
  users[email.toLowerCase()] = {
    id: userId,
    email: email.toLowerCase(),
    name: name.trim(),
    password, // 实际应该加密
    createdAt: Date.now()
  };

  writeData(USERS_FILE, users);
  
  res.json({
    success: true,
    user: {
      id: userId,
      email: email.toLowerCase(),
      name: name.trim()
    }
  });
});

// 登录
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = readData(USERS_FILE);
  const user = users[email?.toLowerCase()];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: '邮箱或密码错误' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// 搜索用户
app.get('/api/users/search', authenticate, (req, res) => {
  const { q } = req.query;
  const users = readData(USERS_FILE);
  
  const results = Object.values(users)
    .filter(user => 
      user.id !== req.userId &&
      (user.email.toLowerCase().includes(q?.toLowerCase() || '') ||
       user.name.toLowerCase().includes(q?.toLowerCase() || ''))
    )
    .map(user => ({
      id: user.id,
      email: user.email,
      name: user.name
    }));

  res.json({ users: results });
});

// 获取用户信息
app.get('/api/users/:userId', authenticate, (req, res) => {
  const { userId } = req.params;
  const users = readData(USERS_FILE);
  
  const user = Object.values(users).find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// 获取好友列表
app.get('/api/friends', authenticate, (req, res) => {
  const friends = readData(FRIENDS_FILE);
  const userFriends = friends[req.userId] || [];
  res.json({ friends: userFriends });
});

// 发送好友申请
app.post('/api/friends/request', authenticate, (req, res) => {
  const { toUserId } = req.body;
  const users = readData(USERS_FILE);
  const requests = readData(REQUESTS_FILE);
  const friends = readData(FRIENDS_FILE);

  if (!toUserId || toUserId === req.userId) {
    return res.status(400).json({ error: '无效的用户ID' });
  }

  const toUser = Object.values(users).find(u => u.id === toUserId);
  if (!toUser) {
    return res.status(404).json({ error: '用户不存在' });
  }

  const userFriends = friends[req.userId] || [];
  if (userFriends.some(f => f.id === toUserId && f.status === 'accepted')) {
    return res.status(400).json({ error: '已是好友' });
  }

  const exists = requests.some(r =>
    r.status === 'pending' &&
    ((r.fromUserId === req.userId && r.toUserId === toUserId) ||
     (r.fromUserId === toUserId && r.toUserId === req.userId))
  );

  if (exists) {
    return res.status(400).json({ error: '申请已发送或对方申请中' });
  }

  const request = {
    id: Date.now().toString(),
    fromUserId: req.userId,
    fromName: users[Object.keys(users).find(k => users[k].id === req.userId)]?.name || '未知',
    toUserId: toUserId,
    toName: toUser.name,
    status: 'pending',
    createdAt: Date.now()
  };

  requests.push(request);
  writeData(REQUESTS_FILE, requests);

  if (!friends[req.userId]) friends[req.userId] = [];
  if (!friends[req.userId].some(f => f.id === toUserId)) {
    friends[req.userId].push({
      id: toUserId,
      name: toUser.name,
      unreadCount: 0,
      status: 'pending'
    });
  }
  writeData(FRIENDS_FILE, friends);

  res.json({ success: true, request });
});

// 通过好友申请
app.post('/api/friends/approve', authenticate, (req, res) => {
  const { requestId } = req.body;
  const requests = readData(REQUESTS_FILE);
  const friends = readData(FRIENDS_FILE);
  const users = readData(USERS_FILE);

  const request = requests.find(r => r.id === requestId);
  if (!request || request.toUserId !== req.userId) {
    return res.status(404).json({ error: '申请不存在' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ error: '申请已处理' });
  }

  request.status = 'accepted';
  writeData(REQUESTS_FILE, requests);

  const fromUser = Object.values(users).find(u => u.id === request.fromUserId);
  const toUser = Object.values(users).find(u => u.id === request.toUserId);

  if (!friends[request.fromUserId]) friends[request.fromUserId] = [];
  if (!friends[request.toUserId]) friends[request.toUserId] = [];

  const fromFriend = friends[request.fromUserId].find(f => f.id === request.toUserId);
  if (fromFriend) {
    fromFriend.status = 'accepted';
  } else {
    friends[request.fromUserId].push({
      id: request.toUserId,
      name: toUser?.name || '未知',
      unreadCount: 0,
      status: 'accepted'
    });
  }

  if (!friends[request.toUserId].some(f => f.id === request.fromUserId)) {
    friends[request.toUserId].push({
      id: request.fromUserId,
      name: fromUser?.name || '未知',
      unreadCount: 0,
      status: 'accepted'
    });
  } else {
    const toFriend = friends[request.toUserId].find(f => f.id === request.fromUserId);
    if (toFriend) toFriend.status = 'accepted';
  }

  writeData(FRIENDS_FILE, friends);

  res.json({ success: true });
});

// 获取收到的申请
app.get('/api/friends/requests/incoming', authenticate, (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const incoming = requests.filter(r => r.toUserId === req.userId && r.status === 'pending');
  res.json({ requests: incoming });
});

// 获取消息
app.get('/api/messages/:friendId', authenticate, (req, res) => {
  const { friendId } = req.params;
  const messages = readData(MESSAGES_FILE);
  const conversationKey = [req.userId, friendId].sort().join('_');
  const conversationMessages = (messages[conversationKey] || [])
    .filter(m => 
      (m.senderId === req.userId && m.receiverId === friendId) ||
      (m.senderId === friendId && m.receiverId === req.userId)
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  res.json({ messages: conversationMessages });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 导出为 Vercel serverless function
export default app;

