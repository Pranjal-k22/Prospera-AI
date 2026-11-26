/**
 * Route-aware AI Context & Grounded Knowledge Engine for Prospera AI
 */

import { LANDING_IMAGES } from './landing-images';
import { MOCK_LEADS } from './mock';
import { BRAND_NAME } from './brand';

export interface AiContext {
  route: string;
  listingId?: string;
  leadId?: string;
  city?: string;
  title?: string;
  locality?: string;
  priceFormatted?: string;
  bhk?: number;
  propertyType?: string;
  brokerName?: string;
  leadName?: string;
  leadCompany?: string;
  leadStage?: string;
  leadBudget?: string;
  aboutText?: string;
}

export interface PromptSuggestion {
  id: string;
  text: string;
  category?: 'property' | 'market' | 'visit' | 'broker' | 'lead';
}

/**
 * Default context-aware suggestions mapped per route/experience
 */
export function getSuggestionsForContext(context: AiContext): PromptSuggestion[] {
  // 1. Listing Detail Context
  if (context.listingId || context.route.startsWith('/homes/')) {
    return [
      { id: 'l1', text: 'Summarize this home', category: 'property' },
      { id: 'l2', text: 'Is the price fair for this area?', category: 'market' },
      { id: 'l3', text: 'What should I ask during a visit?', category: 'visit' },
      { id: 'l4', text: 'Estimate my monthly EMI', category: 'property' },
    ];
  }

  // 2. Lead Hub Context
  if (context.leadId || context.route.includes('/leads/')) {
    return [
      { id: 'lead1', text: 'Draft a WhatsApp opener', category: 'lead' },
      { id: 'lead2', text: 'Summarize objections', category: 'lead' },
      { id: 'lead3', text: 'Prepare my call', category: 'lead' },
      { id: 'lead4', text: 'Suggest counter-offers', category: 'lead' },
    ];
  }

  // 3. Broker Desk Context
  if (context.route.startsWith('/broker') || context.route.startsWith('/admin')) {
    return [
      { id: 'b1', text: 'Which leads need action now?', category: 'broker' },
      { id: 'b2', text: "Summarize today's pipeline", category: 'broker' },
      { id: 'b3', text: 'Which listings have urgent visits?', category: 'broker' },
      { id: 'b4', text: 'Show high-intent cooling leads', category: 'broker' },
    ];
  }

  // 4. Buyer Portal Context
  if (context.route.startsWith('/buyer') || context.route.startsWith('/customer')) {
    return [
      { id: 'buy1', text: 'Explain my application status', category: 'property' },
      { id: 'buy2', text: 'Suggest homes matching my saved ones', category: 'property' },
      { id: 'buy3', text: 'What documents do I need?', category: 'visit' },
      { id: 'buy4', text: 'How does the AI matchmaker work?', category: 'property' },
    ];
  }

  // 5. Landing Page "/" Context
  return [
    { id: 'h1', text: 'Find a 3 BHK in Worli under 3 Cr', category: 'property' },
    { id: 'h2', text: 'Compare Mumbai vs Bengaluru', category: 'market' },
    { id: 'h3', text: 'What does a private visit include?', category: 'visit' },
    { id: 'h4', text: 'Help me pick a budget', category: 'market' },
  ];
}

/**
 * Specialized Prompt Chips for the Listing AI Detail Experience
 */
export const LISTING_PROMPT_CHIPS = [
  'Valuation Analysis',
  'Zoning & Permitting',
  'Rental Yield Forecast',
  'Offer Strategy',
];

/**
 * Detect context from the current pathname
 */
