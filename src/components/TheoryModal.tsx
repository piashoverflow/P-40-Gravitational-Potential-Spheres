import React from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { X, BookOpen, GraduationCap } from 'lucide-react';

interface TheoryModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'bn' ? 'তত্ত্ব ও একাডেমিক প্রমাণ (P-40)' : 'Theory & Derivations (P-40)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                HSC Physics 1st Paper, Chapter 6: মহাকর্ষীয় বিভব, গোলকীয় শেল তত্ত্ব ও সুড়ঙ্গ স্পন্দন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Potential & Energy */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              ১. মহাকর্ষীয় বিভব ও বিভবশক্তি (Potential & Potential Energy)
            </h3>
            <p>
              অসীম দূরত্ব হতে একক ভরের কোনো বস্তুকে মহাকর্ষীয় ক্ষেত্রের কোনো বিন্দুতে আনতে মহাকর্ষ বল দ্বারা সম্পন্ন কাজকে ঐ বিন্দুর <strong>মহাকর্ষীয় বিভব (V)</strong> বলে:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              V = - GM / r &nbsp;&nbsp;|&nbsp;&nbsp; U = m·V = - GMm / r
            </div>
            <p className="text-xs text-slate-600">
              অসীমে বিভব শূন্য (V_∞ = 0) ধরা হয়। আকর্ষণধর্মী বলের কারণে যেকোনো সসীম দূরত্বে বিভব সর্বদা ঋণাত্মক হয়।
            </p>
          </div>

          {/* Section 2: Hollow Sphere Shell Theorem */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              ২. ফাঁপা গোলকের শেল উপপাদ্য (Shell Theorem)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                <strong className="text-sky-950 font-bold block">★ গোলকের অভ্যন্তরে (r &lt; R):</strong>
                <p className="font-mono text-sky-800">E = 0 (মহাকর্ষীয় আবরণ)</p>
                <p className="font-mono text-sky-800">V = - GM / R = Constant</p>
                <span className="text-[11px] text-slate-600 font-sans block">অভ্যন্তরে সর্বত্র বিভব পৃষ্ঠের বিভবের সমান ও ধ্রুবক।</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <strong className="text-slate-900 font-bold block">★ গোলকের বাইরে (r ≥ R):</strong>
                <p className="font-mono text-slate-800">E = GM / r²</p>
                <p className="font-mono text-slate-800">V = - GM / r</p>
                <span className="text-[11px] text-slate-600 font-sans block">সমস্ত ভর কেন্দ্রে কেন্দ্রীভূত বিন্দুবস্তুর ন্যায় আচরণ করে।</span>
              </div>
            </div>
          </div>

          {/* Section 3: Solid Sphere */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              ৩. নিরেট গোলকের বিভব (Solid Sphere Potential)
            </h3>
            <p>R ব্যাসার্ধের সুষম ঘনত্বের নিরেট গোলকের ক্ষেত্রে:</p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900 space-y-1">
              <p>অভ্যন্তরে (r &lt; R): V(r) = - (GM / 2R³) · (3R² - r²)</p>
              <p className="text-amber-800">কেন্দ্রে (r = 0): V_center = - 1.5 · (GM / R) = 1.5 × V_surface</p>
            </div>
          </div>

          {/* Section 4: Earth Tunnel SHM */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ৪. পৃথিবীর কেন্দ্রগামী সুড়ঙ্গে সরল ছন্দিত স্পন্দন (Earth Tunnel SHM)
            </h3>
            <p>
              পৃথিবীর কেন্দ্র বরাবর সুড়ঙ্গ খনন করে বস্তু ছেড়ে দিলে কার্যকর প্রত্যয়নী বল F = - (mg/R) y, যা হুকের সূত্র F = - ky মেনে চলে:
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-center text-xs font-bold text-emerald-950 space-y-1">
              <p>T = 2π √(R / g) = 5076 s ≈ 84.6 মিনিট</p>
              <p>একমুখী অতিক্রমণ কাল t = π √(R / g) ≈ 42.3 মিনিট</p>
              <p>কেন্দ্রে গতিশক্তি সর্বোচ্চ ও বেগ: v_max = √(gR) ≈ 7.91 km/s</p>
            </div>
          </div>

          {/* Section 5: Udvash Admission Tips */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>উদ্ভাস ভর্তি পরীক্ষা স্পেশাল টিপস (BUET / Medical / DU Admission)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>সুড়ঙ্গটি পৃথিবীর কেন্দ্রের মধ্য দিয়ে না গিয়ে যেকোনো জ্যা (Chord) বরাবর খনন করলেও দোলনকাল একই থাকবে: <strong>T = 84.6 মিনিট</strong>!</li>
              <li>মহাকর্ষীয় বিভব ঋণাত্মক হওয়ার কারণ: অভিকর্ষ বল দ্বারা ধনাত্মক কাজ সম্পাদিত হয়, ফলে সিস্টেমের স্থিতি শক্তি হ্রাস পায়।</li>
              <li>নিরেট গোলকের পৃষ্ঠ হতে কেন্দ্রে কোনো বস্তুকে নিতে সম্পাদিত কাজ: <strong>W = m(V_c - V_s) = 0.5 mgR</strong>।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
