import Link from 'next/link'
import { FileText, DollarSign, UserX, CreditCard, ArrowRight, Calendar, AlertCircle, TrendingDown } from 'lucide-react'
import Typewriter from '@/components/Typewriter'
import RiskSimulator from '@/components/RiskSimulator'
import ContactForm from '@/components/ContactForm'
import PriceCalculator from '@/components/PriceCalculator'

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
              ✓ Software Certificado pela AT  •  Ativação em 48h
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Custo Fixo Zero:</span>
            <br />
            <span className="text-blue-600">O Software de Faturação que só paga quando vende.</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Acabe com as mensalidades fixas de 60€/mês. Tenha um sistema completo, certificado pela AT, com TPA e Agenda incluídos por uma taxa simples de <span className="font-bold text-purple-600">8%</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <a
              href="#contacto"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition text-lg font-bold inline-flex items-center shadow-xl hover:shadow-2xl"
            >
              Ativar Agora por 79€ (Taxa Única)
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            <p>Depois: <span className="font-bold text-green-600 text-lg">0€/mês</span> em custos fixos</p>
          </div>
        </div>
      </section>

      {/* Seção de Empatia: O Problema */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                O Dilema das PME
              </h3>
              <p className="text-2xl text-gray-700 font-semibold">
                Porquê pagar <span className="text-red-600 font-bold">720€/ano</span> em custos fixos quando o seu negócio tem meses que nem isso fatura?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Pain Point 1 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-red-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Subscrições que aumentam anualmente
                    </h4>
                    <p className="text-gray-700">
                      Começou a pagar 25€/mês pelo software? Daqui a 2 anos já está nos 35€. As empresas tradicionais aumentam preços todos os anos, e você não tem escolha a não ser aceitar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pain Point 2 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-orange-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Custos fixos mesmo em meses de férias
                    </h4>
                    <p className="text-gray-700">
                      Agosto parado? Dezembro devagar? Não importa. A mensalidade do software, do TPA e da agenda vem na mesma. 60€ todos os meses, trabalhe ou não.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pain Point 3 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-yellow-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Complexidade de integrar pagamentos
                    </h4>
                    <p className="text-gray-700">
                      Quer aceitar MB Way? Precisa de outro fornecedor. Stripe? Mais uma integração. E ainda paga taxas de aluguer do terminal. Tudo separado, tudo complicado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pain Point 4 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Agenda separada com custo extra
                    </h4>
                    <p className="text-gray-700">
                      Quer uma agenda online? Mais 20€/mês. E claro, não está integrada com a faturação nem com os pagamentos. Mais trabalho manual para si.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contrast Statement */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-10 text-center shadow-2xl">
              <p className="text-white text-2xl md:text-3xl font-bold mb-4">
                Softwares simples que são limitados
              </p>
              <p className="text-gray-400 text-xl mb-6">ou</p>
              <p className="text-white text-2xl md:text-3xl font-bold mb-8">
                Softwares bons que são caros e complexos
              </p>
              <div className="inline-block bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-xl">
                E se houvesse uma terceira opção?
              </div>
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
          </div>
        </div>
      </section>

      {/* Price Calculator Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <PriceCalculator />
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Transparência Total: FAQ
            </h3>
            <p className="text-xl text-gray-600">
              Todas as suas dúvidas respondidas com clareza absoluta
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 - Certification */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border-2 border-green-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">✓</span>
                É certificado pela AT?
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-bold text-green-600">Sim, 100% conforme a lei.</span> O Faturex é totalmente certificado pela Autoridade Tributária portuguesa. Todos os documentos são enviados automaticamente para a AT, incluindo ficheiro SAF-T e ATCUD. Esqueça completamente a burocracia fiscal.
              </p>
            </div>

            {/* FAQ 2 - Terminal ownership */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📱</span>
                O terminal (TPA) é meu?
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-bold text-purple-600">Sim, é propriedade sua!</span> Após pagar os 79€ de ativação, o Stripe Reader é completamente seu. Sem alugueres mensais, sem devoluções, sem contratos de permanência. O terminal fica consigo para sempre.
              </p>
            </div>

            {/* FAQ 3 - High volume */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📈</span>
                E se eu faturar muito?
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-bold text-blue-600">Quanto mais vender, menos paga!</span> A taxa desce progressivamente:
              </p>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800 mb-1">Até 2.500€/mês</p>
                  <p className="text-2xl font-bold text-blue-900">8%</p>
                </div>
                <div className="bg-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800 mb-1">Até 5.000€/mês</p>
                  <p className="text-2xl font-bold text-blue-900">5%</p>
                </div>
                <div className="bg-blue-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800 mb-1">Acima de 5.000€/mês</p>
                  <p className="text-2xl font-bold text-blue-900">4%</p>
                </div>
              </div>
            </div>

            {/* FAQ 4 - Zero cost confirmation */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-lg border-2 border-yellow-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">💚</span>
                Se eu não trabalhar, pago 0.00€?
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-bold text-yellow-600">Sim, literalmente zero!</span> Não há taxas de manutenção, taxas de "disponibilidade", taxas de suporte ou qualquer outro custo escondido. Mês de férias? Mês fraco? Imprevistos? Paga 0.00€. Só paga quando vende.
              </p>
            </div>

            {/* FAQ 5 - What's included */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border-2 border-indigo-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📦</span>
                O que recebo pelos 79€ de ativação?
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                <span className="font-bold text-indigo-600">Tudo o que precisa para começar:</span>
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 text-xl">✓</span>
                  <span>Terminal físico Stripe Reader (seu para sempre)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 text-xl">✓</span>
                  <span>Migração completa dos seus dados atuais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 text-xl">✓</span>
                  <span>Configuração e ativação em 48 horas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 text-xl">✓</span>
                  <span>Integração completa: Faturação + TPA + Agenda</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 text-xl">✓</span>
                  <span>Suporte na configuração inicial</span>
                </li>
              </ul>
            </div>

            {/* FAQ 6 - Payment methods */}
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border-2 border-pink-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">💳</span>
                Que métodos de pagamento posso aceitar?
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-bold text-pink-600">Todos os principais:</span> Cartões de débito e crédito (Visa, Mastercard), MB Way, Apple Pay, Google Pay e pagamentos contactless. Tudo integrado no mesmo terminal, tudo incluído na taxa.
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
            <p className="text-xl text-gray-600 mb-8">
              Preencha o formulário e entraremos em contacto em menos de 24 horas para ativar o seu Faturex.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-full border-2 border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-semibold text-sm">✓ Certificado pela AT</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full border-2 border-blue-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700 font-semibold text-sm">🔒 Segurança Stripe</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-6 py-3 rounded-full border-2 border-purple-200">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 font-semibold text-sm">⚡ Ativação em 48h</span>
              </div>
            </div>
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
