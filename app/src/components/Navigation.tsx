import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Home, MapPin, User, QrCode, Send, UserPlus, X, Check } from 'lucide-react'
import ChatIcon from './ChatIcon'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'

const Navigation = () => {
  const [mounted, setMounted] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [showRequestPanel, setShowRequestPanel] = useState(false)
  const location = useLocation()
  const { currentChatId, sendMessage, friends, incomingRequests, approveFriendRequest } = useChat()
  const { user, isAuthenticated } = useAuth()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentFriend = friends.find(f => f.id === currentChatId)
  const canChat = !!currentFriend && (currentFriend.status === 'accepted' || !currentFriend.status)

  // 路由在 /chat 且已选择好友且已通过申请时，底部导航变为输入栏
  const isChatRoute = location.pathname === '/chat'
  const showChatInputBar = isChatRoute && !!currentChatId && canChat

  const handleSend = () => {
    if (!chatInput.trim() || !currentChatId) return
    sendMessage(currentChatId, chatInput)
    setChatInput('')
  }

  const totalUnread = friends.reduce((sum, f) => sum + (f.unreadCount || 0), 0)
  
  // 计算待处理的好友申请数量
  const pendingRequestCount = isAuthenticated && user
    ? incomingRequests.filter(r => r.toUserId === user.id && r.status === 'pending').length
    : 0

  const pendingRequests = isAuthenticated && user
    ? incomingRequests.filter(r => r.toUserId === user.id && r.status === 'pending')
    : []

  const handleApprove = async (requestId: string) => {
    if (!user) return
    
    const result = await approveFriendRequest(requestId, user.id)
    if (result.success) {
      window.dispatchEvent(new CustomEvent('friend_request_approved', {
        detail: { requestId }
      }))
    }
  }

  const handleChatClick = (e: React.MouseEvent) => {
    // 如果有待处理申请，点击时打开申请面板
    if (pendingRequestCount > 0 && location.pathname === '/chat') {
      e.preventDefault()
      setShowRequestPanel(true)
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: '首页', isCustom: false },
    { path: '/trace', icon: QrCode, label: '溯源', isCustom: false },
    { path: '/gallery', icon: MapPin, label: '地区', isCustom: false },
    { path: '/chat', icon: ChatIcon, label: '消息', isCustom: true },
    { path: '/profile', icon: User, label: '我', isCustom: false },
  ]

  const navContent = (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-[#060606]/95 border-t border-black/10 dark:border-white/10 backdrop-blur-sm"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 99999,
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      <div
        className="max-w-md mx-auto px-4"
        style={{
          minHeight: '64px',
          height: 'calc(64px + max(env(safe-area-inset-bottom), 8px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: showChatInputBar ? 'center' : 'space-around',
        }}
      >
        <AnimatePresence mode="wait">
          {showChatInputBar ? (
            <motion.div
              key="chat-input"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              className="flex items-center gap-3 w-full"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 bg-transparent text-sm md:text-base text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!chatInput.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ willChange: 'transform' }}
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="nav-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className="flex items-center justify-around w-full"
              style={{ willChange: 'opacity' }}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={item.path === '/chat' ? handleChatClick : undefined}
                  className={({ isActive }) =>
                    `relative flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl ${
                      isActive
                        ? 'text-black dark:text-white'
                        : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative" style={{ willChange: 'transform' }}>
                        <motion.div
                          animate={{
                            scale: isActive ? 1.1 : 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                            mass: 0.6,
                          }}
                          style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                          }}
                        >
                          {item.isCustom ? (
                            <item.icon size={20} className="text-current" />
                          ) : (
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                          )}
                        </motion.div>
                        {item.path === '/chat' && (
                          <>
                            {totalUnread > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 20,
                                }}
                                className="absolute top-0 right-0 min-w-[14px] h-[14px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[14px] text-center flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
                                style={{ willChange: 'transform' }}
                              >
                                {totalUnread > 9 ? '9+' : totalUnread}
                              </motion.span>
                            )}
                            {pendingRequestCount > 0 && totalUnread === 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 20,
                                }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#060606]"
                                style={{ willChange: 'transform' }}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="relative flex flex-col items-center w-full">
                        <motion.span
                          className="text-xs font-medium text-center"
                          animate={{
                            opacity: isActive ? 1 : 0.4,
                          }}
                          transition={{
                            duration: 0.2,
                            ease: 'easeOut',
                          }}
                          style={{ willChange: 'opacity' }}
                        >
                          {item.label}
                        </motion.span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute -bottom-3 w-1 h-1 bg-black dark:bg-white rounded-full"
                            initial={false}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 25,
                              mass: 0.5,
                            }}
                            style={{
                              willChange: 'transform',
                              transform: 'translateZ(0)',
                              left: '50%',
                              marginLeft: '-2px',
                            }}
                          />
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 好友申请面板 */}
      <AnimatePresence>
        {showRequestPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99998] bg-black/20 dark:bg-black/40"
              onClick={() => setShowRequestPanel(false)}
              style={{ willChange: 'opacity' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              className="fixed bottom-20 left-4 right-4 z-[99999] bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl shadow-lg p-4 max-h-[60vh] overflow-y-auto"
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black dark:text-white">
                  好友申请
                </h3>
                <button
                  onClick={() => setShowRequestPanel(false)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <X size={18} className="text-black/60 dark:text-white/60" />
                </button>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-black/50 dark:text-white/50 text-sm">
                  暂无新的好友申请
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        delay: index * 0.05,
                      }}
                      className="p-3 border border-black/10 dark:border-white/10 rounded-xl bg-black/5 dark:bg-white/5"
                      style={{
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center">
                          <UserPlus size={20} className="text-black/60 dark:text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black dark:text-white truncate">
                            {request.fromName}
                          </p>
                          <p className="text-xs text-black/50 dark:text-white/50">
                            请求添加你为好友
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                          }}
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center justify-center gap-2"
                          style={{ willChange: 'transform' }}
                        >
                          <Check size={16} />
                          接受
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                          }}
                          onClick={() => setShowRequestPanel(false)}
                          className="flex-1 px-3 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5"
                          style={{ willChange: 'transform' }}
                        >
                          忽略
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )

  if (!mounted) return null

  return createPortal(navContent, document.body)
}

export default Navigation
