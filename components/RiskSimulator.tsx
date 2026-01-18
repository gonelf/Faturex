'use client'

import { useState } from 'react'

export default function RiskSimulator() {
  const [revenue, setRevenue] = useState(0)
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly')

  // Faturex: Competitive progressive rates
  const getFaturexRate = (rev: number) => {
    if (rev > 5000) return 0.05   // 5% above 5k - very competitive
    if (rev > 2500) return 0.07   // 7% mid-tier - attractive
    return 0.08                    // 8% entry tier
  }

  const faturexRate = getFaturexRate(revenue)
  const faturexCost = revenue * faturexRate

  // Current System: Fixed costs (60€) + hidden card fees (2.5%)
  const currentSystemCost = 60.00 + (revenue * 0.025)
  const savings = currentSystemCost - faturexCost

  // Annual Calculation: 8 good months + 4 weak months (realistic 1000€ in weak months)
  const calculateAnnual = (goodMonthRev: number) => {
    const badMonthRev = 1000  // Fixed realistic value for weak months (vacation/low season)

    const calcFaturex = (rev: number) => {
      if (rev > 5000) return rev * 0.05
      if (rev > 2500) return rev * 0.07
      return rev * 0.08
    }

    const calcTrad = (rev: number) => 60 + (rev * 0.025)  // Fixed + bank fees

    const annualFaturex = (calcFaturex(goodMonthRev) * 8) + (calcFaturex(badMonthRev) * 4)
    const annualTraditional = (calcTrad(goodMonthRev) * 8) + (calcTrad(badMonthRev) * 4)

    return {
      faturex: annualFaturex,
      traditional: annualTraditional,
      savings: annualTraditional - annualFaturex,
      monthlyAverage: (annualTraditional - annualFaturex) / 12,
      weakMonthFaturex: calcFaturex(badMonthRev),
      weakMonthTrad: calcTrad(badMonthRev)
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
          : 'Cenário Real: 8 meses bons + 4 meses fracos (~1.000€ em férias/baixa época)'}
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
              (Meses fracos: 1.000€ - férias/época baixa)
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
                      {revenue > 5000 && "5% acima de 5k"}
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
                <p>+ {((revenue * 0.025 * 8) + (1000 * 0.025 * 4)).toFixed(2)}€ em taxas de cartão</p>
                <p className="text-sm text-red-300 mt-2">
                  ⚠️ Pagas 720€ fixos + taxas mesmo nos meses fracos
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
                    <p>4 meses fracos: {(getFaturexRate(1000) * 100).toFixed(0)}% sobre 1.000€</p>
                    <p className="text-green-300 font-medium mt-2">
                      ✅ Nos meses fracos: apenas {annualData.weakMonthFaturex.toFixed(2)}€ vs {annualData.weakMonthTrad.toFixed(2)}€!
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
                  : `💼 Investimento em Liberdade: Apenas ${Math.abs(savings).toFixed(2)}€ de diferença para ter 0€ de custos fixos!`}
              </p>
              {savings > 0 ? (
                <p className="text-gray-400 text-sm mt-2">
                  Ao ano: {(savings * 12).toFixed(2)}€ de poupança potencial!
                </p>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  Inclui TPA físico + Agendamento + 0€ em meses de paragem
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-green-400 text-2xl font-bold">
                {annualData.savings > 0
                  ? `🎯 Poupança anual: ${annualData.savings.toFixed(2)}€!`
                  : `💼 Investimento em Liberdade: Apenas ${Math.abs(annualData.savings).toFixed(2)}€ de diferença anual para ter 0€ de custos fixos e Agendamento + TPA incluídos.`}
              </p>
              {annualData.savings > 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  Média mensal: Poupas {annualData.monthlyAverage.toFixed(2)}€ por mês!
                </p>
              )}
              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  💡 <strong>O Segredo:</strong> Nos meses de faturação baixa (1.000€), enquanto o sistema tradicional lhe cobra {annualData.weakMonthTrad.toFixed(2)}€ (60€ fixos + 25€ taxas), o Faturex cobra apenas {annualData.weakMonthFaturex.toFixed(2)}€ (taxa única). A nossa taxa protege-o quando mais precisa, e nos meses bons, garante que tem o Agendex e o TPA incluídos sem rendas fixas.
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
