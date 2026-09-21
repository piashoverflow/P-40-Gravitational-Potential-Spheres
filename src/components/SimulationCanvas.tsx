import React, { useRef, useEffect } from 'react';
import { P40Mode, SolidSphereParams, HollowSphereParams, TunnelParams, PotentialWellParams } from '../types';

interface SimulationCanvasProps {
  mode: P40Mode;
  isRunning: boolean;
  speed: number;
  solidParams: SolidSphereParams;
  hollowParams: HollowSphereParams;
  tunnelParams: TunnelParams;
  wellParams: PotentialWellParams;
  time: number;
  setTime: (updater: (prev: number) => number) => void;
  lang: 'en' | 'bn';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  isRunning,
  speed,
  solidParams,
  hollowParams,
  tunnelParams,
  wellParams,
  time,
  setTime,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      if (isRunning) {
        setTime((t) => t + dt);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0612');
      bgGrad.addColorStop(1, '#150d24');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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

      if (mode === 'solid_sphere_theorems') {
        renderSolidSphere(ctx, width, height, solidParams, lang);
      } else if (mode === 'hollow_sphere_theorems') {
        renderHollowSphere(ctx, width, height, hollowParams, lang);
      } else if (mode === 'tunnel_through_earth') {
        renderTunnelSHM(ctx, width, height, time, tunnelParams, lang);
      } else if (mode === 'potential_well_energy') {
        renderPotentialWell(ctx, width, height, time, wellParams, lang);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, isRunning, speed, solidParams, hollowParams, tunnelParams, wellParams, time, lang, setTime]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={860}
        height={540}
        className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl border border-slate-800 bg-[#0c0818]"
      />
    </div>
  );
};

// =========================================================================
// MODE 1: SOLID SPHERE THEOREMS (E & V DUAL GRAPHS)
// =========================================================================
function renderSolidSphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: SolidSphereParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#fb7185';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'সুষম নিরেট গোলকে মহাকর্ষীয় প্রাবল্য (E) ও বিভব (V)-এর সমীকরণ'
      : "Solid Sphere Theorems: Gravitational Field Intensity E(r) & Potential V(r)",
    width / 2,
    30
  );

  const sphereCenterX = width * 0.25;
  const sphereCenterY = height * 0.52;
  const R_px = 110;

  // Draw Solid Sphere
  const sGrad = ctx.createRadialGradient(sphereCenterX, sphereCenterY, 10, sphereCenterX, sphereCenterY, R_px);
  sGrad.addColorStop(0, '#f43f5e');
  sGrad.addColorStop(0.7, '#be123c');
  sGrad.addColorStop(1, '#881337');
  ctx.fillStyle = sGrad;
  ctx.beginPath();
  ctx.arc(sphereCenterX, sphereCenterY, R_px, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Radial Probe Line
  const rFrac = p.probeRadiusFrac; // 0 to 3.0
  const probeDistPx = rFrac * R_px;

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sphereCenterX, sphereCenterY);
  ctx.lineTo(sphereCenterX + Math.min(probeDistPx, 240), sphereCenterY);
  ctx.stroke();

  // Probe dot
  const probePxX = sphereCenterX + probeDistPx;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(probePxX, sphereCenterY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Probe Label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`r = ${rFrac.toFixed(2)} R`, probePxX, sphereCenterY - 14);

  // Surface label
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px "Space Grotesk", sans-serif';
  ctx.fillText('Surface (r = R)', sphereCenterX + R_px, sphereCenterY + 22);

  // ==========================================
  // RIGHT SIDE: DUAL GRAPHS (TOP: E, BOTTOM: V)
  // ==========================================
  const graphLeft = width * 0.52;
  const graphW = width * 0.43;

  // 1. TOP GRAPH: E(r)
  const eGraphTop = 55;
  const eGraphH = 175;
  renderDualPlotCard(
    ctx,
    graphLeft,
    eGraphTop,
    graphW,
    eGraphH,
    'Field Intensity E(r)',
    'E',
    rFrac,
    (r) => (r <= 1.0 ? r : 1.0 / (r * r)),
    true,
    '#38bdf8'
  );

  // 2. BOTTOM GRAPH: V(r)
  const vGraphTop = 255;
  const vGraphH = 195;
  renderDualPlotCard(
    ctx,
    graphLeft,
    vGraphTop,
    graphW,
    vGraphH,
    'Gravitational Potential V(r)',
    'V',
    rFrac,
    // Parabolic inside: V(0) = -1.5, V(1) = -1.0. Outside: V(r) = -1/r
    (r) => (r <= 1.0 ? -0.5 * (3 - r * r) : -1.0 / r),
    false,
    '#f43f5e'
  );

  // Bottom Telemetry Strip
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, height - 68, width * 0.9, 52, 10);
  ctx.fill();
  ctx.stroke();

  // Calculated values
  let eValStr = '';
  let vValStr = '';
  if (rFrac <= 1.0) {
    eValStr = `E = (GM/R³)·r = ${rFrac.toFixed(2)} E_s  (Linear rise)`;
    vValStr = `V = -GM/(2R³)·(3R² - r²) = ${(-0.5 * (3 - rFrac * rFrac)).toFixed(2)} V_s  [At center r=0: V_c = 1.5 V_s]`;
  } else {
    eValStr = `E = GM/r² = ${(1 / (rFrac * rFrac)).toFixed(3)} E_s  (Inverse-square)`;
    vValStr = `V = -GM/r = ${(-1 / rFrac).toFixed(3)} V_s  (Hyperbolic decay)`;
  }

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(eValStr, width * 0.08, height - 44);

  ctx.fillStyle = '#fb7185';
  ctx.fillText(vValStr, width * 0.08, height - 24);
}

