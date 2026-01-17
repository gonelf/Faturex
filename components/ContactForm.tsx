'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here you would normally send the data to your backend
    console.log('Form submitted:', formData)

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' })
      setIsSubmitted(false)
    }, 3000)
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
          <label htmlFor="business" className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Negócio
          </label>
          <input
            type="text"
            id="business"
            name="business"
            value={formData.message}
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
