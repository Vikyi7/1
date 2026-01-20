import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TraceCodeContextType {
  usedCodes: Set<string>
  isCodeUsed: (code: string) => boolean
  markCodeAsUsed: (code: string) => void
  generateTestCode: () => string
  generateTestCodes: (count: number) => string[]
}

const TraceCodeContext = createContext<TraceCodeContextType | undefined>(undefined)

const USED_CODES_STORAGE_KEY = 'puyuan_used_trace_codes'

export const TraceCodeProvider = ({ children }: { children: ReactNode }) => {
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set())

  // 从 localStorage 加载已使用的溯源码
  useEffect(() => {
    const savedCodes = localStorage.getItem(USED_CODES_STORAGE_KEY)
    if (savedCodes) {
      try {
        const codesArray = JSON.parse(savedCodes) as string[]
        setUsedCodes(new Set(codesArray))
      } catch (error) {
        console.error('Failed to load used trace codes:', error)
      }
    }
  }, [])

  // 保存已使用的溯源码到 localStorage
  const saveUsedCodes = (codes: Set<string>) => {
    setUsedCodes(codes)
    localStorage.setItem(USED_CODES_STORAGE_KEY, JSON.stringify(Array.from(codes)))
  }

  const isCodeUsed = (code: string): boolean => {
    return usedCodes.has(code)
  }

  const markCodeAsUsed = (code: string) => {
    const newUsedCodes = new Set(usedCodes)
    newUsedCodes.add(code)
    saveUsedCodes(newUsedCodes)
  }

  // 生成单个测试溯源码
  const generateTestCode = (): string => {
    const timestamp = Date.now()
    // 中间部分：9位数字（使用时间戳转换为36进制，不足9位前面补0）
    const middlePart = timestamp.toString(36).toUpperCase().padStart(9, '0').slice(-9)
    // 后面部分：6位随机字符
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `XY-${middlePart}-${random}`
  }

  // 生成多个测试溯源码
  const generateTestCodes = (count: number): string[] => {
    const codes: string[] = []
    const existingCodes = new Set(usedCodes)
    
    for (let i = 0; i < count; i++) {
      let code: string
      do {
        code = generateTestCode()
      } while (existingCodes.has(code))
      
      codes.push(code)
      existingCodes.add(code)
    }
    
    return codes
  }

  return (
    <TraceCodeContext.Provider
      value={{
        usedCodes,
        isCodeUsed,
        markCodeAsUsed,
        generateTestCode,
        generateTestCodes,
      }}
    >
      {children}
    </TraceCodeContext.Provider>
  )
}

export const useTraceCode = () => {
  const context = useContext(TraceCodeContext)
  if (context === undefined) {
    throw new Error('useTraceCode must be used within a TraceCodeProvider')
  }
  return context
}