// =========================================================================
// MODE 2: HOLLOW SPHERICAL SHELL THEOREMS
// =========================================================================
function renderHollowSphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: HollowSphereParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'পাতলা ফাঁপা গোলকে মহাকর্ষীয় প্রাবল্য ও বিভব (খোলক উপপাদ্য / Shell Theorem)'
      : "Spherical Shell Theorems: Gravitational Field E(r) & Potential V(r)",
    width / 2,
    30
  );

  const sphereCenterX = width * 0.25;
  const sphereCenterY = height * 0.52;
  const R_px = 110;

  // Draw Hollow Shell
  ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.beginPath();
  ctx.arc(sphereCenterX, sphereCenterY, R_px, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Hollow Core Label
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Hollow Interior (ফাঁপা অভ্যন্তর)', sphereCenterX, sphereCenterY - 14);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('E = 0', sphereCenterX, sphereCenterY + 10);
  ctx.fillText('V = -GM/R (ধ্রুবক)', sphereCenterX, sphereCenterY + 28);

  // Probe Position
  const rFrac = p.probeRadiusFrac;
  const probeDistPx = rFrac * R_px;

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sphereCenterX, sphereCenterY);
  ctx.lineTo(sphereCenterX + Math.min(probeDistPx, 240), sphereCenterY);
  ctx.stroke();

  const probePxX = sphereCenterX + probeDistPx;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(probePxX, sphereCenterY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Right Side Dual Graphs
  const graphLeft = width * 0.52;
  const graphW = width * 0.43;

  // 1. TOP GRAPH: E(r) for shell (0 inside, jump at 1)
  const eGraphTop = 55;
  const eGraphH = 175;
  renderDualPlotCard(
    ctx,
    graphLeft,
    eGraphTop,
    graphW,
    eGraphH,
    'Hollow Shell E(r)',
    'E',
    rFrac,
    (r) => (r < 1.0 ? 0.0 : 1.0 / (r * r)),
    true,
    '#22c55e'
  );

  // 2. BOTTOM GRAPH: V(r) for shell (flat constant -1 inside)
  const vGraphTop = 255;
  const vGraphH = 195;
  renderDualPlotCard(
    ctx,
    graphLeft,
    vGraphTop,
    graphW,
    vGraphH,
    'Hollow Shell V(r)',
    'V',
    rFrac,
    (r) => (r <= 1.0 ? -1.0 : -1.0 / r),
    false,
    '#38bdf8'
  );

  // Bottom Telemetry Strip
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, height - 68, width * 0.9, 52, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  if (rFrac < 1.0) {
    ctx.fillText(
      `অভ্যন্তরে (r < R): E = 0 (কোনো মহাকর্ষ বল নেই)  |  বিভব V = -GM/R = ধ্রুবক (Constant)`,
      width * 0.08,
      height - 44
    );
    ctx.fillText(
      `যেহেতু বিভব সর্বত্র ধ্রুবক (dV/dr = 0), তাই প্রাবল্য E = -dV/dr = 0!`,
      width * 0.08,
      height - 24
    );
  } else {
    ctx.fillText(
      `বাইরে (r ≥ R): E = GM/r² = ${(1 / (rFrac * rFrac)).toFixed(3)} E_s  |  বিভব V = -GM/r = ${(-1 / rFrac).toFixed(3)} V_s`,
      width * 0.08,
      height - 44
    );
    ctx.fillText(
      `বাহ্যিক বিন্দুতে সম্পূর্ণ গোলকের ভর কেন্দ্রে পুঞ্জীভূত বিন্দুবস্তুর মতো আচরণ করে।`,
      width * 0.08,
      height - 24
    );
  }
}

