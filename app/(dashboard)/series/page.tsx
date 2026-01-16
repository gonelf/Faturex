'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface BillingSeries {
  series_id: string
  series_code: string
  series_description: string
  invoice_type: string
  validation_code: string
  current_number: number
}

export default function SeriesPage() {
  const [series, setSeries] = useState<BillingSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    series_code: '',
    series_description: '',
    invoice_type: 'FT',
    validation_code: '',
    current_number: 0,
  })

  useEffect(() => {
    loadSeries()
  }, [])

  const loadSeries = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('billing_series')
        .select('*')
        .order('series_code')

      if (error) throw error
      setSeries(data || [])
    } catch (error) {
      console.error('Error loading series:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('billing_series')
        .insert([formData])

      if (error) throw error

      setFormData({
        series_code: '',
        series_description: '',
        invoice_type: 'FT',
        validation_code: '',
        current_number: 0,
      })
      setShowForm(false)
      loadSeries()
    } catch (error: any) {
      alert('Erro: ' + error.message)
    }
  }

  const invoiceTypes = {
    FT: 'Fatura',
    FS: 'Fatura Simplificada',
    FR: 'Fatura-Recibo',
    NC: 'Nota de Crédito',
    ND: 'Nota de Débito',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Séries de Faturação</h1>
          <p className="text-gray-500 mt-1">
            Gerir séries e numeração de documentos
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Série
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Nova Série de Faturação</CardTitle>
              <CardDescription>
                Criar uma nova série com código de validação AT
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="series_code">Código da Série *</Label>
                    <Input
                      id="series_code"
                      value={formData.series_code}
                      onChange={(e) => setFormData({ ...formData, series_code: e.target.value })}
                      required
                      placeholder="FT, FS, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice_type">Tipo de Documento *</Label>
                    <select
                      id="invoice_type"
                      value={formData.invoice_type}
                      onChange={(e) => setFormData({ ...formData, invoice_type: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="FT">Fatura</option>
                      <option value="FS">Fatura Simplificada</option>
                      <option value="FR">Fatura-Recibo</option>
                      <option value="NC">Nota de Crédito</option>
                      <option value="ND">Nota de Débito</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="series_description">Descrição *</Label>
                  <Input
                    id="series_description"
                    value={formData.series_description}
                    onChange={(e) => setFormData({ ...formData, series_description: e.target.value })}
                    required
                    placeholder="Descrição da série"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validation_code">Código de Validação AT *</Label>
                    <Input
                      id="validation_code"
                      value={formData.validation_code}
                      onChange={(e) => setFormData({ ...formData, validation_code: e.target.value })}
                      required
                      placeholder="Ex: CSVP8Y9"
                      maxLength={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_number">Número Inicial</Label>
                    <Input
                      id="current_number"
                      type="number"
                      value={formData.current_number}
                      onChange={(e) => setFormData({ ...formData, current_number: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-3 p-6 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Série</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Séries Configuradas</CardTitle>
          <CardDescription>
            {series.length} série{series.length !== 1 && 's'} de faturação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {series.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Ainda não tem séries configuradas</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Série
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Código
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Descrição
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Código AT
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                      Número Atual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((s) => (
                    <tr key={s.series_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{s.series_code}</td>
                      <td className="py-3 px-4 text-sm">{s.series_description}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoiceTypes[s.invoice_type as keyof typeof invoiceTypes]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                        {s.validation_code}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                        {s.current_number}
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
