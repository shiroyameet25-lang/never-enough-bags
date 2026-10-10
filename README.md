# NEEVA BAGS — Luxury Designer Handbags & Accessories

A modern luxury e-commerce web application featuring high-performance animations, 3D interactive hero displays, Supabase Backend-as-a-Service integration, and direct WhatsApp ordering.

---

## Architecture Overview

```text
neeva-bags/
├── frontend/               # Fullstack Web Application (TanStack Start + React 19 + Vite)
│   ├── src/
│   │   ├── assets/         # High-resolution product photography & 3D assets
│   │   ├── components/     # UI primitives & presentation components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── integrations/   # Supabase client & authentication middleware
│   │   ├── lib/            # State stores, product data access, error reporting
│   │   ├── routes/         # File-based routing (TanStack Router)
│   │   ├── routeTree.gen.ts# Auto-generated routing tree
│   │   ├── router.tsx      # Router factory & React Query client
│   │   ├── server.ts       # SSR entry handler
│   │   ├── start.ts        # TanStack Start instance configuration
│   │   └── styles.css      # Design system styling with Tailwind CSS v4
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── supabase/               # Database infrastructure & schemas
    ├── config.toml         # Local Supabase CLI configuration
    └── migrations/         # SQL migration scripts for tables, RLS policies & storage
```

---

## Tech Stack

* **Framework:** [TanStack Start](https://tanstack.com/start) with React 19
* **Routing:** [TanStack Router](https://tanstack.com/router)
* **Data Fetching:** [TanStack Query](https://tanstack.com/query)
* **Styling:** Tailwind CSS v4 & Radix UI primitives
* **Backend:** [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, Row Level Security)
* **3D Visuals:** Three.js / React Three Fiber

---

## Getting Started Locally

### 1. Prerequisites
* Node.js 18+ (tested on Node.js 24)
* npm 9+

### 2. Environment Setup
Navigate to the `frontend/` directory and configure your environment variables:

```bash
cd frontend
cp .env.example .env
```

Fill in your Supabase credentials in `frontend/.env`:
```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
SUPABASE_PROJECT_ID=<your-project-id>
```

### 3. Install Dependencies
```bash
cd frontend
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the application.

### 5. Production Build
```bash
npm run build
```

---

## Key Features

1. **Unauthenticated Catalog Browsing:** Public visitors can browse all collections, filter by brands, and view bag details without requiring account creation.
2. **Direct WhatsApp Ordering:** Instant purchase routing to sales representative with pre-formatted luxury order messages.
3. **Cart & Wishlist:** Client-side persisted luxury shopping cart.
4. **Admin Dashboard:** Product inventory management and order inspection.
5. **Database Row Level Security (RLS):** Supabase database policies protecting customer orders and profiles while allowing public catalog reads.
