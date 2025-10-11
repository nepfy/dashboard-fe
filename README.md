# Dashboard Frontend

A modern proposal management system built with Next.js, featuring AI-powered proposal generation and multiple template support.

## Overview

This application provides a comprehensive proposal management platform with:

- **🤖 AI-Powered Generation**: Automated proposal creation using Together AI
- **📋 Template System**: Three distinct proposal templates (New, Flash, Prime)
- **👥 User Management**: Clerk authentication with user-specific projects
- **💾 Database**: PostgreSQL with Drizzle ORM and template-specific schemas
- **💳 Payments**: Stripe integration for subscription management
- **📊 Analytics**: Project tracking and status management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI**: Together AI
- **Styling**: Tailwind CSS
- **File Storage**: Vercel Blob
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- Clerk account
- Stripe account
- Together AI API key

### Environment Setup

1. **Copy environment variables**:

   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables** (see [Environment Variables](#environment-variables) section below)

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Setup database**:

   ```bash
   # Generate database migrations
   npm run migrations

   # Apply migrations to database
   npm run push
   ```

5. **Run development server**:

   ```bash
   npm run dev
   ```

6. **Open application**:
   Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables. You can find example values in `.env.example` and the actual values on the Vercel dashboard.

### Application

```env
NEXT_PUBLIC_VERCEL_ENV=development
NEXT_PUBLIC_VERCEL_URL=localhost:3000
NEXT_PUBLIC_NEPFY_API_URL=http://localhost:3000/api
```

### Database (PostgreSQL/Neon)

```env
DATABASE_URL=""
DATABASE_URL_UNPOOLED=""
POSTGRES_DATABASE=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
PGDATABASE=""
PGHOST=""
PGHOST_UNPOOLED=""
PGPASSWORD=""
PGUSER=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_URL_NO_SSL=""
POSTGRES_USER=""
```

### Authentication (Clerk)

```env
CLERK_WEBHOOK_SECRET=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
```

### AI Integration (Together AI)

```env
TOGETHER_API_KEY=
```

### Payments (Stripe)

```env
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

### File Storage (Vercel Blob)

```env
BLOB_READ_WRITE_TOKEN=""
```

> **Note**: You can find all environment variable values on the Vercel dashboard under your project settings.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run migrations   # Generate Drizzle migrations
npm run push         # Apply migrations to database
npm run studio       # Open Drizzle Studio (database GUI)

# Type checking
npm run type-check   # Run TypeScript compiler check
```

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── flash/       # Flash template API
│   │   │   ├── prime/       # Prime template API
│   │   │   ├── new/         # New template API
│   │   │   └── projects/    # General projects API
│   │   └── (dashboard)/     # Protected routes
│   ├── lib/
│   │   ├── db/
│   │   │   └── schema/      # Database schemas
│   │   │       ├── templates/    # Template-specific schemas
│   │   │       ├── projects.ts   # Main projects schema
│   │   │       └── users.ts      # User schemas
│   │   └── ai/              # AI integration
│   └── components/          # React components
├── schemas/                 # Schema documentation
│   ├── README.md           # Database schema docs
│   ├── new.md              # New template spec
│   ├── flash.md            # Flash template spec
│   └── prime.md            # Prime template spec
└── migrations/             # Database migrations
```

## Documentation

### 📚 Schema Documentation

- **[Database Schema](./schemas/README.md)** - Complete database schema documentation
- **[New Template](./schemas/new.md)** - New template specification
- **[Flash Template](./schemas/flash.md)** - Flash template specification
- **[Prime Template](./schemas/prime.md)** - Prime template specification

### 🚀 API Documentation

The application provides template-specific API endpoints:

```
/api/flash/     - Flash template operations
/api/prime/     - Prime template operations
/api/minimal/   - Minimal template operations
```

Each template supports:

- `GET /` - List projects
- `GET /[id]` - Get single project
- `POST /draft` - Save draft
- `POST /finish` - Finalize project
- `PUT /` - Update project status
- `PATCH /` - Bulk update projects

## Templates

The system supports three proposal templates:

### 🆕 New Template

Comprehensive business proposals with detailed sections including introduction, about us, clients, expertise, plans, terms, FAQ, and footer.

### ⚡ Flash Template

Quick, conversion-focused proposals optimized for fast turnaround with introduction, team, results, testimonials, deliverables, and streamlined sections.

### ⭐ Prime Template

Premium, detailed business proposals for high-value clients with enhanced presentation and comprehensive feature set.

Each template has its own database schema and API endpoints for maximum flexibility and type safety.

## Features

- **🔐 Authentication**: Secure user authentication with Clerk
- **📝 Proposal Management**: Create, edit, and manage proposals
- **🤖 AI Generation**: Automated proposal content generation
- **📊 Project Tracking**: Status management and analytics
- **💳 Subscription Management**: Stripe-powered billing
- **📱 Responsive Design**: Mobile-first responsive interface
- **🎨 Template Customization**: Flexible template system
- **📄 PDF Export**: Generate PDF proposals
- **🔗 Shareable Links**: Password-protected proposal sharing

## Deployment

The application is optimized for deployment on Vercel:

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - automatic deployment from main branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Database Migrations

When making schema changes:

1. **Update schema files** in `src/lib/db/schema/`
2. **Generate migration**: `npm run migrations`
3. **Apply migration**: `npm run push`
4. **Update API routes** if needed
5. **Update documentation** in `schemas/`

## Support

- **Documentation**: Check the `schemas/` directory for detailed docs
- **Issues**: Create an issue in the repository
- **Environment Variables**: Available on Vercel dashboard

---

Built with ❤️ using Next.js, Drizzle ORM, and modern web technologies.
