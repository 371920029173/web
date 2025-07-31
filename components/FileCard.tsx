'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Heart, Bookmark, Eye, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface File {
  id: string
  title: string
  description: string
  content: string
  author_id: string
  created_at: string
  likes_count: number
  favorites_count: number
  author: {
    nickname: string
    nickname_color: string
  }
}

interface FileCardProps {
  file: File
  onUpdate: () => void
}

export default function FileCard({ file, onUpdate }: FileCardProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likesCount, setLikesCount] = useState(file.likes_count)
  const [favoritesCount, setFavoritesCount] = useState(file.favorites_count)

  const handleLike = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    try {
      if (isLiked) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('file_id', file.id)
          .eq('user_id', user.id)
        
        setLikesCount(prev => prev - 1)
        setIsLiked(false)
        toast.success('已取消点赞')
      } else {
        // 点赞
        await supabase
          .from('likes')
          .insert({
            file_id: file.id,
            user_id: user.id,
          })
        
        setLikesCount(prev => prev + 1)
        setIsLiked(true)
        toast.success('点赞成功')
      }
      
      onUpdate()
    } catch (error) {
      console.error('Error handling like:', error)
      toast.error('操作失败')
    }
  }

  const handleFavorite = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    try {
      if (isFavorited) {
        // 取消收藏
        await supabase
          .from('favorites')
          .delete()
          .eq('file_id', file.id)
          .eq('user_id', user.id)
        
        setFavoritesCount(prev => prev - 1)
        setIsFavorited(false)
        toast.success('已取消收藏')
      } else {
        // 收藏
        await supabase
          .from('favorites')
          .insert({
            file_id: file.id,
            user_id: user.id,
          })
        
        setFavoritesCount(prev => prev + 1)
        setIsFavorited(true)
        toast.success('收藏成功')
      }
      
      onUpdate()
    } catch (error) {
      console.error('Error handling favorite:', error)
      toast.error('操作失败')
    }
  }

  return (
    <motion.div
      className="card p-6 hover:scale-[1.02] transition-transform duration-200"
      whileHover={{ y: -2 }}
    >
      {/* 文件标题和作者 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
            {file.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {file.description}
          </p>
          <div className="flex items-center space-x-2">
            <span 
              className="text-sm font-medium"
              style={{ color: file.author.nickname_color }}
            >
              {file.author.nickname}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(file.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              isLiked 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likesCount}</span>
          </button>

          <button
            onClick={handleFavorite}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              isFavorited 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            <span className="text-sm">{favoritesCount}</span>
          </button>
        </div>

        <Link
          href={`/file/${file.id}`}
          className="btn-primary flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>查看</span>
        </Link>
      </div>
    </motion.div>
  )
} 