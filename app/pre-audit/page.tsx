'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Upload, 
  Camera,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  ExternalLink,
  TrendingUp
} from 'lucide-react'
import LanguageToggle from '@/components/LanguageToggle'
import { Language } from '@/lib/translations'

type DocumentType = 
  | 'flow_chart'
  | 'training_cert'
  | 'menu_list'
  | 'ingredient_list'
  | 'halal_policy'
  | 'pest_control'
  | 'photos'

type UploadedFile = {
  id: string
  name: string
  type: DocumentType
  url: string
  size: number
}

type CheckStatus = 'found' | 'missing' | 'warning'

type AuditResult = {
  overall_score: number
  checks: Array<{
    doc_type: string
    status: CheckStatus
    message: string
  }>
  recommendations: Array<{
    issue: string
    action: string
  }>
}

const REQUIRED_DOCS = [
  { type: 'flow_chart' as DocumentType, label: 'Carta Alir Proses (Flow Chart)', icon: TrendingUp },
  { type: 'training_cert' as DocumentType, label: 'Sijil Latihan Halal (Training Certificate)', icon: FileText },
  { type: 'menu_list' as DocumentType, label: 'Menu List', icon: FileText },
  { type: 'ingredient_list' as DocumentType, label: 'Ingredient List', icon: FileText },
  { type: 'halal_policy' as DocumentType, label: 'Halal Policy Poster', icon: FileText },
  { type: 'pest_control' as DocumentType, label: 'Pest Control Contract', icon: FileText },
  { type: 'photos' as DocumentType, label: 'Kitchen/Factory Photos', icon: ImageIcon }
]

