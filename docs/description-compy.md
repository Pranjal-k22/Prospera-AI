# Prospera AI — Comprehensive System Documentation & Architecture Reference

> **File Name:** `description-compy.md`  
> **Location:** `C:\WEB DEVELOPMENT\Prospera AI\docs\description-compy.md`  
> **Project Title:** Prospera AI (Autonomous Luxury Real Estate Deal Room & Client Intelligence Engine)  
> **Brand Constant:** `BRAND_NAME = "Prospera"` (`src/lib/brand.ts`)  
> **Stack:** Next.js 16.3 (Turbopack, App Router), React 19.2, TypeScript 5, Tailwind CSS 4, MongoDB Atlas (Mongoose 9), Groq SDK (Llama 3.3 70B), Google Generative AI (Gemini 1.5), Framer Motion 14, WebGL2 GLSL Shaders, Verlet Physics Engine.

---

## Table of Contents

1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Complete Directory & Folder Structure](#2-complete-directory--folder-structure)
   - [Root Configuration Files](#21-root-configuration-files)
   - [Documentation (`/docs`)](#22-documentation-docs)
   - [Automation & Seeding Scripts (`/scripts`)](#23-automation--seeding-scripts-scripts)
   - [Static Assets (`/public`)](#24-static-assets-public)
   - [Application Source Code (`/src`)](#25-application-source-code-src)
     - [App Router Architecture (`src/app`)](#251-app-router-architecture-srcapp)
     - [Component Systems (`src/components`)](#252-component-systems-srccomponents)
     - [Core Libraries & Business Logic (`src/lib`)](#253-core-libraries--business-logic-srclib)
     - [Data Models (`src/models`)](#254-data-models-srcmodels)
3. [Comprehensive API Reference Catalog](#3-comprehensive-api-reference-catalog)
   - [Authentication Endpoints (`/api/auth/*`)](#31-authentication-endpoints-apiauth)
   - [Broker Deal Desk & Lead Management (`/api/leads/*`)](#32-broker-deal-desk--lead-management-apileads)
   - [Customer Concierge & Applications (`/api/customer/*`)](#33-customer-concierge--applications-apicustomer)
   - [Property Inventory Endpoints (`/api/inventory/*`)](#34-property-inventory-endpoints-apiinventory)
   - [System & Automation Crons (`/api/cron/*`)](#35-system--automation-crons-apicron)
4. [Deterministic AI Lead Scoring Algorithm](#4-deterministic-ai-lead-scoring-algorithm)
5. [Signature Motion, Physics & Shader Systems](#5-signature-motion-physics--shader-systems)
   - [DesignBookmark Pull Cord Ceiling Lamp (`<PullCord />`)](#51-designbookmark-pull-cord-ceiling-lamp-pullcord-)
   - [WebGL2 Morning / Night Fog Hero (`<FogHero />`)](#52-webgl2-morning--night-fog-hero-foghero-)
   - [VengeanceUI Kinetic Generate Button (`<GenerateButton />`)](#53-vengeanceui-kinetic-generate-button-generatebutton-)
   - [Apple VisionOS Liquid Glass (`<LiquidGlass />`)](#54-apple-visionos-liquid-glass-liquidglass-)
   - [Gooey Spring AI Copilot Launcher (`<AskAiLauncher />`)](#55-gooey-spring-ai-copilot-launcher-askailauncher-)
6. [Database Models & Schemas](#6-database-models--schemas)
7. [Authentication, Security & RBAC Middleware](#7-authentication-security--rbac-middleware)
8. [Centralized Brand System & Key Migration](#8-centralized-brand-system--key-migration)
9. [Environment Variables & Quickstart Deployment](#9-environment-variables--quickstart-deployment)

---

## 1. Executive Summary & Product Vision

**Prospera AI** is a next-generation luxury real estate transaction platform engineered to eliminate spreadsheets, manual qualification bottlenecks, and opaque buyer experiences. It unifies two traditionally disparate worlds into an integrated, real-time ecosystem:

1. **The Broker Deal Desk (`/admin`, `/broker`):**  
   An automated intelligence cockpit designed for high-end advisory brokers and deal captains. It features deterministic 0–99 AI lead scoring across 5 behavioral dimensions, dynamic staleness decay penalties, 1-click pre-call briefings (icebreakers, discovery questions, rebuttals), automated post-call debrief extraction, and portfolio analytics via interactive Recharts.
2. **The High-Net-Worth Client Concierge (`/buyer`, `/customer`, `/`):**  
   A cinematic, editorial buyer marketplace featuring full-bleed architectural discovery, natural language international property matching, bespoke middleman sales pitches, real-time transaction milestone timelines, and client-triggered priority escalation.

---

## 2. Complete Directory & Folder Structure

```text
Prospera AI/
├── docs/                                  # Documentation, audits, and verification screenshot artifacts
│   ├── ai-chat/                           # Ask AI launcher, expanded input & streaming panel screenshots
│   ├── generate-button/                   # Kinetic GenerateButton audit & usage screenshots
│   ├── landing-screenshots/               # Full-bleed marketing landing page captures across breakpoints
│   ├── listing-fog/                       # WebGL2 morning/night fog transition screenshots
│   ├── pull-cord/                         # Pull Cord ceiling lamp dark & lit room captures
│   ├── screenshots/                       # Multi-breakpoint captures of Broker, Buyer, and Admin portals
│   ├── stage-0/                           # Stage 0 brand and compliance audit captures
│   ├── description-compy.md               # [THIS FILE] Complete, exhaustive project documentation
│   ├── landing-audit.md                   # Visual QA audit of the landing page
│   └── ui-audit.md                        # Component and token compliance audit
├── public/                                # Static public web assets
│   ├── image.png                          # Ambient luxury estate hero backdrop for app shell blur
│   └── favicon.ico                        # Browser favicon
├── scripts/                               # Node.js / TypeScript automation and testing scripts
│   ├── seed.ts                            # MongoDB seeder for verified properties and leads
│   ├── get_models.ts                      # Utility script inspecting active AI models
│   ├── capture-ai-chat.js                 # Headless Chrome CDP script for AI chat visual tests
│   ├── capture-all-routes.js              # Comprehensive multi-route screenshot test harness
│   ├── capture-fog-dev.js                 # Headless verification script for WebGL2 fog
│   ├── capture-generate-button.js         # Automated tester for kinetic button states
│   ├── capture-landing.js                 # Landing page visual capture suite
│   ├── check-console.js                   # Headless browser console error auditor
│   ├── debug-canvas.js                    # WebGL2 canvas context inspector
│   ├── test-cdp.js                        # Chrome DevTools Protocol test harness
│   └── test-gl.js                         # Headless WebGL2 shader compile tester
├── src/                                   # Application source code
│   ├── app/                               # Next.js 16 App Router (pages, layouts, styles, APIs)
│   ├── components/                        # Domain-grouped reusable React components
│   ├── lib/                               # Core libraries, AI orchestration, helpers, auth
│   ├── models/                            # Mongoose database schemas
│   └── middleware.ts                      # Edge auth verification and RBAC routing middleware
├── .env.local                             # Local environment variables (API keys, DB URIs)
├── .gitignore                             # Git exclusion list (includes /docs/, /node_modules/, /.next/)
├── eslint.config.mjs                      # ESLint 9 Flat Config with Next.js & React 19 Core Web Vitals
├── next.config.ts                         # Next.js 16 compiler configuration
├── package.json                           # Project dependencies and npm scripts
├── postcss.config.mjs                     # PostCSS 4 Tailwind configuration
└── tsconfig.json                          # Strict TypeScript configuration
```

---

### 2.1 Root Configuration Files

- **`package.json`**: Defines dependencies (Next.js 16.3.6, React 19.2.8, Tailwind CSS 4, Framer Motion 14.9, Mongoose 9.10, Groq SDK 1.6, Google Generative AI 0.24, Recharts 3.10, Jose 6.2, Bcryptjs 3.0) and scripts (`npm run dev`, `npm run build`, `npm run start`, `npm run lint`).
- **`next.config.ts`**: Configures Turbopack, remote image domains (Unsplash CDN `images.unsplash.com`), and experimental features.
- **`eslint.config.mjs`**: ESLint 9 flat configuration extending `nextVitals` and `nextTs`. Explicitly ignores `.next/**`, `out/**`, `build/**`, `docs/**`, and `.chrome*/**`.
- **`.gitignore`**: Excludes dependencies, builds, environment secrets, and `/docs/`.
- **`tsconfig.json`**: Configured with `"strict": true`, paths alias `@/* -> ./src/*`, and modern ES modules.

---

### 2.2 Documentation (`/docs`)

- **`/docs/ai-chat/`**: Captures illustrating the collapsed Ask AI pill, expanded search input, staggered suggested prompt chips, and streaming copilot responses.
- **`/docs/generate-button/`**: High-resolution captures of `<GenerateButton>` in Dark and Light themes across 1440px, 768px, and 390px viewports, plus audits verifying allowed AI usage.
- **`/docs/listing-fog/`**: Visual evidence of the WebGL2 shader transition: Morning light, Night mode, and the mid-transition volumetric fog surge.
- **`/docs/pull-cord/`**: Screen captures of the interactive ceiling lamp in both Obsidian Dark and Warm Dusk states on desktop and mobile.
- **`/docs/screenshots/`**: Full-page responsive captures of `/broker`, `/buyer`, `/admin`, and `/dev/ui`.
- **`description-compy.md`**: Complete, single-source-of-truth reference covering every folder, route, component, API, and physics formula.

---

### 2.3 Automation & Seeding Scripts (`/scripts`)

- **`seed.ts`**: Mongoose database seeder. Connects to `MONGODB_URI`, clears existing collections, and inserts verified luxury property records and realistic buyer leads with pre-calculated 5D AI scores and analysis.
- **`capture-all-routes.js` / `capture-landing.js` / `capture-ai-chat.js`**: Node.js scripts that launch headless Google Chrome via Chrome DevTools Protocol (CDP), navigate to local routes, simulate user clicks, and save PNG screenshots into `docs/`.
- **`test-gl.js` & `debug-canvas.js`**: Diagnostic tools that initialize a headless WebGL2 canvas, compile the vertex and fragment fog shaders, and assert that zero GL errors occur.

---

### 2.4 Static Assets (`/public`)

- **`image.png`**: High-resolution architectural photography used with radial vignette and heavy gaussian blur in `app-shell::before` (`globals.css`) to create deep atmospheric backdrop depth.
- **`favicon.ico`**: Standard website favicon.

---

### 2.5 Application Source Code (`/src`)

#### 2.5.1 App Router Architecture (`src/app`)

- **`src/app/layout.tsx`**: The root layout. Imports Google Fonts (`Outfit`, `Playfair Display`, `Urbanist`, `Oswald`, `Gilda Display`, `Dancing Script`), mounts `ToastProvider`, renders the global `app-shell`, and embeds the persistent `<AskAiLauncher />`.
- **`src/app/globals.css`**: Central stylesheet. Integrates Tailwind CSS 4, defines light/dark CSS custom properties, and houses custom styling for:
  - `.pull-cord-*`: Complete CSS classes for the hanging lamp fixture, cap, shade, lit bulb glow, SVG rope paths, and porcelain bead.
  - `.gen-btn-*`: Dual-layer bevel, ambient halo, rising hue highlight gradient, and kinetic letter waves.
  - `.glass-pill` & `.panel`: Backdrop blur, specular rim borders, and liquid glass reflections.
- **`src/app/page.tsx`**: The cinematic marketing landing page ("Find your next home in India"). Features:
  - 3-slide hero wipe with giant gradient headlines and drifting clouds.
  - Interactive city orbit rail (Mumbai, Bengaluru, Hyderabad, Pune).
  - Luxury search bar with natural language AI query suggestions.
  - Curated architectural collection with card-to-modal shared-element flight.
- **`src/app/login/page.tsx`**: Deal room authentication. Features the **DesignBookmark Pull Cord** animated ceiling fixture. Pulling the bead pops the bulb, floods the viewport with a circular light wave, and transitions the deal room card from Obsidian Night to Warm Dusk.
- **`src/app/signup/page.tsx`**: Client and broker registration page with encrypted credential creation.
- **`src/app/buyer/page.tsx`**: The Buyer Discovery Portal. Enables ultra-high-net-worth clients to filter luxury estates by city, budget, BHK, and amenities, inspect photo galleries, and submit confidential inquiries.
- **`src/app/broker/page.tsx`**: Broker Deal Desk overview. Visualizes active deals by stage (Discovery, Viewing, Negotiation, Won, Lost), highlighting urgent and at-risk leads.
- **`src/app/broker/leads/[id]/page.tsx`**: Dedicated broker cockpit for an individual lead, providing real-time AI conversation guidance, deal status updates, and note logs.
- **`src/app/admin/page.tsx`**: Executive Deal Room. Displays prioritized lead lists with deterministic 0–99 AI scores, quick filters (*All*, *Hot to Call*, *At Risk*), and immediate action indicators.
- **`src/app/admin/analytics/page.tsx`**: Executive analytics dashboard utilizing Recharts for active deal volume, conversion velocity, and pipeline distributions.
- **`src/app/admin/inventory/page.tsx`**: Inventory management interface for adding, updating, and auditing luxury listings.
- **`src/app/admin/leads/[id]/page.tsx`**: Comprehensive lead debrief cockpit with 1-click pre-call AI briefing, call debrief note ingestion, and AI objection handling.
- **`src/app/admin/leads/new/page.tsx`**: Manual inquiry creation desk with instant AI parsing and priority scoring.
- **`src/app/customer/page.tsx`**: Client Concierge Portal. Allows logged-in clients to track their submitted applications, review milestone timelines, chat with their advisor, and trigger priority escalation beacons.
- **`src/app/homes/[id]/page.tsx`**: Single property luxury detail page featuring the **WebGL2 Morning / Night Fog transition hero**.
- **`src/app/dev/ui/page.tsx`**: Internal design system laboratory demonstrating every button state, modal, glass card, and typography token.
- **`src/app/dev/fog/page.tsx`**: WebGL2 shader testbench allowing live adjustment of fog density, wind speed, turbulence, and time of day.
- **`src/app/not-found.tsx`**: Custom 404 page with luxury styling and navigation shortcuts back to `/` and `/buyer`.

---

#### 2.5.2 Component Systems (`src/components`)

##### Domain 1: Marketing Landing (`src/components/landing/`)
- **`LandingHero.tsx`**: Manages the 3-slide auto-advancing carousel, volumetric drifting clouds, and gradient typography transitions.
- **`CityOrbitRail.tsx`**: Vertical column of circular orbital city nodes with active pulsing indicators.
- **`SearchBar.tsx`**: Glass search pill equipped with budget dropdowns, BHK filters, and natural language AI prompts.
- **`PropertyCard.tsx`**: Visual property card featuring image hover zoom, price chips, and card-to-modal flight animations.
- **`PropertyDetailModal.tsx`**: Full-screen luxury detail overlay with spec grids, map previews, and concierge booking.
- **`CuratedCollectionSection.tsx`**: Grid layout rendering handpicked luxury residential listings.
- **`HowItWorksSection.tsx`**: 3-step advisory workflow explanation (AI Curation, Private Viewings, Sovereign Closing).
- **`ArchitecturalSpotlightSection.tsx`**: Highlight reel dedicated to landmark developer properties.
- **`Footer.tsx`**: Minimalist luxury footer with `BRAND_NAME` integration and legal disclaimers.

##### Domain 2: Property Detail & Shaders (`src/components/listing/`)
- **`FogHero.tsx`**: React wrapper for the WebGL2 fragment shader canvas. Controls the 3-layer parallax, morning/night lighting swap, ground reveal, and 1800ms sink-and-rise animation.
- **`PropertySpecs.tsx`**: Clean specification grid (carpet area, ceiling height, facing, RERA registration, parking bays).
- **`PropertyGallery.tsx`**: High-resolution image gallery with lightbox support.

##### Domain 3: AI Copilot System (`src/components/ai/`)
- **`AskAiLauncher.tsx`**: Floating bottom-right chat launcher. Transforms from a compact pill into a 320px input with staggered suggestion chips.
- **`AiChatPanel.tsx`**: Slide-out streaming conversational panel that analyzes context from the active listing or deal room.
- **`useAiChat.ts`**: Custom React hook managing streaming messages, request aborts, and chat history.

##### Domain 4: Core UI & Physics (`src/components/ui/`)
- **`PullCord.tsx`**: Complete React implementation of the DesignBookmark animated ceiling lamp with Verlet rope solver and circular clip-path light reveal.
- **`GenerateButton.tsx`**: The standard AI kinetic button with glowing bevel, halo ring, hue gradient, and letter wave.
- **`LiquidGlass.tsx`**: Frosted glass container component featuring specular lighting, border highlights, and backdrop filtration.
- **`Button.tsx`**: Standard primary and secondary button components.
- **`Navbar.tsx`**: Sticky navigation bar with Apple VisionOS-style liquid glass navigation pills.
- **`ThemeToggle.tsx`**: Dedicated toggle switch for dark and light modes.
- **`Toast.tsx`**: Global animated toast notification provider (`ToastProvider`, `showToast`).
- **`Sparkline.tsx`**: Compact SVG trendline visualizer for mini metric cards.

##### Domain 5: Shell & Layout (`src/components/`)
- **`Sidebar.tsx`**: Navigation sidebar for `/admin` and `/broker` desks, displaying user avatar, active route links, and partner details (**Pranjal**).
- **`Icon.tsx`**: Lightweight SVG icon registry.

---

#### 2.5.3 Core Libraries & Business Logic (`src/lib`)

- **`brand.ts`**: Centralized single source of truth for branding:
  ```ts
  export const BRAND_NAME = "Prospera";
  export const BRAND_FULL_NAME = `${BRAND_NAME} AI`;
  export const BRAND_TAGLINE = "Find your next home in India";
  ```
  Includes `getStorageKey()` with automatic legacy key migration (`prospera-*` $\to$ `<brand>-*`) so saved favorites survive rebranding.
- **`landing-images.ts`**: Registry of verified, licensed architectural photography from Unsplash, categorized by city and estate tier.
- **`ai/provider.ts`**: Multi-model AI abstraction layer supporting Groq (Llama 3.3 70B) and Google Gemini 1.5. Exposes `analyzeLead()`, `generateCallBrief()`, `debriefCall()`, and `chatWithLead()`.
- **`ai/scoring.ts`**: The mathematical deterministic 5-dimension scoring engine. Computes weighted scores and applies staleness decay penalties.
- **`ai/schemas.ts`**: Strict Zod and JSON schemas ensuring structured, hallucination-free outputs from LLM calls.
- **`ai-context.ts`**: Context aggregator that synthesizes user history, active listing specs, and objection logs into AI prompt context.
- **`auth.ts`**: Stateless authentication utility using `jose` for HS256 JWT signing and verification, and cookie serialization.
- **`inventory.ts`**: Static catalog fallback of properties in Mumbai, Bengaluru, Hyderabad, and Pune.
- **`mock.ts`**: Full mock database for leads, chat messages, and broker actions.
- **`mongoose.ts`**: Cached singleton MongoDB connection pool handler ensuring zero socket leaks during Next.js hot reloads.
- **`motion.ts`**: Reusable Framer Motion spring presets (`defaultSpring`, `softSpring`, `snappySpring`).
- **`utils.ts`**: Utility function `cn()` combining `clsx` and `tailwind-merge`.

---

#### 2.5.4 Data Models (`src/models`)

- **`Lead.ts`**: Mongoose model representing customer inquiries, AI analysis, objections, priority tiers, and call debrief history.
- **`Property.ts`**: Mongoose model representing verified luxury properties, prices, locations, and specifications.
- **`User.ts`**: Mongoose model for broker and customer user accounts with bcrypt-hashed passwords and RBAC roles.

---

## 3. Comprehensive API Reference Catalog

All API routes live under `src/app/api/` and utilize Next.js 16 Route Handlers.

```
/api
├── auth/
│   ├── login/         (POST)  Authenticate & set JWT cookie
│   ├── logout/        (POST)  Clear JWT session cookie
│   └── signup/        (POST)  Register new user
├── leads/
│   ├── route.ts       (GET)   List leads sorted by priority
│   │                  (POST)  Submit & score new inquiry
│   └── [id]/
│       ├── route.ts   (GET)   Retrieve lead details
│       ├── approve/   (POST)  Mark lead as won/approved
│       ├── chat/      (POST)  Contextual lead AI chat
│       ├── close/     (POST)  Close lead with reason
│       ├── debrief/   (POST)  Ingest call notes & re-score
│       ├── matches/   (POST)  AI property matching for lead
│       └── prep/      (GET)   Generate pre-call briefing
├── customer/
│   ├── applications/  (GET)   List customer applications
│   ├── apply/         (POST)  Submit purchase/sale application
│   │                  (DELETE)Withdraw submitted application
│   ├── chat/          (POST)  Customer concierge AI chat
│   ├── matches/       (POST)  Natural language global matchmaker
│   └── urgent/        (POST)  Escalate deal to HOT 99
├── inventory/
│   ├── route.ts       (GET)   Fetch property listings
│   ├── [id]/route.ts  (GET)   Fetch single property details
│   └── seed/route.ts  (GET)   Reset & seed property inventory
└── cron/
    └── sync/          (POST)  Simulated MLS AI listing scraper
```

---

### 3.1 Authentication Endpoints (`/api/auth/*`)

#### 1. `POST /api/auth/login`
- **Purpose:** Authenticates an existing user and issues an HTTP-only JWT cookie.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "broker@prospera.ai",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "role": "admin"
  }
  ```
- **Cookie Set:** `token=<jwt_token>; HttpOnly; Path=/; Max-Age=86400`
- **Error Codes:** `400 Bad Request` (missing fields), `401 Unauthorized` (invalid email or password), `500 Internal Error`.

#### 2. `POST /api/auth/signup`
- **Purpose:** Creates a new user record in MongoDB with bcrypt password hashing and signs an initial session token.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "role": "customer"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "role": "customer"
  }
  ```
- **Error Codes:** `400 Bad Request` (email already exists or missing fields).

#### 3. `POST /api/auth/logout`
- **Purpose:** Destroys the active session by expiring the HTTP-only `token` cookie.
- **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```
- **Cookie Set:** `token=; HttpOnly; Path=/; Max-Age=0`

---

### 3.2 Broker Deal Desk & Lead Management (`/api/leads/*`)

#### 4. `GET /api/leads`
- **Purpose:** Returns all active inquiries sorted by priority score descending (`priority.score: -1`).
- **Response (200 OK):** Array of `Lead` documents including scores, priority tiers, and analysis summaries.

#### 5. `POST /api/leads`
- **Purpose:** Ingests a new buyer inquiry, executes `analyzeLead()` via AI, calculates deterministic 5D scores, and saves the inquiry.
- **Request Body:**
  ```json
  {
    "name": "Aarav Mehta",
    "location": "Worli Sea Face",
    "requirement": "4 BHK Penthouse",
    "budget": "₹ 24 Cr",
    "timeline": "Immediate",
    "message": "Looking for high floor with unobstructed ocean views and duplex terrace."
  }
  ```
- **Response (201 Created):** Full created `Lead` object with populated `analysis` and `priority` fields.

#### 6. `GET /api/leads/[id]`
- **Purpose:** Retrieves full detail for a single lead, including chat history, debrief history, and objection checklists.
- **URL Parameters:** `id` (MongoDB ObjectId).
- **Response (200 OK):** `Lead` document or `404 Not Found`.

#### 7. `GET /api/leads/[id]/prep`
- **Purpose:** Generates a real-time, bespoke pre-call briefing before a broker dials a client.
- **Response (200 OK):**
  ```json
  {
    "opening_icebreaker": "Acknowledge their preference for Worli Sea Face and recent high-floor sales.",
    "discovery_questions": [
      "Is possession strictly immediate or is a 6-month fit-out window acceptable?",
      "Do you require dedicated staff quarters?"
    ],
    "anticipated_objections": [
      {
        "objection": "Maintenance fees",
        "counter_narrative": "Highlight private concierge and high-speed private elevator maintenance inclusion."
      }
    ],
    "recommended_closing_action": "Propose private sunset terrace viewing this Thursday."
  }
  ```

#### 8. `POST /api/leads/[id]/debrief`
- **Purpose:** Ingests raw, unstructured broker call notes, extracts updated client requirements/objections via AI, recalculates 5D scores, and appends a debrief log.
- **Request Body:**
  ```json
  {
    "callNotes": "Spoke to Aarav. Budget is flexible up to 28 Cr. Wants possession by Diwali. Parking for 4 cars is a dealbreaker."
  }
  ```
- **Response (200 OK):** Updated `Lead` document with updated priority tier and appended `debriefHistory`.

#### 9. `POST /api/leads/[id]/approve`
- **Purpose:** Flags the deal status as `'approved'` (Deal Won).
- **Response (200 OK):** `{ "success": true, "lead": { ... } }`.

#### 10. `POST /api/leads/[id]/close`
- **Purpose:** Closes a deal with a mandatory reason (e.g., "Lost to Competitor", "Budget Unrealistic").
- **Request Body:** `{ "reason": "Purchased alternate property in Bandra" }`.
- **Response (200 OK):** `{ "success": true, "lead": { ... } }`.

#### 11. `POST /api/leads/[id]/chat`
- **Purpose:** Interactive conversational copilot for an individual lead. Allows brokers to ask for custom email drafts, objection handles, or negotiation tactics.
- **Request Body:** `{ "question": "Draft a formal WhatsApp message following up on our call." }`.
- **Response (200 OK):** `{ "response": "..." }`.

#### 12. `POST /api/leads/[id]/matches`
- **Purpose:** Synthesizes 3 international/regional luxury property recommendations tailored to the client's exact profile and budget.
- **Response (200 OK):** `{ "matches": [ { "property_name": "...", "price": "...", "sales_pitch": "...", "pros": [...], "cons": [...] } ] }`.

---

### 3.3 Customer Concierge & Applications (`/api/customer/*`)

#### 13. `GET /api/customer/applications`
- **Purpose:** Fetches all inquiries and deal applications submitted by the currently authenticated customer.
- **Headers:** Requires valid HTTP-only `token` cookie.
- **Response (200 OK):** `{ "success": true, "leads": [...] }`.

#### 14. `POST /api/customer/apply`
- **Purpose:** Submits a buying interest application for a specific estate or initiates a seller listing appraisal.
- **Request Body:**
  ```json
  {
    "type": "buy",
    "propertyId": "prop-1",
    "propertyName": "The Waterfront Penthouse",
    "fullDetails": { "location": "Worli", "price": "₹ 18.5 Cr" }
  }
  ```
- **Response (201 Created):** `{ "success": true, "leadId": "..." }`.

#### 15. `DELETE /api/customer/apply?id=<leadId>`
- **Purpose:** Allows a client to withdraw their pending application (`status: 'withdrawn'`).
- **Response (200 OK):** `{ "success": true }`.

#### 16. `POST /api/customer/urgent`
- **Purpose:** Client-triggered urgency beacon. Immediately elevates lead priority to **HOT 99** and marks `next_action` as immediate callback.
- **Request Body:** `{ "leadId": "65f..." }`.
- **Response (200 OK):** `{ "success": true, "lead": { ... } }`.

#### 17. `POST /api/customer/chat`
- **Purpose:** Customer-facing AI concierge assistant for property inquiries, neighborhood information, and scheduling.
- **Request Body:** `{ "messages": [ { "role": "user", "content": "Tell me about Bandra luxury trends" } ] }`.
- **Response (200 OK):** `{ "reply": "..." }`.

#### 18. `POST /api/customer/matches`
- **Purpose:** Natural language global property matchmaker across worldwide cities (e.g., Paris, Dubai, London, Mumbai).
- **Request Body:** `{ "query": "Modern duplex with sea view in Dubai Marina under $4M" }`.
- **Response (200 OK):**
  ```json
  {
    "matches": [
      {
        "property_id": "gen_1",
        "property_name": "Marina Heights Sky Villa",
        "location": "Dubai Marina, Dubai",
        "bhk": "4 Bedroom Duplex",
        "price": "$3,850,000",
        "match_score": 96,
        "sales_pitch": "Unrivalled marina canal panoramas with private infinity plunge pool.",
        "pros": ["Private berth option", "High rental yield"],
        "cons": ["Service charges apply"],
        "images": ["https://images.unsplash.com/..."]
      }
    ]
  }
  ```

---

### 3.4 Property Inventory Endpoints (`/api/inventory/*`)

#### 19. `GET /api/inventory`
- **Purpose:** Retrieves all verified properties from MongoDB. Falls back to static catalog if DB is empty.
- **Response (200 OK):** Array of property objects.

#### 20. `GET /api/inventory/[id]`
- **Purpose:** Retrieves a single property record by ID.
- **Response (200 OK):** Property object.

#### 21. `GET /api/inventory/seed`
- **Purpose:** Resets the `Property` collection and re-populates it with the verified master inventory.
- **Response (200 OK):** `{ "success": true, "seededCount": 8 }`.

---

### 3.5 System & Automation Crons (`/api/cron/*`)

#### 22. `POST /api/cron/sync`
- **Purpose:** Automated scraping and listing synthesizer simulation. Uses AI to synthesize 2 new luxury Mumbai properties with verified Unsplash images and inserts them into MongoDB.
- **Response (200 OK):** `{ "success": true, "count": 2, "properties": [...] }`.

---

## 4. Deterministic AI Lead Scoring Algorithm

Located in [`src/lib/ai/scoring.ts`](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/src/lib/ai/scoring.ts), the qualification algorithm removes human subjectivity by evaluating inquiries across 5 distinct dimensions on a 1–10 scale:

| Dimension ($d_i$) | Weight ($w_i$) | Criteria Evaluated |
| :--- | :--- | :--- |
| **Intent Strength** | **30%** (`0.30`) | Explicit intent to purchase or schedule an inspection vs. casual browsing. |
| **Budget Fit** | **25%** (`0.25`) | Alignment with luxury market thresholds (e.g., $\ge ₹ 3\text{ Cr}$) and liquidity confirmation. |
| **Timeline Urgency** | **20%** (`0.20`) | Readiness to transact: Immediate ($<30$ days), 1–3 months, vs. indefinite. |
| **Information Completeness** | **15%** (`0.15`) | Provision of phone, specific BHK, preferred locality, and financing details. |
| **Engagement Quality** | **10%** (`0.10`) | Depth of inquiry questions, response speed, and specificity. |

### Mathematical Formula

The raw composite score ($S_{\text{raw}}$) is computed as:
$$S_{\text{raw}} = \sum_{i=1}^{5} (d_i \times 10) \times w_i$$

### Staleness Decay Penalty

To prioritize actionable leads, an uncontacted lead incurs a dynamic staleness penalty:
$$\Delta t = \text{hours since last contact}$$
$$\text{Penalty} = \begin{cases} 0 & \text{if } \Delta t \le 24\text{h} \\ 5 & \text{if } 24\text{h} < \Delta t \le 72\text{h} \\ 15 & \text{if } \Delta t > 72\text{h} \quad (\text{Flagged as } \mathbf{At\text{-}Risk}) \end{cases}$$

$$\text{Final Score} = \max(0, \min(99, S_{\text{raw}} - \text{Penalty}))$$

### Tier Classification
- **HOT ($\ge 75$):** Immediate priority. Dedicated partner callback within 2 hours.
- **WARM ($50 - 74$):** Standard advisory pipeline. Digital catalog and follow-up email within 24 hours.
- **COLD ($< 50$):** Automated nurture campaign via concierge portal.

---

## 5. Signature Motion, Physics & Shader Systems

### 5.1 DesignBookmark Pull Cord Ceiling Lamp (`<PullCord />`)
- **Physics Constants:**  
  - `TH` (Pendulum Angle): $k = 46, c = 3$
  - `TUG` (Vertical Tension): $k = 300, c = 13$
  - `R` (Light Expansion): Open $k = 120, c = 21$; Close $k = 170, c = 27$
  - `BP` (Bulb Scale Pulse): $k = 420, c = 13$ (peaks at $1.35\times$ on switch)
- **Verlet Rope Solver:** 12 discrete nodes solved with 4 physics sub-steps per frame and 8 distance constraint iterations. Gravity is modeled at $2600\,\text{px/s}^2$.
- **Switch Activation:** Dragging or tapping past `CLICK = 22px` triggers the switch, snapping the bulb to `#ffd23f` and expanding a circular `clip-path` light wave from the filament center to illuminate the room.

### 5.2 WebGL2 Morning / Night Fog Hero (`<FogHero />`)
- **Fragment Shader Pipeline:** Custom procedural GLSL shader generating multi-octave Perlin-Simplex volumetric fog.
- **3-Layer Parallax Composition:**
  1. *Layer 1 (Bottom):* Static atmospheric sky gradient.
  2. *Layer 2 (Middle):* Residence structure and botanical gardens moving exclusively on the Y axis.
  3. *Layer 3 (Top):* Live WebGL2 fragment fog canvas masking the lower ground plane.
- **Time Shift Transition:** Toggling Morning/Night sinks the estate 25% down into rising mist over 800ms, swaps the sky and light shaders at peak cover, and floats the estate back up into the new ambient lighting over 1000ms.

### 5.3 VengeanceUI Kinetic Generate Button (`<GenerateButton />`)
- **Signature Styling:** Pill silhouette with double inset white bevel shadows, 1px translucent border, and an ambient halo ring (`::before`).
- **Kinetic States:** On hover and active execution, a hue-driven highlight gradient (`--gen-hue: 37` gold or `265` purple) rises from the bottom edge while individual letters wave in brightness.
- **Strict Policy:** Reserved strictly for real generative AI actions (e.g. Call Briefing, AI Search, Report Generation).

### 5.4 Apple VisionOS Liquid Glass (`<LiquidGlass />`)
- **Visual Mechanics:** Multi-layered specular rim borders (`border: 1px solid rgba(255,255,255,0.14)`), `backdrop-filter: blur(20px)`, and subtle ambient inner shadows simulate thick machined crystal glass.

### 5.5 Gooey Spring AI Copilot Launcher (`<AskAiLauncher />`)
- **Kinetic Morph:** Fixed in the bottom-right corner. A compact $100\times40\text{px}$ pill expands with an SVG filter gooey spring into a 320px input cockpit. Suggested prompts rise upward with a 120ms staggered blur-to-sharp animation.

---

## 6. Database Models & Schemas

### 6.1 `Lead` Model (`src/models/Lead.ts`)
```typescript
interface ILead {
  name: string;
  location: string;
  requirement: string;
  budget: string;
  timeline: string;
  message: string;
  analysis: {
    summary: string;
    intent: string;
    intent_reasoning: string;
    key_requirements: string[];
    objections: { concern: string; evidence: string; severity: string; resolved?: boolean }[];
    next_action: string;
    suggested_response: string;
    scores: {
      intent_strength: number;
      budget_fit: number;
      timeline_urgency: number;
      information_completeness: number;
      engagement_quality: number;
    };
    score_rationale: string;
    confidence: string;
    missing_info: string[];
  };
  priority: {
    score: number;
    tier: 'hot' | 'warm' | 'cold';
    atRisk: boolean;
  };
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  debriefHistory: { notes: string; timestamp: Date; what_changed: string[] }[];
  status: 'open' | 'approved' | 'closed' | 'withdrawn';
  closeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.2 `Property` Model (`src/models/Property.ts`)
```typescript
interface IProperty {
  name: string;
  location: string;
  bhk: string;
  price: string;
  description: string;
  images: string[];
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.3 `User` Model (`src/models/User.ts`)
```typescript
interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. Authentication, Security & RBAC Middleware

Enforced at the edge via [`src/middleware.ts`](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/src/middleware.ts) using signed JWT tokens stored in HTTP-only, SameSite cookies:

```
                          ┌───────────────────────────┐
                          │ Incoming HTTP Request     │
                          └─────────────┬─────────────┘
                                        │
                         Is route public? (/, /login, /buyer...)
                                  /            \
                             YES /              \ NO
                                /                \
                     Allow Request        Verify JWT Token
                                          /              \
                                     VALID                INVALID
                                      /                      \
                    Check Role Permissions              Redirect to /login
                      /                 \
            role === 'admin'      role === 'customer'
                   /                       \
        Access /admin, /broker     Access /customer
```

### Route Authorization Matrix

| Route Pattern | Public Access | Customer Role | Admin / Broker Role |
| :--- | :---: | :---: | :---: |
| `/` (Landing Page) | ✅ Yes | ✅ Yes | ✅ Yes |
| `/buyer` & `/homes/[id]` | ✅ Yes | ✅ Yes | ✅ Yes |
| `/login` & `/signup` | ✅ Yes | Redirect $\to$ `/customer` | Redirect $\to$ `/admin` |
| `/customer` (Concierge Portal) | ❌ Redirect | ✅ Granted | Redirect $\to$ `/admin` |
| `/admin/*` (Deal Room & Analytics) | ❌ Redirect | Redirect $\to$ `/customer` | ✅ Granted |
| `/broker/*` (Broker Desk) | ❌ Redirect | Redirect $\to$ `/customer` | ✅ Granted |

---

## 8. Centralized Brand System & Key Migration

Located in [`src/lib/brand.ts`](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/src/lib/brand.ts):

```typescript
export const BRAND_NAME = "Prospera";
export const BRAND_FULL_NAME = `${BRAND_NAME} AI`;
export const BRAND_TAGLINE = "Find your next home in India";
```

### LocalStorage Rebranding Safety
When rebranding, `getStorageKey(suffix)` automatically inspects the browser for legacy storage keys (e.g., `prospera-favorites`), reads their values, and writes them to the new namespaced key (e.g., `lumora-favorites`). This ensures that user bookmarks, theme choices, and deal filters survive rebranding without loss of state.

---

## 9. Environment Variables & Quickstart Deployment

### 9.1 `.env.local` Configuration
```env
# AI Intelligence Inference (Groq & Gemini)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Database Connection
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/prospera-ai?retryWrites=true&w=majority

# Stateless Authentication Secret (256-bit key)
JWT_SECRET=super_secure_jwt_secret_must_be_minimum_32_characters_long

# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 9.2 Development & Build Commands
```bash
# 1. Install dependencies
npm install

# 2. Seed database with luxury estates and leads
npx tsx scripts/seed.ts

# 3. Start development server with Turbopack
npm run dev

# 4. Run TypeScript validation
npx tsc --noEmit

# 5. Run ESLint 9 validation
npm run lint

# 6. Build optimized production release
npm run build
```

---

<div align="center">

*Engineered with precision for autonomous luxury deal orchestration.*

</div>
