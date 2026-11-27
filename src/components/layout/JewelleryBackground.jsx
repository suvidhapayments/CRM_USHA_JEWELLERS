import React from 'react';

export const JewelleryBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Large Subtle Luxury Mandala / Filigree Watermark in Background */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.035] animate-spin-very-slow text-amber-600"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="200" cy="200" r="50" stroke="currentColor" strokeWidth="1" />
        {/* Diamond rosette petals */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            <path d="M 200 50 Q 230 120 200 200 Q 170 120 200 50 Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <polygon points="200,30 207,45 200,60 193,45" fill="currentColor" opacity="0.4" />
          </g>
        ))}
      </svg>

      {/* 2. Floating Artifact: Brilliant Cut Diamond (Top Left) */}
      <div className="absolute top-16 left-8 sm:left-24 animate-float-slow opacity-60">
        <svg width="68" height="60" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="diaGrad1" x1="0" y1="0" x2="68" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E65FF" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Table & Crown Facets */}
          <polygon points="17,6 51,6 62,24 6,24" fill="url(#diaGrad1)" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.5" />
          <polygon points="25,6 43,6 48,24 20,24" fill="#FFFFFF" fillOpacity="0.4" />
          {/* Pavilion & Culet */}
          <polygon points="6,24 62,24 34,54" fill="url(#diaGrad1)" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.5" />
          <polygon points="20,24 48,24 34,54" fill="#FFFFFF" fillOpacity="0.25" stroke="#93C5FD" strokeWidth="0.75" />
          <line x1="17" y1="6" x2="20" y2="24" stroke="#93C5FD" strokeWidth="0.75" strokeOpacity="0.7" />
          <line x1="51" y1="6" x2="48" y2="24" stroke="#93C5FD" strokeWidth="0.75" strokeOpacity="0.7" />
        </svg>
      </div>

      {/* 3. Floating Artifact: Solitaire Diamond Ring (Top Right) */}
      <div className="absolute top-28 right-12 sm:right-32 animate-float-reverse opacity-55">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ringGold" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Circular Band */}
          <circle cx="32" cy="38" r="18" stroke="url(#ringGold)" strokeWidth="4.5" strokeOpacity="0.6" fill="none" />
          <circle cx="32" cy="38" r="18" stroke="#FEF3C7" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
          {/* Prong Crown & Gemstone */}
          <polygon points="27,15 37,15 41,23 23,23" fill="#60A5FA" fillOpacity="0.5" stroke="#1E65FF" strokeWidth="1" strokeOpacity="0.6" />
          <polygon points="23,23 41,23 32,10" fill="#93C5FD" fillOpacity="0.6" />
          {/* Diamond Sparkle Glint */}
          <circle cx="32" cy="14" r="2.5" fill="#FFFFFF" />
          <path d="M 32 8 L 32 20 M 26 14 L 38 14" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* 4. Floating Artifact: 999.9 Gold Bullion Ingot (Middle Right) */}
      <div className="absolute top-1/2 right-6 sm:right-16 -translate-y-12 animate-float-delayed opacity-50">
        <svg width="76" height="52" viewBox="0 0 76 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ingotGrad" x1="0" y1="0" x2="76" y2="52">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Ingot 3D trapezoid body */}
          <polygon points="12,8 64,8 72,42 4,42" fill="url(#ingotGrad)" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.8" />
          <polygon points="16,13 60,13 65,37 11,37" fill="#FEF3C7" fillOpacity="0.3" stroke="#FCD34D" strokeWidth="0.75" />
          {/* Ingot Hallmark Stamps */}
          <text x="38" y="24" textAnchor="middle" fill="#78350F" opacity="0.75" fontFamily="monospace" fontWeight="900" fontSize="7" letterSpacing="1">
            999.9
          </text>
          <text x="38" y="32" textAnchor="middle" fill="#92400E" opacity="0.65" fontFamily="sans-serif" fontWeight="700" fontSize="5" letterSpacing="1">
            FINE GOLD
          </text>
        </svg>
      </div>

      {/* 5. Floating Artifact: BIS 916 Hallmark Triangular Seal (Bottom Left) */}
      <div className="absolute bottom-28 left-8 sm:left-28 animate-float-reverse opacity-55">
        <svg width="60" height="56" viewBox="0 0 60 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bisGrad" x1="0" y1="0" x2="60" y2="56">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Triangular Hallmark Emblem */}
          <polygon points="30,6 56,48 4,48" stroke="url(#bisGrad)" strokeWidth="3" strokeOpacity="0.7" fill="#FEF3C7" fillOpacity="0.25" strokeLinejoin="round" />
          <polygon points="30,14 48,44 12,44" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinejoin="round" />
          {/* Purity Text */}
          <text x="30" y="33" textAnchor="middle" fill="#78350F" opacity="0.8" fontFamily="sans-serif" fontWeight="900" fontSize="9">
            916
          </text>
          <text x="30" y="41" textAnchor="middle" fill="#B45309" opacity="0.7" fontFamily="sans-serif" fontWeight="800" fontSize="5" letterSpacing="0.5">
            BIS
          </text>
        </svg>
      </div>

      {/* 6. Floating Artifact: Royal Indian Jhumka / Filigree Pendant (Bottom Right) */}
      <div className="absolute bottom-16 right-10 sm:right-28 animate-float-slow opacity-50">
        <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="jhumkaGold" x1="0" y1="0" x2="56" y2="72">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Top Stud */}
          <circle cx="28" cy="10" r="6" fill="url(#jhumkaGold)" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="28" cy="10" r="3" fill="#FFFFFF" fillOpacity="0.7" />
          <line x1="28" y1="16" x2="28" y2="24" stroke="#D97706" strokeWidth="1.5" />
          {/* Bell Dome (Jhumka) */}
          <path d="M 12 40 C 12 24, 44 24, 44 40 Z" fill="url(#jhumkaGold)" fillOpacity="0.5" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="10" y1="40" x2="46" y2="40" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          {/* Hanging Gold Beads / Ghungroo */}
          <circle cx="16" cy="48" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
          <line x1="16" y1="40" x2="16" y2="46" stroke="#D97706" strokeWidth="1" />
          <circle cx="24" cy="51" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
          <line x1="24" y1="40" x2="24" y2="49" stroke="#D97706" strokeWidth="1" />
          <circle cx="32" cy="51" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
          <line x1="32" y1="40" x2="32" y2="49" stroke="#D97706" strokeWidth="1" />
          <circle cx="40" cy="48" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
          <line x1="40" y1="40" x2="40" y2="46" stroke="#D97706" strokeWidth="1" />
        </svg>
      </div>

      {/* 7. Floating Artifact: Classic Gold Bangle / Kada (Middle Left) */}
      <div className="absolute top-1/2 left-6 sm:left-14 -translate-y-24 animate-float-delayed opacity-45">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="30" rx="24" ry="16" stroke="#F59E0B" strokeWidth="4" strokeOpacity="0.5" fill="none" transform="rotate(-25 30 30)" />
          <ellipse cx="30" cy="30" rx="24" ry="16" stroke="#FEF3C7" strokeWidth="1.5" strokeOpacity="0.75" fill="none" transform="rotate(-25 30 30)" />
          {/* Engraved beads on bangle */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle
              key={deg}
              cx={30 + 22 * Math.cos((deg * Math.PI) / 180)}
              cy={30 + 14 * Math.sin((deg * Math.PI) / 180)}
              r="2"
              fill="#D97706"
              opacity="0.6"
            />
          ))}
        </svg>
      </div>

      {/* 8. Luxury Diamond Twinkling Glints & Gold Stars (Scattered Ambient Sparkles) */}
      {/* Star 1 - Near Top Center */}
      <div className="absolute top-20 left-1/3 animate-pulse-glow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 12 0 L 14 9 L 23 12 L 14 15 L 12 24 L 10 15 L 1 12 L 10 9 Z" fill="#F59E0B" fillOpacity="0.5" />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Star 2 - Near Header Center */}
      <div className="absolute top-36 right-1/4 animate-pulse-glow" style={{ animationDelay: '2s' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 14 0 L 16 11 L 28 14 L 16 17 L 14 28 L 12 17 L 0 14 L 12 11 Z" fill="#1E65FF" fillOpacity="0.4" />
          <circle cx="14" cy="14" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Star 3 - Lower Middle */}
      <div className="absolute bottom-40 left-1/2 -translate-x-32 animate-pulse-glow" style={{ animationDelay: '3.5s' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 10 0 L 12 7 L 20 10 L 12 13 L 10 20 L 8 13 L 0 10 L 8 7 Z" fill="#FBBF24" fillOpacity="0.6" />
          <circle cx="10" cy="10" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Star 4 - Bottom Left Center */}
      <div className="absolute bottom-24 right-1/3 animate-pulse-glow" style={{ animationDelay: '1.2s' }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 11 0 L 13 8 L 22 11 L 13 14 L 11 22 L 9 14 L 0 11 L 9 8 Z" fill="#38BDF8" fillOpacity="0.5" />
          <circle cx="11" cy="11" r="2" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
};
