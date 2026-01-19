'use client'

import { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'

export default function PriceCalculator() {
  const [currentPrice, setCurrentPrice] = useState<string>('')
  const [showResult, setShowResult] = useState(false)

  const calculateNewPrice = () => {
    const price = parseFloat(currentPrice)
    if (isNaN(price) || price <= 0) {
      return 0
    }
    // Novo Preço = Preço Atual / (1 - 0.08)
    return price / (1 - 0.08)
  }

  const handleCalculate = () => {
    const price = parseFloat(currentPrice)
    if (!isNaN(price) && price > 0) {
      setShowResult(true)
    }
  }

  const newPrice = calculateNewPrice()
  const difference = newPrice - parseFloat(currentPrice || '0')

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
        {/* Input Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <label className="block text-gray-700 font-semibold mb-3 text-lg">
            Qual é o seu preço atual de serviço?
          </label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">€</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => {
                    setCurrentPrice(e.target.value)
                    setShowResult(false)
                  }}
                  placeholder="Ex: 50.00"
                  className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>
            <button
              onClick={handleCalculate}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Calcular
            </button>
          </div>
        </div>

        {/* Result Section */}
        {showResult && newPrice > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-xl text-white animate-in fade-in duration-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6" />
              <h4 className="text-2xl font-bold">Resultado</h4>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                <p className="text-green-100 text-sm mb-1">Preço Atual</p>
                <p className="text-3xl font-bold">{parseFloat(currentPrice).toFixed(2)}€</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                <p className="text-green-100 text-sm mb-1">Novo Preço (com Faturex)</p>
                <p className="text-3xl font-bold">{newPrice.toFixed(2)}€</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur border border-white/20">
              <p className="text-lg mb-2">
                <span className="font-semibold">Ajuste necessário:</span> +{difference.toFixed(2)}€ (+8%)
              </p>
              <p className="text-green-100">
                Com este pequeno ajuste, o Faturex, TPA e Agenda ficam completamente grátis. Zero custos fixos mensais!
              </p>
            </div>
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
