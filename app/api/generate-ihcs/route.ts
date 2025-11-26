import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'
import { transformAllChapters } from '@/lib/jamaibase-ihcs'

/**
 * POST /api/generate-ihcs
 * 
 * IHCS (Internal Halal Control System) Auto-Architect
 * Generates MPPHM 2020 compliant HAS manual from conversational Q&A
 * 
 * JAM AI Base Integration:
 * - Knowledge Table: MPPHM 2020 Malaysian Halal Certification Manual
 * - Chat Agent: Interviews user in friendly Bahasa Malaysia
 * - Document Generator: Converts answers to formal 50-page PDF
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, businessType, responses } = body

    if (!companyName || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('🚀 Starting IHCS generation for:', companyName)

    // STEP 1: Read HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'ihcs', 'manual-template.html')
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8')

    // STEP 2: Transform user answers with JamAI Base AI
    console.log('🤖 Transforming answers with JamAI Base AI...')
    const transformedChapters = await transformAllChapters(responses, companyName, businessType || 'Perkhidmatan Makanan')
    
    console.log('✨ AI transformation complete:', transformedChapters.map(ch => `${ch.complianceScore}%`).join(', '))

    // STEP 3: Replace placeholders in template
    const generationDate = new Date().toLocaleDateString('ms-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    htmlTemplate = htmlTemplate
      .replace(/{{COMPANY_NAME}}/g, companyName)
      .replace(/{{BUSINESS_TYPE}}/g, businessType || 'Perkhidmatan Makanan')
      .replace(/{{GENERATION_DATE}}/g, generationDate)
      .replace(/{{CHAPTER_1_CONTENT}}/g, transformedChapters[0].formalContent)
      .replace(/{{CHAPTER_2_CONTENT}}/g, transformedChapters[1].formalContent)
      .replace(/{{CHAPTER_3_CONTENT}}/g, transformedChapters[2].formalContent)
      .replace(/{{CHAPTER_4_CONTENT}}/g, transformedChapters[3].formalContent)
      .replace(/{{CHAPTER_5_CONTENT}}/g, transformedChapters[4].formalContent)
      .replace(/{{CHAPTER_6_CONTENT}}/g, transformedChapters[5].formalContent)
      .replace(/{{CHAPTER_7_CONTENT}}/g, transformedChapters[6].formalContent)

    // STEP 4: Generate PDF with Puppeteer
    console.log('📄 Generating PDF...')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '25mm',
        right: '20mm',
        bottom: '25mm',
        left: '20mm'
      }
    })
    
    await browser.close()

    // STEP 5: Save PDF to public folder
    const filename = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
    const outputPath = path.join(process.cwd(), 'public', 'generated', 'ihcs', filename)
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, pdfBuffer)

    console.log('✅ PDF generated successfully:', filename)

    // STEP 6: Return response
    const pdfUrl = `/generated/ihcs/${filename}`

    return NextResponse.json({
      pdfUrl,
      chapters: transformedChapters.map((ch, idx) => ({
        title: `Bab ${idx + 1}`,
        content: ch.formalContent.substring(0, 100) + '...', // Preview only
        status: 'complete' as const,
        complianceScore: ch.complianceScore,
        suggestions: ch.suggestions
      })),
      completionPercentage: 100,
      averageComplianceScore: Math.round(
        transformedChapters.reduce((sum, ch) => sum + ch.complianceScore, 0) / transformedChapters.length
      )
    })

  } catch (error) {
    console.error('❌ IHCS generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate IHCS manual', details: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * Process user answers and transform to formal content
 * TODO: Replace with JamAI Base RAG + Action Table
 */
