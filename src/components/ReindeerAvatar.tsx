import React from 'react';

interface ReindeerAvatarProps {
  id: string;
  size?: number;
  rescued?: boolean;
}

export const ReindeerAvatar: React.FC<ReindeerAvatarProps> = ({
  id,
  size = 56,
  rescued = false,
}) => {
  const isRudolph = id === 'rudolph';

  // Unique little collar/scarf accent per reindeer
  const scarfColors: Record<string, string> = {
    dasher: '#2563EB',
    dancer: '#DB2777',
    prancer: '#059669',
    vixen: '#D97706',
    comet: '#7C3AED',
    cupid: '#E11D48',
    donner: '#0284C7',
    blitzen: '#EAB308',
    rudolph: '#DC2626',
  };
  const accent = scarfColors[id] || '#DC2626';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Antlers */}
      <g stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M27 25 L20 10 M23 18 L15 17 M25 14 L29 9" />
        <path d="M53 25 L60 10 M57 18 L65 17 M55 14 L51 9" />
      </g>

      {/* Ears */}
      <ellipse cx="19" cy="33" rx="7" ry="4" transform="rotate(-20 19 33)" fill="#A16207" />
      <ellipse cx="61" cy="33" rx="7" ry="4" transform="rotate(20 61 33)" fill="#A16207" />
      <ellipse cx="19" cy="33" rx="4" ry="2" transform="rotate(-20 19 33)" fill="#FDE68A" />
      <ellipse cx="61" cy="33" rx="4" ry="2" transform="rotate(20 61 33)" fill="#FDE68A" />

      {/* Festive Collar */}
      <path d="M22 60 Q40 69 58 60 L54 71 Q40 77 26 71 Z" fill={accent} />
      <circle cx="40" cy="67" r="3.5" fill="#FBBF24" />

      {/* Head */}
      <ellipse cx="40" cy="43" rx="20" ry="21" fill="#B45309" />
      {/* Tan muzzle */}
      <ellipse cx="40" cy="51" rx="13" ry="10" fill="#FDE68A" />

      {/* Eyes */}
      {rescued ? (
        <g fill="none" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round">
          <path d="M29 38 Q32 34 35 38" />
          <path d="M45 38 Q48 34 51 38" />
        </g>
      ) : (
        <g>
          <circle cx="32" cy="38" r="3" fill="#1E293B" />
          <circle cx="48" cy="38" r="3" fill="#1E293B" />
          <circle cx="33" cy="37" r="1" fill="#FFFFFF" />
          <circle cx="49" cy="37" r="1" fill="#FFFFFF" />
        </g>
      )}

      {/* Nose (Glowing red for Rudolph!) */}
      {isRudolph ? (
        <g>
          <circle cx="40" cy="48" r="8" fill="#EF4444" opacity="0.28" />
          <circle cx="40" cy="48" r="5.2" fill="#DC2626" />
          <circle cx="38.5" cy="46.5" r="1.5" fill="#FCA5A5" />
        </g>
      ) : (
        <ellipse cx="40" cy="48" rx="4.5" ry="3.5" fill="#451A03" />
      )}

      {/* Smile */}
      <path
        d={rescued ? 'M34 54 Q40 59 46 54' : 'M36 55 Q40 57 44 55'}
        fill="none"
        stroke="#78350F"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
