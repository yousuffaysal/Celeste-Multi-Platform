<div align="center">

<br/>

```
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║        ✦  C E L E S T E  ✦           ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
```

### AI-Native Multivendor Marketplace

**Describe what you need. We'll find it across thousands of verified shops.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon_DB-00E699?style=flat-square&logoColor=black)

<br/>

</div>

---

## What is Celeste?

Celeste is a next-generation multivendor marketplace built around a single idea: **shopping should start with a sentence, not a search bar.** Instead of keyword filtering, buyers describe what they need in plain language — and Celeste's AI assembles the perfect set of products from across verified vendors, in one cart, with one checkout.

```
User  →  "a calm home office setup, warm tones, under $400"
AI    →  Arc Floor Lamp · Walnut Monitor Stand · Linen Desk Organizer
Cart  →  3 shops · 1 checkout · full buyer protection
```

---

## Features

### Buyer Experience
| Feature | Description |
|---|---|
| **AI Natural Search** | Describe anything in plain language — the assistant understands intent, context, and nuance |
| **Visual Search** | Upload a photo and Celeste finds matching products across all shops |
| **AI Sets** | Curated product bundles built by AI, saved and shareable |
| **Unified Cart** | Mix products from any vendor — single payment, single delivery |
| **Cross-vendor Compare** | AI ranks the same item across shops by price, rating, and shipping |
| **Buyer Protection** | Every order is covered, regardless of which vendor fulfilled it |

### Seller Experience
| Feature | Description |
|---|---|
| **Vendor Dashboard** | Full analytics: revenue, orders, growth, payout history |
| **AI Growth Insights** | AI-powered demand signals and pricing recommendations |
| **Payout Management** | Linked payout cards, auto-pay, and instant withdrawal |
| **Product Management** | Inventory, listings, review management in one place |

### Platform
| Feature | Description |
|---|---|
| **Three-role Dashboard** | Unified dashboard for Admins, Vendors, and Customers |
| **JWT Auth** | Secure cookie-based authentication with role-based access |
| **Neon PostgreSQL** | Serverless Postgres with full-text search indexes |
| **REST API** | Typed API routes for auth, products, cart, orders, shops |

---

## Tech Stack

```
Frontend        Next.js 15 (App Router) · React 19 · TypeScript 5
Styling         Pure CSS design system — zero external UI libraries
Database        Neon (serverless PostgreSQL) via node-postgres (pg)
Auth            JWT (jose) · bcryptjs password hashing · HTTP-only cookies
Fonts           Poppins (display) · Inter (UI) · Hanken Grotesk (body)
Deployment      Vercel-ready
```

---

## Project Structure

```
celeste-next/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home — AI search hero, product feed
│   ├── about/                  # About page with animations
│   ├── assistant/              # AI shopping assistant chat
│   ├── cart/                   # Multi-step checkout (Cart → Ship → Pay → Done)
│   ├── dashboard/              # Three-role dashboard (Admin / Vendor / Customer)
│   ├── product/[id]/           # Product detail with gallery & reviews
│   ├── search/                 # Search & filter results
│   ├── shop/[id]/              # Shop storefront page
│   ├── sell/                   # Seller onboarding
│   ├── login/                  # Auth (sign in / sign up)
│   ├── pricing/                # Pricing page
│   ├── careers/                # Careers page
│   ├── contact/                # Contact form
│   └── api/                    # REST API routes
│       ├── auth/               # Login · register · me · logout
│       ├── products/           # Product listing & detail
│       ├── cart/               # Cart CRUD
│       ├── orders/             # Order creation & history
│       ├── shops/              # Shop data
│       ├── saved-sets/         # AI set save/load
│       ├── dashboard/          # Dashboard data endpoints
│       ├── admin/              # Admin-only routes
│       └── contact/            # Contact form submission
│
├── components/                 # Shared UI components
│   ├── Header.tsx              # Top navigation with AI search
│   ├── Footer.tsx              # Site footer
│   ├── ProductCard.tsx         # Product card with wishlist
│   ├── HeroWave.tsx            # Animated canvas wave
│   ├── LayoutShell.tsx         # Page wrapper (header + footer)
│   ├── AIChip.tsx              # AI badge component
│   ├── Stars.tsx               # Star rating display
│   ├── Ph.tsx                  # Image placeholder
│   ├── SectionHeader.tsx       # Section title with AI label
│   ├── SellerBand.tsx          # CTA band for sellers
│   ├── TrustBand.tsx           # Trust signal strip
│   ├── icons.tsx               # Full icon library (100+ SVG icons)
│   └── dashboard/
│       ├── AdminDash.tsx       # Admin section views
│       ├── VendorDash.tsx      # Vendor section views
│       ├── CustomerDash.tsx    # Customer section views
│       ├── DashComponents.tsx  # Shared dashboard primitives
│       ├── DashPay.tsx         # PayCard · QuickActions · TxnList
│       └── DashViz.tsx         # Charts · MiniRing · AreaChart
│
├── lib/
│   ├── data.ts                 # Static product & shop data
│   ├── dash-data.ts            # Dashboard mock data
│   ├── db.ts                   # Neon PostgreSQL client
│   ├── auth.ts                 # JWT helpers · session management
│   ├── cart-context.tsx        # React cart context
│   └── schema.sql              # Full database schema
│
└── scripts/
    └── seed.ts                 # Database seeder
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/celeste.git
cd celeste/celeste-next
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL connection string
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/celeste?sslmode=require

# JWT secret — generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-key-here
```

