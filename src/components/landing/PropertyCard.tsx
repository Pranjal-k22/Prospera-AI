'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart } from 'lucide-react';
import { PropertyCardImageConfig, isImageConfigured } from '@/lib/landing-images';
import { getStorageItem, setStorageItem } from '@/lib/brand';

interface PropertyCardProps {
  property: PropertyCardImageConfig;
  onSelect: (property: PropertyCardImageConfig, cardRect: DOMRect) => void;
  index: number;
}

export function PropertyCard({ property, onSelect, index }: PropertyCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartPopping, setHeartPopping] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sync favorites with localStorage with brand migration
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = getStorageItem('favorites');
        if (saved) {
          const favs = JSON.parse(saved);
          if (Array.isArray(favs) && favs.includes(property.id)) {
            setIsFavorite(true);
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [property.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Do not trigger detail modal
    const next = !isFavorite;
    setIsFavorite(next);
    setHeartPopping(true);
    setTimeout(() => setHeartPopping(false), 300);

    try {
      const saved = getStorageItem('favorites');
      let favs: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(favs)) favs = [];

      if (next) {
        if (!favs.includes(property.id)) favs.push(property.id);
      } else {
        favs = favs.filter((id) => id !== property.id);
      }
      setStorageItem('favorites', JSON.stringify(favs));
    } catch {
      // ignore
    }
  };

  const handleClickCard = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onSelect(property, rect);
    }
  };

  const hasPhoto = isImageConfigured(property.cardPhotoUrl) && !imageError;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={handleClickCard}
      className="group relative cursor-pointer select-none rounded-[12px] overflow-hidden shadow-[0_12px_30px_rgba(110,60,50,0.16)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-[6px] hover:shadow-[0_20px_45px_rgba(110,60,50,0.25)] dark:hover:shadow-[0_24px_50px_rgba(0,0,0,0.7)]"
      style={{
        aspectRatio: '203 / 268',
      }}
    >
      {/* PHOTO LAYER with smooth 1.2s zoom on hover */}
      <div className="absolute inset-0 overflow-hidden bg-[#241c22]">
        {hasPhoto ? (
          <Image
            src={property.cardPhotoUrl}
            alt={property.name}
            onError={() => setImageError(true)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-107"
          />
        ) : (
          <div
            className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-107"
            style={{ background: property.fallbackGradient }}
          />
        )}
      </div>

      {/* BOTTOM DARKENING GRADIENT */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none"
      />

      {/* TOP-LEFT PRICE PILL: white 82%, 6px blur, radius 6px, 11.5px text */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-white/85 dark:bg-[#121622]/90 backdrop-blur-[6px] text-[#1d1a1c] dark:text-white font-[var(--font-urbanist)] font-semibold text-[11.5px] shadow-sm tracking-wide">
          {property.priceFormatted}
        </span>
      </div>

      {/* TOP-RIGHT 30PX WHITE HEART BUTTON */}
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`w-[30px] h-[30px] rounded-full bg-white/90 dark:bg-[#121622]/90 backdrop-blur-[6px] flex items-center justify-center shadow-md transition-transform duration-200 outline-none ${
            heartPopping ? 'scale-[1.35]' : 'hover:scale-110 active:scale-95'
          }`}
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            className={`transition-colors duration-200 ${
              isFavorite
                ? 'fill-[#ff4d5e] text-[#ff4d5e]'
                : 'text-[#1d1a1c]/80 dark:text-white/80'
            }`}
          />
        </button>
      </div>

      {/* BOTTOM-LEFT DETAILS */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white">
        <h3 className="font-[var(--font-urbanist)] font-semibold text-[15.5px] leading-snug drop-shadow-md truncate">
          {property.name}
        </h3>

        <div className="flex items-center gap-1 mt-0.5 text-white/85 text-[12px] font-[var(--font-urbanist)] truncate">
          <MapPin size={12} className="text-[#f7c325] shrink-0" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </div>

        {/* 5 Yellow Stars & Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center text-[#f7c325]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className="fill-[#f7c325] text-[#f7c325]"
              />
            ))}
          </div>
          <span className="text-[11.5px] font-[var(--font-urbanist)] font-semibold text-white/95">
            {property.rating}
          </span>
          <span className="text-[10.5px] text-white/70">
            ({property.reviewsCount})
          </span>
        </div>
      </div>
    </motion.div>
  );
}
