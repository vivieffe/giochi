import React from 'react';

interface SantaMoodCounterProps {
  rescuedCount: number;
  total?: number;
  compact?: boolean;
}

function getSantaMoodInfo(count: number) {
  if (count === 0) {
    return {
      label: 'Preoccupato',
      message: 'Oh no! Le mie 9 renne sono scappate. Aiutami a trovarle!',
      bgTint: '#FEE2E2',
      accent: '#DC2626',
    };
  }
  if (count <= 2) {
    return {
      label: 'Speranzoso',
      message: 'Evviva, ne hai già trovata qualcuna! Continuiamo così!',
      bgTint: '#FFEDD5',
      accent: '#EA580C',
    };
  }
  if (count <= 4) {
    return {
      label: 'Incoraggiato',
      message: 'Che bravura! Quasi metà squadra è tornata alla slitta!',
      bgTint: '#FEF3C7',
      accent: '#D97706',
    };
  }
  if (count <= 6) {
    return {
      label: 'Sorridente',
      message: 'Fantastico! Le campane della slitta suonano sempre più forte!',
      bgTint: '#ECFCCB',
      accent: '#65A30D',
    };
  }
  if (count <= 8) {
    return {
      label: 'Felicissimo',
      message:
        count === 8
          ? 'Manca solo una renna! La Vigilia è quasi salva!'
          : 'Mancano pochissime renne! Sei un vero aiutante di Natale!',
      bgTint: '#D1FAE5',
      accent: '#059669',
    };
  }
  return {
    label: 'Al settimo cielo!',
    message: 'Missione compiuta! Tutte e 9 le renne sono pronte a volare!',
    bgTint: '#DCFCE7',
    accent: '#15803D',
  };
}

export const SantaMoodCounter: React.FC<SantaMoodCounterProps> = ({
  rescuedCount,
  total = 9,
  compact = false,
}) => {
  const mood = getSantaMoodInfo(rescuedCount);
  // Smoothly interpolate mouth curve y-control point from sad (+11) to huge smile (-12)
  // count 0 => mouth control offset +10 (frown)
  // count 4 => mouth control offset 0 (neutral/slight smile)
  // count 9 => mouth control offset -12 (big joyful smile)
  const progress = Math.max(0, Math.min(1, rescuedCount / total));
  const mouthCurve = 10 - progress * 22;
  const browTilt = (1 - progress) * 7 - progress * 3; // sad tilted up inside at 0, cheerful raised at 9
  const cheekOpacity = 0.15 + progress * 0.65;
  const showTear = rescuedCount === 0;
  const showOpenSmile = rescuedCount >= 7;
  const showSparkles = rescuedCount >= 7;

  return (
    <div
      className={`flex items-center gap-3.5 rounded-2xl bg-[#FFFDF9] border border-slate-200/90 shadow-md ${
        compact ? 'px-3 py-2' : 'px-4 py-2.5'
      }`}
    >
      {/* Expressive Animated SVG Santa Portrait */}
      <div
        className="relative shrink-0 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200/70 transition-colors duration-300"
        style={{
          width: compact ? 58 : 70,
          height: compact ? 58 : 70,
          backgroundColor: mood.bgTint,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Twinkling celebration stars when nearly done / done */}
          {showSparkles && (
            <g fill="#F59E0B">
              <path d="M16 20 L18 14 L20 20 L26 22 L20 24 L18 30 L16 24 L10 22 Z" />
              <path d="M84 18 L85.5 13 L87 18 L92 19.5 L87 21 L85.5 26 L84 21 L79 19.5 Z" />
            </g>
          )}

          {/* Santa Red Hat */}
          <path
            d="M22 44 C24 20, 46 10, 72 18 C82 21, 86 30, 82 38 L22 44 Z"
            fill="#DC2626"
          />
          {/* Hat Pom-Pom */}
          <circle cx="83" cy="34" r="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Hat Fur Trim */}
          <rect x="19" y="37" width="62" height="12" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />

          {/* Ears */}
          <circle cx="22" cy="58" r="6" fill="#FDBA8C" />
          <circle cx="78" cy="58" r="6" fill="#FDBA8C" />

          {/* Face */}
          <circle cx="50" cy="58" r="26" fill="#FFD4B2" />

          {/* Rosy Cheeks (grow brighter as Santa gets happier) */}
          <ellipse cx="33" cy="61" rx="5.5" ry="3.5" fill="#F43F5E" opacity={cheekOpacity} />
          <ellipse cx="67" cy="61" rx="5.5" ry="3.5" fill="#F43F5E" opacity={cheekOpacity} />

          {/* Big Fluffy White Beard */}
          <path
            d="M23 59 C22 82, 34 94, 50 94 C66 94, 78 82, 77 59 C72 67, 63 68, 50 68 C37 68, 28 67, 23 59 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />

          {/* Eyebrows (dynamic mood tilt) */}
          <path
            d={`M32 ${49 + browTilt * 0.4} Q38 ${45 - browTilt * 0.6} 44 ${49 - browTilt * 0.3}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path
            d={`M56 ${49 - browTilt * 0.3} Q62 ${45 - browTilt * 0.6} 68 ${49 + browTilt * 0.4}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* Eyes: happy arcs at 9/9, bright eyes otherwise */}
          {rescuedCount === 9 ? (
            <g fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round">
              <path d="M35 55 Q39 50 43 55" />
              <path d="M57 55 Q61 50 65 55" />
            </g>
          ) : (
            <g>
              <circle cx="39" cy="54" r="3.2" fill="#1E293B" />
              <circle cx="61" cy="54" r="3.2" fill="#1E293B" />
              <circle cx="40.2" cy="52.8" r="1.1" fill="#FFFFFF" />
              <circle cx="62.2" cy="52.8" r="1.1" fill="#FFFFFF" />
            </g>
          )}

          {/* Little worry tear at 0/9 */}
          {showTear && (
            <path
              d="M32 58 C30 61, 30 64, 32 64 C34 64, 34 61, 32 58 Z"
              fill="#38BDF8"
            />
          )}

          {/* Mustache */}
          <path
            d="M50 63 C43 60, 34 63, 32 68 C39 69, 46 67, 50 65 C54 67, 61 69, 68 68 C66 63, 57 60, 50 63 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />

          {/* Nose */}
          <ellipse cx="50" cy="59" rx="4.8" ry="3.8" fill="#F87171" />

          {/* Dynamic Mouth */}
          {showOpenSmile ? (
            <path
              d="M41 69 Q50 81 59 69 Z"
              fill="#991B1B"
              stroke="#7F1D1D"
              strokeWidth="1.2"
            />
          ) : (
            <path
              d={`M41 72 Q50 ${72 - mouthCurve} 59 72`}
              fill="none"
              stroke="#7F1D1D"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Numeric Counter & Dynamic Santa Mood Message */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className="font-display text-xl sm:text-2xl font-extrabold tabular-nums tracking-tight"
            style={{ color: mood.accent }}
          >
            {rescuedCount}/{total}
          </span>
          <span className="text-xs font-bold text-slate-600">
            Renne salvate <span aria-hidden="true">·</span> Babbo Natale: {mood.label}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-1.5 h-2.5 w-full max-w-[240px] rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.round((rescuedCount / total) * 100)}%`,
              backgroundColor: mood.accent,
            }}
          />
        </div>

        {!compact && (
          <p className="mt-1 text-xs sm:text-sm text-slate-700 font-medium leading-snug line-clamp-2">
            “{mood.message}”
          </p>
        )}
      </div>
    </div>
  );
};
