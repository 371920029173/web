'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { X, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error('请填写完整信息')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('files')
        .insert({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          author_id: user.id,
          likes_count: 0,
          favorites_count: 0,
        })

      if (error) throw error

      toast.success('文件上传成功！')
      onSuccess()
      onClose()
      
      // 重置表单
      setTitle('')
      setDescription('')
      setContent('')
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast.error(error.message || '上传失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Upload className="h-6 w-6" />
                <span>上传文件</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题 <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">（最多20字）</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="请输入文件标题"
                  required
                  maxLength={20}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {title.length}/20
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  简介 <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">（最多30字）</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  placeholder="请输入文件简介"
                  required
                  maxLength={30}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {description.length}/30
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容 <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">（支持Markdown格式）</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field min-h-[200px] resize-y"
                  placeholder="请输入文件内容，支持Markdown格式..."
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  支持Markdown语法，可以包含文字、图片链接等
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>上传中...</span>
                    </div>
                  ) : (
                    '上传文件'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 