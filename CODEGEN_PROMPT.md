```markdown
# BizSite AI — Full Code Generation Prompt

Copy this entire prompt into Claude or any LLM to generate the complete project.

---

Build a complete production-ready web application called **BizSite AI** — an AI-powered website builder for local Indian businesses. Shopkeepers, salon owners, restaurants, and service providers can create professional websites in minutes without coding.

## Tech Stack
- **Framework:** Next.js 14 with App Router (TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Auth:** NextAuth.js v5 (Auth.js) with Google OAuth + Email/Password
- **AI:** OpenAI GPT-4o API (server-side only)
- **File Upload:** Uploadthing
- **Deployment:** Vercel + Supabase

## Project Setup

```bash
npx create-next-app@latest bizsite --typescript --tailwind --app
cd bizsite
npm install @prisma/client @auth/prisma-adapter @next-auth/prisma-adapter next-auth@beta @uploadthing/react uploadthing prisma openai zod react-hook-form @hookform/resolvers zustand
npx prisma init
npx shadcn-ui@latest init
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-tooltip lucide-react
```

## Environment Variables (.env.local)
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="..."
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Database Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum BusinessCategory {
  RESTAURANT
  SALON
  SHOP
  SERVICE
  FITNESS
  OTHER
}

enum SectionType {
  HERO
  ABOUT
  SERVICES
  GALLERY
  CONTACT
  TESTIMONIALS
  MAP
  FOOTER
}

enum SiteStatus {
  DRAFT
  PUBLISHED
  UNPUBLISHED
}

enum AnalyticsEventType {
  PAGE_VIEW
  CONTACT_CLICK
  WHATSAPP_CLICK
  PHONE_CLICK
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  business      Business?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Business {
  id           String           @id @default(cuid())
  userId       String           @unique
  name         String
  slug         String           @unique
  category     BusinessCategory
  phone        String
  whatsapp     String?
  email        String?
  address      Json             @default("{}")
  location     Json?
  logo         String?
  coverImage   String?
  description  String?          @db.Text
  siteStatus   SiteStatus       @default(DRAFT)
  publishedAt  DateTime?
  customDomain String?
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  user         User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  website      Website?
  contacts     Contact[]
  analytics    AnalyticsEvent[]
  @@index([category])
  @@index([siteStatus])
}

model Template {
  id          String           @id @default(cuid())
  name        String
  description String?
  category    BusinessCategory
  thumbnail   String
  popular     Boolean          @default(false)
  sections    Json
  styles      Json
  createdAt   DateTime         @default(now())
  @@index([category])
}

model Website {
  id                String     @id @default(cuid())
  businessId        String     @unique
  sections          Json       @default("[]")
  styles            Json       @default("{}")
  pages             Json?
  publishedVersion  Json?
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  lastEditedAt      DateTime?
  business          Business   @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model Contact {
  id         String   @id @default(cuid())
  businessId String
  name       String
  email      String
  phone      String?
  message    String   @db.Text
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  @@index([businessId])
  @@index([read])
}

model AnalyticsEvent {
  id         String             @id @default(cuid())
  businessId String
  event      AnalyticsEventType
  metadata   Json?
  createdAt  DateTime           @default(now())
  business   Business           @relation(fields: [businessId], references: [id], onDelete: Cascade)
  @@index([businessId])
  @@index([businessId, createdAt])
}
```

## Auth Setup (lib/auth.ts)
Create NextAuth config with:
- Google OAuth provider
- Credentials provider for email/password (using bcrypt)
- PrismaAdapter for database sessions
- JWT strategy (no database sessions for speed)
- Custom signIn/signUp pages at /login and /register
- Session callback that includes user.id

## AI Service (lib/ai.ts)
Create an OpenAI client wrapper with these methods:
- `generateContent(businessName, category, services?)` — Generates about text, tagline, service descriptions. Prompt: "You are helping a local Indian business create their website content. Write in a warm, professional tone..."
- `suggestColors(category, preference?)` — Returns {primary, secondary, accent} hex colors based on the business category
- `generateServices(businessName, category)` — Generates 4-6 realistic service offerings
- `generateSEO(businessName, category, city)` — Generates meta title, description, keywords

## Core Components

### Onboarding Wizard (app/onboarding/page.tsx)
A 4-step wizard using React state:
1. Business Details — Form with name, category dropdown (Translated to Hindi: Restaurant = रेस्टोरेंट, etc.), phone, city, address
2. Template Selection — Grid of TemplateCard components, filterable by category. Click to select.
3. Content — Simple form with text areas. "Generate with AI" button that calls /api/ai/generate-content. Shows loading spinner, populates fields on response. User can edit AI output.
4. Publish — Success screen with live site link, "View My Site" button, "Edit Further" button, WhatsApp share link

### Website Editor (app/editor/[id]/page.tsx)
Three-panel layout:
- **Left Sidebar:** List of website sections with drag handles. Each section shows its type icon and preview thumbnail. "Add Section" button at bottom opens a modal with available section types. Sections are sorted by "order" field.
- **Center Canvas:** iframe showing live preview of the website. The iframe renders from /api/business/:id/preview. When user clicks an element in the iframe, the right panel updates to show properties for that section.
- **Right Panel:** Context-aware properties editor. Shows different form fields based on selected section type:
  - HERO: heading, subheading, CTA text, background image/color, layout (left/center)
  - ABOUT: text content, image
  - SERVICES: service items (name, description, price, image)
  - GALLERY: image grid upload
  - CONTACT: show/hide phone, email, form, WhatsApp
  - TESTIMONIALS: testimonial items (name, text, image)
  - MAP: address (auto-embeds Google Maps)
  - FOOTER: social links, copyright text
