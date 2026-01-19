import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Faturex - Custo Fixo Zero: Software de Faturação que só paga quando vende',
  description: 'Acabe com mensalidades fixas de 60€/mês. Sistema completo certificado pela AT, com TPA e Agenda incluídos por apenas 8%. Ativação única de 79€.',
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
