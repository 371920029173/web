'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { mockFiles, mockComments } from '@/lib/supabase'
import { ArrowLeft, Heart, Bookmark, Send } from 'lucide-react'
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
  content: string
  created_at: string
  user: {
    nickname: string
    nickname_color: string
  }
}

export default function FileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sendingComment, setSendingComment] = useState(false)

  useEffect(() => {
    if (params.id) {
      // 使用模拟数据
      const foundFile = mockFiles.find(f => f.id === params.id)
      if (foundFile) {
        setFile(foundFile)
        setComments(mockComments.filter(c => c.file_id === params.id))
      } else {
        toast.error('文件不存在')
        router.push('/')
      }
      setLoading(false)
    }
  }, [params.id, router])

  const handleLike = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    try {
      if (isLiked) {
        setIsLiked(false)
        setFile(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : null)
        toast.success('已取消点赞')
      } else {
        setIsLiked(true)
        setFile(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null)
        toast.success('点赞成功')
      }
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
        setIsFavorited(false)
        setFile(prev => prev ? { ...prev, favorites_count: prev.favorites_count - 1 } : null)
        toast.success('已取消收藏')
      } else {
        setIsFavorited(true)
        setFile(prev => prev ? { ...prev, favorites_count: prev.favorites_count + 1 } : null)
        toast.success('收藏成功')
      }
    } catch (error) {
      console.error('Error handling favorite:', error)
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
      toast.error('评论不能超过1000个字符')
      return
    }

    setSendingComment(true)

    try {
      // 模拟添加评论
      const newCommentObj = {
        id: Date.now().toString(),
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        user: {
          nickname: '当前用户',
          nickname_color: '#3B82F6'
        }
      }
      
      setComments(prev => [...prev, newCommentObj])
      setNewComment('')
      toast.success('评论发送成功')
    } catch (error: any) {
      console.error('Error sending comment:', error)
      toast.error(error.message || '评论发送失败')
    } finally {
      setSendingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!file) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 文件信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{file.title}</h1>
          <p className="text-gray-600 mb-4">{file.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span 
                className="font-medium"
                style={{ color: file.author.nickname_color }}
              >
                {file.author.nickname}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(file.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>

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
                <span className="text-sm">{file.likes_count}</span>
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
                <span className="text-sm">{file.favorites_count}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* 文件内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-6 paper-background"
        >
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {file.content}
            </ReactMarkdown>
          </div>
        </motion.div>

        {/* 评论区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">评论区</h3>

          {/* 评论列表 */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                还没有评论，成为第一个评论的人吧！
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span 
                          className="font-medium text-sm"
                          style={{ color: comment.user.nickname_color }}
                        >
                          {comment.user.nickname}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.created_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 评论输入 */}
          {user ? (
            <div className="border-t pt-4">
              <div className="flex space-x-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="flex-1 input-field resize-none"
                  rows={3}
                  maxLength={1000}
                />
                <button
                  onClick={handleComment}
                  disabled={sendingComment || !newComment.trim()}
                  className="btn-primary self-end"
                >
                  {sendingComment ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {newComment.length}/1000
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              请登录后发表评论
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 