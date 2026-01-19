'use client'

import { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'

export default function PriceCalculator() {
  const [currentPrice, setCurrentPrice] = useState<string>('50')

  const calculateNewPrice = () => {
    const price = parseFloat(currentPrice)
    if (isNaN(price) || price <= 0) {
      return 0
    }
    // Novo Preço = Preço Atual / (1 - 0.08)
    return price / (1 - 0.08)
  }

  const newPrice = calculateNewPrice()
  const difference = newPrice - parseFloat(currentPrice || '0')
  const hasValidPrice = !isNaN(parseFloat(currentPrice)) && parseFloat(currentPrice) > 0

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

      <div className="max-w-2xl mx-auto">
        {/* Result Section - Always visible with editable input */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6" />
            <h4 className="text-2xl font-bold">Resultado</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
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

            {/* Calculated New Price */}
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
              <p className="text-green-100 text-sm mb-1">Novo Preço (com Faturex)</p>
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
