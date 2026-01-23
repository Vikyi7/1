import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'zh-CN' | 'zh-TW' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 翻译文件
const translations: Record<Language, Record<string, string>> = {
  'zh-CN': {
    // 通用
    'common.back': '返回',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.close': '关闭',
    
    // 导航
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.gallery': '图库',
    'nav.trace': '溯源',
    'nav.profile': '我的',
    'nav.chat': '聊天',
    
    // 设置
    'settings.title': '设置',
    'settings.notifications': '通知',
    'settings.notifications.desc': '接收应用通知和提醒',
    'settings.darkMode': '深色模式',
    'settings.darkMode.desc': '切换深色主题',
    'settings.language': '语言',
    'settings.language.desc': '选择应用语言',
    'settings.privacy': '隐私与安全',
    'settings.privacy.desc': '管理隐私设置',
    'settings.testCodes': '测试溯源码',
    'settings.testCodes.desc': '生成测试用的溯源码（一物一码）',
    'settings.generateCodes': '生成 5 个测试码',
    'settings.about': '关于',
    'settings.about.desc': '了解缘心福的设计理念',
    'settings.version': '版本',
    
    // 登录
    'login.title': '登录',
    'login.register': '注册',
    'login.username': '用户名',
    'login.password': '密码',
    'login.confirmPassword': '确认密码',
    'login.submit': '登录',
    'login.registerSubmit': '注册',
    'login.switchToRegister': '还没有账号？立即注册',
    'login.switchToLogin': '已有账号？立即登录',
    
    // 个人资料
    'profile.title': '个人资料',
    'profile.edit': '编辑资料',
    'profile.friends': '好友',
    'profile.settings': '设置',
    
    // 聊天
    'chat.title': '聊天',
    'chat.send': '发送',
    'chat.placeholder': '输入消息...',
    'chat.noMessages': '还没有消息',
    'chat.friendRequests': '好友申请',
    'chat.noFriendRequests': '暂无新的好友申请',
    
    // 首页
    'home.welcome': '欢迎',
    'home.explore': '探索',
    
    // 关于
    'about.title': '关于',
    'about.desc': '极简艺术应用',
  },
  'zh-TW': {
    // 通用
    'common.back': '返回',
    'common.save': '儲存',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.close': '關閉',
    
    // 导航
    'nav.home': '首頁',
    'nav.about': '關於',
    'nav.gallery': '圖庫',
    'nav.trace': '溯源',
    'nav.profile': '我的',
    'nav.chat': '聊天',
    
    // 设置
    'settings.title': '設定',
    'settings.notifications': '通知',
    'settings.notifications.desc': '接收應用通知和提醒',
    'settings.darkMode': '深色模式',
    'settings.darkMode.desc': '切換深色主題',
    'settings.language': '語言',
    'settings.language.desc': '選擇應用語言',
    'settings.privacy': '隱私與安全',
    'settings.privacy.desc': '管理隱私設定',
    'settings.testCodes': '測試溯源码',
    'settings.testCodes.desc': '生成測試用的溯源码（一物一碼）',
    'settings.generateCodes': '生成 5 個測試碼',
    'settings.about': '關於',
    'settings.about.desc': '了解緣心福的設計理念',
    'settings.version': '版本',
    
    // 登录
    'login.title': '登入',
    'login.register': '註冊',
    'login.username': '使用者名稱',
    'login.password': '密碼',
    'login.confirmPassword': '確認密碼',
    'login.submit': '登入',
    'login.registerSubmit': '註冊',
    'login.switchToRegister': '還沒有帳號？立即註冊',
    'login.switchToLogin': '已有帳號？立即登入',
    
    // 个人资料
    'profile.title': '個人資料',
    'profile.edit': '編輯資料',
    'profile.friends': '好友',
    'profile.settings': '設定',
    
    // 聊天
    'chat.title': '聊天',
    'chat.send': '發送',
    'chat.placeholder': '輸入訊息...',
    'chat.noMessages': '還沒有訊息',
    'chat.friendRequests': '好友申請',
    'chat.noFriendRequests': '暫無新的好友申請',
    
    // 首页
    'home.welcome': '歡迎',
    'home.explore': '探索',
    
    // 关于
    'about.title': '關於',
    'about.desc': '極簡藝術應用',
  },
  'en': {
    // 通用
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    
    // 导航
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.gallery': 'Gallery',
    'nav.trace': 'Trace',
    'nav.profile': 'Profile',
    'nav.chat': 'Chat',
    
    // 设置
    'settings.title': 'Settings',
    'settings.notifications': 'Notifications',
    'settings.notifications.desc': 'Receive app notifications and reminders',
    'settings.darkMode': 'Dark Mode',
    'settings.darkMode.desc': 'Toggle dark theme',
    'settings.language': 'Language',
    'settings.language.desc': 'Choose app language',
    'settings.privacy': 'Privacy & Security',
    'settings.privacy.desc': 'Manage privacy settings',
    'settings.testCodes': 'Test Trace Codes',
    'settings.testCodes.desc': 'Generate test trace codes (one code per item)',
    'settings.generateCodes': 'Generate 5 Test Codes',
    'settings.about': 'About',
    'settings.about.desc': 'Learn about Yuanxin Fu design philosophy',
    'settings.version': 'Version',
    
    // 登录
    'login.title': 'Login',
    'login.register': 'Register',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.confirmPassword': 'Confirm Password',
    'login.submit': 'Login',
    'login.registerSubmit': 'Register',
    'login.switchToRegister': "Don't have an account? Register now",
    'login.switchToLogin': 'Already have an account? Login now',
    
    // 个人资料
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.friends': 'Friends',
    'profile.settings': 'Settings',
    
    // 聊天
    'chat.title': 'Chat',
    'chat.send': 'Send',
    'chat.placeholder': 'Type a message...',
    'chat.noMessages': 'No messages yet',
    'chat.friendRequests': 'Friend Requests',
    'chat.noFriendRequests': 'No new friend requests',
    
    // 首页
    'home.welcome': 'Welcome',
    'home.explore': 'Explore',
    
    // 关于
    'about.title': 'About',
    'about.desc': 'Minimalist Art App',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // 从 localStorage 读取保存的语言设置
    const saved = localStorage.getItem('language') as Language
    return saved && ['zh-CN', 'zh-TW', 'en'].includes(saved) ? saved : 'zh-CN'
  })

  // 保存语言设置到 localStorage
  useEffect(() => {
    localStorage.setItem('language', language)
    // 更新 HTML lang 属性
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

