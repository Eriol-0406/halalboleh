import React from 'react'

interface LogoProps {
  size?: number
  showText?: boolean
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

export default function Logo({ 
  size = 40, 
  showText = true, 
  variant = 'full',
  className = '' 
}: LogoProps) {
  const iconSize = size
  const textSize = size * 0.5

  const IconSVG = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="50%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="shimmer">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Outer decorative ring - Islamic geometric pattern */}
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        opacity="0.4"
        strokeDasharray="2 3"
      />
      
      {/* 8-pointed star background (common in Islamic art) */}
      <g opacity="0.1">
        <path
          d="M24 6 L26.5 19.5 L40 22 L26.5 24.5 L24 38 L21.5 24.5 L8 22 L21.5 19.5 Z"
          fill="url(#logoGradient)"
        />
      </g>

      {/* Main crescent moon - primary Islamic symbol */}
      <g filter="url(#glow)">
        <path
          d="M16 11 A11 11 0 0 1 16 33 A13.5 13.5 0 0 0 16 11 Z"
          fill="url(#logoGradient)"
          opacity="0.9"
        />
        {/* Inner highlight for depth */}
        <path
          d="M17 13 A9 9 0 0 1 17 31 A11 11 0 0 0 17 13 Z"
          fill="url(#shimmer)"
        />
      </g>

      {/* Halal checkmark - certification symbol */}
      <g filter="url(#glow)">
        <path
          d="M13 22 L16.5 26.5 L25 16"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        />
      </g>

      {/* Modern "H" lettermark with Arabic influence */}
      <g transform="translate(28, 12)">
        <text
          x="0"
          y="20"
          fontFamily="'Inter', -apple-system, sans-serif"
          fontWeight="900"
          fontSize="20"
          fill="url(#logoGradient)"
          filter="url(#glow)"
          letterSpacing="-0.5"
        >
          H
        </text>
      </g>

      {/* Small star accent (common in halal symbols) */}
      <g opacity="0.7">
        <path
          d="M37 14 L37.5 15.5 L39 16 L37.5 16.5 L37 18 L36.5 16.5 L35 16 L36.5 15.5 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  )

  const TextContent = () => (
    <div className="flex flex-col">
      <span
        className="font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent"
        style={{ fontSize: `${textSize}px`, lineHeight: 1.2 }}
      >
        Halal-X
      </span>
      <span
        className="text-gray-400 font-medium"
        style={{ fontSize: `${textSize * 0.4}px`, lineHeight: 1 }}
      >
        AI Halal Assistant
      </span>
    </div>
  )

  if (variant === 'icon') {
    return (
      <div className={className}>
        <IconSVG />
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        <TextContent />
      </div>
    )
  }

  // Full variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconSVG />
      {showText && <TextContent />}
    </div>
  )
}
