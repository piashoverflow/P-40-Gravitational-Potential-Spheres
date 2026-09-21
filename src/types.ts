export type Language = 'bn' | 'en';
export type AppTheme = 'clean_bright' | 'midnight';
export type PresetMode = 'potential_well' | 'hollow_sphere' | 'solid_sphere' | 'earth_tunnel';

export interface SimulationParams {
  preset: PresetMode;
  theme: AppTheme;

  // Potential Well & Spheres
  centralMass: number; // 10^24 kg (Earth = 5.972)
  sphereRadius: number; // 10^6 m (Earth = 6.371)
  probeDist: number; // 10^6 m (probe position r)
  testMass: number; // kg (default 100 kg)

  // Earth Tunnel SHM
  tunnelAmplitudeKm: number; // km (default 6371 km)
  tunnelFriction: number; // 0 for ideal SHM

  // Toggles
  showVectors: boolean;
  showEnergyBars: boolean;
  showGrid: boolean;
  slowMo: boolean;
}

export interface TelemetryState {
  elapsedTime: number;

  // Potential & Energy
  potentialV: number; // MJ/kg
  potentialEnergyU: number; // GJ
  fieldE: number; // N/kg
  surfaceV: number; // MJ/kg
  centerV: number; // MJ/kg
  vRatio: number; // V_c / V_s (1.5 for solid sphere, 1.0 for hollow)

  // Tunnel SHM
  tunnelPosKm: number; // km (-R to +R)
  tunnelVelKmS: number; // km/s
  tunnelAccMS2: number; // m/s^2
  kineticEnergyGJ: number;
  potentialEnergyGJ: number;
  totalEnergyGJ: number;
  shmPeriodMin: number; // 84.6 minutes
  transitTimeMin: number; // 42.3 minutes
}
