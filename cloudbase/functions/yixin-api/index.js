/**
 * CloudBase 云函数（HTTP 访问服务）入口
 * 目标：提供最小可用的 REST API，兼容前端现有调用路径：
 * - GET  /api/health
 * - POST /api/register
 * - POST /api/login
 * - GET  /api/users/search
 * - GET  /api/users/:userId
 * - GET  /api/friends
 * - POST /api/friends/request
 * - POST /api/friends/approve
 * - GET  /api/friends/requests/incoming
 * - GET  /api/messages/:friendId
 *
 * 注意：
 * - CloudBase 云函数是无状态的；这里用内存/临时存储不可靠。
 * - 为了“免费 + 国内稳定”，建议把数据改到 CloudBase 文档型数据库。
 * - 本文件先提供 /api/health（用于验证部署与域名可达），其余接口先返回 501 提示你下一步开库。
 */

const json = (statusCode, bodyObj) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': '*',
  },
  body: JSON.stringify(bodyObj),
})

const text = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'text/plain; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': '*',
  },
  body,
})

const parseJsonBody = (event) => {
  if (!event?.body) return {}
  try {
    return typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  } catch {
    return null
  }
}

export async function main(event) {
  // 兼容不同触发器字段
  const method = (event.httpMethod || event.method || 'GET').toUpperCase()
  const rawPath = event.path || event.requestPath || '/'

  // 预检
  if (method === 'OPTIONS') {
    return text(204, '')
  }

  // 根路径：用于快速验证“域名可达”
  if (rawPath === '/' && method === 'GET') {
    return text(200, 'OK')
  }

  // 健康检查：用于快速验证“API 可达”
  if (rawPath === '/api/health' && method === 'GET') {
    return json(200, { status: 'ok', timestamp: Date.now() })
  }

  // 其他接口：先提示需要把存储迁移到 CloudBase 数据库（下一步我带你做）
  if (rawPath.startsWith('/api/')) {
    return json(501, {
      error:
        '后端已部署成功（/api/health 正常）。下一步需要在 CloudBase 开通“文档型数据库”，并把用户/好友/消息存储迁移到数据库后才能用登录/聊天功能。',
      next: [
        'CloudBase 控制台左侧：文档型数据库 → 开通',
        '然后我会给你一键替换后的云函数版本（含完整接口）',
      ],
    })
  }

  return json(404, { error: 'Not Found', path: rawPath })
}


