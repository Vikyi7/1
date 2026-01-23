import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bell, Moon, Globe, Shield, QrCode, Copy, Check, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTraceCode } from '../contexts/TraceCodeContext'

const Settings = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { generateTestCodes } = useTraceCode()
  const [notifications, setNotifications] = useState(true)
  const [testCodes, setTestCodes] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

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
    <div className="min-h-screen pb-24 px-6 pt-12 md:pt-24 bg-white dark:bg-[#060606] transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* 返回按钮 */}
          <motion.button
          variants={itemVariants}
          onClick={() => navigate('/profile')}
          className="mb-8 flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('common.back')}</span>
        </motion.button>

        {/* 标题区域 */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl md:text-7xl font-light mb-4 text-black dark:text-white">{t('settings.title')}</h1>
          <div className="h-px bg-black/20 dark:bg-white/20 w-24" />
        </motion.div>

        {/* 设置选项 */}
        <div className="space-y-4">
          {/* 通知设置 */}
          <motion.div
            variants={itemVariants}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  <Bell size={20} className="text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-black dark:text-white">{t('settings.notifications')}</h3>
                  <p className="text-sm text-black/50 dark:text-white/50">{t('settings.notifications.desc')}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/20 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-[#393939]"></div>
              </label>
            </div>
          </motion.div>

          {/* 深色模式 - iOS风格切换 */}
          <motion.div
            variants={itemVariants}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  <Moon size={20} className="text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-black dark:text-white">{t('settings.darkMode')}</h3>
                  <p className="text-sm text-black/50 dark:text-white/50">{t('settings.darkMode.desc')}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out ${
                  isDark ? 'bg-[#393939]' : 'bg-black/20'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                    isDark ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* 语言设置 */}
          <motion.div
            variants={itemVariants}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <Globe size={20} className="text-black/60 dark:text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1 text-black dark:text-white">{t('settings.language')}</h3>
                <p className="text-sm text-black/50 dark:text-white/50">{t('settings.language.desc')}</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'zh-CN' | 'zh-TW' | 'en')}
                className="px-4 py-2 border border-black/20 dark:border-white/20 rounded-xl bg-transparent dark:bg-transparent text-sm focus:outline-none focus:border-black/40 dark:focus:border-white/40 text-black dark:text-white"
              >
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </motion.div>

          {/* 隐私设置 */}
          <motion.div
            variants={itemVariants}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <Shield size={20} className="text-black/60 dark:text-white/60" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1 text-black dark:text-white">{t('settings.privacy')}</h3>
                <p className="text-sm text-black/50 dark:text-white/50">{t('settings.privacy.desc')}</p>
              </div>
            </div>
          </motion.div>

          {/* 生成测试溯源码 */}
          <motion.div
            variants={itemVariants}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <QrCode size={20} className="text-black/60 dark:text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1 text-black dark:text-white">{t('settings.testCodes')}</h3>
                <p className="text-sm text-black/50 dark:text-white/50">{t('settings.testCodes.desc')}</p>
              </div>
            </div>
            <button
              onClick={() => {
                const codes = generateTestCodes(5)
                setTestCodes(codes)
              }}
              className="w-full py-3 border border-black/20 dark:border-white/20 rounded-xl font-light hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
            >
              {t('settings.generateCodes')}
            </button>
            <AnimatePresence>
              {testCodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  {testCodes.map((code, index) => (
                    <motion.div
                      key={code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg"
                    >
                      <code className="text-sm font-mono text-black dark:text-white flex-1">{code}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code)
                          setCopiedCode(code)
                          setTimeout(() => setCopiedCode(null), 2000)
                        }}
                        className="ml-2 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copiedCode === code ? (
                          <Check size={16} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy size={16} className="text-black/60 dark:text-white/60" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 关于 */}
          <motion.div
            variants={itemVariants}
            className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300 cursor-pointer hover:bg-black/2 dark:hover:bg-white/2"
            onClick={() => navigate('/about')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <Info size={20} className="text-black/60 dark:text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1 text-black dark:text-white">{t('settings.about')}</h3>
                <p className="text-sm text-black/50 dark:text-white/50">{t('settings.about.desc')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 应用信息 */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 bg-black/5 dark:bg-white/5 rounded-2xl text-center transition-colors duration-300"
        >
          <p className="text-sm text-black/50 dark:text-white/50 mb-2">缘心福</p>
          <p className="text-xs text-black/40 dark:text-white/40">{t('settings.version')} 1.0.0</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Settings
