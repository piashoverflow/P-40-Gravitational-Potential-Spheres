export type P40Mode = 'solid_sphere_theorems' | 'hollow_sphere_theorems' | 'tunnel_through_earth' | 'potential_well_energy';

export interface SolidSphereParams {
  probeRadiusFrac: number; // 0 to 3.0 R
  sphereMass: number; // 10^24 kg
  sphereRadiusKm: number; // 6371 km
}

export interface HollowSphereParams {
  probeRadiusFrac: number; // 0 to 3.0 R
  shellMass: number; // 10^24 kg
  shellRadiusKm: number; // 6371 km
}

export interface TunnelParams {
  sphereType: 'solid_earth' | 'hollow_shell';
  tunnelAngleDeg: number; // 0 (diametric) to 45 deg
  particleMass: number; // kg
  dampingFactor: number; // 0 (frictionless) to 0.05
}

export interface PotentialWellParams {
  centralMass: number;
  initialHeightFrac: number;
  showEquipotentialLines: boolean;
}
