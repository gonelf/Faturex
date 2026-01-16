import Link from 'next/link'
import { FileText, DollarSign, UserX, CreditCard, ArrowRight } from 'lucide-react'
import Typewriter from '@/components/Typewriter'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Faturex</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Começar Grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-blue-600">Quanto lhe custa</span>
            <br />
            <Typewriter words={['a barbearia', 'o salão', 'o spa', 'o ginásio', 'a clínica']} delay={2000} />
            <span className="text-purple-600"> num mês mau?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O seu software atual cobra sempre a mensalidade. O Faturex não. Estamos do seu lado.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-medium inline-flex items-center shadow-lg hover:shadow-xl"
            >
              Comece grátis
            </Link>
            <Link
              href="/login"
              className="text-gray-700 px-8 py-4 rounded-lg hover:text-gray-900 transition text-lg font-medium inline-flex items-center"
            >
              Entrar <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Estamos Juntos Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Estamos Juntos
        </h3>
        <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
          {/* Feature 1 - Zero Cost */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Se a cadeira está vazia, o custo é zero.
            </h4>
            <p className="text-gray-600 text-center text-lg">
              Férias? Mês parado? No Faturex, se não houver transações, não há comissões. Só ganhamos quando o senhor fatura.
            </p>
          </div>

          {/* Feature 2 - No Shows */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                <UserX className="h-10 w-10 text-white" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Acabe com o prejuízo dos No-Shows.
            </h4>
            <p className="text-gray-600 text-center text-lg">
              O cliente não apareceu? Com o nosso sistema de marcação online, pode cobrar um sinal no agendamento. Se ele faltar, o seu tempo continua pago.
            </p>
          </div>

          {/* Feature 3 - Bank Rents */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Adeus, Rendas do Banco.
            </h4>
            <p className="text-gray-600 text-center text-lg">
              Para quê pagar aluguer de um TPA e mensalidade de faturação todos os meses? O Faturex substitui tudo isso por uma taxa única e justa por serviço.
            </p>
          </div>
        </div>
      </section>

      {/* Risk Simulator Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-green-400 text-center mb-6">
              Simulador de Risco
            </h3>
            <p className="text-gray-300 text-center text-lg mb-8">
              Arraste para ver o que acontece num mês mau:
            </p>

            {/* Slider */}
            <div className="mb-8">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Billing Display */}
            <div className="text-center mb-10">
              <p className="text-gray-400 text-lg mb-2">Faturação este mês:</p>
              <p className="text-green-400 text-4xl font-bold">0€</p>
            </div>

            {/* Comparison Cards */}
            <div className="space-y-6">
              {/* Current System */}
              <div className="bg-gray-800 border-2 border-red-500 rounded-2xl p-8">
                <p className="text-red-400 text-sm font-semibold mb-3 uppercase">SISTEMA ATUAL</p>
                <p className="text-white text-5xl font-bold mb-4">60.00€</p>
                <p className="text-gray-400">
                  O banco e o software cobram a mensalidade fixa, mesmo que não trabalhe.
                </p>
              </div>

              {/* Faturex */}
              <div className="bg-gray-800 border-2 border-green-500 rounded-2xl p-8">
                <p className="text-green-400 text-sm font-semibold mb-3 uppercase">FATUREX</p>
                <p className="text-white text-5xl font-bold mb-4">0.00€</p>
                <p className="text-gray-400">
                  Se não fatura, não paga. O Faturex assume o risco consigo.
                </p>
              </div>
            </div>

            {/* Note */}
            <p className="text-gray-500 text-sm text-center mt-8">
              *Nota: Taxa de disponibilidade de 20€ apenas aplicada para manter o sistema ativo se houver faturação mínima registada.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">
            Junte-se ao Faturex
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Pare de pagar por meses maus. Comece hoje e pague apenas quando fatura.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-10 py-5 rounded-xl hover:bg-blue-50 transition text-lg font-bold inline-flex items-center shadow-lg"
          >
            Comece grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Faturex. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Estamos do seu lado.</p>
        </div>
      </footer>
    </div>
  )
}
