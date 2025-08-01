'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  username: string
  nickname: string
  nickname_color: string
  is_admin: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  signIn: (nickname: string, password: string) => Promise<void>
  signUp: (nickname: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    username: 'admin',
    nickname: '平台管理员',
    nickname_color: '#8B5CF6',
    is_admin: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    username: 'user',
    nickname: '测试用户',
    nickname_color: '#3B82F6',
    is_admin: false,
    created_at: new Date().toISOString()
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储的用户信息
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (nickname: string, password: string) => {
    try {
      // 模拟登录验证
      const foundUser = mockUsers.find(u => u.nickname === nickname)
      if (!foundUser) {
        throw new Error('用户不存在')
      }

      // 模拟密码验证 (实际项目中应该使用真实的密码验证)
      if (password !== '123456') {
        throw new Error('密码错误')
      }

      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      toast.success('登录成功')
    } catch (error: any) {
      toast.error(error.message || '登录失败')
      throw error
    }
  }

  const signUp = async (nickname: string, password: string) => {
    try {
      // 检查昵称是否已存在
      const existingUser = mockUsers.find(u => u.nickname === nickname)
      if (existingUser) {
        throw new Error('昵称已存在')
      }

      // 创建新用户
      const newUser: User = {
        id: Date.now().toString(),
        email: `${nickname}@example.com`,
        username: nickname,
        nickname,
        nickname_color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        is_admin: false,
        created_at: new Date().toISOString()
      }

      mockUsers.push(newUser)
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      toast.success('注册成功')
    } catch (error: any) {
      toast.error(error.message || '注册失败')
      throw error
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('已退出登录')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 