import React from 'react'
import { Twitter, Facebook, Github, Mail } from 'lucide-react'

export default function WebFooter() {
  return (
    <footer className="bg-[#F6F4ED] text-gray-800 border-t border-[#ECEAE5]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">PADU</div>
          <p className="mt-3 text-sm text-gray-700">AI-assisted halal certification tools — built for Malaysian SMEs and auditors.</p>
        </div>

        <div className="flex flex-col">
          <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
          <a href="/ingredient-guard" className="text-sm text-gray-600 hover:text-gray-900 mb-2">Ingredient Guard</a>
          <a href="/ihcs-architect" className="text-sm text-gray-600 hover:text-gray-900 mb-2">IHCS Auto-Architect</a>
          <a href="/pre-audit" className="text-sm text-gray-600 hover:text-gray-900">Pre-Audit Readiness</a>
        </div>

        <div className="flex flex-col">
          <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
          <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 mb-2">Pricing</a>
          <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900 mb-2">Contact</a>
          <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
        </div>
      </div>

      <div className="border-t border-[#ECEAE5]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-700">
          <div>© {new Date().getFullYear()} PADU — Built for EmbeddedLLM CodeFest</div>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@padu.example" className="text-gray-600 hover:text-emerald-800"><Mail className="w-4 h-4" /></a>
            <a href="#" className="text-gray-600 hover:text-emerald-800"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="text-gray-600 hover:text-emerald-800"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="text-gray-600 hover:text-emerald-800"><Github className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
