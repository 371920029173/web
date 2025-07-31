'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Send, Image as ImageIcon, ArrowLeft, User } from 'lucide-react'
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

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [sending, setSending] = useState(false)

  // 模拟数据
  const mockConversations: Conversation[] = [
    {
      id: '1',
      user: { nickname: '技术达人', nickname_color: '#10B981' },
      lastMessage: '这个平台真的很棒！',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 2
    },
    {
      id: '2',
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
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages)
    }
  }, [selectedConversation])

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
        sender_id: '1',
        receiver_id: selectedConversation,
        content: newMessage.trim() || '',
        image_url: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        created_at: new Date().toISOString(),
        sender: { nickname: '当前用户', nickname_color: '#3B82F6' }
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
                <h3 className="font-medium text-gray-900">会话列表</h3>
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
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === '1' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            message.sender_id === '1'
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
                    ))}
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