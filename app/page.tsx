'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award, 
  History, 
  Camera, 
  FileText, 
  Star, 
  Brain,
  Sparkles
} from 'lucide-react'
import LanguageToggle from '@/components/LanguageToggle'
import WebFooter from '@/components/WebFooter'
import { Language, translations } from '@/lib/translations'

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-gray-900">
      
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-300 bg-clip-text text-transparent">
              AMANA
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-white hover:text-amber-200 px-3 py-2 rounded-md transition-colors">
                {t.services}
              </a>
              <a href="/pricing" className="text-white hover:text-amber-200 px-3 py-2 rounded-md transition-colors">
                {t.pricing}
              </a>
              <a href="/contact" className="text-white hover:text-amber-200 px-3 py-2 rounded-md transition-colors">
                {t.contact}
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <button 
                onClick={() => router.push('/history')}
                className="text-white font-semibold px-4 py-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <History className="w-5 h-5" />
                <span className="hidden md:inline">{t.history}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Food Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/food.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Hero Content */}
        <div className="relative z-10 px-4 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-semibold mb-8">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="text-white">{t.heroTitle}</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-300 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/20">
              <Clock className="w-5 h-5 text-amber-300" />
              <span className="font-semibold text-white">{t.heroStat1}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/20">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-amber-300">{t.heroStat2}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/20">
              <TrendingUp className="w-5 h-5 text-emerald-300" />
              <span className="font-semibold text-white">{t.heroStat3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ABOUT AMANA SECTION
          ========================================== */}
      <section className="bg-[#F5F1E8] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-8 text-xs tracking-widest text-gray-600 mb-8 uppercase">
                <span>AI ASSISTANT</span>
                <span>HALAL CERT</span>
                <span>JAKIM READY</span>
              </div>

              <h2 className="font-serif text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8">
                {language === 'bm' ? 'TENTANG AMANA' : 'ABOUT AMANA'}
              </h2>

              <div className="space-y-6 text-base text-gray-700 leading-relaxed">
                <p>{t.aboutDesc1}</p>
                <p>{t.aboutDesc2}</p>
              </div>
            </div>

            <div className="md:col-span-3 relative">
              <div className="relative z-10">
                <img 
                  src="/food2.jpeg" 
                  alt="AMANA" 
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-[80%] h-[80%] bg-gradient-to-br from-[#C5E86C] to-[#A8D946] rounded-full -z-0 blur-3xl opacity-40" />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PHILOSOPHY SECTION
          ========================================== */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="h-[400px] md:h-[600px]">
            <img 
              src="/food.jpg" 
              alt="Modern halal kitchen" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-gradient-to-br from-[#2D4A3E] to-[#1A2F26] p-12 md:p-20 flex items-center">
            <div className="text-white space-y-8">
              <p className="text-xl md:text-2xl leading-relaxed font-light italic">
                {t.philosophyQuote}
              </p>
              <p className="text-base md:text-lg leading-relaxed font-normal text-gray-200">
                {t.philosophyDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PROCESS SECTION
          ========================================== */}
      <section className="bg-[#F5F1E8] py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-[#2D4A3E] leading-tight">
              {t.processTitle}
            </h2>
          </div>
          <div className="space-y-10">
            <div className="flex gap-8 items-start max-w-3xl mx-auto">
              <span className="text-5xl font-serif font-bold text-[#C5E86C] leading-none w-20 text-center flex-shrink-0">01</span>
              <p className="text-gray-700 leading-relaxed text-base">
                <span className="font-bold uppercase tracking-wide">{t.processStep1}</span>
                {t.processStep1Desc}
              </p>
            </div>
            <div className="flex gap-8 items-start max-w-3xl mx-auto">
              <span className="text-5xl font-serif font-bold text-[#C5E86C] leading-none w-20 text-center flex-shrink-0">02</span>
              <p className="text-gray-700 leading-relaxed text-base">
                <span className="font-bold uppercase tracking-wide">{t.processStep2}</span>
                {t.processStep2Desc}
              </p>
            </div>
            <div className="flex gap-8 items-start max-w-3xl mx-auto">
              <span className="text-5xl font-serif font-bold text-[#C5E86C] leading-none w-20 text-center flex-shrink-0">03</span>
              <p className="text-gray-700 leading-relaxed text-base">
                <span className="font-bold uppercase tracking-wide">{t.processStep3}</span>
                {t.processStep3Desc}
              </p>
            </div>
            <div className="flex gap-8 items-start max-w-3xl mx-auto">
              <span className="text-5xl font-serif font-bold text-[#C5E86C] leading-none w-20 text-center flex-shrink-0">04</span>
              <p className="text-gray-700 leading-relaxed text-base">
                <span className="font-bold uppercase tracking-wide">{t.processStep4}</span>
                {t.processStep4Desc}
              </p>
            </div>
            <div className="flex gap-8 items-start max-w-3xl mx-auto">
              <span className="text-5xl font-serif font-bold text-[#C5E86C] leading-none w-20 text-center flex-shrink-0">05</span>
              <p className="text-gray-700 leading-relaxed text-base">
                <span className="font-bold uppercase tracking-wide">{t.processStep5}</span>
                {t.processStep5Desc}
              </p>
            </div>
            <div className="flex gap-8 items-start max-w-3xl mx-auto">
              <span className="text-5xl font-serif font-bold text-[#C5E86C] leading-none w-20 text-center flex-shrink-0">06</span>
              <p className="text-gray-700 leading-relaxed text-base">
                <span className="font-bold uppercase tracking-wide">{t.processStep6}</span>
                {t.processStep6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          OUR SERVICES SECTION (formerly Features)
          ========================================== */}
      <section className="bg-[#F5F1E8] py-24 md:py-32" id="services">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#2D4A3E] inline-block border-b-4 border-dotted border-[#C5E86C] pb-4">
              {language === 'bm' ? 'PERKHIDMATAN KAMI' : 'OUR SERVICES'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
            {/* Card 1: Ingredient Scanner */}
            <button
              onClick={() => router.push('/ingredient-guard')}
              className="md:col-span-2 md:row-span-2 relative h-[400px] md:h-[500px] group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D4A3E] to-[#3D5A4E]" />
              <div className="relative h-full p-8 flex flex-col justify-between text-white">
                <span className="inline-block w-fit px-3 py-1 bg-[#C5E86C] text-[#2D4A3E] rounded-full text-xs font-semibold">
                  {t.feature1Badge}
                </span>
                <div className="mt-auto">
                  <Camera className="w-10 h-10 text-[#C5E86C] mb-4" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">{t.feature1Name}</h3>
                  <p className="text-sm opacity-90">{t.feature1Desc}</p>
                </div>
              </div>
            </button>

            {/* Card 2: IHCS Auto-Architect */}
            <button
              onClick={() => router.push('/ihcs-architect')}
              className="md:col-span-4 md:row-span-1 relative h-[200px] md:h-[240px] group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#A8C686] to-[#C5E86C]" />
              <div className="relative h-full p-8 flex items-end text-[#2D4A3E]">
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#2D4A3E] text-white rounded-full text-xs font-semibold">
                  {t.feature2Badge}
                </span>
                <div>
                  <FileText className="w-8 h-8 mb-3" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">{t.feature2Name}</h3>
                  <p className="text-sm opacity-90">{t.feature2Desc}</p>
                </div>
              </div>
            </button>

            {/* Card 3: Pre-Audit Readiness */}
            <button
              onClick={() => router.push('/pre-audit')}
              className="md:col-span-4 md:row-span-1 relative h-[200px] md:h-[240px] group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355] to-[#A89078]" />
              <div className="relative h-full p-8 flex items-end text-white">
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#C5E86C] text-[#2D4A3E] rounded-full text-xs font-semibold">
                  {t.feature3Badge}
                </span>
                <div>
                  <Star className="w-8 h-8 text-[#C5E86C] mb-3" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">{t.feature3Name}</h3>
                  <p className="text-sm opacity-90">{t.feature3Desc}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY CHOOSE AMANA SECTION - UNIQUE DARK STYLE
          ========================================== */}
      <section className="relative bg-gradient-to-br from-[#2D4A3E] to-[#1A2F26] py-24 md:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C5E86C]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C5E86C]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#C5E86C] rounded-full opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#C5E86C] rounded-full opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#C5E86C] rounded-full opacity-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5E86C]/20 border border-[#C5E86C]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#C5E86C]" />
              <span className="text-[#C5E86C] text-sm font-semibold">
                {language === 'bm' ? 'Kelebihan Kami' : 'Our Advantages'}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-white">{language === 'bm' ? 'Mengapa Pilih ' : 'Why Choose '}</span>
              <span className="text-[#C5E86C]">AMANA?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {language === 'bm' 
                ? 'Teknologi AI terkini untuk memudahkan perjalanan pensijilan halal anda'
                : 'Cutting-edge AI technology to simplify your halal certification journey'}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 - AI Powered */}
            <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#C5E86C]/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5E86C]/0 to-[#C5E86C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C5E86C] to-[#A8D946] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-[#2D4A3E]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t.benefit1Title}</h3>
                <p className="text-gray-400 leading-relaxed">{t.benefit1Desc}</p>
              </div>
            </div>

            {/* Card 2 - JAKIM Compliant */}
            <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#C5E86C]/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5E86C]/0 to-[#C5E86C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C5E86C] to-[#A8D946] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7 text-[#2D4A3E]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t.benefit2Title}</h3>
                <p className="text-gray-400 leading-relaxed">{t.benefit2Desc}</p>
              </div>
            </div>

            {/* Card 3 - Prevent 73.5% */}
            <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#C5E86C]/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5E86C]/0 to-[#C5E86C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C5E86C] to-[#A8D946] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-[#2D4A3E]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t.benefit3Title}</h3>
                <p className="text-gray-400 leading-relaxed">{t.benefit3Desc}</p>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#C5E86C] mb-2">500+</div>
                <div className="text-gray-400 text-sm">{language === 'bm' ? 'Perniagaan Dibantu' : 'Businesses Helped'}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#C5E86C] mb-2">73.5%</div>
                <div className="text-gray-400 text-sm">{language === 'bm' ? 'NCR Dicegah' : 'NCR Prevented'}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#C5E86C] mb-2">70x</div>
                <div className="text-gray-400 text-sm">{language === 'bm' ? 'Lebih Jimat' : 'Cost Savings'}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#C5E86C] mb-2">24/7</div>
                <div className="text-gray-400 text-sm">{language === 'bm' ? 'Sokongan AI' : 'AI Support'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <WebFooter />
    </div>
  )
}