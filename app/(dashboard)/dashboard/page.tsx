'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Users, Package, TrendingUp, Plus, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Stats {
  totalInvoices: number
  totalCustomers: number
  totalProducts: number
  totalRevenue: number
}

interface RecentInvoice {
  invoice_id: string
  invoice_no: string
  invoice_date: string
  customer_id: string
  gross_total: number
  document_status: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalInvoices: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()

        // Load stats in parallel
        const [invoicesResult, customersResult, productsResult] = await Promise.all([
          supabase.from('invoices').select('gross_total', { count: 'exact' }),
          supabase.from('customers').select('*', { count: 'exact' }),
          supabase.from('products').select('*', { count: 'exact' }),
        ])

        // Calculate total revenue
        const totalRevenue = invoicesResult.data?.reduce(
          (sum, invoice) => sum + (invoice.gross_total || 0),
          0
        ) || 0

        setStats({
          totalInvoices: invoicesResult.count || 0,
          totalCustomers: customersResult.count || 0,
          totalProducts: productsResult.count || 0,
          totalRevenue,
        })

        // Load recent invoices
        const { data: recentData } = await supabase
          .from('invoices')
          .select('*')
          .order('system_entry_date', { ascending: false })
          .limit(5)

        setRecentInvoices(recentData || [])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Visão geral do sistema de faturação
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Faturas
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Documentos emitidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor faturado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Clientes registados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Produtos/Serviços
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Faturas Recentes</CardTitle>
              <CardDescription>
                Últimas faturas emitidas no sistema
              </CardDescription>
            </div>
            <Link href="/invoices">
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Ainda não tem faturas</p>
              <Link href="/invoices/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Fatura
                </Button>
              </Link>
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
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.invoice_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {invoice.invoice_no}
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
                      <td className="py-3 px-4 text-right">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Clientes</span>
            </CardTitle>
            <CardDescription>
              Gerir base de dados de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/customers">
              <Button variant="outline" className="w-full">
                Ver Clientes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-600" />
              <span>Produtos</span>
            </CardTitle>
            <CardDescription>
              Gerir catálogo de produtos e serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Ver Produtos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Séries</span>
            </CardTitle>
            <CardDescription>
              Gerir séries de faturação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/series">
              <Button variant="outline" className="w-full">
                Ver Séries
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
