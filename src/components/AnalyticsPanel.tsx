import React, { useRef, useEffect } from 'react';
import { SimulationParams, TelemetryState, Language } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, fmtSci, G_UNIVERSAL } from '../utils/physics';
import { 
  Activity, 
  BarChart3, 
  Zap, 
  Clock, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

interface AnalyticsPanelProps {
  language: Language;
  params: SimulationParams;
  telemetry: TelemetryState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  language,
  params,
  telemetry,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 15);
    ctx.lineTo(35, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = '#94a3b8';

    // 1. Potential curve V(r) for Hollow and Solid spheres
    if (params.preset === 'hollow_sphere' || params.preset === 'solid_sphere') {
      ctx.fillText('-V (MJ/kg)', 40, 18);
      ctx.fillText('r (m)', w - 30, h - 6);

      ctx.strokeStyle = params.preset === 'solid_sphere' ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const R = params.sphereRadius;
      for (let x = 0; x <= w - 45; x += 2) {
        const simR = (x / (w - 45)) * (3 * R);
        let vVal = 0;

        if (params.preset === 'hollow_sphere') {
          vVal = simR < R ? 1 : R / simR;
        } else {
          // Solid sphere
          if (simR < R) {
            vVal = 0.5 * (3 - (simR * simR) / (R * R)); // 1.5 at r=0, 1.0 at r=R
          } else {
            vVal = R / simR;
          }
        }

        const yPix = 20 + (vVal / 1.5) * (h - 45);
        if (x === 0) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();

      // Probe point
      const probeRatio = params.probeDist / (3 * R);
      let probeV = 0;
      if (params.preset === 'hollow_sphere') {
        probeV = params.probeDist < R ? 1 : R / params.probeDist;
      } else {
        if (params.probeDist < R) {
          probeV = 0.5 * (3 - (params.probeDist * params.probeDist) / (R * R));
        } else {
          probeV = R / params.probeDist;
        }
      }
      const ptX = 35 + probeRatio * (w - 45);
      const ptY = 20 + (probeV / 1.5) * (h - 45);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, ptX), Math.max(15, ptY), 5, 0, Math.PI * 2);
      ctx.fill();
    }
    // 2. Earth Tunnel SHM Wave
    else if (params.preset === 'earth_tunnel') {
      ctx.fillText('y (km)', 40, 18);
      ctx.fillText('t', w - 20, h - 6);

      const midY = (h - 20) * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(35, midY);
      ctx.lineTo(w - 10, midY);
      ctx.stroke();

      // Sine wave
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w - 45; x += 2) {
        const theta = (x / (w - 45)) * Math.PI * 3 + telemetry.elapsedTime * 0.8;
        const yPix = midY - Math.cos(theta) * (midY - 20);
        if (x === 0) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();
    }
  }, [params, telemetry]);

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3">
      {/* 1. Live Telemetry Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'telemetryTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {params.preset !== 'earth_tunnel' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'potentialV')}</span>
                <span className="font-mono font-black text-amber-700 text-sm mt-0.5">
                  {fmtNum(telemetry.potentialV, 2)} MJ/kg
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'fieldIntensityE')}</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  {fmtNum(telemetry.fieldE, 2)} N/kg
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'potentialU')} (m = {params.testMass} kg)</span>
                <span className="font-mono font-black text-slate-900 text-sm mt-0.5">
                  U = {fmtNum(telemetry.potentialEnergyU, 2)} GJ
                </span>
              </div>
            </>
          )}

          {params.preset === 'earth_tunnel' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'tunnelSpeed')}</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  v = {fmtNum(telemetry.tunnelVelKmS, 2)} km/s
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">অবস্থান (y)</span>
                <span className="font-mono font-black text-sky-700 text-sm mt-0.5">
                  {fmtNum(telemetry.tunnelPosKm, 0)} km
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'shmPeriod')}</span>
                <span className="font-mono font-black text-indigo-700 text-sm mt-0.5">
                  T ≈ 84.6 মিনিট (একমুখী অতিক্রমণ 42.3 মিনিট)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Graph */}
        <div className="mt-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>বিভব ও স্পন্দন গতিবিদ্যা গ্রাফ</span>
          </span>
          <div className="w-full h-28 bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <canvas ref={chartCanvasRef} width={320} height={112} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Mathematical Proof */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="p-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'exactMathTitle')}
          </h3>
        </div>

        {params.preset === 'hollow_sphere' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-sky-800 font-black block">ফাঁপা গোলক (Shell Theorem):</span>
              <p className="text-slate-700 font-medium">
                ভিতরে (r &lt; R): E = 0 এবং V = -GM/R = {fmtNum(telemetry.surfaceV, 1)} MJ/kg
              </p>
              <p className="text-emerald-800 font-bold mt-1">
                dV/dr = 0  ➔  E = -dV/dr = 0 (মহাকর্ষীয় আবরণ)
              </p>
            </div>
          </div>
        )}

        {params.preset === 'solid_sphere' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-amber-800 font-black block">নিরেট গোলকের কেন্দ্রের বিভব:</span>
              <p className="text-slate-700 font-medium">
                V_center = 1.5 × V_surface = 1.5 × (-GM/R)
              </p>
              <p className="text-slate-900 font-black text-sm mt-1">
                = {fmtNum(telemetry.centerV, 2)} MJ/kg
              </p>
            </div>
          </div>
        )}

        {params.preset === 'earth_tunnel' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-indigo-800 font-black block">সুড়ঙ্গে সরল ছন্দিত স্পন্দন:</span>
              <p className="text-slate-700 font-medium">
                F = - (mg/R) y  ➔  ω = √(g/R) = 1.24 × 10⁻³ rad/s
              </p>
              <p className="text-slate-900 font-black mt-1">
                T = 2π √(R/g) = 5076 s ≈ 84.6 min
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
