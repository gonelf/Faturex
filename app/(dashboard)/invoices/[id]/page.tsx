'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [lines, setLines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoice()
  }, [params.id])

  const loadInvoice = async () => {
    try {
      const supabase = createClient()

      const [invoiceRes, linesRes] = await Promise.all([
        supabase.from('invoices').select('*').eq('invoice_id', params.id).single(),
        supabase.from('invoice_lines').select('*').eq('invoice_id', params.id).order('line_number'),
      ])

      if (invoiceRes.error) throw invoiceRes.error

      setInvoice(invoiceRes.data)
      setLines(linesRes.data || [])
    } catch (error) {
      console.error('Error loading invoice:', error)
      alert('Erro ao carregar fatura')
    } finally {
      setLoading(false)
    }
  }

  const handleFinalize = async () => {
    if (!confirm('Tem a certeza que deseja finalizar esta fatura? Esta ação não pode ser desfeita.')) return

    try {
      const response = await fetch(`/api/invoices/${params.id}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: 'WEB' }),
      })

      if (!response.ok) throw new Error('Failed to finalize invoice')

      loadInvoice()
    } catch (error: any) {
      alert('Erro ao finalizar fatura: ' + error.message)
    }
  }

  const handleCancel = async () => {
    const reason = prompt('Motivo de anulação:')
    if (!reason) return

    try {
      const response = await fetch(`/api/invoices/${params.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: 'WEB', reason }),
      })

      if (!response.ok) throw new Error('Failed to cancel invoice')

      loadInvoice()
    } catch (error: any) {
      alert('Erro ao anular fatura: ' + error.message)
    }
  }

  const statusColors: Record<string, string> = {
    N: 'bg-yellow-100 text-yellow-800',
    F: 'bg-green-100 text-green-800',
    A: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    N: 'Rascunho',
    F: 'Finalizada',
    A: 'Anulada',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoice) {
    return <div>Fatura não encontrada</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fatura {invoice.invoice_no}</h1>
            <p className="text-gray-500 mt-1">ATCUD: {invoice.atcud}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[invoice.document_status]}`}>
            {statusLabels[invoice.document_status]}
          </span>
          {invoice.document_status === 'N' && (
            <>
              <Button onClick={handleFinalize}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                Anular
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Fatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Data da Fatura:</span>
              <span className="font-medium">{formatDate(invoice.invoice_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data de Sistema:</span>
              <span className="font-medium">{formatDateTime(invoice.system_entry_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{invoice.customer_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hash de Controlo:</span>
              <span className="font-mono text-sm">{invoice.hash_control}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Líquido:</span>
              <span className="font-medium">{formatCurrency(invoice.net_total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Imposto:</span>
              <span className="font-medium">{formatCurrency(invoice.tax_payable)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">{formatCurrency(invoice.gross_total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linhas da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Produto</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Qtd</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Preço Unit.</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.line_id} className="border-b">
                  <td className="py-3 px-4 text-sm">{line.line_number}</td>
                  <td className="py-3 px-4 text-sm">{line.product_id}</td>
                  <td className="py-3 px-4 text-sm text-right">{line.quantity}</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(line.unit_price)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium">
                    {formatCurrency(line.credit_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {invoice.qr_code_data && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Dados do código QR para impressão:</p>
            <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
              {invoice.qr_code_data}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
