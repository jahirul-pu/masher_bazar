# Masik Bazar: Master Architecture & Implementation Plan
**Document Version:** 1.0 (Full Scope / Enterprise Build — No MVP)  
**Target Market:** Bangladesh (Dhaka Metropolitan: Gulshan, Banani, Uttara, Dhanmondi, Mirpur, Savar, expanding nationwide)  
**Platforms:** Mobile-Responsive Next.js 15 Web App + Cross-Platform Mobile App (iOS & Android via React Native Expo) + Warehouse/WMS Portal + Procurement/Admin Back-Office  
**Monorepo Structure:** `d:/projects/masher bazar/apps/` and `d:/projects/masher bazar/packages/`

---

## 1. System Vision & Architecture

Masik Bazar is a **Household Grocery Operating System** designed around monthly demand aggregation, automated basket generation, budget optimization, bulk procurement, and recurring subscription fulfillment.

### Core Architectural Decisions
* **Monorepo**: Turborepo with pnpm workspaces.
* **Backend**: NestJS 10+ (TypeScript) with Modular Clean Architecture, WebSocket gateways (Socket.io) for live order tracking, and BullMQ worker queues.
* **Database**: PostgreSQL 16+ managed via Prisma ORM with strict ACID transactions for order fulfillment and stock reservation.
* **Cache & Locks**: Redis 7+ for low-latency session caching, distributed `Redlock` for inventory concurrency, and BullMQ job scheduling.
* **Search Engine**: Meilisearch for sub-50ms typo-tolerant bilingual search (Bangla `তেল` $\leftrightarrow$ English `Oil`).
* **Web Frontend (Mobile Responsive)**: Next.js 15 App Router + Tailwind CSS + shadcn/ui + next-intl (Bangla/English).
* **Mobile Frontend**: React Native Expo (SDK 52+) for native iOS & Android (100% type & logic sharing).
* **Payment & Gateways**: Sandbox Mocks with production-ready real adapters for bKash Tokenized Checkout (recurring debits), Nagad, SSLCommerz, and COD with OTP verification.
* **Communications**: Sandbox Mocks + adapters for SSL Wireless / BulkSMSBD SMS, WhatsApp Cloud API, and Firebase Cloud Messaging (FCM).
* **AI Engine**: Gemini 2.5 Flash for natural language Bengali market generation & meal-to-market conversions + Python/FastAPI forecasting.

---

## 2. Directory Structure

```
d:/projects/masher bazar/
├── apps/
│   ├── api/                   # NestJS Backend API & WebSockets
│   ├── web/                   # Next.js 15 Customer Web App (Mobile Responsive)
│   ├── admin/                 # Next.js 15 Operations, WMS & Admin Back-office
│   └── mobile/                # React Native Expo iOS & Android Mobile App
├── packages/
│   ├── database/              # Prisma schema, migrations, seed data
│   ├── shared-types/          # Cross-platform TypeScript DTOs, Enums & Interfaces
│   ├── business-rules/        # Basket generation, budget optimization, savings formulas
│   ├── mock-adapters/         # Sandbox mocks for bKash, Nagad, SSLCommerz & SMS
│   ├── config-eslint/         # Shared ESLint configuration
│   └── config-typescript/     # Shared tsconfig definitions
├── turbo.json                 # Turborepo task pipeline
├── pnpm-workspace.yaml        # Monorepo workspace configuration
├── package.json               # Root dependencies & scripts
├── IMPLEMENTATION_PLAN.md     # This master document
└── MASHER BAZAR.md            # Original PRD
```

---

## 3. Database Entities & Schemas

