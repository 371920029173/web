'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Upload, 
  MessageCircle, 
  Users, 
  Settings, 
  Shield,
  FileText,
  Trash2,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth()
  const isAdmin = user?.email === 'admin@platform.com' // 临时判断，后续会改进

  const menuItems = [
    { icon: Home, label: '首页', href: '/' },
    { icon: Upload, label: '上传文件', href: '/upload' },
    { icon: MessageCircle, label: '私信', href: '/messages' },
    ...(isAdmin ? [
      { icon: Users, label: '用户管理', href: '/admin/users' },
      { icon: FileText, label: '文件管理', href: '/admin/files' },
      { icon: Shield, label: '权限管理', href: '/admin/permissions' },
      { icon: Settings, label: '系统设置', href: '/admin/settings' },
    ] : []),
  ]

  return (
    <>
      {/* 遮罩层 */}
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
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">菜单</h2>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 用户信息 */}
          {user && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {isAdmin ? '平台管理员' : user.email}
                  </p>
                  {isAdmin && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Crown className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        管理员
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 菜单项 */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                onClick={() => {
                  // 在移动端点击菜单项后关闭侧边栏
                  if (window.innerWidth < 1024) {
                    onToggle()
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 底部 */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              © 2024 文件分享平台
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
} 