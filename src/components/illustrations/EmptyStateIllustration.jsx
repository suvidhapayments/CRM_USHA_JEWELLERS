import React from 'react';

export const EmptyStateIllustration = ({ type = 'customers', className = "w-44 h-44" }) => {
  if (type === 'sales') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Background Soft Bubble */}
          <circle cx="100" cy="100" r="85" fill="#F0F5FF" />
          <path d="M 40 145 C 70 125, 130 165, 160 145" stroke="#E0EBFF" strokeWidth="6" strokeLinecap="round" />

          {/* Floating Gold Necklace Box */}
          <g transform="translate(130, 45) rotate(10)">
            <rect x="0" y="0" width="36" height="36" rx="8" fill="#F59E0B" />
            <path d="M 0 16 L 36 16" stroke="#D97706" strokeWidth="2" />
            <circle cx="18" cy="18" r="6" fill="#FCD34D" />
          </g>

          {/* Character */}
          {/* Body */}
          <path d="M 80 120 C 75 100, 115 100, 110 120 L 115 160 L 75 160 Z" fill="#1E65FF" />
          {/* Head & Hair */}
          <circle cx="95" cy="72" r="16" fill="#FDE68A" />
          <path d="M 85 70 C 85 58, 105 55, 108 68 C 102 65, 95 65, 85 70 Z" fill="#78350F" />
          {/* Face */}
          <circle cx="98" cy="73" r="1.5" fill="#070127" />
          <path d="M 94 78 Q 97 81 100 78" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Arms holding digital billing invoice tablet */}
          <path d="M 80 115 L 68 130 L 90 140" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" />
          <path d="M 110 115 L 122 130 L 105 140" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" />

          {/* Digital Tablet / Bill */}
          <rect x="75" y="118" width="45" height="34" rx="6" fill="#FFFFFF" stroke="#070127" strokeWidth="2" transform="rotate(-6 95 130)" />
          <rect x="80" y="124" width="20" height="4" rx="2" fill="#1E65FF" transform="rotate(-6 95 130)" />
          <rect x="80" y="132" width="30" height="3" rx="1.5" fill="#94A3B8" transform="rotate(-6 95 130)" />
          <rect x="80" y="138" width="24" height="3" rx="1.5" fill="#94A3B8" transform="rotate(-6 95 130)" />

          {/* Sparkles */}
          <path d="M 45 65 L 47 58 L 49 65 L 56 67 L 49 69 L 47 76 L 45 69 L 38 67 Z" fill="#F59E0B" />
          <path d="M 145 115 L 147 110 L 149 115 L 154 116 L 149 118 L 147 123 L 145 118 L 140 116 Z" fill="#1E65FF" />
        </svg>
      </div>
    );
  }

  if (type === 'payments') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Background Soft Bubble */}
          <circle cx="100" cy="100" r="85" fill="#F0FDF4" />
          <path d="M 40 145 C 70 125, 130 165, 160 145" stroke="#DCFCE7" strokeWidth="6" strokeLinecap="round" />

          {/* Floating Coins */}
          <circle cx="50" cy="70" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          <text x="50" y="74" textAnchor="middle" fill="#78350F" fontWeight="800" fontSize="10">₹</text>

          <circle cx="155" cy="65" r="18" fill="#10B981" />
          <path d="M 149 65 L 153 69 L 161 61" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Character */}
          {/* Torso: Coral Red Top */}
          <path d="M 80 120 C 75 100, 115 100, 110 120 L 115 160 L 75 160 Z" fill="#EF4444" />
          {/* Head & Hair */}
          <circle cx="95" cy="72" r="16" fill="#FDE68A" />
          <path d="M 83 72 C 83 56, 110 56, 110 72 Z" fill="#0D9488" /> {/* Teal beanie/hat */}
          {/* Face */}
          <circle cx="98" cy="73" r="1.5" fill="#070127" />
          <path d="M 94 78 Q 97 81 100 78" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Arms holding Smartphone with UPI confirmation */}
          <path d="M 80 115 L 75 135 L 90 138" stroke="#FDE68A" strokeWidth="7" strokeLinecap="round" />
          <path d="M 110 115 L 115 135 L 100 138" stroke="#FDE68A" strokeWidth="7" strokeLinecap="round" />

          {/* Smartphone */}
          <rect x="84" y="115" width="24" height="42" rx="5" fill="#070127" stroke="#334155" strokeWidth="1.5" />
          <rect x="86" y="120" width="20" height="32" rx="3" fill="#10B981" />
          <circle cx="96" cy="133" r="6" fill="#FFFFFF" />
          <path d="M 94 133 L 95.5 135 L 98.5 131.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Sparkles */}
          <path d="M 145 125 L 147 118 L 149 125 L 156 127 L 149 129 L 147 136 L 145 129 L 138 127 Z" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // Default: Customers
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Background Soft Bubble */}
        <circle cx="100" cy="100" r="85" fill="#F0F5FF" />
        <path d="M 40 145 C 70 125, 130 165, 160 145" stroke="#E0EBFF" strokeWidth="6" strokeLinecap="round" />

        {/* Floating User Cards */}
        <g transform="translate(30, 50) rotate(-12)">
          <rect x="0" y="0" width="40" height="28" rx="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="12" cy="14" r="6" fill="#1E65FF" />
          <rect x="22" y="10" width="12" height="3" rx="1.5" fill="#94A3B8" />
          <rect x="22" y="15" width="8" height="2.5" rx="1.25" fill="#CBD5E1" />
        </g>

        <g transform="translate(135, 55) rotate(14)">
          <rect x="0" y="0" width="40" height="28" rx="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="12" cy="14" r="6" fill="#10B981" />
          <rect x="22" y="10" width="12" height="3" rx="1.5" fill="#94A3B8" />
          <rect x="22" y="15" width="8" height="2.5" rx="1.25" fill="#CBD5E1" />
        </g>

        {/* Character */}
        {/* Torso: Bright Yellow Top */}
        <path d="M 80 120 C 75 100, 115 100, 110 120 L 115 160 L 75 160 Z" fill="#FBBF24" />
        {/* Head & Hair */}
        <circle cx="95" cy="72" r="16" fill="#FDE68A" />
        <path d="M 82 72 C 82 56, 110 56, 110 72 Z" fill="#78350F" />
        {/* Cheerful Face */}
        <circle cx="98" cy="73" r="1.5" fill="#070127" />
        <path d="M 94 78 Q 97 81 100 78" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="102" cy="77" r="2.5" fill="#F87171" opacity="0.6" />

        {/* Arms holding Customer Ledger Folder */}
        <path d="M 80 115 L 70 135 L 90 140" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" />
        <path d="M 110 115 L 120 135 L 102 140" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" />

        {/* Customer Directory Folder */}
        <rect x="76" y="120" width="42" height="32" rx="6" fill="#1E65FF" />
        <rect x="80" y="126" width="34" height="22" rx="4" fill="#FFFFFF" />
        <circle cx="89" cy="135" r="4" fill="#1E65FF" />
        <rect x="96" y="132" width="14" height="3" rx="1.5" fill="#94A3B8" />
        <rect x="96" y="137" width="10" height="2.5" rx="1.2" fill="#CBD5E1" />

        {/* Sparkles */}
        <path d="M 75 45 L 77 38 L 79 45 L 86 47 L 79 49 L 77 56 L 75 49 L 68 47 Z" fill="#1E65FF" />
        <path d="M 125 40 L 126.5 35 L 128 40 L 133 41.5 L 128 43 L 126.5 48 L 125 43 L 120 41.5 Z" fill="#F59E0B" />
      </svg>
    </div>
  );
};
