'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { 
  Shield, Camera, Droplets, FileText, Star, 
  CheckCircle2, Clock, TrendingUp, Zap, Brain, Award, ArrowRight, 
  History, ChevronLeft, Sparkles, Users
} from 'lucide-react'
import Logo from '@/components/Logo'
import LanguageToggle from '@/components/LanguageToggle'
import WebFooter from '@/components/WebFooter'
import { Language, translations } from '@/lib/translations'

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const t = translations[language]

  // Smooth spring physics for parallax
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const x = useSpring(useTransform(scrollY, [0, 1000], [0, -100]), springConfig)
  const y = useSpring(useTransform(scrollY, [0, 1000], [0, 50]), springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: Camera,
      title: language === 'bm' ? 'Pengimbas Ramuan' : 'Ingredient Scanner',
      description: language === 'bm' ? 'Imbas gambar, rakam suara atau taip — AI periksa status halal' : 'Snap a photo, record voice, or type — AI checks halal suitability',
      route: '/ingredient-guard',
      solidColor: '#FF6B35',
      badge: language === 'bm' ? 'Pelbagai Modal' : 'Multimodal',
      badgeColor: 'bg-teal-100 text-teal-700',
      features: ['Vision AI', 'Voice Recognition', 'E-code Detection']
    },
    {
      icon: FileText,
      title: language === 'bm' ? 'Arkitek IHCS Auto' : 'IHCS Auto-Architect',
      description: language === 'bm' ? 'Jana manual IHCS sedia untuk JAKIM dengan AI' : 'Generate a JAKIM-ready IHCS manual with AI',
      route: '/ihcs-architect',
      solidColor: '#10B981',
      badge: language === 'bm' ? 'Jana PDF' : 'PDF Gen',
      badgeColor: 'bg-green-100 text-green-700',
      features: ['MPPHM 2020 Compliant', 'Auto-fill SOPs', 'Download PDF']
    },
    {
      icon: Star,
      title: language === 'bm' ? 'Penilaian Pra-Audit' : 'Pre-Audit Readiness',
      description: language === 'bm' ? 'Skor kesediaan audit anda sebelum penghantaran ke JAKIM' : 'Score your audit readiness before submission',
      route: '/pre-audit',
      solidColor: '#F59E0B',
      badge: language === 'bm' ? 'Skor 90%+' : 'Score 90%+',
      badgeColor: 'bg-amber-100 text-amber-700',
      features: ['Document Validator', 'Checklist Scoring', 'Missing Items Alert']
    }
  ]

  const benefits = [
    {
      icon: Brain,
      title: language === 'bm' ? 'Dikuasakan AI' : 'AI-Powered',
      description: language === 'bm' ? 'Teknologi JamAI Base dengan Chain of Thought' : 'JamAI Base technology with Chain of Thought'
    },
    {
      icon: CheckCircle2,
      title: language === 'bm' ? 'Pematuhan JAKIM' : 'JAKIM Compliant',
      description: language === 'bm' ? 'Data dan standard JAKIM terkini' : 'Latest JAKIM data and standards'
    },
    {
      icon: TrendingUp,
      title: language === 'bm' ? 'Cegah 73.5%' : 'Prevent 73.5%',
      description: language === 'bm' ? 'Elakkan kegagalan NCR biasa' : 'Avoid common NCR failures'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: language === 'bm' ? 'Pra-Permohonan' : 'Pre-Application',
      description: language === 'bm' ? 'Semak kelayakan & imbas risiko' : 'Check eligibility & scan risks',
      duration: language === 'bm' ? '1 hari' : '1 day'
    },
    {
      step: 2,
      title: language === 'bm' ? 'Permohonan' : 'Application',
      description: language === 'bm' ? 'Isi borang dengan AI' : 'Fill forms with AI',
      duration: language === 'bm' ? '3-7 hari' : '3-7 days'
    },
    {
      step: 3,
      title: language === 'bm' ? 'Audit' : 'Audit',
      description: language === 'bm' ? 'Latihan & persediaan audit' : 'Audit training & preparation',
      duration: language === 'bm' ? '14-21 hari' : '14-21 days'
    },
    {
      step: 4,
      title: language === 'bm' ? 'Pensijilan' : 'Certification',
      description: language === 'bm' ? 'Terima sijil halal JAKIM' : 'Receive JAKIM halal certificate',
      duration: language === 'bm' ? '12-23 hari' : '12-23 days'
    }
  ]

  const navLinks = [
    { label: language === 'bm' ? 'Utama' : 'Home', href: '/' },
    { label: language === 'bm' ? 'Perkhidmatan' : 'Services', href: '#features' },
    { label: language === 'bm' ? 'Harga' : 'Pricing', href: '/pricing' },
    { label: language === 'bm' ? 'Hubungi' : 'Contact', href: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Enhanced 3D Background with Aurora Theme */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Aurora Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        
        {/* Animated Aurora Waves - Subtle light theme */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(100, 100, 100, 0.05) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.03, 0.02],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(ellipse at 80% 50%, rgba(150, 150, 150, 0.04) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.02, 0.01, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(ellipse at 20% 80%, rgba(5, 150, 105, 0.15) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Flowing Aurora Lights */}
        <motion.div
          className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/20 via-green-500/10 to-transparent blur-3xl"
          animate={{
            x: [-100, 100, -100],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl"
          animate={{
            x: [100, -100, 100],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* 3D Floating Particles */}
        <motion.div
          className="absolute top-1/4 left-10 w-32 h-32 opacity-20"
          animate={{
            y: [0, -50, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl transform rotate-45 blur-sm" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-20 w-24 h-24 opacity-15"
          animate={{
            y: [0, 60, 0],
            rotate: [0, -180, -360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            x: -mousePosition.x * 0.3,
            y: -mousePosition.y * 0.3,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-sm" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/3 w-40 h-40 opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            x: mousePosition.x * 0.2,
            y: mousePosition.y * 0.2,
          }}
        >
          <div className="w-full h-full border-4 border-gray-300 rounded-2xl transform rotate-12 blur-sm" />
        </motion.div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,200,200,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-100/20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Malaysian Food Background */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Header - Absolute positioned over hero */}
        <motion.header 
          className="absolute top-0 left-0 right-0 z-50 bg-transparent"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left: logo */}
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-300 bg-clip-text text-transparent">
                PADU
              </div>
            </div>

            {/* Center: nav links (desktop) */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-amber-200 px-3 py-2 rounded-md transition-colors duration-150"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right: controls */}
            <div className="flex items-center gap-3">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <motion.button 
                onClick={() => router.push('/history')}
                className="btn-ghost flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <History className="w-5 h-5" />
                <span className="hidden md:inline">{language === 'bm' ? 'Sejarah' : 'History'}</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

          {/* Animated Food Background (single layer) */}
          <div 
            className="absolute inset-0 animate-slow-zoom"
            style={{
              backgroundImage: `url('/food.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.6)'
            }}
          />

          {/* Subtle Dark Gradient Overlay (lighter to reveal food) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/40" />
          
          {/* Content Layer */}
          <div className="relative z-10 px-4 text-center max-w-5xl mx-auto">
            <motion.div 
              className="badge-info mb-8 inline-flex"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bm' ? 'Pembantu AI Pensijilan Halal' : 'AI Assistant for Halal Certification'}</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-8xl font-extrabold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-white">
                {language === 'bm' ? 'Mudahkan' : 'Simplify Your'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-md">
                {language === 'bm' ? 'Pensijilan Halal Anda' : 'Halal Certification'}
              </span>
            </motion.h1>

            <motion.div 
              className="flex flex-wrap gap-6 justify-center items-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/6 border border-white/8 backdrop-blur-md"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Clock className="w-5 h-5 text-amber-300" />
                <span className="font-semibold text-white">30-51 {language === 'bm' ? 'hari' : 'days'}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/6 border border-white/8 backdrop-blur-md"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-semibold bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">{language === 'bm' ? 'Dari RM50/bln' : 'From RM50/mo'}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/6 border border-white/8 backdrop-blur-md"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <TrendingUp className="w-5 h-5 text-emerald-300" />
                <span className="font-semibold text-white">8,000+ {language === 'bm' ? 'syarikat' : 'companies'}</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="our-services-bg py-20" id="features">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                {language === 'bm' ? 'Perkhidmatan Kami' : 'Our Services'}
              </h2>
              <p className="text-gray-600 text-lg">
                {language === 'bm' ? 'Alat berkuasa AI untuk pensijilan JAKIM' : 'AI-powered tools for JAKIM certification'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  onClick={() => router.push(feature.route)}
                  className="relative bg-white shadow-lg hover:shadow-2xl border border-gray-100 rounded-3xl p-8 text-left group hover:-translate-y-2 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Badge - top right corner */}
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>

                  {/* Icon - solid color */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: feature.solidColor }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-base text-gray-600 leading-relaxed mb-6">{feature.description}</p>

                  {/* Feature tags */}
                  {feature.features && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {feature.features.map((feat: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Start button */}
                  <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-4 transition-all">
                    <span>{language === 'bm' ? 'Mulakan' : 'Start'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gray-900">{language === 'bm' ? 'Mengapa Pilih ' : 'Why Choose '}</span>
                <span className="bg-gradient-to-r from-amber-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  PADU?
                </span>
              </h2>
              <p className="text-gray-600 text-lg">
                {language === 'bm' ? 'Kelebihan menggunakan AI untuk pensijilan' : 'Benefits of using AI for certification'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{benefit.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Process */}
        <section className="our-services-bg py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                {language === 'bm' ? 'Proses Pensijilan' : 'Certification Process'}
              </h2>
              <p className="text-gray-600 text-lg">
                {language === 'bm' ? 'Langkah mudah ke sijil halal JAKIM' : 'Simple steps to JAKIM halal certificate'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, index) => {
                const gradients = [
                  'from-green-400 to-green-500',
                  'from-green-500 to-green-600',
                  'from-green-600 to-emerald-600',
                  'from-emerald-600 to-teal-600'
                ]
                return (
                  <motion.div 
                    key={index} 
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 relative"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    {/* Step number badge - overlapping top */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${gradients[index]} rounded-full flex items-center justify-center -mt-6 mb-4 font-bold text-xl text-white shadow-lg`}>
                      {step.step}
                    </div>
                    
                    {/* Card content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    
                    {/* Duration badge */}
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span>{step.duration}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA removed per request */}

        {/* Web app footer */}
        <WebFooter />
      </div>
    </div>
  )
}
