# Prospera AI — Comprehensive Project Explanation

This document provides a truthful, plain-English breakdown of the Prospera AI project for technical recruiters, hiring managers, and interviewers. Every statement is verified against the codebase as of November 2026.

---

## 1. Problem Solved (in 3 Sentences)
High-end real estate brokerages struggle with manual lead triage, where high-intent luxury buyers are frequently lost or delayed due to unstructured inquiries and stale follow-ups. Traditional CRMs capture static contact details without systematically assessing buyer purchasing power, timeline urgency, or inquiry intent. Prospera AI solves this by deploying an AI-assisted portal that extracts structured qualification dimensions from raw buyer messages using an LLM, feeding them into a deterministic mathematical scoring model to prioritize high-value leads for brokers.

---

## 2. Who Uses It and User Flows

Prospera AI is designed with two distinct operational user groups:

### A. Client Portal (`/customer`, `/buyer`)
- **Target Audience:** Prospective high-net-worth real estate buyers and luxury property investors.
- **Main User Flow:**
  1. A buyer arrives on public landing pages (`/`, `/about`, `/properties`) and logs in or registers at `/login`.
  2. The buyer accesses the AI concierge (`/customer`), which connects to Google Gemini via `/api/chat` to discuss preferences (budget, location, amenities).
  3. The buyer interacts with the luxury property matchmaker (`/api/matchmaker`), receiving simulated personalized property recommendations.
  4. Inquiries and viewing requests submitted by the buyer create a persistent lead record in MongoDB via `/api/leads`.
  *(Note: The `/buyer` route currently serves as a static UI prototype displaying mock listings from `src/lib/mock.ts`).*

### B. Broker Deal Desk (`/broker`, `/admin`)
- **Target Audience:** Real estate brokers, sales agents, and brokerage administrators managing deal pipelines.
- **Main User Flow:**
  1. An agent logs in via `/login` and is routed to the administration dashboard (`/admin`).
  2. The agent reviews inbound leads sorted by priority and qualification score (`HOT`, `WARM`, `COLD`), populated directly from MongoDB via `GET /api/leads`.
  3. Before contacting a buyer, the agent triggers an automated pre-call sales briefing via `POST /api/briefing`, which compiles buyer intent, price boundaries, and risk flags.
  4. Following a sales call, the agent inputs raw unstructured notes into `POST /api/debrief` to extract objections, budget changes, and follow-up tasks into structured JSON.
  5. The agent updates the deal stage (`NEW` &rarr; `CONTACTED` &rarr; `QUALIFIED` &rarr; `OFFER` &rarr; `CLOSED`) and manages property inventory via `/api/inventory`.
  *(Note: The `/broker` route is a client-side prototype rendering pipeline stats from `src/lib/mock.ts`).*

---

## 3. How the AI Works Step-by-Step (and Where It Is NOT Trusted)

### AI Execution Pipeline
1. **Ingestion:** Raw inquiry text is received via `/api/leads` or conversational inputs in `/api/chat`.
2. **Dimension Extraction:** In `src/lib/ai/scoring.ts`, the application prompts Google Generative AI (`gemini-1.5-flash`) using structured JSON output instructions. The model evaluates the inquiry across 5 semantic criteria, returning integer ratings from 0 to 10:
   - `intent_strength` (0–10)
   - `timeline_urgency` (0–10)
   - `budget_fit` (0–10)
   - `engagement_quality` (0–10)
   - `information_completeness` (0–10)
3. **Deterministic Math Calculation:** The application code (not the LLM) takes these ratings, multiplies them by strict mathematical weights, computes staleness decay based on calendar days, and calculates a final 0–100 integer score.
4. **Deal Intelligence:** `gemini-1.5-flash` is leveraged in `/api/briefing` and `/api/debrief` with structured system prompts to synthesize conversational notes into bulleted summaries, action items, and risk tags.

### Where the AI is Deliberately NOT Trusted
- **Final Lead Score & Tiering:** The LLM is **never** permitted to calculate the final 0–100 score or assign the `HOT`/`WARM`/`COLD` tier directly. If an LLM directly generates a score, it introduces hallucinated variance and subjective drift across identical inputs. The LLM only grades isolated semantic attributes (0–10); the final score is mathematically computed in TypeScript.
- **Staleness Decay:** Time-based score degradation is calculated strictly in deterministic code using timestamps (`createdAt`), preventing the LLM from arbitrarily guessing lead age or decay penalties.
- **Deal Progression & Financial Commitments:** The AI cannot advance deal pipeline stages, confirm financial pre-approvals, or execute contractual transactions. All state transitions require authenticated human broker actions.
- **Inventory Verification:** The matchmaker (`/api/matchmaker`) is a generative discovery simulator; it does not query or mutate verified land registries or legally binding MLS deeds.

