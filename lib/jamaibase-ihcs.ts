/**
 * JamAI Base Integration for IHCS Manual Generation
 * Handles AI-powered content transformation and MPPHM 2020 compliance
 */

const JAMAI_BASE_URL = process.env.NEXT_PUBLIC_JAMAI_BASE_URL || 'https://api.jamaibase.com'
const JAMAI_PROJECT_ID = process.env.NEXT_PUBLIC_JAMAI_PROJECT_ID
const JAMAI_PAT = process.env.NEXT_PUBLIC_JAMAI_PERSONAL_ACCESS_TOKEN

// ============================================
// INTERFACES
// ============================================

export interface ChapterTransformRequest {
  chapterNumber: number
  chapterTitle: string
  userAnswer: string
  companyName: string
  businessType: string
  language: 'en' | 'bm' | 'manglish'
}

export interface ChapterTransformResponse {
  formalContent: string // HTML formatted content
  complianceScore: number // 0-100
  suggestions: string[]
  mpPHMReferences: string[]
  chainOfThought: string[]
}

// ============================================
// KNOWLEDGE TABLE QUERIES
// ============================================

/**
 * Query MPPHM 2020 knowledge base for specific chapter requirements
 */
export async function queryMPPHMRequirements(chapterNumber: number): Promise<any> {
  try {
    const response = await fetch(`${JAMAI_BASE_URL}/api/v1/gen_tables/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JAMAI_PAT}`,
        'X-Project-Id': JAMAI_PROJECT_ID || '',
      },
      body: JSON.stringify({
        table_id: 'mpphm_2020_knowledge',
        query: `What are the MPPHM 2020 requirements for IHCS Chapter ${chapterNumber}? Include specific sections, mandatory elements, and compliance criteria.`,
        temperature: 0.3,
        max_tokens: 500
      }),
    })

    if (!response.ok) {
      throw new Error(`JamAI query failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('MPPHM query error:', error)
    // Fallback to mock data if JamAI is unavailable
    return getMockMPPHMRequirements(chapterNumber)
  }
}

/**
 * Get IHCS chapter template from knowledge base
 */
export async function getChapterTemplate(chapterNumber: number): Promise<string> {
  try {
    const response = await fetch(`${JAMAI_BASE_URL}/api/v1/gen_tables/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JAMAI_PAT}`,
        'X-Project-Id': JAMAI_PROJECT_ID || '',
      },
      body: JSON.stringify({
        table_id: 'ihcs_templates',
        query: `Retrieve the IHCS manual template for Chapter ${chapterNumber} in Bahasa Malaysia format.`,
        temperature: 0.1,
        max_tokens: 800
      }),
    })

    if (!response.ok) {
      throw new Error(`Template query failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response || ''
  } catch (error) {
    console.error('Template query error:', error)
    return ''
  }
}

// ============================================
// AI CONTENT TRANSFORMATION
// ============================================

/**
 * Transform informal user answer to formal MPPHM-compliant content
 */
