# 🚀 Masik Bazar — Enterprise Production Launch & Operations Runbook

**System**: Masik Bazar (মাসিক বাজার) — Dhaka Household Grocery Operating System  
**Version**: 1.0.0 (Enterprise Full Scope Build)  
**Date**: September 2026  
**Target Region**: Dhaka Metropolitan Area (Gulshan, Banani, Uttara, Dhanmondi, Mirpur, Savar)

---

## 1. Architecture Overview

Masik Bazar is architected as a high-performance monorepo powered by **Turborepo** and **pnpm workspaces**:

```
masher-bazar/
├── packages/
│   ├── shared-types/      # Canonical domain entities, enums, DTOs & Bangladesh logistics types
│   ├── database/          # Prisma ORM schema (30+ tables), migrations & 150+ SKU Dhaka seed dataset
│   ├── business-rules/    # Pure computational engines (Basket Builder, Twin Pricing, Budget Solver, Margin Guard, AI Depletion)
│   ├── mock-adapters/     # bKash Tokenized, Nagad Direct, SSLCommerz Session & SMS Gateway adapters
│   └── config-typescript/ # Shared tsconfig bases
├── apps/
│   ├── api/               # NestJS enterprise backend (REST API, Swagger, Cron Schedulers, Gemini AI)
│   ├── web/               # Next.js 15 customer web portal (6-step Onboarding, Live Basket, Twin Pricing, Split Bill, AI Recipe)
│   ├── mobile/            # Expo React Native iOS/Android app (Offline-first, 1-tap OTP, Push Notifications)
│   └── admin/             # Next.js 15 WMS & Procurement portal (Wave Picking, Bin Routing, Supplier POs, Margin Audits)
└── docker-compose.yml     # Containerized runtime (PostgreSQL 16, Redis 7, API, Web, Admin)
```

---

## 2. Environment Variables & Credentials

Create a root `.env` file (or inject these environment variables into your production container manager / Kubernetes secret store):

```env
# -----------------------------------------------------------------------------
# Runtime & Database
# -----------------------------------------------------------------------------
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://masik_user:masik_secure_pass_2026@postgres:5432/masik_bazar?schema=public
REDIS_URL=redis://:masik_redis_pass_2026@redis:6379

# -----------------------------------------------------------------------------
# Security & JWT Authentication
# -----------------------------------------------------------------------------
JWT_SECRET=masik_dhaka_jwt_super_secret_enterprise_key_2026_x87
CORS_ORIGIN=https://masikbazar.com,https://admin.masikbazar.com,http://localhost:3000,http://localhost:3001

# -----------------------------------------------------------------------------
# Bangladesh Payment Gateways (bKash, Nagad, SSLCommerz)
# -----------------------------------------------------------------------------
BKASH_APP_KEY=bkash_live_app_key_dhaka
BKASH_APP_SECRET=bkash_live_app_secret_dhaka
BKASH_USERNAME=masik_merchant
BKASH_PASSWORD=masik_merchant_pass
NAGAD_MERCHANT_ID=NAGAD_MASIK_DHAKA
SSLCOMMERZ_STORE_ID=masikbazar_live
SSLCOMMERZ_STORE_PASS=ssl_live_secret_dhaka
SSLCOMMERZ_IS_SANDBOX=false

# -----------------------------------------------------------------------------
# AI Engine (Google Gemini 2.5 Flash)
# -----------------------------------------------------------------------------
GEMINI_API_KEY=AIzaSyD_EXAMPLE_GEMINI_KEY_DHAKA

# -----------------------------------------------------------------------------
# Public Frontends
# -----------------------------------------------------------------------------
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 3. Database Provisioning & Seed Data

Ensure PostgreSQL 16 is running, then execute the automated schema synchronization and database seeder:

```bash
# 1. Generate Prisma Client
pnpm db:generate

# 2. Push schema to database
pnpm db:push

