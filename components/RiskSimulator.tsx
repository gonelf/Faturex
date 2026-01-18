'use client'

import { useState } from 'react'

export default function RiskSimulator() {
  const [goodMonthRevenue, setGoodMonthRevenue] = useState(3500)
  const [badMonthRevenue, setBadMonthRevenue] = useState(1000)
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('annual')

  // Faturex: Competitive progressive rates
  const getFaturexRate = (rev: number) => {
    if (rev > 5000) return 0.05   // 5% above 5k
    if (rev > 2500) return 0.06   // 6% mid-tier
    return 0.08                    // 8% entry tier
  }

  // Calculate for monthly view (using good month as reference)
  const revenue = goodMonthRevenue
  const faturexRate = getFaturexRate(revenue)
  const faturexCost = revenue * faturexRate

  // Current System: Fixed costs (60€) + hidden card fees (2.5%)
  const currentSystemCost = 60.00 + (revenue * 0.025)
  const savings = currentSystemCost - faturexCost

  // Annual Calculation: 4 good + 4 medium + 4 bad months
  const calculateAnnual = (goodMonthRev: number, badMonthRev: number) => {
    const mediumMonthRev = (goodMonthRev + badMonthRev) / 2

    const calcFaturex = (rev: number) => {
      if (rev > 5000) return rev * 0.05
      if (rev > 2500) return rev * 0.06
      return rev * 0.08
    }

    const calcTrad = (rev: number) => 60 + (rev * 0.025)  // Fixed + bank fees

    const annualFaturex = (calcFaturex(goodMonthRev) * 4) + (calcFaturex(mediumMonthRev) * 4) + (calcFaturex(badMonthRev) * 4)
    const annualTraditional = (calcTrad(goodMonthRev) * 4) + (calcTrad(mediumMonthRev) * 4) + (calcTrad(badMonthRev) * 4)

    return {
      faturex: annualFaturex,
      traditional: annualTraditional,
      savings: annualTraditional - annualFaturex,
      monthlyAverage: (annualTraditional - annualFaturex) / 12,
      goodMonthFaturex: calcFaturex(goodMonthRev),
      goodMonthTrad: calcTrad(goodMonthRev),
      mediumMonthFaturex: calcFaturex(mediumMonthRev),
      mediumMonthTrad: calcTrad(mediumMonthRev),
      badMonthFaturex: calcFaturex(badMonthRev),
      badMonthTrad: calcTrad(badMonthRev),
      mediumMonthRev
    }
  }

  const annualData = calculateAnnual(goodMonthRevenue, badMonthRevenue)

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
          : 'Cenário Real: 4 meses bons + 4 meses médios + 4 meses maus'}
      </p>

      {/* Sliders */}
      <div className="space-y-8 mb-10">
        {/* Good Month Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-300 font-medium">Mês Bom:</label>
            <span className="text-green-400 text-2xl font-bold">{goodMonthRevenue.toFixed(0)}€</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={goodMonthRevenue}
            onChange={(e) => setGoodMonthRevenue(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(goodMonthRevenue / 5000) * 100}%, #374151 ${(goodMonthRevenue / 5000) * 100}%, #374151 100%)`
            }}
          />
        </div>

        {/* Bad Month Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-300 font-medium">Mês Mau:</label>
            <span className="text-yellow-400 text-2xl font-bold">{badMonthRevenue.toFixed(0)}€</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={badMonthRevenue}
            onChange={(e) => setBadMonthRevenue(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #eab308 0%, #eab308 ${(badMonthRevenue / 5000) * 100}%, #374151 ${(badMonthRevenue / 5000) * 100}%, #374151 100%)`
            }}
          />
        </div>

        {/* Medium Month Display */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Mês Médio (calculado):</span>
            <span className="text-blue-400 text-xl font-bold">{annualData.mediumMonthRev.toFixed(0)}€</span>
          </div>
        </div>
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
                      {revenue > 2500 && revenue <= 5000 && "6% até 5k"}
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
                <p className="font-semibold text-white">720€ em custos fixos (60€ × 12 meses)</p>
                <p>+ {((goodMonthRevenue * 0.025 * 4) + (annualData.mediumMonthRev * 0.025 * 4) + (badMonthRevenue * 0.025 * 4)).toFixed(2)}€ em taxas de cartão</p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm">4 meses bons: {annualData.goodMonthTrad.toFixed(2)}€ × 4 = {(annualData.goodMonthTrad * 4).toFixed(2)}€</p>
                  <p className="text-sm">4 meses médios: {annualData.mediumMonthTrad.toFixed(2)}€ × 4 = {(annualData.mediumMonthTrad * 4).toFixed(2)}€</p>
                  <p className="text-sm">4 meses maus: {annualData.badMonthTrad.toFixed(2)}€ × 4 = {(annualData.badMonthTrad * 4).toFixed(2)}€</p>
                </div>
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
                {goodMonthRevenue === 0 ? (
                  <p className="text-green-300 font-medium">
                    ✅ Define uma faturação para ver o cenário anual realista
                  </p>
                ) : (
                  <>
                    <p className="font-semibold text-white">0€ em custos fixos</p>
                    <p>Apenas comissões sobre faturação real</p>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm">4 meses bons ({goodMonthRevenue.toFixed(0)}€): {annualData.goodMonthFaturex.toFixed(2)}€ × 4 = {(annualData.goodMonthFaturex * 4).toFixed(2)}€</p>
                      <p className="text-sm">4 meses médios ({annualData.mediumMonthRev.toFixed(0)}€): {annualData.mediumMonthFaturex.toFixed(2)}€ × 4 = {(annualData.mediumMonthFaturex * 4).toFixed(2)}€</p>
                      <p className="text-sm">4 meses maus ({badMonthRevenue.toFixed(0)}€): {annualData.badMonthFaturex.toFixed(2)}€ × 4 = {(annualData.badMonthFaturex * 4).toFixed(2)}€</p>
                    </div>
                    <p className="text-green-300 font-medium mt-2">
                      ✅ Nos meses maus: apenas {annualData.badMonthFaturex.toFixed(2)}€ vs {annualData.badMonthTrad.toFixed(2)}€!
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
        <div className="mt-8">
          {viewMode === 'monthly' ? (
            <div className="text-center">
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
            </div>
          ) : (
            <>
              {/* Savings Highlight Box */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500 rounded-2xl p-8 mb-6">
                <div className="text-center">
                  <p className="text-gray-300 text-lg mb-2">Poupança Anual Total</p>
                  <p className="text-green-400 text-6xl font-bold mb-4">
                    {annualData.savings > 0 ? annualData.savings.toFixed(2) : '0.00'}€
                  </p>
                  {annualData.savings > 0 ? (
                    <>
                      <p className="text-green-300 text-xl font-semibold mb-2">
                        🎯 Poupas {annualData.savings.toFixed(2)}€ por ano!
                      </p>
                      <p className="text-gray-400 text-lg">
                        Média mensal: {annualData.monthlyAverage.toFixed(2)}€ por mês
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-300 text-lg">
                      💼 Investimento em Liberdade: Apenas {Math.abs(annualData.savings).toFixed(2)}€ de diferença anual para ter 0€ de custos fixos e Agendamento + TPA incluídos.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <p className="text-blue-300">
                  💡 <strong>O Segredo:</strong> Nos meses maus ({badMonthRevenue.toFixed(0)}€), enquanto o sistema tradicional cobra {annualData.badMonthTrad.toFixed(2)}€ (60€ fixos + taxas), o Faturex cobra apenas {annualData.badMonthFaturex.toFixed(2)}€. A nossa taxa protege-o quando mais precisa, e nos meses bons, garante que tem o Agendex e o TPA incluídos sem rendas fixas.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Zero Revenue Highlight */}
      {(goodMonthRevenue === 0 && badMonthRevenue === 0) && (
        <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-6">
          <p className="text-green-400 text-xl font-bold text-center">
            🎯 No sistema tradicional pagarias 60€ por mês mesmo sem faturar!
          </p>
          <p className="text-gray-300 text-center mt-2">
            Com o Faturex, meses de férias ou paragens custam 0€.
          </p>
        </div>
      )}
    </div>
  )
}
