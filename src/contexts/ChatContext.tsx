import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { apiService, type Message, type Friend, type FriendRequest } from '../services/api'

interface ChatContextType {
  friends: Friend[]
  messages: { [friendId: string]: Message[] }
  currentChatId: string | null
  setCurrentChatId: (id: string | null) => void
  sendMessage: (friendId: string, content: string) => void
  deleteMessage: (friendId: string, messageId: string) => void
  revokeMessage: (friendId: string, messageId: string) => { success: boolean; error?: string }
  addFriend: (friend: { id: string; name: string }, options?: { selfId?: string }) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string }
  getMessages: (friendId: string) => Message[]
  // 好友申请
  requests: FriendRequest[]
  incomingRequests: FriendRequest[]
  outgoingRequests: FriendRequest[]
  sendFriendRequest: (from: { id: string; name: string }, to: { id: string; name: string }) => Promise<{ success: boolean; error?: string }>
  approveFriendRequest: (requestId: string, currentUserId: string) => Promise<{ success: boolean; error?: string }>
  isConnected: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  if (apiUrl.startsWith('https://')) {
    return apiUrl.replace('https://', 'wss://')
  }
  return apiUrl.replace('http://', 'ws://')
}
const SOCKET_URL = getSocketUrl()

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>([])
  const [messages, setMessages] = useState<{ [friendId: string]: Message[] }>({})
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const currentUserIdRef = useRef<string | null>(null)

  // 初始化 WebSocket 连接
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  // 连接 WebSocket（当用户登录时）
  const connectSocket = (userId: string) => {
    if (socketRef.current?.connected) {
      return
    }

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('WebSocket 已连接')
      setIsConnected(true)
      socket.emit('login', userId)
      currentUserIdRef.current = userId
    })

    socket.on('disconnect', () => {
      console.log('WebSocket 已断开')
      setIsConnected(false)
    })

    socket.on('new_message', (message: Message) => {
      console.log('收到新消息:', message)
      setMessages(prev => {
        const friendId = message.senderId === userId ? message.receiverId : message.senderId
        const conversationKey = friendId
        const existing = prev[conversationKey] || []
        
        // 避免重复添加
        if (existing.some(m => m.id === message.id)) {
          return prev
        }

        return {
          ...prev,
          [conversationKey]: [...existing, message].sort((a, b) => a.timestamp - b.timestamp)
        }
      })
    })

    socket.on('message_sent', (message: Message) => {
      console.log('消息发送确认:', message)
      setMessages(prev => {
        const friendId = message.receiverId
        const conversationKey = friendId
        const existing = prev[conversationKey] || []
        
        if (existing.some(m => m.id === message.id)) {
          return prev
        }

        return {
          ...prev,
          [conversationKey]: [...existing, message].sort((a, b) => a.timestamp - b.timestamp)
        }
      })
    })

    socket.on('message_revoked', ({ messageId, friendId }: { messageId: string; friendId: string }) => {
      console.log('消息已撤回:', messageId)
      setMessages(prev => {
        const conversationKey = friendId
        const existing = prev[conversationKey] || []
        return {
          ...prev,
          [conversationKey]: existing.map(m =>
            m.id === messageId ? { ...m, isRevoked: true, content: '' } : m
          )
        }
      })
    })

    socket.on('message_deleted', ({ messageId, friendId }: { messageId: string; friendId: string }) => {
      console.log('消息已删除:', messageId)
      setMessages(prev => {
        const conversationKey = friendId
        return {
          ...prev,
          [conversationKey]: (prev[conversationKey] || []).filter(m => m.id !== messageId)
        }
      })
    })

    socket.on('friend_request', (request: FriendRequest) => {
      console.log('收到好友申请:', request)
      setRequests(prev => {
        if (prev.some(r => r.id === request.id)) {
          return prev
        }
        return [...prev, request]
      })
    })

    socket.on('friend_approved', ({ friendId }: { friendId: string; friendName: string }) => {
      console.log('好友申请已通过:', friendId)
      setFriends(prev =>
        prev.map(f =>
          f.id === friendId ? { ...f, status: 'accepted' as const } : f
        )
      )
    })

    socket.on('friend_updated', (update: {
      friendId: string
      lastMessage?: string
      lastMessageTime?: number
      unreadCount?: number
    }) => {
      console.log('好友信息更新:', update)
      setFriends(prev =>
        prev.map(f =>
          f.id === update.friendId
            ? {
                ...f,
                lastMessage: update.lastMessage ?? f.lastMessage,
                lastMessageTime: update.lastMessageTime ?? f.lastMessageTime,
                unreadCount: update.unreadCount ?? f.unreadCount,
              }
            : f
        )
      )
    })

    socket.on('read_updated', ({ friendId, unreadCount }: { friendId: string; unreadCount: number }) => {
      setFriends(prev =>
        prev.map(f => (f.id === friendId ? { ...f, unreadCount } : f))
      )
    })

    socket.on('error', ({ message }: { message: string }) => {
      console.error('WebSocket 错误:', message)
    })

    socketRef.current = socket
  }

  // 从服务器加载好友列表
  const loadFriends = async (userId: string) => {
    try {
      const data = await apiService.getFriends(userId)
      setFriends(data.friends || [])
    } catch (error) {
      console.error('加载好友列表失败:', error)
    }
  }

  // 从服务器加载消息
  const loadMessages = async (userId: string, friendId: string) => {
    try {
      const data = await apiService.getMessages(userId, friendId)
      setMessages(prev => ({
        ...prev,
        [friendId]: data.messages || []
      }))
    } catch (error) {
      console.error('加载消息失败:', error)
    }
  }

  // 从服务器加载好友申请
  const loadRequests = async (userId: string) => {
    try {
      const data = await apiService.getIncomingRequests(userId)
      setRequests(data.requests || [])
    } catch (error) {
      console.error('加载好友申请失败:', error)
    }
  }

  // 当用户登录时，初始化数据
  const initializeForUser = async (userId: string) => {
    currentUserIdRef.current = userId
    connectSocket(userId)
    await Promise.all([
      loadFriends(userId),
      loadRequests(userId),
    ])
  }

  // 监听用户登录/登出事件
  useEffect(() => {
    // 从 localStorage 获取当前用户
    const stored = localStorage.getItem('puyuan_auth')
    if (stored) {
      try {
        const userData = JSON.parse(stored)
        if (userData.id) {
          initializeForUser(userData.id)
        }
      } catch (error) {
        console.error('初始化用户失败:', error)
      }
    }

    // 监听登录事件
    const handleLogin = (event: CustomEvent) => {
      const userData = event.detail
      if (userData?.id) {
        initializeForUser(userData.id)
      }
    }

    // 监听登出事件
    const handleLogout = () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setFriends([])
      setMessages({})
      setRequests([])
      currentUserIdRef.current = null
      setIsConnected(false)
    }

    window.addEventListener('user_logged_in', handleLogin as EventListener)
    window.addEventListener('user_logged_out', handleLogout)

    return () => {
      window.removeEventListener('user_logged_in', handleLogin as EventListener)
      window.removeEventListener('user_logged_out', handleLogout)
    }
  }, [])

  // 发送消息
  const sendMessage = (friendId: string, content: string) => {
    if (!content.trim() || !socketRef.current?.connected || !currentUserIdRef.current) {
      console.error('无法发送消息: WebSocket 未连接或用户未登录')
      return
    }

    const targetFriend = friends.find(f => f.id === friendId)
    if (!targetFriend || (targetFriend.status && targetFriend.status !== 'accepted')) {
      console.error('无法发送消息: 不是好友或申请未通过')
      return
    }

    socketRef.current.emit('send_message', {
      friendId,
      content: content.trim(),
      senderId: currentUserIdRef.current,
    })
  }

  // 删除消息
  const deleteMessage = (friendId: string, messageId: string) => {
    if (!socketRef.current?.connected || !currentUserIdRef.current) {
      return
    }

    socketRef.current.emit('delete_message', {
      messageId,
      friendId,
      userId: currentUserIdRef.current,
    })

    // 立即更新本地状态
    setMessages(prev => {
      const conversationKey = friendId
      const filtered = (prev[conversationKey] || []).filter(m => m.id !== messageId)
      
      // 更新好友最后消息
      if (filtered.length > 0) {
        const last = filtered[filtered.length - 1]
        setFriends(currentFriends =>
          currentFriends.map(friend => {
            if (friend.id !== friendId) return friend
            return {
              ...friend,
              lastMessage: last.content,
              lastMessageTime: last.timestamp,
            }
          })
        )
      } else {
        setFriends(currentFriends =>
          currentFriends.map(friend => {
            if (friend.id !== friendId) return friend
            return {
              ...friend,
              lastMessage: undefined,
              lastMessageTime: undefined,
            }
          })
        )
      }

      return {
        ...prev,
        [conversationKey]: filtered,
      }
    })
  }

  // 撤回消息
  const revokeMessage = (friendId: string, messageId: string): { success: boolean; error?: string } => {
    if (!socketRef.current?.connected || !currentUserIdRef.current) {
      return { success: false, error: 'WebSocket 未连接' }
    }

    socketRef.current.emit('revoke_message', {
      messageId,
      friendId,
      userId: currentUserIdRef.current,
    })

    return { success: true }
  }

  // 添加好友（已废弃，使用 sendFriendRequest）
  const addFriend = (friend: { id: string; name: string }, options?: { selfId?: string }) => {
    if (options?.selfId) {
      return sendFriendRequest(
        { id: options.selfId, name: '当前用户' },
        { id: friend.id, name: friend.name }
      )
    }
    return { success: false, error: '需要用户ID' }
  }

  // 发送好友申请
  const sendFriendRequest = async (
    from: { id: string; name: string },
    to: { id: string; name: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiService.sendFriendRequest(from.id, to.id)
      if (result.success) {
        // 重新加载好友列表
        await loadFriends(from.id)
        return { success: true }
      }
      return { success: false, error: result.error || '发送申请失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '发送申请失败' }
    }
  }

  // 通过好友申请
  const approveFriendRequest = async (
    requestId: string,
    currentUserId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiService.approveFriendRequest(currentUserId, requestId)
      if (result.success) {
        // 重新加载好友列表和申请列表
        await Promise.all([
          loadFriends(currentUserId),
          loadRequests(currentUserId),
        ])
        return { success: true }
      }
      return { success: false, error: result.error || '处理失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '处理失败' }
    }
  }

  // 获取指定好友的消息
  const getMessages = (friendId: string): Message[] => {
    return messages[friendId] || []
  }

  // 当打开聊天时，加载消息并标记已读
  useEffect(() => {
    if (currentChatId && currentUserIdRef.current) {
      // 加载消息
      loadMessages(currentUserIdRef.current, currentChatId)

      // 标记已读
      if (socketRef.current?.connected) {
        socketRef.current.emit('mark_read', {
          friendId: currentChatId,
          userId: currentUserIdRef.current,
        })
      }

      // 清除未读计数
      setFriends(prev =>
        prev.map(friend =>
          friend.id === currentChatId ? { ...friend, unreadCount: 0 } : friend
        )
      )
    }
  }, [currentChatId])

  return (
    <ChatContext.Provider
      value={{
        friends,
        messages,
        currentChatId,
        setCurrentChatId,
        sendMessage,
        deleteMessage,
        revokeMessage,
        addFriend,
        getMessages,
        requests,
        incomingRequests: requests,
        outgoingRequests: requests,
        sendFriendRequest,
        approveFriendRequest,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
