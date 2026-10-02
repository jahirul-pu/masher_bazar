# Masik Bazar - Vercel Deployment Guide

This repository is structured as a high-performance **Turborepo monorepo** managed with `pnpm`. It contains two production-grade Next.js 15 applications ready to host on Vercel:

1. **`@masik/web` (`apps/web`)**: The consumer-facing Household Grocery Operating System (B2C & B2B Mess Portal).
2. **`@masik/admin` (`apps/admin`)**: The internal Operations, Warehouse Management (WMS), and Live Control Plane.

---

## Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │              GitHub Repo                │
                      │         (Turborepo + pnpm)              │
                      └───────────────┬─────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   ┌──────────────────────┐                       ┌──────────────────────┐
   │    Vercel Project 1  │                       │   Vercel Project 2   │
   │      (apps/web)      │                       │     (apps/admin)     │
   │  masikbazar.com      │                       │  admin.masikbazar.com│
   └──────────┬───────────┘                       └───────────┬──────────┘
              │                                               │
              └───────────────────────┬───────────────────────┘
                                      │ (NEXT_PUBLIC_API_URL)
                                      ▼
                      ┌────────────────────────────────┐
                      │    NestJS API (@masik/api)     │
                      │  (Railway / Render / Fly.io /  │
                      │     VPS via Docker Compose)    │
                      └───────────────┬────────────────┘
                                      ▼
                      ┌────────────────────────────────┐
                      │ PostgreSQL + Redis + Meilisearch│
                      └────────────────────────────────┘
```

---

## Option 1: Monorepo Multi-Project Deployment (Recommended)

In this standard setup, you create **two separate Vercel projects** connected to the same GitHub repository: one for the customer storefront (`apps/web`) and one for the admin control plane (`apps/admin`).

### Step 1: Deploy Customer Web App (`apps/web`)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
2. Select and import this Git repository.
3. In the **Configure Project** screen:
   - **Project Name**: `masik-bazar-web` (or your preferred name)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select **`apps/web`**.
   - Keep the checkbox **"Include source files outside of the Root Directory in the Build Step"** **checked** (Vercel enables this automatically for monorepos).
4. **Build & Development Settings**:
   - The repository includes [`apps/web/vercel.json`](file:///d:/projects/masher%20bazar/apps/web/vercel.json), which automatically executes Turborepo with workspace dependencies:
     ```bash
     pnpm exec turbo run build --filter=@masik/web...
     ```
   - *Leave Build Command, Output Directory, and Install Command at default / auto-detected.*
5. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` (optional during initial frontend testing; set to your deployed NestJS API URL when available, e.g. `https://api.yourdomain.com`).
6. Click **Deploy**.

---

### Step 2: Deploy Admin Control Plane (`apps/admin`)

1. In the Vercel Dashboard, click **"Add New..." > "Project"** again.
2. Select the same Git repository.
3. In the **Configure Project** screen:
   - **Project Name**: `masik-bazar-admin`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select **`apps/admin`**.
   - Ensure **"Include source files outside of the Root Directory in the Build Step"** is **checked**.
4. **Build & Development Settings**:
   - The repository includes [`apps/admin/vercel.json`](file:///d:/projects/masher%20bazar/apps/admin/vercel.json), which automatically builds dependencies and admin:
     ```bash
     pnpm exec turbo run build --filter=@masik/admin...
     ```
   - *Leave all build overrides at default / auto-detected.*
5. **Environment Variables**:
   - Set `NEXT_PUBLIC_API_URL`: URL of your backend API (e.g. `https://api.yourdomain.com`).
6. Click **Deploy**.

---

## Option 2: Zero-Config Root Deployment (`apps/web`)

If you import the root repository directly into Vercel **without modifying the Root Directory** (`.`):
- The root [`vercel.json`](file:///d:/projects/masher%20bazar/vercel.json) pre-configures Vercel to build `@masik/web` and target `apps/web/.next`.
- Vercel will immediately deploy the storefront on the root domain.

---

## What We Configured for Vercel

1. **`apps/web/vercel.json` & `apps/admin/vercel.json`**:
   Configured Turborepo scoped build commands (`turbo run build --filter=@masik/<app>...`) that automatically compile internal monorepo packages (`@masik/shared-types`, `@masik/business-rules`) in topological order.
2. **`package.json` Lifecycle Scripts**:
   Added `"prebuild"` scripts to both `apps/web` and `apps/admin` as a fallback safeguard, ensuring workspace packages compile even if build commands are triggered without Turborepo.
3. **`turbo.json` Cache & Environment Configuration**:
   Configured `globalEnv` and task `env` (`NEXT_PUBLIC_API_URL`) to ensure Vercel and Turborepo cache invalidations work smoothly across deployments.
4. **Clean Linting & Typechecking**:
   Synchronized `"lint": "tsc --noEmit"` across Next.js apps to prevent interactive prompt hangs during CI/CD builds.
5. **Environment Variable Integration**:
   Updated [`apps/admin/src/app/page.tsx`](file:///d:/projects/masher%20bazar/apps/admin/src/app/page.tsx#L110-L125) to use `process.env.NEXT_PUBLIC_API_URL` with graceful fallback to local development.
6. **`.gitignore`**:
   Added `.vercel` and `.vercel/` to prevent local Vercel CLI state from being committed.

---

## Hosting the Backend (`@masik/api`)

Because Vercel is designed for serverless frontends and Next.js applications, the long-running NestJS API (`@masik/api`), PostgreSQL, Redis, and Meilisearch should be hosted on a container-compatible platform:

- **Railway / Render / Fly.io**: Deploy directly from the existing [`apps/api/Dockerfile`](file:///d:/projects/masher%20bazar/apps/api/Dockerfile).
- **Self-Hosted VPS (DigitalOcean / Hetzner / AWS EC2)**: Run the production Docker compose stack:
  ```bash
  docker compose -f docker-compose.yml up -d
  ```

Once your backend is running, copy its public URL (e.g., `https://api.masikbazar.com`) into Vercel under **Project Settings > Environment Variables > `NEXT_PUBLIC_API_URL`**.
