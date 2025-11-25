// JamAI Base API Integration for JAKIM Certification
const JAMAI_BASE_URL = process.env.NEXT_PUBLIC_JAMAI_BASE_URL || 'http://localhost:8000'
const JAMAI_API_KEY = process.env.NEXT_PUBLIC_JAMAI_API_KEY

// ============================================
// KNOWLEDGE TABLE QUERIES
// ============================================

export interface KnowledgeQuery {
  table: 'jakim_standards' | 'ncr_database' | 'myehalal_forms'
  query: string
}

export async function queryKnowledge(request: KnowledgeQuery): Promise<any> {
  const response = await fetch(`${JAMAI_BASE_URL}/api/v1/knowledge/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JAMAI_API_KEY}`,
    },
    body: JSON.stringify(request),
  })
  return response.json()
}

// ============================================
// NCR RISK SCANNER (Image Analysis)
// ============================================

export interface NCRScanRequest {
  imageData: string // base64 encoded factory/kitchen photo
  businessType: string
  language: 'en' | 'bm'
}

export interface NCRIssue {
  category: 'hygiene' | 'staff' | 'transport' | 'halal_executive'
  severity: 'high' | 'medium' | 'low'
  description: string
  howToFix: string
  estimatedCost: string
}

export interface NCRScanResult {
  overallRiskScore: number // 0-10
  issues: NCRIssue[]
  chainOfThought: string[] // Show AI analysis
  actionPlan: string
  pdfReportUrl?: string
}

export async function scanNCRRisks(
  request: NCRScanRequest
): Promise<NCRScanResult> {
  // Mock implementation for demo - replace with actual JamAI Base API call
  await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate AI analysis
  
  const isBm = request.language === 'bm'
  
  const issues: NCRIssue[] = [
    {
      category: 'hygiene',
      severity: 'medium',
      description: isBm
        ? 'Kawasan basuh tangan tidak kelihatan'
        : 'Handwash station not visible',
      howToFix: isBm
        ? 'Pasang sinki basuh tangan dengan sabun dan tuala kertas'
        : 'Install handwash sink with soap and paper towels',
      estimatedCost: 'RM300',
    },
    {
      category: 'staff',
      severity: 'medium',
      description: isBm
        ? 'Tiada rekod latihan kesedaran halal untuk kakitangan'
        : 'No halal awareness training records for staff',
      howToFix: isBm
        ? 'Adakan sesi latihan halal dan simpan sijil kehadiran'
        : 'Conduct halal training session and keep attendance certificates',
      estimatedCost: 'RM200',
    },
  ]

  const chainOfThought = isBm ? [
    'Langkah 1: Menganalisis imej kilang/dapur - mengesan peralatan, susun atur, kawasan penyimpanan',
    'Langkah 2: Membandingkan dengan pangkalan data kesilapan NCR utama',
    'Langkah 3: Mengesan RISIKO SEDERHANA: Kebersihan dan latihan kakitangan',
    'Langkah 4: Mengira skor risiko keseluruhan: 5/10',
  ] : [
    'Step 1: Analyzed factory/kitchen image - detected equipment, layout, storage areas',
    'Step 2: Compared against NCR common failure database',
    'Step 3: Detected MEDIUM RISK: Hygiene and staff training',
    'Step 4: Calculated overall risk score: 5/10',
  ]

  const actionPlan = isBm
    ? '1. Pasang sinki basuh tangan (RM300)\n2. Adakan latihan kesedaran halal (RM200)\n3. Rekod semua proses untuk audit\n\nJumlah Anggaran: RM500'
    : '1. Install handwash station (RM300)\n2. Conduct halal awareness training (RM200)\n3. Document all processes for audit\n\nEstimated Total: RM500'

  return {
    overallRiskScore: 5,
    issues,
    chainOfThought,
    actionPlan,
  }
}

// ============================================
// MYEHALAL FORM ASSISTANT
// ============================================

export interface FormAssistantRequest {
  formSection: string // "company_info" | "production_flow" | "materials"
  userQuestion: string // User's question in Manglish/BM/EN
  currentFormData: any // What they've filled so far
  language: 'en' | 'bm'
}

