'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, FileText, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Invoice {
  invoice_id: string
  invoice_no: string
  invoice_date: string
  system_entry_date: string
  customer_id: string
  gross_total: number
  document_status: string
  atcud: string
  hash_control: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('system_entry_date', { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (error) {
      console.error('Error loading invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.atcud.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faturas</h1>
          <p className="text-gray-500 mt-1">
            Gerir faturas e documentos de faturação
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Faturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Finalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {invoices.filter(i => i.document_status === 'F').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rascunhos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {invoices.filter(i => i.document_status === 'N').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Faturas</CardTitle>
              <CardDescription>
                {filteredInvoices.length} fatura{filteredInvoices.length !== 1 && 's'} encontrada{filteredInvoices.length !== 1 && 's'}
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Input
                placeholder="Pesquisar por número ou ATCUD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Nenhuma fatura encontrada' : 'Ainda não tem faturas'}
              </p>
              {!searchTerm && (
                <Link href="/invoices/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Fatura
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Nº Fatura
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      ATCUD
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Data
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Cliente
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                      Valor
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                      Estado
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoice_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {invoice.invoice_no}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.atcud}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(invoice.invoice_date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.customer_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(invoice.gross_total)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[invoice.document_status]
                          }`}
                        >
                          {statusLabels[invoice.document_status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/invoices/${invoice.invoice_id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
