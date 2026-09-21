import { Language } from '../types';

export const translations = {
  bn: {
    // Header
    brandTitle: 'মহাকর্ষীয় বিভব ও গোলকীয় তত্ত্ব',
    brandSubtitle: 'ল্যাব',
    tabWell: 'বিভব কূপ ও বিভবশক্তি (V & U)',
    tabHollow: 'ফাঁপা গোলক (Hollow Shell)',
    tabSolid: 'নিরেট গোলক (Solid Sphere)',
    tabTunnel: 'ভূ-সুড়ঙ্গে স্পন্দন (Tunnel SHM)',
    theoryButton: 'থিওরি ও সমীকরণ',
    udvashBadge: 'উদ্ভাস (Udvash)',

    // Controls
    controlParameters: 'কন্ট্রোল প্যারামিটারস',
    resetDefaults: 'ডিফল্ট রিসেট',
    centralMass: 'গোলকের মোট ভর (M)',
    sphereRadius: 'গোলকের ব্যাসার্ধ (R)',
    probeDistance: 'দূরত্ব (r)',
    testMass: 'পরীক্ষাধীন ভর (m)',
    tunnelAmplitude: 'সুড়ঙ্গের বিস্তৃতি (A)',

    // Toggles
    visualizerToggles: 'ভিজ্যুয়ালাইজার অপশনস',
    showVectors: 'প্রাবল্য ও বিভব ভেক্টর',
    showEnergyBars: 'গতিশক্তি ও বিভবশক্তি বার',
    showGrid: 'স্থানাঙ্ক গ্রিড (Grid)',

    // Telemetry
    telemetryTitle: 'লাইভ পরিমাপ ও টেলিমেট্রি',
    potentialV: 'মহাকর্ষীয় বিভব (V = -GM/r)',
    potentialU: 'মহাকর্ষীয় বিভবশক্তি (U = -GMm/r)',
    fieldIntensityE: 'মহাকর্ষীয় প্রাবল্য (E = -dV/dr)',
    tunnelSpeed: 'সুড়ঙ্গে বেগ (v)',
    shmPeriod: 'সুড়ঙ্গের পর্যায়কাল (T = 2π√(R/g))',
    transitTime: 'এক প্রান্ত হতে অপর প্রান্তে সময়',

    // Math Box
    exactMathTitle: 'গাণিতিক সমীকরণ ও প্রতিস্থাপন',
    play: 'শুরু করুন',
    pause: 'থামুন',
    step: 'ধাপ (Step)',
    slowMo: '০.২৫x স্লো-মো',
    reset: 'রিসেট',
    fullScreen: 'পূর্ণ পর্দা',
    exitFullScreen: 'ছোট পর্দা',
  },
  en: {
    // Header
    brandTitle: 'Gravitational Potential & Spheres',
    brandSubtitle: 'LAB',
    tabWell: 'Potential Well & Energy (V & U)',
    tabHollow: 'Hollow Spherical Shell',
    tabSolid: 'Uniform Solid Sphere',
    tabTunnel: 'Earth Tunnel SHM',
    theoryButton: 'Theory & Proofs',
    udvashBadge: 'Udvash',

    // Controls
    controlParameters: 'Control Parameters',
    resetDefaults: 'Reset Defaults',
    centralMass: 'Central Sphere Mass (M)',
    sphereRadius: 'Sphere Radius (R)',
    probeDistance: 'Distance (r)',
    testMass: 'Test Mass (m)',
    tunnelAmplitude: 'Tunnel Amplitude (A)',

    // Toggles
    visualizerToggles: 'Visualizer Options',
    showVectors: 'Intensity & Potential Vectors',
    showEnergyBars: 'Kinetic & Potential Energy Bars',
    showGrid: 'Coordinate Grid',

    // Telemetry
    telemetryTitle: 'Live Potential Telemetry',
    potentialV: 'Gravitational Potential (V)',
    potentialU: 'Potential Energy (U)',
    fieldIntensityE: 'Field Intensity (E = -dV/dr)',
    tunnelSpeed: 'Tunnel Velocity (v)',
    shmPeriod: 'SHM Period (T = 2π√(R/g))',
    transitTime: 'One-Way Transit Time',

    // Math Box
    exactMathTitle: 'Mathematical Equations & Proof',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    slowMo: '0.25x Slow-Mo',
    reset: 'Reset',
    fullScreen: 'Fullscreen',
    exitFullScreen: 'Exit Fullscreen',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || key;
}