### 3. Set Up the Database

```bash
# Push the schema to Neon
npm run db:schema

# Seed with sample shops, products, and users
npm run seed
```

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is running.

---

## Database Schema

Celeste uses a relational PostgreSQL schema with full-text search:

```
users           → customers, vendors, admins
shops           → vendor storefronts
products        → listings with FTS index (GIN)
reviews         → per-product, per-user
cart_items      → supports guests (session_id) and logged-in users
orders          → multi-vendor orders with shipping & payment info
order_items     → line items per order, with shop reference
saved_sets      → AI-curated wishlists
saved_set_items → products within a set
contact_submissions → contact form entries
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in, set JWT cookie |
| `GET` | `/api/auth/me` | Current user from session |
| `POST` | `/api/auth/logout` | Clear session |
| `GET` | `/api/products` | List products (filter, search, paginate) |
| `GET` | `/api/products/[id]` | Single product detail |
| `GET` | `/api/shops` | List all shops |
| `GET` | `/api/shops/[id]` | Single shop with products |
| `GET/POST` | `/api/cart` | Get or add to cart |
| `DELETE` | `/api/cart` | Remove item from cart |
| `POST` | `/api/orders` | Place order |
| `GET` | `/api/orders` | Order history for current user |
| `GET/POST` | `/api/saved-sets` | Manage AI sets |
| `POST` | `/api/contact` | Submit contact form |

---

## Design System

Celeste uses a **custom CSS design system** with no external UI library dependency.

```css
/* Core tokens */
--green:       #01614E   /* Primary brand */
--yellow:      #FBE249   /* Accent / AI highlights */
--surface:     #FFFFFF
--surface-2:   #F1F3F2
--border:      #ECECEC
--text-primary:#11201B

/* Typography scale */
.t-display   font: Poppins 600, 56px, -1.2px tracking
.t-h2        font: Poppins 600, 36px
.t-h3        font: Inter 600, 22px
.t-body      font: Hanken Grotesk 300, 16px
.t-detail    font: 13.5px, secondary color

/* Component classes */
.btn .btn-primary .btn-secondary .btn-ghost .btn-accent
.card .pcard .chip .badge .ai-chip
.input .field-label
.pgrid .hscroll .container .row .col
```

---

## Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | AI search hero, product feed, intent shopping, shop spotlights |
| Assistant | `/assistant` | Full AI chat interface with product recommendations |
| Search | `/search` | Filtered product grid with sidebar |
| Product | `/product/[id]` | PDP with gallery, reviews, cross-vendor compare |
| Cart | `/cart` | 4-step checkout: Cart → Shipping → Payment → Done |
| Shop | `/shop/[id]` | Vendor storefront with product grid |
| Dashboard | `/dashboard` | Admin / Vendor / Customer views |
| About | `/about` | Brand story with animated sections |
| Sell | `/sell` | Seller onboarding landing page |
| Pricing | `/pricing` | Plan tiers for sellers |
| Login | `/login` | Sign in / Sign up |

---

## Dashboard Roles

The dashboard at `/dashboard` supports three distinct roles, switchable via tab:

```
Admin     → Platform overview, vendor approval, moderation, payouts, AI insights
Vendor    → Orders, product management, AI growth tools, reviews, payout cards
Customer  → Order tracking, AI sets, wishlist, AI assistant, account & payment cards
```

---

## Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint
npm run seed         # Seed database with sample data
npm run db:schema    # Verify schema file
```

---

## License

MIT © 2025 Celeste

---

<div align="center">

Built with care · AI-native from day one · One cart, every shop

</div>
