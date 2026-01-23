// 轮询版本的 ChatContext（用于不支持 WebSocket 的环境，如 Vercel）
// 使用方法：将 ChatContext.tsx 重命名为 ChatContext.original.tsx
// 然后将此文件重命名为 ChatContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
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
  requests: FriendRequest[]
  incomingRequests: FriendRequest[]
  outgoingRequests: FriendRequest[]
  sendFriendRequest: (from: { id: string; name: string }, to: { id: string; name: string }) => Promise<{ success: boolean; error?: string }>
  approveFriendRequest: (requestId: string, currentUserId: string) => Promise<{ success: boolean; error?: string }>
  isConnected: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>([])
  const [messages, setMessages] = useState<{ [friendId: string]: Message[] }>({})
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [isConnected] = useState(true) // 轮询模式下始终为 true
  const currentUserIdRef = useRef<string | null>(null)
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 监听用户登录事件
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      const userData = event.detail
      currentUserIdRef.current = userData.id
      loadFriends(userData.id)
      loadIncomingRequests(userData.id)
    }

    const handleUserLogout = () => {
      currentUserIdRef.current = null
      setFriends([])
      setMessages({})
      setRequests([])
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }

    window.addEventListener('user_logged_in', handleUserLogin as EventListener)
    window.addEventListener('user_logged_out', handleUserLogout)

    return () => {
      window.removeEventListener('user_logged_in', handleUserLogin as EventListener)
      window.removeEventListener('user_logged_out', handleUserLogout)
    }
  }, [])

  // 加载好友列表
  const loadFriends = async (userId: string) => {
    try {
      const result = await apiService.getFriends(userId)
      setFriends(result.friends || [])
    } catch (error) {
      console.error('加载好友列表失败:', error)
    }
  }

  // 加载收到的申请
  const loadIncomingRequests = async (userId: string) => {
    try {
      const result = await apiService.getIncomingRequests(userId)
      setRequests(result.requests || [])
    } catch (error) {
      console.error('加载好友申请失败:', error)
    }
  }

  // 加载消息（轮询）
  const loadMessages = async (friendId: string) => {
    if (!currentUserIdRef.current) return
    
    try {
      const result = await apiService.getMessages(currentUserIdRef.current, friendId)
      setMessages(prev => ({
        ...prev,
        [friendId]: result.messages || []
      }))
    } catch (error) {
      console.error('加载消息失败:', error)
    }
  }

  // 轮询当前聊天消息
  useEffect(() => {
    if (!currentChatId || !currentUserIdRef.current) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      return
    }

    // 立即加载一次
    loadMessages(currentChatId)

    // 每 2 秒轮询一次
    pollingIntervalRef.current = setInterval(() => {
      loadMessages(currentChatId)
      loadFriends(currentUserIdRef.current!)
    }, 2000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [currentChatId])

  // 定期刷新好友列表和申请
  useEffect(() => {
    if (!currentUserIdRef.current) return

    const interval = setInterval(() => {
      loadFriends(currentUserIdRef.current!)
      loadIncomingRequests(currentUserIdRef.current!)
    }, 5000) // 每 5 秒刷新一次

    return () => clearInterval(interval)
  }, [])

  // 发送消息
  const sendMessage = async (friendId: string, content: string) => {
    if (!currentUserIdRef.current) return

    // 创建临时消息（乐观更新）
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserIdRef.current,
      receiverId: friendId,
      content,
      timestamp: Date.now(),
      type: 'text'
    }

    setMessages(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), tempMessage]
    }))

    try {
      // 通过 API 发送消息（需要后端支持）
      // 注意：轮询模式下，消息会通过轮询自动更新
      // 这里可以调用一个发送消息的 API 端点
      
      // 立即刷新消息列表
      setTimeout(() => {
        loadMessages(friendId)
      }, 500)
    } catch (error) {
      console.error('发送消息失败:', error)
      // 移除临时消息
      setMessages(prev => ({
        ...prev,
        [friendId]: (prev[friendId] || []).filter(m => m.id !== tempMessage.id)
      }))
    }
  }

  // 删除消息
  const deleteMessage = (friendId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [friendId]: (prev[friendId] || []).filter(m => m.id !== messageId)
    }))
    // 立即刷新
    if (currentUserIdRef.current) {
      setTimeout(() => loadMessages(friendId), 500)
    }
  }

  // 撤回消息
  const revokeMessage = (friendId: string, messageId: string) => {
    const message = messages[friendId]?.find(m => m.id === messageId)
    if (!message || message.senderId !== currentUserIdRef.current) {
      return { success: false, error: '只能撤回自己的消息' }
    }

    const timeDiff = Date.now() - message.timestamp
    if (timeDiff > 2 * 60 * 1000) {
      return { success: false, error: '超过2分钟，无法撤回' }
    }

    setMessages(prev => ({
      ...prev,
      [friendId]: (prev[friendId] || []).map(m =>
        m.id === messageId ? { ...m, isRevoked: true, content: '' } : m
      )
    }))

    return { success: true }
  }

  // 添加好友
  const addFriend = async (friend: { id: string; name: string }, options?: { selfId?: string }) => {
    const userId = options?.selfId || currentUserIdRef.current
    if (!userId) {
      return { success: false, error: '未登录' }
    }

    try {
      const result = await apiService.sendFriendRequest(userId, friend.id)
      if (result.success) {
        await loadFriends(userId)
        return { success: true }
      }
      return { success: false, error: result.error || '添加好友失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '添加好友失败' }
    }
  }

  // 获取消息
  const getMessages = (friendId: string): Message[] => {
    return messages[friendId] || []
  }

  // 发送好友申请
  const sendFriendRequest = async (from: { id: string; name: string }, to: { id: string; name: string }) => {
    try {
      const result = await apiService.sendFriendRequest(from.id, to.id)
      if (result.success) {
        await loadFriends(from.id)
        return { success: true }
      }
      return { success: false, error: result.error || '发送申请失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '发送申请失败' }
    }
  }

  // 通过好友申请
  const approveFriendRequest = async (requestId: string, currentUserId: string) => {
    try {
      const result = await apiService.approveFriendRequest(currentUserId, requestId)
      if (result.success) {
        await loadFriends(currentUserId)
        await loadIncomingRequests(currentUserId)
        return { success: true }
      }
      return { success: false, error: result.error || '通过申请失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '通过申请失败' }
    }
  }

  const incomingRequests = requests.filter(r => r.toUserId === currentUserIdRef.current && r.status === 'pending')
  const outgoingRequests = requests.filter(r => r.fromUserId === currentUserIdRef.current && r.status === 'pending')

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
        incomingRequests,
        outgoingRequests,
        sendFriendRequest,
        approveFriendRequest,
        isConnected
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

