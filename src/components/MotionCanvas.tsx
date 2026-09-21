import React, { useRef, useEffect, useState } from 'react';
import { SimulationParams, TelemetryState, Language, AppTheme } from '../types';
import { drawRoundRect, drawVectorArrow, fmtNum, fmtSci } from '../utils/physics';
import { t } from '../utils/i18n';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface MotionCanvasProps {
  language: Language;
  theme: AppTheme;
  params: SimulationParams;
  telemetry: TelemetryState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onToggleSlowMo: () => void;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  language,
  params,
  telemetry,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onToggleSlowMo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520,
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.max(480, Math.min(640, Math.round(entry.contentRect.width * 0.58)));
      setContainerDimensions({ width: w, height: h });
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = containerDimensions;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0f121d';
    ctx.fillRect(0, 0, width, height);

    if (params.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // ==========================================
    // PRESET 1: POTENTIAL WELL
    // ==========================================
    if (params.preset === 'potential_well') {
      const centerX = width * 0.45;
      const baseZeroY = 60; // V = 0 line at infinity

      // Zero Potential Line at Infinity
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, baseZeroY);
      ctx.lineTo(width - 40, baseZeroY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('অসীমে বিভব V = 0 (Reference Level at Infinity)', 45, baseZeroY - 10);

      // Potential Well Curve: y = baseZeroY + C / r
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const cConst = 1800;
      for (let x = 40; x <= width - 40; x += 3) {
        const dist = Math.abs(x - centerX);
        if (dist < 18) continue;
        const depth = Math.min(height - 120, cConst / (dist * 0.12));
        const y = baseZeroY + depth;
        if (x === 40 || dist === 19) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Central Mass
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(centerX, height - 70, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('M', centerX, height - 66);

      // Probe on curve (oscillates/rolls down and up when playing)
      const rollOffset = isPlaying ? Math.sin(telemetry.elapsedTime * 2.5) * (width * 0.08) : 0;
      const baseDistPix = Math.min(width * 0.4, Math.max(30, (params.probeDist / 25) * (width * 0.38)));
      const probeDistPix = Math.max(25, baseDistPix + rollOffset);
      const probeX = centerX + probeDistPix;
      const probeDepth = Math.min(height - 120, cConst / (probeDistPix * 0.12));
      const probeY = baseZeroY + probeDepth;

      // Vertical drop line from zero reference
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(probeX, baseZeroY);
      ctx.lineTo(probeX, probeY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(probeX, probeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`V = ${fmtNum(telemetry.potentialV, 1)} MJ/kg`, probeX + 14, probeY - 5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`U = ${fmtNum(telemetry.potentialEnergyU, 1)} GJ`, probeX + 14, probeY + 12);
    }

    // ==========================================
    // PRESET 2: HOLLOW SPHERE (Shell Theorem)
    // ==========================================
    else if (params.preset === 'hollow_sphere') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const rPix = Math.min(width, height) * 0.34;

      // Hollow Shell cavity
      const isInside = params.probeDist < params.sphereRadius;

      // Cavity fill
      ctx.fillStyle = isInside ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix, 0, Math.PI * 2);
      ctx.fill();

      // Shell wall
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix, 0, Math.PI * 2);
      ctx.stroke();

      // Center
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Probe (revolves around shell when playing)
      const probeScale = rPix / (params.sphereRadius || 1);
      const probeR = params.probeDist * probeScale;
      const probeAngle = -Math.PI / 4 + (isPlaying ? telemetry.elapsedTime * 0.6 : 0);
      const px = centerX + probeR * Math.cos(probeAngle);
      const py = centerY + probeR * Math.sin(probeAngle);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Field vector
      if (!isInside) {
        const eLen = Math.min(50, Math.max(12, telemetry.fieldE * 5));
        drawVectorArrow(ctx, px, py, px - eLen * Math.cos(probeAngle), py - eLen * Math.sin(probeAngle), '#22c55e', `E = ${fmtNum(telemetry.fieldE, 2)}`, 7);
      } else {
        // Zero Field Badge inside
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️ ফাঁপা গোলকের অভ্যন্তরে মহাকর্ষীয় প্রাবল্য E = 0 (মহাকর্ষীয় আবরণ)', centerX, 40);
        ctx.fillStyle = '#fef08a';
        ctx.fillText(`অভ্যন্তরে সর্বত্র বিভব ধ্রুবক: V = -GM/R = ${fmtNum(telemetry.surfaceV, 1)} MJ/kg`, centerX, 65);
      }
    }

    // ==========================================
    // PRESET 3: SOLID SPHERE
    // ==========================================
    else if (params.preset === 'solid_sphere') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const rPix = Math.min(width, height) * 0.34;

      // Solid Sphere body
      const sphereGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, rPix);
      sphereGrad.addColorStop(0, '#f97316');
      sphereGrad.addColorStop(0.6, '#ea580c');
      sphereGrad.addColorStop(1, '#c2410c');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fed7aa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Golden Center Star
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px JetBrains Mono';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'right';
      ctx.fillText('V_c = 1.5 V_s', centerX - 8, centerY + 3);

      // Probe (revolves around sphere when playing)
      const probeScale = rPix / (params.sphereRadius || 1);
      const probeR = params.probeDist * probeScale;
      const probeAngle = -Math.PI / 4 + (isPlaying ? telemetry.elapsedTime * 0.6 : 0);
      const px = centerX + probeR * Math.cos(probeAngle);
      const py = centerY + probeR * Math.sin(probeAngle);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Field vector towards center
      if (probeR > 5) {
        const eLen = Math.min(50, Math.max(10, telemetry.fieldE * 5));
        drawVectorArrow(ctx, px, py, px - eLen * Math.cos(probeAngle), py - eLen * Math.sin(probeAngle), '#22c55e', `E = ${fmtNum(telemetry.fieldE, 2)}`, 7);
      }

      // Title note
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('★ নিরেট গোলকের কেন্দ্রে বিভব পৃষ্ঠের ১.৫ গুণ: V_center = 1.5 × V_surface', centerX, 40);
    }

    // ==========================================
    // PRESET 4: EARTH TUNNEL SHM
    // ==========================================
    else if (params.preset === 'earth_tunnel') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const rPix = Math.min(width, height) * 0.38;

      // Earth Globe
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Core
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Vertical Diametric Tunnel through Center
      const tunnelWidth = 14;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(centerX - tunnelWidth / 2, centerY - rPix, tunnelWidth, rPix * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(centerX - tunnelWidth / 2, centerY - rPix, tunnelWidth, rPix * 2);

      // Center mark
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Moving Capsule / Object in Tunnel
      const posNorm = telemetry.tunnelPosKm / 6371; // -1 to +1
      const objY = centerY - posNorm * rPix;

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(centerX, objY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Restoring Force Vector (towards center)
      if (Math.abs(posNorm) > 0.05) {
        const fDir = posNorm > 0 ? 1 : -1;
        const fLen = Math.abs(posNorm) * 40;
        drawVectorArrow(ctx, centerX, objY, centerX, objY + fDir * fLen, '#22c55e', 'F = -kr', 6);
      }

      // Live SHM Metrics
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`পর্যায়কাল T = 2π√(R/g) ≈ 84.6 মিনিট (এক প্রান্ত থেকে অন্য প্রান্তে 42.3 মিনিট)`, centerX, 40);
      ctx.fillText(`সর্বোচ্চ বেগ (কেন্দ্রে): v_max = √(gR) ≈ 7.91 km/s`, centerX, height - 30);
    }
  }, [containerDimensions, params, telemetry, language]);

  return (
    <div ref={containerRef} className="flex-1 w-full flex flex-col gap-3">
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${containerDimensions.height}px` }}
          className="block"
        />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors"
            title={isFullScreen ? t(language, 'exitFullScreen') : t(language, 'fullScreen')}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? t(language, 'pause') : t(language, 'play')}</span>
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(language, 'reset')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSlowMo}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              params.slowMo
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🐢 {t(language, 'slowMo')}
          </button>
        </div>
      </div>
    </div>
  );
};
