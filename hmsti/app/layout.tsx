import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HMSTI - Himpunan Mahasiswa Sistem dan Teknologi Informasi',
  description: 'Website resmi Himpunan Mahasiswa Sistem dan Teknologi Informasi Universitas Muhammadiyah Kendari',
  keywords: ['HMSTI', 'himpunan mahasiswa', 'sistem informasi', 'teknologi informasi', 'UMK Kendari'],
  openGraph: {
    title: 'HMSTI',
    description: 'Himpunan Mahasiswa Sistem dan Teknologi Informasi',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
