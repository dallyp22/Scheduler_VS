# Railway PostgreSQL Setup Guide

## Steps to Set Up Railway Database

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub account
3. Verify your email

### 2. Create New Project
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Railway will automatically create and configure the database

### 3. Get Connection String
1. Click on your PostgreSQL service
2. Go to "Variables" tab
3. Copy the `DATABASE_URL` value
4. It will look like: `postgresql://postgres:PASSWORD@HOST:PORT/railway`

### 4. Update .env File
Replace the DATABASE_URL in your `.env` file:

```bash
DATABASE_URL="postgresql://postgres:PASSWORD@containers-us-west-XXX.railway.app:5432/railway"
```

### 5. Run Migrations
Once you have the connection string:

```bash
cd /Users/dallas/Scenario/aips
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Seed the Database
```bash
npx prisma db seed
```

### 7. Verify with Prisma Studio
```bash
npx prisma studio
# Opens at http://localhost:5555
```

## Alternative: Local PostgreSQL

If you want to develop locally first:

### Option A: PostgreSQL with Docker
```bash
docker run --name aips-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aips \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Then use:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aips?schema=public"
```

### Option B: Install PostgreSQL Locally
macOS:
```bash
brew install postgresql@16
brew services start postgresql@16
createdb aips
```

Then use:
```
DATABASE_URL="postgresql://localhost:5432/aips?schema=public"
```

## Current Configuration

The `.env` file is already configured for local development:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aips?schema=public"
```

## Next Steps

1. Choose your database option (Railway or Local)
2. Update `DATABASE_URL` in `.env` if using Railway
3. Run migrations: `npx prisma migrate dev --name init`
4. Seed database: `npx prisma db seed`
5. Continue with tRPC implementation

