import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User, Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { AddFriendButton } from '../components/AddFriendButton'
import { apiService } from '../services/api'

interface UserProfileData {
  id: string
  email: string
  name: string
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setError('用户ID无效')
        setLoading(false)
        return
      }

      // 如果是自己的资料页，跳转到 /profile
      if (currentUser && userId === currentUser.id) {
        navigate('/profile')
        return
      }

      try {
        setLoading(true)
        // 使用新的 getUserById API
        const result = await apiService.getUserById(userId, currentUser?.id || '')
        
        if (result.user) {
          setProfileUser({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          })
        } else {
          setError(result.error || '用户不存在')
        }
      } catch (err: any) {
        setError(err.message || '加载用户信息失败')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [userId, currentUser, navigate])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-white dark:bg-[#060606]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-black/60 dark:text-white/60" />
          <p className="text-sm text-black/50 dark:text-white/50">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-full flex items-center justify-center bg-white dark:bg-[#060606]">
        <div className="text-center">
          <p className="text-lg text-black dark:text-white mb-4">{error || '用户不存在'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl"
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* 返回按钮 */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="mb-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} className="text-black/60 dark:text-white/60" />
        </motion.button>

        {/* 用户信息卡片 */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="p-8 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <User size={40} className="text-black/60 dark:text-white/60" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-light mb-2 text-black dark:text-white">{profileUser.name}</h2>
                <div className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50 mb-4">
                  <Mail size={14} />
                  <span>{profileUser.email}</span>
                </div>
                <AddFriendButton
                  targetUserId={profileUser.id}
                  targetUserName={profileUser.name}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UserProfile