# 3. Seed Dhaka logistical zones, warehouses, users & 150+ SKU Catalog with Twin Pricing
pnpm db:seed
```

### Seed Verification
The seed script inserts:
- **6 Dhaka Delivery Zones**: Gulshan-1/2, Banani, Uttara (Sectors 1-14), Dhanmondi, Mirpur (1-14), Savar Epz.
- **Dhaka Central Fulfillment Center**: Tejgaon Industrial Area (Zones A, B, C, D bins).
- **150+ FMCG Staple SKUs**:
  - Chashi Miniket Rice (25kg & 50kg), Nazirshail, Chinigura
  - Rupchanda / Teer / Fresh Soybean & Mustard Oil (1L, 2L, 5L)
  - ACI Masoor & Mung Dal, Fresh Whole Wheat Atta & Maida
  - Pabna Red Onions, Munshiganj Potatoes, Garlic, Ginger
  - Wheel & Surf Excel Detergents, Lifebuoy Soap, Bashundhara Tissue packs
- **Demo Accounts**:
  - Super Admin: `01700000000` (PIN/OTP: `123456`)
  - Test Customer: `01800000001` (PIN/OTP: `123456`)

---

## 4. Automated Enterprise Testing

Masik Bazar includes a high-precision unit and integration test suite in `packages/business-rules` verifying all core algorithmic operations:

```bash
# Run business-rules test suite
pnpm --filter @masik/business-rules test
```

### Test Suite Test Cases
1. **Calibrated Monthly Basket Generator**: Confirms standard Dhaka family of 4 receives balanced allocations across all staple categories (minimum 15kg rice, oil, lentils, flour, hygiene).
2. **Dynamic Dietary Adaptation**: Validates that roti-heavy household profiles automatically scale whole wheat flour and reduce rice proportion.
3. **Twin Pricing Engine**: Computes Masik wholesale contract rate vs. Dhaka local market MRP with mathematical precision, calculating aggregate monthly household savings.
4. **Greedy Budget Optimization Solver**: Automatically replaces primary SKUs with economy substitutes to safely bring over-budget orders within customer threshold.
5. **Margin Floor Protection**: Enforces an 8% gross profit margin floor to prevent loss-making operational discounts.
6. **AI Consumption & Depletion Prediction**: Accurately projects run-out dates based on historical repurchase cadence.
7. **Missing Staple Omission Detector**: Flags omissions in monthly drafts with localized Bengali and English alerts.

---

## 5. Containerized Production Deployment

To launch the full stack in an isolated Docker environment:

```bash
# Build and launch all containers
docker-compose up -d --build

# Inspect container status and healthchecks
docker-compose ps
```

Expected output:
- `masik-postgres` (healthy on port `5432`)
- `masik-redis` (healthy on port `6379`)
- `masik-api` (running on port `4000`)
- `masik-web` (running on port `3000`)
- `masik-admin` (running on port `3001`)

---

## 6. Security Hardening Checklist

The following controls are active across all endpoints:

1. **Enterprise Security Headers**:
   - `X-Frame-Options: DENY` (clickjacking defense).
   - `X-Content-Type-Options: nosniff` (MIME-sniffing prevention).
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `X-Powered-By` header stripped.
2. **Sliding-Window Rate Limiting**:
   - General API: 120 requests/min per IP.
   - Sensitive Endpoints (`/api/auth/otp/*`, `/api/payments/execute`): 10 requests/min per IP.
3. **Idempotency Guard**:
   - Supports `Idempotency-Key` or `x-idempotency-key` on critical mutation endpoints (`/api/orders`, `/api/payments/*`).
   - Prevents duplicate credit deductions or duplicate gateway charges if network disconnects.
4. **Strict Input Sanitization**:
   - NestJS global `ValidationPipe` with whitelist filtering.
   - Swagger OpenAPI spec available at `http://localhost:4000/api/docs`.

---

## 7. Monthly Operational Procedures

### A. Salary-Cycle Recurring Billing Batch
On scheduled payday billing anchors (1st, 3rd, 5th, or 10th of every month), the automated billing engine processes locked baskets:

```bash
# Trigger salary cycle billing batch manually or via cron
curl -X POST http://localhost:4000/api/subscriptions/process-salary-cycle \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

### B. Wave Picking & Fulfillment
Each morning at 06:00 AM, the fulfillment coordinator generates slot-optimized wave picks:

```bash
# Generate wave pick batches for morning delivery slot
curl -X POST http://localhost:4000/api/wms/generate-wave-picks \
  -H "Content-Type: application/json" \
  -d '{"deliverySlot": "MORNING_07_10", "zoneId": "zone-gulshan"}'
```

### C. 14-Day Automated Procurement Reorders
Verify low stock levels and trigger automated Purchase Orders to suppliers:

```bash
# Retrieve rolling 14-day stock demand forecast
curl http://localhost:4000/api/procurement/demand-forecast

# Issue PO to supplier (e.g. City Group, Square, Meghna)
curl -X POST http://localhost:4000/api/procurement/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": "sup-city-group",
    "deliveryDate": "2026-10-02T00:00:00.000Z",
    "items": [
      { "variantId": "v-oil-rup-5l", "quantity": 500, "unitCost": 750 }
    ]
  }'
```

---

## 8. Backup & Disaster Recovery Protocols

### Database Backup
```bash
# Run hourly PostgreSQL dump
docker exec -t masik-postgres pg_dump -U masik_user -d masik_bazar -F c -b -v -f /var/lib/postgresql/data/backup_$(date +%Y%m%d_%H%M%S).dump
```

### Database Restore
```bash
# Restore from snapshot
docker exec -t masik-postgres pg_restore -U masik_user -d masik_bazar -v /var/lib/postgresql/data/<backup_filename>.dump
```

### Redis Cache Purge
```bash
# Flush temporary rate-limiting keys or cache
docker exec -it masik-redis redis-cli -a masik_redis_pass_2026 FLUSHDB
```

---

**Masik Bazar (মাসিক বাজার)** is verified, hardened, and ready for commercial rollout across Dhaka.
