import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/pre-audit
 * 
 * Pre-Audit Digital Auditor
 * Validates document completeness and scores audit readiness
 * 
 * JAM AI Base Integration:
 * - Document Validator: Checks for required JAKIM documents
 * - Checklist Scorer: Validates against MPPHM 2020 requirements
 * - Logic Checker: Verifies menu-ingredient consistency
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const businessType = formData.get('businessType') as string

    // Extract uploaded documents
    const documents: { name: string; type: string }[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('document_') && value instanceof File) {
        documents.push({
          name: value.name,
          type: value.type
        })
      }
    }

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents uploaded' },
        { status: 400 }
      )
    }

    // TODO: Connect to JAM AI Base
    // const jamAIClient = new JamAIClient(process.env.JAMAI_API_KEY)
    // const auditResult = await jamAIClient.validatePreAudit({
    //   documents,
    //   businessType,
    //   checklistVersion: 'mpphm-2020'
    // })

    // Required documents checklist
    const requiredDocs = [
      'Carta Alir Proses (Process Flow Chart)',
      'Sijil Latihan Halal (Halal Training Certificate)',
      'Senarai Menu (Menu List)',
      'Senarai Ramuan (Ingredient List)',
      'Polisi Halal (Halal Policy Poster)',
      'Kontrak Kawalan Makhluk Perosak (Pest Control Contract)',
      'Manual IHCS (IHCS Manual)'
    ]

    // Mock document detection
    const detectedDocs = documents.map(doc => {
      const docName = doc.name.toLowerCase()
      if (docName.includes('flow') || docName.includes('carta')) return requiredDocs[0]
      if (docName.includes('training') || docName.includes('latihan')) return requiredDocs[1]
      if (docName.includes('menu')) return requiredDocs[2]
      if (docName.includes('ingredient') || docName.includes('ramuan')) return requiredDocs[3]
      if (docName.includes('policy') || docName.includes('polisi')) return requiredDocs[4]
      if (docName.includes('pest') || docName.includes('kawalan')) return requiredDocs[5]
      if (docName.includes('ihcs') || docName.includes('manual')) return requiredDocs[6]
      return null
    }).filter(Boolean) as string[]

    const missingDocuments = requiredDocs.filter(req => !detectedDocs.includes(req))
    const passedChecks = detectedDocs.length
    const totalChecks = requiredDocs.length
    const score = Math.round((passedChecks / totalChecks) * 100)

    // Generate warnings and recommendations
    const warnings: string[] = []
    const recommendations: string[] = []

    if (score < 70) {
      warnings.push('Skor anda di bawah 70%. Permohonan mungkin ditolak oleh JAKIM.')
    }
    
    if (missingDocuments.length > 0) {
      warnings.push(`${missingDocuments.length} dokumen wajib masih belum dimuat naik.`)
    }

    if (missingDocuments.includes('Manual IHCS (IHCS Manual)')) {
      recommendations.push('Gunakan "IHCS Auto-Architect" untuk menjana manual IHCS secara automatik.')
    }

    if (missingDocuments.includes('Sijil Latihan Halal (Halal Training Certificate)')) {
      recommendations.push('Semua kakitangan mesti menghadiri latihan halal yang diiktiraf JAKIM.')
    }

    return NextResponse.json({
      score,
      totalChecks,
      passedChecks,
      missingDocuments,
      warnings,
      recommendations
    })

  } catch (error) {
    console.error('Pre-audit validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate pre-audit' },
      { status: 500 }
    )
  }
}
