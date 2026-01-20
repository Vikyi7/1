/**
 * 消息调试组件
 * 用于诊断消息显示问题
 * 开发环境使用，生产环境可移除
 */
import { useAuth } from '../contexts/AuthContext'
import { useChat } from '../contexts/ChatContext'
import { Message } from '../services/api'

export const MessageDebugger = () => {
  const { user } = useAuth()
  const { currentChatId, getMessages } = useChat()
  
  if (import.meta.env.PROD) {
    return null // 生产环境不显示
  }

  const messages = currentChatId ? getMessages(currentChatId) : []

  return (
    <div className="fixed bottom-20 right-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs z-50">
      <div className="font-bold mb-2">🐛 消息调试</div>
      <div className="space-y-1">
        <div>当前用户ID: <code className="bg-white/20 px-1 rounded">{user?.id || '未登录'}</code></div>
        <div>当前会话: <code className="bg-white/20 px-1 rounded">{currentChatId || '无'}</code></div>
        <div>消息数量: {messages.length}</div>
        <div className="mt-2 max-h-32 overflow-y-auto">
          {messages.slice(-3).map((msg: Message) => {
            const isMe = user ? msg.senderId === user.id : false
            return (
              <div key={msg.id} className="mb-1 border-b border-white/20 pb-1">
                <div className="text-yellow-300">ID: {msg.id.slice(-6)}</div>
                <div>senderId: <code className="bg-white/20 px-1">{msg.senderId}</code></div>
                <div className={isMe ? 'text-green-300' : 'text-red-300'}>
                  {isMe ? '✅ 我的消息' : '❌ 对方消息'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

