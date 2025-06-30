# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meow Circle (喵圈) is a Next.js-based pet social platform focused on cat lovers. It's a comprehensive social application that includes pet management, community features, service bookings, and content sharing. The project is containerized with Docker and uses Supabase as the backend service.

## Development Commands

```bash
# Frontend development (in web/ directory)
cd web
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues automatically
pnpm db:seed      # Seed database with initial data

# Docker operations (from docker/ directory)
cd docker
docker compose up -d                              # Start all services with Nginx
docker compose -f docker-compose.yml -f dev/docker-compose.dev.yml up -d  # Start dev environment
docker compose down                               # Stop all services
./reset.sh                                       # Reset database and restart services

# Production deployment
docker compose up -d nginx web kong              # Start core services for production
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth with SSR support
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Reverse Proxy**: Nginx for production deployment
- **Internationalization**: Custom i18n with English and Traditional Chinese support
- **Deployment**: Docker containerization with multi-stage builds

### Key Directories Structure
```
web/
├── app/[locale]/        # Next.js App Router with i18n
├── components/          # React components (organized by feature)
├── lib/                # Utilities and database connection
├── actions/            # Server actions for data operations
├── prisma/             # Database schema and migrations
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── context/            # React context providers
└── public/             # Static assets

docker/                 # Docker configuration and services
├── volumes/           # Persistent volumes for containers
│   ├── nginx/        # Nginx configuration and logs
│   ├── db/           # PostgreSQL data and migrations
│   └── storage/      # File storage volumes
└── dev/              # Development-specific configurations
```

### Database Architecture
The application uses a comprehensive Prisma schema with these main entity groups:

1. **User Management**: Users, authentication, profiles, membership levels
2. **Social Features**: Posts, comments, likes, follows, discussions
3. **Pet Management**: Pet profiles, health records, life records, memorial pages
4. **Services**: Service providers, bookings, reviews
5. **Community**: Events, topics, tags, notifications
6. **Gamification**: Daily tasks, rewards, points system
7. **AI/Recommendations**: User interactions, recommendations, segmentation

### Key Architectural Patterns

**Internationalization (i18n)**:
- Uses `[locale]` dynamic route segment for English (`en`) and Traditional Chinese (`zh-TW`)
- Default locale is `zh-TW`
- Middleware handles locale detection and redirection
- Dictionary-based translations in `i18n-config.ts`

**Authentication Flow**:
- Supabase Auth integration with SSR support
- Middleware refreshes sessions on each request
- Server actions use `server.ts` client, components use `client.ts`
- OAuth callback handled at `/[locale]/auth/callback/route.ts`

**Component Organization**:
- shadcn/ui components in `components/ui/`
- Feature-specific components grouped by domain (pets/, auth/, profile/, etc.)
- Reusable cards and forms following consistent patterns

**Data Fetching**:
- Server actions in `actions/` directory for database operations
- Separate data modules in `lib/` for complex queries
- Prisma client instantiated once in `lib/prisma.ts`

### Development Patterns

**Server Actions**: All database operations go through server actions with proper error handling and validation.

**Component Structure**: Components follow shadcn/ui patterns with proper TypeScript typing and responsive design.

**Styling**: Uses Tailwind CSS with CSS variables for theming, includes dark mode support via `next-themes`.

**Database Operations**: All database queries use Prisma with proper indexes and relationships defined in schema.

## Important Configuration Notes

### Critical Authentication Issue (Resolved in v1.0.22)

**Problem History:**
- User could successfully login (API returns 200, creates JWT token)
- But frontend still showed "not logged in" state  
- Session not syncing between browser and server components
- Spent 3+ days debugging various approaches

**Root Causes Identified:**
1. **Network Issue**: Container cannot reach external IP `35.229.234.32:8000` (timeout errors)
2. **Cookie Naming Issue**: Supabase SSR auto-generates cookie names based on URL hostname
   - Frontend uses `http://35.229.234.32:8000` → creates `sb-35-auth-token`
   - Server uses `http://kong:8000` → looks for `sb-ko-auth-token`
   - Result: Server cannot find the cookie created by frontend

**Final Solution (v1.0.22) - Fixed Cookie Name Strategy:**
- Use a fixed cookie name `meow-circle-auth` across all environments
- Configuration:
  ```javascript
  // In client.ts, server.ts, and middleware.ts
  cookieOptions: {
    name: 'meow-circle-auth', // Fixed cookie name
  }
  ```
