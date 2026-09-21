import React from 'react';
import { SimulationParams, Language } from '../types';
import { t } from '../utils/i18n';
import { 
  Sliders, 
  RotateCcw, 
  Zap, 
  Circle, 
  Disc, 
  MoveVertical, 
  Eye, 
  Sparkles 
} from 'lucide-react';

interface ControlPanelProps {
  language: Language;
  params: SimulationParams;
  onChangeParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onChangeParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        {/* Header with Reset Defaults */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
              {t(language, 'controlParameters')}
            </h2>
          </div>

          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t(language, 'resetDefaults')}</span>
          </button>
        </div>

        {/* Tab 1: Potential Well */}
        {params.preset === 'potential_well' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'centralMass')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {params.centralMass} × 10²⁴ kg
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={params.centralMass}
                onChange={(e) => updateParam('centralMass', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'probeDistance')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  r = {params.probeDist} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="0.5"
                value={params.probeDist}
                onChange={(e) => updateParam('probeDist', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'testMass')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  m = {params.testMass} kg
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={params.testMass}
                onChange={(e) => updateParam('testMass', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Hollow Sphere */}
        {params.preset === 'hollow_sphere' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'sphereRadius')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  R = {params.sphereRadius} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="0.5"
                value={params.sphereRadius}
                onChange={(e) => updateParam('sphereRadius', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'probeDistance')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  r = {params.probeDist} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                step="0.2"
                value={params.probeDist}
                onChange={(e) => updateParam('probeDist', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => updateParam('probeDist', params.sphereRadius * 0.5)}
                className="text-[10px] px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-amber-900 font-bold"
              >
                ভিতরে (r &lt; R, E = 0)
              </button>
              <button
                onClick={() => updateParam('probeDist', params.sphereRadius)}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold"
              >
                পৃষ্ঠে (r = R)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Solid Sphere */}
        {params.preset === 'solid_sphere' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'probeDistance')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  r = {params.probeDist} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                step="0.2"
                value={params.probeDist}
                onChange={(e) => updateParam('probeDist', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => updateParam('probeDist', 0)}
                className="text-[10px] px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-amber-900 font-bold"
              >
                কেন্দ্রে (1.5 V_s)
              </button>
              <button
                onClick={() => updateParam('probeDist', params.sphereRadius)}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold"
              >
                পৃষ্ঠে (V_s)
              </button>
              <button
                onClick={() => updateParam('probeDist', params.sphereRadius * 2)}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold"
              >
                বাইরে (r = 2R)
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Earth Tunnel SHM */}
        {params.preset === 'earth_tunnel' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'tunnelAmplitude')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  A = {params.tunnelAmplitudeKm} km
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6371"
                step="200"
                value={params.tunnelAmplitudeKm}
                onChange={(e) => updateParam('tunnelAmplitudeKm', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <button
              onClick={() => updateParam('tunnelAmplitudeKm', 6371)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ভূপৃষ্ঠ হতে মুক্ত করুন (A = R = 6371 km)</span>
            </button>
          </div>
        )}

        {/* Visualizer Toggles */}
        <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
          <div className="text-[11px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>{t(language, 'visualizerToggles')}</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showVectors}
              onChange={(e) => updateParam('showVectors', e.target.checked)}
              className="accent-amber-600 rounded"
            />
            <span>{t(language, 'showVectors')}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => updateParam('showGrid', e.target.checked)}
              className="accent-amber-600 rounded"
            />
            <span>{t(language, 'showGrid')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
