import React, { useState, useEffect, useRef } from 'react';
import { Language, PresetMode, AppTheme, SimulationParams, TelemetryState } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MotionCanvas } from './components/MotionCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TheoryModal } from './components/TheoryModal';
import { G_UNIVERSAL, R_EARTH_METERS, M_EARTH_KG } from './utils/physics';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<AppTheme>('clean_bright');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialParams: SimulationParams = {
    preset: 'potential_well',
    theme: 'clean_bright',
    centralMass: 5.972, // 10^24 kg
    sphereRadius: 6.371, // 10^6 m
    probeDist: 10.0, // 10^6 m
    testMass: 100, // kg
    tunnelAmplitudeKm: 6371, // km
    tunnelFriction: 0,
    showVectors: true,
    showEnergyBars: true,
    showGrid: true,
    slowMo: false,
  };

  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Compute Telemetry
  const computeTelemetry = (p: SimulationParams, simTime: number = 0): TelemetryState => {
    const M = p.centralMass * 1e24;
    const R = p.sphereRadius * 1e6;
    const r = p.probeDist * 1e6;
    const m = p.testMass;

    // Surface & Center potential
    const Vs = -(G_UNIVERSAL * M) / R; // J/kg
    const Vc = 1.5 * Vs; // J/kg

    let curV = 0;
    let curE = 0;

    if (p.preset === 'potential_well') {
      curV = -(G_UNIVERSAL * M) / r;
      curE = (G_UNIVERSAL * M) / (r * r);
    } else if (p.preset === 'hollow_sphere') {
      if (r < R) {
        curV = Vs; // Constant inside
        curE = 0; // Shielded
      } else {
        curV = -(G_UNIVERSAL * M) / r;
        curE = (G_UNIVERSAL * M) / (r * r);
      }
    } else if (p.preset === 'solid_sphere') {
      if (r < R) {
        curV = -((G_UNIVERSAL * M) / (2 * Math.pow(R, 3))) * (3 * R * R - r * r);
        curE = (G_UNIVERSAL * M * r) / Math.pow(R, 3);
      } else {
        curV = -(G_UNIVERSAL * M) / r;
        curE = (G_UNIVERSAL * M) / (r * r);
      }
    }

    const curU = curV * m; // J

    // Tunnel SHM
    const omega = Math.sqrt(9.81 / R_EARTH_METERS); // rad/s ≈ 1.24e-3
    const tunnelYKm = p.tunnelAmplitudeKm * Math.cos(omega * simTime);
    const tunnelVKmS = -(p.tunnelAmplitudeKm * omega) * Math.sin(omega * simTime);
    const tunnelAcc = -omega * omega * (tunnelYKm * 1000);
    const ke = 0.5 * m * Math.pow(tunnelVKmS * 1000, 2);
    const pe = 0.5 * (m * 9.81 / R_EARTH_METERS) * Math.pow(tunnelYKm * 1000, 2);

    return {
      elapsedTime: simTime,
      potentialV: curV / 1e6, // MJ/kg
      potentialEnergyU: curU / 1e9, // GJ
      fieldE: curE,
      surfaceV: Vs / 1e6,
      centerV: Vc / 1e6,
      vRatio: p.preset === 'solid_sphere' ? 1.5 : 1.0,
      tunnelPosKm: tunnelYKm,
      tunnelVelKmS: tunnelVKmS,
      tunnelAccMS2: tunnelAcc,
      kineticEnergyGJ: ke / 1e9,
      potentialEnergyGJ: pe / 1e9,
      totalEnergyGJ: (ke + pe) / 1e9,
      shmPeriodMin: (2 * Math.PI / omega) / 60, // 84.6 min
      transitTimeMin: (Math.PI / omega) / 60, // 42.3 min
    };
  };

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => computeTelemetry(initialParams, 0));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const handleReset = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    setTelemetry(computeTelemetry(params, 0));
  };

  const handleResetDefaults = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const restored = { ...initialParams, preset: params.preset };
    setParams(restored);
    setTelemetry(computeTelemetry(restored, 0));
  };

  const handlePresetSelect = (newPreset: PresetMode) => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const next = { ...params, preset: newPreset };
    setParams(next);
    setTelemetry(computeTelemetry(next, 0));
  };

  const handleStep = () => {
    setTelemetry((prev) => computeTelemetry(params, prev.elapsedTime + 20));
  };

  const handleParamsUpdate = (updater: (prev: SimulationParams) => SimulationParams) => {
    setParams((prev) => {
      const next = updater(prev);
      setTelemetry((prevTel) => computeTelemetry(next, prevTel.elapsedTime));
      return next;
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Accelerated time scale for SHM (60s simulation per real sec)
      const simDt = dt * 120 * (params.slowMo ? 0.25 : 1.0);

      setTelemetry((prev) => computeTelemetry(params, prev.elapsedTime + simDt));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, params]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
      {/* 1. Udvash Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        preset={params.preset}
        onSelectPreset={handlePresetSelect}
        onOpenTheory={() => setIsModalOpen(true)}
        onReset={handleReset}
      />

      {/* 2. Main 3-Column Workspace */}
      <main className="max-w-[1780px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col lg:flex-row gap-4 items-start">
        <ControlPanel
          language={language}
          params={params}
          onChangeParams={handleParamsUpdate}
          onResetDefaults={handleResetDefaults}
        />

        <MotionCanvas
          language={language}
          theme={theme}
          params={params}
          telemetry={telemetry}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onStep={handleStep}
          onReset={handleReset}
          onToggleSlowMo={() => setParams((prev) => ({ ...prev, slowMo: !prev.slowMo }))}
        />

        <AnalyticsPanel
          language={language}
          params={params}
          telemetry={telemetry}
        />
      </main>

      {/* 3. Theory Modal */}
      <TheoryModal
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
