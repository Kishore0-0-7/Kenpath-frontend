# Sweety Frontend Application 🌿🩺

[![CI](https://github.com/Kishore0-0-7/sweety-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Kishore0-0-7/sweety-frontend/actions)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_Primitives-000000?logo=radix-ui)](https://ui.shadcn.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.13-22B5BF)](https://recharts.org/)
[![Vitest](https://img.shields.io/badge/Vitest-19_Passed-6E9F18?logo=vitest)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://vercel.com/)

> A patient-first blood glucose tracking interface built with React 18, Vite, TypeScript, and Tailwind CSS. Sweety transforms daily diabetes management into an intuitive, calm clinical journaling experience.

---

## 🎨 Design Philosophy: Calm Clinical Journal

Rather than generic dashboards with repetitive cards or generic SaaS templates, Sweety is intentionally crafted around an **editorial healthcare aesthetic**:

- **Subdued Medical Palette**: Warm parchment base (`#FDFBF7`), clinical sage green (`#286B55` / `#1E503F`), soothing terracotta alert tints (`#D9534F`), and high-contrast clinical dark slate (`#111827`).
- **Targeted Visual Hierarchy**: Clear primary action ("Record Reading"), structured schedule timeline, and persistent clinical targets reference.
- **Custom Medical Iconography**: Hand-crafted SVG clinical icons (calibrated glucometer, insulin pen, meal timing, and physiological vitals) to eliminate AI-slop visual artifacts.
- **Bi-Directional Dark Theme**: Fully integrated light and dark modes adhering to WCAG AA contrast standards.
- **Fluid Multi-Device Layout**: Optimized across mobile phones (390×844), tablets (768×1024), and high-resolution desktop viewports (1440×900).

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework & Build** | React 18.3 + Vite 5.4 | Fast HMR dev server and optimized production ES modules |
| **Type Safety** | TypeScript 5.6 | End-to-end interface and prop contracts |
| **Styling & Design System** | Tailwind CSS 3.4 + Radix UI Primitives | Accessible headless UI components and utility tokens |
| **State & Data Fetching** | TanStack React Query 5.60 | Client-side cache synchronization, optimistic updates, and background refetching |
| **Forms & Validation** | React Hook Form 7.53 + Zod 3.23 | Schema-driven form validation matching backend domain constraints |
| **Data Visualization** | Recharts 2.13 | Responsive glucose trend area charts, target range bands, and daily distribution bar charts |
| **Icons & Media** | Lucide React + Bespoke Medical SVGs | Crisp vector icons and clinical visual indicators |
| **Automated Testing** | Vitest 2.1 + React Testing Library + Happy-DOM | Component interaction, modal dialog, and clinical rule validation tests |

---

## 📱 Application Screens & Capabilities

### 1. Daily Glucose Dashboard (`/`)
- **Daily Time Slot Schedule**: Four dedicated daily monitoring slots:
  - 🌅 *Before Breakfast* (Fasting target: 70–99 mg/dL)
  - 🍳 *After Breakfast* (Post-prandial target: <140 mg/dL)
  - 🥗 *Before Lunch* (Pre-meal target: 70–99 mg/dL)
  - 🍱 *After Lunch* (Post-meal target: <140 mg/dL)
- **Inline Quick-Logging**: Click any unlogged slot to instantly launch the record dialog pre-populated with that slot.
- **Daily Metrics Banner**: Real-time average, minimum, maximum, and daily completion count.
- **Recent Readings Journal**: Interactive summary table with status badges (Normal, High, Low).

### 2. Glucose Reading Journal (`/readings`)
- Complete historical record of all patient blood glucose readings.
- Filtering by date range and time slot.
- Inline actions to **Edit** (modify glucose value, slot, or notes) and **Delete** (with confirmation dialog).
- Pagination and responsive table design.

### 3. Clinical Reports & Trends (`/reports`)
- **Daily Report**: Single-day statistical distribution and slot-by-slot comparison.
- **Month-to-Date (MTD)**: Trend curve covering day 1 through current day with target threshold overlays.
- **Previous Month**: Full prior calendar month historical analysis with minimum, maximum, and mean glucose metrics.

### 4. Account & Clinical Preferences (`/profile`)
- User profile overview (Name, Email, Account ID).
- **Target Reference Standards**: Quick reference card displaying clinical thresholds according to standard ADA guidelines:
  - *Fasting Target*: 70–99 mg/dL
  - *Post-Prandial Target*: < 140 mg/dL
  - *Hypoglycemia Warning*: < 70 mg/dL
  - *Hyperglycemia Warning*: > 180 mg/dL
- Notification and display preference controls.

### 5. Interactive Modals & Dialogs
- **Record Reading Dialog**: Validates integer input between 40 and 600 mg/dL, rejects future dates, and enforces one entry per slot per day.
- **Delete Confirmation Alert**: Prevents accidental data deletion.
- **Theme Switcher**: Instant toggle between Calm Light and Dark themes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- Sweety Backend API running on `http://localhost:3001` (or your cloud backend URL)

### 1. Installation
```bash
git clone https://github.com/Kishore0-0-7/sweety-frontend.git
cd sweety-frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root of the frontend folder:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

Use **Quick Demo Login** on the login page to immediately explore with pre-populated patient data:
- **Email:** `demo@sweety.health`
- **Password:** `Password123!`

---

## 🧪 Automated Testing

Frontend tests cover component mounting, validation boundaries, duplicate slot handling, and date formatting utilities:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
```
Generates an optimized static bundle in `dist/`.

### Vercel Deployment
This repository includes a `vercel.json` preconfigured for Single-Page Application routing:
```bash
# Deploy with Vercel CLI
vercel --prod
```
Or connect your GitHub repository directly to Vercel. Set `VITE_API_BASE_URL` to your production backend URL in the Vercel dashboard.

---

## 📄 License
MIT © 2026 Sweety Health Inc.
