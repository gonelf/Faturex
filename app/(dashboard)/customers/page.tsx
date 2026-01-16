'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface Customer {
  customer_id: string
  customer_tax_id: string
  company_name: string
  billing_address: string
  postal_code: string
  city: string
  country: string
  self_billing_indicator: boolean
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    customer_tax_id: '',
    company_name: '',
    billing_address: '',
    postal_code: '',
    city: '',
    country: 'PT',
    self_billing_indicator: false,
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('company_name')

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const supabase = createClient()

      if (editingCustomer) {
        // Update existing customer
        const { error } = await supabase
          .from('customers')
          .update(formData)
          .eq('customer_id', editingCustomer.customer_id)

        if (error) throw error
      } else {
        // Create new customer
        const { error } = await supabase
          .from('customers')
          .insert([formData])

        if (error) throw error
      }

      // Reset form and reload
      setFormData({
        customer_tax_id: '',
        company_name: '',
        billing_address: '',
        postal_code: '',
        city: '',
        country: 'PT',
        self_billing_indicator: false,
      })
      setEditingCustomer(null)
      setShowForm(false)
      loadCustomers()
    } catch (error: any) {
      alert('Erro: ' + error.message)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      customer_tax_id: customer.customer_tax_id,
      company_name: customer.company_name,
      billing_address: customer.billing_address,
      postal_code: customer.postal_code,
      city: customer.city,
      country: customer.country,
      self_billing_indicator: customer.self_billing_indicator,
    })
    setShowForm(true)
  }

  const handleDelete = async (customerId: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este cliente?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('customer_id', customerId)

      if (error) throw error
      loadCustomers()
    } catch (error: any) {
      alert('Erro ao eliminar cliente: ' + error.message)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_tax_id.includes(searchTerm)
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">
            Gerir base de dados de clientes
          </p>
        </div>
        <Button onClick={() => {
          setEditingCustomer(null)
          setFormData({
            customer_tax_id: '',
            company_name: '',
            billing_address: '',
            postal_code: '',
            city: '',
            country: 'PT',
            self_billing_indicator: false,
          })
          setShowForm(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
              </CardTitle>
              <CardDescription>
                Preencha os dados do cliente
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_tax_id">NIF *</Label>
                    <Input
                      id="customer_tax_id"
                      value={formData.customer_tax_id}
                      onChange={(e) => setFormData({ ...formData, customer_tax_id: e.target.value })}
                      required
                      maxLength={9}
                      pattern="[0-9]{9}"
                      title="NIF deve ter 9 dígitos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nome/Empresa *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_address">Morada *</Label>
                  <Input
                    id="billing_address"
                    value={formData.billing_address}
                    onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Código Postal *</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      required
                      placeholder="0000-000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    maxLength={2}
                    placeholder="PT"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="self_billing_indicator"
                    checked={formData.self_billing_indicator}
                    onChange={(e) => setFormData({ ...formData, self_billing_indicator: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="self_billing_indicator">
                    Autofaturação
                  </Label>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-3 p-6 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCustomer(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCustomer ? 'Guardar' : 'Criar Cliente'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Search and List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                {filteredCustomers.length} cliente{filteredCustomers.length !== 1 && 's'} encontrado{filteredCustomers.length !== 1 && 's'}
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Ainda não tem clientes'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Cliente
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      NIF
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Nome/Empresa
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Cidade
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      País
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.customer_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {customer.customer_tax_id}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {customer.company_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.city}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.country}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer.customer_id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
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
