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

# Docker operations (from root)
docker-compose up -d                    # Start all services
docker-compose -f docker/docker-compose.dev.yml up -d  # Start dev environment
docker-compose down                     # Stop all services
./docker/reset.sh                       # Reset database and restart services
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Internationalization**: Custom i18n with English and Traditional Chinese support
- **Deployment**: Docker containerization

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

- Supabase URL is currently hardcoded to `http://localhost:8000` for local development
- Database uses PostgreSQL with comprehensive indexing for performance
- Docker configuration includes separate dev and production setups
- ESLint configuration includes Next.js rules
- TypeScript strict mode is enabled

## Common Development Tasks

When working with this codebase:
1. Always use server actions for database operations
2. Follow the existing component patterns from shadcn/ui
3. Ensure proper TypeScript typing for all new code
4. Use the existing i18n patterns for any user-facing text
5. Test both English and Chinese locales
6. Verify database schema changes with Prisma migrations
7. Use the established directory structure for new features

## Testing and Quality

- Run `pnpm lint` before committing changes
- Use `pnpm lint:fix` to automatically fix common issues
- Test in both supported locales (en, zh-TW)
- Verify database operations work correctly with seeded data
- Test in both light and dark themes