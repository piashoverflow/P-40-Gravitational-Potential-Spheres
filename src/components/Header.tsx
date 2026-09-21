import React from 'react';
import { Play, Pause, RotateCcw, CircleDot, Disc, GitCommit, Activity, Sparkles } from 'lucide-react';
import { P40Mode } from '../types';

interface HeaderProps {
  mode: P40Mode;
  setMode: (mode: P40Mode) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  showMath: boolean;
  setShowMath: (show: boolean | ((prev: boolean) => boolean)) => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isRunning,
  setIsRunning,
  onReset,
  speed,
  setSpeed,
  showMath,
  setShowMath,
  lang,
  setLang,
}) => {
  const modes = [
    {
      id: 'solid_sphere_theorems' as P40Mode,
      labelEn: 'Solid Sphere (E & V)',
      labelBn: 'সুষম নিরেট গোলক (E ও V)',
      icon: Disc,
    },
    {
      id: 'hollow_sphere_theorems' as P40Mode,
      labelEn: 'Hollow Shell (E & V)',
      labelBn: 'ফাঁপা গোলক খোলক (E ও V)',
      icon: CircleDot,
    },
    {
      id: 'tunnel_through_earth' as P40Mode,
      labelEn: 'Diametric Tunnel SHM',
      labelBn: 'ভূ-সুড়ঙ্গে সরল স্পন্দন (SHM)',
      icon: GitCommit,
    },
    {
      id: 'potential_well_energy' as P40Mode,
      labelEn: 'Potential Well & Energy',
      labelBn: 'মহাকর্ষীয় বিভব কূপ ও শক্তি',
      icon: Activity,
    },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-rose-500/20 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Disc className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold font-mono bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">
                P-40
              </span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {lang === 'bn' ? 'মহাকর্ষীয় বিভব, বিভব শক্তি ও গোলকের উপপাদ্য' : 'Gravitational Potential, Energy & Spherical Theorems'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {lang === 'bn'
                ? 'E = -dV/dr • ফাঁপা ও নিরেট গোলকে E ও V • ভূ-সুড়ঙ্গে SHM স্পন্দন (T = ৮৪.৬ মিনিট)'
                : "E = -dV/dr • Hollow & Solid Sphere Theorems • Earth Tunnel SHM (T = 84.6 min)"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning((p) => !p)}
            className={`p-2 rounded-lg text-white font-medium flex items-center gap-1 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-md'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-md'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMath((p) => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showMath
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'গাণিতিক প্রমাণ' : 'Math Proofs'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400"
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};
