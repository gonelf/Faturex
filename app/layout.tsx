import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Faturex - Portuguese Billing System',
  description: 'Professional Portuguese Billing System - SAF-T (PT) 1.04 Compliant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
