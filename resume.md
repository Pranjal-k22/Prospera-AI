# Resume Project Entry: Prospera AI

Target Role: Kapture CX — Entry-Level Client-Facing AI Solution Delivery (Implementation, Technical Architecture, Documentation, and SaaS Workflows)

---

### **Prospera AI | Real Estate Deal Desk** | [GitHub Repository](https://github.com/Pranjal-k22/Prospera-AI) | November 2026
**Context:** Independent Project | **Role:** Full-Stack & AI Solutions Developer  
**Technologies / Skills Used:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, MongoDB Atlas (Mongoose 9), Google Generative AI (Gemini 1.5 Flash), Jose (JWT Auth), System Architecture & API Documentation.

- **Architected a dual-portal SaaS platform** featuring a client concierge and broker deal desk using Next.js 16 App Router, establishing role-based access control and stateless HS256 JWT cookie authentication across 15 page routes.
- **Engineered a hybrid lead qualification engine** integrating Google Gemini 1.5 Flash for natural language dimension extraction with a deterministic 5-factor mathematical scoring model and temporal staleness decay to classify buyer intent into actionable priority tiers (`HOT`, `WARM`, `COLD`).
- **Integrated Google Generative AI with structured JSON mode** across Next.js API route handlers, automating pre-call sales briefings, structured post-call debrief note parsing, and conversational buyer consultations.
- **Authored comprehensive technical architecture documentation** detailing 20 API route files (23 HTTP method handlers), typed Mongoose schemas, global serverless database connection pooling, and edge middleware routing matrices.

---

## Not Used on the Resume (and Why)

1. **Groq Llama 3.3 70B:** Omitted because while `groq-sdk` is declared in `package.json`, it is never imported or called in application source code (`src/lib/ai/` exclusively uses `@google/generative-ai`).
2. **BRD / PRD Claims:** Omitted because the repository contains technical system architecture (`docs/ARCHITECTURE.md`) and API documentation (`docs/BACKEND-DATABASE-APIS.md`), not formal business requirement documents or product requirement documents.
3. **"600ms latency" or "% accuracy" metrics:** Omitted because no performance benchmarks or accuracy validation tests were executed or recorded in the codebase.
4. **"Production-ready" / "Enterprise-grade":** Omitted because Next.js Edge Middleware explicitly bypasses `/api/*` route authentication, and the `/broker` and `/buyer` pages run on static mock arrays rather than live database queries.
5. **Automated Test Coverage:** Omitted because the repository contains zero automated test suites (`npm test` reports `Missing script: "test"`).
6. **"Real-time streaming":** Omitted because AI chat and briefings use standard `fetch` request-response cycles rather than WebSockets or server-sent event (SSE) streaming.

---

## Verify Manually Before Sending

- [ ] **GitHub Repository Visibility:** Confirm that `https://github.com/Pranjal-k22/Prospera-AI` is set to **Public** so recruiters can view the repository.
- [ ] **Target Role Alignment:** Confirm whether you wish to frame your role as "Full-Stack AI Developer" or "AI Solutions Engineer / Technical Product Engineer" depending on the specific job application.
- [ ] **Solo Authorship:** Git commit history indicates 33 commits authored exclusively by `Pranjal-k22 <pranjalkaran2004@gmail.com>`. Be prepared to speak to full individual ownership of the code and documentation.
- [ ] **Live Deployment URL:** If the application is hosted live (e.g., on Vercel), add the deployed URL alongside the GitHub link; if local-only, leave the GitHub repository as the primary link.
