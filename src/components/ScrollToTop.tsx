import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 使用 setTimeout 确保 DOM 已更新
    const timer = setTimeout(() => {
      // 查找主容器元素（main）
      const mainElement = document.querySelector('main') as HTMLElement
      
      if (mainElement) {
        // 滚动主容器到顶部
        mainElement.scrollTop = 0
      }
      
      // 同时确保 window 也在顶部（以防万一）
      window.scrollTo(0, 0)
    }, 0)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

