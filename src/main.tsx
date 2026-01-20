import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

// 检查根元素是否存在
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('找不到根元素 #root')
}

// 调试信息
const basename = import.meta.env.PROD ? '/-/' : '/'
console.log('应用启动中...')
console.log('当前路径:', window.location.pathname)
console.log('Base路径:', basename)
console.log('环境:', import.meta.env.MODE)

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
  console.log('应用渲染成功')
} catch (error) {
  console.error('应用渲染失败:', error)
  throw error
}
