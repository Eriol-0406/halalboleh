'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Mic, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ZoomIn
} from 'lucide-react'
import LanguageToggle from '@/components/LanguageToggle'
import { Language } from '@/lib/translations'

export default function IngredientGuard() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'voice'>('upload')
  const [image, setImage] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      alert('File too large! Maximum 5MB.')
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // In production, show video preview and capture frame
      alert('Camera feature - in production, this would open camera preview')
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      alert('Camera access denied')
    }
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false)
        setTranscription('Check sos ni halal tak? Logo dia betul ke?')
      }, 2000)
    }
  }

  const analyzeProduct = async () => {
    setLoading(true)
    // Simulate API call to JAM AI
    setTimeout(() => {
      setResult({
        risk_level: 'High',
        flagged_ingredients: [
          { code: 'E120', name: 'Cochineal (Carmine)', reason: 'Derived from insect blood (Haram)' },
          { code: 'E471', name: 'Mono-diglycerides', reason: 'Source unknown - may be animal-based (Mushbooh)' }
        ],
        cert_body: {
          name: 'Central Islamic Council of Thailand (CICOT)',
          recognized: true
        },
        advice_bm: 'Puan, saya dah semak label produk ini dengan teliti. Sos ini tidak disyorkan untuk kegunaan kedai Puan kerana ia mengandungi E120 (Cochineal/Carmine) yang berasal dari darah serangga - ini adalah Haram. Walaupun logo halal CICOT diiktiraf oleh JAKIM, kehadiran ramuan E120 menjadikan produk ini tidak sesuai. Saya cadangkan Puan cari alternatif sos yang tiada E120.'
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#F6F4ED]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ingredient Guard</h1>
                <p className="text-xs text-gray-500">Manglish-Powered Scanner</p>
              </div>
            </div>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <TabButton
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
            icon={<Upload className="w-5 h-5" />}
            label="Upload"
          />
          <TabButton
            active={activeTab === 'camera'}
            onClick={() => {
              setActiveTab('camera')
              startCamera()
            }}
            icon={<Camera className="w-5 h-5" />}
            label="Camera"
          />
          <TabButton
            active={activeTab === 'voice'}
            onClick={() => setActiveTab('voice')}
            icon={<Mic className="w-5 h-5" />}
            label="Voice"
          />
        </div>

        {/* Upload Section */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
            {!image ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-semibold mb-2">Click to upload product label</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <img src={image} alt="Product label" className="w-full rounded-xl shadow-md" />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setImage(null)
                    setResult(null)
                  }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  ✕ Remove image
                </button>
              </div>
            )}
          </div>
        )}

        {/* Voice Section */}
        {activeTab === 'voice' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
            <div className="text-center">
              <button
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-300' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105'
                }`}
              >
                <Mic className="w-10 h-10 text-white" />
              </button>
              <p className="text-gray-700 font-semibold mb-2">
                {isRecording ? 'Recording...' : 'Tap to record your question'}
              </p>
              <p className="text-sm text-gray-500">Ask in Manglish, BM, or English</p>
              
              {transcription && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-xs text-emerald-700 font-semibold mb-1">Transcribed:</p>
                  <p className="text-gray-800">{transcription}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question Input */}
        {image && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Optional: Ask in Manglish/BM/EN
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Sos ni halal tak? Logo dia betul ke?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Analyze Button */}
        {image && !result && (
          <button
            onClick={analyzeProduct}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengimbas label...
                <span className="text-sm font-normal opacity-90 ml-2">Checking ingredients and halal logo</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Analyze Product
              </span>
            )}
          </button>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Risk Level */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center">
                <RiskBadge level={result.risk_level} />
              </div>
            </div>

            {/* Flagged Ingredients */}
            {result.flagged_ingredients.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Flagged Ingredients
                </h3>
                <div className="space-y-3">
                  {result.flagged_ingredients.map((ing: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-900">{ing.code} - {ing.name}</div>
                        <div className="text-sm text-red-700 mt-1">{ing.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Halal Logo Check */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Halal Logo Check</h3>
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                {result.cert_body.recognized ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-gray-900">{result.cert_body.name}</div>
                  <div className="text-sm text-gray-700 mt-1">
                    {result.cert_body.recognized ? '✅ JAKIM Recognized' : '❌ Not Recognized by JAKIM'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Advice */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                AI Recommendation
              </h3>
              <p className="text-gray-800 leading-relaxed">{result.advice_bm}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setImage(null)
                  setResult(null)
                  setQuestion('')
                  setTranscription('')
                }}
                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all"
              >
                Scan Another
              </button>
              <button
                onClick={() => alert('Save to history feature - coming soon!')}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
              >
                Save to History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
        active
          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-500 hover:text-emerald-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function RiskBadge({ level }: { level: string }) {
  const config = {
    High: { 
      color: 'red', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-300',
      textColor: 'text-red-900',
      iconColor: 'text-red-500',
      icon: XCircle, 
      text: 'Not Recommended' 
    },
    Medium: { 
      color: 'amber', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-300',
      textColor: 'text-amber-900',
      iconColor: 'text-amber-500',
      icon: AlertTriangle, 
      text: 'Verify Source' 
    },
    Low: { 
      color: 'green', 
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-900',
      iconColor: 'text-emerald-500',
      icon: CheckCircle, 
      text: 'Safe to Use' 
    }
  }
  
  const { bgColor, borderColor, textColor, iconColor, icon: Icon, text } = config[level as keyof typeof config]
  
  return (
    <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${bgColor} border-2 ${borderColor}`}>
      <Icon className={`w-8 h-8 ${iconColor}`} />
      <div>
        <div className={`text-2xl font-bold ${textColor}`}>{level} Risk</div>
        <div className={`text-sm ${textColor} opacity-80`}>{text}</div>
      </div>
    </div>
  )
}
