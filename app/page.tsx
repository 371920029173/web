'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { mockFiles } from '@/lib/supabase'
import { Search, Plus, Heart, Bookmark, MessageCircle, User, LogOut, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FileCard from '@/components/FileCard'
import FortuneTeller from '@/components/FortuneTeller'
import LoginModal from '@/components/LoginModal'
import UploadModal from '@/components/UploadModal'
import MessageModal from '@/components/MessageModal'
import AdBanner from '@/components/AdBanner'
import Sidebar from '@/components/Sidebar'

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

// 模拟广告数据
const ads = [
  {
    id: '1',
    content: '🎉 欢迎来到文件分享平台！在这里分享你的想法和创意 🎉',
    backgroundColor: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
    textColor: '#FFFFFF'
  },
  {
    id: '2',
    content: '📚 学习Markdown语法，让你的文档更专业！',
    backgroundColor: 'linear-gradient(to right, #10B981, #059669)',
    textColor: '#FFFFFF'
  },
  {
    id: '3',
    content: '🔮 每日占卜，了解今日运势！',
    backgroundColor: 'linear-gradient(to right, #F59E0B, #D97706)',
    textColor: '#FFFFFF'
  }
]

export default function HomePage() {
  const { user, signOut } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFiles, setFilteredFiles] = useState<File[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const filesPerPage = 10

  useEffect(() => {
    // 使用模拟数据
    setTimeout(() => {
      setFiles(mockFiles)
      setLoading(false)
    }, 1000)
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
    setCurrentPage(1)
  }, [searchQuery, files])

  const fetchFiles = async () => {
    // 模拟数据更新
    setFiles(mockFiles)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('已退出登录')
    } catch (error) {
      toast.error('退出登录失败')
    }
  }

  // 分页计算
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage)
  const startIndex = (currentPage - 1) * filesPerPage
  const endIndex = startIndex + filesPerPage
  const currentFiles = filteredFiles.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 侧边栏 */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`lg:ml-80 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* 顶部广告栏 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <AdBanner ads={ads} interval={5000} />
          </div>
        </div>

        {/* 导航栏 */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
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
                        <span className="text-sm text-gray-700">
                          {user.nickname || user.email}
                        </span>
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
                  {currentFiles.length === 0 ? (
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
                    <>
                      {currentFiles.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <FileCard file={file} onUpdate={fetchFiles} />
                        </motion.div>
                      ))}

                      {/* 分页 */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            上一页
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm border rounded-lg ${
                                currentPage === page
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            下一页
                          </button>
                        </div>
                      )}
                    </>
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