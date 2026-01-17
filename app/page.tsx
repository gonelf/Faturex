import Link from 'next/link'
import { FileText, DollarSign, UserX, CreditCard, ArrowRight, Calendar } from 'lucide-react'
import Typewriter from '@/components/Typewriter'
import RiskSimulator from '@/components/RiskSimulator'
import ContactForm from '@/components/ContactForm'

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
            <a
              href="#contacto"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Pedir Contacto
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Certification Badge */}
          <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-200 px-6 py-3 rounded-full mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-semibold text-sm">
              ✓ Software Certificado pela AT  •  Migração em 48h
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Foque-se no seu talento,</span>
            <br />
            <span className="text-blue-600">nós tratamos do resto.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            TPA + Faturação Certificada + Agenda num único sistema com <span className="font-bold text-purple-600">custo fixo ZERO.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <a
              href="#contacto"
              className="bg-blue-600 text-white px-10 py-5 rounded-lg hover:bg-blue-700 transition text-lg font-bold inline-flex items-center shadow-lg hover:shadow-xl"
            >
              Pedir Contacto Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">Ativação única</p>
              <p className="text-2xl font-bold text-gray-900">79€</p>
              <p className="text-xs text-gray-500">Depois 0€ fixos/mês</p>
            </div>
          </div>
        </div>
      </section>

      {/* A Liberdade de Faturar Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O fim das rendas bancárias e faturas mensais.
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No Faturex, <span className="font-bold text-purple-600">se a sua cadeira não roda, você não paga nada.</span> Protegemos o seu lucro nos meses de férias ou de menor movimento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Faturação Certificada */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Faturação Certificada
              </h4>
              <p className="text-gray-600 text-center mb-4">
                Envio automático para a AT e ficheiro SAF-T.
              </p>
              <p className="text-blue-600 font-semibold text-center">
                Esqueça a burocracia.
              </p>
            </div>

            {/* TPA Físico */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition">
              <div className="flex justify-center mb-6">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                TPA Físico Sem Aluguer
              </h4>
              <p className="text-gray-600 text-center mb-4">
                O terminal Stripe Reader é seu para sempre.
              </p>
              <p className="text-purple-600 font-semibold text-center">
                Aceite cartões, MB Way e Apple Pay.
              </p>
            </div>

            {/* Agenda Agendex */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-100 hover:border-green-300 transition">
              <div className="flex justify-center mb-6">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Agenda Agendex Grátis
              </h4>
              <p className="text-gray-600 text-center mb-4">
                Marcações 24/7 integradas, com lembretes inteligentes.
              </p>
              <p className="text-green-600 font-semibold text-center">
                Acabe com os No-Shows.
              </p>
            </div>
          </div>

          {/* Bottom Highlight */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Se não trabalhar, paga 0.00€
            </p>
            <p className="text-gray-600 text-lg">
              Férias, meses fracos ou imprevistos: o Faturex adapta-se ao seu ritmo.
            </p>
          </div>
        </div>
      </section>

      {/* Transparência Total Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Compare o lucro real no fim do ano.
              </h3>
              <p className="text-xl text-gray-300">
                No sistema tradicional, paga cerca de <span className="text-yellow-400 font-bold text-2xl">720€/ano</span> em custos fixos <span className="text-red-400">(mesmo sem faturar)</span>.
              </p>
            </div>

            {/* Simple Comparison */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Traditional System */}
              <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-8">
                <h4 className="text-2xl font-bold text-red-400 mb-6 text-center">
                  Sistema Tradicional
                </h4>
                <div className="space-y-4 text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>TPA (Aluguer)</span>
                    <span className="font-bold">~15€/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Software Faturação</span>
                    <span className="font-bold">~25€/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>App Marcações</span>
                    <span className="font-bold">~20€/mês</span>
                  </div>
                  <div className="border-t border-red-500/30 pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold">Total/Mês:</span>
                      <span className="font-bold text-red-400">~60€</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl mt-2">
                      <span className="font-bold">Total/Ano:</span>
                      <span className="font-bold text-red-400">720€</span>
                    </div>
                  </div>
                  <p className="text-sm text-red-300 mt-4 text-center">
                    + Taxas de cartão por fora (1.5%-3%)
                  </p>
                </div>
              </div>

              {/* Faturex */}
              <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-8">
                <h4 className="text-2xl font-bold text-green-400 mb-6 text-center">
                  Faturex
                </h4>
                <div className="space-y-4 text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>TPA (Propriedade)</span>
                    <span className="font-bold text-green-400">0€/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Software Faturação</span>
                    <span className="font-bold text-green-400">0€/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>App Marcações (Agendex)</span>
                    <span className="font-bold text-green-400">0€/mês</span>
                  </div>
                  <div className="border-t border-green-500/30 pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold">Custos Fixos/Mês:</span>
                      <span className="font-bold text-green-400">0€</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl mt-2">
                      <span className="font-bold">Custos Fixos/Ano:</span>
                      <span className="font-bold text-green-400">0€</span>
                    </div>
                  </div>
                  <p className="text-sm text-green-300 mt-4 text-center">
                    Taxas de cartão já incluídas na comissão
                  </p>
                </div>
              </div>
            </div>

            {/* Investimento único */}
            <div className="bg-blue-500/10 border-2 border-blue-500 rounded-2xl p-8 text-center">
              <p className="text-2xl text-white mb-4">
                <span className="text-blue-400 font-bold">Investimento único de 79€</span> e depois apenas uma taxa justa sobre o que vende.
              </p>
              <div className="flex justify-center gap-8 mt-6">
                <div>
                  <p className="text-gray-400 text-sm">Até 2.500€</p>
                  <p className="text-white font-bold text-xl">8%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Até 5.000€</p>
                  <p className="text-white font-bold text-xl">5%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Acima 5.000€</p>
                  <p className="text-white font-bold text-xl">4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Risk Simulator Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <RiskSimulator />
        </div>
      </section>


      {/* FAQ Rápido Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            Perguntas Essenciais
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* FAQ 1 - Zero cost */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border-2 border-green-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">💚</span>
                Se eu não trabalhar, pago 0.00€?
              </h4>
              <p className="text-gray-700 text-lg">
                <span className="font-bold text-green-600">Sim!</span> Não há taxas de manutenção, taxas de "disponibilidade" ou qualquer outro custo escondido. Se não trabalhar, não paga. Ponto final.
              </p>
            </div>

            {/* FAQ 2 - Terminal ownership */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📱</span>
                O terminal é meu?
              </h4>
              <p className="text-gray-700 text-lg">
                <span className="font-bold text-purple-600">Sim!</span> Sem devoluções nem rendas. Depois de pagar os 79€ de ativação, o terminal Stripe Reader é seu para sempre.
              </p>
            </div>

            {/* FAQ 3 - What's included in 79€ */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📦</span>
                O que recebo pelos 79€?
              </h4>
              <p className="text-gray-700 text-lg">
                Terminal físico + Migração completa dos seus dados + Configuração em 48h. <span className="font-bold text-blue-600">Tudo pronto para começar a faturar.</span>
              </p>
            </div>

            {/* FAQ 4 - Certification */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-lg border-2 border-yellow-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">✓</span>
                É certificado pela AT?
              </h4>
              <p className="text-gray-700 text-lg">
                <span className="font-bold text-yellow-600">Sim!</span> Envio automático para a AT, ficheiro SAF-T e tudo 100% conforme a legislação portuguesa. Esqueça a burocracia.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 p-10 rounded-2xl">
            <p className="text-white text-2xl font-bold mb-4">
              Pronto para eliminar os custos fixos?
            </p>
            <a
              href="#contacto"
              className="bg-white text-blue-600 px-10 py-5 rounded-xl hover:bg-gray-50 transition text-lg font-bold inline-flex items-center shadow-lg"
            >
              Pedir Contacto (79€)
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contacto" className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comece hoje a eliminar os custos fixos
            </h3>
            <p className="text-xl text-gray-600">
              Preencha o formulário e entraremos em contacto em menos de 24 horas para ativar o seu Faturex.
            </p>
          </div>
          <ContactForm />
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