// Plot card renderer helper
function renderDualPlotCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  yLabel: string,
  rFrac: number,
  valFn: (r: number) => number,
  isPositive: boolean,
  curveColor: string
) {
  // Background card
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Header Title
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 14, y + 20);

  // Coordinate Axes
  const axX = x + 40;
  const axW = w - 60;
  const axH = h - 55;
  const axY = isPositive ? y + h - 25 : y + 35; // zero line

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(axX, axY);
  ctx.lineTo(axX + axW, axY); // r axis
  ctx.moveTo(axX, isPositive ? axY - axH : axY);
  ctx.lineTo(axX, isPositive ? axY : axY + axH); // E or V axis
  ctx.stroke();

  // R Surface Mark
  const r1Px = axX + axW * (1.0 / 3.0);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(r1Px, y + 25);
  ctx.lineTo(r1Px, y + h - 15);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('R', r1Px, axY + (isPositive ? 14 : -6));
  ctx.fillText('2R', axX + axW * (2.0 / 3.0), axY + (isPositive ? 14 : -6));
  ctx.fillText('3R', axX + axW, axY + (isPositive ? 14 : -6));

  // Plot Curve
  ctx.strokeStyle = curveColor;
  ctx.lineWidth = 2.2;
  ctx.beginPath();

  const maxValScale = isPositive ? axH * 0.8 : axH * 0.55;
  let first = true;
  for (let px = 0; px <= axW; px += 2) {
    const r = (px / axW) * 3.0;
    const v = valFn(r);
    const plotY = isPositive ? axY - v * maxValScale : axY - v * maxValScale;
    if (first) {
      ctx.moveTo(axX + px, plotY);
      first = false;
    } else {
      ctx.lineTo(axX + px, plotY);
    }
  }
  ctx.stroke();

  // Current Probe Marker on Curve
  const probePxOnAx = axX + (rFrac / 3.0) * axW;
  const currentVal = valFn(rFrac);
  const probePlotY = isPositive ? axY - currentVal * maxValScale : axY - currentVal * maxValScale;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(probePxOnAx, probePlotY, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = curveColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// =========================================================================
// MODE 3: DIAMETRIC TUNNEL SIMPLE HARMONIC MOTION (SHM)
// =========================================================================
function renderTunnelSHM(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: TunnelParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'ভূ-সুড়ঙ্গে বস্তুর গতি: F = -kx ⟹ সরল ছন্দিত স্পন্দন (SHM: T = ৮৪.৬ মিনিট)'
      : "Motion Through a Frictionless Tunnel Through Earth: SHM (T = 84.6 minutes)",
    width / 2,
    30
  );

  const centerX = width * 0.38;
  const centerY = height * 0.52;
  const R_px = 150;

  // Draw Earth Body
  const isSolid = p.sphereType === 'solid_earth';
  if (isSolid) {
    const eGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, R_px);
    eGrad.addColorStop(0, '#f97316');
    eGrad.addColorStop(0.5, '#b45309');
    eGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = eGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, R_px, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Hollow shell
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, R_px, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw Tunnel Borehole (horizontal through center)
  const tunnelH = 26;
  ctx.fillStyle = '#060a14';
  ctx.fillRect(centerX - R_px, centerY - tunnelH / 2, R_px * 2, tunnelH);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(centerX - R_px, centerY - tunnelH / 2, R_px * 2, tunnelH);

  // Center Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - R_px - 15);
  ctx.lineTo(centerX, centerY + R_px + 15);
  ctx.stroke();
  ctx.setLineDash([]);

  // Kinematics Calculation:
  // omega = sqrt(g / R) = sqrt(9.81 / 6371000) = 1.24e-3 rad/s
  // T = 2 * pi / omega = 5075 s = 84.6 minutes
  // In simulation, we scale time:
  const simOmega = 1.2; // visual frequency
  let particleX_norm = 0; // -1 to 1
  let particleV_norm = 0;

  if (isSolid) {
    // SHM: x(t) = cos(omega * t)
    particleX_norm = Math.cos(simOmega * time);
    particleV_norm = -Math.sin(simOmega * time);
  } else {
    // Hollow: constant speed drift back and forth bouncing
    const cycle = (time * 0.8) % 4;
    if (cycle < 2) {
      particleX_norm = 1 - cycle; // 1 to -1
      particleV_norm = -1;
    } else {
      particleX_norm = -1 + (cycle - 2); // -1 to 1
      particleV_norm = 1;
    }
  }

  const particlePxX = centerX + particleX_norm * (R_px - 14);
  const particlePxY = centerY;

  // Draw Particle
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(particlePxX, particlePxY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Velocity Vector Arrow
  if (Math.abs(particleV_norm) > 0.05) {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    const vLen = particleV_norm * 35;
    ctx.beginPath();
    ctx.moveTo(particlePxX, particlePxY);
    ctx.lineTo(particlePxX + vLen, particlePxY);
    ctx.stroke();
  }

  // Right Side Telemetry Card
  const cardX = width * 0.68;
  const cardY = 70;
  const cardW = width * 0.29;
  const cardH = 360;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'bn' ? 'সুড়ঙ্গ গতির পরিমাপ:' : 'Tunnel Kinematics:', cardX + 16, cardY + 28);

  const realVmaxKmS = 7.91; // km/s
  const currentVKmS = Math.abs(particleV_norm) * realVmaxKmS;
  const currentXKm = particleX_norm * 6371;

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px "JetBrains Mono", monospace';
  const dataRows = [
    `Medium: ${isSolid ? 'SOLID EARTH' : 'HOLLOW SHELL'}`,
    `Motion Type:`,
    isSolid ? `Simple Harmonic (SHM)` : `Constant Velocity Drift`,
    ``,
    `Full Period T:`,
    `T = 2π√(R/g)`,
    `≈ 5,075 s = 84.6 min`,
    ``,
    `Half-Trip Time:`,
    `t_half = 42.3 min`,
    ``,
    `Max Velocity (Center):`,
    `v_max = √(gR) ≈ 7.91 km/s`,
    ``,
    `Current Position x:`,
    `${currentXKm.toFixed(0)} km`,
    `Current Speed:`,
    `${currentVKmS.toFixed(2)} km/s`,
  ];

  dataRows.forEach((row, i) => {
    ctx.fillText(row, cardX + 16, cardY + 54 + i * 16);
  });

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? '💡 চমকপ্রদ তথ্য: সুড়ঙ্গটি কেন্দ্র দিয়ে যাক বা যেকোনো জ্যা (chord) বরাবর হোক না কেন, সর্বত্রই পর্যায়কাল সর্বদা ঠিক ৮৪.৬ মিনিট থাকে!'
      : "💡 Remarkable Property: Whether the tunnel passes through the center or along any chord, the period is identically 84.6 min!",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 4: POTENTIAL WELL & ENERGY BAR
// =========================================================================
function renderPotentialWell(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: PotentialWellParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'মহাকর্ষীয় বিভব কূপ ও যান্ত্রিক শক্তি সংরক্ষণ: E_total = K + U = ধ্রুবক'
      : "Gravitational Potential Well & Mechanical Energy Conservation: E = K + U = Const",
    width / 2,
    30
  );

  const centerX = width * 0.45;
  const centerY = height * 0.28;
  const wellW = 280;

  // Draw 2D Potential Funnel U(r) = -k/r
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  for (let px = -wellW; px <= wellW; px += 4) {
    if (Math.abs(px) < 16) continue;
    const r = Math.abs(px);
    const uY = centerY + (2800 / r);
    if (px === -wellW) ctx.moveTo(centerX + px, uY);
    else ctx.lineTo(centerX + px, uY);
  }
  ctx.stroke();

  // Test mass oscillating in potential well
  const oscR = 50 + 70 * Math.abs(Math.sin(time * 1.5));
  const oscSign = Math.sin(time * 0.75) > 0 ? 1 : -1;
  const ballX = centerX + oscSign * oscR;
  const ballY = centerY + (2800 / oscR);

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Energy Bar Chart on the right
  const barX = width * 0.76;
  const barY = 80;
  const barW = 40;
  const barH = 240;

  // Kinetic & Potential fractions
  const uNorm = -1.0 / (oscR / 120); // negative
  const eTotalNorm = -0.4;
  const kNorm = Math.max(0, eTotalNorm - uNorm);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(barX - 15, barY - 15, barW + 70, barH + 60, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('Energy Split', barX - 5, barY + 5);

  // K bar (Green)
  const kHeight = Math.min(kNorm * 100, 100);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(barX, barY + 120 - kHeight, barW, kHeight);

  // U bar (Rose)
  const uHeight = Math.min(Math.abs(uNorm) * 100, 100);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(barX, barY + 125, barW, uHeight);

  ctx.fillStyle = '#22c55e';
  ctx.fillText('K (Kinetic)', barX + barW + 8, barY + 120 - kHeight / 2);
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('U (Potential)', barX + barW + 8, barY + 125 + uHeight / 2);

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ec4899';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'বিভব সর্বদা ঋণাত্মক (U = -GMm/r)। অসীম দূরত্বে (r = ∞) বিভব শূন্য এবং সর্বোচ্চ। আকর্ষণ বলের কারণে দূরত্ব কমলে বিভব শক্তি আরো ঋণাত্মক হয়!'
      : "Potential is strictly negative: U = -GMm/r. Zero at r = ∞ (maximum). Mechanical energy converts smoothly between K and U.",
    width * 0.1,
    height - 32
  );
}
