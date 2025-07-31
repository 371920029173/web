'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const fortunes = ['大吉', '中吉', '小吉', '凶', '大凶']
const advice = {
  '大吉': {
    good: ['宜出行', '宜交友', '宜投资', '宜表白'],
    bad: ['忌争吵', '忌熬夜']
  },
  '中吉': {
    good: ['宜学习', '宜运动', '宜购物'],
    bad: ['忌冲动', '忌贪心']
  },
  '小吉': {
    good: ['宜休息', '宜读书'],
    bad: ['忌冒险', '忌急躁']
  },
  '凶': {
    good: ['宜静养', '宜反思'],
    bad: ['忌出行', '忌投资', '忌争吵']
  },
  '大凶': {
    good: ['宜祈福', '宜行善'],
    bad: ['忌外出', '忌决策', '忌冲突']
  }
}

export default function FortuneTeller() {
  const { user } = useAuth()
  const [canFortune, setCanFortune] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [fortune, setFortune] = useState('')
  const [currentAdvice, setCurrentAdvice] = useState({ good: [], bad: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkFortuneAvailability()
  }, [])

  const checkFortuneAvailability = async () => {
    if (!user) return

    try {
      const today = new Date()
      today.setHours(4, 0, 0, 0) // 东八区凌晨4点
      
      const { data, error } = await supabase
        .from('fortune_history')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .single()

      if (data) {
        setCanFortune(false)
      }
    } catch (error) {
      // 没有今天的记录，可以占卜
      setCanFortune(true)
    }
  }

  const handleFortune = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!canFortune) {
      toast.error('今天已经占卜过了，明天再来吧！')
      return
    }

    setLoading(true)

    // 模拟占卜过程
    setTimeout(async () => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
      const randomAdvice = advice[randomFortune as keyof typeof advice]

      setFortune(randomFortune)
      setCurrentAdvice(randomAdvice)
      setShowResult(true)
      setCanFortune(false)

      // 保存占卜结果
      try {
        await supabase
          .from('fortune_history')
          .insert({
            user_id: user.id,
            fortune: randomFortune,
            advice: JSON.stringify(randomAdvice),
          })

        toast.success('占卜完成！')
      } catch (error) {
        console.error('Error saving fortune:', error)
      }

      setLoading(false)
    }, 2000)
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        🔮 今日运势
      </h3>

      {!showResult ? (
        <div className="text-center">
          {canFortune ? (
            <motion.button
              onClick={handleFortune}
              disabled={loading}
              className="btn-primary w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>占卜中...</span>
                </div>
              ) : (
                '测运势'
              )}
            </motion.button>
          ) : (
            <div className="text-gray-500 text-sm">
              今天已经占卜过了
              <br />
              明天凌晨4点后可以再次占卜
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* 运势结果 */}
          <div className="text-center">
            <motion.div
              className={`text-2xl font-bold mb-2 ${
                fortune === '大吉' ? 'text-red-600' :
                fortune === '中吉' ? 'text-orange-600' :
                fortune === '小吉' ? 'text-yellow-600' :
                fortune === '凶' ? 'text-blue-600' :
                'text-purple-600'
              }`}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              {fortune}
            </motion.div>
          </div>

          {/* 宜忌建议 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">宜：</h4>
              <ul className="space-y-1">
                {currentAdvice.good.map((item, index) => (
                  <motion.li
                    key={index}
                    className="text-sm text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">忌：</h4>
              <ul className="space-y-1">
                {currentAdvice.bad.map((item, index) => (
                  <motion.li
                    key={index}
                    className="text-sm text-gray-700"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 