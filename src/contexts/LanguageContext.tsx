import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'zh-CN' | 'en'

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
    'about.feature1.title': '极简设计',
    'about.feature1.desc': '去除冗余，保留本质，每一根线条都经过精心设计',
    'about.feature2.title': '流畅交互',
    'about.feature2.desc': '参考iOS设计规范，带来丝滑般的用户体验',
    'about.feature3.title': '艺术美学',
    'about.feature3.desc': '在数字世界中寻找内心的宁静与平衡',
    
    // 首页
    'home.trace.title': '溯源查询',
    'home.trace.desc': '一物一码，追溯产品来源',
    'home.gallery.title': '地区探索',
    'home.gallery.desc': '发现莆田地区的文化特色',
    
    // 个人资料
    'profile.logout': '退出登录',
    'profile.credits': '积分',
    'profile.email': '邮箱',
    
    // 错误信息
    'error.required': '此字段为必填项',
    'error.passwordMismatch': '两次输入的密码不一致',
    'error.loginFailed': '登录失败，请检查用户名和密码',
    'error.registerFailed': '注册失败，请稍后重试',
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
    'about.feature1.title': 'Minimalist Design',
    'about.feature1.desc': 'Remove redundancy, preserve essence, every line is carefully designed',
    'about.feature2.title': 'Smooth Interaction',
    'about.feature2.desc': 'Following iOS design guidelines for a silky smooth user experience',
    'about.feature3.title': 'Artistic Aesthetics',
    'about.feature3.desc': 'Finding inner peace and balance in the digital world',
    
    // 首页
    'home.trace.title': 'Trace Query',
    'home.trace.desc': 'One code per item, trace product origin',
    'home.gallery.title': 'Regional Exploration',
    'home.gallery.desc': 'Discover the cultural characteristics of Putian',
    
    // 个人资料
    'profile.logout': 'Logout',
    'profile.credits': 'Credits',
    'profile.email': 'Email',
    
    // 错误信息
    'error.required': 'This field is required',
    'error.passwordMismatch': 'Passwords do not match',
    'error.loginFailed': 'Login failed, please check your username and password',
    'error.registerFailed': 'Registration failed, please try again later',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // 从 localStorage 读取保存的语言设置
    const saved = localStorage.getItem('language') as Language
    return saved && ['zh-CN', 'en'].includes(saved) ? saved : 'zh-CN'
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

