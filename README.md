# AI-Enhanced Packaging Scheduler (AIPS)

A next-generation, real-time manufacturing scheduler that transforms complex production planning into an intuitive, visual experience.

## Tech Stack

- **Frontend:** Next.js 14+ with TypeScript
- **UI:** Ant Design 5.x + Tailwind CSS
- **State Management:** Zustand + TanStack Query
- **Data Visualization:** Recharts + D3.js
- **Backend:** tRPC + Prisma ORM
- **Database:** PostgreSQL 16
- **Authentication:** Clerk
- **Optimization:** Python FastAPI + Google OR-Tools
- **Real-time:** Socket.io
- **Deployment:** Vercel (Frontend) + Railway (Backend)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16
- Python 3.11+ (for optimizer service)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
aips/
├── app/                    # Next.js app router pages
│   ├── skus/              # SKU management
│   ├── changeovers/       # Changeover matrix
│   ├── schedule/          # Scheduling board
│   └── analytics/         # Analytics dashboard
├── components/            # React components
├── lib/                   # Utility functions
│   └── mock-data/         # Mock data generators
├── types/                 # TypeScript type definitions
├── server/                # Backend API
│   └── api/
│       └── routers/       # tRPC routers
├── prisma/                # Database schema
└── packages/
    └── optimizer/         # Python optimizer service
```

## Features

### Phase 1: Visual Prototype (Current)
- ✅ SKU Management Interface
- ✅ Changeover Matrix Editor
- ✅ Interactive Scheduling Dashboard
- ✅ Flow Visualization

### Phase 2: Backend Infrastructure (Upcoming)
- ⏳ Clerk Authentication
- ⏳ Prisma Database Integration
- ⏳ tRPC API Endpoints

### Phase 3: Optimization Engine (Upcoming)
- ⏳ Python FastAPI Service
- ⏳ CP-SAT Constraint Solver
- ⏳ ML Changeover Prediction

### Phase 4-6: Advanced Features (Upcoming)
- ⏳ Real-time Collaboration
- ⏳ Analytics Dashboard
- ⏳ Scenario Comparison
- ⏳ Production Deployment

## Development

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Deployment

The application is deployed using:
- **Frontend:** Vercel (auto-deploy from main branch)
- **Backend/Database:** Railway
- **Optimizer:** Railway Workers

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - Digital Manufacturing Operations
