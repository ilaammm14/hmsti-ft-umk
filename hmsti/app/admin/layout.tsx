import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel - HMSTI' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
