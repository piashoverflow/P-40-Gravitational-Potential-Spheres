import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathFormulaOverlay } from './components/MathFormulaOverlay';
import { P40Mode, SolidSphereParams, HollowSphereParams, TunnelParams, PotentialWellParams } from './types';

export default function App() {
  const [mode, setMode] = useState<P40Mode>('solid_sphere_theorems');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showMath, setShowMath] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [time, setTime] = useState<number>(0);

  const [solidParams, setSolidParams] = useState<SolidSphereParams>({
    probeRadiusFrac: 0.8,
    sphereMass: 6.0,
    sphereRadiusKm: 6371,
  });

  const [hollowParams, setHollowParams] = useState<HollowSphereParams>({
    probeRadiusFrac: 0.5,
    shellMass: 6.0,
    shellRadiusKm: 6371,
  });

  const [tunnelParams, setTunnelParams] = useState<TunnelParams>({
    sphereType: 'solid_earth',
    tunnelAngleDeg: 0,
    particleMass: 10,
    dampingFactor: 0,
  });

  const [wellParams, setWellParams] = useState<PotentialWellParams>({
    centralMass: 1.0,
    initialHeightFrac: 0.5,
    showEquipotentialLines: true,
  });

  const handleReset = () => {
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-[#0a0612] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header
        mode={mode}
        setMode={setMode}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        showMath={showMath}
        setShowMath={setShowMath}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <SimulationCanvas
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            solidParams={solidParams}
            hollowParams={hollowParams}
            tunnelParams={tunnelParams}
            wellParams={wellParams}
            time={time}
            setTime={setTime}
            lang={lang}
          />
        </div>

        <div className="lg:col-span-1">
          <ControlDeck
            mode={mode}
            solidParams={solidParams}
            setSolidParams={setSolidParams}
            hollowParams={hollowParams}
            setHollowParams={setHollowParams}
            tunnelParams={tunnelParams}
            setTunnelParams={setTunnelParams}
            wellParams={wellParams}
            setWellParams={setWellParams}
            lang={lang}
          />
        </div>
      </main>

      <MathFormulaOverlay
        mode={mode}
        show={showMath}
        onClose={() => setShowMath(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-900 px-4 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-mono text-slate-400">P-40 Gravitational Potential & Spherical Theorems Lab</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-rose-400">Shamsuddin Piash</span>
            <span>• BUET ME '25</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
