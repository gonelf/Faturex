'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface InvoiceLine {
  productId: string
  quantity: number
  unitPrice: number
  description: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])
  const [formData, setFormData] = useState({
    seriesId: '',
    customerId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    sourceId: 'WEB',
  })
  const [lines, setLines] = useState<InvoiceLine[]>([
    { productId: '', quantity: 1, unitPrice: 0, description: '' }
  ])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient()

      const [customersRes, productsRes, seriesRes] = await Promise.all([
        supabase.from('customers').select('*').order('company_name'),
        supabase.from('products').select('*').order('product_description'),
        supabase.from('billing_series').select('*').order('series_code'),
      ])

      setCustomers(customersRes.data || [])
      setProducts(productsRes.data || [])
      setSeries(seriesRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const addLine = () => {
    setLines([...lines, { productId: '', quantity: 1, unitPrice: 0, description: '' }])
  }

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index))
  }

  const updateLine = (index: number, field: keyof InvoiceLine, value: any) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    setLines(newLines)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // This would call your backend API
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lines: lines.map(line => ({
            product_id: line.productId,
            quantity: line.quantity,
            unit_price: line.unitPrice,
            description: line.description,
          }))
        }),
      })

      if (!response.ok) throw new Error('Failed to create invoice')

      router.push('/invoices')
    } catch (error: any) {
      alert('Erro ao criar fatura: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Fatura</h1>
          <p className="text-gray-500 mt-1">Criar nova fatura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Fatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seriesId">Série *</Label>
                <select
                  id="seriesId"
                  value={formData.seriesId}
                  onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecionar...</option>
                  {series.map(s => (
                    <option key={s.series_id} value={s.series_id}>
                      {s.series_code} - {s.series_description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerId">Cliente *</Label>
                <select
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecionar...</option>
                  {customers.map(c => (
                    <option key={c.customer_id} value={c.customer_id}>
                      {c.company_name} - {c.customer_tax_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Data *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Linhas da Fatura</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Linha
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lines.map((line, index) => (
              <div key={index} className="flex items-end space-x-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Produto/Descrição *</Label>
                  <select
                    value={line.productId}
                    onChange={(e) => {
                      const product = products.find(p => p.product_id === e.target.value)
                      updateLine(index, 'productId', e.target.value)
                      if (product) {
                        updateLine(index, 'unitPrice', product.unit_price)
                        updateLine(index, 'description', product.product_description)
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Selecionar produto...</option>
                    {products.map(p => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-32 space-y-2">
                  <Label>Quantidade *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, 'quantity', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="w-32 space-y-2">
                  <Label>Preço Unit. *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLine(index)}
                  disabled={lines.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href="/invoices">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'A criar...' : 'Criar Fatura'}
          </Button>
        </div>
      </form>
    </div>
  )
}
