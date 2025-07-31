'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdBannerProps {
  ads: {
    id: string
    content: string
    link?: string
    backgroundColor?: string
    textColor?: string
  }[]
  interval?: number
}

export default function AdBanner({ ads, interval = 5000 }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    if (ads.length <= 1) return

    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, interval)

    return () => clearInterval(timer)
  }, [ads.length, interval])

  if (ads.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 text-center rounded-lg">
        <div className="animate-pulse">
          🎉 欢迎来到文件分享平台！在这里分享你的想法和创意 🎉
        </div>
      </div>
    )
  }

  const currentAd = ads[currentAdIndex]

  return (
    <div className="relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="py-2 px-4 text-center cursor-pointer"
          style={{
            backgroundColor: currentAd.backgroundColor || 'linear-gradient(to right, #3B82F6, #8B5CF6)',
            color: currentAd.textColor || '#FFFFFF'
          }}
          onClick={() => {
            if (currentAd.link) {
              window.open(currentAd.link, '_blank')
            }
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-medium">{currentAd.content}</span>
            {ads.length > 1 && (
              <div className="flex space-x-1">
                {ads.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentAdIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 