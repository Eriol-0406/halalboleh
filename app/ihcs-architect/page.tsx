'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Send, 
  Mic,
  FileText,
  CheckCircle,
  Loader2,
  Download,
  RefreshCw,
  MessageSquare
} from 'lucide-react'
import LanguageToggle from '@/components/LanguageToggle'
import { Language } from '@/lib/translations'

type Message = {
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

const CHAPTERS = [
  {
    id: 1,
    question: 'Apakah nama syarikat dan matlamat halal anda?',
    questionEn: 'What is your company name and halal objectives?',
    field: 'company_info'
  },
  {
    id: 2,
    question: 'Bagaimana anda semak bahan mentah yang diterima?',
    questionEn: 'How do you verify raw materials received?',
    field: 'raw_material_verification'
  },
  {
    id: 3,
    question: 'Adakah anda simpan resit pembelian? Berapa lama?',
    questionEn: 'Do you keep purchase receipts? For how long?',
    field: 'purchase_records'
  },
  {
    id: 4,
    question: 'Macam mana anda basuh peralatan? Ada SOP tak?',
    questionEn: 'How do you wash equipment? Do you have SOPs?',
    field: 'cleaning_procedures'
  },
  {
    id: 5,
    question: 'Siapa bertanggungjawab untuk halal di syarikat?',
    questionEn: 'Who is responsible for halal in the company?',
    field: 'halal_responsibility'
  },
  {
    id: 6,
    question: 'Adakah anda ada rekod latihan halal untuk staff?',
    questionEn: 'Do you have halal training records for staff?',
    field: 'training_records'
  },
  {
    id: 7,
    question: 'Bagaimana anda kesan produk jika ada masalah (traceability)?',
    questionEn: 'How do you trace products if there are issues (traceability)?',
    field: 'traceability_system'
  }
]

export default function IHCSArchitect() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const [currentChapter, setCurrentChapter] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfReady, setPdfReady] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load saved answers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ihcs-answers')
    if (saved) {
      setAnswers(JSON.parse(saved))
    }
  }, [])

  // Save answers to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('ihcs-answers', JSON.stringify(answers))
    }
  }, [answers])

  // Start interview
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addAIMessage('Assalamualaikum! Saya akan bantu Puan/Encik buat IHCS Manual. Kita akan bincang 7 topik penting. Ready? Mari kita mulakan!')
        setTimeout(() => {
          addAIMessage(CHAPTERS[0].question)
        }, 1500)
      }, 500)
    }
  }, [])

  const addAIMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'ai', content, timestamp: new Date() }])
  }

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content, timestamp: new Date() }])
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userInput = input.trim()
    addUserMessage(userInput)
    setInput('')

    // Save answer
    const chapter = CHAPTERS[currentChapter]
    setAnswers(prev => ({ ...prev, [chapter.field]: userInput }))

    // AI acknowledges and moves to next chapter
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addAIMessage(`Terima kasih! Saya dah catat jawapan Puan/Encik. ✓`)
      
      setTimeout(() => {
        if (currentChapter < CHAPTERS.length - 1) {
          const nextChapter = currentChapter + 1
          setCurrentChapter(nextChapter)
          addAIMessage(CHAPTERS[nextChapter].question)
        } else {
          // Interview complete
          addAIMessage('Tahniah! Kita dah selesai semua soalan. Sekarang saya akan generate IHCS Manual untuk syarikat Puan/Encik. Klik butang "Generate Manual" untuk mula!')
        }
      }, 1500)
    }, 1000)
  }

  const generatePDF = () => {
    setIsGenerating(true)
    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false)
      setPdfReady(true)
      addAIMessage('Manual siap! Anda boleh preview dan download sekarang. 📄')
    }, 3000)
  }

  const downloadPDF = () => {
    // In production: use jsPDF to generate actual PDF
    alert('PDF download - in production, this would download a 50-page IHCS manual based on your answers!')
  }

  const resetInterview = () => {
    if (confirm('Reset interview? All answers will be deleted.')) {
      setMessages([])
      setAnswers({})
      setCurrentChapter(0)
      setPdfReady(false)
      localStorage.removeItem('ihcs-answers')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4ED] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IHCS Auto-Architect</h1>
                <p className="text-xs text-gray-500">AI-Powered Manual Generator</p>
              </div>
            </div>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Chapter {currentChapter + 1}/{CHAPTERS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentChapter + 1) / CHAPTERS.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${((currentChapter + 1) / CHAPTERS.length) * 100}%` }}
            />
          </div>
          {/* Chapter indicators */}
          <div className="flex items-center gap-2 mt-3">
            {CHAPTERS.map((ch, idx) => (
              <div 
                key={ch.id} 
                className={`flex-1 h-1 rounded-full transition-all ${
                  idx <= currentChapter ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        <div className={`flex-1 flex flex-col ${showPreview ? 'lg:w-2/3' : 'w-full'}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Generate Button (after all chapters) */}
          {currentChapter === CHAPTERS.length - 1 && Object.keys(answers).length === CHAPTERS.length && !pdfReady && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Manual...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Generate IHCS Manual
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* PDF Ready Actions */}
          {pdfReady && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto flex gap-3">
                <button
                  onClick={downloadPDF}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF (50 pages)
                </button>
                <button
                  onClick={resetInterview}
                  className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Input Box */}
          {!pdfReady && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your answer... (Manglish/BM/EN)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  onClick={() => alert('Voice input - coming soon!')}
                  className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PDF Preview Sidebar (Desktop) */}
        {pdfReady && (
          <div className="hidden lg:block w-1/3 border-l border-gray-200 bg-white p-4 overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 border-b border-gray-200 mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                PDF Preview
              </h3>
            </div>
            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="bg-white shadow-lg rounded-lg p-8 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">IHCS Manual</h2>
                <p className="text-gray-600 mb-4">{answers.company_info || 'Your Company'}</p>
                <div className="text-left space-y-4 text-sm">
                  {CHAPTERS.map((ch) => (
                    <div key={ch.id} className="border-l-4 border-emerald-500 pl-3">
                      <div className="font-semibold text-gray-800">Chapter {ch.id}</div>
                      <div className="text-gray-600 text-xs mt-1">
                        {answers[ch.field]?.substring(0, 60) || 'No answer'}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">50-page manual generated from your answers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === 'ai') {
    return (
      <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left duration-300">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm border border-gray-200 max-w-2xl">
          <p className="text-gray-800 leading-relaxed">{message.content}</p>
          <span className="text-xs text-gray-400 mt-2 block">
            {message.timestamp.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 justify-end animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-sm max-w-2xl">
        <p className="leading-relaxed">{message.content}</p>
        <span className="text-xs text-emerald-100 mt-2 block">
          {message.timestamp.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-700 font-bold text-sm">U</span>
      </div>
    </div>
  )
}
