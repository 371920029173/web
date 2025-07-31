'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // 模拟用户数据，实际应该从数据库获取
  const existingUsers = [
    { nickname: '平台管理员', password: '371920029173Abcd', isAdmin: true },
    { nickname: '技术达人', password: '123456', isAdmin: false },
    { nickname: '幸运星', password: '123456', isAdmin: false },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // 检查重名
        const existingUser = existingUsers.find(user => user.nickname === nickname)
        if (existingUser) {
          toast.error('昵称已被使用，请选择其他昵称')
          return
        }

        // 检查密码确认
        if (password !== confirmPassword) {
          toast.error('两次输入的密码不一致')
          return
        }

        // 检查密码强度
        if (password.length < 6) {
          toast.error('密码长度至少6位')
          return
        }

        await signUp(nickname, password)
        toast.success('注册成功！')
        onClose()
        resetForm()
      } else {
        // 登录
        const user = existingUsers.find(u => u.nickname === nickname && u.password === password)
        if (!user) {
          toast.error('昵称或密码错误')
          return
        }

        await signIn(nickname, password)
        toast.success('登录成功！')
        onClose()
        resetForm()
      }
    } catch (error: any) {
      toast.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNickname('')
    setPassword('')
    setConfirmPassword('')
    setIsSignUp(false)
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
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignUp ? '注册账户' : '登录'}
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
                  昵称
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="input-field"
                  placeholder="请输入昵称"
                  required
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="请输入密码"
                  required
                  minLength={6}
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="请再次输入密码"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isSignUp ? '注册中...' : '登录中...'}</span>
                  </div>
                ) : (
                  isSignUp ? '注册' : '登录'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  resetForm()
                }}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
              </button>
            </div>

            {/* 测试账号提示 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">测试账号：</p>
              <div className="text-xs space-y-1">
                <p>管理员：平台管理员 / 371920029173Abcd</p>
                <p>用户：技术达人 / 123456</p>
                <p>用户：幸运星 / 123456</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 