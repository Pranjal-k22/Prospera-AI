/**
 * Landing Page Image Configuration
 * 
 * All image assets required for the cinematic marketing landing page.
 * Populated with high-resolution, curated architectural imagery for Indian luxury properties.
 */

export interface SlideImageConfig {
  id: string;
  cityName: string;
  title: string;
  subtitle: string;
  /** High-resolution hero background photo (2400px recommended) */
  photoUrl: string;
  /** City thumbnail on the concentric ring rail (400px recommended) */
  thumbnailUrl: string;
  /** Tasteful CSS dusk gradient fallback used when photoUrl is missing */
  fallbackGradient: string;
  /** Lit caption description */
  captionHeading: string;
  captionDescription: string;
}

export interface FogViewConfig {
  skyMorning?: string;
  skyNight?: string;
  groundMorning?: string;
  groundNight?: string;
  cutoutMorning?: string;
  cutoutNight?: string;
  focal?: {
    desktop: string;
    mobile: string;
  };
  glow?: {
    x: number;
    y: number;
  };
  aiGenerated?: boolean;
}

export interface PropertyCardImageConfig {
  id: string;
  name: string;
  city: string;
  locality: string;
  priceFormatted: string;
  priceNumericCr: number;
  bhk: number;
  type: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  /** Photo card asset (700px recommended) */
  cardPhotoUrl: string;
  /** Fallback gradient when cardPhotoUrl is missing */
  fallbackGradient: string;
  /** High-res main image for detail page flight (1200px recommended) */
  detailMainPhotoUrl: string;
  /** 3 interior thumbnails for detail view (500px recommended) */
  interiorThumbnails: [string, string, string];
  /** Broker avatar (120px) */
  brokerAvatarUrl: string;
  brokerName: string;
  aboutText: string;
  /** Fog Hero morning/night transition configuration (Simple Mode fallback when unset/TODO) */
  fogView?: FogViewConfig;
}

export interface AvatarConfig {
  id: string;
  name: string;
  avatarUrl: string;
  fallbackColor: string;
}

export interface LandingImagesConfig {
  cloudAssetUrl: string;
  slides: SlideImageConfig[];
  properties: PropertyCardImageConfig[];
  avatars: AvatarConfig[];
}