---

## 4. Lead Scoring Mechanics with Worked Example

### Verified Formula and Weights (`src/lib/ai/scoring.ts`)
The scoring algorithm uses the following fixed weight vector:
- **Intent Strength ($W_{\text{intent}}$):** 30% (`0.30`)
- **Timeline Urgency ($W_{\text{timeline}}$):** 25% (`0.25`)
- **Budget Fit ($W_{\text{budget}}$):** 25% (`0.25`)
- **Engagement Quality ($W_{\text{engagement}}$):** 10% (`0.10`)
- **Information Completeness ($W_{\text{completeness}}$):** 10% (`0.10`)

$$\text{Raw Score} = \left( \sum (\text{rating}_i \times W_i) \right) \times 10$$
$$\text{Decay} = \min(15, \, \max(0, \, \text{daysSinceContact} - 1) \times 3)$$
$$\text{Final Score} = \max(0, \, \min(100, \, \text{round}(\text{Raw Score} - \text{Decay})))$$

**Qualification Tiers:**
- **HOT:** Score $\ge 70$
- **WARM:** Score $45 - 69$
- **COLD:** Score $< 45$

### Worked Calculation Example
Consider a high-intent luxury inquiry received 3 days ago ($\text{daysSinceContact} = 3$):
- `intent_strength` = 8 / 10
- `timeline_urgency` = 9 / 10
- `budget_fit` = 7 / 10
- `engagement_quality` = 6 / 10
- `information_completeness` = 8 / 10

**Step-by-step Math:**
1. **Weighted Sum:**
   $$(8 \times 0.30) + (9 \times 0.25) + (7 \times 0.25) + (6 \times 0.10) + (8 \times 0.10)$$
   $$= 2.40 + 2.25 + 1.75 + 0.60 + 0.80 = 7.80$$
2. **Raw Score:**
   $$7.80 \times 10 = 78.0$$
3. **Staleness Penalty:**
   $$\text{Decay} = \min(15, \, \max(0, \, 3 - 1) \times 3) = \min(15, \, 2 \times 3) = 6 \text{ points}$$
4. **Final Computed Score:**
   $$\text{Final Score} = \text{round}(78.0 - 6) = \mathbf{72}$$
5. **Tier & Action:**
   $$\text{Tier} = \mathbf{HOT} \quad (\ge 70)$$
   $$\text{Recommended Action} = \text{"Schedule private viewing immediately; buyer has near-term purchase horizon."}$$

---

## 5. System Architecture (8–10 Lines)

1. **Client Tier:** Next.js 16 App Router (React 19) rendering server and client components styled with Tailwind CSS 4 and Framer Motion.
2. **Route Middleware:** Edge middleware (`src/middleware.ts`) inspecting HTTP-only JWT cookies to protect `/admin`, `/broker`, and `/customer` dashboards.
3. **API Handler Layer:** 20 Next.js Route Handlers (`src/app/api/**/route.ts`) serving 23 HTTP method endpoints across leads, inventory, briefings, and chat.
4. **Authentication Service:** Stateless HS256 JWT generation and cookie verification powered by `jose` and `bcryptjs` password hashing.
5. **Intelligence Layer:** Google Generative AI (`gemini-1.5-flash`) integration handling NLP extraction, pre-call briefing synthesis, and debrief notes parsing.
6. **Qualification Core:** Deterministic TypeScript scoring module blending 5-factor LLM dimensional ratings with temporal staleness decay.
7. **Database Persistence:** Mongoose 9 ODM connected to MongoDB Atlas, implementing a global cached connection singleton (`src/lib/mongoose.ts`).
8. **Data Schemas:** Typed Mongoose models enforcing schema-level validation across `User`, `Lead`, and `Property` collections.
9. **Prototype Data Layer:** Decoupled in-memory mock datasets (`src/lib/mock.ts`) supporting isolated `/broker` and `/buyer` UX flows.

---

## 6. Honest Limitations of the Project Today

