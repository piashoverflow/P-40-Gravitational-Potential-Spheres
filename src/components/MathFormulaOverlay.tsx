import React from 'react';
import { MathView } from './MathView';
import { P40Mode } from '../types';
import { BookOpen, X } from 'lucide-react';

interface MathFormulaOverlayProps {
  mode: P40Mode;
  show: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const MathFormulaOverlay: React.FC<MathFormulaOverlayProps> = ({
  mode,
  show,
  onClose,
  lang,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-rose-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'P-40 মহাকর্ষীয় বিভব ও গোলক উপপাদ্যের প্রমাণ' : 'P-40 Gravitational Potential & Spherical Theorems'}
          </h2>
        </div>

        <div className="space-y-6 text-sm">
          {/* Definition */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-rose-400 font-bold text-base">
              {lang === 'bn' ? '১. মহাকর্ষীয় বিভব ও বিভব শক্তির সংজ্ঞা' : '1. Gravitational Potential & Potential Energy'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'অসীম দূরত্ব থেকে একক ধনাত্মক ভরকে মহাকর্ষীয় ক্ষেত্রের কোনো বিন্দুতে আনতে সম্পন্ন কাজের পরিমাণই হলো মহাকর্ষীয় বিভব:'
                : 'Work done by an external agent in bringing a unit mass from infinity to a point in gravitational field:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'মহাকর্ষীয় বিভব (V)' : 'Gravitational Potential (V)'}</div>
                <MathView math="V = -\frac{GM}{r} \quad (\text{J/kg})" block />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'মহাকর্ষীয় বিভব শক্তি (U)' : 'Potential Energy (U)'}</div>
                <MathView math="U = - \frac{GMm}{r} \quad (\text{Joules})" block />
              </div>
            </div>
            <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300">
              {lang === 'bn'
                ? 'প্রাবল্য ও বিভবের ব্যবকলনীয় সম্পর্ক: E = - \frac{dV}{dr} (প্রাবল্য হলো ঋণাত্মক বিভব গ্রেডিয়েন্ট)।'
                : 'Field-Potential Gradient Relation: E = - dV/dr.'}
            </div>
          </div>

          {/* Hollow Shell */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">
              {lang === 'bn' ? '২. পাতলা ফাঁপা গোলক খোলকের উপপাদ্য (Shell Theorems)' : '2. Thin Spherical Shell Theorems'}
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-900 rounded-lg">
                <span className="font-bold text-emerald-400">{lang === 'bn' ? 'অভ্যন্তরে (r < R): ' : 'Interior (r < R): '}</span>
                <MathView math="E = 0, \quad V = -\frac{GM}{R} = \text{constant}" />
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg">
                <span className="font-bold text-emerald-400">{lang === 'bn' ? 'পৃষ্ঠে ও বাইরে (r ≥ R): ' : 'Exterior (r ≥ R): '}</span>
                <MathView math="E = \frac{GM}{r^2}, \quad V = -\frac{GM}{r}" />
              </div>
            </div>
          </div>

          {/* Solid Sphere */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-cyan-400 font-bold text-base">
              {lang === 'bn' ? '৩. সুষম নিরেট গোলকের উপপাদ্য (Solid Sphere Theorems)' : '3. Uniform Solid Sphere Theorems'}
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-900 rounded-lg">
                <span className="font-bold text-cyan-400">{lang === 'bn' ? 'অভ্যন্তরে (r ≤ R): ' : 'Interior (r ≤ R): '}</span>
                <div className="mt-1"><MathView math="E(r) = \frac{GM}{R^3} r, \quad V(r) = -\frac{GM}{2R^3}(3R^2 - r^2)" block /></div>
              </div>
              <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                {lang === 'bn'
                  ? '💡 কেন্দ্রে বিভব (r = 0): V_c = -\frac{3GM}{2R} = 1.5 V_{\text{surface}} (কেন্দ্রের বিভব পৃষ্ঠের দেড়গুণ!)'
                  : '💡 At center (r = 0): V_c = - 1.5 GM/R = 1.5 V_surface (1.5 times the surface potential depth!)'}
              </div>
            </div>
          </div>

          {/* Tunnel SHM */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-amber-400 font-bold text-base">
              {lang === 'bn' ? '৪. ভূ-সুড়ঙ্গে সরল ছন্দিত স্পন্দন (SHM)' : '4. Simple Harmonic Motion Through Earth Tunnel'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'পৃথিবীর এক প্রান্ত থেকে অন্য প্রান্তে সুড়ঙ্গ দিয়ে বস্তু ফেলে দিলে প্রত্যায়নী বল সরণের সমানুপাতিক ও বিপরীতমুখী হয়:'
                : 'Restoring force is strictly proportional to displacement x from the center:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-emerald-300">
              <MathView math="F = -mg \frac{x}{R} = -kx \implies \omega = \sqrt{\frac{g}{R}}" block />
            </div>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-cyan-300">
              <MathView math="T = 2\pi\sqrt{\frac{R}{g}} \approx 84.6\text{ minutes}, \quad v_{\text{max}} = \sqrt{gR} \approx 7.91\text{ km/s}" block />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
