# IPO Pilot AI

> AI-assisted DRHP (Draft Red Herring Prospectus) drafting workspace for SME IPOs — built for the merchant banker and promoter to collaborate in one place, from raw documents to a filing-ready draft.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933)
![AI](https://img.shields.io/badge/AI-Gemini%20OCR%20%7C%20LLM%20Drafting-success)
![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black)

**Live app:** [ipo-pilot-ai-theta.vercel.app](https://ipo-pilot-ai-theta.vercel.app)

---

## Problem

Preparing an SME IPO offer document is slow, manual, and expensive. Promoters lean on merchant bankers, legal counsel, and compliance professionals to turn scattered incorporation papers, financials, and cap tables into a SEBI-compliant DRHP — with every cross-reference, disclosure, and figure checked by hand.

IPO Pilot AI shortens that cycle without removing the humans who are legally responsible for the filing: the platform drafts, checks, and flags; the merchant banker reviews and certifies.

---

## What it does

1. **Promoter uploads source documents** — incorporation certificates, MOA/AOA, audited financials, cap table, litigation records, factory images, and more.
2. **Gemini-powered OCR extracts structured data** from each document (financial figures, shareholding percentages, litigation references, entity details) and suggests prefills for the intake questionnaire.
3. **An adaptive intake questionnaire** collects everything the OCR couldn't — adjusting its required fields to the company's industry profile (manufacturing, software, pharma, F&B, etc.).
4. **Cross-document consistency checks** catch the exact mismatches a reviewer would otherwise find manually — e.g. "promoter intake states 12.5 Cr revenue, but the audited financials document says 11.8 Cr."
5. **A compliance checklist** validates the intake against SEBI ICDR / Companies Act requirements.
6. **The DRHP is generated chapter-by-chapter** into the real SEBI hierarchy (General Information, Business Overview, Financials, Capital Structure, Risk Factors, Litigation, and more), with every generated fact traceable back to its source document or intake field.
7. **The reviewer (merchant banker) certifies each chapter** — comments, requests changes, approves, and signs off — before anything is considered final.
8. **A single IPO Readiness Score (0–100)** rolls all of the above into one number: intake completeness, compliance checks passed, gaps resolved, and chapters certified — so both sides always know exactly what's left.
9. **The finished draft exports to DOCX/PDF**, rendered with real tables, charts, and org diagrams matching the on-screen draft.

---

## Features

- Secure login with role-based access (issuer / promoter vs. reviewer / merchant banker)
- Document upload with OCR extraction and duplicate detection
- Adaptive intake questionnaire with industry-specific fields and a live completeness heatmap
- AI-drafted DRHP content across the full SEBI chapter structure, with in-app source citations
- Cross-document consistency checks (Gap Analysis) — flags mismatches between intake answers and uploaded documents
- SEBI/Companies Act compliance checklist with automatic pass/fail evaluation
- IPO Readiness Score — a single, additive 100-point score across intake, compliance, gap resolution, and reviewer certification
- Reviewer Workspace — inline comments, chapter approval/rejection, and certification sign-off
- Fraud & Verification tools for reviewers
- Invitation flow to bring a merchant banker or promoter onto a company's workspace
- Live SEBI circular feed, auto-refreshed on a schedule
- Audit log of every meaningful action (uploads, deletions, certifications, status changes)
- DOCX/PDF export that mirrors the in-app draft, including tables and vector-rendered charts

---

## Tech stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router

**Backend**
- Node.js + Express (deployed as a single Vercel serverless function)
- AWS DynamoDB — primary data store (users, companies, intake, documents, drafts, audit logs)
- AWS S3 — document and export file storage
- Google Gemini — OCR extraction and AI drafting
- `docx` + `pdfkit` + `sharp` — DRHP export rendering

**Infrastructure**
- Vercel — hosting, serverless functions, and a daily cron job for SEBI circular refresh
- HMAC-signed session tokens (no third-party auth provider)

---

## Project structure

```
IPO_Pilot_AI/
├── api/
│   └── index.js              # Vercel serverless entry point (re-exports server/server.js)
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # Dashboard, Intake, Compliance, Gap Analysis, Readiness,
│   │   │                     # Draft Preview, Reviewer Workspace, Export, SEBI Updates,
│   │   │                     # Invitations, Fraud & Verification
│   │   ├── components/
│   │   ├── context/           # Auth + shared draft/readiness state
│   │   ├── services/api.js    # Single axios client for all backend calls
│   │   ├── utils/              # IPO readiness engine, compliance rules, gap analysis checks
│   │   └── data/               # SEBI DRHP schema, intake schema, industry profiles
│   └── package.json
├── server/
│   ├── server.js              # Express app — all API routes
│   ├── db.js                  # Data access layer (delegates to dynamoStore in production)
│   ├── dynamoStore.js         # DynamoDB-backed persistence with write coalescing
│   ├── drhpExportEngine.js    # DOCX/PDF export rendering
│   ├── verificationEngine.js  # Fraud & document verification checks
│   ├── copilotRetrieval.js    # RAG-style retrieval for the in-app copilot
│   └── package.json
├── vercel.json                 # Build, rewrites, and cron configuration
├── DEPLOYMENT.md               # Full Vercel deployment guide
└── package.json                 # Root deps — installed by Vercel's build
```

---

## Getting started (local development)

### Prerequisites

- Node.js 20+
- An AWS account with a DynamoDB table and S3 bucket (or run without them — see below)
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free tier works)

### Clone and install

```bash
git clone https://github.com/zwerty-afk/IPO_Pilot_AI.git
cd IPO_Pilot_AI
npm run install:all
```

### Configure environment

Create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_key
PORT=3001
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
CLOUD_STORAGE_BUCKET=your_s3_bucket
AUTH_SECRET=any_random_64_char_hex_string
```

Without AWS credentials, the server falls back to a local `server/db.json` file — fine for quick local testing, not for anything you want to persist reliably.

### Run

```bash
npm run dev
```

This starts the Express API on `http://localhost:3001` and the Vite dev server (with `/api` proxied to it) on `http://localhost:5173`.

---

## Deployment

The app deploys to Vercel as a single project: the Vite build serves as static assets, and the Express backend runs as one serverless function at `api/index.js`. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full walkthrough, including environment variables, the `/api/health` diagnostic endpoint, and troubleshooting.

---

## IPO Readiness Score

The score is a single, additive 0–100 metric — nothing in it ever subtracts points; identifying a gap or risk just means those points aren't earned yet.

| Stage | Points | What earns them |
|---|---|---|
| Intake & Company Information | 40 | Required fields filled across 11 sections, weighted by disclosure depth |
| Compliance Checks | 20 | SEBI ICDR / Companies Act rules passed |
| Gap Analysis & Remediation | 20 | AI-flagged inconsistencies resolved |
| Reviewer Certification | 20 | DRHP chapters certified by the reviewer |

The same calculation (`client/src/utils/readinessEngine.js`) backs every score shown in the app — the sidebar meter, the Dashboard summary, and the dedicated Readiness page all read from one shared context, so the number is always consistent.

---

## Responsible AI

IPO Pilot AI is built around a human-in-the-loop model:

- AI drafts content and flags issues — it never files anything
- Every generated fact is traceable back to its source document or intake answer
- A qualified reviewer must certify each chapter before it counts toward readiness
- No disclosure is ever auto-submitted to SEBI or any regulator

---

## Roadmap

- Financial anomaly detection beyond rule-based consistency checks
- Multi-language support
- Main Board IPO support (currently SME-focused)
- Expanded compliance rule coverage
- Draft version comparison

---

## Screenshots

<p align="center">
  <img src="screenshots/Screenshot%202026-07-06%20221647.png" width="100%">
</p>

<p align="center">
  <img src="screenshots/Screenshot%202026-07-06%20215826.png" width="100%">
</p>

<p align="center">
  <img src="screenshots/Screenshot%202026-07-06%20215855.png" width="100%">
</p>

<p align="center">
  <img src="screenshots/Screenshot%202026-07-06%20215914.png" width="100%">
</p>

<p align="center">
  <img src="screenshots/Screenshot%202026-07-06%20215939.png" width="100%">
</p>

<p align="center">
  <img src="screenshots/Screenshot%202026-07-06%20215946.png" width="100%">
</p>

---

## License

See [LICENSE](LICENSE).
