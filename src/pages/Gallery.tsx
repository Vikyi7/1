import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, MapPin, Building, Waves } from 'lucide-react'

interface CategoryItem {
  name: string
  address: string
}

interface RegionCategory {
  name: string
  items: CategoryItem[]
}

interface Region {
  id: number
  title: string
  subtitle: string
  description: string
  color: string
  categories: RegionCategory[]
  location: string
  area: string
  population: string
}

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const regions: Region[] = [
    {
      id: 1,
      title: '城厢区',
      subtitle: '政治经济文化中心',
      description: '莆田市中心城区，是市政府所在地，政治、经济、文化中心',
      color: 'bg-gradient-to-br from-black/5 to-black/10',
      location: '莆田市中部',
      area: '509平方公里',
      population: '约45万人',
      categories: [
        {
          name: '行政中心',
          items: [
            { name: '莆田市人民政府', address: '莆田市城厢区荔城中大道2169号' },
            { name: '莆田市城厢区人民政府', address: '莆田市城厢区荔华东大道269号' },
            { name: '莆田市行政服务中心', address: '莆田市城厢区荔城中大道1998号' },
            { name: '莆田市公安局城厢分局', address: '莆田市城厢区学园中街61号' },
            { name: '城厢区教育局', address: '莆田市城厢区荔城中大道750号' }
          ]
        },
        {
          name: '商业中心',
          items: [
            { name: '万达广场', address: '莆田市城厢区荔华东大道8号' },
            { name: '文献步行街', address: '莆田市城厢区文献路与胜利路交汇处' },
            { name: '大唐广场', address: '莆田市城厢区新街口' },
            { name: '联创国际广场', address: '莆田市城厢区荔园东路与胜利南路交叉口东南侧' },
            { name: '正荣时代广场', address: '莆田市城厢区东园西路与学园中街交汇处' },
            { name: '喜盈门建材家具广场', address: '莆田市城厢区荔园东路199号' }
          ]
        },
        {
          name: '教育文化',
          items: [
            { name: '莆田第一中学（学园校区）', address: '莆田市城厢区学园南街1699号' },
            { name: '莆田第五中学', address: '莆田市城厢区梅山街355号' },
            { name: '莆田市城厢区第一实验小学', address: '莆田市城厢区荔城北大道1639号' },
            { name: '莆田市博物馆', address: '莆田市城厢区荔城北大道' },
            { name: '城厢区文化馆', address: '莆田市城厢区学园中街1909弄' }
          ]
        },
        {
          name: '医疗设施',
          items: [
            { name: '莆田市第一医院', address: '莆田市城厢区南门西路449号' },
            { name: '莆田市妇幼保健院', address: '莆田市城厢区后巷8号' },
            { name: '莆田市城厢区医院', address: '莆田市城厢区八二一南街1166号' },
            { name: '城厢区疾病预防控制中心', address: '莆田市城厢区荔园东路西50米' },
            { name: '莆田妇产专科医院', address: '莆田市城厢区胜利路63号' }
          ]
        },
        {
          name: '菜市场',
          items: [
            { name: '南门菜市场', address: '莆田市城厢区南门西路与文献西路交叉口西南侧' },
            { name: '龙桥市场', address: '莆田市城厢区龙桥街道荔城北大道旁' }
          ]
        },
        {
          name: '休闲娱乐',
          items: [
            { name: '凤凰山公园', address: '莆田市城厢区文献西路凤凰山' },
            { name: '绶溪公园（城厢区段）', address: '莆田市城厢区荔城北大道绶溪公园' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: '荔城区',
      subtitle: '历史文化名城',
      description: '莆田历史文化核心区，文化底蕴深厚',
      color: 'bg-gradient-to-br from-black/5 via-black/10 to-black/5',
      location: '莆田市东南部',
      area: '269平方公里',
      population: '约50万人',
      categories: [
        {
          name: '行政中心',
          items: [
            { name: '莆田市荔城区人民政府', address: '莆田市荔城区镇海街道县巷63号' },
            { name: '莆田市公安局荔城分局', address: '莆田市荔城区拱辰街道东园东路999号' },
            { name: '荔城区行政服务中心', address: '莆田市荔城区拱辰街道胜利北街1188号' }
          ]
        },
        {
          name: '商业中心',
          items: [
            { name: '正荣财富中心', address: '莆田市荔城区荔园东路1688号' },
            { name: '金鼎广场', address: '莆田市荔城区仓后路48号' },
            { name: '莆田红星美凯龙全球家居生活广场', address: '莆田市荔城区拱辰街道东圳东路1118号' }
          ]
        },
        {
          name: '教育文化',
          items: [
            { name: '莆田第四中学（新校区）', address: '莆田市荔城区拱辰街道延寿北街' },
            { name: '荔城区第一实验小学', address: '莆田市荔城区镇海街道胜利北街1258号' },
            { name: '荔城区文化馆', address: '莆田市荔城区镇海街道文献东路1938号' }
          ]
        },
        {
          name: '医疗设施',
          items: [
            { name: '莆田学院附属医院（新院区）', address: '莆田市荔城区东圳东路999号' },
            { name: '荔城区医院', address: '莆田市荔城区镇海街道胜利南街339号' },
            { name: '荔城区黄石镇卫生院', address: '莆田市荔城区黄石镇梧埕巷88号' }
          ]
        },
        {
          name: '菜市场',
          items: [
            { name: '镇海市场', address: '莆田市荔城区镇海街道镇海巷与县巷交叉口东北侧' },
            { name: '黄石菜市场', address: '莆田市荔城区黄石镇黄石街' }
          ]
        },
        {
          name: '休闲娱乐',
          items: [
            { name: '玉湖公园', address: '莆田市荔城区玉湖路与尚济街交叉口东南侧' },
            { name: '莆田市体育中心（荔城片区）', address: '莆田市荔城区拱辰街道镇海中街989号' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: '涵江区',
      subtitle: '工业重镇 港口经济',
      description: '莆田市重要的工业基地和港口经济区，制造业发达',
      color: 'bg-gradient-to-br from-black/10 to-black/5',
      location: '莆田市东北部',
      area: '752平方公里',
      population: '约42万人',
      categories: [
        {
          name: '行政中心',
          items: [
            { name: '莆田市涵江区人民政府', address: '莆田市涵江区涵东街道兴涵街1号' },
            { name: '涵江区行政服务中心', address: '莆田市涵江区新涵大街与国欢路交叉口涵城领域3楼' },
            { name: '莆田市公安局涵江分局', address: '莆田市涵江区涵东街道新区二路1号' }
          ]
        },
        {
          name: '商业中心',
          items: [
            { name: '涵江商业城', address: '莆田市涵江区保尾路与工业路交叉口' },
            { name: '双洋蓝宝湾商业广场', address: '莆田市涵江区鉴前路与河滨路交叉口北侧' },
            { name: '涵江隆恒财富广场', address: '莆田市涵江区塘北片区六一西路' }
          ]
        },
        {
          name: '教育文化',
          items: [
            { name: '莆田第十四中学', address: '莆田市涵江区涵东街道鉴前路175号' },
            { name: '涵江区实验小学', address: '莆田市涵江区涵东街道保尾路66号' },
            { name: '囊山慈寿寺', address: '莆田市涵江区江口镇囊山村' }
          ]
        },
        {
          name: '医疗设施',
          items: [
            { name: '涵江医院', address: '莆田市涵江区国欢镇国欢西路2836号' },
            { name: '莆田华侨医院', address: '莆田市涵江区江口镇石庭西路869号' },
            { name: '莆田市涵江区大洋乡卫生院', address: '莆田市涵江区大洋乡大洋村首林路16号' }
          ]
        },
        {
          name: '菜市场',
          items: [
            { name: '涵江保尾市场', address: '莆田市涵江区涵东街道保尾路' },
            { name: '江口市场', address: '莆田市涵江区江口镇江口街' }
          ]
        },
        {
          name: '休闲娱乐',
          items: [
            { name: '白塘湖公园', address: '莆田市涵江区白塘镇白塘湖旁' },
            { name: '涵江人民公园', address: '莆田市涵江区涵东街道新区二路' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: '秀屿区',
      subtitle: '港口新区 临港工业',
      description: '新兴港口城市，临港工业发达，是莆田对外开放的重要窗口',
      color: 'bg-gradient-to-br from-black/10 to-black/5',
      location: '莆田市南部',
      area: '390平方公里',
      population: '约35万人',
      categories: [
        {
          name: '行政中心',
          items: [
            { name: '莆田市秀屿区人民政府', address: '莆田市秀屿区笏石街道人民政府路1号' },
            { name: '秀屿区行政服务中心', address: '莆田市秀屿区兴秀路1333号司法楼1层' },
            { name: '莆田市公安局秀屿分局', address: '莆田市秀屿区笏石街道笏枫大道1999号' }
          ]
        },
        {
          name: '商业中心',
          items: [
            { name: '上塘珠宝城交易中心', address: '莆田市秀屿区东峤镇上塘珠宝城园区内' },
            { name: '秀屿笏石商业中心', address: '莆田市秀屿区笏石街道北埔社区' }
          ]
        },
        {
          name: '教育文化',
          items: [
            { name: '莆田第二十五中学', address: '莆田市秀屿区大坵村大坵666号' },
            { name: '秀屿区实验小学', address: '莆田市秀屿区笏石街道毓秀东路' },
            { name: '秀屿区文化馆', address: '莆田市秀屿区笏石街道兴秀路' }
          ]
        },
        {
          name: '医疗设施',
          items: [
            { name: '秀屿区医院', address: '莆田市秀屿区笏石街道秀山村' },
            { name: '秀屿区埭头镇中心卫生院', address: '莆田市秀屿区埭头镇西湖路33号' },
            { name: '秀屿区南日镇卫生院', address: '莆田市秀屿区南日镇海山村山边110号' }
          ]
        },
        {
          name: '菜市场',
          items: [
            { name: '笏石市场', address: '莆田市秀屿区笏石街道北埔社区笏石街' },
            { name: '埭头市场', address: '莆田市秀屿区埭头镇埭头街' }
          ]
        },
        {
          name: '休闲娱乐',
          items: [
            { name: '秀屿区市政公园', address: '莆田市秀屿区笏石街道毓秀东路' },
            { name: '南日岛海滩休闲区', address: '莆田市秀屿区南日镇东岱村' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: '仙游县',
      subtitle: '工艺美术之乡',
      description: '中国古典工艺家具之都，工艺美术产业发达，文化底蕴深厚',
      color: 'bg-gradient-to-br from-black/5 to-black/10',
      location: '莆田市西部',
      area: '1835平方公里',
      population: '约110万人',
      categories: [
        {
          name: '行政中心',
          items: [
            { name: '仙游县人民政府', address: '莆田市仙游县鲤城街道清源东路1号' },
            { name: '仙游县行政服务中心', address: '莆田市仙游县鲤城街道坝垅社区清源东路2号1楼' },
            { name: '仙游县公安局', address: '莆田市仙游县鲤城街道八二五大街959号' }
          ]
        },
        {
          name: '商业中心',
          items: [
            { name: '仙游县鲤中步行街', address: '莆田市仙游县鲤城街道八二五大街' },
            { name: '中国古典工艺博览城', address: '莆田市仙游县鲤南镇紫檀南街666号' },
            { name: '仙游天博城市广场', address: '莆田市仙游县鲤南镇柳安街888号' }
          ]
        },
        {
          name: '教育文化',
          items: [
            { name: '仙游第一中学', address: '莆田市仙游县鲤城街道学府西路199号' },
            { name: '仙游县实验小学', address: '莆田市仙游县鲤城街道解放东路189号' },
            { name: '仙游县博物馆', address: '莆田市仙游县鲤城街道文庙内' }
          ]
        },
        {
          name: '医疗设施',
          items: [
            { name: '仙游县总医院', address: '莆田市仙游县鲤城镇八二五大街910号' },
            { name: '仙游县妇幼保健院', address: '莆田市仙游县鲤南镇仙安村温泉东路596号' },
            { name: '仙游县榜头镇中心卫生院', address: '莆田市仙游县榜头镇九鲤南街102号' }
          ]
        },
        {
          name: '菜市场',
          items: [
            { name: '仙游县中心市场', address: '莆田市仙游县鲤城街道解放东路' },
            { name: '榜头市场', address: '莆田市仙游县榜头镇九鲤南街' }
          ]
        },
        {
          name: '休闲娱乐',
          items: [
            { name: '仙游县体育公园', address: '莆田市仙游县鲤南镇玉田社区' },
            { name: '九鲤湖风景区（仙游段）', address: '莆田市仙游县钟山镇湖亭村' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: '湄洲岛管委会',
      subtitle: '妈祖文化圣地',
      description: '妈祖文化的发源地，国家级旅游度假区',
      color: 'bg-gradient-to-br from-black/5 to-black/10',
      location: '莆田市东南部海域',
      area: '14.35平方公里',
      population: '约3.8万人',
      categories: [
        {
          name: '行政中心',
          items: [
            { name: '湄洲岛国家旅游度假区管委会', address: '莆田市秀屿区湄洲镇湄洲大道1588号' },
            { name: '湄洲镇综合便民服务中心', address: '莆田市秀屿区湄洲镇湄洲大道' }
          ]
        },
        {
          name: '商业中心',
          items: [
            { name: '湄洲岛北埭商业街', address: '莆田市秀屿区湄洲镇北埭村' },
            { name: '湄洲岛莲池澳风情街', address: '莆田市秀屿区湄洲镇莲池澳沙滩旁' }
          ]
        },
        {
          name: '教育文化',
          items: [
            { name: '莆田妈祖中学', address: '莆田市秀屿区湄洲镇兴岛路285号' },
            { name: '湄洲岛妈祖文化陈列馆', address: '莆田市秀屿区湄洲镇妈祖祖庙内' }
          ]
        },
        {
          name: '医疗设施',
          items: [
            { name: '湄洲岛卫生院', address: '莆田市秀屿区湄洲镇高朱村兴业街179号' }
          ]
        },
        {
          name: '菜市场',
          items: [
            { name: '湄洲镇市场', address: '莆田市秀屿区湄洲镇湄洲大道旁' }
          ]
        },
        {
          name: '休闲娱乐',
          items: [
            { name: '湄洲岛黄金沙滩', address: '莆田市秀屿区湄洲镇港楼村' },
            { name: '妈祖文化园', address: '莆田市秀屿区湄洲镇妈祖祖庙后山' }
          ]
        }
      ]
    }
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
    <div className="min-h-full px-6 py-6 bg-white dark:bg-[#060606] transition-colors duration-300" style={{ transform: 'translateZ(0)' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >

        {/* 地区卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region, index) => (
            <motion.div
              key={region.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedIndex(index)}
              className="p-8 border border-black/10 dark:border-white/10 rounded-2xl cursor-pointer group bg-white dark:bg-[#060606] transition-colors duration-300"
            >
              {/* 内容区域 */}
              <h3 className="text-xl font-medium mb-2 text-black dark:text-white">{region.title}</h3>
              <p className="text-sm text-black/50 dark:text-white/50 mb-3 font-medium">{region.subtitle}</p>
              <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed">
                {region.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 全屏查看模态框 */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-[#060606] overflow-y-auto transition-colors duration-300"
            onClick={() => setSelectedIndex(null)}
          >
            <div className="min-h-screen flex items-start justify-center p-4 md:p-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative max-w-4xl w-full my-8"
                onClick={(e) => e.stopPropagation()}
              >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-0 right-0 z-10 p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>

              {/* 头部区域 */}
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 mb-6">
                <div
                  className={`w-full h-full ${regions[selectedIndex].color} flex items-center justify-center`}
                >
                  <svg
                    className="w-32 h-32 text-black/15"
                    viewBox="0 0 200 200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M 50 50 L 150 50 L 150 150 L 50 150 Z" />
                    <circle cx="100" cy="100" r="30" />
                  </svg>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="mb-8">
                {/* 标题区域 */}
                <div className="mb-6 pb-6 border-b border-black/10 dark:border-white/10">
                  <h2 className="text-3xl md:text-4xl font-light mb-2 text-black dark:text-white">
                    {regions[selectedIndex].title}
                  </h2>
                  <p className="text-lg md:text-xl text-black/60 dark:text-white/60 mb-3 font-medium">
                    {regions[selectedIndex].subtitle}
                  </p>
                  <p className="text-base text-black/50 dark:text-white/50 leading-relaxed">
                    {regions[selectedIndex].description}
                  </p>
                </div>
                
                {/* 基本信息卡片 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-black/50 dark:text-white/50" />
                    </div>
                    <div>
                      <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">地理位置</p>
                      <p className="text-sm font-medium text-black/80 dark:text-white/80">{regions[selectedIndex].location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Building size={18} className="text-black/50 dark:text-white/50" />
                    </div>
                    <div>
                      <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">面积</p>
                      <p className="text-sm font-medium text-black/80 dark:text-white/80">{regions[selectedIndex].area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Waves size={18} className="text-black/50 dark:text-white/50" />
                    </div>
                    <div>
                      <p className="text-xs text-black/40 dark:text-white/40 mb-0.5">人口</p>
                      <p className="text-sm font-medium text-black/80 dark:text-white/80">{regions[selectedIndex].population}</p>
                    </div>
                  </div>
                </div>

                {/* 详细分类 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black/80 dark:text-white/80 mb-4">详细分类</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regions[selectedIndex].categories.map((category, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-[#060606] hover:bg-black/2 dark:hover:bg-white/2 transition-colors duration-200"
                      >
                        <h4 className="text-base font-semibold mb-3 text-black/90 dark:text-white/90 pb-2 border-b border-black/5 dark:border-white/5">
                          {category.name}
                        </h4>
                        <div className="space-y-2">
                          {category.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-3 rounded-lg bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/12 dark:hover:border-white/12 transition-all duration-200"
                            >
                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-black/50 dark:text-white/50 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-black/80 dark:text-white/80 mb-0.5">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                                    {item.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Gallery
