'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Upload, ArrowLeft, Image, Video, Music, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface FilePreview {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  size: number
}

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<FilePreview[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    selectedFiles.forEach(file => {
      const fileType = getFileType(file.type)
      if (fileType) {
        const preview: FilePreview = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: fileType,
          url: URL.createObjectURL(file),
          size: file.size
        }
        setFiles(prev => [...prev, preview])
      }
    })
  }

  const getFileType = (mimeType: string): 'image' | 'video' | 'audio' | 'document' | null => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('document') || mimeType.includes('pdf') || mimeType.includes('text')) return 'document'
    return null
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!title.trim() || !description.trim()) {
      toast.error('请填写标题和简介')
      return
    }

    if (files.length === 0 && !content.trim()) {
      toast.error('请上传文件或输入内容')
      return
    }

    setUploading(true)

    try {
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('文件上传成功！')
      router.push('/')
    } catch (error) {
      toast.error('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  const renderFilePreview = (file: FilePreview) => {
    const getIcon = () => {
      switch (file.type) {
        case 'image': return <Image className="h-4 w-4" />
        case 'video': return <Video className="h-4 w-4" />
        case 'audio': return <Music className="h-4 w-4" />
        case 'document': return <FileText className="h-4 w-4" />
      }
    }

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
      <motion.div
        key={file.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gray-50 rounded-lg p-4 border"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={() => removeFile(file.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            ×
          </button>
        </div>

        {/* 文件预览 */}
        {file.type === 'image' && (
          <div className="mt-3">
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full h-32 object-cover rounded border"
            />
          </div>
        )}
        
        {file.type === 'video' && (
          <div className="mt-3">
            <video
              src={file.url}
              controls
              className="max-w-full h-32 object-cover rounded border"
            />
          </div>
        )}
        
        {file.type === 'audio' && (
          <div className="mt-3">
            <audio
              src={file.url}
              controls
              className="w-full"
            />
          </div>
        )}
      </motion.div>
    )
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
            <h1 className="ml-4 text-xl font-semibold text-gray-900">上传文件</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
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
            </div>

            {/* 文件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                上传文件
                <span className="text-xs text-gray-500 ml-2">
                  （支持图片、视频、音频、文档）
                </span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*,.doc,.docx,.pdf,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="btn-primary">
                      选择文件
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    拖拽文件到此处或点击选择
                  </p>
                </div>
              </div>

              {/* 文件预览 */}
              {files.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">已选择的文件：</h4>
                  {files.map(renderFilePreview)}
                </div>
              )}
            </div>

            {/* 内容编辑 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容描述
                <span className="text-xs text-gray-500 ml-2">（支持Markdown格式）</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[200px] resize-y"
                placeholder="请输入文件内容描述，支持Markdown格式..."
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>上传中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>上传文件</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
} 