PostgreSQL 16 via Prisma ORM covers all 30+ domain models:
1. **User & Auth**: Phone OTP auth, role-based access control (CUSTOMER, SUPER_ADMIN, WAREHOUSE_STAFF, PROCUREMENT_MANAGER, SUPPORT, DELIVERY_RIDER).
2. **CustomerProfile**: Household profiles, lifetime savings, loyalty Market Credits, referral ledger, payday cycle.
3. **Household**: Family size, adult/child/elderly composition, cooking frequency, dietary habits, staple preferences.
4. **Product, Brand & Category**: Dual-language naming (English/Bangla), SKUs, barcodes, pack sizes, MRP, purchase cost, Masik selling price.
5. **ProductSubstitution**: Substitution maps (Economy, Standard, Premium equivalents).
6. **Basket & BasketItem**: Recommended baskets, custom baskets, recurring flags.
7. **Subscription**: Same Basket, Smart Basket, Custom Subscription, payday schedule, 30-day Price Lock contracts.
8. **Order & OrderItem**: Order state machine (`DRAFT` $\to$ `DELIVERED` / `CANCELLED`), live tracking.
9. **DeliveryZone & Slot**: Polygons for Dhaka zones (Gulshan, Banani, Uttara, Dhanmondi, Mirpur, Savar), slot time windows, and real-time order capacity locks.
10. **Warehouse, Inventory & Batches**: Bin locations, batch/lot tracking, expiry tracking, reservations.
11. **PickingBatch & PickingItem**: Wave picking aggregation manifests, QC scan verification.
12. **Supplier & PurchaseOrder**: Supplier directory, contracts, lead times, reliability scoring, bulk PO generation.
13. **MarketCredit & Referral**: Reward ledgers and viral family referral tracking.
14. **B2BAccount & Invoices**: Mess, hostel, office bulk orders and monthly credit terms.

---

## 4. The 8 Core Computational Engines

1. **Intelligent Monthly Basket Generator**: Calculates exact staple needs (Rice, Lentils, Oil, Flour, Produce, Spices, Hygiene) based on household demographics and Bangladeshi nutritional habits.
2. **Budget Optimization & Smart Substitution**: Constrained optimization solving for customer budget limits by substituting non-essential or premium items with verified high-value equivalents.
3. **Dynamic Savings & Margin Protection Engine**: Real-time comparison with market prices and automated margin floors preventing loss-making sales.
4. **Salary-Cycle & Price Lock Scheduler**: Aligns ordering with employee salary dates (1st, 5th, 10th, etc.) and hedges 30-day commodity price locks.
5. **WMS Wave & Batch Picking Engine**: Groups 50-200 slot-bound orders to minimize warehouse travel time and maximize packing accuracy.
6. **Bulk Demand Forecasting & Procurement Aggregator**: Aggregates forward recurring subscription requirements into bulk supplier POs.
7. **Bangla NLP Market Builder & Meal-to-Market**: Converts colloquial Bengali voice/text prompts into shoppable monthly baskets.
8. **Consumption Prediction & Churn Prevention**: Proactively predicts household pantry stock-out dates and alerts customers before they run dry.

---

## 5. Master Step-by-Step Implementation Roadmap

* [x] **Phase 1: Monorepo Scaffolding, Tooling & Core Data Layer**
  * Step 1.1: Root Monorepo setup (`turbo.json`, `pnpm-workspace.yaml`, root `package.json`, tsconfigs). [COMPLETED]
  * Step 1.2: `packages/shared-types` with full domain models and DTOs. [COMPLETED]
  * Step 1.3: `packages/database` with Prisma schema, seed script (Dhaka zones & 150+ Bangladeshi grocery products). [COMPLETED]
  * Step 1.4: `packages/mock-adapters` (bKash Tokenized, Nagad, SSLCommerz, SMS OTP sandbox mocks). [COMPLETED]
* [x] **Phase 2: Core Computational Business Logic Packages**
  * Step 2.1: `packages/business-rules` — Monthly Basket Generator algorithm. [COMPLETED]
  * Step 2.2: Budget Optimizer & Smart Substitution solver. [COMPLETED]
  * Step 2.3: Savings Engine & Margin Protection validator. [COMPLETED]
