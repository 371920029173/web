'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Heart, Bookmark, Send, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

interface Comment {
  id: string
  file_id: string
  user_id: string
  content: string
  created_at: string
  user: {
    nickname: string
    nickname_color: string
  }
}

export default function FilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchFile()
      fetchComments()
      if (user) {
        checkLikeStatus()
        checkFavoriteStatus()
      }
    }
  }, [params.id, user])

  const fetchFile = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          author:profiles(nickname, nickname_color)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error
      setFile(data)
    } catch (error) {
      console.error('Error fetching file:', error)
      toast.error('获取文件失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(nickname, nickname_color)
        `)
        .eq('file_id', params.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const checkLikeStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('file_id', params.id)
        .eq('user_id', user?.id)
        .single()

      if (!error && data) {
        setIsLiked(true)
      }
    } catch (error) {
      // 用户未点赞
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('file_id', params.id)
        .eq('user_id', user?.id)
        .single()

      if (!error && data) {
        setIsFavorited(true)
      }
    } catch (error) {
      // 用户未收藏
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('file_id', params.id)
          .eq('user_id', user.id)
        
        setIsLiked(false)
        setFile(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : null)
        toast.success('取消点赞')
      } else {
        await supabase
          .from('likes')
          .insert({
            file_id: params.id,
            user_id: user.id
          })
        
        setIsLiked(true)
        setFile(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null)
        toast.success('点赞成功')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
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
        await supabase
          .from('favorites')
          .delete()
          .eq('file_id', params.id)
          .eq('user_id', user.id)
        
        setIsFavorited(false)
        setFile(prev => prev ? { ...prev, favorites_count: prev.favorites_count - 1 } : null)
        toast.success('取消收藏')
      } else {
        await supabase
          .from('favorites')
          .insert({
            file_id: params.id,
            user_id: user.id
          })
        
        setIsFavorited(true)
        setFile(prev => prev ? { ...prev, favorites_count: prev.favorites_count + 1 } : null)
        toast.success('收藏成功')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('操作失败')
    }
  }

  const handleComment = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!newComment.trim()) {
      toast.error('请输入评论内容')
      return
    }

    if (newComment.length > 1000) {
      toast.error('评论长度不能超过1000字符')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          file_id: params.id,
          user_id: user.id,
          content: newComment.trim()
        })

      if (error) throw error

      setNewComment('')
      await fetchComments()
      toast.success('评论成功')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文件不存在</h1>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回首页</span>
        </button>

        {/* 文件内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* 文件头部 */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{file.title}</h1>
            <p className="text-primary-100 mb-4">{file.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  作者: <span style={{ color: file.author.nickname_color }}>{file.author.nickname}</span>
                </span>
                <span className="text-sm">
                  发布时间: {new Date(file.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{file.likes_count}</span>
                </button>
                <button
                  onClick={handleFavorite}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                    isFavorited ? 'bg-yellow-500 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{file.favorites_count}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 文件内容 */}
          <div className="p-8 paper-background">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {file.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* 评论区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">评论区</h2>
          
          {/* 评论列表 */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">还没有评论，成为第一个评论的人吧！</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span 
                          className="font-medium"
                          style={{ color: comment.user.nickname_color }}
                        >
                          {comment.user.nickname}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 评论输入 */}
          {user ? (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论... (最多1000字符)"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={1000}
                />
                <button
                  onClick={handleComment}
                  disabled={submitting || !newComment.trim()}
                  className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '发送中...' : (
                    <>
                      <Send className="h-4 w-4" />
                      发送
                    </>
                  )}
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-2 text-right">
                {newComment.length}/1000
              </div>
            </div>
          ) : (
            <div className="text-center py-6 border-t border-gray-200">
              <p className="text-gray-500 mb-4">登录后才能发表评论</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                去登录
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 