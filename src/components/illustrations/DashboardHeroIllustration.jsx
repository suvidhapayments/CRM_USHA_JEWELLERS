import React from 'react';

export const DashboardHeroIllustration = ({ className = "w-full max-w-[420px] h-auto" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 520 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0F5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E2ECFF" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="screenBeam" x1="280" y1="180" x2="280" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E65FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#070127" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Background Organic Floating Ribbon / Cloud Wave */}
        <path
          d="M 40 230 C 100 210, 160 250, 240 240 C 320 230, 390 260, 480 230 C 510 220, 520 245, 490 260 C 420 280, 280 275, 180 270 C 90 265, 20 255, 40 230 Z"
          fill="url(#cloudGrad)"
        />

        {/* Laptop Screen Light Beam */}
        <polygon
          points="255,185 305,185 365,70 195,70"
          fill="url(#screenBeam)"
        />

        {/* Floating Mini Widget 1: Live Sales Stat Card */}
        <g filter="url(#softShadow)">
          <rect x="50" y="55" width="130" height="75" rx="14" fill="url(#cardGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Header pill */}
          <rect x="62" y="68" width="45" height="7" rx="3.5" fill="#1E65FF" />
          <text x="62" y="93" fill="#070127" fontFamily="sans-serif" fontWeight="800" fontSize="13">₹3,45,000</text>
          <text x="62" y="112" fill="#10B981" fontFamily="sans-serif" fontWeight="700" fontSize="9">▲ +18.4% Today</text>
          
          {/* Mini Sparkline Bar Chart */}
          <rect x="145" y="95" width="4" height="20" rx="2" fill="#E2E8F0" />
          <rect x="153" y="85" width="4" height="30" rx="2" fill="#93C5FD" />
          <rect x="161" y="75" width="4" height="40" rx="2" fill="#1E65FF" />
        </g>

        {/* Floating Mini Widget 2: 916 Hallmark Gold Coin */}
        <g filter="url(#softShadow)">
          <circle cx="430" cy="80" r="28" fill="url(#goldCoinGrad)" stroke="#FBBF24" strokeWidth="2" />
          <circle cx="430" cy="80" r="22" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="430" y="84" textAnchor="middle" fill="#78350F" fontFamily="sans-serif" fontWeight="800" fontSize="11">916</text>
          <text x="430" y="94" textAnchor="middle" fill="#92400E" fontFamily="sans-serif" fontWeight="700" fontSize="7">GOLD</text>
        </g>

        {/* Floating Mini Widget 3: Instant Invoice Pill */}
        <g filter="url(#softShadow)">
          <rect x="375" y="130" width="115" height="36" rx="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="393" cy="148" r="9" fill="#10B981" />
          <path d="M 390 148 L 392 150 L 396 146" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="408" y="152" fill="#070127" fontFamily="sans-serif" fontWeight="700" fontSize="10">Invoice Paid</text>
        </g>

        {/* Character Illustration (Lively, Colorful Modern SaaS Style) */}
        <g id="character">
          {/* Legs & Shoes */}
          {/* Left Leg */}
          <path
            d="M 230 195 C 200 205, 175 220, 160 235 C 150 245, 130 250, 115 248"
            stroke="#EF4444"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Left Sneaker (Teal/White) */}
          <ellipse cx="108" cy="252" rx="14" ry="7" fill="#0D9488" />
          <ellipse cx="112" cy="255" rx="12" ry="3" fill="#FFFFFF" />

          {/* Right Leg (Crossed comfortably) */}
          <path
            d="M 245 195 C 270 215, 310 225, 350 230 C 375 233, 395 230, 410 225"
            stroke="#DC2626"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Right Sneaker */}
          <ellipse cx="420" cy="226" rx="14" ry="7" fill="#0D9488" transform="rotate(-10 420 226)" />
          <ellipse cx="422" cy="229" rx="12" ry="3" fill="#FFFFFF" transform="rotate(-10 420 226)" />

          {/* Torso: Bright Sunny Yellow Hoodie */}
          <path
            d="M 235 150 C 230 135, 240 120, 265 118 C 290 118, 305 130, 300 150 C 295 180, 280 200, 240 195 Z"
            fill="#FBBF24"
          />
          {/* Hoodie pocket */}
          <path d="M 250 170 C 265 175, 275 175, 285 170" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

          {/* Arms & Hands */}
          {/* Left Arm holding laptop */}
          <path
            d="M 245 140 C 235 155, 235 175, 260 185"
            stroke="#F59E0B"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Right Arm typing */}
          <path
            d="M 290 140 C 305 155, 305 175, 285 186"
            stroke="#D97706"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Hands */}
          <circle cx="262" cy="186" r="6" fill="#FCD34D" />
          <circle cx="283" cy="187" r="6" fill="#FCD34D" />

          {/* Sleek Laptop (Teal/Silver with glowing back logo) */}
          <path d="M 252 186 L 295 186 L 302 192 L 245 192 Z" fill="#0F172A" />
          <rect x="256" y="162" width="36" height="24" rx="3" fill="#1E293B" transform="skewX(-4)" />
          <rect x="258" y="164" width="32" height="20" rx="2" fill="#38BDF8" transform="skewX(-4)" />
          {/* Laptop logo */}
          <circle cx="274" cy="174" r="2.5" fill="#FFFFFF" />

          {/* Head & Neck */}
          <rect x="264" y="105" width="12" height="15" rx="4" fill="#FDE68A" />
          {/* Face */}
          <circle cx="270" cy="100" r="16" fill="#FDE68A" />
          {/* Cheerful face features */}
          <path d="M 271 103 Q 275 107 279 103" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <ellipse cx="277" cy="97" rx="1.5" ry="2" fill="#070127" />
          <circle cx="281" cy="102" r="3" fill="#F87171" opacity="0.6" /> {/* Cheek blush */}

          {/* Hair: Trendy wavy dark auburn hair */}
          <path
            d="M 258 98 C 255 85, 268 76, 282 80 C 290 82, 292 92, 286 102 C 280 95, 275 92, 268 95 Z"
            fill="#78350F"
          />

          {/* Modern Headphones (Teal & Electric Blue) */}
          <path d="M 258 97 C 256 80, 284 80, 285 97" stroke="#1E65FF" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="254" y="93" width="6" height="12" rx="3" fill="#0D9488" />
          <rect x="282" y="93" width="6" height="12" rx="3" fill="#0D9488" />
        </g>

        {/* Decorative Floating Sparkles, Notes and Shapes */}
        {/* Sparkle 1 */}
        <path d="M 215 50 L 218 40 L 221 50 L 231 53 L 221 56 L 218 66 L 215 56 L 205 53 Z" fill="#F59E0B" />
        {/* Sparkle 2 */}
        <path d="M 345 35 L 347 28 L 349 35 L 356 37 L 349 39 L 347 46 L 345 39 L 338 37 Z" fill="#1E65FF" />
        {/* Diamond 3 */}
        <path d="M 470 190 L 477 180 L 484 190 L 477 200 Z" fill="#38BDF8" />
        {/* Mini Music / Note */}
        <circle cx="315" cy="85" r="3" fill="#1E65FF" />
        <path d="M 318 85 L 318 72 L 328 75 L 328 88" stroke="#1E65FF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="325" cy="88" r="3" fill="#1E65FF" />
      </svg>
    </div>
  );
};