- **Top Bar:** Undo, Redo, Preview (new tab), Publish (primary button), "Last saved: X mins ago"
- Autosave: Every 30 seconds, call PUT /api/business/:id/website with full sections array

### Section Renderers (components/sections/)
Create one component per SectionType. Each section component receives `content` and `styles` as props and renders the section for the live site. Use Tailwind for styling. Each should be responsive (mobile-first).

Section components:
- `HeroSection` — Full-width, large heading + subheading + CTA button + optional background image
- `AboutSection` — Two-column (image | text) on desktop, stacked on mobile
- `ServicesSection` — Grid of service cards (3 columns desktop, 2 tablet, 1 mobile)
- `GallerySection` — Image grid with lightbox on click
- `ContactSection` — Contact form + business info + WhatsApp floating button
- `TestimonialsSection` — Carousel/slider of testimonial cards
- `MapSection` — Google Maps iframe embed (responsive)
- `FooterSection` — Links, social icons, copyright

### Live Site (app/[slug]/page.tsx)
ISR (Incremental Static Regeneration) page that:
1. Fetches published website data by slug
2. Renders all sections using SectionRenderer components
3. Includes floating WhatsApp button (if business has whatsapp number)
4. Includes contact form
5. Tracks page view via POST /api/analytics/track (client-side)
6. Revalidates every 60 seconds (revalidate: 60)

## API Routes

### POST /api/auth/register
- Validate: email, password (min 8), name using Zod
- Hash password with bcrypt (10 rounds)
- Create user with Prisma
- Return success (don't auto-login — redirect to /login)

### POST /api/business
- Get userId from session
- Generate slug from business name (lowercase, replace spaces with hyphens, append random 4 chars if taken)
- Validate required fields with Zod
- Create Business record
- Create empty Website record linked to business
- Apply default template (first matching category, or first template)
- Return business with slug

### PUT /api/business/:id/website
- Auth required
- Validate userId owns this business
- Accept full JSON: {sections: Section[], styles: StyleConfig}
- Update website record
- Return success

### POST /api/business/:id/publish
- Auth required
- Validate userId owns this business
- Set publishedVersion = current sections+styles
- Set siteStatus = PUBLISHED
- Set publishedAt = now()
- Return {url: `https://bizsite.app/${business.slug}`}

### POST /api/ai/generate-content
- Auth required, rate limited (10 req/min)
- Accept: {businessName, category, services?}
- Call OpenAI with structured prompt
- Return: {tagline, aboutText, services: [{name, description, price?}]}
- Handle errors gracefully (return 429 if rate limited)

### POST /api/analytics/track  
- No auth (called from live sites)
- Validate: site_id, event type
- Find business by site_id (slug)
- Create AnalyticsEvent record
- Return 200

### GET /api/site/:slug
- No auth
- Find Business by slug where siteStatus = PUBLISHED
- Return publishedVersion (sections + styles)
- Return 404 if not found or not published

## Seed Script (prisma/seed.ts)
Create 5 templates matching different business categories:
1. "Dukaan" — SHOP template (product grid, store story)
2. "Swad" — RESTAURANT template (menu, food gallery, delivery info)
3. "Saundarya" — SALON template (price list, work gallery)
4. "Seva" — SERVICE template (offerings, testimonials)
5. "Tandrusti" — FITNESS template (class schedule, pricing, trial CTA)

Each template should have realistic default JSON for `sections` and `styles`.

## Design System
Use Tailwind with these design tokens:
- Primary: `#2563EB` (blue-600)
- Secondary: `#059669` (emerald-600)
- Accent: `#F59E0B` (amber-500)
- Surface: `#F8FAFC` (slate-50)
- Heading font: Inter (font-bold)
- Body font: Inter (font-normal)
- Border radius: `rounded-lg` (8px) for cards, `rounded-full` for buttons
- Shadows: `shadow-sm` for cards, `shadow-lg` for modals

## Building Order
Build in this exact order:

1. **Prisma schema + seed** — Set up DB, run `npx prisma db push && npx prisma db seed`
2. **Auth** — NextAuth config, login/register pages, middleware
3. **Onboarding** — Business creation, template selection, AI content
4. **Editor (sections panel)** — Section list, add/remove/reorder
5. **Section renderers** — All 8 section components (start with Hero, end with Footer)
6. **Editor (canvas + properties)** — Live preview iframe, click-to-edit, properties panel
7. **Publish flow** — Publish button, publishedVersion, live site route
8. **Dashboard + Analytics** — Stats overview, analytics tracking
9. **AI features** — Content generation, color suggestions in editor
10. **Polish** — Loading states, error states, mobile responsiveness, SEO

## Key UX Considerations
- All forms show validation errors inline (use react-hook-form + zod)
- All async actions show loading states (spinners on buttons)
- Mobile-first responsive design throughout
- Hindi translations for key UI labels (business categories, onboarding steps)
- "Generate with AI" buttons show a sparkle icon and have loading animation
- Empty states show helpful illustrations and CTAs
- Contact form submissions from live sites send email notification to business owner
- WhatsApp button opens `https://wa.me/91{number}` with pre-filled message
```

## Sab files Desktop pe save ho gaye hain:

```
~/Desktop/app-gen-output/
├── 01-orchestrator-plan.json
├── 02-architect-output.json
├── 03-ui-output.json
├── 04-backend-output.json
├── 05-database-output.json
├── 06-merged-plan.md
└── 07-final-codegen-prompt.md
```
