'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (nickname: string, password: string) => Promise<void>
  signUp: (nickname: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据
const mockUsers = [
  { 
    id: '1', 
    nickname: '平台管理员', 
    password: '371920029173Abcd', 
    isAdmin: true,
    nickname_color: '#8B5CF6'
  },
  { 
    id: '2', 
    nickname: '技术达人', 
    password: '123456', 
    isAdmin: false,
    nickname_color: '#10B981'
  },
  { 
    id: '3', 
    nickname: '幸运星', 
    password: '123456', 
    isAdmin: false,
    nickname_color: '#F59E0B'
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储的用户信息
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (nickname: string, password: string) => {
    const foundUser = mockUsers.find(u => u.nickname === nickname && u.password === password)
    if (!foundUser) {
      throw new Error('昵称或密码错误')
    }

    // 创建用户对象
    const userObj = {
      id: foundUser.id,
      nickname: foundUser.nickname,
      isAdmin: foundUser.isAdmin,
      nickname_color: foundUser.nickname_color,
      email: `${foundUser.nickname}@platform.com` // 临时邮箱
    } as any

    setUser(userObj)
    localStorage.setItem('currentUser', JSON.stringify(userObj))
  }

  const signUp = async (nickname: string, password: string) => {
    // 检查昵称是否已存在
    const existingUser = mockUsers.find(u => u.nickname === nickname)
    if (existingUser) {
      throw new Error('昵称已被使用')
    }

    // 模拟注册成功
    const newUser = {
      id: Date.now().toString(),
      nickname,
      password,
      isAdmin: false,
      nickname_color: '#3B82F6'
    }

    // 在实际应用中，这里应该保存到数据库
    mockUsers.push(newUser)
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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