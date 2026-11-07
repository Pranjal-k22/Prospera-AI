/**
 * Mock dataset for Prospera AI - Indian Luxury Real Estate Intelligence
 */

export interface ObjectionItem {
  id: string;
  text: string;
  resolved: boolean;
  aiResolutionHint: string;
}

export interface Lead {
  id: string;
  name: string;
  avatar: string;
  company: string;
  title: string;
  propertyInterest: string;
  propertyId?: string;
  budget: string;
  budgetValueCr: number;
  location: string;
  score: number;
  priority: 'hot' | 'warm' | 'cold';
  stage: 'Inquiry' | 'Call Scheduled' | 'Site Visit' | 'Negotiation' | 'Term Sheet' | 'Closed Won';
  lastContacted: string;
  nextFollowUp: string;
  coolingAlert: boolean;
  coolingDays?: number;
  phone: string;
  email: string;
  objections: ObjectionItem[];
  callPrep: {
    buyerPersona: string;
    topMotivators: string[];
    suggestedOpeners: string[];
    objectionResponses: { objection: string; suggestedAnswer: string }[];
  };
  debriefNotes: {
    id: string;
    date: string;
    author: string;
    sentiment: 'positive' | 'neutral' | 'guarded';
    content: string;
    scoreDelta: number;
  }[];
  copilotMessages: {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
  }[];
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  price: string;
  priceNumericCr: number;
  location: string;
  city: string;
  bhk: number;
  carpetAreaSqFt: number;
  image: string;
  gallery: string[];
  features: string[];
  amenities: string[];
  aiProsCons: {
    pros: string[];
    cons: string[];
    investmentVerdict: string;
  };
  possessionDate: string;
  status: 'Ready to Move' | 'Under Construction' | 'Nearing Completion';
  matchScore?: number;
}

