import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useChat } from '../contexts/ChatContext'
import { apiService } from '../services/api'

interface AddFriendButtonProps {
  targetUserId: string
  targetUserName?: string
  className?: string
}

type RequestStatus = 'idle' | 'sending' | 'sent' | 'error' | 'already_friend' | 'already_sent'

export const AddFriendButton = ({ targetUserId, targetUserName, className = '' }: AddFriendButtonProps) => {
  const { user, isAuthenticated } = useAuth()
  const { friends, sendFriendRequest } = useChat()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // 检查当前状态
  useEffect(() => {
    if (!user || !isAuthenticated) {
      setRequestStatus('idle')
      return
    }

    // 检查是否已是好友
    const friend = friends.find(f => f.id === targetUserId)
    if (friend?.status === 'accepted') {
      setRequestStatus('already_friend')
      return
    }

    // 检查是否已发送申请
    if (friend?.status === 'pending') {
      setRequestStatus('already_sent')
      return
    }

    setRequestStatus('idle')
  }, [friends, targetUserId, user, isAuthenticated])

  const handleClick = async () => {
    if (!user || !isAuthenticated) {
      setErrorMessage('请先登录')
      return
    }

    if (requestStatus === 'sending' || requestStatus === 'sent' || requestStatus === 'already_friend') {
      return
    }

    setRequestStatus('sending')
    setErrorMessage('')

    try {
      const result = await sendFriendRequest(
        { id: user.id, name: user.name },
        { id: targetUserId, name: targetUserName || '用户' }
      )

      if (result.success) {
        setRequestStatus('sent')
        // 触发全局事件，通知其他组件刷新
        window.dispatchEvent(new CustomEvent('friend_request_sent', {
          detail: { targetUserId }
        }))
      } else {
        setRequestStatus('error')
        setErrorMessage(result.error || '发送失败')
        
        // 根据错误信息更新状态
        if (result.error?.includes('已是好友')) {
          setRequestStatus('already_friend')
        } else if (result.error?.includes('申请已发送')) {
          setRequestStatus('already_sent')
        }
      }
    } catch (error: any) {
      setRequestStatus('error')
      setErrorMessage(error.message || '发送失败，请重试')
    }
  }

  // 根据状态渲染按钮
  const renderButton = () => {
    const baseClasses = `px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${className}`

    switch (requestStatus) {
      case 'sending':
        return (
          <motion.button
            disabled
            className={`${baseClasses} bg-black/20 dark:bg-white/20 text-black/60 dark:text-white/60 cursor-not-allowed`}
          >
            <Loader2 size={18} className="animate-spin" />
            <span>发送中...</span>
          </motion.button>
        )

      case 'sent':
      case 'already_sent':
        return (
          <motion.button
            disabled
            className={`${baseClasses} bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 cursor-default`}
          >
            <Check size={18} />
            <span>已发送</span>
          </motion.button>
        )

      case 'already_friend':
        return (
          <motion.button
            disabled
            className={`${baseClasses} bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 cursor-default`}
          >
            <Check size={18} />
            <span>已是好友</span>
          </motion.button>
        )

      case 'error':
        return (
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20`}
          >
            <UserPlus size={18} />
            <span>重试</span>
          </motion.button>
        )

      default:
        return (
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80`}
          >
            <UserPlus size={18} />
            <span>加好友</span>
          </motion.button>
        )
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {renderButton()}
      {errorMessage && requestStatus === 'error' && (
        <p className="text-xs text-red-500 dark:text-red-400 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

