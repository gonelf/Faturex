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
            <span className="text-blue-600">O único software de faturação</span>
            <br />
            <span className="text-purple-600">com TPA físico e custo mensal ZERO.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Livre-se das rendas do banco. Com uma taxa única de ativação de 79€, recebe o seu terminal físico e nós migramos os seus dados. Depois, só paga se faturar.
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

      {/* Terminal & Setup Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
              TUDO INCLUÍDO
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tudo o que precisa por 79€. Sem rendas, sem surpresas.
            </h3>
            <p className="text-xl text-blue-100 mb-12">
              A nossa taxa de ativação única cobre o envio do seu novo Terminal Físico e o nosso trabalho de migração. Importamos os seus clientes e produtos para que possa começar a trabalhar em 48h. Depois disso, esqueça as faturas mensais.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="text-5xl mb-4">📱</div>
                <h4 className="text-2xl font-bold text-white mb-3">Terminal Físico</h4>
                <p className="text-blue-100">
                  Receba o seu Stripe Reader. Aceita pagamentos com cartão, MB Way e Apple Pay.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="text-5xl mb-4">🔄</div>
                <h4 className="text-2xl font-bold text-white mb-3">Migração de Dados</h4>
                <p className="text-blue-100">
                  Migramos todos os seus clientes, produtos e histórico do sistema antigo.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="text-5xl mb-4">⚙️</div>
                <h4 className="text-2xl font-bold text-white mb-3">Configuração Completa</h4>
                <p className="text-blue-100">
                  Configuramos tudo para si. Em 48h está pronto a faturar sem dores de cabeça.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <p className="text-2xl font-bold text-white mb-4">
                💶 Taxa de Ativação: 79€ (Pagamento Único)
              </p>
              <p className="text-xl text-blue-100">
                Depois? <span className="font-bold text-white">0€ de mensalidades.</span> Apenas taxa sobre vendas: 8% até 2.5k, 7% até 5k, 6% acima.
              </p>
            </div>
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

      {/* Comparison Table Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
            Faturex vs. Sistema Tradicional
          </h3>
          <p className="text-xl text-gray-600 text-center mb-12">
            Vê quanto estás a perder com custos "escondidos" no teu banco e software atual.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-bold">Funcionalidade</th>
                  <th className="px-6 py-4 text-left text-lg font-bold">Sistema Tradicional</th>
                  <th className="px-6 py-4 text-left text-lg font-bold">Faturex + Agendex</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">Software Faturação</td>
                  <td className="px-6 py-4 text-gray-600">~25€ /mês</td>
                  <td className="px-6 py-4 font-bold text-green-600">0€ (Incluído)</td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">App de Marcações</td>
                  <td className="px-6 py-4 text-gray-600">~20€ /mês</td>
                  <td className="px-6 py-4 font-bold text-green-600">0€ (Grátis)</td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">Aluguer de TPA</td>
                  <td className="px-6 py-4 text-gray-600">~15€ /mês</td>
                  <td className="px-6 py-4 font-bold text-green-600">0€ (79€ uma vez)</td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">Taxas de Cartão</td>
                  <td className="px-6 py-4 text-gray-600">+ 1.5% a 3% por venda</td>
                  <td className="px-6 py-4 font-bold text-green-600">Incluído na Taxa</td>
                </tr>
                <tr className="bg-red-50 hover:bg-red-100 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">Mês de Férias (0€ vendas)</td>
                  <td className="px-6 py-4 font-bold text-red-600 text-xl">Pagas ~60€</td>
                  <td className="px-6 py-4 font-bold text-green-600 text-xl">Pagas 0€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border-2 border-green-200">
            <p className="text-center text-2xl font-bold text-gray-900">
              💰 Poupança média anual: <span className="text-green-600">720€ em custos fixos</span>
            </p>
            <p className="text-center text-gray-600 mt-2">
              Sem contar os meses em que não faturas nada e pagas 0€ no Faturex!
            </p>
          </div>
        </div>
      </section>

      {/* Seasonality Reality Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Não olhe apenas para o mês de Dezembro. Olhe para o seu ano inteiro.
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              A realidade de um salão, barbearia ou spa: <span className="text-yellow-400 font-bold">4 a 5 meses difíceis por ano</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Good Months */}
            <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                <span className="text-3xl mr-3">📈</span> 8 Meses Bons
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li>✓ Março a Julho: Época alta</li>
                <li>✓ Setembro e Outubro: Regresso</li>
                <li>✓ Dezembro: Pico festivo</li>
              </ul>
              <p className="text-green-400 font-bold mt-4">
                Faturação normal ou acima da média
              </p>
            </div>

            {/* Weak Months */}
            <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
                <span className="text-3xl mr-3">📉</span> 4 Meses Fracos
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li>⚠️ Janeiro/Fevereiro: Ressaca do Natal</li>
                <li>⚠️ Agosto: Férias (salão pode fechar)</li>
                <li>⚠️ Novembro: Abrandamento pré-Natal</li>
                <li>⚠️ Imprevistos: Doença, obras, etc.</li>
              </ul>
              <p className="text-red-400 font-bold mt-4">
                Faturação cai 60-70% ou vai a ZERO
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border-2 border-blue-500 rounded-2xl p-8 text-center">
            <p className="text-2xl text-white font-bold mb-4">
              💡 O Argumento Decisivo
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              Nos meses de pico, o custo variável acompanha o seu sucesso. Mas nos <span className="text-yellow-400 font-bold">4 meses de baixa faturação</span>, o Faturex poupa-lhe <span className="text-green-400 font-bold">centenas de euros</span> em rendas que os outros sistemas cobram sem piedade. No final do ano, <span className="text-white font-bold">o lucro que mantém no bolso é maior</span> porque o Faturex absorve o risco consigo nos momentos parados.
            </p>
          </div>
        </div>
      </section>

      {/* Annual Comparison Table Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-white mb-6">
            Comparação de Cenário Anual
          </h3>
          <p className="text-xl text-gray-400 text-center mb-12">
            A realidade completa: 8 meses normais + 4 meses de baixa
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-bold">Cenário Anual</th>
                  <th className="px-6 py-4 text-left text-lg font-bold">Sistema Tradicional</th>
                  <th className="px-6 py-4 text-left text-lg font-bold">Faturex</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-200">8 Meses Bons</td>
                  <td className="px-6 py-4 text-gray-400">Pagas Rendas (480€) + Taxas</td>
                  <td className="px-6 py-4 font-bold text-green-400">Pagas conforme o lucro</td>
                </tr>
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-200">4 Meses Fracos/Férias</td>
                  <td className="px-6 py-4 text-red-400 font-bold">Pagas 240€ de rendas fixas</td>
                  <td className="px-6 py-4 font-bold text-green-400">Pagas quase 0€</td>
                </tr>
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-200">Risco de Prejuízo</td>
                  <td className="px-6 py-4 text-gray-400">Elevado (Custo fixo sufoca)</td>
                  <td className="px-6 py-4 font-bold text-green-400">Zero (Custo adapta-se)</td>
                </tr>
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-200">Equipamento (TPA)</td>
                  <td className="px-6 py-4 text-gray-400">Alugado (Nunca é teu)</td>
                  <td className="px-6 py-4 font-bold text-green-400">Teu (79€ uma vez)</td>
                </tr>
                <tr className="bg-green-500/10 hover:bg-green-500/20 transition">
                  <td className="px-6 py-4 font-bold text-white text-lg">Poupança nos 4 meses fracos</td>
                  <td className="px-6 py-4 text-red-400 font-bold text-xl">0€ poupados</td>
                  <td className="px-6 py-4 text-green-400 font-bold text-xl">~240€ poupados</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 p-8 rounded-2xl">
            <p className="text-center text-xl text-white font-bold mb-2">
              ⚡ A Vantagem Real do Faturex
            </p>
            <p className="text-center text-gray-300 text-lg">
              Mesmo que pague mais em meses de pico, <span className="text-yellow-400 font-bold">recupera tudo e mais nos meses fracos</span>. Resultado: Mais dinheiro no bolso ao fim do ano, sem stress em Janeiro ou Agosto.
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

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h3>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                ❓ O que recebo pelos 79€?
              </h4>
              <p className="text-gray-600 text-lg">
                Recebe o terminal físico Stripe Reader, a configuração completa da sua conta e a migração de todos os seus dados do software antigo (clientes, produtos e histórico). É um pagamento único, sem rendas mensais.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                ❓ E se eu não faturar nada num mês?
              </h4>
              <p className="text-gray-600 text-lg">
                O seu custo será exatamente <span className="font-bold text-green-600">0.00€</span>. Não há taxas de manutenção, taxas de "disponibilidade" ou qualquer outro custo escondido. Se não trabalhar, não paga. Ponto final.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                ❓ O terminal é meu?
              </h4>
              <p className="text-gray-600 text-lg">
                Sim, o equipamento fica consigo e não tem qualquer aluguer mensal associado. Depois de pagar os 79€ de ativação, o terminal é seu para sempre. Sem rendas, sem devoluções.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                ❓ Como funcionam as taxas regressivas?
              </h4>
              <p className="text-gray-600 text-lg">
                Quanto mais faturar, menos paga em percentagem:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-lg mt-3 space-y-2">
                <li><span className="font-bold">8%</span> até 2.500€ de faturação</li>
                <li><span className="font-bold">7%</span> de 2.500€ até 5.000€</li>
                <li><span className="font-bold">6%</span> acima de 5.000€</li>
              </ul>
              <p className="text-gray-600 text-lg mt-3">
                As taxas de cartão já estão incluídas nestes valores!
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                ❓ O Agendex está mesmo incluído grátis?
              </h4>
              <p className="text-gray-600 text-lg">
                Sim! O sistema de agendamento online Agendex está 100% incluído sem qualquer custo adicional. Os seus clientes podem marcar 24/7, recebe confirmações automáticas e lembretes inteligentes. Tudo isto a 0€ por mês.
              </p>
            </div>

            {/* FAQ 6 - High Revenue Objection Handler */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-lg border-2 border-orange-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                ❓ Mas se eu faturar 10.000€ num mês, pago 600€ a vocês. No outro sistema pagava só 60€!
              </h4>
              <div className="text-gray-700 text-lg space-y-4">
                <p>
                  <span className="font-bold text-orange-600">Essa é a pergunta certa!</span> Mas vamos ver os números reais:
                </p>
                <div className="bg-white p-6 rounded-xl border border-orange-200">
                  <p className="font-bold text-gray-900 mb-3">Sistema Tradicional (10.000€ faturados):</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 60€ de rendas fixas (TPA + Software + Marcações)</li>
                    <li>• + <span className="font-bold text-red-600">250€</span> em taxas de cartão (2.5%)</li>
                    <li>• = <span className="font-bold text-red-600">310€ total</span> (não incluindo custos escondidos)</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="font-bold text-gray-900 mb-3">Faturex (10.000€ faturados):</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <span className="font-bold text-green-600">600€ tudo incluído</span></li>
                    <li>• Taxas de cartão já incluídas</li>
                    <li>• Software de faturação incluído</li>
                    <li>• Sistema de marcações incluído</li>
                  </ul>
                </div>
                <p className="font-bold text-lg text-gray-900 bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                  💡 <strong>A grande diferença:</strong> Se no mês seguinte quiseres ir de férias e faturares 0€, no Faturex pagas <span className="text-green-600">0€</span>. No sistema tradicional? A fatura de 60€ chega à mesma. Ao longo do ano, <span className="text-orange-600">o Faturex compensa sempre</span> nos meses fracos.
                </p>
                <p className="text-gray-600 italic">
                  Resultado: Sim, pagas mais em meses excepcionais, mas o custo real anual é menor porque não pagas nada nos meses de paragem. É isso que faz a diferença no teu bolso ao fim do ano.
                </p>
              </div>
            </div>
          </div>
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
