import { motion } from 'framer-motion'
import { Heart, Sparkles, Zap } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: '极简设计',
      description: '去除冗余，保留本质，每一根线条都经过精心设计',
    },
    {
      icon: Zap,
      title: '流畅交互',
      description: '参考iOS设计规范，带来丝滑般的用户体验',
    },
    {
      icon: Heart,
      title: '艺术美学',
      description: '在数字世界中寻找内心的宁静与平衡',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >

        <motion.div
          variants={itemVariants}
          className="mb-16 space-y-6"
        >
          <p className="text-lg md:text-xl text-black/70 dark:text-white/70 font-light leading-relaxed max-w-3xl">
            缘心福致力于运用<strong className="font-normal text-black/80 dark:text-white/80">区块链</strong>、<strong className="font-normal text-black/80 dark:text-white/80">数字资产（NFT）</strong>与<strong className="font-normal text-black/80 dark:text-white/80">社区共识（DAO）</strong>等Web3核心技术
          </p>
          <p className="text-lg md:text-xl text-black/70 dark:text-white/70 font-light leading-relaxed whitespace-nowrap overflow-x-auto">
            为福建深厚的特色产业（如工艺美术、鞋服制造、农产品、跨境贸易）构建可信的数字基石
          </p>
          <p className="text-lg md:text-xl text-black/70 dark:text-white/70 font-light leading-relaxed max-w-3xl">
            推动实体产业与数字经济的深度融合
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="p-8 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
            >
              <feature.icon
                className="mb-4 text-black/40 dark:text-white/40"
                size={32}
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-medium mb-2 text-black dark:text-white">{feature.title}</h3>
              <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="p-10 md:p-12 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#060606] transition-colors duration-300"
        >
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-black dark:text-white">设计理念</h2>
            <p className="text-base md:text-lg text-black/60 dark:text-white/60 leading-relaxed">
              根源于莆阳，心之天下福。
            </p>
            <p className="text-base md:text-lg text-black/60 dark:text-white/60 leading-relaxed">
              不止于根源，福于千万里，方为缘心福。
            </p>
          </div>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1 h-1 bg-black/30 dark:bg-white/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="w-1 h-1 bg-black/30 dark:bg-white/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.2,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="w-1 h-1 bg-black/30 dark:bg-white/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.4,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default About
