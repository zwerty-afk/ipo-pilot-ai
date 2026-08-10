## IPO Pilot AI

> An AI-assisted workspace for drafting SEBI-compliant DRHPs (Draft Red Herring Prospectuses) for SME IPOs — built so the promoter and the merchant banker work from the same live document, the same readiness score, and the same evidence trail.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933)
![AI](https://img.shields.io/badge/AI-Gemini%20OCR%20%7C%20LLM%20Drafting-success)
![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black)

**Live app:** [ipo-pilot-ai-theta.vercel.app](https://ipo-pilot-ai-theta.vercel.app)

---

## The problem

Taking an SME through an IPO means turning incorporation papers, audited financials, a cap table, and a promoter's answers into a Draft Red Herring Prospectus that satisfies SEBI ICDR and the Companies Act — with every figure, disclosure, and cross-reference checked by hand before a merchant banker will sign off on it. That process is slow, expensive, and repeats the same manual checks on every filing.

IPO Pilot AI compresses the mechanical parts of that work — extraction, drafting, consistency checking, compliance validation — without removing the humans who are legally accountable for the filing. The platform drafts, checks, and flags; the merchant banker reviews and certifies.

---

## How it works

**1. Upload source documents.** The promoter uploads incorporation certificates, MOA/AOA, PAN and GST certificates, audited financials, the cap table, litigation records, factory photographs, and more — organized by SEBI-mandated section.

<p align="center">
  <img src="screenshots/Screenshot (39).png" width="100%">
  <br><sub>Company Details — section-scoped document upload with OCR processing</sub>
</p>

**2. Gemini OCR reads every document.** Each upload is parsed for the structured fields that section needs — CIN, incorporation date, revenue figures, promoter shareholding, litigation references — and offered back as prefill suggestions for the intake questionnaire.

**3. An adaptive intake questionnaire** collects everything OCR couldn't, adjusting its required fields to the company's industry profile (precision manufacturing, software, pharma, F&B, and others each ask different questions).

<p align="center">
  <img src="screenshots/Screenshot (36).png" width="100%">
  <br><sub>Intake Form — Risk Information step, with the AI Copilot surfacing a live data mismatch</sub>
</p>

**4. Cross-document consistency checks (Gap Analysis)** catch exactly the kind of mismatch a reviewer would otherwise have to find by hand — a revenue figure in the intake form that doesn't match the audited financials, a promoter shareholding percentage that disagrees with the cap table.

<p align="center">
  <img src="screenshots/Screenshot (28).png" width="100%">
  <br><sub>Gap Analysis — data consistency, completeness, and risk-disclosure checks with per-item point scoring</sub>
</p>

**5. A statutory compliance checklist** validates the filing against named SEBI ICDR and Companies Act provisions — each rule shows its pass/fail status, the evidence used, and the exact regulation it maps to.

<p align="center">
  <img src="screenshots/Screenshot (27).png" width="100%">
  <br><sub>Statutory Compliance Checklist — rule-by-rule validation against SEBI ICDR 2018 and the Companies Act 2013</sub>
</p>

**6. The DRHP drafts itself, chapter by chapter,** into the real SEBI hierarchy — Risk Factors, Business Overview, Financial Information, Capital Structure, and the rest — with every generated statement grounded in a source document or intake answer, shown as a clickable evidence tag.

<p align="center">
  <img src="screenshots/Screenshot (30).png" width="100%">
  <br><sub>Draft Prospectus — Risk Factors chapter, each risk grounded in an evidence-tagged source</sub>
</p>

**7. The merchant banker reviews and certifies** in a dedicated workspace — raising issues, leaving comments, and either approving, requesting changes, or certifying each chapter. Certification is the only action that counts toward readiness; approval alone does not.

<p align="center">
  <img src="screenshots/Screenshot (41).png" width="100%">
  <br><sub>Reviewer Workspace — open issues, AI findings, and chapter-level certification controls</sub>
</p>

**8. Identity and document authenticity are verified** against GST, PAN, and MCA/CIN records, with every field compared side-by-side against the source document and a full verification history.

<p align="center">
  <img src="screenshots/Screenshot (38).png" width="100%">
  <br><sub>Fraud & Verification — GST/PAN/MCA cross-checks with a field-level details comparison</sub>
</p>

**9. One IPO Readiness Score** rolls all of the above into a single 0–100 number, broken into the four real stages of the journey.

<p align="center">
  <img src="screenshots/Screenshot (29).png" width="100%">
  <br><sub>IPO Readiness — the four-stage cumulative scoring model, with exactly what remains to earn each point</sub>
</p>

**10. The finished draft exports to DOCX or PDF**, rendered to look like the real filing document — cover page, statutory disclosures, tables, and all — not just a text dump of the on-screen draft.

<p align="center">
  <img src="screenshots/Screenshot (42).png" width="100%">
  <br><sub>DRHP Export — the generated Draft Red Herring Prospectus cover page, ready as DOCX or PDF</sub>
</p>

Everything above is tied together by a command-center dashboard that surfaces the day's priorities, critical compliance issues, and draft progress in one view —

<p align="center">
  <img src="screenshots/Screenshot (25).png" width="100%">
</p>

— a live SEBI regulatory feed so filings stay current with the latest circulars —

<p align="center">
  <img src="screenshots/Screenshot (34).png" width="100%">
  <br><sub>SEBI Regulatory Updates — fetched from the official SEBI circulars portal</sub>
</p>

— and an invitation flow that brings a SEBI-registered merchant banker onto a company's workspace to begin the review.

<p align="center">
  <img src="screenshots/Screenshot (35).png" width="100%">
  <br><sub>Merchant Banker Invitations — search SEBI-registered bankers by name, registration number, or location</sub>
</p>

---

## Features

- Secure, role-based login — separate issuer (promoter) and reviewer (merchant banker) workspaces
- Section-scoped document upload with Gemini OCR extraction, duplicate detection, and retry-on-failure
- Adaptive intake questionnaire — required fields change with the company's industry profile, with a live per-section completeness heatmap
- AI-drafted DRHP content across the full SEBI chapter structure, every statement grounded to a clickable source
- Gap Analysis — automated cross-document consistency checks across intake data, financials, and the cap table
- Statutory Compliance Checklist — rule-by-rule SEBI ICDR / Companies Act validation with evidence and pass/fail status
- IPO Readiness Score — one additive 0–100 score across intake, compliance, gap resolution, and reviewer certification
- Reviewer Workspace — inline comments, issue tracking, chapter approval/rejection, and final certification
- Fraud & Verification — GST, PAN, and MCA/CIN cross-checks with field-level comparison and audit history
- An in-app AI Copilot grounded only in the active company's live workspace data, with citations back to the source page
- Merchant banker invitation flow, searchable against SEBI-registered intermediaries
- Live SEBI regulatory circular feed, auto-refreshed on a schedule
- Full audit log of uploads, deletions, certifications, and status changes
- DOCX/PDF export rendered to match a real filing document — tables, charts, and org structure included

---

## Tech stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router

**Backend**
- Node.js + Express, deployed as a Vercel serverless function
- AWS DynamoDB — primary data store
- AWS S3 — document and export file storage
- Google Gemini — OCR extraction, AI drafting, and the workspace-grounded Copilot
- `docx` + `pdfkit` + `sharp` — DRHP export rendering

**Infrastructure**
- Vercel — hosting, serverless functions, and a scheduled cron job for SEBI circular refresh
- HMAC-signed session tokens — no third-party auth provider

---

## Project structure

```
IPO_Pilot_AI/
├── api/
│   └── index.js              # Vercel serverless entry point (re-exports server/server.js)
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # Dashboard, Intake, Compliance, Gap Analysis, Readiness,
│   │   │                     # Draft Preview, Reviewer Workspace, Fraud & Verification,
│   │   │                     # Export, SEBI Updates, Invitations
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
│   ├── copilotRetrieval.js    # Grounded retrieval layer for the in-app AI Copilot
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
| Compliance & SEBI Checks | 20 | SEBI ICDR / Companies Act rules passed |
| Gap Analysis & Remediation | 20 | AI-flagged inconsistencies resolved |
| Reviewer Certification | 20 | DRHP chapters certified by the reviewer — approval alone does not count |

The same calculation (`client/src/utils/readinessEngine.js`) backs every score shown in the app — the sidebar meter, the Dashboard summary, and the dedicated Readiness page all read from one shared context, so the number is always consistent.

---

## Responsible AI

IPO Pilot AI is built around a human-in-the-loop model:

- AI drafts content and flags issues — it never files anything
- Every generated fact is traceable back to its source document or intake answer
- The in-app Copilot answers only from the active company's live workspace data — never from general knowledge — and cites the page it pulled from
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

## License

See [LICENSE](LICENSE).