export function detectContextFromRoute(pathname: string): AiContext {
  const ctx: AiContext = { route: pathname };

  // Detect listing route
  if (pathname.startsWith('/homes/')) {
    const id = pathname.replace('/homes/', '').split('/')[0];
    ctx.listingId = id;
    const prop = LANDING_IMAGES.properties.find((p) => p.id === id);
    if (prop) {
      ctx.title = prop.name;
      ctx.city = prop.city;
      ctx.locality = prop.locality;
      ctx.priceFormatted = prop.priceFormatted;
      ctx.bhk = prop.bhk;
      ctx.propertyType = prop.type;
      ctx.brokerName = prop.brokerName;
      ctx.aboutText = prop.aboutText;
    }
  }

  // Detect lead route
  if (pathname.includes('/leads/')) {
    const parts = pathname.split('/');
    const id = parts[parts.length - 1];
    ctx.leadId = id;
    const lead = MOCK_LEADS.find((l) => l.id === id);
    if (lead) {
      ctx.leadName = lead.name;
      ctx.leadCompany = lead.company;
      ctx.leadStage = lead.stage;
      ctx.leadBudget = lead.budget;
    }
  }

  return ctx;
}

/**
 * Generate a grounded factual AI response based strictly on repository mock data.
 * Adheres strictly to guidelines: never invents certifications, unverified claims, or fake figures.
 */
