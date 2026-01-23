import { motion } from 'framer-motion'
import { Heart, Sparkles, Zap } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const About = () => {
  const { t } = useLanguage()
  const features = [
    {
      icon: Sparkles,
      title: t('about.feature1.title'),
      description: t('about.feature1.desc'),
    },
    {
      icon: Zap,
      title: t('about.feature2.title'),
      description: t('about.feature2.desc'),
    },
    {
      icon: Heart,
      title: t('about.feature3.title'),
      description: t('about.feature3.desc'),
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
            {t('about.intro1')}<strong className="font-normal text-black/80 dark:text-white/80">{t('about.intro2')}</strong>{t('about.intro3')}<strong className="font-normal text-black/80 dark:text-white/80">{t('about.intro4')}</strong>{t('about.intro5')}<strong className="font-normal text-black/80 dark:text-white/80">{t('about.intro6')}</strong>{t('about.intro7')}
          </p>
          <p className="text-lg md:text-xl text-black/70 dark:text-white/70 font-light leading-relaxed whitespace-nowrap overflow-x-auto">
            {t('about.intro8')}
          </p>
          <p className="text-lg md:text-xl text-black/70 dark:text-white/70 font-light leading-relaxed max-w-3xl">
            {t('about.intro9')}
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
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-black dark:text-white">{t('about.designTitle')}</h2>
            <p className="text-base md:text-lg text-black/60 dark:text-white/60 leading-relaxed">
              {t('about.design1')}
            </p>
            <p className="text-base md:text-lg text-black/60 dark:text-white/60 leading-relaxed">
              {t('about.design2')}
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