export interface FormAssistantResponse {
  answer: string
  suggestedValue?: string
  relatedDocuments: string[] // From Knowledge Table
  chainOfThought: string[]
}

export async function askFormAssistant(
  request: FormAssistantRequest
): Promise<FormAssistantResponse> {
  // Mock implementation for demo
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const isBm = request.language === 'bm'
  
  return {
    answer: isBm
      ? 'Carta aliran pengeluaran adalah gambar rajah yang menunjukkan proses pembuatan produk dari bahan mentah hingga siap. Ia perlu termasuk: 1) Penerimaan bahan mentah, 2) Penyimpanan, 3) Penyediaan, 4) Pemprosesan, 5) Pembungkusan, 6) Penyimpanan produk siap.'
      : 'Production flow chart is a diagram showing the manufacturing process from raw materials to finished product. It must include: 1) Raw material receiving, 2) Storage, 3) Preparation, 4) Processing, 5) Packaging, 6) Finished product storage.',
    suggestedValue: isBm
      ? 'Bahan Mentah → Stor → Penyediaan → Memasak → Pembungkusan → Stor Siap'
      : 'Raw Materials → Storage → Preparation → Cooking → Packaging → Finished Storage',
    relatedDocuments: [
      'JAKIM_Production_Flow_Examples.pdf',
      'MYeHALAL_Form_Guide.pdf',
    ],
    chainOfThought: isBm ? [
      'Langkah 1: Mengenal pasti soalan tentang "carta aliran pengeluaran"',
      'Langkah 2: Mencari maklumat dalam panduan borang MYeHALAL',
      'Langkah 3: Menjana contoh yang sesuai untuk jenis perniagaan',
      'Langkah 4: Memberikan jawapan lengkap dengan contoh',
    ] : [
      'Step 1: Identified question about "production flow chart"',
      'Step 2: Searched MYeHALAL form guide database',
      'Step 3: Generated appropriate example for business type',
      'Step 4: Provided complete answer with example',
    ],
  }
}

// ============================================
// MOCK AUDIT (Interview Mode)
// ============================================

export interface MockAuditQuestion {
  question: string
  category: 'materials' | 'staff' | 'hygiene' | 'documentation'
  expectedAnswer: string
  tips: string[]
}

export async function startMockAudit(businessType: string, language: 'en' | 'bm' = 'bm'): Promise<MockAuditQuestion[]> {
  // Mock implementation for demo
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const isBm = language === 'bm'
  
  const questions: MockAuditQuestion[] = [
    {
      question: isBm
        ? 'Siapa Halal Executive anda dan di mana sijil pendaftaran HPB?'
        : 'Who is your Halal Executive and where is the HPB registration certificate?',
      category: 'staff',
      expectedAnswer: isBm
        ? 'Nama Halal Executive, nombor pendaftaran HPB, dan tunjukkan sijil'
        : 'Name of Halal Executive, HPB registration number, and show certificate',
      tips: isBm ? [
        'Pastikan sijil HPB tidak tamat tempoh',
        'Halal Executive mesti hadir semasa audit',
        'Simpan salinan sijil dalam fail khas',
      ] : [
        'Ensure HPB certificate is not expired',
        'Halal Executive must be present during audit',
        'Keep copy of certificate in special file',
      ],
    },
    {
      question: isBm
        ? 'Tunjukkan sijil halal untuk semua bahan mentah'
        : 'Show halal certificates for all raw materials',
      category: 'materials',
      expectedAnswer: isBm
        ? 'Fail sijil halal dari semua pembekal, tidak tamat tempoh'
        : 'File of halal certificates from all suppliers, not expired',
      tips: isBm ? [
        'Susun sijil mengikut nama pembekal',
        'Semak tarikh luput setiap sijil',
        'Pastikan nama produk sama dengan yang digunakan',
      ] : [
        'Organize certificates by supplier name',
        'Check expiry date of each certificate',
        'Ensure product names match what is used',
      ],
    },
  ]
  
  return questions
}
