'use client';

import React, { useState, useRef, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface Props {
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
}

// Bandeiras em SVG para compatibilidade universal (sem dependência de fontes do SO)
const FlagBR = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 640 480">
    <path fill="#009b3a" d="M0 0h640v480H0z"/>
    <path fill="#fedf00" d="M320 40L600 240 320 440 40 240z"/>
    <circle fill="#002776" cx="320" cy="240" r="105"/>
  </svg>
);

const FlagUS = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 640 480">
    <path fill="#bd3d44" d="M0 0h640v480H0z"/>
    <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
    <path fill="#192f5d" d="M0 0h256v259H0z"/>
  </svg>
);

const FlagES = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 640 480">
    <path fill="#c60b1e" d="M0 0h640v480H0z"/>
    <path fill="#ffc400" d="M0 120h640v240H0z"/>
  </svg>
);

const languages: { code: Language; label: string; FlagComponent: () => React.ReactNode }[] = [
  { code: 'pt', label: 'PT', FlagComponent: FlagBR },
  { code: 'en', label: 'ENGLISH', FlagComponent: FlagUS },
  { code: 'es', label: 'ESPAÑOL', FlagComponent: FlagES },
];

export default function LanguageSelector({ currentLang, onSelectLanguage }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = languages.find((l) => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-full border border-slate-700/80 transition shadow-sm backdrop-blur-md"
      >
        <selected.FlagComponent />
        <span className="font-bold">{selected.label}</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                onSelectLanguage(item.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition hover:bg-slate-800/80 ${
                currentLang === item.code ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
              }`}
            >
              <item.FlagComponent />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}