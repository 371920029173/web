'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Search, Plus, Heart, Bookmark, MessageCircle, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FileCard from '@/components/FileCard'
import FortuneTeller from '@/components/FortuneTeller'
import LoginModal from '@/components/LoginModal'
import UploadModal from '@/components/UploadModal'
import MessageModal from '@/components/MessageModal'

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

export default function HomePage() {
  const { user, signOut } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFiles, setFilteredFiles] = useState<File[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFiles(files)
    } else {
      const filtered = files.filter(file =>
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredFiles(filtered)
    }
  }, [searchQuery, files])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          author:profiles(nickname, nickname_color)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('获取文件列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('已退出登录')
    } catch (error) {
      toast.error('退出登录失败')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部广告栏 */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 text-center">
        <div className="animate-pulse">
          🎉 欢迎来到文件分享平台！在这里分享你的想法和创意 🎉
        </div>
      </div>

      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">文件分享平台</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索文件..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>

              {/* 用户菜单 */}
              <div className="flex items-center space-x-2">
                {user ? (
                  <>
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      title="私信"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="btn-primary flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>上传</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-700">{user.email}</span>
                      <button
                        onClick={handleSignOut}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                        title="退出登录"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="btn-primary"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchQuery ? '没有找到相关文件' : '还没有文件'}
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery ? '尝试使用其他关键词搜索' : '成为第一个上传文件的人吧！'}
                    </p>
                  </div>
                ) : (
                  filteredFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FileCard file={file} onUpdate={fetchFiles} />
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* 占卜系统 */}
              <FortuneTeller />
            </div>
          </div>
        </div>
      </div>

      {/* 模态框 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={fetchFiles}
      />
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      />
    </div>
  )
} 