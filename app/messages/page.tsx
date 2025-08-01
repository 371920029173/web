'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Send, Image as ImageIcon, ArrowLeft, User, Search, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  image_url?: string
  created_at: string
  sender: {
    nickname: string
    nickname_color: string
  }
}

interface Conversation {
  id: string
  user: {
    nickname: string
    nickname_color: string
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface User {
  id: string
  nickname: string
  nickname_color: string
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])

  // 模拟用户数据
  const mockUsers: User[] = [
    { id: '1', nickname: '平台管理员', nickname_color: '#8B5CF6' },
    { id: '2', nickname: '技术达人', nickname_color: '#10B981' },
    { id: '3', nickname: '幸运星', nickname_color: '#F59E0B' },
    { id: '4', nickname: '编程新手', nickname_color: '#3B82F6' },
    { id: '5', nickname: '设计达人', nickname_color: '#EC4899' },
  ]

  // 模拟会话数据
  const mockConversations: Conversation[] = [
    {
      id: '2',
      user: { nickname: '技术达人', nickname_color: '#10B981' },
      lastMessage: '这个平台真的很棒！',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 2
    },
    {
      id: '3',
      user: { nickname: '幸运星', nickname_color: '#F59E0B' },
      lastMessage: '占卜功能很有趣',
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0
    }
  ]

  const mockMessages: Message[] = [
    {
      id: '1',
      sender_id: '2',
      receiver_id: '1',
      content: '你好！',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      sender: { nickname: '技术达人', nickname_color: '#10B981' }
    },
    {
      id: '2',
      sender_id: '1',
      receiver_id: '2',
      content: '你好！有什么可以帮助你的吗？',
      created_at: new Date(Date.now() - 82800000).toISOString(),
      sender: { nickname: '当前用户', nickname_color: '#3B82F6' }
    },
    {
      id: '3',
      sender_id: '2',
      receiver_id: '1',
      content: '这个平台真的很棒！',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender: { nickname: '技术达人', nickname_color: '#10B981' }
    }
  ]

  useEffect(() => {
    setConversations(mockConversations)
    loadMessages()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages()
      // 标记消息为已读
      markAsRead(selectedConversation)
    }
  }, [selectedConversation])

  // 加载消息（保留一个月）
  const loadMessages = () => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    
    const filteredMessages = mockMessages.filter(msg => 
      new Date(msg.created_at) > oneMonthAgo
    )
    setMessages(filteredMessages)
  }

  // 标记消息为已读
  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  // 搜索用户
  const handleSearchUsers = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const results = mockUsers.filter(u => 
      u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      u.id !== user?.id
    )
    setSearchResults(results)
  }

  useEffect(() => {
    handleSearchUsers()
  }, [searchQuery])

  // 开始新对话
  const startNewConversation = (targetUser: User) => {
    const newConversation: Conversation = {
      id: targetUser.id,
      user: targetUser,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    }

    setConversations(prev => {
      const existing = prev.find(c => c.id === targetUser.id)
      if (existing) {
        return prev
      }
      return [newConversation, ...prev]
    })

    setSelectedConversation(targetUser.id)
    setShowUserSearch(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleSendMessage = async () => {
    if (!selectedConversation || (!newMessage.trim() && !selectedImage)) {
      toast.error('请输入消息或选择图片')
      return
    }

    setSending(true)

    try {
      // 模拟发送消息
      const newMsg: Message = {
        id: Date.now().toString(),
        sender_id: user?.id || '1',
        receiver_id: selectedConversation,
        content: newMessage.trim() || '',
        image_url: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        created_at: new Date().toISOString(),
        sender: { nickname: user?.nickname || '当前用户', nickname_color: user?.nickname_color || '#3B82F6' }
      }

      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      setSelectedImage(null)
      toast.success('消息发送成功')
    } catch (error) {
      toast.error('发送失败')
    } finally {
      setSending(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过5MB')
        return
      }
      setSelectedImage(file)
      setNewMessage('')
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回</span>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">私信</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex h-[600px]">
            {/* 会话列表 */}
            <div className="w-1/3 border-r bg-gray-50">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">会话列表</h3>
                  <button
                    onClick={() => setShowUserSearch(!showUserSearch)}
                    className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                    title="搜索用户"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* 搜索用户 */}
                {showUserSearch && (
                  <div className="mt-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="搜索用户昵称..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    {/* 搜索结果 */}
                    {searchResults.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => startNewConversation(user)}
                            className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                                <User className="h-3 w-3 text-white" />
                              </div>
                              <span
                                className="text-sm font-medium"
                                style={{ color: user.nickname_color }}
                              >
                                {user.nickname}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="overflow-y-auto h-full">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-primary-50 border-primary-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className="font-medium text-sm truncate"
                            style={{ color: conversation.user.nickname_color }}
                          >
                            {conversation.user.nickname}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(conversation.lastMessageTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* 消息头部 */}
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span
                        className="font-medium"
                        style={{ 
                          color: conversations.find(c => c.id === selectedConversation)?.user.nickname_color 
                        }}
                      >
                        {conversations.find(c => c.id === selectedConversation)?.user.nickname}
                      </span>
                    </div>
                  </div>

                  {/* 消息列表 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        开始新的对话吧！
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md ${
                              message.sender_id === user?.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            } rounded-lg p-3`}
                          >
                            {message.content && (
                              <p className="text-sm mb-2">{message.content}</p>
                            )}
                            {message.image_url && (
                              <img
                                src={message.image_url}
                                alt="消息图片"
                                className="max-w-full rounded"
                              />
                            )}
                            <p className="text-xs opacity-70 mt-1">
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 输入区域 */}
                  <div className="border-t p-4 bg-white">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        {selectedImage ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="预览"
                              className="max-h-20 rounded"
                            />
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="输入消息..."
                            className="input-field resize-none"
                            rows={2}
                            maxLength={1000}
                          />
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <ImageIcon className="h-5 w-5 text-gray-600 hover:text-primary-600" />
                        </label>
                        <button
                          onClick={handleSendMessage}
                          disabled={sending}
                          className="btn-primary"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  选择一个会话开始聊天
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 