export default function PreAudit() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => handleFileUpload(file))
  }, [])

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large! Maximum 10MB per file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: guessDocumentType(file.name),
        url: reader.result as string,
        size: file.size
      }
      setUploadedFiles(prev => [...prev, newFile])
    }
    reader.readAsDataURL(file)
  }

  const guessDocumentType = (filename: string): DocumentType => {
    const lower = filename.toLowerCase()
    if (lower.includes('flow') || lower.includes('carta')) return 'flow_chart'
    if (lower.includes('training') || lower.includes('latihan')) return 'training_cert'
    if (lower.includes('menu')) return 'menu_list'
    if (lower.includes('ingredient') || lower.includes('ramuan')) return 'ingredient_list'
    if (lower.includes('policy') || lower.includes('dasar')) return 'halal_policy'
    if (lower.includes('pest')) return 'pest_control'
    if (lower.match(/\.(jpg|jpeg|png)$/)) return 'photos'
    return 'menu_list' // default
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const getUploadedDocTypes = () => {
    return new Set(uploadedFiles.map(f => f.type))
  }

  const startAudit = () => {
    setIsAuditing(true)
    
    // Simulate audit logic
    setTimeout(() => {
      const uploaded = getUploadedDocTypes()
      const checks: Array<{
        doc_type: string
        status: CheckStatus
        message: string
      }> = REQUIRED_DOCS.map(doc => {
        if (uploaded.has(doc.type)) {
          return {
            doc_type: doc.label,
            status: 'found' as const,
            message: `✅ Found: ${doc.label}`
          }
        } else {
          return {
            doc_type: doc.label,
            status: 'missing' as const,
            message: `❌ Missing: ${doc.label}`
          }
        }
      })

      // Cross-check menu vs ingredients
      const hasMenu = uploaded.has('menu_list')
      const hasIngredients = uploaded.has('ingredient_list')
      if (hasMenu && hasIngredients) {
        checks.push({
          doc_type: 'Cross-Reference Check',
          status: 'warning' as const,
          message: '⚠️ Warning: Please verify menu items match ingredient list'
        })
      }

      const foundCount = checks.filter(c => c.status === 'found').length
      const totalCount = REQUIRED_DOCS.length
      const score = Math.round((foundCount / totalCount) * 100)

      const recommendations = checks
        .filter(c => c.status === 'missing')
        .map(c => ({
          issue: `Missing: ${c.doc_type}`,
          action: `Upload ${c.doc_type} to improve your score`
        }))

      if (score < 85) {
        recommendations.push({
          issue: 'Score below passing threshold',
          action: 'Upload at least 6 out of 7 required documents to be ready for JAKIM submission'
        })
      }

      setAuditResult({
        overall_score: score,
        checks,
        recommendations
      })
      setIsAuditing(false)
    }, 2000)
  }

  const resetAudit = () => {
    setUploadedFiles([])
    setAuditResult(null)
  }

  return (
    <div className="min-h-screen bg-[#F6F4ED]">
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
                <h1 className="text-xl font-bold text-gray-900">Pre-Audit Digital Auditor</h1>
                <p className="text-xs text-gray-500">Score Your Documents Before Submission</p>
              </div>
            </div>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!auditResult ? (
          <div className="space-y-6">
            {/* Required Documents Checklist */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h2>
              <div className="space-y-3">
                {REQUIRED_DOCS.map((doc) => {
                  const uploaded = getUploadedDocTypes().has(doc.type)
                  const Icon = doc.icon
                  return (
                    <div 
                      key={doc.type}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        uploaded 
                          ? 'bg-emerald-50 border-emerald-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {uploaded ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <Icon className={`w-5 h-5 ${uploaded ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${uploaded ? 'text-emerald-900' : 'text-gray-700'}`}>
                        {doc.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl p-12 border-2 border-dashed transition-all ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              <label className="block cursor-pointer text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drag & Drop Files or Click to Upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: PDF, JPG, PNG, DOCX (Max 10MB per file)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={(e) => {
                    Array.from(e.target.files || []).forEach(handleFileUpload)
                    e.target.value = ''
                  }}
                  className="hidden"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-all">
                  Choose Files
                </button>
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {uploadedFiles.map((file) => (
                    <div 
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      {file.name.match(/\.(jpg|jpeg|png)$/) ? (
                        <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <FileText className="w-12 h-12 text-gray-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Camera Upload for Photos */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                Kitchen/Factory Photos
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload at least 3-5 photos showing your premises, equipment, and storage areas
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-all cursor-pointer">
                <Camera className="w-4 h-4" />
                Take Photo or Upload
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    Array.from(e.target.files || []).forEach(handleFileUpload)
                    e.target.value = ''
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Start Audit Button */}
            <button
              onClick={startAudit}
              disabled={uploadedFiles.length < 4 || isAuditing}
              className="w-full py-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-xl hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              {isAuditing ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Analyzing Documents...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Start Pre-Audit Check
                  {uploadedFiles.length < 4 && (
                    <span className="text-sm font-normal opacity-90 ml-2">
                      (Upload at least 4 documents)
                    </span>
                  )}
                </span>
              )}
            </button>
          </div>
        ) : (
          // Audit Results
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Score Circle */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center">
                <ScoreCircle score={auditResult.overall_score} />
                <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                  {auditResult.overall_score >= 85 ? 'Ready to Submit! 🎉' : 'Improvements Needed'}
                </h2>
                <p className="text-gray-600 text-center max-w-md">
                  {auditResult.overall_score >= 85 
                    ? 'Your documentation meets JAKIM requirements. You can proceed with confidence!'
                    : 'Upload missing documents to improve your readiness score before submission.'}
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Document Checklist</h3>
              <div className="space-y-3">
                {auditResult.checks.map((check, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                      check.status === 'found' 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : check.status === 'warning'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {check.status === 'found' && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {check.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                    {check.status === 'missing' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        check.status === 'found' ? 'text-emerald-900' :
                        check.status === 'warning' ? 'text-amber-900' :
                        'text-red-900'
                      }`}>
                        {check.doc_type}
                      </div>
                      <div className={`text-sm mt-1 ${
                        check.status === 'found' ? 'text-emerald-700' :
                        check.status === 'warning' ? 'text-amber-700' :
                        'text-red-700'
                      }`}>
                        {check.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {auditResult.recommendations.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Action Items
                </h3>
                <div className="space-y-3">
                  {auditResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-amber-200">
                      <div className="font-semibold text-amber-900 mb-1">{rec.issue}</div>
                      <div className="text-sm text-amber-700">{rec.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={resetAudit}
                className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Re-check Documents
              </button>
              {auditResult.overall_score >= 85 && (
                <button
                  onClick={() => window.open('https://www.halal.gov.my/v4/', '_blank')}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Go to MYeHALAL Portal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 85 ? 'emerald' : score >= 60 ? 'amber' : 'red'
  const strokeColor = color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#ef4444'
  
  const circumference = 2 * Math.PI * 60
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="60"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="60"
          stroke={strokeColor}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-5xl font-bold text-${color}-600`}>{score}</div>
        <div className="text-sm text-gray-500 font-semibold">/100</div>
      </div>
    </div>
  )
}
