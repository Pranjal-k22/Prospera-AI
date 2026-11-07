<div align="center">
  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" alt="Prospera AI Cover" width="100%" style="border-radius: 12px; margin-bottom: 20px;">

  # Prospera AI
  **Enterprise Real Estate Intelligence Deal Room & Client Portal**

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react" alt="Recharts" />
  </p>
</div>

---

## 🌟 Overview

**Prospera AI** is a modern, enterprise SaaS real estate CRM and deal execution platform. It replaces outdated spreadsheets with an active, AI-powered intelligence engine that automates lead scoring, generates contextual call briefings, and provides clients with a transparent concierge portal.

Designed with a clean, light enterprise design system (Slate & Indigo), Prospera AI provides a synchronized two-sided experience:
- **For Advisory Brokers (The Deal Room):** Real-time priority pipeline tracking, automated call prep, post-call debrief re-scoring, inventory management, and executive analytics.
- **For Property Clients (The Concierge Portal):** Verified inventory browsing, natural language global property matching, seller intake, and live deal milestone timelines.

---

## ✨ Core Features

### 🏢 The Broker Deal Room (`/admin`)
- **Deterministic AI Lead Scoring:** Automatically parses inquiries across 5 evaluation dimensions (Intent, Timeline, Budget, Engagement, Completeness) with staleness decay penalties to compute a 0–99 score.
- **Dynamic Priority Pipeline:** Instant filtering across *All*, *Hot to Call* (urgent attention), and *At Risk* (uncontacted for 3+ days).
- **One-Click Call Prep & Debrief:** Pre-call briefings (icebreakers, discovery questions, rebuttals) and automated debriefing that updates the CRM from raw call notes.
- **Autonomous Sales Copilot:** Context-aware assistant to draft WhatsApp/email replies and evaluate client requirements.
- **Executive Analytics:** Recharts visualizations tracking active portfolio value, conversion velocity, and pipeline distributions.

### 🛋️ The Client Concierge Portal (`/customer`)
- **Clean SaaS Interface:** Light, high-contrast, modern responsive design.
- **AI Global Matchmaker:** Natural language property search across global cities (e.g., Paris, Dubai, Mumbai) with bespoke pitches and pros/cons.
- **Live Deal Timelines:** Real-time milestone tracker showing status from submission to approval.
- **Priority Escalation:** Client-triggered urgency button that elevates deals to top priority in the broker's deal room.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_minimum_32_chars
GROQ_API_KEY=your_ai_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Seed Database
```bash
npx tsx scripts/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔒 Role-Based Access Control (RBAC)
- **Broker / Admin (`role: 'admin'`):** Access to `/admin`, `/admin/leads/[id]`, `/admin/inventory`, `/admin/analytics`.
- **Client (`role: 'customer'`):** Access to `/customer`.
