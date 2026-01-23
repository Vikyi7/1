import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'

export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; user?: User }>
  getRegisteredUsers: () => User[]
  findRegisteredUser: (query: string) => Promise<User | null>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'puyuan_auth'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const userData = JSON.parse(stored)
        setUser(userData)
      } catch (error) {
        console.error('Failed to load auth data:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // 注册
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: '请输入有效的邮箱地址' }
    }

    // 验证密码长度
    if (password.length < 6) {
      return { success: false, error: '密码至少需要6个字符' }
    }

    // 验证名称
    if (!name.trim()) {
      return { success: false, error: '请输入您的姓名' }
    }

    try {
      const result = await apiService.register(email, password, name)
      if (result.success && result.user) {
        const newUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          createdAt: Date.now(),
        }
        setUser(newUser)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
        return { success: true, user: newUser }
      }
      return { success: false, error: result.error || '注册失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '注册失败' }
    }
  }

  // 登录
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: '请输入有效的邮箱地址' }
    }

    try {
      const result = await apiService.login(email, password)
      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          createdAt: Date.now(),
        }
        setUser(userData)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
        
        // 通知 ChatContext 用户已登录（通过自定义事件）
        window.dispatchEvent(new CustomEvent('user_logged_in', { detail: userData }))
        
        return { success: true, user: userData }
      }
      return { success: false, error: result.error || '登录失败' }
    } catch (error: any) {
      return { success: false, error: error.message || '登录失败' }
    }
  }

  // 登出
  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('user_logged_out'))
  }

  // 获取所有注册用户（从服务器搜索）
  const getRegisteredUsers = (): User[] => {
    // 这个方法现在需要异步，但为了兼容性，返回空数组
    // 实际应该使用 findRegisteredUser
    return []
  }

  // 搜索注册用户
  const findRegisteredUser = async (query: string): Promise<User | null> => {
    if (!user) {
      return null
    }

    try {
      const result = await apiService.searchUsers(query, user.id)
      if (result.users && result.users.length > 0) {
        const found = result.users[0]
        return {
          id: found.id,
          email: found.email,
          name: found.name,
          createdAt: Date.now(),
        }
      }
      return null
    } catch (error) {
      console.error('搜索用户失败:', error)
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getRegisteredUsers,
        findRegisteredUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

