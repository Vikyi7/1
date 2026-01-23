import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, CheckCircle2, Shield, FileText, ArrowRight, AlertCircle, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCredit } from '../contexts/CreditContext'
import { useTraceCode } from '../contexts/TraceCodeContext'
import { useLanguage } from '../contexts/LanguageContext'

// 动态导入 Html5Qrcode，避免 SSR 问题
let Html5Qrcode: any = null
if (typeof window !== 'undefined') {
  import('html5-qrcode').then((module) => {
    Html5Qrcode = module.Html5Qrcode
  })
}

const TraceCode = () => {
  const { addCredit } = useCredit()
  const { isCodeUsed, markCodeAsUsed } = useTraceCode()
  const { t } = useLanguage()
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [traceData, setTraceData] = useState<any>(null)
  const [inputCode, setInputCode] = useState<string>('')
  const [isCodeAlreadyUsed, setIsCodeAlreadyUsed] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [invalidCodeError, setInvalidCodeError] = useState<string | null>(null)
  const qrCodeScannerRef = useRef<any>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  // 启动二维码扫描
  const handleScan = async () => {
    // 先清空之前的错误
    setScanError(null)

    // 必须在 HTTPS 或 localhost 下才能调用摄像头（浏览器安全限制）
    if (typeof window !== 'undefined') {
      const isSecureContext =
        window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      if (!isSecureContext) {
        setScanError(t('trace.scanErrorHttp'))
        return
      }
    }

    // 检查是否支持摄像头访问
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setScanError(t('trace.scanErrorNoCamera'))
      return
    }

    try {
      setIsScanning(true)
      setScanError(null)

      // 等待 DOM 更新
      await new Promise(resolve => setTimeout(resolve, 100))

      const scannerId = 'qr-reader'
      const scannerElement = document.getElementById(scannerId)
      
      if (!scannerElement) {
        throw new Error(t('trace.scanErrorNotFound'))
      }

      // 创建扫描器实例
      const qrCodeScanner = new Html5Qrcode(scannerId)
      qrCodeScannerRef.current = qrCodeScanner

      // 开始扫描
      await qrCodeScanner.start(
        { facingMode: 'environment' }, // 使用后置摄像头
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          // 扫描成功
          handleScanSuccess(decodedText)
        },
        (_errorMessage: string) => {
          // 扫描错误（忽略，继续扫描）
          // console.log('扫描中:', _errorMessage)
        }
      )
    } catch (err: any) {
      console.error('扫描启动失败:', err)
      const errorMsg = err.message || t('trace.scanError')
      setScanError(errorMsg)
      setIsScanning(false)
      await stopScanning()
    }
  }

  // 停止扫描
  const stopScanning = async () => {
    if (qrCodeScannerRef.current) {
      try {
        await qrCodeScannerRef.current.stop()
        qrCodeScannerRef.current.clear()
      } catch (err) {
        console.error('停止扫描失败:', err)
      }
      qrCodeScannerRef.current = null
    }
    setIsScanning(false)
    setScanError(null)
  }

  // 处理扫描成功
  const handleScanSuccess = async (decodedText: string) => {
    await stopScanning()
    processTraceCode(decodedText.trim())
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 验证溯源码格式（只接受App生成的测试码）
  const isValidTraceCode = (code: string): boolean => {
    // App生成的测试码格式：XY-XXXXXXXXX-XXXXXX
    // 中间9位数字，后面6位字符
    // 例如：XY-000L3K9M2-A3B4C5
    const codeUpper = code.trim().toUpperCase()
    const pattern = /^XY-[A-Z0-9]{9}-[A-Z0-9]{6}$/
    return pattern.test(codeUpper)
  }

  // 处理溯源码查询（统一逻辑）
  const processTraceCode = (code: string) => {
    const codeUpper = code.trim().toUpperCase()
    
    // 验证码格式
    if (!isValidTraceCode(codeUpper)) {
      setInvalidCodeError(t('trace.invalidCode'))
      setScannedCode(null)
      setTraceData(null)
      setIsCodeAlreadyUsed(false)
      // 3秒后清除错误提示
      setTimeout(() => {
        setInvalidCodeError(null)
      }, 3000)
      return
    }
    
    // 清除之前的错误
    setInvalidCodeError(null)
    
    const alreadyUsed = isCodeUsed(codeUpper)
    
    setScannedCode(codeUpper)
    setIsCodeAlreadyUsed(alreadyUsed)
    
    // 模拟溯源数据（根据码生成固定的数据，确保一物一码）
    const hashSeed = codeUpper.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const blockchainHash = '0x' + Array.from({ length: 64 }, (_, i) => 
      ((hashSeed + i) % 16).toString(16)
    ).join('')
    
    setTraceData({
      merchant: '诚信鞋业',
      product: '莆田工艺鞋',
      blockchainHash,
      certificates: [
        {
          type: '原料来源',
          hash: '0x' + Array.from({ length: 16 }, (_, i) => 
            ((hashSeed + i + 1) % 16).toString(16)
          ).join(''),
          timestamp: '2024-01-15 10:30:00',
          status: 'verified'
        },
        {
          type: '制作过程',
          hash: '0x' + Array.from({ length: 16 }, (_, i) => 
            ((hashSeed + i + 2) % 16).toString(16)
          ).join(''),
          timestamp: '2024-01-16 14:20:00',
          status: 'verified'
        },
        {
          type: '质检报告',
          hash: '0x' + Array.from({ length: 16 }, (_, i) => 
            ((hashSeed + i + 3) % 16).toString(16)
          ).join(''),
          timestamp: '2024-01-17 09:15:00',
          status: 'verified'
        }
      ],
      trustLevel: 'A',
      creditScore: 95
    })
    
    // 如果码未使用，增加积分并标记为已使用
    if (!alreadyUsed) {
      addCredit(10)
      markCodeAsUsed(codeUpper)
    }
  }

  // 处理输入溯源码查询
  const handleQuery = () => {
    if (!inputCode.trim()) {
      return
    }
    
    processTraceCode(inputCode.trim())
  }

  // 处理回车键提交
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuery()
    }
  }

  return (
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300" style={{ transform: 'translateZ(0)' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* 无效码错误提示 */}
        <AnimatePresence>
          {invalidCodeError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
                <p className="text-sm text-red-600 dark:text-red-400">{invalidCodeError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 扫描区域 */}
        {!scannedCode ? (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-16"
          >
            {!isScanning ? (
            <motion.div
              className="w-64 h-64 border-2 border-dashed border-black/20 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center mb-8 cursor-pointer hover:border-black/40 dark:hover:border-white/40 transition-colors"
              onClick={handleScan}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <QrCode size={80} className="text-black/30 dark:text-white/30 mb-4" />
              <p className="text-black/50 dark:text-white/50 text-sm">{t('trace.scan')}</p>
              <p className="text-black/30 dark:text-white/30 text-xs mt-2">{t('trace.input')}</p>
            </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-64 h-64 border-2 border-solid border-black/40 dark:border-white/40 rounded-2xl mb-8 relative overflow-hidden"
              >
                <div 
                  id="qr-reader" 
                  ref={scannerContainerRef}
                  className="w-full h-full rounded-2xl overflow-hidden"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: '1rem'
                  }}
                />
                <button
                  onClick={stopScanning}
                  className="absolute top-3 right-3 p-2 bg-black/80 dark:bg-white/80 rounded-full text-white dark:text-black hover:bg-black dark:hover:bg-white transition-colors z-10 shadow-lg"
                  type="button"
                >
                  <X size={18} />
                </button>
                {scanError && (
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl z-10">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">{scanError}</p>
                    <button
                      onClick={() => {
                        setScanError(null)
                        setIsScanning(false)
                        stopScanning()
                      }}
                      className="w-full px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                    >
                      {t('trace.close')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            
            <motion.div
              variants={itemVariants}
              className="w-full max-w-md relative"
            >
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  // 确保输入框聚焦时滚动到可见区域
                  setTimeout(() => {
                    e.target.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'center',
                      inline: 'nearest'
                    })
                  }, 300)
                }}
                placeholder={t('trace.inputPlaceholder')}
                className="w-full px-6 py-4 pr-20 border border-black/20 dark:border-white/20 rounded-2xl font-light text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors bg-white dark:bg-[#060606]"
                style={{
                  scrollMarginTop: 'calc(56px + env(safe-area-inset-top) + 20px)',
                  scrollMarginBottom: 'calc(64px + max(env(safe-area-inset-bottom), 8px) + 20px)'
                }}
              />
              <AnimatePresence>
                {inputCode.trim() && (
                  <motion.button
                    key="query-button"
                    onClick={handleQuery}
                    className="absolute right-3 inset-y-2 w-10 h-10 rounded-full border-2 border-black/40 dark:border-white/40 bg-transparent flex items-center justify-center cursor-pointer hover:border-black/60 dark:hover:border-white/60 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <ArrowRight className="text-black/60 dark:text-white/60" size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 扫描相关错误提示（包括 HTTP 环境下无法调用摄像头等） */}
            <AnimatePresence>
              {scanError && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 w-full max-w-md p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={18} />
                    <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                      {scanError}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 扫描成功提示 */}
            {isCodeAlreadyUsed ? (
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-4">
                <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">{t('trace.scanSuccess')}</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('trace.code')}: {scannedCode}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{t('trace.codeUsed')}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-4">
                <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">{t('trace.querySuccess')}</p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">{t('trace.code')}: {scannedCode}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">{t('trace.earnedCredits')} 10</p>
                </div>
              </div>
            )}

            {/* 商户信息 */}
            <div className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-light mb-2 text-black dark:text-white">{traceData.merchant}</h3>
                  <p className="text-black/60 dark:text-white/60">{traceData.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600" size={24} />
                  <span className="text-lg font-medium text-green-600">{t('trace.trusted')}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-1">{t('trace.trustLevel')}</p>
                  <p className="text-2xl font-light text-black dark:text-white">{traceData.trustLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-black/40 dark:text-white/40 mb-1">{t('trace.creditScore')}</p>
                  <p className="text-2xl font-light text-black dark:text-white">{traceData.creditScore}</p>
                </div>
              </div>
            </div>

            {/* 区块链哈希 */}
            <div className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={20} className="text-black/60 dark:text-white/60" />
                <h4 className="font-medium text-black dark:text-white">{t('trace.blockchainInfo')}</h4>
              </div>
              <p className="text-xs text-black/40 dark:text-white/40 font-mono break-all">
                {traceData.blockchainHash}
              </p>
            </div>

            {/* 溯源凭证列表 */}
            <div className="space-y-4">
              <h4 className="text-xl font-light mb-4 text-black dark:text-white">{t('trace.certificates')}</h4>
              {traceData.certificates.map((cert: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white">{cert.type}</p>
                        <p className="text-xs text-black/40 dark:text-white/40 mt-1">{cert.timestamp}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {t('trace.verified')}
                    </span>
                  </div>
                  <p className="text-xs text-black/40 dark:text-white/40 font-mono break-all">
                    {t('trace.hash')}: {cert.hash}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* 重新查询按钮 */}
            <motion.button
              onClick={() => {
                setScannedCode(null)
                setTraceData(null)
                setInputCode('')
                setIsCodeAlreadyUsed(false)
              }}
              className="w-full py-3 border border-black/20 dark:border-white/20 rounded-full font-light hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
            >
              {t('trace.queryAgain')}
            </motion.button>
          </motion.div>
        )}

        {/* 说明文字 */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 bg-black/5 dark:bg-white/5 rounded-2xl transition-colors duration-300"
        >
          <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
            {t('trace.description')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TraceCode
