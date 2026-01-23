import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useChat } from '../contexts/ChatContext'
import { useLanguage } from '../contexts/LanguageContext'

const Header = () => {
  const location = useLocation()
  const { friends, currentChatId, setCurrentChatId } = useChat()
  const { t } = useLanguage()

  const isChatRoute = location.pathname === '/chat'
  const currentFriend = isChatRoute && currentChatId
    ? friends.find(f => f.id === currentChatId)
    : undefined

  // 定义各页面的标题
  const getPageTitle = () => {
    const path = location.pathname

    if (path === '/chat' && currentFriend) {
      return currentFriend.name
    }

    if (path === '/') return t('header.appName')
    if (path === '/trace') return t('header.trace')
    if (path === '/gallery') return t('header.gallery')
    if (path === '/chat') return t('header.chat')
    if (path === '/about') return t('header.about')
    if (path === '/profile') return t('header.profile')
    if (path === '/settings') return t('header.settings')
    if (path === '/login') return t('header.login')
    if (path.startsWith('/user/')) return t('header.userProfile')
    return t('header.appName')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#060606]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 transition-colors duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div
        className="max-w-md mx-auto px-4 relative"
        style={{
          minHeight: '56px',
          height: 'calc(56px + env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChatRoute && currentFriend && (
          <button
            onClick={() => setCurrentChatId(null)}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={18} className="text-black/70 dark:text-white/70" />
          </button>
        )}
        <h1 className="text-base font-medium text-black dark:text-white text-center truncate max-w-[70%]">
          {getPageTitle()}
        </h1>
        {isChatRoute && !currentFriend && (
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open_add_friend_dialog'))
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <UserPlus size={18} className="text-black/70 dark:text-white/70" />
          </button>
        )}
      </div>
    </motion.header>
  )
}

export default Header