async function processAnswersWithAI(responses: Record<string, string>) {
  const CHAPTERS = [
    {
      id: 1,
      title: 'Bab 1: Polisi Halal',
      field: 'company_info',
      transform: (answer: string) => {
        // TODO: Use JamAI Base to transform informal answer to formal policy
        return `
          <p>Kami, <strong>${answer.split(',')[0] || 'syarikat ini'}</strong>, dengan ini mengisytiharkan 
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
        `
      }
    },
    {
      id: 2,
      title: 'Bab 2: Kawalan Bahan Mentah',
      field: 'raw_material_verification',
      transform: (answer: string) => {
        return `
          <p>Syarikat kami melaksanakan kawalan ketat terhadap semua bahan mentah yang diterima:</p>
          
          <p><strong>Prosedur Semakan:</strong><br>
          ${answer}</p>
          
          <ol class="procedure-list">
            <li>Semak sijil halal pembekal (mesti sah dan dalam tempoh)</li>
            <li>Periksa label produk untuk logo halal yang diiktiraf</li>
            <li>Rekodkan semua maklumat penerimaan dalam Borang Penerimaan Bahan</li>
            <li>Simpan sijil halal pembekal dalam fail halal</li>
          </ol>
        `
      }
    },
    {
      id: 3,
      title: 'Bab 3: Rekod Pembelian',
      field: 'purchase_records',
      transform: (answer: string) => {
        return `
          <p><strong>Sistem Rekod Pembelian:</strong><br>
          ${answer}</p>
          
          <p>Semua rekod pembelian termasuk:</p>
          <ul class="procedure-list">
            <li>Invois dan resit pembelian</li>
            <li>Sijil halal pembekal</li>
            <li>Surat jaminan halal (jika berkenaan)</li>
            <li>Borang penerimaan bahan mentah</li>
          </ul>
          
          <p>Rekod-rekod ini akan disimpan dengan kemas dalam fail halal dan boleh dirujuk 
          bila-bila masa untuk tujuan audit.</p>
        `
      }
    },
    {
      id: 4,
      title: 'Bab 4: Prosedur Pembersihan',
      field: 'cleaning_procedures',
      transform: (answer: string) => {
        return `
          <p><strong>Prosedur Pembersihan Standard:</strong><br>
          ${answer}</p>
          
          <p><strong>Langkah-langkah Pembersihan:</strong></p>
          <ol class="procedure-list">
            <li><strong>Pra-pembersihan:</strong> Buang sisa makanan dan kotoran kasar</li>
            <li><strong>Pencucian:</strong> Basuh dengan agen pembersih yang diluluskan halal</li>
            <li><strong>Pembilasan:</strong> Bilas dengan air bersih yang mencukupi</li>
            <li><strong>Sanitasi:</strong> Gunakan bahan sanitasi jika perlu</li>
            <li><strong>Pengeringan:</strong> Keringkan peralatan sebelum digunakan semula</li>
          </ol>
          
          <p>Semua agen pembersihan yang digunakan mestilah mempunyai sijil halal atau 
          surat pengesahan tidak mengandungi bahan haram.</p>
        `
      }
    },
    {
      id: 5,
      title: 'Bab 5: Tanggungjawab Halal',
      field: 'halal_responsibility',
      transform: (answer: string) => {
        return `
          <p><strong>Tanggungjawab Eksekutif Halal:</strong><br>
          ${answer}</p>
          
          <p>Eksekutif Halal yang dilantik bertanggungjawab untuk:</p>
          <ul class="procedure-list">
            <li>Memastikan pematuhan kepada Manual IHCS ini</li>
            <li>Menjalankan audit dalaman sekurang-kurangnya setiap 6 bulan</li>
            <li>Menguruskan semua dokumen dan rekod berkaitan halal</li>
            <li>Menghadiri kursus halal yang diiktiraf JAKIM</li>
            <li>Menjadi penghubung antara syarikat dengan JAKIM</li>
            <li>Memastikan semua kakitangan memahami keperluan halal</li>
          </ul>
          
          <p><em>Nota: Eksekutif Halal mestilah beragama Islam dan mempunyai 
          sijil Halal Professional Board (HPB) atau setaraf.</em></p>
        `
      }
    },
    {
      id: 6,
      title: 'Bab 6: Rekod Latihan',
      field: 'training_records',
      transform: (answer: string) => {
        return `
          <p><strong>Program Latihan Halal:</strong><br>
          ${answer}</p>
          
          <p>Syarikat komited untuk memberikan latihan halal kepada semua kakitangan:</p>
          
          <p><strong>Jenis-jenis Latihan:</strong></p>
          <ul class="procedure-list">
            <li><strong>Induksi Halal:</strong> Untuk kakitangan baru (wajib dalam 1 bulan pertama)</li>
            <li><strong>Latihan Tahunan:</strong> Refresh pengetahuan halal</li>
            <li><strong>Latihan Khusus:</strong> Untuk kakitangan pengendalian makanan</li>
            <li><strong>Kursus HPB:</strong> Untuk Eksekutif Halal</li>
          </ul>
          
          <p>Semua latihan akan direkodkan dengan lengkap termasuk tarikh, 
          topik, dan tandatangan peserta.</p>
        `
      }
    },
    {
      id: 7,
      title: 'Bab 7: Kebolehkesanan',
      field: 'traceability_system',
      transform: (answer: string) => {
        return `
          <p><strong>Sistem Kebolehkesanan:</strong><br>
          ${answer}</p>
          
          <p>Syarikat melaksanakan sistem kebolehkesanan untuk:</p>
          
          <ol class="procedure-list">
            <li><strong>Kebolehkesanan Hadapan (Forward):</strong><br>
            Dapat mengesan produk yang telah dihantar kepada pelanggan</li>
            
            <li><strong>Kebolehkesanan Belakang (Backward):</strong><br>
            Dapat mengesan bahan mentah yang digunakan dalam produk</li>
          </ol>
          
          <p><strong>Maklumat yang direkod:</strong></p>
          <ul class="procedure-list">
            <li>Nombor batch produk</li>
            <li>Tarikh pengeluaran</li>
            <li>Sumber bahan mentah (nama pembekal, no. sijil halal)</li>
            <li>Destinasi penghantaran (jika berkenaan)</li>
          </ul>
          
          <p>Sistem ini membolehkan syarikat bertindak pantas sekiranya 
          berlaku isu berkaitan halal.</p>
        `
      }
    }
  ]

  return CHAPTERS.map(chapter => ({
    title: chapter.title,
    content: chapter.transform(responses[chapter.field] || 'Tiada maklumat disediakan'),
    status: responses[chapter.field] ? 'complete' as const : 'incomplete' as const
  }))
}