export const LANDING_IMAGES: LandingImagesConfig = {
  // 1. Cloud image (white clouds on pure black, 2400px).
  // When empty, layered blurred radial-gradient volumetric blobs are rendered.
  cloudAssetUrl: "",

  // 2. Three hero slides (2400px photos + 400px city thumbnails)
  slides: [
    {
      id: "slide-1",
      cityName: "Mumbai",
      title: "WELCOME HOME",
      subtitle: "Sea-facing towers & heritage bungalows",
      photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80",
      fallbackGradient: "radial-gradient(circle at 65% 45%, #e07a5f 0%, #3d2b3d 55%, #1d1a24 100%)",
      captionHeading: "Discover Mumbai",
      captionDescription: "Sea-facing towers, heritage bungalows and smart starter flats, verified by local brokers."
    },
    {
      id: "slide-2",
      cityName: "Bengaluru",
      title: "FIND PLACE TO LIVE",
      subtitle: "Garden villas & quiet tech-corridor penthouses",
      photoUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2400&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
      fallbackGradient: "radial-gradient(circle at 50% 40%, #f4a261 0%, #4a3e4d 50%, #1a1622 100%)",
      captionHeading: "Homes in Bengaluru",
      captionDescription: "Garden-facing apartments and villas close to tech parks, picked by AI to fit your family."
    },
    {
      id: "slide-3",
      cityName: "Hyderabad",
      title: "EXPLORE / INDIA",
      subtitle: "Architectural glass towers & gated sanctuaries",
      photoUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=400&q=80",
      fallbackGradient: "radial-gradient(circle at 40% 50%, #e76f51 0%, #3a3845 55%, #161821 100%)",
      captionHeading: "Homes in Hyderabad",
      captionDescription: "Modern high-rises and gated communities with transparent pricing and instant visit booking."
    }
  ],

  // 3. Eight recommended property cards (700px card photo, 500px interiors, 120px broker avatar)
  properties: [
    {
      id: "prop-1",
      name: "The Waterfront Penthouse",
      city: "Mumbai",
      locality: "Worli Sea Face",
      priceFormatted: "₹28.5 Cr",
      priceNumericCr: 28.5,
      bhk: 5,
      type: "Penthouse",
      stars: 5,
      rating: 4.9,
      reviewsCount: 128,
      cardPhotoUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #4a3b32 0%, #8c533e 40%, #2b1f24 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      brokerName: "Vikram Singhania",
      aboutText: "Unobstructed Arabian Sea and Bandra-Worli Sea Link panorama. Features direct high-speed private elevator, rooftop heated jacuzzi deck, 4 covered stilt parking bays, and triple-glazed acoustic facade.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-2",
      name: "Pali Hill Sanctuary",
      city: "Mumbai",
      locality: "Bandra West",
      priceFormatted: "₹16.2 Cr",
      priceNumericCr: 16.2,
      bhk: 4,
      type: "Apartment",
      stars: 5,
      rating: 4.8,
      reviewsCount: 94,
      cardPhotoUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #323d4a 0%, #4a6650 40%, #1f2824 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      brokerName: "Ananya Deshmukh",
      aboutText: "Set among towering banyan canopies on prestigious Pali Hill. Floor-to-ceiling double-glazed sliders, Italian marble flooring throughout, 11-foot ceilings, and discrete biometric private lobby access.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-3",
      name: "Solaria Altamount Sky Villa",
      city: "Mumbai",
      locality: "Altamount Road",
      priceFormatted: "₹42.0 Cr",
      priceNumericCr: 42.0,
      bhk: 5,
      type: "Villa",
      stars: 5,
      rating: 5.0,
      reviewsCount: 62,
      cardPhotoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #44324a 0%, #8c4a63 40%, #201a2b 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      brokerName: "Rohit Malhotra",
      aboutText: "Crowning Mumbai's Billionaires' Row on Altamount Road. 360-degree vistas across the harbor and racecourse, dedicated concierge staff quarters, automated climate zones, and cantilevered infinity pool.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-4",
      name: "Jubilee Hills Modernist Villa",
      city: "Hyderabad",
      locality: "Road No. 36, Jubilee Hills",
      priceFormatted: "₹24.0 Cr",
      priceNumericCr: 24.0,
      bhk: 5,
      type: "Villa",
      stars: 5,
      rating: 4.9,
      reviewsCount: 88,
      cardPhotoUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #3d3d2b 0%, #6e7045 40%, #1f2117 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      brokerName: "Kavita Reddy",
      aboutText: "Striking brutalist-minimalist architectural villa with central reflecting water court, solar net-metering grid, 6-car subterranean climate-controlled garage, and home screening auditorium.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-5",
      name: "Koramangala 3rd Block Residence",
      city: "Bengaluru",
      locality: "Koramangala 3rd Block",
      priceFormatted: "₹18.5 Cr",
      priceNumericCr: 18.5,
      bhk: 4,
      type: "Villa",
      stars: 5,
      rating: 4.8,
      reviewsCount: 76,
      cardPhotoUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #2b3d39 0%, #457068 40%, #141f1c 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      brokerName: "Siddharth Rao",
      aboutText: "Secluded in Bengaluru's elite startup-founder corridor. Features mature rain tree perimeter, heated lap pool, double-height library with bespoke teak joinery, and EV fast-charging bay.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-6",
      name: "Indiranagar 100ft Penthouse",
      city: "Bengaluru",
      locality: "12th Main, Indiranagar",
      priceFormatted: "₹9.8 Cr",
      priceNumericCr: 9.8,
      bhk: 3,
      type: "Penthouse",
      stars: 4,
      rating: 4.7,
      reviewsCount: 110,
      cardPhotoUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #44352b 0%, #7b593f 40%, #1f1813 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      brokerName: "Siddharth Rao",
      aboutText: "Boutique duplex penthouse steps away from Bengaluru's finest culinary and artisanal quarter. Wrap-around sun deck, automated louvered pergola, and integrated acoustic soundproofing.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-7",
      name: "HITEC City Sky Manor",
      city: "Hyderabad",
      locality: "Financial District, Nanakramguda",
      priceFormatted: "₹8.5 Cr",
      priceNumericCr: 8.5,
      bhk: 4,
      type: "Apartment",
      stars: 4,
      rating: 4.7,
      reviewsCount: 95,
      cardPhotoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #2b323d 0%, #3e587b 40%, #13171f 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      brokerName: "Kavita Reddy",
      aboutText: "Directly commanding Hyderabad's tech and finance skyline. Ultra-low density tower with only two residences per floor, private elevator lobby, smart KNX home automation, and 45-meter rooftop pool.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    },
    {
      id: "prop-8",
      name: "Koregaon Park Heritage Estate",
      city: "Pune",
      locality: "Lane 5, Koregaon Park",
      priceFormatted: "₹14.8 Cr",
      priceNumericCr: 14.8,
      bhk: 4,
      type: "Villa",
      stars: 5,
      rating: 4.9,
      reviewsCount: 84,
      cardPhotoUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
      fallbackGradient: "linear-gradient(135deg, #3d2b2b 0%, #704545 40%, #1f1414 100%)",
      detailMainPhotoUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      interiorThumbnails: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
      ],
      brokerAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      brokerName: "Ananya Deshmukh",
      aboutText: "Verdant garden estate in central Koregaon Park surrounded by canopy woods. Wrap-around stone verandas, guest cottage wing, organic kitchen herb garden, and bespoke artisan brass fixtures.",
      fogView: {
        skyMorning: "TODO_skyMorning",
        skyNight: "TODO_skyNight",
        groundMorning: "TODO_groundMorning",
        groundNight: "TODO_groundNight",
        cutoutMorning: "TODO_cutoutMorning",
        cutoutNight: "TODO_cutoutNight",
        focal: { desktop: "50% 62%", mobile: "72% 62%" },
        glow: { x: 0.72, y: 0.74 },
        aiGenerated: true
      }
    }
  ],

  // 4. Three reviewer avatars (120px)
  avatars: [
    {
      id: "avatar-1",
      name: "Aditya Roy",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      fallbackColor: "#e07a5f"
    },
    {
      id: "avatar-2",
      name: "Meera Sen",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      fallbackColor: "#f4a261"
    },
    {
      id: "avatar-3",
      name: "Karan Johar",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      fallbackColor: "#2a9d8f"
    }
  ]
};

/**
 * Utility helper to determine if an image slot is filled or still a TODO
 */
export function isImageConfigured(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith("TODO") || url.includes("example.com")) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}
