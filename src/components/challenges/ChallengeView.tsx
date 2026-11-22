import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Lightbulb,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowLeft,
  Play,
  Trash2,
} from 'lucide-react';
import { DifficultyLevel, ReindeerInfo } from '../../data/reindeerData';
import { ReindeerAvatar } from '../ReindeerAvatar';
import { sound } from '../../utils/sound';

interface ChallengeViewProps {
  reindeer: ReindeerInfo;
  difficulty: DifficultyLevel;
  alreadyRescued: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  reindeer,
  difficulty,
  alreadyRescued,
  onSuccess,
  onClose,
}) => {
  const [hintUsed, setHintUsed] = useState(false);
  const [hintTick, setHintTick] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'info' | 'success'; text: string } | null>(
    null
  );
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    if (solved) return;
    setSolved(true);
    sound.rescued();
    setFeedback({
      type: 'success',
      text: `Evviva! Hai salvato ${reindeer.englishName} (${reindeer.italianName})!`,
    });
    setTimeout(() => {
      onSuccess();
    }, 1100);
  };

  const triggerHint = () => {
    sound.hint();
    setHintUsed(true);
    setHintTick((t) => t + 1);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FFFDF9] border border-amber-200/80 shadow-2xl overflow-hidden my-auto">
        {/* Top Challenge Header */}
        <div
          className="px-5 py-4 sm:px-7 border-b border-slate-200/80 flex items-center justify-between gap-4"
          style={{ backgroundColor: '#F8F5EE' }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="rounded-2xl bg-white p-1.5 border border-slate-200/90 shadow-xs shrink-0">
              <ReindeerAvatar id={reindeer.id} size={48} rescued={solved || alreadyRescued} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span>Sfida {reindeer.order} di 9</span>
                <span aria-hidden="true">·</span>
                <span>{difficulty === 'hard' ? 'Livello Difficile' : 'Livello Facile'}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{reindeer.locationName}</span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                {reindeer.englishName} ({reindeer.italianName}) — {reindeer.challengeTitle[difficulty]}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.tap();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 min-h-[42px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mappa</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-7 space-y-5">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-amber-50/70 border border-amber-200/60 rounded-2xl px-4 py-3">
            {reindeer.storyIntro[difficulty]}
          </p>

          <div className="min-h-[240px] flex flex-col justify-center">
            {reindeer.challengeType === 'pattern' && (
              <PatternGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'rhythm' && (
              <RhythmGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'grid_hop' && (
              <GridHopGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'intruder' && (
              <IntruderGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'constellation' && (
              <ConstellationGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'memory' && (
              <MemoryGame
                difficulty={difficulty}
                hintTick={hintTick}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'balance' && (
              <BalanceGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'word_scramble' && (
              <WordScrambleGame
                difficulty={difficulty}
                hintTick={hintTick}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
            {reindeer.challengeType === 'finale_riddle' && (
              <FinaleRiddleGame
                difficulty={difficulty}
                hintUsed={hintUsed}
                onWrong={(msg) => setFeedback({ type: 'error', text: msg })}
                onStep={() => setFeedback(null)}
                onWin={handleSolve}
              />
            )}
          </div>

          {feedback && (
            <div
              role="status"
              className={`rounded-2xl px-4 py-3 text-sm sm:text-base font-bold flex items-center gap-2.5 animate-celebrate-pop ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Always Accessible Hint Row */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={triggerHint}
              disabled={solved}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 px-5 py-3 text-sm sm:text-base font-extrabold text-slate-950 shadow-xs transition-all cursor-pointer min-h-[48px] shrink-0"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Indizio / Aiuto</span>
            </button>

            {hintUsed ? (
              <div className="flex-1 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-amber-950">
                {reindeer.hintText[difficulty]}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Bloccato? Premi <strong className="text-slate-700">Indizio / Aiuto</strong> tutte le volte che vuoi!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 1. DASHER — Pattern Logic (Easy 2 rounds vs Hard 3 complex rounds)         */
/* -------------------------------------------------------------------------- */
const PATTERN_ROUNDS_EASY = [
  {
    sequence: ['🎄', '⭐', '🎁', '🎄', '⭐'],
    answer: '🎁',
    groupSize: 3,
    options: [
      { icon: '🎁', label: 'Regalo' },
      { icon: '⛄', label: 'Pupazzo' },
      { icon: '🔔', label: 'Campana' },
      { icon: '❄️', label: 'Fiocco' },
    ],
  },
  {
    sequence: ['❄️', '🔔', '⛄', '❄️', '🔔'],
    answer: '⛄',
    groupSize: 3,
    options: [
      { icon: '🎄', label: 'Albero' },
      { icon: '⛄', label: 'Pupazzo' },
      { icon: '🎁', label: 'Regalo' },
      { icon: '⭐', label: 'Stella' },
    ],
  },
];

const PATTERN_ROUNDS_HARD = [
  {
    sequence: ['🎄', '⭐', '🎁', '🔔', '🎄', '⭐', '🎁'],
    answer: '🔔',
    groupSize: 4,
    options: [
      { icon: '🎄', label: 'Albero' },
      { icon: '🔔', label: 'Campana' },
      { icon: '❄️', label: 'Fiocco' },
      { icon: '⛄', label: 'Pupazzo' },
    ],
  },
  {
    sequence: ['❄️', '❄️', '🔔', '❄️', '❄️', '🔔', '❄️'],
    answer: '❄️',
    groupSize: 3,
    options: [
      { icon: '❄️', label: 'Fiocco' },
      { icon: '🔔', label: 'Campana' },
      { icon: '⭐', label: 'Stella' },
      { icon: '🎁', label: 'Regalo' },
    ],
  },
  {
    sequence: ['1⭐', '2⭐', '4⭐', '7⭐'],
    answer: '11⭐',
    groupSize: 4,
    options: [
      { icon: '9⭐', label: '+2?' },
      { icon: '10⭐', label: '+3?' },
      { icon: '11⭐', label: '+4!' },
      { icon: '14⭐', label: '×2?' },
    ],
  },
];

const PatternGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const rounds = difficulty === 'hard' ? PATTERN_ROUNDS_HARD : PATTERN_ROUNDS_EASY;
  const [round, setRound] = useState(0);
  const current = rounds[round];

  const handlePick = (icon: string) => {
    if (icon === current.answer) {
      sound.stepSuccess();
      onStep();
      if (round + 1 < rounds.length) {
        setRound(round + 1);
      } else {
        onWin();
      }
    } else {
      sound.wrong();
      onWrong('Quasi! Osserva bene la regola della sequenza prima di scegliere.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-xs font-bold text-slate-500 text-center">
        Livello {round + 1} di {rounds.length}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {current.sequence.map((item, idx) => (
          <div
            key={idx}
            className={`min-w-[52px] h-14 px-2 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-extrabold border-2 bg-white shadow-xs ${
              hintUsed && idx < current.groupSize ? 'border-amber-400 bg-amber-50' : 'border-slate-200'
            }`}
          >
            {item}
          </div>
        ))}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold border-2 border-dashed border-blue-500 bg-blue-50 text-blue-700">
          ?
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {current.options.map((opt, idx) => {
          const dimmed = hintUsed && opt.icon !== current.answer && idx % 2 === 1;
          return (
            <button
              key={opt.icon}
              type="button"
              onClick={() => handlePick(opt.icon)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 py-3 px-3 transition-all cursor-pointer min-h-[76px] ${
                dimmed
                  ? 'opacity-35 border-slate-200 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 active:scale-95 shadow-xs'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-extrabold">{opt.icon}</span>
              <span className="text-xs font-bold text-slate-700">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. DANCER — Musical Rhythm Memory (Easy 4x4 vs Hard 6x6)                   */
/* -------------------------------------------------------------------------- */
const ALL_BELLS = [
  { id: 0, label: 'Rosso', bg: '#EF4444', icon: '🔔' },
  { id: 1, label: 'Oro', bg: '#F59E0B', icon: '⭐' },
  { id: 2, label: 'Verde', bg: '#10B981', icon: '🎄' },
  { id: 3, label: 'Blu', bg: '#3B82F6', icon: '❄️' },
  { id: 4, label: 'Viola', bg: '#8B5CF6', icon: '🎁' },
  { id: 5, label: 'Corallo', bg: '#F97316', icon: '🕯️' },
];
const DANCE_SEQ_EASY = [0, 2, 1, 3];
const DANCE_SEQ_HARD = [0, 4, 2, 5, 1, 3];

const RhythmGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const bells = difficulty === 'hard' ? ALL_BELLS : ALL_BELLS.slice(0, 4);
  const sequence = difficulty === 'hard' ? DANCE_SEQ_HARD : DANCE_SEQ_EASY;
  const stepDelay = difficulty === 'hard' ? 480 : 620;

  const [activeBell, setActiveBell] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const playSequence = () => {
    clearTimers();
    setIsPlaying(true);
    setStepIndex(0);
    onStep();

    sequence.forEach((bellId, i) => {
      const t1 = window.setTimeout(() => {
        setActiveBell(bellId);
        sound.note(bellId);
      }, 420 + i * stepDelay);
      const t2 = window.setTimeout(() => {
        setActiveBell(null);
      }, 420 + i * stepDelay + Math.round(stepDelay * 0.62));
      timersRef.current.push(t1, t2);
    });

    const tEnd = window.setTimeout(() => {
      setIsPlaying(false);
    }, 420 + sequence.length * stepDelay + 120);
    timersRef.current.push(tEnd);
  };

  useEffect(() => {
    playSequence();
    return () => clearTimers();
  }, [difficulty]);

  const handleBellTap = (bellId: number) => {
    if (isPlaying) return;
    sound.note(bellId);
    setActiveBell(bellId);
    window.setTimeout(() => setActiveBell(null), 210);

    if (bellId === sequence[stepIndex]) {
      onStep();
      const next = stepIndex + 1;
      setStepIndex(next);
      if (next === sequence.length) {
        onWin();
      }
    } else {
      sound.wrong();
      setStepIndex(0);
      onWrong('Ops, passo sbagliato! Riprova dall’inizio o premi "Rivedi i passi".');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {sequence.map((_, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-colors ${
                idx < stepIndex
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : 'bg-white border-slate-300 text-slate-500'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={playSequence}
          disabled={isPlaying}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-slate-800 cursor-pointer min-h-[42px]"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlaying ? 'Guarda i passi...' : 'Rivedi i passi'}</span>
        </button>
      </div>

      {hintUsed && (
        <div className="rounded-xl bg-pink-50 border border-pink-200 px-3 py-2 text-xs font-bold text-pink-900 flex flex-wrap items-center gap-1.5">
          <span>Ordine:</span>
          {sequence.map((b, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-lg border ${
                i === stepIndex ? 'bg-amber-300 border-amber-500 text-slate-950' : 'bg-white border-pink-200'
              }`}
            >
              {i + 1}. {ALL_BELLS[b].label}
            </span>
          ))}
        </div>
      )}

      <div className={`grid gap-3 ${difficulty === 'hard' ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {bells.map((bell) => {
          const isLit = activeBell === bell.id;
          const isHintNext = hintUsed && !isPlaying && sequence[stepIndex] === bell.id;
          return (
            <button
              key={bell.id}
              type="button"
              onClick={() => handleBellTap(bell.id)}
              disabled={isPlaying}
              className={`rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1.5 text-white font-extrabold transition-all cursor-pointer min-h-[86px] shadow-sm ${
                isLit ? 'scale-105 brightness-110 ring-4 ring-amber-300' : 'hover:brightness-105 active:scale-95'
              } ${isHintNext ? 'ring-4 ring-amber-400' : ''}`}
              style={{ backgroundColor: bell.bg }}
            >
              <span className="text-2xl sm:text-3xl">{bell.icon}</span>
              <span className="text-xs sm:text-sm">{bell.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. PRANCER — Snowy Grid Hop (Easy 4x3 vs Hard 6x4 + Bell Key)              */
/* -------------------------------------------------------------------------- */
/* 3. PRANCER — Coding Tiles Path (Avanti, Destra, Sinistra + Prova Percorso) */
/* -------------------------------------------------------------------------- */
type CodeCmd = 'F' | 'R' | 'L';
type Heading = 0 | 1 | 2 | 3; // 0: Right(E), 1: Down(S), 2: Left(W), 3: Up(N)

const DIR_DELTAS: Record<Heading, [number, number]> = {
  0: [0, 1],
  1: [1, 0],
  2: [0, -1],
  3: [-1, 0],
};

const DIR_ARROW: Record<Heading, string> = {
  0: '➡️',
  1: '⬇️',
  2: '⬅️',
  3: '⬆️',
};

const CMD_META: Record<CodeCmd, { label: string; icon: string; bg: string }> = {
  F: { label: 'Avanti', icon: '⬆️', bg: '#2563EB' },
  R: { label: 'Destra', icon: '↪️', bg: '#059669' },
  L: { label: 'Sinistra', icon: '↩️', bg: '#D97706' },
};

const EASY_CODE_HAZARDS = new Set(['0,2', '2,0', '1,3']);
const HARD_CODE_HAZARDS = new Set(['0,2', '1,0', '1,3', '2,0', '3,0', '3,3', '0,4', '1,4']);

function applyCodeStep(
  r: number,
  c: number,
  dir: Heading,
  cmd: CodeCmd
): { r: number; c: number; dir: Heading } {
  const nextDir: Heading =
    cmd === 'F' ? dir : cmd === 'R' ? (((dir + 1) % 4) as Heading) : (((dir + 3) % 4) as Heading);
  const [dr, dc] = DIR_DELTAS[nextDir];
  return { r: r + dr, c: c + dc, dir: nextDir };
}

function findNextCodingHint(
  startR: number,
  startC: number,
  startDir: Heading,
  startBell: boolean,
  rows: number,
  cols: number,
  hazards: Set<string>,
  bellPos: [number, number],
  goalPos: [number, number],
  needBell: boolean
): CodeCmd | null {
  interface Node {
    r: number;
    c: number;
    dir: Heading;
    bell: boolean;
    firstCmd: CodeCmd | null;
  }
  const queue: Node[] = [{ r: startR, c: startC, dir: startDir, bell: startBell, firstCmd: null }];
  const visited = new Set<string>([`${startR},${startC},${startDir},${startBell ? 1 : 0}`]);
  const cmds: CodeCmd[] = ['F', 'R', 'L'];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.r === goalPos[0] && cur.c === goalPos[1] && (!needBell || cur.bell)) {
      return cur.firstCmd;
    }
    for (const cmd of cmds) {
      const nxt = applyCodeStep(cur.r, cur.c, cur.dir, cmd);
      if (nxt.r < 0 || nxt.r >= rows || nxt.c < 0 || nxt.c >= cols) continue;
      if (hazards.has(`${nxt.r},${nxt.c}`)) continue;
      const nextBell = cur.bell || (needBell && nxt.r === bellPos[0] && nxt.c === bellPos[1]);
      const key = `${nxt.r},${nxt.c},${nxt.dir},${nextBell ? 1 : 0}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          r: nxt.r,
          c: nxt.c,
          dir: nxt.dir,
          bell: nextBell,
          firstCmd: cur.firstCmd ?? cmd,
        });
      }
    }
  }
  return null;
}

const GridHopGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const isHard = difficulty === 'hard';
  const rows = isHard ? 4 : 3;
  const cols = isHard ? 5 : 4;
  const hazards = isHard ? HARD_CODE_HAZARDS : EASY_CODE_HAZARDS;
  const bellPos: [number, number] = [2, 1];
  const goalPos: [number, number] = isHard ? [3, 4] : [2, 3];

  const [program, setProgram] = useState<CodeCmd[]>([]);
  const [simPos, setSimPos] = useState<[number, number]>([0, 0]);
  const [simDir, setSimDir] = useState<Heading>(0);
  const [simHasBell, setSimHasBell] = useState(!isHard);
  const [isRunning, setIsRunning] = useState(false);
  const [execIdx, setExecIdx] = useState<number | null>(null);
  const [progressNote, setProgressNote] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    clearTimers();
    setProgram([]);
    setSimPos([0, 0]);
    setSimDir(0);
    setSimHasBell(!isHard);
    setIsRunning(false);
    setExecIdx(null);
    setProgressNote(null);
    return () => clearTimers();
  }, [difficulty, isHard]);

  const hintRecommendation = useMemo(() => {
    if (!hintUsed) return { cmd: null as CodeCmd | null, badStep: null as number | null };
    let r = 0;
    let c = 0;
    let dir: Heading = 0;
    let bell = !isHard;
    for (let i = 0; i < program.length; i++) {
      const nxt = applyCodeStep(r, c, dir, program[i]);
      if (nxt.r < 0 || nxt.r >= rows || nxt.c < 0 || nxt.c >= cols || hazards.has(`${nxt.r},${nxt.c}`)) {
        return { cmd: null, badStep: i + 1 };
      }
      r = nxt.r;
      c = nxt.c;
      dir = nxt.dir;
      if (isHard && r === bellPos[0] && c === bellPos[1]) bell = true;
    }
    const nextCmd = findNextCodingHint(r, c, dir, bell, rows, cols, hazards, bellPos, goalPos, isHard);
    return { cmd: nextCmd, badStep: null };
  }, [hintUsed, program, isHard, rows, cols, hazards]);

  const addCmd = (cmd: CodeCmd) => {
    if (isRunning || program.length >= 16) return;
    sound.tap();
    onStep();
    setProgressNote(null);
    setProgram((prev) => [...prev, cmd]);
  };

  const removeAt = (idx: number) => {
    if (isRunning) return;
    sound.tap();
    onStep();
    setProgressNote(null);
    setProgram((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearProgram = () => {
    if (isRunning) return;
    sound.tap();
    onStep();
    setProgram([]);
    setSimPos([0, 0]);
    setSimDir(0);
    setSimHasBell(!isHard);
    setExecIdx(null);
    setProgressNote(null);
  };

  const runProgram = () => {
    if (isRunning) return;
    if (program.length === 0) {
      sound.wrong();
      onWrong('Aggiungi prima qualche tessera (Avanti, Destra o Sinistra)!');
      return;
    }

    clearTimers();
    onStep();
    setProgressNote(null);
    setIsRunning(true);
    setSimPos([0, 0]);
    setSimDir(0);
    setSimHasBell(!isHard);
    setExecIdx(null);

    let curR = 0;
    let curC = 0;
    let curDir: Heading = 0;
    let curBell = !isHard;

    const frames: Array<{
      idx: number;
      r: number;
      c: number;
      dir: Heading;
      bell: boolean;
      error?: string;
    }> = [];

    for (let i = 0; i < program.length; i++) {
      const nxt = applyCodeStep(curR, curC, curDir, program[i]);
      if (nxt.r < 0 || nxt.r >= rows || nxt.c < 0 || nxt.c >= cols) {
        frames.push({
          idx: i,
          r: curR,
          c: curC,
          dir: nxt.dir,
          bell: curBell,
          error: `Al passo ${i + 1} (${CMD_META[program[i]].label}) esci dal sentiero! Modifica le tessere.`,
        });
        break;
      }
      if (hazards.has(`${nxt.r},${nxt.c}`)) {
        frames.push({
          idx: i,
          r: curR,
          c: curC,
          dir: nxt.dir,
          bell: curBell,
          error: `Al passo ${i + 1} (${CMD_META[program[i]].label}) c’è ghiaccio 🧊! Modifica la sequenza.`,
        });
        break;
      }
      curR = nxt.r;
      curC = nxt.c;
      curDir = nxt.dir;
      if (isHard && curR === bellPos[0] && curC === bellPos[1]) {
        curBell = true;
      }
      frames.push({ idx: i, r: curR, c: curC, dir: curDir, bell: curBell });
    }

    frames.forEach((f, stepNum) => {
      const t = window.setTimeout(() => {
        setExecIdx(f.idx);
        setSimPos([f.r, f.c]);
        setSimDir(f.dir);
        setSimHasBell(f.bell);

        if (f.error) {
          sound.wrong();
          setIsRunning(false);
          onWrong(f.error);
          return;
        }

        sound.tap();
        const isLast = stepNum === frames.length - 1;
        if (isLast) {
          setIsRunning(false);
          setExecIdx(null);
          const atGoal = f.r === goalPos[0] && f.c === goalPos[1];
          if (atGoal && (!isHard || f.bell)) {
            onWin();
          } else if (atGoal && isHard && !f.bell) {
            sound.wrong();
            onWrong('Sei arrivato alla Carota, ma prima devi passare sulla Campanella 🔔!');
          } else {
            setProgressNote(
              `Prancer è arrivato fino qui (${program.length} ${
                program.length === 1 ? 'tessera' : 'tessere'
              }). Continua ad aggiungere tessere!`
            );
          }
        }
      }, 340 * (stepNum + 1));
      timersRef.current.push(t);
    });
  };

  return (
    <div className="space-y-3.5">
      {/* Non-clickable Maze Board */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
          <span>
            Prancer guarda: <span className="text-sm">{DIR_ARROW[simDir]}</span>
            {isHard && (
              <>
                {' · '}
                {simHasBell ? 'Campanella presa 🔔 ✓' : 'Prendi 🔔 poi vai a 🥕'}
              </>
            )}
          </span>
          <span className="text-slate-500">Le caselle non si cliccano: usa le tessere sotto!</span>
        </div>

        <div
          className={`grid gap-1.5 mx-auto ${
            isHard ? 'grid-cols-5 max-w-md' : 'grid-cols-4 max-w-sm'
          }`}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const key = `${r},${c}`;
              const isPlayer = simPos[0] === r && simPos[1] === c;
              const isGoal = r === goalPos[0] && c === goalPos[1];
              const isBell = isHard && !simHasBell && r === bellPos[0] && c === bellPos[1];
              const isHazard = hazards.has(key);

              return (
                <div
                  key={key}
                  className={`${
                    isHard ? 'h-12 sm:h-13' : 'h-14 sm:h-16'
                  } rounded-xl border-2 flex items-center justify-center relative select-none ${
                    isPlayer
                      ? 'bg-emerald-100 border-emerald-600 shadow-sm'
                      : isHazard
                      ? 'bg-sky-100 border-sky-300'
                      : isBell || isGoal
                      ? 'bg-amber-100 border-amber-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isPlayer ? (
                    <div className="flex items-center gap-0.5">
                      <span className="text-xl sm:text-2xl">🦌</span>
                      <span className="text-xs sm:text-sm">{DIR_ARROW[simDir]}</span>
                    </div>
                  ) : isBell ? (
                    <span className="text-xl sm:text-2xl">🔔</span>
                  ) : isGoal ? (
                    <span className="text-xl sm:text-2xl">🥕</span>
                  ) : isHazard ? (
                    <span className="text-lg sm:text-xl">🧊</span>
                  ) : (
                    <span className="text-sm text-sky-300">❄️</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Coding Tile Palette (Avanti, Destra, Sinistra) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-600 text-center">
          Tocca le tessere per metterle in fila (Destra e Sinistra girano + avanzano di 1):
        </div>
        <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
          {(['F', 'L', 'R'] as CodeCmd[]).map((cmd) => {
            const meta = CMD_META[cmd];
            const isHintCmd = hintUsed && hintRecommendation.cmd === cmd;
            return (
              <button
                key={cmd}
                type="button"
                disabled={isRunning}
                onClick={() => addCmd(cmd)}
                className={`rounded-2xl py-2.5 px-3 text-white font-extrabold flex flex-col items-center justify-center gap-0.5 shadow-xs transition-all cursor-pointer min-h-[58px] active:scale-95 disabled:opacity-50 ${
                  isHintCmd ? 'ring-4 ring-amber-400 scale-[1.03]' : 'hover:brightness-105'
                }`}
                style={{ backgroundColor: meta.bg }}
              >
                <span className="text-xl">{meta.icon}</span>
                <span className="text-xs sm:text-sm">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint Bad-Step Warning if needed */}
      {hintUsed && hintRecommendation.badStep && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-950 text-center">
          Consiglio: controlla la tessera n° {hintRecommendation.badStep}! Toccala per toglierla.
        </div>
      )}

      {/* Program Strip (Aligned Tiles) */}
      <div className="rounded-2xl bg-slate-100 border border-slate-200 p-2.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span>Il tuo percorso ({program.length} tessere) — tocca una tessera per toglierla</span>
          {program.length > 0 && (
            <button
              type="button"
              disabled={isRunning}
              onClick={clearProgram}
              className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Svuota
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 min-h-[42px]">
          {program.length === 0 ? (
            <span className="text-xs text-slate-400 font-medium px-2">
              Nessuna tessera inserita. Inizia scegliendo Avanti, Sinistra o Destra!
            </span>
          ) : (
            program.map((cmd, idx) => {
              const meta = CMD_META[cmd];
              const isActive = execIdx === idx;
              return (
                <button
                  key={`${cmd}-${idx}`}
                  type="button"
                  disabled={isRunning}
                  onClick={() => removeAt(idx)}
                  title="Tocca per rimuovere"
                  className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-white transition-all cursor-pointer ${
                    isActive ? 'ring-4 ring-amber-400 scale-110' : 'hover:opacity-85'
                  }`}
                  style={{ backgroundColor: meta.bg }}
                >
                  <span className="tabular-nums opacity-80">{idx + 1}.</span>
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Progress Info + "Prova il percorso" Button */}
      {progressNote && (
        <div className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-2 text-xs sm:text-sm font-bold text-sky-900 text-center">
          {progressNote}
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={runProgram}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-3 text-sm sm:text-base font-extrabold text-white shadow-sm cursor-pointer min-h-[48px]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRunning ? 'Prancer sta provando...' : 'Prova il percorso'}</span>
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. VIXEN — Find the Intruder (Easy 2x4 vs Hard 3x6 Logic/Math)             */
/* -------------------------------------------------------------------------- */
const INTRUDER_EASY = [
  {
    prompt: 'Quale oggetto NON serve quando fuori nevica?',
    items: [
      { id: 'guanti', icon: '🧤', label: 'Guanti caldi', isIntruder: false },
      { id: 'sciarpa', icon: '🧣', label: 'Sciarpa di lana', isIntruder: false },
      { id: 'secchiello', icon: '🏖️', label: 'Spiaggia e mare', isIntruder: true },
      { id: 'cappotto', icon: '🧥', label: 'Cappotto pesante', isIntruder: false },
    ],
  },
  {
    prompt: 'Quale NON è uno strumento musicale?',
    items: [
      { id: 'campana', icon: '🔔', label: 'Campanella', isIntruder: false },
      { id: 'tamburo', icon: '🥁', label: 'Tamburo', isIntruder: false },
      { id: 'carota', icon: '🥕', label: 'Carota', isIntruder: true },
      { id: 'tromba', icon: '🎺', label: 'Trombetta', isIntruder: false },
    ],
  },
];

const INTRUDER_HARD = [
  {
    prompt: 'Quale numero NON fa parte della tabellina del 3?',
    items: [
      { id: 'n6', icon: '6', label: '3 × 2', isIntruder: false },
      { id: 'n9', icon: '9', label: '3 × 3', isIntruder: false },
      { id: 'n14', icon: '14', label: 'Intruso?', isIntruder: true },
      { id: 'n12', icon: '12', label: '3 × 4', isIntruder: false },
      { id: 'n15', icon: '15', label: '3 × 5', isIntruder: false },
      { id: 'n18', icon: '18', label: '3 × 6', isIntruder: false },
    ],
  },
  {
    prompt: 'Quale somma NON dà come risultato 20?',
    items: [
      { id: 's1', icon: '12+8', label: 'Calcola', isIntruder: false },
      { id: 's2', icon: '15+5', label: 'Calcola', isIntruder: false },
      { id: 's3', icon: '10+10', label: 'Calcola', isIntruder: false },
      { id: 's4', icon: '11+8', label: 'Calcola', isIntruder: true },
      { id: 's5', icon: '14+6', label: 'Calcola', isIntruder: false },
      { id: 's6', icon: '17+3', label: 'Calcola', isIntruder: false },
    ],
  },
  {
    prompt: 'Quale parola NON appartiene al freddo del Polo Nord?',
    items: [
      { id: 'w1', icon: '🧊', label: 'Ghiaccio', isIntruder: false },
      { id: 'w2', icon: '❄️', label: 'Neve', isIntruder: false },
      { id: 'w3', icon: '🐪', label: 'Cammello', isIntruder: true },
      { id: 'w4', icon: '🛷', label: 'Slitta', isIntruder: false },
      { id: 'w5', icon: '🧤', label: 'Guanti', isIntruder: false },
      { id: 'w6', icon: '🌲', label: 'Abete', isIntruder: false },
    ],
  },
];

const IntruderGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const rounds = difficulty === 'hard' ? INTRUDER_HARD : INTRUDER_EASY;
  const [round, setRound] = useState(0);
  const current = rounds[round];

  const handleSelect = (isIntruder: boolean) => {
    if (isIntruder) {
      sound.stepSuccess();
      onStep();
      if (round + 1 < rounds.length) {
        setRound(round + 1);
      } else {
        onWin();
      }
    } else {
      sound.wrong();
      onWrong('No, questo rispetta la regola! Cerca l’unico intruso.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="text-xs font-bold text-slate-500">
          Domanda {round + 1} di {rounds.length}
        </div>
        <h3 className="font-display text-lg font-extrabold text-slate-900">{current.prompt}</h3>
      </div>

      <div className={`grid gap-3 ${difficulty === 'hard' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
        {current.items.map((item, idx) => {
          const dimmed =
            hintUsed && !item.isIntruder && (difficulty === 'hard' ? idx < 2 : idx === 0);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.isIntruder)}
              className={`rounded-2xl border-2 p-3.5 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[92px] ${
                dimmed
                  ? 'opacity-35 bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 active:scale-95 shadow-xs'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                {item.icon}
              </span>
              {difficulty === 'easy' && (
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. COMET — Number Series (Easy: Even 2..12 + distractors | Hard: 4x + dist)*/
/* -------------------------------------------------------------------------- */
const SERIES_EASY_TARGET = [2, 4, 6, 8, 10, 12];
const SERIES_EASY_POOL = [8, 3, 12, 2, 7, 6, 11, 4, 10]; // distractors: 3, 7, 11

const SERIES_HARD_TARGET = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
const SERIES_HARD_POOL = [24, 10, 8, 36, 18, 4, 28, 16, 22, 40, 12, 30, 32, 20]; // distractors: 10, 18, 22, 30

const ConstellationGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const isHard = difficulty === 'hard';
  const target = isHard ? SERIES_HARD_TARGET : SERIES_EASY_TARGET;
  const pool = isHard ? SERIES_HARD_POOL : SERIES_EASY_POOL;

  const [stepIdx, setStepIdx] = useState(0);
  const nextExpected = target[stepIdx];

  useEffect(() => {
    setStepIdx(0);
  }, [difficulty]);

  const handleNumberPick = (num: number) => {
    if (!target.includes(num)) {
      sound.wrong();
      onWrong(
        isHard
          ? `Il numero ${num} è un intruso: non fa parte della tabellina del 4!`
          : `Il numero ${num} è dispari! Cerca solo i numeri pari.`
      );
      return;
    }
    if (num === nextExpected) {
      sound.note(stepIdx);
      onStep();
      if (stepIdx + 1 === target.length) {
        onWin();
      } else {
        setStepIdx(stepIdx + 1);
      }
    } else if (num > nextExpected) {
      sound.wrong();
      onWrong(
        `Parti dal più piccolo! Prima di ${num} c’è un numero più piccolo (${
          isHard ? 'tabellina del 4' : 'numero pari'
        }).`
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-xs sm:text-sm font-bold text-slate-600">
        {isHard ? 'Tabellina del 4 dal più piccolo al più grande' : 'Numeri pari dal più piccolo al più grande'}{' '}
        <span className="tabular-nums text-violet-700">
          ({stepIdx}/{target.length})
        </span>
      </div>

      {/* Ordered Target Slots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[#0F172A] rounded-2xl p-3 border border-indigo-900/70">
        {target.map((n, idx) => {
          const filled = idx < stepIdx;
          const isCurrent = idx === stepIdx;
          return (
            <div
              key={n}
              className={`min-w-[38px] h-10 px-2 rounded-xl flex items-center justify-center font-display text-sm sm:text-base font-extrabold tabular-nums border-2 transition-colors ${
                filled
                  ? 'bg-amber-400 border-amber-300 text-slate-950'
                  : isCurrent
                  ? 'bg-indigo-900 border-indigo-400 text-indigo-100 border-dashed'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500'
              }`}
            >
              {filled ? n : isCurrent ? '?' : '·'}
            </div>
          );
        })}
      </div>

      {/* Shuffled Number Stars with Distractors */}
      <div
        className={`grid gap-2.5 mx-auto ${
          isHard ? 'grid-cols-4 sm:grid-cols-7 max-w-xl' : 'grid-cols-3 max-w-sm'
        }`}
      >
        {pool.map((num) => {
          const isDone = target.includes(num) && num < nextExpected;
          const isHintTarget = hintUsed && num === nextExpected;
          return (
            <button
              key={num}
              type="button"
              disabled={isDone}
              onClick={() => handleNumberPick(num)}
              className={`h-14 sm:h-15 rounded-2xl border-2 font-display text-lg sm:text-xl font-extrabold tabular-nums flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 opacity-55 cursor-default'
                  : isHintTarget
                  ? 'bg-amber-50 border-amber-400 text-slate-950 ring-4 ring-amber-300'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-violet-500 hover:bg-violet-50 active:scale-95 shadow-xs'
              }`}
            >
              <span className="text-sm" aria-hidden="true">
                ⭐
              </span>
              <span>{num}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. CUPID — Memory (Easy 6 cards / 3 pairs vs Hard 12 cards / 6 pairs)      */
/* -------------------------------------------------------------------------- */
interface MemoryCard {
  uid: number;
  pairId: string;
  icon: string;
  label: string;
}

const EASY_PAIRS = [
  { pairId: 'heart', icon: '❤️', label: 'Cuore' },
  { pairId: 'bear', icon: '🧸', label: 'Orsetto' },
  { pairId: 'train', icon: '🚂', label: 'Trenino' },
];

const HARD_PAIRS = [
  ...EASY_PAIRS,
  { pairId: 'gift', icon: '🎁', label: 'Regalo' },
  { pairId: 'snowman', icon: '⛄', label: 'Pupazzo' },
  { pairId: 'bell', icon: '🔔', label: 'Campana' },
];

const MemoryGame: React.FC<{
  difficulty: DifficultyLevel;
  hintTick: number;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintTick, onStep, onWin }) => {
  const pairSource = difficulty === 'hard' ? HARD_PAIRS : EASY_PAIRS;
  const totalPairs = pairSource.length;

  const cards = useMemo<MemoryCard[]>(() => {
    const raw: MemoryCard[] = [];
    pairSource.forEach((p, idx) => {
      raw.push({ uid: idx * 2, ...p });
      raw.push({ uid: idx * 2 + 1, ...p });
    });
    return raw.sort((a, b) => ((a.uid * 11 + 5) % 13) - ((b.uid * 11 + 5) % 13));
  }, [difficulty]);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [peeked, setPeeked] = useState<number[]>([]);
  const lockRef = useRef(false);
  const matchedRef = useRef(matched);
  matchedRef.current = matched;

  useEffect(() => {
    if (hintTick === 0) return;
    const unmatchedCard = cards.find((c) => !matchedRef.current.has(c.pairId));
    if (!unmatchedCard) return;
    const pairUids = cards.filter((c) => c.pairId === unmatchedCard.pairId).map((c) => c.uid);
    setPeeked(pairUids);
    const t = window.setTimeout(() => setPeeked([]), 1800);
    return () => window.clearTimeout(t);
  }, [hintTick, cards]);

  const handleCardTap = (card: MemoryCard) => {
    if (lockRef.current) return;
    if (matched.has(card.pairId) || flipped.includes(card.uid)) return;

    sound.tap();
    onStep();
    const nextFlipped = [...flipped, card.uid];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      lockRef.current = true;
      const first = cards.find((c) => c.uid === nextFlipped[0])!;
      const second = cards.find((c) => c.uid === nextFlipped[1])!;

      if (first.pairId === second.pairId) {
        sound.stepSuccess();
        const nextMatched = new Set(matched);
        nextMatched.add(first.pairId);
        setMatched(nextMatched);
        setFlipped([]);
        lockRef.current = false;

        if (nextMatched.size === totalPairs) {
          onWin();
        }
      } else {
        window.setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 720);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-bold text-slate-600">
        <span>
          Coppie trovate:{' '}
          <span className="tabular-nums text-rose-600">
            {matched.size} / {totalPairs}
          </span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">Mosse: {moves}</span>
      </div>

      <div
        className={`grid gap-2.5 mx-auto ${
          difficulty === 'hard' ? 'grid-cols-4 max-w-lg' : 'grid-cols-3 max-w-md'
        }`}
      >
        {cards.map((card) => {
          const isOpen =
            matched.has(card.pairId) || flipped.includes(card.uid) || peeked.includes(card.uid);
          const isMatched = matched.has(card.pairId);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardTap(card)}
              className={`${
                difficulty === 'hard' ? 'h-20 sm:h-22' : 'h-24 sm:h-28'
              } rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400'
                  : isOpen
                  ? 'bg-white border-rose-400 shadow-sm'
                  : 'bg-rose-600 border-rose-700 hover:bg-rose-500 text-white shadow-sm active:scale-95'
              }`}
            >
              {isOpen ? (
                <>
                  <span className={difficulty === 'hard' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}>
                    {card.icon}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">{card.label}</span>
                </>
              ) : (
                <span className="text-2xl font-extrabold">✉️</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. DONNER — Math Balance (Easy 2 rounds vs Hard 3 multi-step problems)     */
/* -------------------------------------------------------------------------- */
const BALANCE_EASY = [
  { target: 10, current: 6, answer: 4, options: [2, 4, 5, 7] },
  { target: 12, current: 7, answer: 5, options: [3, 4, 5, 6] },
];

const BALANCE_HARD = [
  {
    question: 'Sul sacco ci sono 18 stelle, ma ce ne stanno 25. Quante ne puoi ancora mettere?',
    formula: '18 + ? = 25',
    answer: 7,
    options: [5, 6, 7, 8],
  },
  {
    question: 'Ci sono 3 slitte con 4 pacchi ciascuna, più altri 5 pacchi extra. Quanti pacchi in totale?',
    formula: '(3 × 4) + 5 = ?',
    answer: 17,
    options: [12, 15, 17, 19],
  },
  {
    question: 'Avevi 30 biscotti: ne hai dati 12 a Dasher e 9 a Comet. Quanti biscotti ti restano?',
    formula: '30 − 12 − 9 = ?',
    answer: 9,
    options: [7, 8, 9, 11],
  },
];

const BalanceGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const isHard = difficulty === 'hard';
  const [round, setRound] = useState(0);

  if (!isHard) {
    const current = BALANCE_EASY[round];
    const handlePick = (val: number) => {
      if (val === current.answer) {
        sound.stepSuccess();
        onStep();
        if (round + 1 < BALANCE_EASY.length) setRound(round + 1);
        else onWin();
      } else {
        sound.wrong();
        onWrong(`${current.current} + ${val} fa ${current.current + val}, ma ci serve ${current.target}!`);
      }
    };

    return (
      <div className="space-y-5">
        <div className="text-center text-xs font-bold text-slate-500">
          Sacco {round + 1} di {BALANCE_EASY.length}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 bg-sky-50 border border-sky-200 rounded-2xl p-4">
          <div className="rounded-xl bg-white border border-sky-200 px-4 py-2 text-center">
            <div className="text-xs font-bold text-slate-500">Già nel sacco</div>
            <div className="font-display text-2xl font-extrabold text-sky-700 tabular-nums">
              {current.current} ⭐
            </div>
          </div>
          <span className="font-display text-2xl font-extrabold text-slate-700">+</span>
          <div className="rounded-xl bg-white border-2 border-dashed border-sky-500 px-4 py-2 text-center min-w-[78px]">
            <div className="text-xs font-bold text-slate-500">Manca</div>
            <div className="font-display text-2xl font-extrabold text-sky-600">?</div>
          </div>
          <span className="font-display text-2xl font-extrabold text-slate-700">=</span>
          <div className="rounded-xl bg-amber-100 border border-amber-300 px-4 py-2 text-center">
            <div className="text-xs font-bold text-amber-900">Obiettivo</div>
            <div className="font-display text-2xl font-extrabold text-amber-900 tabular-nums">
              {current.target} ⭐
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {current.options.map((val) => {
            const isHinted = hintUsed && val === current.answer;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handlePick(val)}
                className={`rounded-2xl border-2 p-3.5 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[86px] ${
                  isHinted
                    ? 'bg-amber-50 border-amber-400 ring-4 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50/60 active:scale-95'
                }`}
              >
                <span className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
                  +{val}
                </span>
                <span className="text-xs leading-none">{'⭐'.repeat(val)}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentHard = BALANCE_HARD[round];
  const handlePickHard = (val: number) => {
    if (val === currentHard.answer) {
      sound.stepSuccess();
      onStep();
      if (round + 1 < BALANCE_HARD.length) setRound(round + 1);
      else onWin();
    } else {
      sound.wrong();
      onWrong(`Non è ${val}! Rileggi bene il calcolo passo dopo passo.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-xs font-bold text-slate-500">
        Problema {round + 1} di {BALANCE_HARD.length}
      </div>

      <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 text-center space-y-2">
        <p className="text-sm sm:text-base font-bold text-slate-800">{currentHard.question}</p>
        <div className="inline-block rounded-xl bg-white border border-sky-200 px-4 py-1.5 font-display text-xl font-extrabold text-sky-800 tabular-nums">
          {currentHard.formula}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {currentHard.options.map((val) => {
          const isHinted = hintUsed && val === currentHard.answer;
          return (
            <button
              key={val}
              type="button"
              onClick={() => handlePickHard(val)}
              className={`rounded-2xl border-2 p-4 flex items-center justify-center font-display text-2xl font-extrabold transition-all cursor-pointer min-h-[76px] tabular-nums ${
                isHinted
                  ? 'bg-amber-50 border-amber-400 ring-4 ring-amber-200 text-slate-950'
                  : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50/60 active:scale-95 text-slate-900'
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. BLITZEN — Word Scramble (Easy: STELLA vs Hard: PANETTONE + decoys)      */
/* -------------------------------------------------------------------------- */
const EASY_WORD = 'STELLA';
const EASY_TILES = ['L', 'S', 'A', 'T', 'E', 'L'];

const HARD_WORD = 'PANETTONE';
const HARD_TILES = ['T', 'E', 'P', 'R', 'N', 'O', 'A', 'T', 'S', 'N', 'E']; // 9 right + 2 decoys (R, S)

const WordScrambleGame: React.FC<{
  difficulty: DifficultyLevel;
  hintTick: number;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintTick, onWrong, onStep, onWin }) => {
  const isHard = difficulty === 'hard';
  const targetWord = isHard ? HARD_WORD : EASY_WORD;
  const tiles = isHard ? HARD_TILES : EASY_TILES;

  const [slots, setSlots] = useState<Array<number | null>>(() =>
    Array.from({ length: targetWord.length }, () => null)
  );

  useEffect(() => {
    setSlots(Array.from({ length: targetWord.length }, () => null));
  }, [targetWord]);

  useEffect(() => {
    if (hintTick === 0) return;
    const nextEmptyIdx = slots.findIndex((s, i) => s === null || tiles[s] !== targetWord[i]);
    if (nextEmptyIdx === -1) return;

    const neededChar = targetWord[nextEmptyIdx];
    const usedIndices = new Set(slots.filter((x): x is number => x !== null));
    let tileIdx = tiles.findIndex((ch, i) => ch === neededChar && !usedIndices.has(i));
    if (tileIdx === -1) {
      tileIdx = tiles.findIndex((ch) => ch === neededChar);
    }
    if (tileIdx === -1) return;

    const updated = slots.map((s) => (s === tileIdx ? null : s));
    updated[nextEmptyIdx] = tileIdx;
    setSlots(updated);

    const formed = updated.map((i) => (i !== null ? tiles[i] : '')).join('');
    if (formed === targetWord) {
      onWin();
    }
  }, [hintTick]);

  const handleTileClick = (tileIdx: number) => {
    if (slots.includes(tileIdx)) return;
    const firstEmpty = slots.indexOf(null);
    if (firstEmpty === -1) return;

    sound.tap();
    onStep();
    const updated = [...slots];
    updated[firstEmpty] = tileIdx;
    setSlots(updated);

    if (!updated.includes(null)) {
      const formed = updated.map((i) => (i !== null ? tiles[i] : '')).join('');
      if (formed === targetWord) {
        onWin();
      } else {
        sound.wrong();
        onWrong(`Quasi! Tocca una lettera sopra per spostarla e comporre ${targetWord}.`);
      }
    }
  };

  const handleSlotClick = (slotIdx: number) => {
    if (slots[slotIdx] === null) return;
    sound.tap();
    onStep();
    const updated = [...slots];
    updated[slotIdx] = null;
    setSlots(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
        <span className="text-3xl">{isHard ? '🍰' : '⭐'}</span>
        <span className="text-xs sm:text-sm font-bold text-amber-950">
          {isHard
            ? 'Indizio: dolce tipico di Natale, alto e morbido! (Attenzione: ci sono 2 lettere intruse!)'
            : 'Indizio figura: brilla in cima all’albero e nel cielo di Natale!'}
        </span>
      </div>

      {/* Answer Slots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {slots.map((tileIdx, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSlotClick(i)}
            className={`${
              isHard ? 'w-9 h-12 sm:w-11 sm:h-13 text-lg sm:text-xl' : 'w-12 h-14 sm:w-14 sm:h-16 text-2xl'
            } rounded-xl sm:rounded-2xl border-2 font-display font-extrabold flex items-center justify-center transition-all cursor-pointer ${
              tileIdx !== null
                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-xs hover:bg-amber-300'
                : 'bg-white border-dashed border-slate-300 text-slate-400'
            }`}
          >
            {tileIdx !== null ? tiles[tileIdx] : ''}
          </button>
        ))}
      </div>

      {/* Scrambled Letter Tiles */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {tiles.map((char, idx) => {
          const used = slots.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={used}
              onClick={() => handleTileClick(idx)}
              className={`${
                isHard ? 'w-10 h-10 sm:w-11 sm:h-11 text-lg' : 'w-12 h-12 sm:w-14 sm:h-14 text-xl'
              } rounded-xl sm:rounded-2xl border-2 font-display font-extrabold transition-all cursor-pointer ${
                used
                  ? 'opacity-25 bg-slate-100 border-slate-200 text-slate-400 cursor-default'
                  : 'bg-white border-slate-300 text-slate-900 hover:border-amber-500 hover:bg-amber-50 active:scale-95 shadow-xs'
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. RUDOLPH — Finale Riddle (Easy 3 clues vs Hard 4 clues + 6 symbols)      */
/* -------------------------------------------------------------------------- */
const FINALE_CLUES_EASY = [
  { clue: '1. Illumina la nebbia davanti alla slitta', answerId: 'nose' },
  { clue: '2. Fa "din-don!" sul collare delle renne', answerId: 'bell' },
  { clue: '3. È verde, pieno di palline e regali sotto', answerId: 'tree' },
];

const FINALE_CLUES_HARD = [
  { clue: '1. Segna la mezzanotte esatta della Vigilia', answerId: 'clock' },
  { clue: '2. Illumina la tempesta di neve davanti alla slitta', answerId: 'nose' },
  { clue: '3. Scende leggero e silenzioso dalle nuvole d’inverno', answerId: 'snow' },
  { clue: '4. È arancione e croccante: la merenda preferita delle renne', answerId: 'carrot' },
];

const FINALE_SYMBOLS_EASY = [
  { id: 'nose', icon: '🔴', label: 'Naso Rosso' },
  { id: 'snow', icon: '❄️', label: 'Fiocco di Neve' },
  { id: 'bell', icon: '🔔', label: 'Campanella' },
  { id: 'carrot', icon: '🥕', label: 'Carota' },
  { id: 'tree', icon: '🎄', label: 'Albero' },
];

const FINALE_SYMBOLS_HARD = [
  ...FINALE_SYMBOLS_EASY,
  { id: 'clock', icon: '🕰️', label: 'Orologio' },
];

const FinaleRiddleGame: React.FC<{
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  onWrong: (msg: string) => void;
  onStep: () => void;
  onWin: () => void;
}> = ({ difficulty, hintUsed, onWrong, onStep, onWin }) => {
  const isHard = difficulty === 'hard';
  const clues = isHard ? FINALE_CLUES_HARD : FINALE_CLUES_EASY;
  const symbols = isHard ? FINALE_SYMBOLS_HARD : FINALE_SYMBOLS_EASY;
  const [step, setStep] = useState(0);

  const handleSymbolPick = (symbolId: string) => {
    const needed = clues[step].answerId;
    if (symbolId === needed) {
      sound.stepSuccess();
      onStep();
      if (step + 1 === clues.length) {
        onWin();
      } else {
        setStep(step + 1);
      }
    } else {
      sound.wrong();
      onWrong('Rileggi con calma l’indovinello evidenziato in rosso!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {clues.map((item, idx) => {
          const done = idx < step;
          const active = idx === step;
          const sym = symbols.find((s) => s.id === item.answerId)!;
          return (
            <div
              key={item.answerId}
              className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-3.5 py-2 transition-colors ${
                done
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : active
                  ? 'bg-rose-50 border-rose-400 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold">{item.clue}</span>
              <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0">
                {done ? sym.icon : active ? '?' : '·'}
              </span>
            </div>
          );
        })}
      </div>

      <div className={`grid gap-2.5 ${isHard ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-5'}`}>
        {symbols.map((sym) => {
          const isHintTarget = hintUsed && sym.id === clues[step].answerId;
          return (
            <button
              key={sym.id}
              type="button"
              onClick={() => handleSymbolPick(sym.id)}
              className={`rounded-2xl border-2 p-2.5 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-h-[78px] ${
                isHintTarget
                  ? 'bg-amber-50 border-amber-400 ring-4 ring-amber-200'
                  : 'bg-white border-slate-200 hover:border-rose-500 hover:bg-rose-50/60 active:scale-95'
              }`}
            >
              <span className="text-2xl sm:text-3xl">{sym.icon}</span>
              <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                {sym.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
