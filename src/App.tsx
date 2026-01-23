import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './components/Navigation'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import AnimatedRoutes from './components/AnimatedRoutes'
import { CreditProvider } from './contexts/CreditContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { TraceCodeProvider } from './contexts/TraceCodeContext'
import { ChatProvider } from './contexts/ChatContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  // Vercel 使用根路径，GitHub Pages 使用 /1/
  const basename = import.meta.env.VERCEL ? '/' : (import.meta.env.PROD ? '/1/' : '/')
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <CreditProvider>
          <TraceCodeProvider>
            <ChatProvider>
              <Router basename={basename}>
                <ScrollToTop />
          <div className="min-h-screen bg-white dark:bg-[#060606] text-black dark:text-white transition-colors duration-300" style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Header />
            <main style={{ 
              position: 'relative', 
              zIndex: 0,
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              paddingTop: 'calc(56px + env(safe-area-inset-top))',
              paddingBottom: 'calc(64px + max(env(safe-area-inset-bottom), 8px))',
              boxSizing: 'border-box',
              minHeight: '100%'
            }}>
              <AnimatedRoutes />
            </main>
            <Navigation />
          </div>
        </Router>
              </ChatProvider>
            </TraceCodeProvider>
          </CreditProvider>
        </AuthProvider>
      </ThemeProvider>
    )
}

export default App