export async function transformChapterContent(
  request: ChapterTransformRequest
): Promise<ChapterTransformResponse> {
  try {
    console.log(`  📡 [JamAI API] Calling Action Table for Chapter ${request.chapterNumber}...`)
    
    // STEP 1: Query requirements
    const requirements = await queryMPPHMRequirements(request.chapterNumber)

    // STEP 2: Build transformation prompt
    const prompt = buildTransformationPrompt(request, requirements)

    // STEP 3: Call JamAI action table
    console.log(`  📡 [JamAI API] POST ${JAMAI_BASE_URL}/api/v1/gen_tables/action/rows/add`)
    console.log(`  📡 [JamAI API] Table: ihcs_content_transformer`)
    
    const response = await fetch(`${JAMAI_BASE_URL}/api/v1/gen_tables/action/rows/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JAMAI_PAT}`,
        'X-Project-Id': JAMAI_PROJECT_ID || '',
      },
      body: JSON.stringify({
        table_id: 'ihcs_content_transformer',
        data: [{
          user_answer: request.userAnswer,
          company_name: request.companyName,
          business_type: request.businessType,
          chapter_number: request.chapterNumber.toString(),
          language: request.language
        }],
        stream: false
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  ❌ [JamAI API] Error ${response.status}: ${response.statusText}`)
      console.error(`  ❌ [JamAI API] Response:`, errorText)
      console.warn('  ⚠️ [Fallback] Using template-based transformation')
      return fallbackTransformation(request)
    }

    const result = await response.json()
    console.log(`  ✅ [JamAI API] Success! Response received`)
    
    // JamAI returns: { rows: [{ columns: { col_name: { choices: [{ message: { content: "..." } }] } } }] }
    const row = result.rows?.[0]
    const cols = row?.columns || {}
    
    // Extract content from the nested structure
    const formalContent = cols.formal_content?.choices?.[0]?.message?.content || ''
    const complianceScoreText = cols.compliance_score?.choices?.[0]?.message?.content || '75'
    const suggestionsText = cols.suggestions?.choices?.[0]?.message?.content || ''
    
    // Extract RAG citations if present
    const formalCitations = cols.formal_content?.choices?.[0]?.references || []
    const scoreCitations = cols.compliance_score?.choices?.[0]?.references || []
    
    // Parse compliance score - extract first number found in the text
    const scoreMatch = complianceScoreText.match(/\d+/)
    const complianceScore = scoreMatch ? parseInt(scoreMatch[0]) : 75
    const suggestions = suggestionsText.split('\n').filter((s: string) => s.trim()).slice(0, 5)
    
    // Convert cryptic citations [@1], [@2] to user-friendly references
    const cleanedContent = convertCitationsToReferences(formalContent, formalCitations)
    
    // Extract MPPHM references from content (citations are inline)
    const mpPHMReferences = extractMPPHMReferences(cleanedContent)
    
    console.log(`  ✨ [AI Result] Compliance Score: ${complianceScore}%`)
    console.log(`  ✨ [AI Result] Content Length: ${cleanedContent.length} chars`)
    console.log(`  ✨ [AI Result] MPPHM References: ${mpPHMReferences.join(', ')}`)
    console.log(`  ✨ [RAG] Citations Retrieved: ${formalCitations.length + scoreCitations.length}`)

    return {
      formalContent: cleanedContent,
      complianceScore,
      suggestions,
      mpPHMReferences,
      chainOfThought: []
    }
  } catch (error) {
    console.error(`  ❌ [JamAI Error] Chapter ${request.chapterNumber} transformation failed:`, error)
    console.warn('  ⚠️ [Fallback] Using template-based transformation')
    return fallbackTransformation(request)
  }
}

// ============================================
// PROMPT ENGINEERING
// ============================================

function buildTransformationPrompt(
  request: ChapterTransformRequest,
  requirements: any
): string {
  return `
You are a Malaysian halal certification consultant expert in MPPHM 2020 standards.

TASK: Transform informal user input into formal, MPPHM 2020-compliant IHCS manual content.

INPUT:
- Chapter: ${request.chapterNumber} - ${request.chapterTitle}
- Company: ${request.companyName}
- Business Type: ${request.businessType}
- User's Answer: "${request.userAnswer}"
- Input Language: ${request.language}

MPPHM 2020 REQUIREMENTS:
${JSON.stringify(requirements, null, 2)}

INSTRUCTIONS:
1. **Language**: Output in formal Bahasa Malaysia (regardless of input language)
2. **Format**: HTML with proper structure (<p>, <ol>, <ul>, <strong>)
3. **Compliance**: Include all mandatory MPPHM 2020 elements
4. **Enrichment**: Add missing steps/procedures based on best practices
5. **Formality**: Convert informal/Manglish to professional business language
6. **Specificity**: Reference specific MPPHM sections (e.g., "Seksyen 5.2")

EXAMPLE TRANSFORMATION:
Input: "Check supplier cert lah, make sure got halal logo"
Output:
<p>Syarikat kami melaksanakan kawalan ketat terhadap semua bahan mentah yang diterima mengikut MPPHM 2020 Seksyen 4.3:</p>
<ol class="procedure-list">
  <li>Semak sijil halal pembekal (mesti sah dan dalam tempoh)</li>
  <li>Periksa label produk untuk logo halal yang diiktiraf JAKIM</li>
  <li>Rekodkan maklumat dalam Borang Penerimaan Bahan</li>
</ol>

OUTPUT (JSON):
{
  "formal_content": "HTML formatted content here",
  "compliance_score": 85,
  "suggestions": ["Consider adding verification frequency", "Specify record retention period"],
  "mpphm_references": ["Seksyen 4.3", "Seksyen 6.1"],
  "chain_of_thought": [
    "Step 1: Detected informal English/Manglish input",
    "Step 2: Extracted key actions: check certificate, verify logo",
    "Step 3: Mapped to MPPHM Seksyen 4.3 requirements",
    "Step 4: Added mandatory step: record keeping",
    "Step 5: Formatted in formal Bahasa Malaysia"
  ]
}
`
}

// ============================================
// FALLBACK FUNCTIONS (when JamAI unavailable)
// ============================================

function fallbackTransformation(request: ChapterTransformRequest): ChapterTransformResponse {
  console.log(`  🔄 [Fallback] Generating template-based content for Chapter ${request.chapterNumber}`)
  
  // Use the existing template-based transformation
  const templates = {
    1: (answer: string, company: string) => `
      <p>Kami, <strong>${company}</strong>, dengan ini mengisytiharkan 
      komitmen kami untuk mematuhi semua kehendak pensijilan halal seperti yang ditetapkan oleh 
      Jabatan Kemajuan Islam Malaysia (JAKIM).</p>
      
      <p><strong>Matlamat Halal:</strong><br>
      ${answer}</p>
      
      <p>Kami berkomitmen untuk:</p>
      <ul class="procedure-list">
        <li>Memastikan semua bahan mentah adalah halal dan bersih</li>
        <li>Mengelakkan sebarang pencemaran dengan bahan haram</li>
        <li>Melaksanakan audit dalaman secara berkala</li>
        <li>Melatih kakitangan tentang keperluan halal</li>
      </ul>
    `,
    2: (answer: string) => `
      <p>Syarikat kami melaksanakan kawalan ketat terhadap semua bahan mentah yang diterima:</p>
      
      <p><strong>Prosedur Semakan:</strong><br>
      ${answer}</p>
      
      <ol class="procedure-list">
        <li>Semak sijil halal pembekal (mesti sah dan dalam tempoh)</li>
        <li>Periksa label produk untuk logo halal yang diiktiraf</li>
        <li>Rekodkan semua maklumat penerimaan dalam Borang Penerimaan Bahan</li>
        <li>Simpan sijil halal pembekal dalam fail halal</li>
      </ol>
    `,
    // ... add more templates
  }

  const template = templates[request.chapterNumber as keyof typeof templates]
  const content = template 
    ? template(request.userAnswer, request.companyName)
    : `<p>${request.userAnswer}</p>`

  return {
    formalContent: content,
    complianceScore: 70,
    suggestions: ['AI transformation unavailable - using template'],
    mpPHMReferences: [],
    chainOfThought: ['Fallback to template-based transformation']
  }
}

function getMockMPPHMRequirements(chapterNumber: number): any {
  const mockData = {
    1: {
      section: 'Seksyen 3.1',
      requirements: [
        'Company halal policy statement',
        'Management commitment declaration',
        'Halal objectives and scope'
      ]
    },
    2: {
      section: 'Seksyen 4.3',
      requirements: [
        'Supplier verification procedures',
        'Halal certificate validation',
        'Record keeping system'
      ]
    },
    // ... add more
  }

  return mockData[chapterNumber as keyof typeof mockData] || {}
}

// ============================================
// BATCH PROCESSING
// ============================================

/**
 * Transform all 7 chapters in parallel for faster processing
 */
export async function transformAllChapters(
  answers: Record<string, string>,
  companyName: string,
  businessType: string
): Promise<ChapterTransformResponse[]> {
  console.log('🔵 [JamAI] Starting AI transformation for 7 chapters...')
  console.log('🔵 [JamAI] Company:', companyName)
  console.log('🔵 [JamAI] Project ID:', JAMAI_PROJECT_ID ? '✅ Set' : '❌ Missing')
  console.log('🔵 [JamAI] PAT:', JAMAI_PAT ? '✅ Set' : '❌ Missing')
  console.log('🔵 [JamAI] Base URL:', JAMAI_BASE_URL)
  
  const chapters = [
    { number: 1, title: 'Polisi Halal Syarikat', field: 'halal_policy' },
    { number: 2, title: 'Kawalan Bahan Mentah - Pembelian', field: 'purchasing_procedure' },
    { number: 3, title: 'Kawalan Bahan Mentah - Penerimaan', field: 'receiving_procedure' },
    { number: 4, title: 'Kawalan Bahan Mentah - Penyimpanan', field: 'storage_procedure' },
    { number: 5, title: 'Senarai Utama Bahan Mentah', field: 'raw_material_list' },
    { number: 6, title: 'Program Kebolehkesanan Produk', field: 'traceability_program' },
    { number: 7, title: 'Program Penarikan Balik Produk', field: 'recall_procedure' },
  ]

  const transformations = chapters.map(chapter =>
    transformChapterContent({
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      userAnswer: answers[chapter.field] || 'Tiada maklumat',
      companyName,
      businessType,
      language: detectLanguage(answers[chapter.field] || '')
    })
  )

  return Promise.all(transformations)
}

/**
 * Convert cryptic citations [@1], [@2] to user-friendly MPPHM references
 */
function convertCitationsToReferences(content: string, citations: any[]): string {
  if (!citations || citations.length === 0) {
    // No citation metadata available, remove citation markers
    return content.replace(/\[@\d+\]/g, '')
  }
  
  // Replace [@1], [@2], etc. with actual references from citation metadata
  let cleanedContent = content
  
  citations.forEach((citation, index) => {
    const citationNum = index + 1
    const marker = `[@${citationNum}]`
    
    // Extract title or chunk identifier from citation
    const title = citation.title || citation.text?.substring(0, 50) || 'MPPHM 2020'
    const reference = `<sup>[${title}]</sup>`
    
    cleanedContent = cleanedContent.replace(new RegExp(`\\[@${citationNum}\\]`, 'g'), reference)
  })
  
  // Remove any remaining citation markers that weren't matched
  cleanedContent = cleanedContent.replace(/\[@\d+\]/g, '')
  
  return cleanedContent
}

/**
 * Extract MPPHM 2020 section references from generated content
 */
function extractMPPHMReferences(content: string): string[] {
  const references: string[] = []
  
  // Match patterns like "MPPHM 2020 Seksyen 5.2", "Seksyen 5.3", etc.
  const sectionPattern = /(?:MPPHM 2020 )?Seksyen (\d+(?:\.\d+)*)/gi
  const matches = content.matchAll(sectionPattern)
  
  for (const match of matches) {
    const ref = `MPPHM 2020 Seksyen ${match[1]}`
    if (!references.includes(ref)) {
      references.push(ref)
    }
  }
  
  return references
}

/**
 * Detect input language (en/bm/manglish)
 */
function detectLanguage(text: string): 'en' | 'bm' | 'manglish' {
  const bmWords = ['saya', 'kami', 'ada', 'tidak', 'untuk', 'dengan', 'yang']
  const enWords = ['have', 'check', 'verify', 'ensure', 'process', 'system']
  
  const lowerText = text.toLowerCase()
  const hasBM = bmWords.some(word => lowerText.includes(word))
  const hasEN = enWords.some(word => lowerText.includes(word))
  
  if (hasBM && hasEN) return 'manglish'
  if (hasBM) return 'bm'
  return 'en'
}
