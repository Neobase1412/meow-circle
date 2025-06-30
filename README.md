# Meow Circle (喵圈)

A Next.js-based pet social platform focused on cat lovers. It's a comprehensive social application that includes pet management, community features, service bookings, and content sharing.

## Tech Stack

- **Frontend**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components  
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth with SSR support
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Internationalization**: Custom i18n with English and Traditional Chinese support
- **Deployment**: Docker containerization with multi-stage builds

## Development

### Local Development

```bash
# Navigate to web directory
cd web

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linting
pnpm lint
pnpm lint:fix
```

### Database Operations

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations in development
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio
```

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- GCP VM or any Linux server with Docker support

### Production Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/meow-circle.git
   cd meow-circle/docker
   ```

2. **Start all services**
   ```bash
   docker compose -f docker-compose.production.yml up -d
   ```

3. **Access the application**
   - Main app: `http://<your-ip>:3000`
   - Supabase Studio: `http://<your-ip>:8000/studio/`

### Database Seeding

**Important**: The production deployment **does NOT automatically seed the database** to avoid duplicate data on container restarts.

#### First-time Setup (Empty Database)

After your first deployment with an empty database, you need to manually seed the initial data:

```bash
# Method 1: Execute seed inside the running container
docker exec -it meow-circle-web npm run seed:prod

# Method 2: Use docker-compose to run a one-time command
docker compose -f docker-compose.production.yml run --rm web npm run seed:prod
```

#### Seed Data Includes
- Sample users (meowlover, catmom, etc.)
- Sample pets with profiles
- Sample posts and discussions
- Initial topics and tags
- Service providers and products

#### Important Notes
- The seed script uses `upsert` for users to prevent duplicates
- Other entities (posts, pets) use `create` and may duplicate if run multiple times
- Only run seed on an empty database or when you're sure you want the sample data
- In production, you typically only seed once during initial setup

### Managing Services

```bash
# View running containers
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f web

# Stop all services
docker compose -f docker-compose.production.yml down

# Reset database (WARNING: This will delete all data!)
cd docker
./reset.sh
```

## Environment Variables

### Required for Production

- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase URL (external IP)
- `SUPABASE_URL`: Internal Supabase URL (kong:8000)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_ANON_KEY`: Supabase anonymous key (server-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Authentication Configuration

The project uses a fixed cookie name `meow-circle-auth` to avoid cookie naming conflicts between different environments. This ensures consistent authentication across:
- Development (localhost)
- Production (IP-based access)
- Different internal/external URL configurations

## Troubleshooting

### Authentication Issues

If users can log in but appear logged out:
1. Clear all browser cookies
2. Check that environment variables are correctly set
3. Verify the fixed cookie name is being used
4. Check container logs: `docker logs meow-circle-web`

### Database Seed Issues

If you see duplicate data after container restarts:
- The container no longer automatically runs seed on startup
- Only manually seed when needed using the commands above
- Check if database already has data before seeding

### Common Docker Issues

1. **Port conflicts**: Ensure ports 3000, 8000, 5432 are not in use
2. **Memory issues**: Allocate at least 4GB RAM for all services
3. **Network issues**: Check firewall rules for required ports

## Project Structure

```
meow-circle/
├── web/                    # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and database
│   ├── prisma/           # Database schema and migrations
│   └── public/           # Static assets
├── docker/                # Docker configuration
│   ├── docker-compose.yml # Development setup
│   └── docker-compose.production.yml # Production setup
└── CLAUDE.md             # AI assistant guidelines
```

## Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Run `pnpm lint:fix` before committing
4. Test in both English and Chinese locales
5. Submit a pull request to `dev` branch

## License

[Your License Here]