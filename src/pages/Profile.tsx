import { motion } from 'framer-motion'
import { Coins, User, Settings, ChevronRight, LogOut, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCredit } from '../contexts/CreditContext'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const navigate = useNavigate()
  const { credit } = useCredit()
  const { user, isAuthenticated, logout } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300" style={{ transform: 'translateZ(0)' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >

        {/* 用户信息卡片 */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="p-8 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
            {isAuthenticated && user ? (
              <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <User size={32} className="text-black/60 dark:text-white/60" />
              </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-light mb-1 text-black dark:text-white">{user.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50">
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </div>
              </div>
            </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="w-full py-3 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  <span>退出登录</span>
                </motion.button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center mb-4">
                    <User size={32} className="text-black/60 dark:text-white/60" />
                  </div>
                  <h2 className="text-2xl font-light mb-2 text-black dark:text-white">未登录</h2>
                  <p className="text-sm text-black/50 dark:text-white/50 mb-6">请登录以查看个人信息</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
                  >
                    立即登录
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* 积分显示区域 */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="p-8 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  <Coins size={24} className="text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-black dark:text-white">心缘积分</h3>
                  <p className="text-xs text-black/50 dark:text-white/50">通过溯源查询获得</p>
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light text-black dark:text-white">{credit}</span>
              <span className="text-lg text-black/60 dark:text-white/60">心缘</span>
            </div>
            <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
              <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                每次成功查询或扫描溯源码可获得 10 心缘积分，积分可用于后续功能兑换。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 其他功能区域 */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          <div className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
            <h4 className="text-lg font-medium mb-2 text-black dark:text-white">我的溯源记录</h4>
            <p className="text-sm text-black/50 dark:text-white/50">查看历史溯源查询记录</p>
          </div>
          <div className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
            <h4 className="text-lg font-medium mb-2 text-black dark:text-white">积分兑换</h4>
            <p className="text-sm text-black/50 dark:text-white/50">使用心缘积分兑换权益</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/settings')}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between bg-white dark:bg-[#060606]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <Settings size={20} className="text-black/60 dark:text-white/60" />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1 text-black dark:text-white">设置</h4>
                <p className="text-sm text-black/50 dark:text-white/50">应用设置与偏好</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-black/30 dark:text-white/30" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Profile
