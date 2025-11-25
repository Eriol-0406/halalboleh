import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/scan-ingredient
 * 
 * Multimodal ingredient scanner using JAM AI Base
 * Handles: Vision (product labels), Audio (Manglish voice), Text (manual input)
 * 
 * JAM AI Base Integration:
 * 1. Audio_Transcribe (Whisper): Converts Manglish audio to text
 * 2. Vision_Scanner (GPT-4o/Llama Vision): Extracts ingredients and logos
 * 3. RAG_Check: Validates against E-Code blacklist and foreign cert database
 * 4. Output: Risk assessment with friendly formal BM advice
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const image = formData.get('image') as File | null
    const imageBase64 = formData.get('imageBase64') as string | null
    const audio = formData.get('audio') as File | null
    const text = formData.get('text') as string | null
    const language = formData.get('language') as string || 'bm'

    // TODO: Connect to JAM AI Base
    // const jamAIClient = new JamAIClient(process.env.JAMAI_API_KEY)
    
    // Step 1: Transcribe audio if provided
    let transcribedText = text || ''
    if (audio) {
      // TODO: Call JAM AI Whisper endpoint
      // const transcription = await jamAIClient.transcribe(audio)
      // transcribedText = transcription.text
      transcribedText = 'Boss, check sos ni. Logo Siam ni laku ke tak?'
    }

    // Step 2: Scan image for ingredients and logos
    let visionResults = {
      ingredients: [] as string[],
      eCodes: [] as string[],
      logo: null as string | null,
      certBody: null as string | null
    }

    if (image || imageBase64) {
      // TODO: Call JAM AI Vision endpoint with specialized prompt
      // const vision = await jamAIClient.analyzeImage(image, {
      //   prompt: VISION_PROMPT_TEMPLATE,
      //   detectECodes: true,
      //   detectLogos: true
      // })
      visionResults = {
        ingredients: ['E471', 'Oyster Extract', 'Sugar', 'Cuka Wain'],
        eCodes: ['E471'],
        logo: 'Central Islamic Council of Thailand (CICOT)',
        certBody: 'CICOT'
      }
    }

    // Step 3: RAG Check against Knowledge Tables
    const flaggedIngredients: string[] = []
    let riskLevel: 'High' | 'Medium' | 'Low' = 'Low'
    
    // Check E-Codes
    if (visionResults.eCodes.includes('E471')) {
      flaggedIngredients.push('E471 (Mono-and diglycerides - Mushbooh, perlu bukti sumber tumbuhan)')
      riskLevel = 'Medium'
    }
    
    // Check forbidden ingredients
    if (visionResults.ingredients.some(ing => ing.toLowerCase().includes('cuka wain'))) {
      flaggedIngredients.push('Cuka Wain (Wine Vinegar - Haram)')
      riskLevel = 'High'
    }

    // Check foreign certification
    const isCertValid = visionResults.certBody === 'CICOT' // Simplified check

    // Step 4: Generate friendly formal advice
    const userAdviceBM = riskLevel === 'High'
      ? `Puan, saya dah semak. Sos ini tidak disyorkan kerana ia mengandungi '${flaggedIngredients[0].split('(')[0].trim()}'. Untuk keselamatan status Halal kedai Puan, sila elakkan produk ini.`
      : riskLevel === 'Medium'
      ? `Puan, saya dah semak. Produk ini mengandungi bahan yang meragukan (${flaggedIngredients[0].split('(')[0].trim()}). Sila dapatkan bukti sumber halal dari pembekal sebelum menggunakan.`
      : `Puan, saya dah semak. Produk ini selamat digunakan. Logo halal ${visionResults.certBody} adalah sah dan diiktiraf.`

    const userAdviceEN = riskLevel === 'High'
      ? `After checking, this product is not recommended as it contains '${flaggedIngredients[0].split('(')[0].trim()}'. For the safety of your Halal status, please avoid this product.`
      : riskLevel === 'Medium'
      ? `After checking, this product contains doubtful ingredients (${flaggedIngredients[0].split('(')[0].trim()}). Please obtain halal source proof from supplier before use.`
      : `After checking, this product is safe to use. The ${visionResults.certBody} halal logo is valid and recognized.`

    return NextResponse.json({
      riskLevel,
      flaggedIngredients,
      certBodyName: visionResults.certBody,
      userAdviceBM,
      userAdviceEN,
      reasoning: `Detected ${visionResults.ingredients.length} ingredients, ${visionResults.eCodes.length} E-codes. ${isCertValid ? 'Foreign certification is valid.' : 'No valid certification found.'}`,
      detectedIngredients: visionResults.ingredients,
      halalStatus: riskLevel === 'High' ? 'Haram' : riskLevel === 'Medium' ? 'Mushbooh' : 'Halal'
    })

  } catch (error) {
    console.error('Scan ingredient error:', error)
    return NextResponse.json(
      { error: 'Failed to scan ingredient' },
      { status: 500 }
    )
  }
}