1. **Mock Data in Broker & Buyer Dashboards:** While the `/admin` portal reads and writes to MongoDB Atlas via `/api/leads`, the `/broker` and `/buyer` views use static mock arrays from `src/lib/mock.ts`. They demonstrate user experience workflows rather than live database operations.
2. **Simulated Property Matchmaker:** `/api/matchmaker` does not search MongoDB collections using Atlas vector search or database filters; it prompts Gemini to invent realistic luxury property descriptions paired with static Unsplash photography.
3. **Unauthenticated API Routes:** Next.js Edge Middleware explicitly skips all `/api/*` routes (`path.startsWith('/api/')`). Consequently, endpoints such as `/api/leads` and `/api/inventory` currently lack session token verification.
4. **Zero Automated Tests:** The repository contains no automated test runner (running `npm test` fails with `Missing script: "test"`). While TypeScript and ESLint pass without warnings, unit and integration test coverage is 0%.
5. **Single Model Dependency:** `groq-sdk` is listed in `package.json` but is never imported or invoked in `src/`. All AI features depend 100% on `@google/generative-ai` (`gemini-1.5-flash`), without automated provider fallback.
6. **Hardcoded Fallback JWT Secret:** `src/lib/auth.ts` contains a fallback secret string (`"prospera-secret-key-2025"`) used if the `JWT_SECRET` environment variable is not defined.

---

## 7. Eight Likely Interview Questions & Truthful Answers

### Q1: Why did you separate qualitative LLM scoring from the final lead score calculation?
**Answer:** We separated them because LLMs struggle with mathematical consistency and produce subjective drift when directly prompted for arbitrary 0–100 scores. Instead, we constrain the LLM to evaluate 5 bounded qualitative dimensions (0–10) based on natural language semantics. Our deterministic TypeScript algorithm then applies weighted sums and temporal decay, ensuring reproducible, explainable, and fully auditable lead tiering.

### Q2: How is authentication and role-based access control implemented?
**Answer:** Authentication uses stateless HS256 JWT tokens created with the `jose` library, stored in secure HTTP-only cookies with a 24-hour expiration window. Next.js Edge Middleware intercepts page requests, decoding the token to protect `/admin`, `/broker`, and `/customer` routes according to user roles. While page routes are secured, our API route handlers currently bypass middleware checks, which is an identified technical limitation scheduled for server-side token validation.

### Q3: Your package.json includes groq-sdk, but where is it used?
**Answer:** `groq-sdk` is currently unused in `src/` and exists as residual dependency debt. The system was originally envisioned to support dual-provider fallbacks with Groq Llama 3.3 for low-latency triage and Gemini for complex summarization, but only the `@google/generative-ai` (`gemini-1.5-flash`) integration was implemented. All live AI tasks—scoring extraction, chat, and briefings—rely exclusively on Google Gemini.

### Q4: How does the property matching feature work under the hood?
**Answer:** Currently, `/api/matchmaker` functions as a generative discovery simulator rather than a database query engine. It submits buyer preferences to Gemini, which generates three realistic luxury property listings with formatted pricing and curated Unsplash imagery. In an enterprise release, this would be re-architected to run vector similarity searches over verified property listings in MongoDB Atlas.

### Q5: Why do some dashboard routes use mock data while others query MongoDB?
**Answer:** The `/broker` and `/buyer` pages were built as rapid front-end prototypes using `src/lib/mock.ts` to validate responsive design and user interaction models. The `/admin` portal and `/api/leads` were wired directly to MongoDB Atlas via Mongoose 9 to implement core lead ingestion and pipeline persistence. Unifying all portals to consume authenticated REST APIs is our direct architectural next step.

### Q6: How do you handle MongoDB connection pooling in Next.js serverless functions?
**Answer:** Serverless route handlers frequently establish redundant database connections during cold starts and auto-scaling, risking connection exhaustion. In `src/lib/mongoose.ts`, we implemented a global cached connection singleton (`global.mongoose`). The handler checks for an active connection or an in-flight connection promise before opening a new one, ensuring efficient socket reuse across requests.

### Q7: What automated testing exists in this repository?
**Answer:** The repository currently does not have automated unit, integration, or end-to-end test suites, and running `npm test` reports a missing script. However, we enforce strict static verification: TypeScript compiles cleanly with zero type errors (`npx tsc --noEmit`), ESLint 9 reports zero lint warnings (`npm run lint`), and `npm run build` succeeds across all 27 Next.js routes. Adding Vitest unit tests for the scoring formula is our top testing priority.

### Q8: How did you implement the interactive ceiling lamp on the login page?
**Answer:** The ceiling lamp on `/login` is an interactive React 19 component (`PullCord.tsx`) built using SVG elements and pointer event physics. When a user drags the cord bead past a 22px stretch threshold, it triggers a theme toggle with a 400ms debounce lockout to prevent rapid flickering. The transition expands or contracts a circular `clip-path` across the viewport, synchronizing the theme state to `localStorage` and `data-theme`.
