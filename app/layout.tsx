import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '文件分享平台 - 现代化文件分享与社区交流',
    template: '%s | 文件分享平台'
  },
  description: '一个现代化的文件分享和社区交流平台，支持多种文件格式，用户互动，私信系统，占卜功能等。符合Google AdSense要求，简约设计风格。',
  keywords: ['文件分享', '社区交流', 'Markdown', '文档管理', '用户互动', '占卜', '私信系统'],
  authors: [{ name: '文件分享平台' }],
  creator: '文件分享平台',
  publisher: '文件分享平台',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: '文件分享平台 - 现代化文件分享与社区交流',
    description: '一个现代化的文件分享和社区交流平台，支持多种文件格式，用户互动，私信系统，占卜功能等。',
    siteName: '文件分享平台',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '文件分享平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '文件分享平台 - 现代化文件分享与社区交流',
    description: '一个现代化的文件分享和社区交流平台，支持多种文件格式，用户互动，私信系统，占卜功能等。',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "文件分享平台",
              "description": "一个现代化的文件分享和社区交流平台",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
} 