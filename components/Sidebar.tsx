'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Upload, 
  MessageSquare, 
  Settings, 
  Crown,
  User,
  FileText,
  LogOut,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const isAdmin = user?.is_admin // 修复：使用正确的属性名

  const menuItems = [
    { icon: Home, label: '首页', href: '/' },
    { icon: Upload, label: '上传文件', href: '/upload', requireAuth: true },
    { icon: MessageSquare, label: '私信', href: '/messages', requireAuth: true },
    ...(isAdmin ? [
      { icon: Crown, label: '管理员', href: '/admin', requireAuth: true }
    ] : []),
    { icon: Settings, label: '设置', href: '/settings', requireAuth: true }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <>
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">文件分享平台</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 用户信息 */}
        {user && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="font-medium text-gray-900"
                    style={{ color: user.nickname_color }}
                  >
                    {isAdmin ? '平台管理员' : user.nickname}
                  </span>
                  {isAdmin && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* 导航菜单 */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              if (item.requireAuth && !user) return null
              
              return (
                <li key={item.href}>
                  <button
                    onClick={() => {
                      router.push(item.href)
                      onToggle()
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* 底部 */}
        <div className="p-6 border-t border-gray-200">
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>退出登录</span>
            </button>
          ) : (
            <button
              onClick={() => {
                router.push('/')
                onToggle()
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <span>登录</span>
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
} 