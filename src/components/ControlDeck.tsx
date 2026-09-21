import React from 'react';
import { P40Mode, SolidSphereParams, HollowSphereParams, TunnelParams, PotentialWellParams } from '../types';
import { Sliders, Disc, CircleDot, GitCommit, Activity } from 'lucide-react';

interface ControlDeckProps {
  mode: P40Mode;
  solidParams: SolidSphereParams;
  setSolidParams: React.Dispatch<React.SetStateAction<SolidSphereParams>>;
  hollowParams: HollowSphereParams;
  setHollowParams: React.Dispatch<React.SetStateAction<HollowSphereParams>>;
  tunnelParams: TunnelParams;
  setTunnelParams: React.Dispatch<React.SetStateAction<TunnelParams>>;
  wellParams: PotentialWellParams;
  setWellParams: React.Dispatch<React.SetStateAction<PotentialWellParams>>;
  lang: 'en' | 'bn';
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  mode,
  solidParams,
  setSolidParams,
  hollowParams,
  setHollowParams,
  tunnelParams,
  setTunnelParams,
  wellParams,
  setWellParams,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-rose-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {lang === 'bn' ? 'প্যারামিটার ও প্রিসেট' : 'Parameters & Presets'}
        </h2>
      </div>

      {/* MODE 1: SOLID SPHERE */}
      {mode === 'solid_sphere_theorems' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'প্রোব ব্যাসার্ধ (Probe Radius r/R)' : 'Radial Probe (r / R)'}</span>
              <span className="font-mono text-rose-400">{solidParams.probeRadiusFrac.toFixed(2)} R</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.02"
              value={solidParams.probeRadiusFrac}
              onChange={(e) =>
                setSolidParams((p) => ({ ...p, probeRadiusFrac: parseFloat(e.target.value) }))
              }
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { name: 'Center (0)', r: 0.0 },
              { name: 'Surface (1R)', r: 1.0 },
              { name: 'Space (2R)', r: 2.0 },
            ].map((b) => (
              <button
                key={b.name}
                onClick={() => setSolidParams((p) => ({ ...p, probeRadiusFrac: b.r }))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 font-mono"
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
            <div className="text-cyan-400 font-bold">{lang === 'bn' ? 'নিরেট গোলকের সূত্র:' : 'Solid Sphere Laws:'}</div>
            <div>r ≤ R: E = (GM/R³) r</div>
            <div>r ≤ R: V = -GM/(2R³)·(3R² - r²)</div>
            <div className="text-amber-400 font-bold">V_center = 1.5 · V_surface</div>
          </div>
        </div>
      )}

      {/* MODE 2: HOLLOW SHELL */}
      {mode === 'hollow_sphere_theorems' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'প্রোব ব্যাসার্ধ (Probe Radius r/R)' : 'Radial Probe (r / R)'}</span>
              <span className="font-mono text-emerald-400">{hollowParams.probeRadiusFrac.toFixed(2)} R</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.02"
              value={hollowParams.probeRadiusFrac}
              onChange={(e) =>
                setHollowParams((p) => ({ ...p, probeRadiusFrac: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { name: 'Inside (0.5R)', r: 0.5 },
              { name: 'Shell (1.0R)', r: 1.0 },
              { name: 'Outside (2R)', r: 2.0 },
            ].map((b) => (
              <button
                key={b.name}
                onClick={() => setHollowParams((p) => ({ ...p, probeRadiusFrac: b.r }))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 font-mono"
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
            <div className="text-emerald-400 font-bold">{lang === 'bn' ? 'খোলক উপপাদ্য:' : 'Shell Theorems:'}</div>
            <div>r &lt; R: E = 0 (বল শূন্য)</div>
            <div>r ≤ R: V = -GM/R (ধ্রুবক)</div>
            <div>r ≥ R: E = GM/r², V = -GM/r</div>
          </div>
        </div>
      )}

      {/* MODE 3: TUNNEL SHM */}
      {mode === 'tunnel_through_earth' && (
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-1">
              {lang === 'bn' ? 'সুড়ঙ্গের ধরন নির্বাচন:' : 'Tunnel Medium Type:'}
            </span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTunnelParams((p) => ({ ...p, sphereType: 'solid_earth' }))}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  tunnelParams.sphereType === 'solid_earth'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'নিরেট পৃথিবী (SHM)' : 'Solid Earth (SHM)'}
              </button>
              <button
                onClick={() => setTunnelParams((p) => ({ ...p, sphereType: 'hollow_shell' }))}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  tunnelParams.sphereType === 'hollow_shell'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'ফাঁপা খোলক (Drift)' : 'Hollow (Drift)'}
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
            <div className="text-amber-400 font-bold">{lang === 'bn' ? 'SHM সমীকরণ:' : 'SHM Equation:'}</div>
            <div>F = -mg·(r/R) = -kx</div>
            <div>k = mg / R</div>
            <div>T = 2π√(m/k) = 2π√(R/g)</div>
            <div className="text-emerald-400 font-bold">T ≈ 84.6 minutes</div>
          </div>
        </div>
      )}

      {/* MODE 4: POTENTIAL WELL */}
      {mode === 'potential_well_energy' && (
        <div className="space-y-4 text-xs">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
            <div className="text-pink-400 font-bold">{lang === 'bn' ? 'শক্তি সংরক্ষণ নীতি:' : 'Conservation of Energy:'}</div>
            <div>K = 1/2 m v² (গতিশক্তি)</div>
            <div>U = -GMm/r (বিভব শক্তি)</div>
            <div>E = K + U = ধ্রুবক</div>
            <div className="text-cyan-400 font-bold">আকর্ষণীয় ক্ষেত্রে সর্বদা E &lt; 0 (বদ্ধ কক্ষপথ)</div>
          </div>
        </div>
      )}
    </div>
  );
};
