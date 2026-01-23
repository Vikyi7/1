import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

// iOS 风格的动画配置
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20, // 从顶部稍微向下开始（iOS 风格）
    scale: 0.98 // 轻微缩放效果
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -10, // 退出时向上移动
    scale: 0.98
  }
}

// iOS 风格的过渡配置
const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0.0, 0.2, 1.0], // iOS 标准缓动曲线 (cubic-bezier)
  duration: 0.35 // 350ms，iOS 标准动画时长
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        width: '100%',
        height: '100%',
        willChange: 'transform, opacity' // 优化性能
      }}
    >
      {children}
    </motion.div>
  )
}

