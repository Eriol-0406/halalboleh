'use client'

import { NCRIssue } from '@/lib/jamaibase'

interface StatusBadgeProps {
  severity: 'high' | 'medium' | 'low'
  language: 'en' | 'bm'
}

export function StatusBadge({ severity, language }: StatusBadgeProps) {
  const labels = {
    high: language === 'bm' ? 'RISIKO TINGGI' : 'HIGH RISK',
    medium: language === 'bm' ? 'RISIKO SEDERHANA' : 'MEDIUM RISK',
    low: language === 'bm' ? 'RISIKO RENDAH' : 'LOW RISK',
  }

  const colors = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-orange-100 text-orange-700 border-orange-300',
    low: 'bg-green-100 text-green-700 border-green-300',
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${colors[severity]}`}
    >
      {labels[severity]}
    </span>
  )
}

interface IssueCardProps {
  issue: NCRIssue
  language: 'en' | 'bm'
}

export function IssueCard({ issue, language }: IssueCardProps) {
  const categoryLabels = {
    hygiene: language === 'bm' ? 'Kebersihan' : 'Hygiene',
    staff: language === 'bm' ? 'Kakitangan' : 'Staff',
    transport: language === 'bm' ? 'Pengangkutan' : 'Transport',
    halal_executive: language === 'bm' ? 'Halal Executive' : 'Halal Executive',
  }

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {issue.category === 'hygiene' && '🧼'}
            {issue.category === 'staff' && '👥'}
            {issue.category === 'transport' && '🚚'}
            {issue.category === 'halal_executive' && '👔'}
          </span>
          <div>
            <h4 className="font-semibold text-gray-900">{categoryLabels[issue.category]}</h4>
          </div>
        </div>
        <StatusBadge severity={issue.severity} language={language} />
      </div>

      <p className="text-sm text-gray-700 mb-3">{issue.description}</p>

      <div className="bg-blue-50 rounded-lg p-3 mb-2">
        <p className="text-xs font-semibold text-blue-900 mb-1">
          {language === 'bm' ? 'Cara Betulkan:' : 'How to Fix:'}
        </p>
        <p className="text-sm text-blue-800">{issue.howToFix}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {language === 'bm' ? 'Anggaran Kos' : 'Estimated Cost'}
        </span>
        <span className="font-bold text-halal-primary">{issue.estimatedCost}</span>
      </div>
    </div>
  )
}
