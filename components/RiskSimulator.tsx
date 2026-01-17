'use client'

import { useState } from 'react'

export default function RiskSimulator() {
  const [revenue, setRevenue] = useState(0)

  // Faturex: Progressive rates
  const getFaturexRate = (rev: number) => {
    if (rev > 5000) return 0.06
    if (rev > 2500) return 0.07
    return 0.08
  }

  const faturexRate = getFaturexRate(revenue)
  const faturexCost = revenue * faturexRate

  // Current System: Fixed costs (60€) + hidden card fees (2.5%)
  const currentSystemCost = 60.00 + (revenue * 0.025)
  const savings = currentSystemCost - faturexCost

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-green-400 text-center mb-6">
        Simulador de Custos Real
      </h3>
      <p className="text-gray-300 text-center text-lg mb-8">
        Compara o Faturex (0€ Fixos + Agendamento Grátis) vs O teu sistema atual (Mensalidade + TPA + Sistema de Marcações + Taxas Escondidas)
      </p>

      {/* Slider */}
      <div className="mb-8">
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(revenue / 10000) * 100}%, #374151 ${(revenue / 10000) * 100}%, #374151 100%)`
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
          <div className="text-gray-400 space-y-2">
            <p>60€ fixos (TPA + Software + Marcações)</p>
            <p>+ {(revenue * 0.025).toFixed(2)}€ em taxas de cartão (2.5%)</p>
            <p className="text-sm text-red-300 mt-2">
              ⚠️ Pagas mesmo que não trabalhe
            </p>
          </div>
        </div>

        {/* Faturex */}
        <div className="bg-gray-800 border-2 border-green-500 rounded-2xl p-8">
          <p className="text-green-400 text-sm font-semibold mb-3 uppercase">FATUREX</p>
          <p className="text-white text-5xl font-bold mb-4">{faturexCost.toFixed(2)}€</p>
          <div className="text-gray-400 space-y-2">
            {revenue === 0 ? (
              <p className="text-green-300 font-medium">
                ✅ Se não fatura, não paga. O Faturex assume o risco consigo.
              </p>
            ) : (
              <>
                <p>Taxa aplicada: {(faturexRate * 100).toFixed(0)}%</p>
                <p className="text-sm text-gray-500">
                  {revenue <= 2500 && "8% até 2.5k"}
                  {revenue > 2500 && revenue <= 5000 && "7% até 5k"}
                  {revenue > 5000 && "6% acima de 5k"}
                </p>
                <p className="text-green-300 font-medium mt-2">
                  ✅ Taxas de cartão incluídas
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Savings Indicator */}
      {revenue > 0 && (
        <div className="mt-8 text-center">
          <p className="text-green-400 text-2xl font-bold">
            {savings > 0
              ? `💰 Poupas ${savings.toFixed(2)}€ este mês!`
              : `Com o Faturex pagas ${Math.abs(savings).toFixed(2)}€ mais, mas sem riscos fixos e com taxas de cartão incluídas!`}
          </p>
          {savings > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Ao ano: {(savings * 12).toFixed(2)}€ de poupança garantida!
            </p>
          )}
        </div>
      )}

      {/* Zero Revenue Highlight */}
      {revenue === 0 && (
        <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-6">
          <p className="text-green-400 text-xl font-bold text-center">
            🎯 No sistema tradicional pagarias 60€ por este mês!
          </p>
          <p className="text-gray-300 text-center mt-2">
            Com o Faturex, meses de férias ou paragens custam 0€.
          </p>
        </div>
      )}
    </div>
  )
}