export interface Application {
  id: string;
  applicationNumber: string;
  propertyTitle: string;
  propertyLocation: string;
  offerAmount: string;
  submittedDate: string;
  status: 'In Review' | 'Verified' | 'Underwriting' | 'Escrow Ready' | 'Action Needed' | 'Completed';
  currentStepIndex: number;
  urgentAttentionRequired: boolean;
  urgentReason?: string;
  timeline: {
    step: string;
    description: string;
    date: string;
    completed: boolean;
    current: boolean;
  }[];
}

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Rajesh Jhunjhunwala',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'Apex Horizon Capital',
    title: 'Managing Partner',
    propertyInterest: 'The Waterfront Penthouse, Worli Sea Face',
    propertyId: 'prop-1',
    budget: '₹28.5 Cr',
    budgetValueCr: 28.5,
    location: 'Mumbai, Maharashtra',
    score: 94,
    priority: 'hot',
    stage: 'Negotiation',
    lastContacted: '2 hours ago',
    nextFollowUp: 'Today, 4:30 PM (Strategy Call)',
    coolingAlert: false,
    phone: '+91 98201 44521',
    email: 'rajesh@apexhorizon.in',
    objections: [
      {
        id: 'obj-1',
        text: 'Vastu compliance in the north-east master suite',
        resolved: true,
        aiResolutionHint: 'Architectural drawings confirm north-east master alignment with open ocean balcony.',
      },
      {
        id: 'obj-2',
        text: 'High quarterly maintenance reserves (₹2.4 Lakh/qtr)',
        resolved: false,
        aiResolutionHint: 'Highlight that reserves include private high-speed lift maintenance and rooftop infinity pool upkeep.',
      },
      {
        id: 'obj-3',
        text: 'Demands 4 reserved basement car parks instead of standard 3',
        resolved: false,
        aiResolutionHint: 'Offer tandem parking spot B-14 as complimentary closing concession.',
      },
    ],
    callPrep: {
      buyerPersona: 'High-Net-Worth Founder / Ultra-discreet value investor. Values legacy prestige, unobstructed Arabian Sea views, and rapid paperless transaction.',
      topMotivators: [
        'Unobstructed sunset views of Bandra-Worli Sea Link',
        'Direct private elevator opening into double-height foyer',
        'Private terrace jacuzzi and entertaining pavilion',
      ],
      suggestedOpeners: [
        '“Rajesh, I reviewed your query regarding the north-east orientation. Our structural architect verified the master bedroom matches exact Vastu specs.”',
        '“Given the recent stamp duty adjustment window closing next month, this unit offers a ₹42L tax savings advantage.”',
      ],
      objectionResponses: [
        {
          objection: 'Maintenance seems steeper than surrounding towers.',
          suggestedAnswer: '“Unlike multi-tower complexes with 500 units, this boutique tower has only 18 residences, ensuring zero queue times for services and absolute privacy.”',
        },
      ],
    },
    debriefNotes: [
      {
        id: 'deb-1',
        date: 'Yesterday, 5:15 PM',
        author: 'Arjun Verma (Lead Broker)',
        sentiment: 'positive',
        content: 'Client visited with his spouse and private interior consultant. They spent 40 minutes admiring the sea-facing deck. Spouse loved the Italian marble finish. Requested final term sheet with 4 car parks.',
        scoreDelta: 6,
      },
    ],
    copilotMessages: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Hello Arjun! Rajesh Jhunjhunwala is your highest-velocity hot lead today (Score 94). How can I assist you before the 4:30 PM call?',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'What is our strongest leverage point regarding his 4th car parking demand?',
        timestamp: '10:02 AM',
      },
      {
        id: 'msg-3',
        sender: 'assistant',
        text: 'The developer currently has slot B-14 unassigned. If Rajesh commits to signing the Letter of Intent within 48 hours, you can bundle B-14 at zero cost—saving him ₹35 Lakh while securing developer sign-off.',
        timestamp: '10:02 AM',
      },
    ],
  },
  {
    id: 'lead-2',
    name: 'Dr. Ananya Sengupta',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'Fortis Healthcare',
    title: 'Chief of Neuro-Oncology',
    propertyInterest: 'Sky Villa Residences, Koregaon Park',
    propertyId: 'prop-2',
    budget: '₹9.8 Cr',
    budgetValueCr: 9.8,
    location: 'Pune, Maharashtra',
    score: 88,
    priority: 'hot',
    stage: 'Site Visit',
    lastContacted: 'Yesterday',
    nextFollowUp: 'Tomorrow, 11:00 AM (Site Walkthrough)',
    coolingAlert: false,
    phone: '+91 98902 33119',
    email: 'ananya.sengupta@fortis.org',
    objections: [
      {
        id: 'obj-4',
        text: 'Noise insulation from future metro line expansion',
        resolved: true,
        aiResolutionHint: 'Building incorporates Schüco triple-glazed acoustic soundproof glass (STC 45dB).',
      },
      {
        id: 'obj-5',
        text: 'Distance to Ruby Hall Clinic & Pune Airport during peak hours',
        resolved: false,
        aiResolutionHint: 'Highlight upcoming riverbed arterial road reducing travel time to 12 minutes.',
      },
    ],
    callPrep: {
      buyerPersona: 'Distinguished surgeon seeking calm sanctuary after intense hospital shifts. Highly analytical, focuses on acoustic tranquility and green canopy surroundings.',
      topMotivators: [
        'Old-growth banyan tree canopy views in Lane 5 Koregaon Park',
        'Private lap pool on wrap-around sky terrace',
        'Concierge medical emergency backup power grid',
      ],
      suggestedOpeners: [
        '“Dr. Sengupta, we measured ambient decibel levels on the 14th floor balcony at under 36dB—quieter than a library.”',
      ],
      objectionResponses: [
        {
          objection: 'Will metro construction disrupt peace?',
          suggestedAnswer: '“The dual-chamber Schüco glazing eliminates all low-frequency acoustic vibrations completely.”',
        },
      ],
    },
    debriefNotes: [
      {
        id: 'deb-2',
        date: '3 days ago',
        author: 'Arjun Verma',
        sentiment: 'positive',
        content: 'Completed virtual digital twin walkthrough. Client appreciated the layout flexibility to create a private medical study.',
        scoreDelta: 4,
      },
    ],
    copilotMessages: [],
  },
  {
    id: 'lead-3',
    name: 'Vikram Singhania',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    company: 'Singhania Logistics & Supply',
    title: 'Executive Director',
    propertyInterest: 'The Grand Botanica Duplex, Indiranagar',
    propertyId: 'prop-3',
    budget: '₹14.5 Cr',
    budgetValueCr: 14.5,
    location: 'Bengaluru, Karnataka',
    score: 82,
    priority: 'hot',
    stage: 'Term Sheet',
    lastContacted: '1 day ago',
    nextFollowUp: 'Today, 6:00 PM',
    coolingAlert: false,
    phone: '+91 97411 88902',
    email: 'vikram@singhanialogistics.com',
    objections: [
      {
        id: 'obj-6',
        text: 'Demands 100% DG backup for private temperature-controlled wine cellar',
        resolved: true,
        aiResolutionHint: 'Confirmed dual-redundant Cummins generator sets provide uninterrupted dedicated circuit.',
      },
      {
        id: 'obj-7',
        text: 'Legal indemnity clause regarding Bruhat Bengaluru Mahanagara Palike setback clearance',
        resolved: false,
        aiResolutionHint: 'Legal team has ready A-Khata certification and Supreme Court setback compliance certificate.',
      },
    ],
    callPrep: {
      buyerPersona: 'Second-generation enterprise industrialist expanding to Bengaluru tech corridor. Appreciates architectural craftsmanship and turnkey luxury finishes.',
      topMotivators: [
        'Walkable proximity to 12th Main Indiranagar fine dining',
        'Private rooftop observatory deck',
        'Custom Poliform Italian kitchen already fitted',
      ],
      suggestedOpeners: [
        '“Vikram, the legal title search report from Cyril Amarchand Mangaldas is fully stamped and verified for your review.”',
      ],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-4',
    name: 'Priyadarshini Mehta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    company: 'Mehta Fine Jewels',
    title: 'Creative Director',
    propertyInterest: 'The Glass Pavilion, Jubilee Hills',
    propertyId: 'prop-4',
    budget: '₹22.0 Cr',
    budgetValueCr: 22.0,
    location: 'Hyderabad, Telangana',
    score: 74,
    priority: 'warm',
    stage: 'Call Scheduled',
    lastContacted: '4 days ago',
    nextFollowUp: 'Needs Re-engagement',
    coolingAlert: true,
    coolingDays: 4,
    phone: '+91 98490 22415',
    email: 'priyadarshini@mehtajewels.com',
    objections: [
      {
        id: 'obj-8',
        text: 'Hesitant about rock-formation topography for customized subterranean vault',
        resolved: false,
        aiResolutionHint: 'Geotechnical soil report confirms solid granite bed ideal for specialized high-security reinforced room.',
      },
    ],
    callPrep: {
      buyerPersona: 'Discreet luxury jeweler with ultra-specific security and gallery-style display lighting requirements.',
      topMotivators: [
        'Prestige address on Road No. 36 Jubilee Hills',
        'Natural rocky ridge views and private cantilevered infinity pool',
      ],
      suggestedOpeners: [
        '“Priyadarshini, we received the structural engineer’s structural ultrasound: the granite bedrock is flawless for your secure display gallery.”',
      ],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-5',
    name: 'Siddharth Roy Kapoor',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    company: 'Starlight Film Studio',
    title: 'Managing Producer',
    propertyInterest: 'Bandra West Coastal Manor, Bandra',
    propertyId: 'prop-5',
    budget: '₹34.0 Cr',
    budgetValueCr: 34.0,
    location: 'Mumbai, Maharashtra',
    score: 79,
    priority: 'warm',
    stage: 'Site Visit',
    lastContacted: '3 days ago',
    nextFollowUp: 'Thursday, 3:00 PM',
    coolingAlert: false,
    phone: '+91 98200 99881',
    email: 'srk@starlightfilms.in',
    objections: [
      {
        id: 'obj-9',
        text: 'Paparazzi privacy from perimeter foliage and neighbouring sea road',
        resolved: true,
        aiResolutionHint: 'Perimeter features 22-foot bio-wall with dense bamboo fencing and polarized smart glass.',
      },
    ],
    callPrep: {
      buyerPersona: 'Media & entertainment mogul prioritizing total confidentiality, private screening auditorium, and soundproof studio space.',
      topMotivators: ['Private beach access gate', 'Private 14-seater Dolby Atmos screening room'],
      suggestedOpeners: ['“Siddharth, the acoustic engineer calibrated the screening room to THX Certified standards.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-6',
    name: 'Sunita Reddy',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    company: 'Reddy Bioscience Corp',
    title: 'Founder & CEO',
    propertyInterest: 'The Shivalik Reserve Estate, Sadashivanagar',
    propertyId: 'prop-6',
    budget: '₹18.0 Cr',
    budgetValueCr: 18.0,
    location: 'Bengaluru, Karnataka',
    score: 68,
    priority: 'warm',
    stage: 'Inquiry',
    lastContacted: '5 days ago',
    nextFollowUp: 'Needs Follow-up',
    coolingAlert: true,
    coolingDays: 5,
    phone: '+91 99001 55672',
    email: 'sunita@reddybio.com',
    objections: [],
    callPrep: {
      buyerPersona: 'Biotech entrepreneur seeking serene heritage green enclave with seamless airport expressway access.',
      topMotivators: ['Palatial tree-lined avenue', 'Smart home automation with geothermal cooling'],
      suggestedOpeners: ['“Sunita, the solar micro-grid data for Shivalik Reserve shows 85% energy autonomy.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-7',
    name: 'Karan Mehra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    company: 'FinTech Velocity',
    title: 'Co-founder',
    propertyInterest: 'Sky Courtyard, HITEC City',
    propertyId: 'prop-7',
    budget: '₹7.5 Cr',
    budgetValueCr: 7.5,
    location: 'Hyderabad, Telangana',
    score: 71,
    priority: 'warm',
    stage: 'Call Scheduled',
    lastContacted: 'Yesterday',
    nextFollowUp: 'Friday, 2:00 PM',
    coolingAlert: false,
    phone: '+91 97000 11223',
    email: 'karan@fintechvelocity.io',
    objections: [],
    callPrep: {
      buyerPersona: 'Young tech founder, expects modern minimalist design, EV chargers, and ultra high-speed fiber ring.',
      topMotivators: ['5-minute commute to HITEC cyber district', 'Dual 22kW private EV chargers in parking'],
      suggestedOpeners: ['“Karan, the duplex has dedicated dual-redundant 10Gbps fiber lines configured.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-8',
    name: 'Ayesha Merchant',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    company: 'Merchant Global Maritime',
    title: 'Director of Operations',
    propertyInterest: 'The Heritage Promenade, Colaba',
    propertyId: 'prop-8',
    budget: '₹26.0 Cr',
    budgetValueCr: 26.0,
    location: 'Mumbai, Maharashtra',
    score: 85,
    priority: 'hot',
    stage: 'Negotiation',
    lastContacted: '3 hours ago',
    nextFollowUp: 'Today, 7:00 PM',
    coolingAlert: false,
    phone: '+91 98205 12890',
    email: 'ayesha@merchantmaritime.com',
    objections: [
      {
        id: 'obj-10',
        text: 'Heritage conservation committee approval timeline for rooftop glass solarium',
        resolved: false,
        aiResolutionHint: 'BMC Grade-II heritage NOC has already been granted and valid for 36 months.',
      },
    ],
    callPrep: {
      buyerPersona: 'Shipping scion with global residences in London and Singapore. Desires colonial high-ceiling architectural pedigree near Royal Bombay Yacht Club.',
      topMotivators: ['Colonial 16-foot ceilings with Burma teak beams', 'Harbour views overlooking Mumbai Port'],
      suggestedOpeners: ['“Ayesha, the Municipal Corporation’s heritage committee sanction document is in hand.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-9',
    name: 'Naveen Jindal',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    company: 'Shree Cement Infrastructure',
    title: 'VP Strategic Growth',
    propertyInterest: 'The Oakhill Sanctuary, Golf Course Road',
    propertyId: 'prop-9',
    budget: '₹16.5 Cr',
    budgetValueCr: 16.5,
    location: 'Gurugram, Delhi NCR',
    score: 55,
    priority: 'cold',
    stage: 'Inquiry',
    lastContacted: '8 days ago',
    nextFollowUp: 'Needs Re-qualification',
    coolingAlert: true,
    coolingDays: 8,
    phone: '+91 98110 33455',
    email: 'naveen@shreecement.com',
    objections: [
      {
        id: 'obj-11',
        text: 'Delaying purchase until Q3 financial results',
        resolved: false,
        aiResolutionHint: 'Suggest structured payment milestone plan linked to construction milestones rather than upfront lumpsum.',
      },
    ],
    callPrep: {
      buyerPersona: 'Corporate executive balancing liquidity and corporate bonus cycles.',
      topMotivators: ['Direct golf course fairway views', 'DLF Phase 5 ecosystem'],
      suggestedOpeners: ['“Naveen, developer introduced a 20:80 subvention structure that requires only 20% down today.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-10',
    name: 'Meera Chawla',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    company: 'Chawla Couture House',
    title: 'Founder & Designer',
    propertyInterest: 'The Courtyard Villa, Alibaug',
    propertyId: 'prop-10',
    budget: '₹12.0 Cr',
    budgetValueCr: 12.0,
    location: 'Alibaug, Maharashtra',
    score: 64,
    priority: 'cold',
    stage: 'Inquiry',
    lastContacted: '6 days ago',
    nextFollowUp: 'Send curated Lookbook',
    coolingAlert: true,
    coolingDays: 6,
    phone: '+91 98211 44556',
    email: 'meera@chawlacouture.com',
    objections: [],
    callPrep: {
      buyerPersona: 'Fashion designer looking for a weekend coastal estate with tropical Balinese landscape and private jetty access.',
      topMotivators: ['15-minute Ro-Pax speedboat connection from Gateway of India', 'Private organic mango orchard'],
      suggestedOpeners: ['“Meera, Mandwa jetty now has dedicated luxury water taxi slips for residents.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-11',
    name: 'Gaurav Kothari',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    company: 'Kothari Diamonds',
    title: 'Managing Partner',
    propertyInterest: 'The Grand Botanica Duplex, Indiranagar',
    propertyId: 'prop-3',
    budget: '₹13.8 Cr',
    budgetValueCr: 13.8,
    location: 'Bengaluru, Karnataka',
    score: 77,
    priority: 'warm',
    stage: 'Site Visit',
    lastContacted: '2 days ago',
    nextFollowUp: 'Saturday, 11:30 AM',
    coolingAlert: false,
    phone: '+91 98450 67890',
    email: 'gaurav@kotharidiamonds.com',
    objections: [],
    callPrep: {
      buyerPersona: 'Traditional family business principal looking for security and top international school proximity.',
      topMotivators: ['TISB and Greenwood High school bus direct pickup route', 'Gated multi-tier security'],
      suggestedOpeners: ['“Gaurav, the community is fully occupied by fellow industrial and tech family principals.”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
  {
    id: 'lead-12',
    name: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    company: 'CloudMatrix Technologies',
    title: 'Chief Technology Officer',
    propertyInterest: 'Sky Villa Residences, Koregaon Park',
    propertyId: 'prop-2',
    budget: '₹8.9 Cr',
    budgetValueCr: 8.9,
    location: 'Pune, Maharashtra',
    score: 83,
    priority: 'hot',
    stage: 'Negotiation',
    lastContacted: '5 hours ago',
    nextFollowUp: 'Tomorrow, 4:00 PM',
    coolingAlert: false,
    phone: '+91 99220 88712',
    email: 'rohan@cloudmatrix.ai',
    objections: [
      {
        id: 'obj-12',
        text: 'Requesting inclusion of motorized Lutron shades throughout the double-height living room',
        resolved: false,
        aiResolutionHint: 'Developer agreed to furnish Lutron automation package if token deposit is placed by Friday.',
      },
    ],
    callPrep: {
      buyerPersona: 'Tech executive with high focus on automated lighting, IoT integration, and EV charging.',
      topMotivators: ['Pre-wired Crestron smart automation ecosystem', 'Fast connectivity to EON IT Park Kharadi'],
      suggestedOpeners: ['“Rohan, developer confirmed the Lutron package can be included into the contract terms!”'],
      objectionResponses: [],
    },
    debriefNotes: [],
    copilotMessages: [],
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Waterfront Penthouse, Worli',
    tagline: 'Unobstructed Arabian Sea & Sea Link Panorama',
    price: '₹28.5 Cr',
    priceNumericCr: 28.5,
    location: 'Worli Sea Face, Mumbai',
    city: 'Mumbai',
    bhk: 5,
    carpetAreaSqFt: 6200,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Direct Private High-Speed Elevator', 'Rooftop Heated Jacuzzi Deck', '4 Covered Stilt Parking Bays', 'Triple-Glazed Acoustic Facade'],
    amenities: ['24/7 White Glove Butler Service', 'Private Wine Tasting Cellar', 'Oceanfront Gymnasium', 'Helipad Access Rights'],
    aiProsCons: {
      pros: [
        'Highest floor unit guaranteeing perpetual ocean views immune to future construction',
        'Exceptional capital appreciation trajectory in Worli luxury micro-market (+14% YoY)',
        'Full Vastu compliance certified by Vedic architectural auditors',
      ],
      cons: [
        'Maintenance fee of ₹2.4 Lakh per quarter',
        'Strict society approval protocol for interior modifications',
      ],
      investmentVerdict: 'Prime Trophy Asset. High liquidity and unmatched trophy status for ultra-high-net-worth portfolio.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 98,
  },
  {
    id: 'prop-2',
    title: 'Sky Villa Residences, Koregaon Park',
    tagline: 'Quiet Luxury amidst Century-Old Banyan Canopies',
    price: '₹9.8 Cr',
    priceNumericCr: 9.8,
    location: 'Lane 5, Koregaon Park, Pune',
    city: 'Pune',
    bhk: 4,
    carpetAreaSqFt: 4400,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Double-Height Living Pavilion', 'Wrap-around Garden Verandah', 'Schüco German Soundproofing', 'Private Swimming Pool'],
    amenities: ['Oxygen-Infused Clubhouse', 'Organic Kitchen Garden', 'EV Fast Charging Network', 'Valet Concierge'],
    aiProsCons: {
      pros: [
        'Low-density boutique community (only 12 bespoke residences)',
        'Zero traffic sound with 36dB acoustic insulation',
        'Minutes from Osho Teerth Park & fine dining precinct',
      ],
      cons: ['Limited guest parking during private celebrations'],
      investmentVerdict: 'Top Tier Residential pick in Pune. Ideal for medical leaders, executives, and artists.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 94,
  },
  {
    id: 'prop-3',
    title: 'The Grand Botanica Duplex, Indiranagar',
    tagline: 'Biophilic Urban Sanctuary in Central Bengaluru',
    price: '₹14.5 Cr',
    priceNumericCr: 14.5,
    location: '12th Main, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    bhk: 4,
    carpetAreaSqFt: 4850,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Poliform Italian Modular Kitchen', 'Temperature-Controlled Wine Room', 'Private Terrace Observatory', 'Dual-redundant 10Gbps Fiber'],
    amenities: ['Hydroponic Rooftop Greenhouse', 'Private Squash Court', 'Spa & Cryotherapy Chamber'],
    aiProsCons: {
      pros: [
        'Rare Indiranagar freehold clear title property',
        'Walkable lifestyle to Bangalore’s best culinary and retail hubs',
      ],
      cons: ['Weekend traffic congestion along 100 Feet Road'],
      investmentVerdict: 'Rare supply in premier pin code with 11.2% historical appreciation.',
    },
    possessionDate: 'Nearing Completion (Dec 2026)',
    status: 'Nearing Completion',
    matchScore: 91,
  },
  {
    id: 'prop-4',
    title: 'The Glass Pavilion, Jubilee Hills',
    tagline: 'Cantilevered Hilltop Architecture over Durgam Cheruvu',
    price: '₹22.0 Cr',
    priceNumericCr: 22.0,
    location: 'Road No. 36, Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    bhk: 5,
    carpetAreaSqFt: 7100,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Cantilevered Edge Infinity Pool', 'Subterranean Vault Room Foundation', 'Granite Rock Sculptural Courtyard', 'Full Solar Autonomy'],
    amenities: ['Chauffeur Lounge', 'Multi-tier Biometric Security', 'Private Cigar Lounge'],
    aiProsCons: {
      pros: ['Most prestigious residential street in South India', 'Breathtaking lake and cable bridge views'],
      cons: ['Substantial plot grading requires specialized foundation maintenance'],
      investmentVerdict: 'Generational family asset in Hyderabad’s billionaire corridor.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 89,
  },
  {
    id: 'prop-5',
    title: 'Bandra West Coastal Manor',
    tagline: 'Ultra-Private Sanctuary Steps from Carter Road Promenade',
    price: '₹34.0 Cr',
    priceNumericCr: 34.0,
    location: 'Carter Road, Bandra West, Mumbai',
    city: 'Mumbai',
    bhk: 5,
    carpetAreaSqFt: 6800,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['14-Seater Dolby Atmos Private Theater', 'Bio-Wall Privacy Shielding', 'Private Beach Gate', 'Commercial Chef Kitchen'],
    amenities: ['Round-the-clock Armed Security Post', 'Private Docking Access', 'Steam & Sauna Suite'],
    aiProsCons: {
      pros: ['Celebrity-grade perimeter privacy and soundproofing', 'Zero shared walls with neighbours'],
      cons: ['Very high coastal humidity requires active dehumidification systems'],
      investmentVerdict: 'Elite trophy villa with virtually zero new supply comparable on the coastline.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 96,
  },
  {
    id: 'prop-6',
    title: 'The Shivalik Reserve Estate, Sadashivanagar',
    tagline: 'Colonial Elegance with Smart Geothermal Comfort',
    price: '₹18.0 Cr',
    priceNumericCr: 18.0,
    location: 'Sadashivanagar, Bengaluru',
    city: 'Bengaluru',
    bhk: 4,
    carpetAreaSqFt: 5300,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Geothermal Radiant Cooling', 'Solar Micro-Grid with Tesla Powerwalls', 'Burma Teak Parquet Flooring', 'English Herb Garden'],
    amenities: ['Tennis Lawn', 'Private Library with Humidor', 'Heated Saltwater Pool'],
    aiProsCons: {
      pros: ['Direct highway connection to Kempegowda International Airport (25 mins)', 'Historic diplomatic neighbourhood'],
      cons: ['Rigid architectural guidelines for exterior alterations'],
      investmentVerdict: 'Rock-solid long-term wealth preservation property.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 87,
  },
  {
    id: 'prop-7',
    title: 'Sky Courtyard Duplex, HITEC City',
    tagline: 'Futuristic Penthouse overlooking Cyber Towers',
    price: '₹7.5 Cr',
    priceNumericCr: 7.5,
    location: 'Financial District, Hyderabad',
    city: 'Hyderabad',
    bhk: 3,
    carpetAreaSqFt: 3600,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Pre-installed Crestron Home Automation', 'Dual 22kW Fast EV Chargers', 'Double-Height Glass Curtain Wall', 'Motorized Louvers'],
    amenities: ['Sky Co-Working Lounge', 'Sky Golf Simulator', 'Infinity Edge Sky Pool'],
    aiProsCons: {
      pros: ['Walking distance to major multinational tech headquarters', 'High rental yield for expat tenants (4.8% net)'],
      cons: ['Higher density tower community than private villa enclaves'],
      investmentVerdict: 'High cashflow generator with stellar corporate tenancy demand.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 85,
  },
  {
    id: 'prop-8',
    title: 'The Heritage Promenade, Colaba',
    tagline: 'Colonial High-Ceiling Splendour near Gateway of India',
    price: '₹26.0 Cr',
    priceNumericCr: 26.0,
    location: 'Colaba Causeway, Mumbai',
    city: 'Mumbai',
    bhk: 4,
    carpetAreaSqFt: 5100,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['16-Foot Volume Ceilings', 'Burma Teak Antique Trusses', 'Italian Statuario Marble Slabs', 'Rooftop Solarium with Sea View'],
    amenities: ['Private Heritage Concierge', 'Yacht Mooring Priority Rights', 'Dedicated Chauffeur Living Quarters'],
    aiProsCons: {
      pros: ['BMC Grade-II heritage NOC approved', 'Rare opportunity to own Old Mumbai maritime history'],
      cons: ['Colaba tourist traffic during weekend evenings'],
      investmentVerdict: 'Trophy collector’s piece. Values consistently outpace conventional luxury high-rises.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 92,
  },
  {
    id: 'prop-9',
    title: 'The Oakhill Sanctuary, Golf Course Road',
    tagline: 'Fairway-Facing Panorama in DLF Phase 5',
    price: '₹16.5 Cr',
    priceNumericCr: 16.5,
    location: 'DLF Phase 5, Gurugram, Delhi NCR',
    city: 'Delhi NCR',
    bhk: 4,
    carpetAreaSqFt: 5400,
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Direct Fairway Frontage', 'Private Golf Cart Garage', 'Air Purification Central HVAC (AQI < 25)', 'Floor-to-Ceiling Low-E Glass'],
    amenities: ['Golf Club Membership Included', 'Temperature-Controlled Indoor Lap Pool', 'Fine Dining Room Service'],
    aiProsCons: {
      pros: ['Unobstructed greenery in heart of Gurugram', 'Strict AQI hospital-grade air purification built-in'],
      cons: ['Premium golf maintenance levy'],
      investmentVerdict: 'Benchmark corporate residence on Golf Course Road.',
    },
    possessionDate: 'Under Construction (Oct 2026)',
    status: 'Under Construction',
    matchScore: 81,
  },
  {
    id: 'prop-10',
    title: 'The Courtyard Villa, Alibaug',
    tagline: 'Tropical Modernist Waterfront Estate with Private Jetty',
    price: '₹12.0 Cr',
    priceNumericCr: 12.0,
    location: 'Awas Beach, Alibaug, Maharashtra',
    city: 'Alibaug',
    bhk: 4,
    carpetAreaSqFt: 6500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Private Speedboat Slip at Mandwa', 'Mature Alphonso Mango Grove', 'Open-Air Balinese Rain Showers', 'Solar Battery Storage'],
    amenities: ['Resident Farm-to-Table Caretaker', 'Outdoor Woodfired Pizza Oven', 'Perimeter Infrared Sensor Net'],
    aiProsCons: {
      pros: ['Only 15 minutes by speedboat from South Mumbai', 'Low tax jurisdiction and peaceful coastal lifestyle'],
      cons: ['Monsoon requires seasonal weatherproofing protocol'],
      investmentVerdict: 'Ideal weekend secondary residence for South Mumbai elites.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 78,
  },
  {
    id: 'prop-11',
    title: 'The Sky Crest, Worli',
    tagline: 'Ultra-Luxury High-Rise Residence with 360° Skyline Views',
    price: '₹19.5 Cr',
    priceNumericCr: 19.5,
    location: 'Worli, Mumbai',
    city: 'Mumbai',
    bhk: 4,
    carpetAreaSqFt: 4600,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Panoramic Deck', 'Italian Kitchen with Miele Appliances', 'Smart Home Lighting & Climate Automation', 'Dedicated Maid Quarters'],
    amenities: ['Private Cinema', 'Sky Lounge', 'Temperature Controlled Infinity Pool', 'Spa & Wellness Suite'],
    aiProsCons: {
      pros: ['Close to commercial hubs of Lower Parel and BKC', 'Developer has flawless delivery track record'],
      cons: ['High floor premiums'],
      investmentVerdict: 'Strong capital preservation asset with prime rental appeal.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 90,
  },
  {
    id: 'prop-12',
    title: 'The Sovereign Estate, Jubilee Hills',
    tagline: 'Palatial Private Compound with Landscaped Grounds',
    price: '₹31.0 Cr',
    priceNumericCr: 31.0,
    location: 'Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    bhk: 6,
    carpetAreaSqFt: 9200,
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=900&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=900&auto=format&fit=crop&q=80',
    ],
    features: ['Subterranean 8-Car Garage', 'Private Bowling Alley', 'Indoor Heated Lap Pool', 'Guest Villa Annex'],
    amenities: ['Private Security Compound', 'Full Generator Autonomy', 'Helipad Deck'],
    aiProsCons: {
      pros: ['Unmatched private acreage in Jubilee Hills', 'Multi-generational family compound layout'],
      cons: ['Substantial monthly groundskeeping staffing needed'],
      investmentVerdict: 'One-of-a-kind royal estate offering privacy and monumental scale.',
    },
    possessionDate: 'Ready to Move',
    status: 'Ready to Move',
    matchScore: 95,
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-101',
    applicationNumber: 'PR-2026-8819',
    propertyTitle: 'The Waterfront Penthouse, Worli Sea Face',
    propertyLocation: 'Worli Sea Face, Mumbai',
    offerAmount: '₹28.50 Cr',
    submittedDate: 'Nov 01, 2026',
    status: 'Escrow Ready',
    currentStepIndex: 4,
    urgentAttentionRequired: false,
    timeline: [
      { step: 'Offer Letter Submitted', description: 'Formal token proposal delivered to developer legal counsel', date: 'Nov 01, 2026', completed: true, current: false },
      { step: 'AI Document & KYC Verification', description: 'PAN, Aadhaar, HNI source of wealth and CIBIL certified', date: 'Nov 02, 2026', completed: true, current: false },
      { step: 'Property Title & Setback Search', description: 'Clean A-Khata & Municipal Corporation occupancy certificate verified', date: 'Nov 03, 2026', completed: true, current: false },
      { step: 'Term Sheet & Concession Finalization', description: '4th car park spot B-14 attached to schedule of finishes', date: 'Nov 04, 2026', completed: true, current: false },
      { step: 'Escrow Deposit Authorization', description: 'Awaiting client approval for 10% token deposit transfer (₹2.85 Cr)', date: 'Today', completed: false, current: true },
      { step: 'Final Registry & Key Handover', description: 'Sub-registrar digital slot appointment & biometric signing', date: 'Nov 12, 2026', completed: false, current: false },
    ],
  },
  {
    id: 'app-102',
    applicationNumber: 'PR-2026-8742',
    propertyTitle: 'The Glass Pavilion, Jubilee Hills',
    propertyLocation: 'Jubilee Hills, Hyderabad',
    offerAmount: '₹22.00 Cr',
    submittedDate: 'Oct 28, 2026',
    status: 'Action Needed',
    currentStepIndex: 2,
    urgentAttentionRequired: true,
    urgentReason: 'Subterranean geotechnical clearance certificate awaiting sign-off from civil engineer.',
    timeline: [
      { step: 'Offer Letter Submitted', description: 'Digital earnest deposit recorded', date: 'Oct 28, 2026', completed: true, current: false },
      { step: 'AI Document & KYC Verification', description: 'Financial verification completed with zero exceptions', date: 'Oct 29, 2026', completed: true, current: false },
      { step: 'Civil Engineering Sign-off', description: 'Bedrock load test report pending official stamp from civil inspector', date: 'Pending Action', completed: false, current: true },
      { step: 'Bank Underwriting Review', description: 'HDFC Private Banking draft sanctioned subject to engineering NOC', date: 'Pending', completed: false, current: false },
      { step: 'Escrow Deposit Authorization', description: 'Token disbursement', date: 'Pending', completed: false, current: false },
      { step: 'Final Registry & Key Handover', description: 'Sub-registrar appointment', date: 'Pending', completed: false, current: false },
    ],
  },
  {
    id: 'app-103',
    applicationNumber: 'PR-2026-8690',
    propertyTitle: 'Sky Villa Residences, Koregaon Park',
    propertyLocation: 'Koregaon Park, Pune',
    offerAmount: '₹9.80 Cr',
    submittedDate: 'Oct 25, 2026',
    status: 'Underwriting',
    currentStepIndex: 3,
    urgentAttentionRequired: false,
    timeline: [
      { step: 'Offer Letter Submitted', description: 'Letter of intent signed with token deposit', date: 'Oct 25, 2026', completed: true, current: false },
      { step: 'AI Document & KYC Verification', description: 'Verified within 4 minutes via DigiLocker API', date: 'Oct 26, 2026', completed: true, current: false },
      { step: 'Property Title Search', description: 'Searched 30 years historical revenue records with zero encumbrance', date: 'Oct 28, 2026', completed: true, current: false },
      { step: 'Bank Underwriting & Stamp Valuation', description: 'ICICI Wealth Desk reviewing mortgage collateral appraisal', date: 'In Progress', completed: false, current: true },
      { step: 'Escrow Deposit Authorization', description: 'Final disbursement', date: 'Nov 09, 2026', completed: false, current: false },
      { step: 'Final Registry & Key Handover', description: 'Handover ceremony', date: 'Nov 15, 2026', completed: false, current: false },
    ],
  },
];

/**
 * Data Access & Helper functions with simulated network/AI latency.
 */

export async function getLeads(): Promise<Lead[]> {
  await new Promise((r) => setTimeout(r, 60));
  return MOCK_LEADS;
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  await new Promise((r) => setTimeout(r, 40));
  return MOCK_LEADS.find((l) => l.id === id);
}

export async function updateLeadObjection(leadId: string, objectionId: string, resolved: boolean): Promise<Lead | undefined> {
  const lead = MOCK_LEADS.find((l) => l.id === leadId);
  if (!lead) return undefined;
  const obj = lead.objections.find((o) => o.id === objectionId);
  if (obj) {
    obj.resolved = resolved;
    // Dynamically adjust score
    const resolvedCount = lead.objections.filter((o) => o.resolved).length;
    const totalCount = lead.objections.length || 1;
    const baseScore = 70;
    lead.score = Math.min(99, Math.round(baseScore + (resolvedCount / totalCount) * 28));
  }
  return { ...lead };
}

export async function saveDebriefNotes(leadId: string, notes: string, sentiment: 'positive' | 'neutral' | 'guarded'): Promise<Lead | undefined> {
  const lead = MOCK_LEADS.find((l) => l.id === leadId);
  if (!lead) return undefined;
  
  const scoreDelta = sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 1 : -3;
  lead.score = Math.max(20, Math.min(99, lead.score + scoreDelta));
  lead.debriefNotes.unshift({
    id: `deb-${Date.now()}`,
    date: 'Just now',
    author: 'You (Active Broker)',
    sentiment,
    content: notes,
    scoreDelta,
  });
  return { ...lead };
}

export async function getProperties(): Promise<Property[]> {
  await new Promise((r) => setTimeout(r, 60));
  return MOCK_PROPERTIES;
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  await new Promise((r) => setTimeout(r, 40));
  return MOCK_PROPERTIES.find((p) => p.id === id);
}

export async function getApplications(): Promise<Application[]> {
  await new Promise((r) => setTimeout(r, 60));
  return MOCK_APPLICATIONS;
}

export async function aiMatchmakerSearch(query: string): Promise<Property[]> {
  await new Promise((r) => setTimeout(r, 650)); // Realistic AI synthesis delay
  const lower = query.toLowerCase();
  
  // Smart filter based on keywords
  return MOCK_PROPERTIES.filter((p) => {
    if (lower.includes('mumbai') && p.city.toLowerCase() !== 'mumbai') return false;
    if (lower.includes('pune') && p.city.toLowerCase() !== 'pune') return false;
    if (lower.includes('bengaluru') || lower.includes('bangalore')) {
      if (p.city.toLowerCase() !== 'bengaluru') return false;
    }
    if (lower.includes('hyderabad') && p.city.toLowerCase() !== 'hyderabad') return false;
    if (lower.includes('sea') && !p.tagline.toLowerCase().includes('sea') && !p.title.toLowerCase().includes('waterfront')) return false;
    if (lower.includes('pool') && !p.features.some(f => f.toLowerCase().includes('pool')) && !p.amenities.some(a => a.toLowerCase().includes('pool'))) return false;
    return true;
  }).slice(0, 4).map((p, idx) => ({
    ...p,
    matchScore: 98 - idx * 4,
  }));
}

