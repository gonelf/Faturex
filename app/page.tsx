import Link from 'next/link'
import { FileText, Shield, QrCode, Lock, CheckCircle, ArrowRight } from 'lucide-react'

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
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">SAF-T (PT) 1.04 Compliant</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Sistema de Faturação Português
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Solução profissional de faturação em conformidade com a legislação portuguesa.
            ATCUD, assinatura digital, e código QR integrados.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-medium inline-flex items-center"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition text-lg font-medium"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Funcionalidades Principais
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Assinatura Digital
            </h4>
            <p className="text-gray-600">
              Conformidade com Portaria n.º 363/2010. Assinaturas RSA-SHA1 e encadeamento de documentos.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              ATCUD & QR Code
            </h4>
            <p className="text-gray-600">
              Geração automática de ATCUD e código QR conforme Portaria n.º 195/2020.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Validação NIF
            </h4>
            <p className="text-gray-600">
              Validação automática de NIF usando algoritmo Módulo 11 antes do armazenamento.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Imutabilidade
            </h4>
            <p className="text-gray-600">
              Documentos finalizados não podem ser alterados ou eliminados, garantindo integridade.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Numeração Sequencial
            </h4>
            <p className="text-gray-600">
              Sistema de séries independentes com numeração sequencial automática por série.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              SAF-T (PT) 1.04
            </h4>
            <p className="text-gray-600">
              Estrutura de base de dados totalmente conforme com especificação SAF-T (PT) 1.04.
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Legislação e Conformidade
            </h3>
            <p className="text-gray-600 mb-8">
              O Faturex está em conformidade com toda a legislação portuguesa aplicável:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Portaria n.º 363/2010</h4>
                <p className="text-sm text-gray-600">Assinaturas Digitais</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Portaria n.º 195/2020</h4>
                <p className="text-sm text-gray-600">ATCUD & QR Codes</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">SAF-T (PT) 1.04</h4>
                <p className="text-sm text-gray-600">Standard Audit File</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Decreto-Lei n.º 28/2019</h4>
                <p className="text-sm text-gray-600">Comunicação de documentos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Comece a Faturar Hoje
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Crie a sua conta gratuitamente e emita a sua primeira fatura em minutos.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition text-lg font-medium inline-flex items-center"
          >
            Criar Conta Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Faturex. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Sistema de Faturação Português - SAF-T (PT) 1.04 Compliant</p>
        </div>
      </footer>
    </div>
  )
}
