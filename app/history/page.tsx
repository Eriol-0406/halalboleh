'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import LanguageToggle from '@/components/LanguageToggle'
import { Language, translations } from '@/lib/translations'

export default function HistoryPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]

  // Mock history data
  const history = [
    {
      id: 1,
      type: 'eligibility',
      title: language === 'bm' ? 'Semakan Kelayakan' : 'Eligibility Check',
      result: language === 'bm' ? 'LAYAK' : 'ELIGIBLE',
      status: 'success',
      date: '2025-11-25 10:30',
      business: 'Restaurant'
    },
    {
      id: 2,
      type: 'ncr-scan',
      title: language === 'bm' ? 'Imbasan NCR' : 'NCR Scan',
      result: language === 'bm' ? 'Risiko Sederhana' : 'Medium Risk',
      status: 'warning',
      date: '2025-11-24 15:20',
      riskScore: 4.5
    },
    {
      id: 3,
      type: 'sertu',
      title: language === 'bm' ? 'Panduan Sertu' : 'Sertu Guide',
      result: language === 'bm' ? '7 langkah' : '7 steps',
      status: 'success',
      date: '2025-11-23 09:15',
      equipment: 'Knife'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-teal-900/20 to-blue-900/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-600/30 rounded-full mix-blend-multiply filter blur-3xl blob1" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl blob2" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl blob3" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <Logo size={36} showText={true} />
            </div>
            
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {language === 'bm' ? 'Sejarah Aktiviti' : 'Activity History'}
          </h1>
          <p className="text-gray-400 mb-12">
            {language === 'bm' ? 'Lihat semua aktiviti anda yang lepas' : 'View all your past activities'}
          </p>

          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="glass-card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {item.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-amber-400" />
                      )}
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{item.result}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/${item.type}`)}
                    className="btn-ghost text-sm"
                  >
                    {language === 'bm' ? 'Lihat' : 'View'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {history.length === 0 && (
            <div className="glass-card text-center py-16">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {language === 'bm' ? 'Tiada Sejarah' : 'No History'}
              </h3>
              <p className="text-gray-400">
                {language === 'bm' 
                  ? 'Mulakan dengan menyemak kelayakan anda' 
                  : 'Start by checking your eligibility'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
