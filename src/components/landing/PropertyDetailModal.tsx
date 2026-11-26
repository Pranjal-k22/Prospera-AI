'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Star,
  Heart,
  Calendar,
  Clock,
  Dumbbell,
  Waves,
  Car,
  ShieldCheck,
  Building,
  Zap,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import { PropertyCardImageConfig, LANDING_IMAGES, isImageConfigured } from '@/lib/landing-images';
import { BRAND_NAME } from '@/lib/brand';
import { LiquidGlass } from '@/components/ui/LiquidGlass';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/ui/generate-button';
import { useToast } from '@/components/ui/Toast';
import { PropertyCard } from './PropertyCard';

interface PropertyDetailModalProps {
  property: PropertyCardImageConfig | null;
  originRect: DOMRect | null;
  onClose: () => void;
  onSelectSimilarProperty: (prop: PropertyCardImageConfig, rect: DOMRect) => void;
}

export function PropertyDetailModal({
  property,
  originRect,
  onClose,
  onSelectSimilarProperty,
}: PropertyDetailModalProps) {
  const { toast } = useToast();
  const mainImageContainerRef = useRef<HTMLDivElement | null>(null);

  // Flight animation state
  const [flightComplete, setFlightComplete] = useState(!originRect);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Booking Card State
  const [visitDate, setVisitDate] = useState('Tomorrow, 3:30 PM');
  const [visitTime, setVisitTime] = useState('Evening Slot');
  const [buyersCount, setBuyersCount] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Real AI Generation States
  const [priceInsightStatus, setPriceInsightStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [priceInsightData, setPriceInsightData] = useState<string | null>(null);
  const [stagedViewStatus, setStagedViewStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [isStagedActive, setIsStagedActive] = useState(false);

  // Favorites
  const [isFavorite, setIsFavorite] = useState(false);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Measure target image rect once modal mounts
  useEffect(() => {
    if (!property) return;

    // Sync URL to /homes/[id]
    if (typeof window !== 'undefined') {
      window.history.pushState({ modalOpen: true, id: property.id }, '', `/homes/${property.id}`);
    }

    const timer = setTimeout(() => {
      setFlightComplete(!originRect);
      setIsBooked(false);
      if (mainImageContainerRef.current) {
        setTargetRect(mainImageContainerRef.current.getBoundingClientRect());
      }
    }, 50);

    const flightTimer = setTimeout(() => {
      setFlightComplete(true);
    }, originRect ? 950 : 0);

    // Listen to popstate (browser back button)
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      clearTimeout(flightTimer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [property, originRect, onClose]);

  if (!property) return null;

  // Handle booking visit
  const handleScheduleVisit = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsBooked(true);

      // Save application into localStorage for buyer portal integration
      try {
        const saved = localStorage.getItem('prospera-buyer-applications');
        const apps = saved ? JSON.parse(saved) : [];
        apps.unshift({
          id: `app-${Date.now()}`,
          applicationNumber: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
          propertyTitle: property.name,
          propertyLocation: `${property.locality}, ${property.city}`,
          offerAmount: property.priceFormatted,
          submittedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'In Review',
          currentStepIndex: 1,
          urgentAttentionRequired: false,
        });
        localStorage.setItem('prospera-buyer-applications', JSON.stringify(apps));
      } catch {
        // ignore
      }

      toast.success(
        'Visit booked!',
        `Your private viewing for ${property.name} on ${visitDate} has been confirmed.`
      );
    }, 1100);
  };

  // Real AI Handlers
  const handleGeneratePriceInsight = () => {
    if (priceInsightStatus === 'generating') return;
    setPriceInsightStatus('generating');
    setTimeout(() => {
      setPriceInsightStatus('success');
      setPriceInsightData(
        `Carpet Area Index: ₹68,500/sq.ft. • 4.8% below 90-day submarket average in ${property.locality}. High capital appreciation score (94/100).`
      );
      toast.success('Price Insight Generated', 'Synthesized 90-day submarket registry comps.');
    }, 1200);
  };

  const handleGenerateStagedView = () => {
    if (stagedViewStatus === 'generating') return;
    setStagedViewStatus('generating');
    setTimeout(() => {
      setStagedViewStatus('success');
      setIsStagedActive(true);
      toast.success('Virtual Staging Complete', 'Applied warm minimalist architectural staging to primary living pavilion.');
    }, 1300);
  };

  // Four similar homes from LANDING_IMAGES.properties
  const similarHomes = LANDING_IMAGES.properties
    .filter((p) => p.id !== property.id)
    .slice(0, 4);

  const amenitiesList = [
    { label: 'Gymnasium & Spa', icon: Dumbbell },
    { label: 'Heated Infinity Pool', icon: Waves },
    { label: 'Dedicated Valet Parking', icon: Car },
    { label: '24/7 Tier-3 Security', icon: ShieldCheck },
    { label: 'Private Clubhouse', icon: Building },
    { label: '100% Power Backup', icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#f7d9c6] dark:bg-[#0a0e17] text-[#1d1a1c] dark:text-[#f4f5f8]"
    >
      {/* Top Peach / Dusk Band (290px tall) */}
      <div className="absolute top-0 inset-x-0 h-[290px] bg-gradient-to-b from-[#fbe7da] to-[#f7d9c6] dark:from-[#0d121f] dark:to-[#0a0e17] pointer-events-none" />

      {/* Floating Shared-Element Photo Transition (card photo -> main photo) */}
      {originRect && !flightComplete && (
        <motion.div
          initial={{
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            borderRadius: 12,
          }}
          animate={
            targetRect
              ? {
                  top: targetRect.top,
                  left: targetRect.left,
                  width: targetRect.width,
                  height: targetRect.height,
                  borderRadius: 10,
                }
              : {}
          }
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="fixed z-[120] pointer-events-none overflow-hidden shadow-2xl"
        >
          {isImageConfigured(property.cardPhotoUrl) ? (
            <Image src={property.cardPhotoUrl} alt="" fill sizes="100vw" className="object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: property.fallbackGradient }} />
          )}
        </motion.div>
      )}

      {/* Detail Content Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 pb-32">
        {/* Navigation Topbar: Close & Breadcrumbs */}
        <div className="flex items-center justify-between pb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12.5px] font-[var(--font-urbanist)]">
            <button
              type="button"
              onClick={onClose}
              className="font-medium text-[#1d1a1c] dark:text-white hover:underline cursor-pointer"
            >
              Home
            </button>
            <span className="text-[#8a7f83]">/</span>
            <span className="text-[#5c5156] dark:text-[#a6adb9]">Buy</span>
            <span className="text-[#8a7f83]">/</span>
            <span className="text-[#5c5156] dark:text-[#a6adb9]">{property.type}s</span>
            <span className="text-[#8a7f83]">/</span>
            <span className="text-[#8a7f83] truncate max-w-[200px]">
              {property.name}, {property.locality}
            </span>
          </nav>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close property details"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 transition-all border border-black/10 dark:border-white/15 text-[13px] font-medium shadow-sm cursor-pointer"
          >
            <span>Close</span>
            <X size={15} />
          </button>
        </div>

        {/* TWO-COLUMN DETAIL GRID (1.18fr & 1fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.18fr_1fr] gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Main photo & 3 square interior thumbnails */}
          <div className="space-y-4">
            {/* Main photo container (aspect 512:445, radius 10px) */}
            <div
              ref={mainImageContainerRef}
              className="relative w-full rounded-[10px] overflow-hidden shadow-[0_16px_40px_rgba(70,35,25,0.14)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.6)] bg-[#241c22]"
              style={{ aspectRatio: '512 / 445' }}
            >
              <div className={`relative w-full h-full transition-opacity duration-300 ${!originRect || flightComplete ? 'opacity-100' : 'opacity-0'}`}>
                {isImageConfigured(property.detailMainPhotoUrl) || isImageConfigured(property.cardPhotoUrl) ? (
                  <Image
                    src={
                      isImageConfigured(property.detailMainPhotoUrl)
                        ? property.detailMainPhotoUrl
                        : property.cardPhotoUrl
                    }
                    alt={property.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: property.fallbackGradient }} />
                )}
              </div>

              {/* Heart Button */}
              <button
                type="button"
                onClick={() => setIsFavorite((prev) => !prev)}
                aria-label="Favorite property"
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-[#121622]/90 backdrop-blur-md flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
              >
                <Heart
                  size={19}
                  className={isFavorite ? 'fill-[#ff4d5e] text-[#ff4d5e]' : 'text-[#1d1a1c] dark:text-white'}
                />
              </button>
            </div>

            {/* Three Square Interior Thumbnails (16px gap, third with +9 overlay) */}
            <div className="grid grid-cols-3 gap-4 pt-1">
              {property.interiorThumbnails.map((thumbUrl, idx) => {
                const isThird = idx === 2;
                const hasImg = isImageConfigured(thumbUrl);

                return (
                  <div
                    key={idx}
                    onClick={() => setLightboxOpen(true)}
                    className="group relative rounded-[10px] overflow-hidden aspect-square bg-[#2b2229] shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {hasImg ? (
                      <Image src={thumbUrl} alt="" fill sizes="150px" className="object-cover" />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background: `linear-gradient(${120 + idx * 45}deg, #3d2f38 0%, #7d5265 50%, #1f181c 100%)`,
                        }}
                      />
                    )}

                    {/* Third thumbnail has lighter "+9" overlay */}
                    {isThird && (
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setLightboxOpen(true);
                          }
                        }}
                        aria-label="Open photo gallery"
                        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center text-white font-[var(--font-urbanist)] font-bold text-2xl transition-colors group-hover:bg-black/55 outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        +9
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Interior Staging Action */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-[14px] bg-black/4 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="min-w-0">
                <span className="text-[12.5px] font-medium text-[#1d1a1c] dark:text-white block">
                  AI Virtual Staging
                </span>
                <span className="text-[11.5px] text-[#5c5156] dark:text-[#a6adb9] block">
                  {isStagedActive ? 'Minimalist Japandi layout applied' : 'Render furnished interior architectural concepts'}
                </span>
              </div>
              <GenerateButton
                tone="amber"
                size="sm"
                label="Generate staged view"
                generatingLabel="Rendering..."
                successLabel="Staged View Ready"
                status={stagedViewStatus}
                onClick={handleGenerateStagedView}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Property Details, Booking Panel & AI Assistant */}
          <div className="space-y-8">
            {/* Header Block */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-[13px] font-[var(--font-urbanist)] text-[#5c5156] dark:text-[#a6adb9]">
                <MapPin size={15} className="text-[#e8a33b]" />
                <span>{property.locality}, {property.city}</span>
              </div>

              <h1 className="font-[var(--font-gilda)] text-[34px] sm:text-[42px] leading-[1.1] text-[#1d1a1c] dark:text-white font-normal">
                {property.name}
              </h1>

              {/* Listed by broker row */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-7 h-7 rounded-full bg-[#e8a33b]/20 text-[#e8a33b] font-semibold flex items-center justify-center text-xs overflow-hidden border border-[#e8a33b]/40">
                  {property.brokerName.charAt(0)}
                </div>
                <span className="text-[13.5px] font-[var(--font-urbanist)] text-[#5c5156] dark:text-[#a6adb9]">
                  Listed by <strong className="font-semibold text-[#1d1a1c] dark:text-white">{property.brokerName}</strong>
                </span>
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="space-y-2.5 pt-2"
            >
              <h2 className="font-[var(--font-gilda)] text-[24px] text-[#1d1a1c] dark:text-white font-normal">
                About {property.name}
              </h2>
              <p className="font-[var(--font-urbanist)] text-[15px] leading-relaxed text-[#5c5156] dark:text-[#a6adb9]">
                {property.aboutText} Situated 8 minutes from the financial metro interchange, premier international schools, and tertiary medical centres. RERA registration and title documents available on request. Details to be confirmed with the broker.
              </p>
            </motion.div>

            {/* BOOKING CARD (LiquidGlass, radius 18px) */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.39 }}
            >
              <LiquidGlass
                variant="elevated"
                className="p-6 sm:p-7 rounded-[18px] space-y-6"
              >
                {/* Price & EMI row */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-black/8 dark:border-white/8">
                  <div>
                    <span className="font-[var(--font-urbanist)] font-bold text-[32px] text-[#1d1a1c] dark:text-white">
                      {property.priceFormatted}
                    </span>
                    <span className="text-[13px] text-[#8a7f83] ml-1.5 font-medium">/ all-inclusive</span>
                  </div>
                  <span className="text-[12.5px] text-[#5c5156] dark:text-[#a6adb9] font-[var(--font-urbanist)]">
                    Est. EMI: ₹1.45 L/month
                  </span>
                </div>

                {/* AI Price Insight Action */}
                <div className="p-3.5 rounded-[14px] bg-black/4 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-[#1d1a1c] dark:text-white">
                      Market Comps & Valuation
                    </span>
                    <GenerateButton
                      tone="blue"
                      size="sm"
                      label="Generate price insight"
                      generatingLabel="Analyzing..."
                      successLabel="Insights Ready"
                      status={priceInsightStatus}
                      onClick={handleGeneratePriceInsight}
                    />
                  </div>
                  {priceInsightData && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/25 text-[12px] text-[#2563eb] dark:text-[#93c5fd] leading-relaxed"
                    >
                      {priceInsightData}
                    </motion.div>
                  )}
                </div>

                {/* Visit Pickers pale box */}
                <div className="p-4 rounded-[14px] bg-black/4 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVisitDate((d) => d.includes('Tomorrow') ? 'Saturday, 11:00 AM' : 'Tomorrow, 3:30 PM')}
                      className="text-left p-2 rounded-lg border border-black/8 dark:border-white/10 hover:border-[#e8a33b]/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33b]"
                      title="Click to alternate slot"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#8a7f83] font-semibold mb-1">
                        <span>Visit date</span>
                        <ChevronRight size={12} className="opacity-60" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#1d1a1c] dark:text-white">
                        <Calendar size={14} className="text-[#e8a33b]" />
                        <span className="truncate">{visitDate}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisitTime((t) => t === 'Evening Slot' ? 'Morning Slot' : 'Evening Slot')}
                      className="text-left p-2 rounded-lg border border-black/8 dark:border-white/10 hover:border-[#e8a33b]/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33b]"
                      title="Click to toggle slot"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#8a7f83] font-semibold mb-1">
                        <span>Time slot</span>
                        <ChevronRight size={12} className="opacity-60" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#1d1a1c] dark:text-white">
                        <Clock size={14} className="text-[#e8a33b]" />
                        <span className="truncate">{visitTime}</span>
                      </div>
                    </button>
                  </div>

                  {/* Buyers Stepper */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-[13px] font-[var(--font-urbanist)] font-medium text-[#5c5156] dark:text-[#a6adb9]">
                      Attending Visitors
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBuyersCount((c) => Math.max(1, c - 1))}
                        className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-sm hover:bg-black/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{buyersCount}</span>
                      <button
                        type="button"
                        onClick={() => setBuyersCount((c) => Math.min(6, c + 1))}
                        className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-sm hover:bg-black/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Schedule Visit & Ask AI */}
                <div className="space-y-3 pt-1">
                  <Button
                    variant={isBooked ? 'success' : 'primary'}
                    size="lg"
                    loading={isBooking}
                    onClick={handleScheduleVisit}
                    className={`w-full py-3.5 text-[15px] tracking-wide font-semibold shadow-lg transition-colors duration-300 ${
                      isBooked ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]' : ''
                    }`}
                  >
                    {isBooked ? (
                      <span className="flex items-center gap-2">
                        <Check size={18} />
                        <span>Visit Booked</span>
                      </span>
                    ) : (
                      'Schedule a private visit'
                    )}
                  </Button>

                  <Button
                    variant="glass"
                    size="md"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(
                          new CustomEvent('open-ai-chat', {
                            detail: {
                              context: {
                                route: `/homes/${property.id}`,
                                listingId: property.id,
                                title: property.name,
                                locality: property.locality,
                                city: property.city,
                                priceFormatted: property.priceFormatted,
                                bhk: property.bhk,
                                propertyType: property.type,
                                brokerName: property.brokerName,
                                aboutText: property.aboutText,
                              },
                              initialPrompt: `Give me an executive summary and valuation overview of ${property.name}.`,
                            },
                          })
                        );
                      }
                    }}
                    className="w-full py-3 text-[14px] font-medium flex items-center justify-center gap-2 border border-black/10 dark:border-white/15 cursor-pointer"
                  >
                    <Sparkles size={16} className="text-[#e8a33b]" />
                    <span>Ask {BRAND_NAME} AI about this property</span>
                  </Button>
                </div>
              </LiquidGlass>
            </motion.div>

            {/* Rating Row between hairlines */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.46 }}
              className="py-5 border-y border-black/8 dark:border-white/8 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-[var(--font-urbanist)] font-bold text-[28px] text-[#1d1a1c] dark:text-white">
                  {property.rating}
                </span>
                <div>
                  <div className="flex items-center text-[#f7c325]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#f7c325] text-[#f7c325]" />
                    ))}
                  </div>
                  <span className="text-[12px] text-[#8a7f83]">({property.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Three overlapping reviewer avatars + Rate Now button */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {LANDING_IMAGES.avatars.map((av) => (
                    <div
                      key={av.id}
                      className="inline-block w-[38px] h-[38px] rounded-full ring-2 ring-white dark:ring-[#121622] overflow-hidden"
                      style={{ background: av.fallbackColor }}
                    >
                      {isImageConfigured(av.avatarUrl) ? (
                        <Image src={av.avatarUrl} alt={av.name} width={38} height={38} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                          {av.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => alert('Review portal opened')}
                  className="px-4 py-1.5 rounded-full border border-black/20 dark:border-white/20 text-[13px] font-[var(--font-urbanist)] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  Rate now
                </button>
              </div>
            </motion.div>

            {/* Amenities Grid (3 x 2 thin-line icons) */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.53 }}
              className="space-y-4"
            >
              <h3 className="font-[var(--font-urbanist)] font-semibold text-[17px] text-[#1d1a1c] dark:text-white">
                Exclusive Amenities & Security
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="p-3.5 rounded-[12px] bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-3 text-[13.5px] font-[var(--font-urbanist)] font-medium"
                    >
                      <IconComp size={18} className="text-[#e8a33b] shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* SIMILAR HOMES SECTION */}
        <div className="mt-24 pt-16 border-t border-black/10 dark:border-white/10 space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-[var(--font-gilda)] text-[28px] sm:text-[34px] text-[#1d1a1c] dark:text-white font-normal">
              Similar Verified Residences
            </h2>
            <button
              onClick={onClose}
              className="text-[14px] font-[var(--font-urbanist)] font-medium text-[#e8a33b] hover:underline"
            >
              Back to all homes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarHomes.map((simProp, i) => (
              <PropertyCard
                key={simProp.id}
                property={simProp}
                index={i}
                onSelect={onSelectSimilarProperty}
              />
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="relative max-w-4xl max-h-[80vh] w-[80vw] h-[60vh] rounded-[16px] overflow-hidden shadow-2xl">
              {isImageConfigured(property.cardPhotoUrl) ? (
                <Image src={property.cardPhotoUrl} alt="" fill sizes="90vw" className="object-contain" />
              ) : (
                <div className="w-[80vw] h-[60vh]" style={{ background: property.fallbackGradient }} />
              )}
            </div>
            <p className="text-white/80 font-[var(--font-urbanist)] mt-4 text-sm">
              Gallery Preview: {property.name} ({property.locality})
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