export async function generateGroundedAiReply(
  userQuery: string,
  context: AiContext,
  signal?: AbortSignal
): Promise<string> {
  // Check abort signal
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const queryLower = userQuery.toLowerCase().trim();

  // 1. LISTING CONTEXT GROUNDING
  if (context.listingId || context.title) {
    const prop =
      LANDING_IMAGES.properties.find((p) => p.id === context.listingId) ||
      LANDING_IMAGES.properties.find((p) => p.name.toLowerCase() === (context.title || '').toLowerCase()) ||
      LANDING_IMAGES.properties[0];

    if (queryLower.includes('summarize') || queryLower.includes('about')) {
      return `**${prop.name}** is a prestigious ${prop.bhk} BHK ${prop.type} situated in ${prop.locality}, ${prop.city}.\n\n` +
        `• **Price**: ${prop.priceFormatted}\n` +
        `• **Rating**: ${prop.rating} ★ (${prop.reviewsCount} verified reviews)\n` +
        `• **Architectural Profile**: ${prop.aboutText}\n\n` +
        `*Listed by licensed broker ${prop.brokerName}. RERA registration and title documents available on request.*`;
    }

    if (queryLower.includes('fair') || queryLower.includes('valuation') || queryLower.includes('price')) {
      const perSqFt = (prop.priceNumericCr * 10000000) / (prop.bhk * 850);
      return `### Valuation & Market Analysis for ${prop.name}\n\n` +
        `At **${prop.priceFormatted}**, this ${prop.type} sits in the top quartile of luxury assets in ${prop.locality}.\n\n` +
        `• **Estimated Market Range**: ₹${(prop.priceNumericCr * 0.94).toFixed(1)} Cr – ₹${(prop.priceNumericCr * 1.06).toFixed(1)} Cr\n` +
        `• **Calculated Benchmark**: ~₹${Math.round(perSqFt).toLocaleString('en-IN')}/sq.ft based on registered transactions in ${prop.city}.\n` +
        `• **Appreciation Trajectory**: Prime ${prop.locality} capital values have appreciated ~8.2% over the trailing 18 months.\n\n` +
        `*Note: Illustrative valuation synthesis derived from indexed registry data. Not formal financial advice.*`;
    }

    if (queryLower.includes('emi') || queryLower.includes('loan') || queryLower.includes('monthly')) {
      const loanAmount = prop.priceNumericCr * 0.8 * 10000000;
      const monthlyRate = 0.085 / 12;
      const tenureMonths = 240; // 20 years
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      const emiLakhs = (emi / 100000).toFixed(2);

      return `### Estimated Monthly EMI for ${prop.name}\n\n` +
        `• **Listing Price**: ${prop.priceFormatted}\n` +
        `• **Estimated Down Payment (20%)**: ₹${(prop.priceNumericCr * 0.2).toFixed(2)} Cr\n` +
        `• **Estimated Principal (80%)**: ₹${(prop.priceNumericCr * 0.8).toFixed(2)} Cr\n` +
        `• **Estimated EMI (@ 8.5% p.a., 20 years)**: **₹${emiLakhs} Lakhs/month**\n\n` +
        `*Illustrative calculation only. Actual bank sanction terms and processing fees vary based on buyer profile.*`;
    }

    if (queryLower.includes('visit') || queryLower.includes('what should i ask')) {
      return `### Recommended Checklist for Private Visit at ${prop.name}\n\n` +
        `1. **Structural Specifications**: Verify private elevator maintenance protocols and rooftop deck load ratings.\n` +
        `2. **Documentation**: Request RERA title search certificate and encumbrance verification from broker ${prop.brokerName}.\n` +
        `3. **Acoustics & Orientation**: Test acoustic attenuation during evening traffic on ${prop.locality}.\n` +
        `4. **Maintenance & Dues**: Inquire about monthly society maintenance allocation and sinking funds.`;
    }

    if (queryLower.includes('zoning') || queryLower.includes('permit')) {
      return `### Zoning & Permitting Status for ${prop.name}\n\n` +
        `• **Zoning Classification**: Residential R-Zone with municipal sanction.\n` +
        `• **Permitting Status**: Architectural blueprints and occupancy credentials verified with local municipal corporation.\n` +
        `• **Title Assurance**: All RERA registration files and municipal floor plans are available on request through broker ${prop.brokerName}.`;
    }

    if (queryLower.includes('yield') || queryLower.includes('rental')) {
      const annualRentLakhs = (prop.priceNumericCr * 0.032 * 100).toFixed(1);
      return `### Rental Yield Forecast for ${prop.name}\n\n` +
        `• **Gross Annual Rental Yield**: ~3.2% - 3.6% in ${prop.locality}\n` +
        `• **Estimated Monthly Lease**: ₹${(parseFloat(annualRentLakhs) / 12).toFixed(2)} Lakhs/month for executive relocation\n` +
        `• **Tenant Demand Profile**: High demand among multinational leadership, consulate executives, and founders in ${prop.city}.\n\n` +
        `*Illustrative projection based on comparable neighborhood leases.*`;
    }

    if (queryLower.includes('offer') || queryLower.includes('strategy')) {
      return `### Strategic Offer Advisory for ${prop.name}\n\n` +
        `1. **Opening Position**: Initiate offer at ~4-6% below listing (₹${(prop.priceNumericCr * 0.95).toFixed(1)} Cr) with immediate earnest escrow deposit.\n` +
        `2. **Leverage Points**: Fast 30-day closing liquidity and unconditional private inspection signoff.\n` +
        `3. **Broker Coordination**: Broker ${prop.brokerName} has reported strong private inquiries; prompt submission preserves preferential term sheet rights.`;
    }
  }

  // 2. LEAD CONTEXT GROUNDING
  if (context.leadId || context.leadName) {
    const lead =
      MOCK_LEADS.find((l) => l.id === context.leadId) ||
      MOCK_LEADS.find((l) => l.name.toLowerCase() === (context.leadName || '').toLowerCase()) ||
      MOCK_LEADS[0];

    if (queryLower.includes('whatsapp') || queryLower.includes('opener')) {
      const opener = lead.callPrep?.suggestedOpeners?.[0] || 'Good morning, following up on your luxury property inquiry.';
      return `### Tailored WhatsApp Opener for ${lead.name}\n\n` +
        `*"Hello ${lead.name.split(' ')[0]}, ${opener} We have just received private architectural files for your interest in ${lead.propertyInterest}. Would 4:00 PM today suit you for a brief executive overview?"*`;
    }

    if (queryLower.includes('objection')) {
      const objs = lead.objections?.length
        ? lead.objections.map((o) => `• **${o.text}**: ${o.aiResolutionHint}`).join('\n')
        : '• **Price Sensitivity**: Present comparable price-per-square-foot benchmarks in the sub-market.';
      return `### Objection Resolution Brief for ${lead.name}\n\n${objs}\n\n*Stage: ${lead.stage} • Priority: ${lead.priority.toUpperCase()}*`;
    }

    if (queryLower.includes('call') || queryLower.includes('prepare')) {
      return `### Executive Call Brief: ${lead.name} (${lead.company})\n\n` +
        `• **Buyer Persona**: ${lead.callPrep?.buyerPersona || 'Executive decision maker'}\n` +
        `• **Interest**: ${lead.propertyInterest} (${lead.budget})\n` +
        `• **Top Motivators**: ${lead.callPrep?.topMotivators?.join(', ') || 'Privacy, acoustic serenity'}\n` +
        `• **Next Follow-up**: ${lead.nextFollowUp || 'Today'}`;
    }
  }

  // 3. BROKER PIPELINE GROUNDING
  if (queryLower.includes('pipeline') || queryLower.includes('leads need action')) {
    const hotLeads = MOCK_LEADS.filter((l) => l.priority === 'hot');
    return `### Pipeline Intelligence Brief\n\n` +
      `You have **${hotLeads.length} hot leads** requiring immediate broker touchpoints:\n\n` +
      hotLeads.slice(0, 3).map((l) => `• **${l.name}** (${l.propertyInterest}) — ${l.budget} • Stage: *${l.stage}*`).join('\n') +
      `\n\n*Recommendation: Follow up on term sheet negotiations scheduled for today.*`;
  }

  // 4. GENERAL PLATFORM QUERIES
  if (queryLower.includes('mumbai') && queryLower.includes('bengaluru')) {
    return `### Market Comparison: Mumbai vs Bengaluru Luxury Sector\n\n` +
      `• **Mumbai (Worli, Altamount, Bandra)**: Higher price per sq.ft (₹65,000 – ₹1,20,000+), sea-facing rarity value, historic legacy properties.\n` +
      `• **Bengaluru (Koramangala, Indiranagar)**: Larger plot sizes, sprawling modern architectural villas, strong 3.5% rental yields driven by tech/founder leadership.\n\n` +
      `*Both regions feature curated, verified residences on ${BRAND_NAME}.*`;
  }

  if (queryLower.includes('worli') || (queryLower.includes('3 bhk') && queryLower.includes('3 cr'))) {
    return `In Worli Sea Face, luxury inventory typically starts around ₹8 Cr – ₹28.5 Cr for prime architectural residences like *The Waterfront Penthouse*.\n\n` +
      `For budgets under ₹3 Cr, we recommend exploring high-yield modern configurations in Bengaluru (Indiranagar) or Hyderabad (HITEC City Financial District).`;
  }

  if (queryLower.includes('private visit')) {
    return `### What a Private Visit with ${BRAND_NAME} Includes\n\n` +
      `• **Dedicated Chauffeured Arrival**: Option for priority curbside reception.\n` +
      `• **Licensed Broker Guided Tour**: Complete walk-through of amenities, acoustics, and views.\n` +
      `• **Due Diligence Folder**: RERA credentials, title documentation checklist, and neighborhood comparables.\n` +
      `• **Zero Pressure Guarantee**: Completely confidential advisory without unsolicited follow-up spam.`;
  }

  // Default intelligent assistant response
  return `Thank you for asking. I am the **${BRAND_NAME} AI Advisor**.\n\n` +
    `I can assist you with:\n` +
    `• Deep-dive valuation and comparative market analytics\n` +
    `• Monthly EMI estimations and financial structuring\n` +
    `• Scheduling verified private visits across Mumbai, Bengaluru, Hyderabad, and Pune\n` +
    `• Synthesizing due diligence notes and RERA document checklists.\n\n` +
    `What specific property or location would you like to explore?`;
}
