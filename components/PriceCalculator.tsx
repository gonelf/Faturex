'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react'

export default function PriceCalculator() {
  const [currentPrice, setCurrentPrice] = useState<string>('20')
  const [bookingsPerMonth, setBookingsPerMonth] = useState<string>('20')

  const calculateNewPrice = () => {
    const price = parseFloat(currentPrice)
    if (isNaN(price) || price <= 0) {
      return 0
    }
    // Novo Preço = Preço Atual / (1 - 0.08)
    return price / (1 - 0.08)
  }

  const calculateCurrentCost = () => {
    const price = parseFloat(currentPrice)
    const bookings = parseFloat(bookingsPerMonth)

    if (isNaN(price) || isNaN(bookings) || price <= 0 || bookings <= 0) {
      return 0
    }

    // 60€ fixos + (preço × marcações × 2.5% taxa de cartão)
    const fixedCosts = 60
    const revenue = price * bookings
    const cardFees = revenue * 0.025

    return fixedCosts + cardFees
  }

  const calculateFaturexCost = () => {
    // Com Faturex: 0€ (já ajustou o preço em 8%)
    return 0
  }

  const newPrice = calculateNewPrice()
  const difference = newPrice - parseFloat(currentPrice || '0')
  const hasValidPrice = !isNaN(parseFloat(currentPrice)) && parseFloat(currentPrice) > 0
  const hasValidBookings = !isNaN(parseFloat(bookingsPerMonth)) && parseFloat(bookingsPerMonth) > 0

  const currentCost = calculateCurrentCost()
  const faturexCost = calculateFaturexCost()
  const savings = currentCost - faturexCost

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Calculadora de Transparência
        </h3>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Descubra como ajustar o seu preço em apenas 8% transforma custos fixos em custos zero.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Result Section - Always visible with editable input */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-xl text-white mb-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6" />
            <h4 className="text-2xl font-bold">Ajuste de Preço</h4>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Editable Current Price */}
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
              <p className="text-green-100 text-sm mb-2">Preço Atual</p>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="w-full bg-white/30 border-2 border-white/40 rounded-lg px-3 py-2 text-3xl font-bold text-white placeholder-white/60 focus:bg-white/40 focus:border-white focus:outline-none transition"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl font-bold text-white">€</span>
              </div>
            </div>

            {/* Bookings per month */}
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
              <p className="text-green-100 text-sm mb-2">Marcações/Mês</p>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={bookingsPerMonth}
                  onChange={(e) => setBookingsPerMonth(e.target.value)}
                  className="w-full bg-white/30 border-2 border-white/40 rounded-lg px-3 py-2 text-3xl font-bold text-white placeholder-white/60 focus:bg-white/40 focus:border-white focus:outline-none transition"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Calculated New Price */}
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
              <p className="text-green-100 text-sm mb-1">Novo Preço</p>
              <p className="text-3xl font-bold">
                {hasValidPrice ? newPrice.toFixed(2) : '0.00'}€
              </p>
            </div>
          </div>

          {hasValidPrice && (
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur border border-white/20">
              <p className="text-lg mb-2">
                <span className="font-semibold">Ajuste necessário:</span> +{difference.toFixed(2)}€ (+8%)
              </p>
              <p className="text-green-100">
                Com este pequeno ajuste, o Faturex, TPA e Agenda ficam completamente grátis. Zero custos fixos mensais!
              </p>
            </div>
          )}
        </div>

        {/* Cost Comparison Section */}
        {hasValidPrice && hasValidBookings && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Current System Cost */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5" />
                <h4 className="text-xl font-bold">Sistema Tradicional</h4>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-red-100">Software + TPA + Agenda</span>
                  <span className="font-semibold">60€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-100">Taxas de cartão (2.5%)</span>
                  <span className="font-semibold">
                    {(parseFloat(currentPrice) * parseFloat(bookingsPerMonth) * 0.025).toFixed(2)}€
                  </span>
                </div>
                <div className="border-t border-white/20 pt-2"></div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-red-100 text-sm mb-1">Custo Total/Mês</p>
                <p className="text-4xl font-bold">{currentCost.toFixed(2)}€</p>
              </div>
            </div>

            {/* Faturex Cost */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" />
                <h4 className="text-xl font-bold">Com Faturex</h4>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-100">Software + TPA + Agenda</span>
                  <span className="font-semibold">0€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-100">Taxa 8% (já no preço)</span>
                  <span className="font-semibold">0€</span>
                </div>
                <div className="border-t border-white/20 pt-2"></div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-green-100 text-sm mb-1">Custo Total/Mês</p>
                <p className="text-4xl font-bold">{faturexCost.toFixed(2)}€</p>
              </div>
            </div>
          </div>
        )}

        {/* Savings Summary */}
        {hasValidPrice && hasValidBookings && savings > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 shadow-xl text-white text-center">
            <p className="text-lg mb-2">💰 Poupança Mensal</p>
            <p className="text-5xl font-bold mb-2">{savings.toFixed(2)}€</p>
            <p className="text-purple-100 text-sm">
              Por ano: {(savings * 12).toFixed(2)}€ de poupança
            </p>
          </div>
        )}

        {/* Explanation Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">
            Por que ajustar o preço é a decisão mais inteligente?
          </h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Custo Fixo vira Custo Zero</h5>
                <p className="text-gray-700">
                  Software, TPA e agenda financiados pela operação, não pelo seu fundo de maneio.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Proteção na Sazonalidade</h5>
                <p className="text-gray-700">
                  Se não faturar, o custo é 0.00€. No modelo tradicional, pagaria mensalidades mesmo parado.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Fim das Surpresas</h5>
                <p className="text-gray-700">
                  Sem aumentos anuais de subscrição ou custos extra por atualizações legislativas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
