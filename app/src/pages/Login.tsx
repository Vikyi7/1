import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 如果已登录，重定向到个人页面
  if (isAuthenticated) {
    navigate('/profile')
    return null
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let result
      if (isLoginMode) {
        result = await login(email, password)
      } else {
        result = await register(email, password, name)
      }

      if (result.success) {
        navigate('/profile')
      } else {
        setError(result.error || '操作失败，请重试')
      }
    } catch (err) {
      setError('发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setEmail('')
    setPassword('')
    setName('')
  }

  return (
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300" style={{ transform: 'translateZ(0)' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        {/* 标题 */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2 text-black dark:text-white">
            {isLoginMode ? '登录' : '注册'}
          </h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            {isLoginMode ? '欢迎回来' : '创建新账户'}
          </p>
        </motion.div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 表单 */}
        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
          {/* 注册模式下的姓名输入 */}
          {!isLoginMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                姓名
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full pl-12 pr-4 py-3 border border-black/20 dark:border-white/20 rounded-xl bg-white dark:bg-[#060606] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors"
                  required={!isLoginMode}
                />
              </div>
            </motion.div>
          )}

          {/* 邮箱输入 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              邮箱
            </label>
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full pl-12 pr-4 py-3 border border-black/20 dark:border-white/20 rounded-xl bg-white dark:bg-[#060606] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* 密码输入 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              密码
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLoginMode ? '请输入密码' : '至少6个字符'}
                className="w-full pl-12 pr-4 py-3 border border-black/20 dark:border-white/20 rounded-xl bg-white dark:bg-[#060606] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors"
                required
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                minLength={isLoginMode ? undefined : 6}
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="text-sm">处理中...</span>
            ) : (
              <>
                <span>{isLoginMode ? '登录' : '注册'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* 切换模式 */}
        <motion.div variants={itemVariants} className="mt-6 text-center">
          <button
            type="button"
            onClick={switchMode}
            className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            {isLoginMode ? (
              <>
                还没有账户？<span className="font-medium">立即注册</span>
              </>
            ) : (
              <>
                已有账户？<span className="font-medium">立即登录</span>
              </>
            )}
          </button>
        </motion.div>

        {/* 返回首页 */}
        <motion.div variants={itemVariants} className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors"
          >
            返回首页
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login








