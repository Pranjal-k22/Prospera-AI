'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Home, BedDouble, X } from 'lucide-react';
import { GenerateButton } from '@/components/ui/generate-button';
import { useToast } from '@/components/ui/Toast';

export interface SearchCriteria {
  city: string;
  locality?: string;
  budgetMinCr: number;
  budgetMaxCr: number;
  budgetLabel: string;
  propertyType: string;
  bhk: string;
}

interface SearchBarProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const CITIES_LIST = [
  { name: 'Mumbai', localities: ['Worli', 'Bandra West', 'Altamount Road', 'Juhu', 'Pali Hill'] },
  { name: 'Bengaluru', localities: ['Koramangala', 'Indiranagar', 'Whitefield', 'Sadashivanagar'] },
  { name: 'Hyderabad', localities: ['Jubilee Hills', 'Banjara Hills', 'HITEC City', 'Financial District'] },
  { name: 'Pune', localities: ['Koregaon Park', 'Kalyani Nagar', 'Boat Club Road', 'Aundh'] },
];

const BUDGET_CHIPS = [
  { label: 'Under 1 Cr', min: 0, max: 1 },
  { label: '1 - 3 Cr', min: 1, max: 3 },
  { label: '3 - 10 Cr', min: 3, max: 10 },
  { label: '10 Cr+', min: 10, max: 50 },
];

const TYPE_CHIPS = ['Apartment', 'Villa', 'Penthouse', 'Plot', 'Commercial'];
const BHK_CHIPS = ['1', '2', '3', '4', '5+'];

