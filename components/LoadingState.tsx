'use client'

import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message: string
  submessage?: string
}

export default function LoadingState({ message, submessage }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Loader2 className="w-12 h-12 text-halal-primary animate-spin mb-4" />
      <p className="text-gray-600 font-medium text-center">{message}</p>
      {submessage && (
        <p className="text-sm text-gray-500 mt-2 text-center">{submessage}</p>
      )}
    </div>
  )
}
