'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { X, Send, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  image_url: string | null
  created_at: string
  sender: {
    nickname: string
    nickname_color: string
  }
}

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && user) {
      fetchUsers()
    }
  }, [isOpen, user])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages()
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nickname, nickname_color')
        .neq('id', user?.id)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchMessages = async () => {
    if (!selectedUser) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(nickname, nickname_color)
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!selectedUser || (!newMessage.trim() && !selectedImage)) {
      toast.error('请输入消息或选择图片')
      return
    }

    setLoading(true)

    try {
      let imageUrl = null

      if (selectedImage) {
        // 上传图片
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-images')
          .upload(fileName, selectedImage)

        if (uploadError) throw uploadError
        imageUrl = uploadData.path
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: selectedUser,
          content: newMessage.trim() || '',
          image_url: imageUrl,
        })

      if (error) throw error

      setNewMessage('')
      setSelectedImage(null)
      fetchMessages()
      toast.success('消息发送成功')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error(error.message || '发送失败')
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        toast.error('图片大小不能超过5MB')
        return
      }
      setSelectedImage(file)
      setNewMessage('') // 清空文字消息
    }
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
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">私信</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* 用户列表 */}
              <div className="w-1/3 border-r bg-gray-50">
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">联系人</h3>
                  <div className="space-y-2">
                    {users.map((userItem) => (
                      <button
                        key={userItem.id}
                        onClick={() => setSelectedUser(userItem.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedUser === userItem.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span
                          className="font-medium"
                          style={{ color: userItem.nickname_color }}
                        >
                          {userItem.nickname}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 消息区域 */}
              <div className="flex-1 flex flex-col">
                {selectedUser ? (
                  <>
                    {/* 消息列表 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                              message.sender_id === user?.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.content && (
                              <p className="text-sm mb-2">{message.content}</p>
                            )}
                            {message.image_url && (
                              <img
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/message-images/${message.image_url}`}
                                alt="消息图片"
                                className="max-w-full rounded"
                              />
                            )}
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.created_at).toLocaleTimeString('zh-CN')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* 输入区域 */}
                    <div className="border-t p-4">
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
                            disabled={loading}
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
                    选择一个联系人开始聊天
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 