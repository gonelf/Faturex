'use client'

import { useState } from 'react'

export default function RiskSimulator() {
  const [revenue, setRevenue] = useState(0)

  const faturexCost = revenue * 0.08
  const currentSystemCost = 60.00 // Mensalidade TPA + Software de faturação + Sistema de marcações

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-green-400 text-center mb-6">
        Simulador de Risco
      </h3>
      <p className="text-gray-300 text-center text-lg mb-8">
        Compara o Faturex (0€ Fixos + Agendamento Grátis) vs O teu sistema atual (Mensalidade + TPA + Sistema de Marcações)
      </p>

      {/* Slider */}
      <div className="mb-8">
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(revenue / 5000) * 100}%, #374151 ${(revenue / 5000) * 100}%, #374151 100%)`
          }}
        />
      </div>

      {/* Billing Display */}
      <div className="text-center mb-10">
        <p className="text-gray-400 text-lg mb-2">Faturação este mês:</p>
        <p className="text-green-400 text-4xl font-bold">{revenue.toFixed(2)}€</p>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-6">
        {/* Current System */}
        <div className="bg-gray-800 border-2 border-red-500 rounded-2xl p-8">
          <p className="text-red-400 text-sm font-semibold mb-3 uppercase">SISTEMA ATUAL</p>
          <p className="text-white text-5xl font-bold mb-4">{currentSystemCost.toFixed(2)}€</p>
          <p className="text-gray-400">
            O banco e o software cobram a mensalidade fixa, mesmo que não trabalhe.
          </p>
        </div>

        {/* Faturex */}
        <div className="bg-gray-800 border-2 border-green-500 rounded-2xl p-8">
          <p className="text-green-400 text-sm font-semibold mb-3 uppercase">FATUREX</p>
          <p className="text-white text-5xl font-bold mb-4">{faturexCost.toFixed(2)}€</p>
          <p className="text-gray-400">
            {revenue === 0
              ? "Se não fatura, não paga. O Faturex assume o risco consigo."
              : "Pagas apenas 8% por cada serviço cobrado. Se não trabalhares, o teu custo é zero absoluto."}
          </p>
        </div>
      </div>

      {/* Savings Indicator */}
      {revenue > 0 && (
        <div className="mt-8 text-center">
          <p className="text-green-400 text-2xl font-bold">
            {faturexCost < currentSystemCost
              ? `Poupas ${(currentSystemCost - faturexCost).toFixed(2)}€ este mês!`
              : revenue < 750
              ? `Ainda poupas ${(currentSystemCost - faturexCost).toFixed(2)}€ este mês!`
              : `Com o Faturex pagas ${(faturexCost - currentSystemCost).toFixed(2)}€ mais, mas sem riscos fixos!`}
          </p>
        </div>
      )}
    </div>
  )
}
