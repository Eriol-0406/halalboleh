import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/transcribe
 * 
 * Audio transcription using Whisper API
 * Supports Manglish and Malaysian dialects
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as File
    const language = formData.get('language') as string || 'ms'

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // TODO: Connect to JAM AI Base Whisper endpoint
    // const jamAIClient = new JamAIClient(process.env.JAMAI_API_KEY)
    // const result = await jamAIClient.transcribe({
    //   audio,
    //   language,
    //   model: 'whisper-large-v3'
    // })

    // Mock response for development
    const mockTranscriptions = [
      'Boss, check sos ni. Logo Siam ni laku ke tak?',
      'Eh, produk ni halal ke? Ada E471 tu apa?',
      'Puan, saya nak tanya pasal ramuan dalam kek ni',
      'Boleh check tak sauce ni dari Thailand?'
    ]

    return NextResponse.json({
      text: mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)],
      language: 'ms',
      confidence: 0.92
    })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
