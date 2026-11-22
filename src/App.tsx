import React, { useEffect, useState } from 'react';
import {
  Check,
  Code2,
  Music,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DifficultyLevel, REINDEER_LIST, ReindeerInfo } from './data/reindeerData';
import { SantaMoodCounter } from './components/SantaMoodCounter';
import { ReindeerAvatar } from './components/ReindeerAvatar';
import { ChallengeView } from './components/challenges/ChallengeView';
import { ExportModal } from './components/ExportModal';
import { CHRISTMAS_TRACKS, MusicTrackId, sound } from './utils/sound';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'VICTORY';

const TITLE_ART_URL = './src/assets/images/north_pole_title_art_1795366413847.jpg';
const MAP_ART_URL = './src/assets/images/north_pole_map_backdrop_1795366415007.jpg';

const SNOWFLAKES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  left: `${(i * 37) % 97}%`,
  duration: `${9 + (i % 5) * 2.2}s`,
  delay: `${-(i * 0.9)}s`,
  size: `${11 + (i % 3) * 4}px`,
}));

const STORAGE_KEY = 'missione_9_renne_session_v1';

interface SavedSession {
  gameState: GameState;
  difficulty: DifficultyLevel;
  rescuedIds: string[];
}

function readSavedSession(): SavedSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedSession>;
    if (
      (parsed.gameState === 'TITLE_MENU' ||
        parsed.gameState === 'PLAYING' ||
        parsed.gameState === 'VICTORY') &&
      (parsed.difficulty === 'easy' || parsed.difficulty === 'hard') &&
      Array.isArray(parsed.rescuedIds)
    ) {
      return {
        gameState: parsed.gameState,
        difficulty: parsed.difficulty,
        rescuedIds: parsed.rescuedIds,
      };
    }
  } catch {
    // Ignore storage access errors in restricted iframes
  }
  return null;
}

