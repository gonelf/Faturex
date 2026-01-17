import Link from 'next/link'
import { FileText, DollarSign, UserX, CreditCard, ArrowRight, Calendar } from 'lucide-react'
import Typewriter from '@/components/Typewriter'
import RiskSimulator from '@/components/RiskSimulator'

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
              Risco Zero
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-blue-600">O único software que só fatura</span>
            <br />
            <span className="text-purple-600">quando tu faturas. Ponto final.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sem mensalidades. Sem rendas fixas. Sem taxas de manutenção. Pagas apenas 8% por cada serviço cobrado. Se não trabalhares, o teu custo é zero absoluto.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-medium inline-flex items-center shadow-lg hover:shadow-xl"
            >
              Começar agora com Risco Zero
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
              Se a cadeira não roda, o Faturex não cobra.
            </h4>
            <p className="text-gray-600 text-center text-lg">
              Ideal para barbeiros, cabeleireiros e spas que querem previsibilidade total de custos. Férias? Mês parado? No Faturex, se não houver transações, não há comissões. Só ganhamos quando tu faturas.
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

      {/* Agendex Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
              AGENDAMENTO PROFISSIONAL INCLUÍDO
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A tua agenda agora trabalha para ti
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Não pagues por um software de marcações à parte. Com o Faturex, o sistema de agendamento online Agendex é gratuito.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                <Calendar className="h-10 w-10 text-white" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Agendex: O teu sistema de marcações grátis
            </h4>
            <p className="text-gray-600 text-lg mb-6 text-center">
              O Agendex (agora integrado no Faturex) permite que os teus clientes marquem cortes ou tratamentos diretamente pelo link na tua bio do Instagram. Recebe confirmações automáticas e reduz as faltas com lembretes inteligentes.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <p className="text-gray-600">Marcações a qualquer hora</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0€</div>
                <p className="text-gray-600">Sem custos mensais</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <p className="text-gray-600">Integrado com faturação</p>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">
              Tudo isto sem pagar mais um cêntimo por mês.
            </p>
          </div>
        </div>
      </section>

      {/* Risk Simulator Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <RiskSimulator />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">
            Ativa Agenda e Faturação Grátis
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Pare de pagar por meses maus. Comece hoje com 0€ fixos e pague apenas quando fatura.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-10 py-5 rounded-xl hover:bg-blue-50 transition text-lg font-bold inline-flex items-center shadow-lg"
          >
            Começar agora com Risco Zero
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
