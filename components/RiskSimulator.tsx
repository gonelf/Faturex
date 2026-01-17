'use client'

import { useState } from 'react'

export default function RiskSimulator() {
  const [revenue, setRevenue] = useState(0)
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly')

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

  // Annual Calculation: 8 good months + 4 weak months (30% of normal revenue)
  const calculateAnnual = (goodMonthRev: number) => {
    const badMonthRev = goodMonthRev * 0.30

    const calcFaturex = (rev: number) => {
      const rate = rev > 5000 ? 0.06 : rev > 2500 ? 0.07 : 0.08
      return rev * rate
    }

    const annualFaturex = (calcFaturex(goodMonthRev) * 8) + (calcFaturex(badMonthRev) * 4)
    const annualTraditional = (60 * 12) + (goodMonthRev * 0.025 * 8) + (badMonthRev * 0.025 * 4)

    return {
      faturex: annualFaturex,
      traditional: annualTraditional,
      savings: annualTraditional - annualFaturex,
      monthlyAverage: (annualTraditional - annualFaturex) / 12
    }
  }

  const annualData = calculateAnnual(revenue)

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-green-400 text-center mb-6">
        Simulador de Custos Real
      </h3>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              viewMode === 'monthly'
                ? 'bg-green-500 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Visão Mensal
          </button>
          <button
            onClick={() => setViewMode('annual')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              viewMode === 'annual'
                ? 'bg-green-500 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Visão Anual
          </button>
        </div>
      </div>

      <p className="text-gray-300 text-center text-lg mb-8">
        {viewMode === 'monthly'
          ? 'Compara o Faturex (0€ Fixos + Agendamento Grátis) vs O teu sistema atual'
          : 'Cenário Real: 8 meses bons + 4 meses fracos (férias, baixa época, imprevistos)'}
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
        {viewMode === 'monthly' ? (
          <>
            <p className="text-gray-400 text-lg mb-2">Faturação este mês:</p>
            <p className="text-green-400 text-4xl font-bold">{revenue.toFixed(2)}€</p>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-lg mb-2">Faturação média em mês bom:</p>
            <p className="text-green-400 text-4xl font-bold">{revenue.toFixed(2)}€</p>
            <p className="text-gray-500 text-sm mt-2">
              (Meses fracos: {(revenue * 0.3).toFixed(2)}€ - 30% do normal)
            </p>
          </>
        )}
      </div>

      {/* Comparison Cards */}
      <div className="space-y-6">
        {viewMode === 'monthly' ? (
          <>
            {/* Monthly View */}
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
          </>
        ) : (
          <>
            {/* Annual View */}
            {/* Current System Annual */}
            <div className="bg-gray-800 border-2 border-red-500 rounded-2xl p-8">
              <p className="text-red-400 text-sm font-semibold mb-3 uppercase">SISTEMA ATUAL (ANO COMPLETO)</p>
              <p className="text-white text-5xl font-bold mb-4">{annualData.traditional.toFixed(2)}€</p>
              <div className="text-gray-400 space-y-2">
                <p>720€ em custos fixos (60€ × 12 meses)</p>
                <p>+ {((revenue * 0.025 * 8) + (revenue * 0.3 * 0.025 * 4)).toFixed(2)}€ em taxas de cartão</p>
                <p className="text-sm text-red-300 mt-2">
                  ⚠️ Pagas 720€ mesmo nos 4 meses fracos
                </p>
              </div>
            </div>

            {/* Faturex Annual */}
            <div className="bg-gray-800 border-2 border-green-500 rounded-2xl p-8">
              <p className="text-green-400 text-sm font-semibold mb-3 uppercase">FATUREX (ANO COMPLETO)</p>
              <p className="text-white text-5xl font-bold mb-4">{annualData.faturex.toFixed(2)}€</p>
              <div className="text-gray-400 space-y-2">
                {revenue === 0 ? (
                  <p className="text-green-300 font-medium">
                    ✅ Define uma faturação para ver o cenário anual realista
                  </p>
                ) : (
                  <>
                    <p>8 meses bons: {(getFaturexRate(revenue) * 100).toFixed(0)}% sobre {revenue.toFixed(0)}€</p>
                    <p>4 meses fracos: {(getFaturexRate(revenue * 0.3) * 100).toFixed(0)}% sobre {(revenue * 0.3).toFixed(0)}€</p>
                    <p className="text-green-300 font-medium mt-2">
                      ✅ Nos meses fracos, pagas quase zero!
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Savings Indicator */}
      {revenue > 0 && (
        <div className="mt-8 text-center">
          {viewMode === 'monthly' ? (
            <>
              <p className="text-green-400 text-2xl font-bold">
                {savings > 0
                  ? `💰 Poupas ${savings.toFixed(2)}€ este mês!`
                  : `Com o Faturex pagas ${Math.abs(savings).toFixed(2)}€ mais, mas sem riscos fixos e com taxas de cartão incluídas!`}
              </p>
              {savings > 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  Ao ano: {(savings * 12).toFixed(2)}€ de poupança potencial!
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-green-400 text-2xl font-bold">
                {annualData.savings > 0
                  ? `🎯 Poupança anual: ${annualData.savings.toFixed(2)}€!`
                  : `Com o Faturex pagas ${Math.abs(annualData.savings).toFixed(2)}€ mais no ano, mas sem riscos nos meses fracos!`}
              </p>
              {annualData.savings > 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  Média mensal: Poupas {annualData.monthlyAverage.toFixed(2)}€ por mês!
                </p>
              )}
              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  💡 <strong>O segredo:</strong> Nos 4 meses fracos (Jan, Fev, Ago, Nov), enquanto o sistema tradicional cobra 240€ em rendas, o Faturex adapta-se e cobra apenas {((revenue * 0.3 * getFaturexRate(revenue * 0.3)) * 4).toFixed(2)}€. É aí que ganha!
                </p>
              </div>
            </>
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