* [x] **Phase 3: Backend API Service (`apps/api`)**
  * Step 3.1: NestJS setup with Prisma, Redis, BullMQ, Swagger. [COMPLETED]
  * Step 3.2: Auth module (Phone OTP verification, JWT tokens, RBAC guards). [COMPLETED]
  * Step 3.3: Household & Basket API endpoints. [COMPLETED]
  * Step 3.4: Product Catalog & Search endpoints. [COMPLETED]
  * Step 3.5: Order State Machine, Delivery Slots & Checkout API. [COMPLETED]
  * Step 3.6: Payment Gateway Integration (Mocks + Production Adapters). [COMPLETED]
  * Step 3.7: Subscription Engine & Salary-Cycle Billing Cron. [COMPLETED]
  * Step 3.8: WMS & Warehouse fulfillment endpoints. [COMPLETED]
  * Step 3.9: Supplier & Procurement PO module. [COMPLETED]
* [x] **Phase 4: Customer Web Application (`apps/web` - Mobile Responsive)**
  * Step 4.1: Next.js 15 App Router, Tailwind CSS, shadcn-inspired design system. [COMPLETED]
  * Step 4.2: High-converting Hero & Value Proposition with Bengali AI NLP input bar. [COMPLETED]
  * Step 4.3: Interactive Household Onboarding Wizard (Size, Diet, Cooking Freq, Budget, Tier). [COMPLETED]
  * Step 4.4: Recommended Basket with Live Quantity Editing & Twin Pricing (Market vs Masik). [COMPLETED]
  * Step 4.5: Smart Budget Optimization with automated product substitution. [COMPLETED]
  * Step 4.6: Dhaka Delivery Zone (Gulshan, Banani, Uttara, Dhanmondi, Mirpur, Savar) & Slot selection. [COMPLETED]
  * Step 4.7: 30-Day Price Lock guarantee toggle. [COMPLETED]
  * Step 4.8: Multi-gateway checkout (bKash 1-click tokenized, Nagad, Card, COD). [COMPLETED]
  * Step 4.9: Customer Lifetime Savings Dashboard & 1-Tap Repeat Market. [COMPLETED]
* [x] **Phase 5: Operations, WMS & Admin Portal (`apps/admin`)**
  * Step 5.1: Admin shell with Operations & WMS control dashboard. [COMPLETED]
  * Step 5.2: Executive Analytics KPI strip (GMV, orders, margins, churn, savings). [COMPLETED]
  * Step 5.3: WMS Wave Picking console for morning/evening delivery slot aggregation. [COMPLETED]
  * Step 5.4: Inventory, Batch Tracking & Stock Alerts (reorder thresholds). [COMPLETED]
  * Step 5.5: Procurement, Demand Aggregation & Supplier PO management. [COMPLETED]
  * Step 5.6: Salary-cycle subscription recurring execution console. [COMPLETED]
* [x] **Phase 6: Cross-Platform Mobile App (`apps/mobile` - iOS & Android)**
  * Step 6.1: React Native Expo (SDK 52+) project structure. [COMPLETED]
  * Step 6.2: Shared UI components & Theme matching Web. [COMPLETED]
  * Step 6.3: Mobile Basket Customizer with sticky bottom checkout bar. [COMPLETED]
  * Step 6.4: 1-Tap Reorder Banner & 30-Day Price Lock toggle. [COMPLETED]
  * Step 6.5: Savings History & Live Order Tracking tabs. [COMPLETED]
* [ ] **Phase 7: AI Suite, Loyalty & B2B Expansion**
  * Step 7.1: Gemini 2.5 Flash Bengali Natural Language Market Builder.
  * Step 7.2: Meal-to-Market 30-day recipe converter.
  * Step 7.3: Consumption prediction & automated missing-item detection.
  * Step 7.4: Market Credits loyalty program & Family referral engine.
  * Step 7.5: B2B corporate monthly grocery portal & invoicing.
* [ ] **Phase 8: End-to-End Validation, Security Hardening & Launch Readiness**
  * Step 8.1: Unit & integration test coverage.
  * Step 8.2: Concurrency & double-booking stress tests (k6).
  * Step 8.3: Security audit (Idempotency, payment webhooks, RBAC).
  * Step 8.4: Production deployment configurations.
