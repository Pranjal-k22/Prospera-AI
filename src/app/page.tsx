'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LANDING_IMAGES, PropertyCardImageConfig } from '@/lib/landing-images';
import { CustomCursor } from '@/components/landing/CustomCursor';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SearchBar, SearchCriteria } from '@/components/landing/SearchBar';
import { PropertyCard } from '@/components/landing/PropertyCard';
import { PropertyDetailModal } from '@/components/landing/PropertyDetailModal';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BrokerTeaserSection } from '@/components/landing/BrokerTeaserSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function MarketingLandingPage() {
  const [scrollY, setScrollY] = useState(0);

  // Selected property for card -> detail shared-element flight
  const [selectedProperty, setSelectedProperty] = useState<PropertyCardImageConfig | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  // Filter criteria from SearchBar
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);

  // Scroll listener (rAF throttled)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filter recommended properties if search criteria applied
  const displayedProperties = useMemo(() => {
    let list = [...LANDING_IMAGES.properties];
    if (searchCriteria) {
      if (searchCriteria.city) {
        const cityMatches = list.filter(
          (p) => p.city.toLowerCase() === searchCriteria.city.toLowerCase()
        );
        if (cityMatches.length > 0) list = cityMatches;
      }
      if (searchCriteria.propertyType && searchCriteria.propertyType !== 'All') {
        const typeMatches = list.filter(
          (p) => p.type.toLowerCase() === searchCriteria.propertyType.toLowerCase()
        );
        if (typeMatches.length > 0) list = typeMatches;
      }
    }
    // Return up to 8 cards
    return list.slice(0, 8);
  }, [searchCriteria]);

  // Handle opening property detail modal with origin rectangle
  const handleOpenDetail = useCallback((prop: PropertyCardImageConfig, rect: DOMRect) => {
    setOriginRect(rect);
    setSelectedProperty(prop);
  }, []);

  // Handle closing modal
  const handleCloseDetail = useCallback(() => {
    setSelectedProperty(null);
    setOriginRect(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
  }, []);

  return (
    <div className="landing-page-root relative w-full min-h-screen text-[#1d1a1c] dark:text-[#f4f5f8] overflow-x-hidden antialiased">
      {/* 1. CUSTOM CURSOR (desktop pointer devices only) */}
      <CustomCursor />

      {/* 2. NAVIGATION BAR */}
      <LandingNavbar />

      {/* 3. HERO SHOWCASE (100vh, min-height 680px) */}
      <div className="relative">
        <HeroSection scrollY={scrollY} />

        {/* 4. LIQUIDGLASS SEARCH BAR (centred, bottom 20vh + 2px) */}
        <SearchBar onSearch={(criteria) => setSearchCriteria(criteria)} />
      </div>

      {/* 5. "RECOMMENDED HOMES" SECTION (pulled up into the hero by -17vh) */}
      <section
        id="recommended-homes"
        className="relative z-20 pt-4 pb-24 mt-[-8vh] sm:mt-[-17vh]"
        style={{
          paddingLeft: 'clamp(20px, 9.5vw, 170px)',
          paddingRight: 'clamp(20px, 9.5vw, 170px)',
        }}
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[12px] uppercase tracking-[0.2em] font-[var(--font-urbanist)] font-bold text-[#e8a33b] block mb-1">
              Curated Architectural Selection
            </span>
            <h2 className="font-[var(--font-gilda)] text-[clamp(26px,2.45vw,36px)] text-[#1d1a1c] dark:text-white font-normal leading-tight">
              Recommended Homes
            </h2>
          </div>

          <Link
            href="/buyer"
            className="group inline-flex items-center gap-2 px-5 py-2 rounded-[20px] border-[1.4px] border-[#1d1a1c] dark:border-white text-[13.5px] font-[var(--font-urbanist)] font-medium text-[#1d1a1c] dark:text-white hover:bg-[#1d1a1c] hover:text-white dark:hover:bg-white dark:hover:text-[#1d1a1c] transition-all duration-300 self-start sm:self-auto cursor-pointer"
          >
            <span>See all luxury residences</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid: Two rows of four cards (clamp 14px, 2.2vw, 30px gap) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(14px,2.2vw,30px)]">
          {displayedProperties.map((property, idx) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={idx}
              onSelect={handleOpenDetail}
            />
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* 7. BROKER DEAL DESK TEASER BANNER */}
      <BrokerTeaserSection />

      {/* 8. FOOTER WITH NEWSLETTER & THEME TOGGLE */}
      <LandingFooter />

      {/* 9. CARD -> DETAIL PAGE (Shared-Element Flight & Visit Booking) */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            originRect={originRect}
            onClose={handleCloseDetail}
            onSelectSimilarProperty={handleOpenDetail}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Seamless Page Background Gradient:
           Solid warm peach #f7d9c6 down to 115vh,
           blending to #fbe7da at 175vh and #fdf0e7 at the bottom.
           In dark mode: #0a0e17 down to 115vh, blending to #0f1422 and #121829 */
        html {
          background-color: #f7d9c6;
        }
        html[data-theme='dark'] {
          background-color: #0a0e17;
        }

        .landing-page-root {
          background: linear-gradient(
            180deg,
            #f7d9c6 0%,
            #f7d9c6 115vh,
            #fbe7da 175vh,
            #fdf0e7 100%
          );
        }

        html[data-theme='dark'] .landing-page-root {
          background: linear-gradient(
            180deg,
            #0a0e17 0%,
            #0a0e17 115vh,
            #0f1422 175vh,
            #121829 100%
          );
        }

        /* Hide native cursor only when custom cursor is active */
        html.custom-cursor-enabled,
        html.custom-cursor-enabled body,
        html.custom-cursor-enabled button,
        html.custom-cursor-enabled a {
          cursor: none !important;
        }

        /* Always preserve native caret in text form inputs */
        html.custom-cursor-enabled input,
        html.custom-cursor-enabled textarea,
        html.custom-cursor-enabled select,
        html.custom-cursor-enabled [contenteditable='true'] {
          cursor: text !important;
        }
      `}</style>
    </div>
  );
}
