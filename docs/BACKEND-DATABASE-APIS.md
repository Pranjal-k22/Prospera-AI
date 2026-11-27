# Prospera AI — Backend Architecture, Database & API Catalog

> **File:** `c:\WEB DEVELOPMENT\Prospera AI\docs\BACKEND-DATABASE-APIS.md`  
> **Classification:** Backend, Database & API Specification  
> **Brand Constant:** `BRAND_NAME = "Prospera"` (`src/lib/brand.ts`)  
> **Stack:** Next.js 16.3 App Router API Routes, MongoDB Atlas (Mongoose 9.10), Google Generative AI (`@google/generative-ai` with model configured via `GEMINI_MODEL`), Jose (HS256 JWT), Bcryptjs, Vitest.

---

## 1. Backend Architecture & Route Handler Design

All backend services are implemented as **Next.js 16 Route Handlers** located under `src/app/api/`. Route handlers run in a Node.js runtime environment, leveraging cached database connections, stateless JWT authentication verification, and structured AI prompt wrappers.

```
src/app/api/
├── auth/
│   ├── login/route.ts         # POST: Authenticate user & issue signed JWT cookie
│   ├── signup/route.ts        # POST: Register user with bcrypt password hashing
│   └── logout/route.ts        # POST: Clear authentication cookie
├── leads/
│   ├── route.ts               # GET: List leads (admin/broker) | POST: Ingest lead (admin/broker)
│   └── [id]/
│       ├── route.ts           # GET: Retrieve lead details by MongoDB ObjectId (admin/broker)
│       ├── prep/route.ts      # GET: Generate 1-click pre-call AI briefing (admin/broker)
│       ├── debrief/route.ts   # POST: Ingest call notes & extract updated criteria (admin/broker)
│       ├── chat/route.ts      # POST: Contextual deal copilot chat (admin/broker)
│       ├── approve/route.ts   # POST: Mark deal as Won / Approved (admin/broker)
│       ├── close/route.ts     # POST: Close deal with mandatory reason (admin/broker)
│       └── matches/route.ts   # POST: Synthesize tailored property recommendations (admin/broker)
├── customer/
│   ├── applications/route.ts  # GET: Retrieve customer's active deal applications (customer/admin)
│   ├── apply/route.ts         # POST: Submit buy/sell application | DELETE: Withdraw (customer/admin)
│   ├── urgent/route.ts        # POST: Elevate lead priority to HOT 99 (customer/admin)
│   ├── chat/route.ts          # POST: Customer concierge conversational advisor (customer/admin)
│   └── matches/route.ts       # POST: Natural language global property matchmaker (customer/admin)
├── inventory/
│   ├── route.ts               # GET: Fetch luxury estate inventory (Public) | POST: Create listing (admin/broker)
│   ├── [id]/route.ts          # PUT: Update property | DELETE: Remove property (admin/broker)
│   └── seed/route.ts          # GET: Reset and seed verified properties (admin/broker)
└── cron/
    └── sync/route.ts          # POST: Automated AI listing scraper & synthesizer (admin/broker)
```

---

## 2. API Route Protection & Authentication

Protected endpoints enforce role-based access control via `requireAuth(req, allowedRoles)` in `src/lib/auth.ts`:
- **Broker/Admin Only (`admin`, `broker`):** `/api/leads` (GET, POST), `/api/leads/[id]/*` (prep, debrief, chat, approve, close, matches), `/api/inventory` (POST), `/api/inventory/[id]` (PUT, DELETE), `/api/inventory/seed` (GET), `/api/cron/sync` (POST).
- **Customer or Admin (`customer`, `admin`):** `/api/customer/*` (applications, apply, urgent, chat, matches). Object-level ownership checks ensure customers can only view, withdraw, or escalate leads matching their own name (`lead.name === user.name`).
- **Public Routes:** `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, and `GET /api/inventory` (for public property discovery).

---

## 3. Lead Scoring Engine Formula & Weights

In `src/lib/ai/scoring.ts`, lead scoring is computed deterministically:

### Dimension Weights:
* **Intent Strength ($W_{\text{intent}}$):** 30% (`0.30`)
* **Timeline Urgency ($W_{\text{timeline}}$):** 25% (`0.25`)
* **Budget Fit ($W_{\text{budget}}$):** 25% (`0.25`)
* **Engagement Quality ($W_{\text{engagement}}$):** 10% (`0.10`)
* **Information Completeness ($W_{\text{completeness}}$):** 10% (`0.10`)

### Mathematical Formulas:
$$\text{Raw Score} = \left( \text{intent} \times 0.30 + \text{timeline} \times 0.25 + \text{budget} \times 0.25 + \text{engagement} \times 0.10 + \text{completeness} \times 0.10 \right) \times 10$$
$$\text{Decay} = \min(15, \, \max(0, \, \text{daysSinceContact} - 1) \times 3)$$
$$\text{Final Score} = \max(0, \, \min(100, \, \text{round}(\text{Raw Score} - \text{Decay})))$$

### Qualification Tiers:
* **HOT:** Score $\ge 70$ (flagged `atRisk: true` if uncontacted $\ge 3$ days)
* **WARM:** Score $45 - 69$
* **COLD:** Score $< 45$

---

## 4. Property Model Fields

The `Property` schema (`src/models/Property.ts`) includes:
* `name`: string (required)
* `location`: string (required)
* `bhk`: string (required)
* `price`: string (required)
* `description`: string
* `images`: string[]
* `features`: string[]
* `createdAt` / `updatedAt`: Date

*(Note: There is no `specs` sub-document in the schema; property configurations are represented directly via `bhk`, `features`, and `description`).*

---

## 5. Known Limitations

1. **Mock Prototype Portals:** While `/admin` and `/customer` communicate with live MongoDB Atlas collections, the `/broker` and `/buyer` pages are static UI prototypes reading mock arrays from `src/lib/mock.ts`.
2. **Generative Matchmaker:** `/api/customer/matches` and `/api/leads/[id]/matches` do not execute vector database lookups against live MLS feeds. They prompt Google Gemini (`GEMINI_MODEL`) to invent realistic luxury property descriptions paired with static Unsplash photography.
3. **No API Rate Limiting:** API route handlers currently lack rate-limiting middleware.
4. **Test Scope:** Vitest tests currently cover the pure scoring engine math (`src/lib/ai/scoring.test.ts`) and auth helper authorization logic (`src/lib/auth.test.ts`).
