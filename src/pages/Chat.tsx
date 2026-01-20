import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import { User, Search, Copy, Trash2, RotateCcw } from 'lucide-react'
import ChatIcon from '../components/ChatIcon'
import { MessageDebugger } from '../components/MessageDebugger'

const Chat = () => {
  const navigate = useNavigate()
  const {
    friends,
    currentChatId,
    setCurrentChatId,
    getMessages,
    deleteMessage,
    revokeMessage,
    sendFriendRequest,
    incomingRequests,
    approveFriendRequest,
  } = useChat()
  const { isAuthenticated, user } = useAuth()
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [newFriendName, setNewFriendName] = useState('')
  const [addFriendError, setAddFriendError] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [searching, setSearching] = useState(false)
  const [requestStatuses, setRequestStatuses] = useState<{ [userId: string]: 'idle' | 'sending' | 'sent' | 'already_sent' | 'already_friend' }>({})
  const [contextMenu, setContextMenu] = useState<{
    messageId: string
    x: number
    y: number
  } | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.26,
        ease: [0.22, 0.61, 0.36, 1],
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  }

  // 列表项通用动画（接近 iOS 推入效果）
  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 20,
        mass: 0.9,
      },
    },
  }


  // 搜索用户
  const handleSearchUser = async () => {
    if (!newFriendName.trim()) return

    setAddFriendError('')
    setSearching(true)
    setSearchResults([])

    if (!isAuthenticated || !user) {
      setAddFriendError('请先登录后再搜索')
      setSearching(false)
      return
    }

    try {
      const { apiService } = await import('../services/api')
      const result = await apiService.searchUsers(newFriendName.trim(), user.id)
      
      if (result.users && result.users.length > 0) {
        setSearchResults(result.users)
        // 初始化每个用户的请求状态
        const statuses: { [userId: string]: 'idle' | 'sending' | 'sent' | 'already_sent' | 'already_friend' } = {}
        result.users.forEach((u: { id: string }) => {
          const friend = friends.find(f => f.id === u.id)
          if (friend?.status === 'accepted') {
            statuses[u.id] = 'already_friend'
          } else if (friend?.status === 'pending') {
            statuses[u.id] = 'already_sent'
          } else {
            statuses[u.id] = 'idle'
          }
        })
        setRequestStatuses(statuses)
      } else {
        setAddFriendError('未找到相关用户')
      }
    } catch (error: any) {
      setAddFriendError(error.message || '搜索失败')
    } finally {
      setSearching(false)
    }
  }

  // 发送好友申请
  const handleSendFriendRequest = async (targetUserId: string, targetUserName: string) => {
    if (!isAuthenticated || !user) {
      setAddFriendError('请先登录')
      return
    }

    // 检查状态，防止重复点击
    const currentStatus = requestStatuses[targetUserId]
    if (currentStatus === 'sending' || currentStatus === 'sent' || currentStatus === 'already_friend') {
      return
    }

    // 更新状态为发送中
    setRequestStatuses(prev => ({ ...prev, [targetUserId]: 'sending' }))
    setAddFriendError('')

    try {
      const result = await sendFriendRequest(
        { id: user.id, name: user.name },
        { id: targetUserId, name: targetUserName }
      )

      if (result.success) {
        // 更新状态为已发送
        setRequestStatuses(prev => ({ ...prev, [targetUserId]: 'sent' }))
        // 触发全局事件
        window.dispatchEvent(new CustomEvent('friend_request_sent', {
          detail: { targetUserId }
        }))
      } else {
        // 根据错误信息更新状态
        if (result.error?.includes('已是好友')) {
          setRequestStatuses(prev => ({ ...prev, [targetUserId]: 'already_friend' }))
        } else if (result.error?.includes('申请已发送')) {
          setRequestStatuses(prev => ({ ...prev, [targetUserId]: 'already_sent' }))
        } else {
          setRequestStatuses(prev => ({ ...prev, [targetUserId]: 'idle' }))
          setAddFriendError(result.error || '发送失败')
        }
      }
    } catch (error: any) {
      setRequestStatuses(prev => ({ ...prev, [targetUserId]: 'idle' }))
      setAddFriendError(error.message || '发送失败')
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const currentFriend = friends.find(f => f.id === currentChatId)
  const currentMessages = currentChatId ? getMessages(currentChatId) : []
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (currentChatId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentMessages, currentChatId])

  // 监听标题栏触发的“添加好友”事件
  useEffect(() => {
    const handleOpenAddFriend = () => {
      if (!currentChatId) {
        setShowAddFriend((prev) => {
          const next = !prev
          if (next) {
            // 打开时重置搜索状态
            setSearchResults([])
            setRequestStatuses({})
            setAddFriendError('')
          } else {
            // 关闭时清空输入和结果
            setNewFriendName('')
            setSearchResults([])
            setRequestStatuses({})
            setAddFriendError('')
          }
          return next
        })
      }
    }

    window.addEventListener('open_add_friend_dialog', handleOpenAddFriend)
    return () => {
      window.removeEventListener('open_add_friend_dialog', handleOpenAddFriend)
    }
  }, [currentChatId])

  // 监听好友列表变化，同步更新搜索结果中的状态
  useEffect(() => {
    if (searchResults.length > 0) {
      const updatedStatuses: { [userId: string]: 'idle' | 'sending' | 'sent' | 'already_sent' | 'already_friend' } = {}
      searchResults.forEach((result) => {
        const friend = friends.find(f => f.id === result.id)
        const currentStatus = requestStatuses[result.id]
        
        if (friend?.status === 'accepted') {
          updatedStatuses[result.id] = 'already_friend'
        } else if (friend?.status === 'pending') {
          updatedStatuses[result.id] = 'already_sent'
        } else if (currentStatus === 'sending' || currentStatus === 'sent') {
          // 保持发送中或已发送状态
          updatedStatuses[result.id] = currentStatus
        } else {
          updatedStatuses[result.id] = 'idle'
        }
      })
      setRequestStatuses(prev => ({ ...prev, ...updatedStatuses }))
    }
  }, [friends, searchResults])

  // 处理长按
  const handleLongPress = (messageId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
    setContextMenu({ messageId, x: clientX, y: clientY })
  }

  // 处理右键
  const handleContextMenu = (messageId: string, event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({ messageId, x: event.clientX, y: event.clientY })
  }

  // 开始长按计时
  const handleMouseDown = (messageId: string) => {
    longPressTimer.current = setTimeout(() => {
      // 长按触发（通过事件模拟）
      const fakeEvent = {
        preventDefault: () => {},
        clientX: 0,
        clientY: 0,
      } as React.MouseEvent
      handleLongPress(messageId, fakeEvent)
    }, 500) // 500ms 长按
  }

  // 取消长按
  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  // 复制消息
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setContextMenu(null)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 删除消息
  const handleDelete = (messageId: string) => {
    if (!currentChatId) return
    deleteMessage(currentChatId, messageId)
    setContextMenu(null)
  }

  // 撤回消息
  const handleRevoke = (messageId: string) => {
    if (!currentChatId) return
    const result = revokeMessage(currentChatId, messageId)
    if (!result.success) {
      // 可以显示错误提示
      console.error(result.error)
    }
    setContextMenu(null)
  }

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null)
    }
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu])

  return (
    <div className="min-h-full bg-white dark:bg-[#060606] transition-colors duration-300" style={{ transform: 'translateZ(0)' }}>
      <motion.div
        variants={containerVariants}
        initial={false}
        animate="visible"
        className="h-full flex flex-col"
      >
        {!currentChatId ? (
          // 好友列表
          <div className="flex-1 overflow-y-auto bg-white dark:bg-[#060606]">
            <motion.div
              layout
              transition={{
                layout: {
                  duration: 0.32,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }}
            >
              {/* 添加好友对话框 */}
              <AnimatePresence>
                {showAddFriend && (
                  <>
                    {/* 点击页面空白处收起 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setShowAddFriend(false)
                        setNewFriendName('')
                        setSearchResults([])
                        setRequestStatuses({})
                        setAddFriendError('')
                      }}
                    />
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: -18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -14, scale: 0.98 }}
                      transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 22,
                        mass: 0.9,
                      }}
                      className="relative z-50 mb-4 p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10"
                    >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-black dark:text-white">添加好友</h3>
                      <button
                        onClick={() => {
                          setShowAddFriend(false)
                          setNewFriendName('')
                          setSearchResults([])
                          setRequestStatuses({})
                          setAddFriendError('')
                        }}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black/60 dark:text-white/60"
                      >
                        <motion.span
                          whileHover={{ rotate: 90 }}
                          className="text-lg leading-none"
                        >
                          ×
                        </motion.span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10">
                          <input
                            type="text"
                            value={newFriendName}
                            onChange={(e) => {
                              setNewFriendName(e.target.value)
                              if (addFriendError) setAddFriendError('')
                              setSearchResults([])
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                            placeholder="输入好友邮箱或姓名..."
                            className="flex-1 bg-transparent text-sm md:text-base text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={handleSearchUser}
                            disabled={!newFriendName.trim() || searching}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
                          >
                            {searching ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full"
                              />
                            ) : (
                              <Search size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 搜索结果列表 */}
                      {searchResults.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {searchResults.map((result) => {
                            const status = requestStatuses[result.id] || 'idle'
                            return (
                              <motion.div
                                layout
                                key={result.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 170,
                                  damping: 20,
                                  mass: 0.85,
                                }}
                                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#060606] border border-black/10 dark:border-white/10"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-black/60 dark:text-white/60" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-black dark:text-white truncate">
                                      {result.name}
                                    </p>
                                    <p className="text-xs text-black/50 dark:text-white/50 truncate">
                                      {result.email}
                                    </p>
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={status === 'idle' ? { scale: 1.05 } : {}}
                                  whileTap={status === 'idle' ? { scale: 0.95 } : {}}
                                  onClick={() => handleSendFriendRequest(result.id, result.name)}
                                  disabled={status === 'sending' || status === 'sent' || status === 'already_friend' || status === 'already_sent'}
                                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    status === 'idle'
                                      ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80'
                                      : status === 'sending'
                                      ? 'bg-black/20 dark:bg-white/20 text-black/60 dark:text-white/60 cursor-wait'
                                      : status === 'sent' || status === 'already_sent'
                                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 cursor-default'
                                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 cursor-default'
                                  }`}
                                >
                                  {status === 'idle' && '添加'}
                                  {status === 'sending' && '发送中...'}
                                  {status === 'sent' && '已发送'}
                                  {status === 'already_sent' && '等待验证'}
                                  {status === 'already_friend' && '已是好友'}
                                </motion.button>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}

                      {addFriendError && (
                        <div className="pt-1 text-xs md:text-sm text-red-500 dark:text-red-400">
                          {addFriendError}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 好友申请列表（当前账号收到的申请） */}
              {isAuthenticated && user && incomingRequests.some(r => r.toUserId === user.id && r.status === 'pending') && (
                <motion.div
                  variants={itemVariants}
                  className="mb-4 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black dark:text-white">新的好友申请</span>
                  </div>
                  <div className="space-y-2">
                    {incomingRequests
                      .filter(r => r.toUserId === user.id && r.status === 'pending')
                      .map(r => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between gap-3 px-2 py-2 rounded-xl bg-black/5 dark:bg-black/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center">
                              <User size={16} className="text-black/60 dark:text-white/60" />
                            </div>
                            <div>
                              <p className="text-sm text-black dark:text-white">{r.fromName}</p>
                              <p className="text-xs text-black/40 dark:text-white/40">请求添加你为好友</p>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              const res = await approveFriendRequest(r.id, user.id)
                              if (!res.success) {
                                setAddFriendError(res.error || '处理失败')
                              }
                            }}
                            className="px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
                          >
                            通过
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* 好友列表 */}
              {friends.length === 0 ? (
                <motion.div
                  layout
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <ChatIcon size={64} className="text-black/20 dark:text-white/20 mb-4" />
                  <p className="text-black/50 dark:text-white/50 text-sm">暂无好友</p>
                  <p className="text-black/30 dark:text-white/30 text-xs mt-2">点击右上角添加好友</p>
                </motion.div>
              ) : (
                <motion.div layout>
                  {friends.map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      layout
                      variants={itemVariants}
                      className={`px-4 py-3 border-b border-black/5 dark:border-white/5 ${
                        index === friends.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/user/${friend.id}`)
                          }}
                          className="relative w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                        >
                          <User size={24} className="text-black/60 dark:text-white/60" />
                          {friend.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[16px] text-center flex items-center justify-center shadow-sm">
                              {friend.unreadCount > 9 ? '9+' : friend.unreadCount}
                            </span>
                          )}
                        </div>
                        <div 
                          onClick={() => {
                            if (friend.status === 'accepted') {
                              setCurrentChatId(friend.id)
                            }
                          }}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-medium text-black dark:text-white truncate">
                              {friend.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {friend.status === 'pending' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/40">
                                  待通过
                                </span>
                              )}
                              {friend.lastMessageTime && (
                                <span className="text-xs text-black/40 dark:text-white/40">
                                  {formatTime(friend.lastMessageTime)}
                                </span>
                              )}
                            </div>
                          </div>
                          {friend.lastMessage && (
                            <p className="text-sm text-black/50 dark:text-white/50 truncate">
                              {friend.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        ) : (
          // 聊天界面（顶部交给 Header，底部输入交给 Navigation）
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {currentFriend?.status === 'pending' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ChatIcon size={48} className="text-black/20 dark:text-white/20 mb-3" />
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">
                    已发送好友申请，等待对方通过后即可开始聊天
                  </p>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    通过前无法发送消息
                  </p>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <ChatIcon size={48} className="text-black/20 dark:text-white/20 mb-3" />
                  <p className="text-black/50 dark:text-white/50 text-sm">开始聊天吧</p>
                </div>
              ) : (
                <>
                  {currentMessages.map((message, index) => {
                    // ✅ 修复：使用实际用户ID比较，而不是字符串 'me'
                    const isMe = user ? message.senderId === user.id : false
                    const prev = index > 0 ? currentMessages[index - 1] : null
                    const showTime =
                      !prev ||
                      // 跨天或者间隔超过 5 分钟时显示时间条
                      new Date(message.timestamp).toDateString() !==
                        new Date(prev.timestamp).toDateString() ||
                      message.timestamp - prev.timestamp > 5 * 60 * 1000

                    return (
                      <div key={message.id}>
                        {showTime && (
                          <div className="flex justify-center my-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[10px] text-black/50 dark:text-white/50">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 210,
                            damping: 24,
                            mass: 0.85,
                          }}
                          className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[72%] ${isMe ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-4 py-2 rounded-2xl relative ${
                                isMe
                                  ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-sm'
                                  : 'bg-black/6 dark:bg-white/10 text-black dark:text-white rounded-bl-sm'
                              }`}
                              onContextMenu={(e) => handleContextMenu(message.id, e)}
                              onMouseDown={() => handleMouseDown(message.id)}
                              onMouseUp={handleMouseUp}
                              onMouseLeave={handleMouseUp}
                              onTouchStart={() => handleMouseDown(message.id)}
                              onTouchEnd={handleMouseUp}
                            >
                              {message.isRevoked ? (
                                <p className="text-sm text-black/40 dark:text-white/40 italic">
                                  已撤回
                                </p>
                              ) : (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* 调试工具（仅开发环境） */}
      <MessageDebugger />

      {/* 右键/长按菜单 */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-[100] bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-lg py-1 min-w-[120px]"
              style={{
                left: `${Math.min(contextMenu.x, window.innerWidth - 140)}px`,
                top: `${Math.min(contextMenu.y, window.innerHeight - 200)}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const message = currentMessages.find(m => m.id === contextMenu.messageId)
                if (!message) return null
                // ✅ 修复：使用实际用户ID比较
                const isMe = user ? message.senderId === user.id : false
                const canRevoke = isMe && !message.isRevoked && (Date.now() - message.timestamp) <= 2 * 60 * 1000

                return (
                  <>
                    {!message.isRevoked && (
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="w-full px-4 py-2 text-left text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                      >
                        <Copy size={16} />
                        复制
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(contextMenu.messageId)}
                      className="w-full px-4 py-2 text-left text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      删除
                    </button>
                    {canRevoke && (
                      <button
                        onClick={() => handleRevoke(contextMenu.messageId)}
                        className="w-full px-4 py-2 text-left text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                      >
                        <RotateCcw size={16} />
                        撤回
                      </button>
                    )}
                  </>
                )
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chat