- **Frontend (Browser)**: `http://35.229.234.32:8000` (NEXT_PUBLIC_SUPABASE_URL)
- **Middleware & Server**: `http://kong:8000` (SUPABASE_URL for internal networking)
- **Benefits**: No more cookie naming conflicts regardless of URL changes

### Deployment Configuration & Constraints

**Production Environment:**
- **GCP VM**: Running `docker-compose.production.yml` directly on machine
- **External IP**: `35.229.234.32` (fixed, services must be accessible from internet)
- **No Domain**: IP-only access, no DNS configuration
- **No Nginx**: Direct service exposure (port 3000 for web, port 8000 for Supabase)

**Build Process Constraints:**
- **Fixed Build Command**: `docker buildx build --no-cache --platform linux/amd64 --push -t partnerai/meow-circle:X.X.X .`
- **No Build Args**: Cannot modify build command to add `--build-arg` parameters  
- **Version Increment Only**: Only version number changes (currently 1.0.22)
- **Pre-built Images**: Uses pre-built images from Docker Hub, not local builds
- **Historical Issue**: Attempted 15+ approaches cycling between 3-4 URL values before finding cookieOptions solution

**Container Networking:**
- **External Access**: Browser → `35.229.234.32:3000` (web), `35.229.234.32:8000` (Supabase)
- **Internal Network**: web container → kong:8000, db:5432 (container names)
- **Fixed Cookie Name**: Uses `meow-circle-auth` to avoid URL-based naming conflicts

### Environment Variables & Configuration (Production v1.0.22)
- **Frontend (Client-side)**: `NEXT_PUBLIC_SUPABASE_URL=http://35.229.234.32:8000`
- **Middleware**: `SUPABASE_URL=http://kong:8000`
- **Server Actions**: `SUPABASE_URL=http://kong:8000`
- **Auth Service**: `API_EXTERNAL_URL=http://35.229.234.32:8000` (docker-compose setting)
- **Database**: `DATABASE_URL=postgresql://postgres:...@db:5432/postgres`
- **Cookie Configuration**: Fixed cookie name `meow-circle-auth` across all environments
- **Key Pattern**: Internal API calls for server-side, external URL for client-side

### Docker Architecture
- **Multi-stage Build**: packages → builder → production
- **Auto Migration**: Container runs `prisma migrate deploy && prisma db seed` on startup
- **Production Volumes**: Persistent data for db, logs, storage
- **Internal Networking**: Services communicate via container names
- **External Access**: Only ports 3000 (web) and 8000 (supabase) exposed

## Common Development Tasks

When working with this codebase:
1. Always use server actions for database operations
2. Follow the existing component patterns from shadcn/ui
3. Ensure proper TypeScript typing for all new code
4. Use the existing i18n patterns for any user-facing text
5. Test both English and Chinese locales
6. Verify database schema changes with Prisma migrations
7. Use the established directory structure for new features

## Deployment Guide

### Local Development
```bash
cd docker
docker compose up -d
# Access: 
# - Main app: http://localhost (via Nginx)
# - Supabase Studio: http://localhost/studio/ (via Nginx)
# - Supabase API: Internal only (not exposed externally)
```

### GCP Production Deployment
1. **Prepare GCP Instance**: Ensure Docker and docker-compose are installed
2. **Firewall**: Open required ports:
   - 80 (Nginx - Only port needed)
3. **Deploy**: 
   ```bash
   git clone <repo>
   cd meow-circle/docker
   docker compose up -d
   ```
4. **Access**:
   - **Main app**: `http://<GCP-EXTERNAL-IP>`
   - **Supabase Dashboard**: `http://<GCP-EXTERNAL-IP>/studio/`
   - **Supabase API**: Internal only (used by Next.js app internally)

### Troubleshooting Authentication
If login API succeeds but web shows logged out:
- **Clear all browser cookies** and try logging in again
- Check if using the fixed cookie name: `meow-circle-auth`
- Verify environment variables:
  - Client uses `NEXT_PUBLIC_SUPABASE_URL` (external IP)
  - Server uses `SUPABASE_URL` (internal kong:8000)
- Check container logs: `docker logs meow-circle-web`
- Common issues:
  - Old cookies from different URL configurations
  - Missing cookieOptions configuration
  - Network connectivity between containers

## Testing and Quality

- Run `pnpm lint` before committing changes
- Use `pnpm lint:fix` to automatically fix common issues
- Test in both supported locales (en, zh-TW)
- Verify database operations work correctly with seeded data
- Test in both light and dark themes