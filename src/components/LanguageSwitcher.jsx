import React, { useState, useEffect, useRef } from "react";
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'tr', label: 'Türkçe' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'ku', label: 'Kurdî' },
    { code: 'zh', label: '中文' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white/10"
        aria-label="Change language"
      >
        <Globe strokeWidth={1.5} size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-44 bg-[#1A1A1C] border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col py-3 backdrop-blur-md z-50 text-white font-sans mix-blend-normal">
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => {
                changeLanguage(lng.code);
                setIsOpen(false);
              }}
              className={`text-left px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors ${
                language === lng.code || language?.startsWith(lng.code)
                  ? 'text-white bg-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {lng.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
