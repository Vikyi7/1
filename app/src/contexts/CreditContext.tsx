import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface CreditContextType {
  credit: number
  addCredit: (amount: number) => void
  resetCredit: () => void
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

const CREDITS_STORAGE_KEY = 'puyuan_credits'

// 获取所有用户的积分数据
const getAllCredits = (): { [userId: string]: number } => {
  const stored = localStorage.getItem(CREDITS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

// 保存所有用户的积分数据
const saveAllCredits = (credits: { [userId: string]: number }) => {
  localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(credits))
}

export const CreditProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [credit, setCredit] = useState<number>(0)

  // 当用户切换时，加载对应用户的积分
  useEffect(() => {
    if (user) {
      const allCredits = getAllCredits()
      const userCredit = allCredits[user.id] || 0
      setCredit(userCredit)
    } else {
      // 未登录时显示0
      setCredit(0)
    }
  }, [user])

  // 保存当前用户的积分
  const saveCredit = (userId: string, newCredit: number) => {
    const allCredits = getAllCredits()
    allCredits[userId] = newCredit
    saveAllCredits(allCredits)
    setCredit(newCredit)
  }

  const addCredit = (amount: number) => {
    if (!user) {
      console.warn('未登录用户无法获得积分')
      return
    }
    const newCredit = credit + amount
    saveCredit(user.id, newCredit)
  }

  const resetCredit = () => {
    if (!user) {
      console.warn('未登录用户无法重置积分')
      return
    }
    saveCredit(user.id, 0)
  }

  return (
    <CreditContext.Provider value={{ credit, addCredit, resetCredit }}>
      {children}
    </CreditContext.Provider>
  )
}

export const useCredit = () => {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error('useCredit must be used within a CreditProvider')
  }
  return context
}