export default function App() {
  const initial = readSavedSession();
  const [gameState, setGameState] = useState<GameState>(initial?.gameState ?? 'TITLE_MENU');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initial?.difficulty ?? 'easy');
  const [rescuedIds, setRescuedIds] = useState<Set<string>>(
    () => new Set(initial?.rescuedIds ?? [])
  );
  const [activeReindeer, setActiveReindeer] = useState<ReindeerInfo | null>(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [trackId, setTrackId] = useState<MusicTrackId>('jingle_bells');
  const [showExportModal, setShowExportModal] = useState(false);
  const [titleImgFailed, setTitleImgFailed] = useState(false);
  const [mapImgFailed, setMapImgFailed] = useState(false);

  const rescuedCount = rescuedIds.size;

  useEffect(() => {
    try {
      const payload: SavedSession = {
        gameState,
        difficulty,
        rescuedIds: Array.from(rescuedIds),
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  }, [gameState, difficulty, rescuedIds]);

  const startGame = () => {
    sound.tap();
    if (!musicMuted) {
      sound.startMusic();
    }
    setGameState('PLAYING');
  };

  const handleRestart = () => {
    sound.tap();
    setRescuedIds(new Set());
    setActiveReindeer(null);
    setGameState('PLAYING');
  };

  const handleDifficultySwitch = (nextDiff: DifficultyLevel) => {
    if (nextDiff === difficulty) return;
    sound.tap();
    setDifficulty(nextDiff);
    setRescuedIds(new Set());
    setActiveReindeer(null);
    if (gameState === 'VICTORY') {
      setGameState('PLAYING');
    }
  };

  const toggleMusicMute = () => {
    const next = !musicMuted;
    setMusicMuted(next);
    sound.setMusicMuted(next);
    if (!next) sound.tap();
  };

  const toggleSfxMute = () => {
    const next = !sfxMuted;
    sound.sfxMuted = next;
    setSfxMuted(next);
    if (!next) sound.tap();
  };

  const handleTrackChange = (nextTrack: MusicTrackId) => {
    sound.tap();
    setTrackId(nextTrack);
    sound.setTrack(nextTrack);
  };

  const handleReindeerRescued = (reindeerId: string) => {
    const next = new Set(rescuedIds);
    next.add(reindeerId);
    setRescuedIds(next);
    setActiveReindeer(null);

    if (next.size === REINDEER_LIST.length) {
      sound.victory();
      setGameState('VICTORY');
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'TITLE_MENU' && (e.key === 'Enter' || e.key === ' ')) {
        if (!showExportModal) {
          e.preventDefault();
          startGame();
        }
      } else if (e.key === 'Escape') {
        if (showExportModal) setShowExportModal(false);
        else if (activeReindeer) setActiveReindeer(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, activeReindeer, showExportModal, musicMuted]);

  useEffect(() => {
    return () => {
      sound.stopMusic();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0F2439] text-slate-900 overflow-x-hidden">
      {/* Ambient Snowfall */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-10" aria-hidden="true">
        {SNOWFLAKES.map((flake) => (
          <span
            key={flake.id}
            className="snowflake text-white/60 select-none"
            style={{
              left: flake.left,
              fontSize: flake.size,
              animationDuration: flake.duration,
              animationDelay: flake.delay,
            }}
          >
            ❄
          </span>
        ))}
      </div>

      {/* =================================================================== */}
      {/* 1. TITLE SCREEN                                                     */}
      {/* =================================================================== */}
      {gameState === 'TITLE_MENU' && (
        <main className="relative z-20 min-h-screen flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0B1D33] via-[#153657] to-[#0F2439]">
            {!titleImgFailed && (
              <img
                src={TITLE_ART_URL}
                alt="Villaggio di Babbo Natale al Polo Nord sotto l'aurora boreale"
                referrerPolicy="no-referrer"
                onError={() => setTitleImgFailed(true)}
                className="w-full h-full object-cover opacity-85"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#091829]/95 via-[#091829]/80 to-[#091829]/30" />
          </div>

          <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            <div className="lg:col-span-7 space-y-5 text-white max-w-xl">
              <div className="inline-flex items-center gap-3">
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <circle cx="24" cy="24" r="22" fill="#DC2626" stroke="#FCD34D" strokeWidth="2.5" />
                  <path
                    d="M24 10 L27 19 L36 19 L29 24 L32 33 L24 27 L16 33 L19 24 L12 19 L21 19 Z"
                    fill="#FDE047"
                  />
                </svg>
                <span className="text-sm font-bold text-amber-300 tracking-wide">
                  Avventura di Natale <span aria-hidden="true">·</span> Bambini 6–10 anni
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-balance">
                La Grande Missione delle 9 Renne
              </h1>

              <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium">
                È la Vigilia di Natale e tutte e 9 le renne di Babbo Natale sono scappate nel
                villaggio innevato! Scegli il tuo livello, esplora la mappa e risolvi i 9 enigmi
                con il tasto <strong>Indizio</strong>.
              </p>

              {/* Two-Level Difficulty Selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-200">Scegli il livello di difficoltà:</div>
                <div
                  role="group"
                  aria-label="Livello di difficoltà"
                  className="inline-flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => {
                      sound.tap();
                      setDifficulty('easy');
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap min-h-[44px] ${
                      difficulty === 'easy'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Facile · 6–7 anni
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.tap();
                      setDifficulty('hard');
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap min-h-[44px] ${
                      difficulty === 'hard'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Difficile · 8–10 anni
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] px-7 py-4 text-lg font-extrabold text-white shadow-lg shadow-red-950/50 transition-all cursor-pointer min-h-[54px] whitespace-nowrap shrink-0"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Inizia la Missione</span>
                </button>

                <button
                  type="button"
                  onClick={toggleMusicMute}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/12 hover:bg-white/20 border border-white/25 px-4 py-4 text-sm font-bold text-white transition-colors cursor-pointer min-h-[54px] whitespace-nowrap shrink-0"
                >
                  <Music className={`w-4 h-4 ${musicMuted ? 'text-rose-300' : 'text-emerald-300'}`} />
                  <span>{musicMuted ? 'Musica esclusa' : 'Musica inclusa'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.tap();
                    setShowExportModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/12 hover:bg-white/20 border border-white/25 px-4 py-4 text-sm font-bold text-white transition-colors cursor-pointer min-h-[54px] whitespace-nowrap shrink-0"
                >
                  <Code2 className="w-4 h-4 text-amber-300" />
                  <span>Google Sites / HTML Unico</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                4 brani natalizi inclusi <span aria-hidden="true">·</span> Livello Facile e Difficile{' '}
                <span aria-hidden="true">·</span> Premi Invio per iniziare
              </p>
            </div>
          </div>
        </main>
      )}

      {/* =================================================================== */}
      {/* 2. ACTIVE MAP GAMEPLAY                                              */}
      {/* =================================================================== */}
      {gameState !== 'TITLE_MENU' && (
        <div className="relative z-20 min-h-screen flex flex-col justify-between p-3 sm:p-5 max-w-[1400px] mx-auto gap-3">
          {/* Perimeter HUD */}
          <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex-1 max-w-xl">
              <SantaMoodCounter rescuedCount={rescuedCount} total={REINDEER_LIST.length} />
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Difficulty Switch */}
              <div
                role="group"
                aria-label="Cambia livello"
                className="inline-flex items-center p-1 rounded-xl bg-white/10 border border-white/20 min-h-[44px]"
              >
                <button
                  type="button"
                  onClick={() => handleDifficultySwitch('easy')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                    difficulty === 'easy'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Facile
                </button>
                <button
                  type="button"
                  onClick={() => handleDifficultySwitch('hard')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                    difficulty === 'hard'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Difficile
                </button>
              </div>

              {/* Christmas Carol Track Selector */}
              <label className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-xs font-bold text-white min-h-[44px]">
                <Music className="w-4 h-4 text-amber-300 shrink-0" />
                <select
                  aria-label="Scegli canzone natalizia"
                  value={trackId}
                  onChange={(e) => handleTrackChange(e.target.value as MusicTrackId)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
                >
                  {CHRISTMAS_TRACKS.map((t) => (
                    <option key={t.id} value={t.id} className="text-slate-900 bg-white">
                      {t.title}
                    </option>
                  ))}
                </select>
              </label>

              {/* Explicit Music Exclude/Include Button */}
              <button
                type="button"
                onClick={toggleMusicMute}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0 ${
                  musicMuted
                    ? 'bg-rose-950/60 border-rose-400/50 text-rose-200 hover:bg-rose-900/70'
                    : 'bg-emerald-950/50 border-emerald-400/50 text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <Music className="w-4 h-4 shrink-0" />
                <span>{musicMuted ? 'Attiva musica' : 'Escludi musica'}</span>
              </button>

              {/* SFX Mute Toggle */}
              <button
                type="button"
                onClick={toggleSfxMute}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
              >
                {sfxMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                )}
                <span>{sfxMuted ? 'Effetti OFF' : 'Effetti ON'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.tap();
                  setShowExportModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
              >
                <Code2 className="w-4 h-4 text-amber-300" />
                <span>Google Sites</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ricomincia</span>
              </button>
            </div>
          </header>

          {/* Interactive North Pole Map Playfield */}
          <main className="relative flex-1 flex items-center justify-center">
            <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[71vh] rounded-3xl overflow-hidden border-2 border-amber-200/40 shadow-2xl bg-gradient-to-b from-[#102A43] via-[#1D4E78] to-[#E2E8F0]">
              {!mapImgFailed && (
                <img
                  src={MAP_ART_URL}
                  alt="Mappa interattiva del Villaggio di Babbo Natale al Polo Nord"
                  referrerPolicy="no-referrer"
                  onError={() => setMapImgFailed(true)}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              )}

              {REINDEER_LIST.map((reindeer) => {
                const isRescued = rescuedIds.has(reindeer.id);
                return (
                  <button
                    key={reindeer.id}
                    type="button"
                    onClick={() => {
                      sound.tap();
                      setActiveReindeer(reindeer);
                    }}
                    style={{
                      left: `${reindeer.mapX}%`,
                      top: `${reindeer.mapY}%`,
                    }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-2xl transition-transform duration-150 hover:scale-108 hover:z-20 z-10"
                    aria-label={`${reindeer.englishName} (${reindeer.italianName}) - ${reindeer.locationName} - ${
                      isRescued ? 'Già salvata' : 'Da trovare'
                    }`}
                  >
                    <div
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-[3px] shadow-lg flex items-center justify-center transition-colors ${
                        isRescued
                          ? 'bg-emerald-50 border-emerald-500'
                          : reindeer.isFinale
                          ? 'bg-rose-50 border-red-600 animate-float-slow'
                          : 'bg-[#FFFDF9] border-amber-400 animate-float-slow'
                      }`}
                    >
                      <ReindeerAvatar id={reindeer.id} size={42} rescued={isRescued} />

                      <span
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-white shadow-xs tabular-nums ${
                          isRescued
                            ? 'bg-emerald-600'
                            : reindeer.isFinale
                            ? 'bg-red-600'
                            : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {isRescued ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : reindeer.order}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-extrabold whitespace-nowrap shadow-sm transition-colors ${
                        isRescued
                          ? 'bg-emerald-800/95 text-white'
                          : reindeer.isFinale
                          ? 'bg-red-700/95 text-white'
                          : 'bg-slate-900/90 text-white group-hover:bg-amber-400 group-hover:text-slate-950'
                      }`}
                    >
                      {reindeer.englishName} ({reindeer.italianName})
                    </span>
                  </button>
                );
              })}
            </div>
          </main>

          {/* Bottom Accessible Reindeer Roster Strip */}
          <nav
            aria-label="Tutte le 9 renne"
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
          >
            {REINDEER_LIST.map((r) => {
              const isRescued = rescuedIds.has(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    sound.tap();
                    setActiveReindeer(r);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap shrink-0 ${
                    isRescued
                      ? 'bg-emerald-800/90 border-emerald-400 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-100'
                  }`}
                >
                  <span className="tabular-nums">{isRescued ? '✓' : `${r.order}.`}</span>
                  <span>
                    {r.englishName} ({r.italianName})
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. ACTIVE CHALLENGE MODAL                                           */}
      {/* =================================================================== */}
      {activeReindeer && (
        <ChallengeView
          reindeer={activeReindeer}
          difficulty={difficulty}
          alreadyRescued={rescuedIds.has(activeReindeer.id)}
          onSuccess={() => handleReindeerRescued(activeReindeer.id)}
          onClose={() => setActiveReindeer(null)}
        />
      )}

      {/* =================================================================== */}
      {/* 4. VICTORY MODAL                                                    */}
      {/* =================================================================== */}
      {gameState === 'VICTORY' && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-2xl p-6 sm:p-8 text-center space-y-5 animate-celebrate-pop my-auto">
            <div className="flex justify-center">
              <SantaMoodCounter rescuedCount={9} total={9} compact />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-700">
                <Sparkles className="w-4 h-4" />
                <span>
                  Vigilia di Natale Salva · Livello{' '}
                  {difficulty === 'hard' ? 'Difficile (8–10 anni)' : 'Facile (6–7 anni)'}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                Evviva! Tutte e 9 le Renne sono Tornate!
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Bravissimo! Hai aiutato Babbo Natale a ritrovare Dasher, Dancer, Prancer, Vixen,
                Comet, Cupid, Donner, Blitzen e Rudolph. La slitta è pronta a volare nella notte!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {REINDEER_LIST.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-emerald-50 border border-emerald-200 p-2 flex flex-col items-center gap-1"
                >
                  <ReindeerAvatar id={r.id} size={36} rescued />
                  <span className="text-[11px] font-extrabold text-emerald-950 leading-tight">
                    {r.englishName}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-500 px-6 py-3.5 text-base font-extrabold text-white shadow-md cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Gioca di Nuovo</span>
              </button>

              {difficulty === 'easy' && (
                <button
                  type="button"
                  onClick={() => handleDifficultySwitch('hard')}
                  className="inline-flex items-center justify-center rounded-2xl bg-amber-400 hover:bg-amber-300 px-5 py-3.5 text-sm font-extrabold text-slate-950 cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  Prova Livello Difficile!
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.tap();
                  setGameState('PLAYING');
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 px-5 py-3.5 text-sm font-bold text-slate-800 cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                Torna alla Mappa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. EXPORT / GOOGLE SITES MODAL                                      */}
      {/* =================================================================== */}
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
}
