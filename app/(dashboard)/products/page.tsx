'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

interface Product {
  product_id: string
  product_code: string
  product_type: string
  product_description: string
  product_number_code: string
  unit_of_measure: string
  unit_price: number
  tax_exemption_reason?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    product_code: '',
    product_type: 'P',
    product_description: '',
    product_number_code: '',
    unit_of_measure: 'UN',
    unit_price: 0,
    tax_exemption_reason: '',
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('product_code')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const supabase = createClient()

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('product_id', editingProduct.product_id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData])

        if (error) throw error
      }

      setFormData({
        product_code: '',
        product_type: 'P',
        product_description: '',
        product_number_code: '',
        unit_of_measure: 'UN',
        unit_price: 0,
        tax_exemption_reason: '',
      })
      setEditingProduct(null)
      setShowForm(false)
      loadProducts()
    } catch (error: any) {
      alert('Erro: ' + error.message)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      product_code: product.product_code,
      product_type: product.product_type,
      product_description: product.product_description,
      product_number_code: product.product_number_code,
      unit_of_measure: product.unit_of_measure,
      unit_price: product.unit_price,
      tax_exemption_reason: product.tax_exemption_reason || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este produto?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', productId)

      if (error) throw error
      loadProducts()
    } catch (error: any) {
      alert('Erro ao eliminar produto: ' + error.message)
    }
  }

  const filteredProducts = products.filter(product =>
    product.product_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const productTypes = {
    P: 'Produto',
    S: 'Serviço',
    O: 'Outro',
    E: 'Despesa',
    I: 'Ativo',
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
          <h1 className="text-3xl font-bold text-gray-900">Produtos e Serviços</h1>
          <p className="text-gray-500 mt-1">Gerir catálogo de produtos e serviços</p>
        </div>
        <Button onClick={() => {
          setEditingProduct(null)
          setFormData({
            product_code: '',
            product_type: 'P',
            product_description: '',
            product_number_code: '',
            unit_of_measure: 'UN',
            unit_price: 0,
            tax_exemption_reason: '',
          })
          setShowForm(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </CardTitle>
              <CardDescription>Preencha os dados do produto ou serviço</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_code">Código *</Label>
                    <Input
                      id="product_code"
                      value={formData.product_code}
                      onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_type">Tipo *</Label>
                    <select
                      id="product_type"
                      value={formData.product_type}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="P">Produto</option>
                      <option value="S">Serviço</option>
                      <option value="O">Outro</option>
                      <option value="E">Despesa</option>
                      <option value="I">Ativo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_description">Descrição *</Label>
                  <Input
                    id="product_description"
                    value={formData.product_description}
                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_number_code">Código Numérico</Label>
                    <Input
                      id="product_number_code"
                      value={formData.product_number_code}
                      onChange={(e) => setFormData({ ...formData, product_number_code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit_of_measure">Unidade *</Label>
                    <Input
                      id="unit_of_measure"
                      value={formData.unit_of_measure}
                      onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                      required
                      placeholder="UN, KG, L, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">Preço Unitário (€) *</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_exemption_reason">Motivo de Isenção de Imposto</Label>
                  <Input
                    id="tax_exemption_reason"
                    value={formData.tax_exemption_reason}
                    onChange={(e) => setFormData({ ...formData, tax_exemption_reason: e.target.value })}
                    placeholder="M01, M02, etc."
                  />
                </div>
              </CardContent>
              <div className="flex justify-end space-x-3 p-6 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Guardar' : 'Criar Produto'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>
                {filteredProducts.length} produto{filteredProducts.length !== 1 && 's'} encontrado{filteredProducts.length !== 1 && 's'}
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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Nenhum produto encontrado' : 'Ainda não tem produtos'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Descrição</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Unidade</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Preço</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.product_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{product.product_code}</td>
                      <td className="py-3 px-4 text-sm">{product.product_description}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{productTypes[product.product_type as keyof typeof productTypes]}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{product.unit_of_measure}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(product.unit_price)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.product_id)}>
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
