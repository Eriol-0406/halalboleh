'use client'

interface ChainOfThoughtProps {
  thoughts: string[]
  language: 'en' | 'bm'
}

export default function ChainOfThought({ thoughts, language }: ChainOfThoughtProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>🧠</span>
        {language === 'bm' ? 'Penaakulan AI' : 'AI Reasoning'}
      </h3>
      <div className="space-y-2">
        {thoughts.map((thought, index) => (
          <div
            key={index}
            className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-purple-100"
          >
            <span className="font-medium text-purple-600">
              {language === 'bm' ? 'Langkah' : 'Step'} {index + 1}:
            </span>{' '}
            {thought}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        {language === 'bm'
          ? '💡 Teknologi JamAI Base menunjukkan proses penaakulan AI untuk ketelusan penuh.'
          : '💡 JamAI Base technology shows AI reasoning process for full transparency.'}
      </p>
    </div>
  )
}