export function SearchBar({ onSearch }: SearchBarProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Field states
  const [activePopover, setActivePopover] = useState<'city' | 'budget' | 'type' | 'bhk' | null>(null);

  // Values
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [selectedLocality, setSelectedLocality] = useState('Worli');

  const [budgetLabel, setBudgetLabel] = useState('1 - 3 Cr');
  const [budgetMinCr, setBudgetMinCr] = useState(1);
  const [budgetMaxCr, setBudgetMaxCr] = useState(3);

  const [selectedType, setSelectedType] = useState('Apartment');
  const [selectedBhk, setSelectedBhk] = useState('3 BHK');

  // AI generating state
  const [isGenerating, setIsGenerating] = useState(false);

  // Close popover on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePopover(null);
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  // Handlers to auto-advance to the next field when a value is selected
  const handleSelectCity = (city: string, loc?: string) => {
    setSelectedCity(city);
    if (loc) setSelectedLocality(loc);
    // Auto-advance to budget
    setActivePopover('budget');
  };

  const handleSelectBudget = (label: string, min: number, max: number) => {
    setBudgetLabel(label);
    setBudgetMinCr(min);
    setBudgetMaxCr(max);
    // Auto-advance to type
    setActivePopover('type');
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    // Auto-advance to bhk
    setActivePopover('bhk');
  };

  const handleSelectBhk = (bhkVal: string) => {
    setSelectedBhk(`${bhkVal} BHK`);
    // Close popover
    setActivePopover(null);
  };

  // Perform AI Match Action
  const handleRunAiMatch = () => {
    setActivePopover(null);
    setIsGenerating(true);

    // 1.2s realistic AI synthesis delay
    setTimeout(() => {
      setIsGenerating(false);

      const criteria: SearchCriteria = {
        city: selectedCity,
        locality: selectedLocality,
        budgetMinCr,
        budgetMaxCr,
        budgetLabel,
        propertyType: selectedType,
        bhk: selectedBhk,
      };

      onSearch(criteria);

      // Smooth scroll down to Recommended Homes grid
      const recSection = document.getElementById('recommended-homes');
      if (recSection) {
        recSection.scrollIntoView({ behavior: 'smooth' });
      }

      toast.success('12 homes matched', `Showing properties in ${selectedCity} matching ${selectedBhk} ${selectedType}.`);
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-[16vh] sm:bottom-[20vh] left-1/2 -translate-x-1/2 z-[30] w-[min(900px,calc(100%-40px))]"
    >
      {/* LiquidGlass Search Container (90px tall, radius 26px) */}
      <div className="relative rounded-[26px] bg-white/88 dark:bg-[#121622]/92 backdrop-blur-2xl border border-white/90 dark:border-white/20 shadow-[0_24px_60px_rgba(80,45,35,0.18),0_4px_16px_rgba(80,45,35,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] p-2">
        {/* Desktop Layout: Horizontal 4 fields + GenerateButton */}
        <div className="hidden sm:grid grid-cols-[1.35fr_1fr_1fr_1fr_auto] items-center gap-1.5 h-[74px]">
          {/* FIELD 1: Location (1.35x wider) */}
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'city' ? null : 'city')}
            className={`relative flex items-center gap-3.5 px-4 h-[72px] rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              activePopover === 'city'
                ? 'bg-white dark:bg-[#1b2130] shadow-[0_8px_24px_rgba(120,80,70,0.14)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                : 'hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#fbe7da] dark:bg-white/10 flex items-center justify-center shrink-0 text-[#1d1a1c] dark:text-white">
              <MapPin size={16} strokeWidth={1.75} className="text-[#e8a33b]" />
            </div>
            <div className="min-w-0">
              <span className="block font-[var(--font-urbanist)] font-medium text-[20px] text-[#1d1a1c] dark:text-[#f4f5f8] truncate leading-tight">
                {selectedCity}
              </span>
              <span className="block font-[var(--font-urbanist)] text-[12.5px] text-[#5c5156] dark:text-[#a6adb9] truncate leading-tight">
                {selectedLocality || 'Choose locality'}
              </span>
            </div>
          </button>

          {/* FIELD 2: Budget */}
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'budget' ? null : 'budget')}
            className={`relative flex items-center gap-3 px-3 h-[72px] rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              activePopover === 'budget'
                ? 'bg-white dark:bg-[#1b2130] shadow-[0_8px_24px_rgba(120,80,70,0.14)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                : 'hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#fbe7da] dark:bg-white/10 flex items-center justify-center shrink-0 text-[#1d1a1c] dark:text-white">
              <IndianRupee size={16} strokeWidth={1.75} className="text-[#e8a33b]" />
            </div>
            <div className="min-w-0">
              <span className="block font-[var(--font-urbanist)] font-medium text-[19px] text-[#1d1a1c] dark:text-[#f4f5f8] truncate leading-tight">
                Budget
              </span>
              <span className="block font-[var(--font-urbanist)] text-[12.5px] text-[#5c5156] dark:text-[#a6adb9] truncate leading-tight">
                {budgetLabel}
              </span>
            </div>
          </button>

          {/* FIELD 3: Type */}
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'type' ? null : 'type')}
            className={`relative flex items-center gap-3 px-3 h-[72px] rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              activePopover === 'type'
                ? 'bg-white dark:bg-[#1b2130] shadow-[0_8px_24px_rgba(120,80,70,0.14)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                : 'hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#fbe7da] dark:bg-white/10 flex items-center justify-center shrink-0 text-[#1d1a1c] dark:text-white">
              <Home size={16} strokeWidth={1.75} className="text-[#e8a33b]" />
            </div>
            <div className="min-w-0">
              <span className="block font-[var(--font-urbanist)] font-medium text-[19px] text-[#1d1a1c] dark:text-[#f4f5f8] truncate leading-tight">
                Type
              </span>
              <span className="block font-[var(--font-urbanist)] text-[12.5px] text-[#5c5156] dark:text-[#a6adb9] truncate leading-tight">
                {selectedType}
              </span>
            </div>
          </button>

          {/* FIELD 4: BHK */}
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'bhk' ? null : 'bhk')}
            className={`relative flex items-center gap-3 px-3 h-[72px] rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              activePopover === 'bhk'
                ? 'bg-white dark:bg-[#1b2130] shadow-[0_8px_24px_rgba(120,80,70,0.14)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                : 'hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#fbe7da] dark:bg-white/10 flex items-center justify-center shrink-0 text-[#1d1a1c] dark:text-white">
              <BedDouble size={16} strokeWidth={1.75} className="text-[#e8a33b]" />
            </div>
            <div className="min-w-0">
              <span className="block font-[var(--font-urbanist)] font-medium text-[19px] text-[#1d1a1c] dark:text-[#f4f5f8] truncate leading-tight">
                BHK
              </span>
              <span className="block font-[var(--font-urbanist)] text-[12.5px] text-[#5c5156] dark:text-[#a6adb9] truncate leading-tight">
                {selectedBhk}
              </span>
            </div>
          </button>

          {/* AI ACTION BUTTON: GenerateButton amber, frosted on hero */}
          <div className="pr-1">
            <GenerateButton
              tone="amber"
              variant="frosted"
              status={isGenerating ? 'generating' : 'idle'}
              label="Find homes"
              generatingLabel="Matching..."
              successLabel="Matched"
              onClick={handleRunAiMatch}
              size="lg"
              className="px-6 shadow-[0_8px_24px_rgba(232,163,59,0.25)]"
            />
          </div>
        </div>

        {/* Mobile Layout (<= 640px): 2 x 2 grid with full-width button below */}
        <div className="sm:hidden flex flex-col gap-2 p-1">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActivePopover('city')}
              className="p-2.5 rounded-[12px] bg-white/70 dark:bg-white/5 text-left border border-white/40"
            >
              <span className="text-[11px] uppercase tracking-wider text-[#8a7f83] block">City</span>
              <span className="font-semibold text-[15px] truncate block text-[#1d1a1c] dark:text-white">{selectedCity}</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePopover('budget')}
              className="p-2.5 rounded-[12px] bg-white/70 dark:bg-white/5 text-left border border-white/40"
            >
              <span className="text-[11px] uppercase tracking-wider text-[#8a7f83] block">Budget</span>
              <span className="font-semibold text-[15px] truncate block text-[#1d1a1c] dark:text-white">{budgetLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePopover('type')}
              className="p-2.5 rounded-[12px] bg-white/70 dark:bg-white/5 text-left border border-white/40"
            >
              <span className="text-[11px] uppercase tracking-wider text-[#8a7f83] block">Type</span>
              <span className="font-semibold text-[15px] truncate block text-[#1d1a1c] dark:text-white">{selectedType}</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePopover('bhk')}
              className="p-2.5 rounded-[12px] bg-white/70 dark:bg-white/5 text-left border border-white/40"
            >
              <span className="text-[11px] uppercase tracking-wider text-[#8a7f83] block">BHK</span>
              <span className="font-semibold text-[15px] truncate block text-[#1d1a1c] dark:text-white">{selectedBhk}</span>
            </button>
          </div>
          <GenerateButton
            tone="amber"
            status={isGenerating ? 'generating' : 'idle'}
            label="Find homes"
            generatingLabel="Matching..."
            successLabel="Matched"
            onClick={handleRunAiMatch}
            fullWidth
            size="md"
          />
        </div>
      </div>

      {/* POPOVERS (White glass cards, radius 18px, soft drop in from -8px) */}
      <AnimatePresence>
        {activePopover && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] sm:w-[480px] p-5 rounded-[18px] bg-white/95 dark:bg-[#131724]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 shadow-[0_24px_50px_rgba(70,35,25,0.22)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.6)] z-50 text-[#1d1a1c] dark:text-[#f4f5f8]"
          >
            {/* 1. CITY POPOVER */}
            {activePopover === 'city' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <h4 className="font-[var(--font-urbanist)] font-medium text-[16px]">Select City & Locality</h4>
                  <button onClick={() => setActivePopover(null)} className="p-1 text-[#8a7f83] hover:text-[#1d1a1c]">
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {CITIES_LIST.map((c) => (
                    <div key={c.name} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => handleSelectCity(c.name, c.localities[0])}
                        className={`w-full text-left px-3 py-2 rounded-[10px] text-[14px] font-semibold transition-colors ${
                          selectedCity === c.name
                            ? 'bg-[#e8a33b]/15 text-[#e8a33b] border border-[#e8a33b]/30'
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {c.name}
                      </button>
                      <div className="pl-3 space-y-0.5">
                        {c.localities.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => handleSelectCity(c.name, loc)}
                            className="block w-full text-left text-[12px] text-[#5c5156] dark:text-[#a6adb9] hover:text-[#e8a33b] py-0.5 truncate"
                          >
                            • {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. BUDGET POPOVER */}
            {activePopover === 'budget' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <h4 className="font-[var(--font-urbanist)] font-medium text-[16px]">Investment Range</h4>
                  <button onClick={() => setActivePopover(null)} className="p-1 text-[#8a7f83] hover:text-[#1d1a1c]">
                    <X size={16} />
                  </button>
                </div>

                <p className="text-[13px] text-[#5c5156] dark:text-[#a6adb9]">
                  Select your targeted portfolio acquisition band:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {BUDGET_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleSelectBudget(chip.label, chip.min, chip.max)}
                      className={`px-4 py-3 rounded-[12px] text-center font-[var(--font-urbanist)] font-medium text-[14px] transition-all ${
                        budgetLabel === chip.label
                          ? 'bg-[#1d1a1c] dark:bg-white text-white dark:text-[#1d1a1c] shadow-md'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TYPE POPOVER */}
            {activePopover === 'type' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <h4 className="font-[var(--font-urbanist)] font-medium text-[16px]">Property Architecture</h4>
                  <button onClick={() => setActivePopover(null)} className="p-1 text-[#8a7f83] hover:text-[#1d1a1c]">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {TYPE_CHIPS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleSelectType(t)}
                      className={`px-4 py-2.5 rounded-full font-[var(--font-urbanist)] font-medium text-[13.5px] transition-all ${
                        selectedType === t
                          ? 'bg-[#1d1a1c] dark:bg-white text-white dark:text-[#1d1a1c] shadow-md'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BHK POPOVER */}
            {activePopover === 'bhk' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <h4 className="font-[var(--font-urbanist)] font-medium text-[16px]">Bedrooms & Suites</h4>
                  <button onClick={() => setActivePopover(null)} className="p-1 text-[#8a7f83] hover:text-[#1d1a1c]">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {BHK_CHIPS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleSelectBhk(b)}
                      className={`flex-1 py-3 rounded-[12px] font-[var(--font-urbanist)] font-semibold text-[15px] transition-all text-center ${
                        selectedBhk.startsWith(b)
                          ? 'bg-[#1d1a1c] dark:bg-white text-white dark:text-[#1d1a1c] shadow-md'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {b} BHK
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
