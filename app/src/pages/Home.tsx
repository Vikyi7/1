import { motion } from 'framer-motion'
import { Sparkles, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

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

  return (
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300" style={{ transform: 'translateZ(0)' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-8 border border-black/10 dark:border-white/10 rounded-2xl cursor-pointer overflow-hidden bg-white dark:bg-[#060606] transition-colors duration-300"
            onClick={() => navigate('/trace')}
          >
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <QrCode className="mb-4 text-black/40 dark:text-white/40" size={32} />
              <h3 className="text-xl font-medium mb-2 text-black dark:text-white">溯源码</h3>
              <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed">
              扫描溯源码查看区块链存证信息
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-8 border border-black/10 dark:border-white/10 rounded-2xl cursor-pointer overflow-hidden bg-white dark:bg-[#060606] transition-colors duration-300"
            onClick={() => navigate('/gallery')}
          >
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className="mb-4 text-black/40 dark:text-white/40" size={32} />
            <h3 className="text-xl font-medium mb-2 text-black dark:text-white">地区</h3>
            <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed">
              探索莆田各区县的详细分类与特色
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-8 border border-black/10 dark:border-white/10 rounded-2xl cursor-pointer overflow-hidden bg-white dark:bg-[#060606] transition-colors duration-300"
            onClick={() => navigate('/about')}
          >
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-8 h-8 mb-4 border-2 border-black/40 dark:border-white/40 rounded-full" />
            <h3 className="text-xl font-medium mb-2 text-black dark:text-white">关于我们</h3>
            <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed">
              了解缘心福的设计理念
            </p>
          </motion.div>
        </div>

        {/* 装饰线条 */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mt-16"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
          <motion.div
            className="w-2 h-2 border border-black/30 dark:border-white/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ willChange: 'transform, opacity' }}
          />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home
