# Prospera AI — Master Documentation & Engineering Index

> **Location:** `C:\WEB DEVELOPMENT\Prospera AI\docs\INDEX.md`  
> **Brand Constant:** `BRAND_NAME = "Prospera"` (`src/lib/brand.ts`)  
> **Project Title:** Prospera AI (Autonomous Luxury Real Estate Deal Room & Client Intelligence Engine)

Welcome to the central technical documentation suite for **Prospera AI**. This index provides direct links to architectural blueprints, frontend engineering specifications, backend API catalogs, database schemas, and visual QA verification artifacts.

---

## 1. Core Technical Documentation Suite

| Document | Primary Focus | Key Topics Covered |
| :--- | :--- | :--- |
| 📘 [**ARCHITECTURE.md**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/ARCHITECTURE.md) | **System Architecture & Integration** | • Multi-tier Architecture (Client, Edge, App, AI, DB)<br/>• Mermaid Sequence Diagrams for Auth, Scoring, Pre-Call Prep<br/>• Frontend-to-Backend-to-Database Connection Matrix<br/>• Singleton Connection Pooling & Fault-Tolerant Fallback<br/>• Edge Security & Role-Based Access Control (RBAC) |
| 🎨 [**FRONTEND.md**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/FRONTEND.md) | **Frontend Architecture & Design System** | • Next.js 16 App Router Hierarchy (All 16 Routes)<br/>• Component Systems (`landing/`, `listing/`, `ai/`, `ui/`, shell)<br/>• DesignBookmark Pull Cord Ceiling Lamp (Verlet physics, springs)<br/>• WebGL2 Morning / Night Fog Hero (GLSL shaders, 3-layer parallax)<br/>• VengeanceUI Kinetic `<GenerateButton />` & Apple VisionOS `<LiquidGlass />`<br/>• Responsive Breakpoint Matrix (Desktop, Tablet, Mobile) |
| ⚙️ [**BACKEND-DATABASE-APIS.md**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/BACKEND-DATABASE-APIS.md) | **Backend, Database & API Catalog** | • Complete 22+ API Route Handlers (`/api/auth/*`, `/api/leads/*`, etc.)<br/>• Full Request/Response Schemas with JSON Examples<br/>• Deterministic 5D AI Lead Scoring Engine & Mathematical Formulas<br/>• Dynamic Staleness Decay Penalties & Tier Classification<br/>• Mongoose Data Models (`Lead`, `Property`, `User`) & Indexes<br/>• Multi-Model AI Orchestration (Groq Llama 3.3 70B & Gemini 1.5) |
| 📑 [**description-compy.md**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/description-compy.md) | **Single-Source Project Overview** | • Complete File-by-File Directory Manifest<br/>• High-Level Product Vision & Operational Workflows<br/>• Centralized Brand System & Key Migration Safety |

---

## 2. Visual QA & Verification Screenshot Repositories

All interactive motion components, page layouts, and shaders have been captured live via headless Chrome DevTools Protocol (CDP) and are available in the following directories:

* 💡 [**docs/pull-cord/**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/pull-cord): High-resolution captures of the interactive ceiling lamp on `/login` in both **Obsidian Dark** and **Warm Dusk** modes across desktop (1440 × 900) and mobile (390 × 844) viewports.
* 🌫️ [**docs/listing-fog/**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/listing-fog): Visual evidence of the WebGL2 shader transition: Morning light, Night mode, and the mid-transition volumetric fog surge.
* 💬 [**docs/ai-chat/**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/ai-chat): Captures illustrating the collapsed Ask AI pill, expanded search input, staggered suggested prompt chips, and streaming copilot responses.
* ✨ [**docs/generate-button/**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/generate-button): Visual audit and responsive captures of the kinetic `<GenerateButton />`.
* 🏙️ [**docs/landing-screenshots/**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/landing-screenshots): Responsive captures of the full-bleed marketing landing page across all breakpoints.
* 📊 [**docs/screenshots/**](file:///c:/WEB%20DEVELOPMENT/Prospera%20AI/docs/screenshots): Multi-breakpoint captures of the Broker Desk, Buyer Portal, and Admin Analytics.

---

## 3. Quick Reference: System Tech Stack

| Domain | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Turbopack) | `16.3.6` | React server components, route handlers, bundling |
| **UI Library** | React | `19.2.8` | Client & server component architecture |
| **Language** | TypeScript | `5.x` | Strict end-to-end type safety (`strict: true`) |
| **Styling** | Tailwind CSS & PostCSS | `4.x` | Atomic CSS utility engine with custom token variables |
| **Animation** | Framer Motion | `14.9.x` | Kinetic spring transitions & gooey morphs |
| **Database** | MongoDB Atlas & Mongoose | `9.10.x` | Document persistence, schema validation, connection pooling |
| **Primary AI** | Groq Cloud SDK | `1.6.x` | Llama 3.3 70B Versatile ultra-low-latency inference ($<600\text{ms}$) |
| **Fallback AI**| Google Generative AI | `0.24.x` | Gemini 1.5 Flash fallback provider |
| **Security** | Jose & Bcryptjs | `6.2.x / 3.0.x` | Stateless HS256 JWT signing and password encryption |
| **Charts** | Recharts | `3.10.x` | Broker deal desk pipeline analytics & trends |

---

## 4. Development & Quickstart Runbook

```bash
# 1. Install all dependencies
npm install

# 2. Seed verified luxury properties & realistic leads into MongoDB
npx tsx scripts/seed.ts

# 3. Start local development server with Turbopack
npm run dev

# 4. Run full TypeScript validation
npx tsc --noEmit

# 5. Run ESLint 9 code quality checks
npm run lint

# 6. Execute production release compilation
npm run build
```
