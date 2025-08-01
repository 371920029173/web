'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  Trash2, 
  Crown, 
  Shield, 
  Settings,
  ArrowLeft,
  Search,
  UserPlus,
  UserMinus
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  nickname: string
  nickname_color: string
  isAdmin: boolean
  created_at: string
  files_count: number
}

interface AdminFile {
  id: string
  title: string
  author: {
    nickname: string
    nickname_color: string
  }
  created_at: string
  likes_count: number
  favorites_count: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [files, setFiles] = useState<AdminFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // 模拟数据
  const mockUsers: AdminUser[] = [
    {
      id: '1',
      nickname: '平台管理员',
      nickname_color: '#8B5CF6',
      isAdmin: true,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      files_count: 5
    },
    {
      id: '2',
      nickname: '技术达人',
      nickname_color: '#10B981',
      isAdmin: false,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      files_count: 12
    },
    {
      id: '3',
      nickname: '幸运星',
      nickname_color: '#F59E0B',
      isAdmin: false,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      files_count: 3
    }
  ]

  const mockFiles: AdminFile[] = [
    {
      id: '1',
      title: '欢迎使用文件分享平台',
      author: { nickname: '平台管理员', nickname_color: '#8B5CF6' },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      likes_count: 15,
      favorites_count: 8
    },
    {
      id: '2',
      title: 'Markdown语法指南',
      author: { nickname: '技术达人', nickname_color: '#10B981' },
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      likes_count: 23,
      favorites_count: 12
    }
  ]

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/')
      return
    }

    setUsers(mockUsers)
    setFiles(mockFiles)
    setLoading(false)
  }, [user, router])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除此用户吗？此操作不可撤销。')) return

    try {
      // 模拟删除用户
      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success('用户删除成功')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('确定要删除此文件吗？此操作不可撤销。')) return

    try {
      // 模拟删除文件
      setFiles(prev => prev.filter(f => f.id !== fileId))
      toast.success('文件删除成功')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handlePromoteToAdmin = async (userId: string) => {
    if (!confirm('确定要将此用户提升为管理员吗？')) return

    try {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, isAdmin: true, nickname_color: '#8B5CF6' }
          : u
      ))
      toast.success('用户已提升为管理员')
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const handleDemoteFromAdmin = async (userId: string) => {
    if (!confirm('确定要取消此用户的管理员权限吗？')) return

    try {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, isAdmin: false, nickname_color: '#3B82F6' }
          : u
      ))
      toast.success('已取消管理员权限')
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回</span>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">管理员控制台</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签页 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>用户管理</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'files'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>文件管理</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 搜索栏 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={`搜索${activeTab === 'users' ? '用户' : '文件'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full max-w-md"
                />
              </div>
            </div>

            {/* 用户管理 */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {users
                  .filter(user => 
                    user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.nickname.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span
                                className="font-medium"
                                style={{ color: user.nickname_color }}
                              >
                                {user.nickname}
                              </span>
                              {user.isAdmin && (
                                <div className="flex items-center space-x-1">
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                    管理员
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              注册时间：{formatDate(user.created_at)} | 文件数：{user.files_count}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.isAdmin ? (
                            <button
                              onClick={() => handleDemoteFromAdmin(user.id)}
                              className="btn-secondary text-xs"
                            >
                              <UserMinus className="h-3 w-3 mr-1" />
                              取消管理员
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePromoteToAdmin(user.id)}
                              className="btn-primary text-xs"
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              提升管理员
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn-secondary text-red-600 hover:text-red-700 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            删除用户
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}

            {/* 文件管理 */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                {files
                  .filter(file => 
                    file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    file.author.nickname.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{file.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span
                              style={{ color: file.author.nickname_color }}
                            >
                              {file.author.nickname}
                            </span>
                            <span>发布时间：{formatDate(file.created_at)}</span>
                            <span>点赞：{file.likes_count}</span>
                            <span>收藏：{file.favorites_count}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="btn-secondary text-red-600 hover:text-red-700 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          删除文件
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 