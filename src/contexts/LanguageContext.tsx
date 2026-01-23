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
    'login.name': '姓名',
    'login.password': '密码',
    'login.confirmPassword': '确认密码',
    'login.submit': '登录',
    'login.registerSubmit': '注册',
    'login.switchToRegister': '还没有账号？立即注册',
    'login.switchToLogin': '已有账号？立即登录',
    'login.welcome': '欢迎回来',
    'login.createAccount': '创建新账户',
    'login.email': '邮箱',
    'login.emailPlaceholder': '请输入邮箱地址',
    'login.namePlaceholder': '请输入您的姓名',
    'login.passwordPlaceholder': '请输入密码',
    'login.passwordPlaceholderRegister': '至少6个字符',
    'login.processing': '处理中...',
    'login.backToHome': '返回首页',
    'login.error': '操作失败，请重试',
    'login.errorOccurred': '发生错误，请重试',
    
    // 个人资料
    'profile.title': '个人资料',
    'profile.edit': '编辑资料',
    'profile.friends': '好友',
    'profile.settings': '设置',
    'profile.notLoggedIn': '未登录',
    'profile.loginPrompt': '请登录以查看个人信息',
    'profile.loginNow': '立即登录',
    'profile.credits': '心缘积分',
    'profile.creditsDesc': '通过溯源查询获得',
    'profile.creditsUnit': '心缘',
    'profile.creditsInfo': '每次成功查询或扫描溯源码可获得 10 心缘积分，积分可用于后续功能兑换。',
    'profile.traceHistory': '我的溯源记录',
    'profile.traceHistoryDesc': '查看历史溯源查询记录',
    'profile.exchange': '积分兑换',
    'profile.exchangeDesc': '使用心缘积分兑换权益',
    'profile.settingsDesc': '应用设置与偏好',
    
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
    'home.trace.title': '溯源码',
    'home.trace.desc': '扫描溯源码查看区块链存证信息',
    'home.gallery.title': '地区',
    'home.gallery.desc': '探索莆田各区县的详细分类与特色',
    'home.about.title': '关于我们',
    'home.about.desc': '了解缘心福的设计理念',
    
    // 关于
    'about.title': '关于',
    'about.desc': '极简艺术应用',
    'about.feature1.title': '极简设计',
    'about.feature1.desc': '去除冗余，保留本质，每一根线条都经过精心设计',
    'about.feature2.title': '流畅交互',
    'about.feature2.desc': '参考iOS设计规范，带来丝滑般的用户体验',
    'about.feature3.title': '艺术美学',
    'about.feature3.desc': '在数字世界中寻找内心的宁静与平衡',
    'about.intro1': '缘心福致力于运用',
    'about.intro2': '区块链',
    'about.intro3': '、',
    'about.intro4': '数字资产（NFT）',
    'about.intro5': '与',
    'about.intro6': '社区共识（DAO）',
    'about.intro7': '等Web3核心技术',
    'about.intro8': '为福建深厚的特色产业（如工艺美术、鞋服制造、农产品、跨境贸易）构建可信的数字基石',
    'about.intro9': '推动实体产业与数字经济的深度融合',
    'about.designTitle': '设计理念',
    'about.design1': '根源于莆阳，心之天下福。',
    'about.design2': '不止于根源，福于千万里，方为缘心福。',
    
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
    'login.name': 'Name',
    'login.password': 'Password',
    'login.confirmPassword': 'Confirm Password',
    'login.submit': 'Login',
    'login.registerSubmit': 'Register',
    'login.switchToRegister': "Don't have an account? Register now",
    'login.switchToLogin': 'Already have an account? Login now',
    'login.welcome': 'Welcome back',
    'login.createAccount': 'Create new account',
    'login.email': 'Email',
    'login.emailPlaceholder': 'Enter your email address',
    'login.namePlaceholder': 'Enter your name',
    'login.passwordPlaceholder': 'Enter your password',
    'login.passwordPlaceholderRegister': 'At least 6 characters',
    'login.processing': 'Processing...',
    'login.backToHome': 'Back to Home',
    'login.error': 'Operation failed, please try again',
    'login.errorOccurred': 'An error occurred, please try again',
    
    // 个人资料
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.friends': 'Friends',
    'profile.settings': 'Settings',
    'profile.notLoggedIn': 'Not logged in',
    'profile.loginPrompt': 'Please login to view personal information',
    'profile.loginNow': 'Login now',
    'profile.credits': 'Xinyuan Credits',
    'profile.creditsDesc': 'Earned through trace queries',
    'profile.creditsUnit': 'Xinyuan',
    'profile.creditsInfo': 'Each successful trace query or scan earns 10 Xinyuan credits, which can be used for future feature exchanges.',
    'profile.traceHistory': 'My Trace History',
    'profile.traceHistoryDesc': 'View historical trace query records',
    'profile.exchange': 'Credit Exchange',
    'profile.exchangeDesc': 'Use Xinyuan credits to exchange benefits',
    'profile.settingsDesc': 'App settings and preferences',
    
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
    'home.trace.title': 'Trace Code',
    'home.trace.desc': 'Scan trace code to view blockchain certification information',
    'home.gallery.title': 'Region',
    'home.gallery.desc': 'Explore detailed categories and features of Putian districts',
    'home.about.title': 'About Us',
    'home.about.desc': 'Learn about Yuanxin Fu design philosophy',
    
    // 关于
    'about.title': 'About',
    'about.desc': 'Minimalist Art App',
    'about.feature1.title': 'Minimalist Design',
    'about.feature1.desc': 'Remove redundancy, preserve essence, every line is carefully designed',
    'about.feature2.title': 'Smooth Interaction',
    'about.feature2.desc': 'Following iOS design guidelines for a silky smooth user experience',
    'about.feature3.title': 'Artistic Aesthetics',
    'about.feature3.desc': 'Finding inner peace and balance in the digital world',
    'about.intro1': 'Yuanxin Fu is committed to using',
    'about.intro2': 'blockchain',
    'about.intro3': ', ',
    'about.intro4': 'digital assets (NFT)',
    'about.intro5': ' and ',
    'about.intro6': 'community consensus (DAO)',
    'about.intro7': ' and other Web3 core technologies',
    'about.intro8': 'to build a trusted digital foundation for Fujian\'s deep-rooted characteristic industries (such as arts and crafts, footwear manufacturing, agricultural products, cross-border trade)',
    'about.intro9': 'promoting deep integration of real industries and the digital economy',
    'about.designTitle': 'Design Philosophy',
    'about.design1': 'Rooted in Puyang, the heart of the world\'s blessings.',
    'about.design2': 'Not limited to the origin, blessings extend thousands of miles, this is Yuanxin Fu.',
    
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

