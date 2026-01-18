'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_type: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business_type: formData.business_type || undefined,
          message: formData.message || undefined,
          source: 'homepage_form',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar formulário')
      }

      setIsSubmitted(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', business_type: '', message: '' })
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError(err instanceof Error ? err.message : 'Erro ao enviar formulário. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-3xl font-bold text-green-600 mb-4">
          Pedido Recebido!
        </h3>
        <p className="text-xl text-gray-700">
          Entraremos em contacto em breve para ativar o seu Faturex.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-200">
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-8 text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Erro ao Enviar</h3>
          <p className="text-red-700">{error}</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => setError(null)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-200">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="O seu nome"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="seuemail@exemplo.com"
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="+351 XXX XXX XXX"
          />
        </div>

        {/* Tipo de Negócio */}
        <div>
          <label htmlFor="business_type" className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Negócio
          </label>
          <input
            type="text"
            id="business_type"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="Ex: Barbearia, Salão, Spa..."
          />
        </div>
      </div>

      {/* Mensagem */}
      <div className="mt-6">
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
          Mensagem (Opcional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
          placeholder="Conte-nos mais sobre o seu negócio ou dúvidas..."
        />
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'A enviar...' : 'Quero o Faturex (79€)'}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Responderemos em menos de 24 horas
        </p>
      </div>
    </form>
  )
}
