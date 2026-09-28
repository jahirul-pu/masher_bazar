# MASIK BAZAR

## Product Requirements Document (PRD)

**Product:** Masik Bazar
**Product Category:** Monthly Grocery Commerce / Subscription Commerce
**Primary Market:** Bangladesh
**Platform:** Web-first, mobile-responsive; PWA-ready
**Document Version:** 1.0
**Status:** Product Definition

---

# 1. Product Overview

## 1.1 Product Vision

**Masik Bazar** is a monthly grocery commerce platform designed around a simple proposition:

> **Customers should not have to shop for groceries every month. Masik Bazar should prepare, optimize, and deliver their monthly household market for them.**

Instead of operating like a conventional online grocery store where customers search for individual products, Masik Bazar will allow customers to:

* Generate a monthly grocery basket
* Set a household budget
* Customize recommended quantities
* Compare normal market price vs. Masik Bazar price
* Save money through bulk procurement
* Schedule monthly delivery
* Subscribe to recurring monthly baskets
* Track their historical spending and savings
* Receive intelligent reminders
* Eventually purchase Masik Bazar private-label products

The long-term goal is to create a **household grocery operating system**, rather than another generic grocery marketplace.

---

# 2. Core Value Proposition

## For Customers

### Primary promise

> **One month's groceries. One order. Better price.**

Customers receive:

* Convenience
* Predictable monthly spending
* Bulk-buying savings
* Personalized grocery recommendations
* Scheduled delivery
* Reordering automation
* Transparent pricing
* Household spending history

## For Masik Bazar

The business is built around:

**Demand aggregation → Bulk procurement → Lower procurement cost → Competitive pricing → Recurring orders → Predictable demand → Better procurement**

This creates a potential flywheel:

```text
More Customers
      ↓
More Monthly Orders
      ↓
Higher Procurement Volume
      ↓
Better Supplier Pricing
      ↓
Lower Customer Price
      ↓
Higher Customer Value
      ↓
Better Retention
      ↓
More Customers
```

---

# 3. Product Positioning

Masik Bazar should NOT position itself simply as:

> "An online grocery store."

Instead:

> **"Your monthly grocery system."**

### Brand concept

**Masik Bazar**

Possible positioning lines:

> **Your Monthly Market, Sorted.**

> **One Month's Market. One Order.**

> **Buy Your Month. Save More.**

> **You Don't Have to Shop. We Prepare Your Market.**

Potential Bengali consumer-facing positioning:

> **বাজার করতে হবে না। বাজার হয়ে যাবে।**

---

# 4. Target Customers

## 4.1 Primary Segment — Families

Households of:

* 2 people
* 3–4 people
* 5–6 people
* 7+ people

These customers are the core market.

---

## 4.2 Secondary Segment — Couples

Examples:

* Newly married couples
* Working couples
* Couples living independently

Their primary value proposition is convenience.

---

## 4.3 Bachelor Households

Specialized:

### Bachelor Monthly Market

Possible basket:

* Rice
* Lentils
* Oil
* Eggs
* Spices
* Instant foods
* Personal care
* Cleaning supplies

---

## 4.4 Mess / Hostel

Bulk recurring orders.

---

## 4.5 Small Offices

Potential products:

* Tea
* Coffee
* Sugar
* Biscuits
* Water
* Tissue
* Cleaning products
* Pantry supplies

---

# 5. Product Principles

The product should follow five principles.

## Principle 1 — Reduce Decisions

Customers should not need to manually select 30–50 products.

---

## Principle 2 — Show Savings Clearly

Every basket should communicate:

**Regular Market Price → Masik Bazar Price → Customer Savings**

---

## Principle 3 — Make Reordering Effortless

A customer should eventually be able to reorder an entire month's market in one tap.

---

## Principle 4 — Build Recurring Demand

The system should naturally encourage monthly repeat orders.

---

## Principle 5 — Optimize the Business Behind the UI

The customer experience should be powered by:

* Demand forecasting
* Procurement optimization
* Inventory management
* Margin management
* Supplier management
* Delivery optimization

---

# 6. Core Product Architecture

```text
                         MASIK BAZAR
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
      CUSTOMER             BUSINESS            OPERATIONS
          │                   │                   │
    Monthly Basket       Procurement          Inventory
    Custom Basket        Suppliers            Warehousing
    Subscription         Pricing              Delivery
    Family Profile       Margins              Fulfillment
    Savings              Forecasting           Returns
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                       DATA / ANALYTICS
                              │
                     Recommendation Engine
                              │
                     Demand Forecasting
```

---

# 7. Customer Journey

## First Visit

```text
Landing Page
     ↓
Choose Household Size
     ↓
Choose Budget
     ↓
Choose Market Type
     ↓
Generate Recommended Basket
     ↓
Customize
     ↓
View Savings
     ↓
Choose Delivery
     ↓
Checkout
     ↓
Order Confirmation
```

---

# 8. Homepage Requirements

The homepage should immediately communicate the concept.

## Hero Section

### Headline

> **Your Whole Month's Market. In One Order.**

Supporting text:

> Tell us about your household and budget. We'll build your monthly grocery basket and help you save.

Primary CTA:

**Build My Monthly Market**

Secondary CTA:

**Browse Products**

---

## Homepage Sections

### Section 1 — How It Works

1. Tell us about your family
2. Get your recommended market
3. Customize what you need
4. Get it delivered

---

### Section 2 — Monthly Packages

Examples:

**Small Family**

1–2 people

**Family**

3–4 people

**Large Family**

5–6 people

**Custom**

Build your own.

---

### Section 3 — Savings

Example:

```text
Regular Market       ৳6,430
Masik Bazar          ৳5,890

You Save             ৳540
```

---

### Section 4 — Build Your Own Market

Allow customers to browse categories and add products.

---

### Section 5 — Subscription

> **Why rebuild your basket every month?**

Enable:

**Repeat My Monthly Market Automatically**

---

### Section 6 — Private Label

Future section.

> **Masik Bazar Essentials**

---

# 9. Household Onboarding

The onboarding wizard collects information required to generate a recommended basket.

## Step 1 — Household Size

Options:

* 1 person
* 2 people
* 3–4 people
* 5–6 people
* 7–8 people
* 9+

---

## Step 2 — Household Composition

Optional:

* Adults
* Children
* Elderly people

---

## Step 3 — Cooking Frequency

Options:

* Almost every day
* 4–5 days/week
* 2–3 days/week
* Occasionally

---

## Step 4 — Food Preference

Options:

* Standard
* Rice-heavy
* Roti-heavy
* Mixed

Future:

* Vegetarian
* Special dietary requirements

---

## Step 5 — Household Budget

Options:

* Under ৳3,000
* ৳3,000–5,000
* ৳5,000–7,500
* ৳7,500–10,000
* ৳10,000+

Or custom amount.

---

## Step 6 — Market Type

### Basic

Essential products.

### Family

Balanced monthly household basket.

### Premium

Higher-end brands and broader product selection.

---

# 10. Monthly Basket Generator

The recommendation engine generates a proposed monthly basket.

## Example

### Family of 4

| Category  | Product     | Quantity |
| --------- | ----------- | -------: |
| Staples   | Rice        |    20 kg |
| Staples   | Lentils     |     3 kg |
| Cooking   | Soybean Oil |      5 L |
| Cooking   | Salt        |     2 kg |
| Grocery   | Sugar       |     2 kg |
| Grocery   | Flour       |     5 kg |
| Produce   | Potato      |     5 kg |
| Produce   | Onion       |     5 kg |
| Spices    | Turmeric    |    500 g |
| Spices    | Chili       |    500 g |
| Household | Detergent   |     2 kg |
| Household | Soap        |    4 pcs |
| Household | Tissue      |  4 packs |

The exact basket should be configurable by the business.

---

# 11. Budget Optimization Engine

One of the platform's major differentiators.

Customer enters:

> **My budget: ৳5,000**

The system attempts to construct the best basket within the budget.

Optimization priorities:

1. Essential products
2. Required quantity
3. Household size
4. Customer preferences
5. Product quality
6. Price
7. Brand preference
8. Current inventory
9. Procurement cost
10. Business margin

---

# 12. Budget Result

Example:

### Your Monthly Market

**Budget:** ৳5,000

**Recommended Basket:** ৳5,180

The system identifies:

> We can reduce ৳180 by switching 3 products to lower-priced equivalent alternatives.

Customer sees:

```text
Original Basket       ৳5,180
Optimized Basket      ৳5,000

Products optimized: 3
```

---

# 13. Smart Product Substitution

Products should have substitution relationships.

Example:

```text
Brand A Soybean Oil
        ↓
Brand B Soybean Oil
        ↓
Generic equivalent
```

Customer can specify:

### Brand Preference

* Brand doesn't matter
* Preferred brands
* Only selected brands

### Quality Preference

* Economy
* Standard
* Premium

---

# 14. Custom Basket

Customers can modify generated baskets.

Actions:

* Increase quantity
* Decrease quantity
* Remove product
* Add product
* Change brand
* Replace product
* Mark product as recurring
* Mark product as one-time

---

# 15. Basket Categories

Suggested taxonomy:

## Grocery Staples

* Rice
* Flour
* Atta
* Maida
* Lentils
* Pulses
* Sugar
* Salt

## Cooking

* Soybean oil
* Mustard oil
* Other cooking oils

## Spices

* Turmeric
* Chili
* Cumin
* Coriander
* Garam masala
* Other spices

## Produce

* Potato
* Onion
* Garlic
* Ginger

## Breakfast

* Cereal
* Bread
* Biscuits
* Jam
* Tea
* Coffee

## Household Cleaning

* Detergent
* Dishwashing liquid
* Floor cleaner
* Toilet cleaner
* Bleach

## Personal Care

* Soap
* Shampoo
* Toothpaste
* Toothbrush
* Tissue

## Baby

Future category.

## Pet

Future category.

---

# 16. Market Packages

Packages should be dynamic rather than permanently fixed.

## Example

### Small Family

Target:

1–2 people

---

### Family

Target:

3–4 people

---

### Large Family

Target:

5–6 people

---

### Custom

Customer-defined.

Packages should be configurable from the admin panel.

---

# 17. Savings Engine

Every basket should calculate:

### Regular Market Price

Estimated standard selling price.

### Masik Bazar Price

Platform selling price.

### Customer Savings

```text
Regular Price - Masik Bazar Price
```

---

# 18. Savings Dashboard

Each customer receives:

### My Savings

```text
Total Orders       8
Total Spent        ৳48,920
Total Saved        ৳4,180

Average Saving     8.5%
```

Monthly graph:

```text
April       ৳420 saved
May         ৳510 saved
June        ৳380 saved
July        ৳620 saved
```

---

# 19. Family Household Dashboard

Customer dashboard:

### This Month

**Market Status**

🟢 Ready to Order

### Estimated Basket

৳5,840

### Last Month

৳5,710

### Lifetime Savings

৳6,430

### Next Suggested Market

October 3

Actions:

* Build Market
* Reorder Last Market
* Edit Basket
* Manage Subscription

---

# 20. Repeat Market

At the end of every month:

> **Your October market is ready.**

Display:

### Same as September

**৳5,890**

Buttons:

**Order Same Market**

**Customize**

**Start From Scratch**

---

# 21. Intelligent Missing Product Detection

The platform analyzes historical purchases.

Example:

Customer normally buys:

* Rice
* Oil
* Lentils
* Salt
* Detergent

Current basket doesn't contain detergent.

System displays:

> **You usually buy detergent with your monthly market. Add it?**

Buttons:

**Add**

**Ignore**

---

# 22. Consumption Prediction

Future feature.

Based on order history:

> You usually consume 5L of oil every 29 days.

Before estimated depletion:

> **Your cooking oil may be running low.**

CTA:

**Add to Next Market**

This should remain optional and should not create unwanted purchases automatically unless the customer explicitly enables auto-ordering.

---

# 23. Subscription System

## Subscription Types

### Same Basket

Repeat the previous basket.

### Smart Basket

System regenerates the basket every month based on current prices and household needs.

### Custom Subscription

Customer defines recurring products.

---

# 24. Subscription Controls

Customers can:

* Pause
* Resume
* Skip a month
* Change delivery date
* Change quantity
* Change address
* Change payment method
* Cancel
* Edit basket

---

# 25. Salary-Cycle Scheduling

During onboarding:

> When do you usually receive your salary?

Options:

* 1st
* 5th
* 10th
* 15th
* 20th
* 25th
* Custom

The system can recommend:

> **Schedule your monthly market for the 3rd of every month.**

---

# 26. Price Lock

Optional premium feature.

Example:

> **Lock your monthly market price for 30 days.**

Customer pays or confirms the basket in advance.

The platform takes procurement responsibility for maintaining the promised price within defined rules.

Admin controls:

* Price lock duration
* Eligible products
* Eligible baskets
* Maximum price variance
* Minimum order value

---

# 27. Market Price Tracker

Product-level history:

```text
Soybean Oil

Previous Month       ৳850
Current Month        ৳820
Change               -৳30
```

Basket-level history:

```text
August       ৳6,120
September    ৳6,240
October      ৳6,080
```

Important:

Price changes must be based on actual internal pricing data rather than misleading comparisons.

---

# 28. Monthly Market Calendar

Customer sees:

```text
September
      ↓
Market Ordered
      ↓
Delivered
      ↓
October Market
      ↓
Recommended Order Date
```

---

# 29. Delivery System

## Delivery Options

### Standard Delivery

Scheduled delivery.

### Priority Delivery

Higher fee / membership benefit.

### Same-Day

Future feature depending on operational capability.

---

# 30. Delivery Slots

Example:

* 9 AM–12 PM
* 12 PM–3 PM
* 3 PM–6 PM
* 6 PM–9 PM

Delivery slots should be configurable by area and capacity.

---

# 31. Delivery Zones

Admin can define:

* Zone
* Delivery fee
* Minimum order
* Available days
* Available slots
* Maximum daily orders

Example:

```text
Zone: Savar
Delivery Fee: ৳60
Minimum Order: ৳1,500
```

---

# 32. Checkout

Checkout should show:

## Order Summary

Subtotal

Discount

Delivery

Additional charges

**Grand Total**

Then:

### Payment

* Cash on Delivery
* bKash
* Nagad
* Card
* Other supported gateway

---

# 33. Order Tracking

Statuses:

```text
Order Placed
      ↓
Confirmed
      ↓
Picking
      ↓
Packed
      ↓
Dispatched
      ↓
Out for Delivery
      ↓
Delivered
```

---

# 34. Procurement Management

This is a critical back-office module.

Admin should manage:

* Suppliers
* Supplier products
* Procurement price
* Minimum order quantity
* Lead time
* Supplier reliability
* Payment terms
* Product availability

---

# 35. Supplier Management

Supplier profile:

```text
Supplier Name
Contact
Categories
Products
Last Purchase
Average Price
Payment Terms
Lead Time
Reliability Score
```

The reliability score should be an internal operational metric, not necessarily shown publicly.

---

# 36. Procurement Dashboard

Admin sees:

### This Month's Forecast

Expected orders:

**1,250**

Expected demand:

* Rice: 18,500 kg
* Oil: 4,200 L
* Lentils: 2,800 kg

Recommended procurement:

**৳X**

This enables bulk negotiation before the orders are fulfilled.

---

# 37. Demand Forecasting

Forecasting should use:

* Historical sales
* Active subscriptions
* Pending orders
* Seasonal trends
* Household growth
* Product trends
* Promotions
* Stock levels

Future:

Machine-learning forecasting.

---

# 38. Inventory Management

Inventory fields:

* SKU
* Product
* Variant
* Batch
* Purchase price
* Selling price
* Stock
* Reserved stock
* Available stock
* Minimum stock
* Expiry date
* Warehouse location

---

# 39. Inventory Rules

System should identify:

### Low Stock

> Rice 25kg stock remaining.

### Overstock

> Product inventory exceeds expected 60-day demand.

### Expiring

> 250 units expire within 30 days.

---

# 40. Order Fulfillment

Warehouse workflow:

```text
Orders
 ↓
Batch Generation
 ↓
Picking List
 ↓
Picking
 ↓
Quality Check
 ↓
Packing
 ↓
Dispatch
```

---

# 41. Batch Picking

Instead of picking every order independently:

System can generate:

### Morning Picking Batch

100 orders

Required:

* Rice — 1,850 kg
* Oil — 420 L
* Lentils — 280 kg

This should improve warehouse efficiency.

---

# 42. Product Management

Admin can manage:

* Product name
* SKU
* Brand
* Category
* Unit
* Weight
* Images
* Description
* Purchase price
* Selling price
* MRP/reference price
* Tax
* Stock
* Subscription eligibility
* Recommended status
* Private-label status

---

# 43. Pricing Engine

Pricing should support:

```text
Procurement Cost
+
Operational Cost
+
Desired Margin
=
Base Selling Price
```

Additional rules:

* Package discount
* Subscription discount
* Volume discount
* Promotional discount
* Customer-specific pricing
* Zone-based delivery pricing

---

# 44. Margin Protection

The system must prevent accidental underpricing.

Example:

```text
Purchase Price:       ৳500
Operational Cost:     ৳30
Minimum Margin:       ৳50

Minimum Selling Price: ৳580
```

If admin enters ৳550:

> ⚠️ This price falls below the configured minimum margin.

Override requires explicit authorization.

---

# 45. Private Label

Phase 2/3.

Brand:

### Masik Bazar Essentials

Potential products:

* Rice
* Lentils
* Salt
* Sugar
* Spices
* Flour
* Oil
* Cleaning products

Benefits:

* Higher margin potential
* Better procurement control
* Brand differentiation
* Customer loyalty
* Better basket economics

---

# 46. Private Label Packaging

Packaging should communicate:

**Masik Bazar Essentials**

Example:

> Everyday Rice
> 5 kg

Minimal, clean, trustworthy packaging.

---

# 47. Loyalty System

Instead of excessive discounts, use **Market Credits**.

Customers earn credits through:

* Monthly orders
* Subscriptions
* Referrals
* Larger baskets
* Consistent ordering

Credits can unlock:

* Free delivery
* Priority slots
* Price lock
* Selected bonus products
* Subscription benefits

---

# 48. Referral System

Customer gets:

> **Refer a family. Both receive Market Credits.**

Referral dashboard:

```text
Friends Referred: 5
Successful Orders: 3
Credits Earned: 300
```

---

# 49. B2B Mode

Future module.

Business types:

* Office
* Restaurant
* Mess
* Hostel
* Small retailer

Features:

* Bulk basket
* Recurring orders
* Monthly invoice
* Multiple delivery locations
* Business account
* Purchase history
* Credit terms for approved customers

---

# 50. Admin Panel

Admin dashboard should provide:

## Overview

```text
Today's Orders
Monthly Orders
Monthly GMV
Revenue
Gross Margin
Active Subscribers
New Customers
Repeat Customers
Average Order Value
Total Savings Given
```

---

# 51. Operations Dashboard

Metrics:

* Orders pending
* Orders picking
* Orders packed
* Orders dispatched
* Failed deliveries
* Returns
* Delivery performance

---

# 52. Subscription Dashboard

Admin sees:

* Active subscriptions
* Paused subscriptions
* Cancelled subscriptions
* Renewal rate
* Churn
* Average subscription value
* Failed renewals
* Upcoming orders

---

# 53. Customer CRM

Customer profile:

```text
Name
Phone
Address
Household Size
Budget
Preferences
Orders
Subscriptions
Lifetime Spend
Lifetime Savings
Credits
Returns
Support History
```

---

# 54. Customer Segmentation

Automatically categorize customers:

### New

First order.

### Active

Recent monthly order.

### Loyal

Multiple consecutive monthly orders.

### At Risk

Previously active but missed expected order.

### Churned

No order for defined period.

---

# 55. Churn Prevention

If customer normally orders on the 3rd but hasn't ordered:

> **Your monthly market is waiting.**

Show:

**Last month's basket: ৳5,890**

CTA:

**Reorder**

---

# 56. Notifications

Channels:

* Website
* SMS
* Email
* WhatsApp where operationally appropriate
* Push notification in PWA/app

Notifications:

### Order

Order confirmation

### Delivery

Delivery reminder

### Subscription

Upcoming renewal

### Market

Monthly basket ready

### Savings

Monthly savings report

### Inventory

Subscription product unavailable

---

# 57. Search

Search should support:

* Product name
* Brand
* Category
* SKU
* Bengali/English product terms

Examples:

> rice
> চাল
> oil
> তেল

---

# 58. Product Detail Page

Product page:

* Product image
* Name
* Brand
* Size
* Price
* Reference/market price where appropriate
* Savings
* Availability
* Subscription eligibility
* Quantity selector
* Add to Market
* Add to Basket

---

# 59. “Add to My Market”

Every product should have:

> **Add to My Monthly Market**

rather than only:

> Add to Cart

This reinforces the brand concept.

---

# 60. Mobile UX

Mobile should be treated as the primary customer interface.

Important requirements:

* Large touch targets
* Fast basket editing
* Sticky basket summary
* Simple checkout
* Minimal typing
* Saved address
* Saved payment method
* One-tap reorder

---

# 61. Accessibility

Support:

* Bengali
* English
* Large text
* High contrast
* Screen-reader-friendly semantic structure
* Accessible form controls

---

# 62. Localization

Primary language:

**Bangla**

Secondary:

**English**

The system should support localized:

* Currency
* Units
* Addresses
* Phone numbers
* Payment methods
* Bengali product names

---

# 63. Core Database Entities

Suggested entities:

```text
User
CustomerProfile
Household
HouseholdMember
Address
Product
ProductVariant
Brand
Category
Supplier
SupplierProduct
Inventory
Warehouse
Price
Basket
BasketItem
Order
OrderItem
Subscription
SubscriptionItem
DeliveryZone
DeliverySlot
Payment
Coupon
MarketCredit
Referral
Notification
Review
Return
ProcurementOrder
PurchaseOrder
Shipment
```

---

# 64. Recommendation Engine

Initial version can be rules-based.

Example:

```text
Household Size = 4
Cooking Frequency = Daily
Budget = ৳6,000
Market Type = Family
```

System selects quantities using configurable rules.

Later evolve into:

```text
Rules
+
Purchase History
+
Consumption Data
+
Seasonality
+
Price
+
Inventory
+
Customer Preference
```

---

# 65. AI Layer

AI should initially assist rather than control critical pricing/procurement decisions.

Potential AI functions:

* Basket recommendations
* Natural-language shopping
* Product substitution suggestions
* Customer support
* Grocery list generation
* Meal-plan-to-basket conversion
* Spending analysis

Example:

Customer:

> “I have 5 people at home and want to keep this month's market under 7,000.”

System:

> “I've prepared a ৳6,840 basket for your household.”

---

# 66. Natural Language Market Builder

Future feature:

Customer types:

> “আমাদের বাসায় ৪ জন। মাসে প্রায় ৬ হাজার টাকার বাজার করি।”

System creates:

**Recommended Monthly Market — ৳5,870**

This could become a major differentiator.

---

# 67. Meal-to-Market Engine

Future feature.

Customer selects:

### Meal Plan

30 days

System estimates:

* Rice
* Oil
* Lentils
* Spices
* Flour
* Other ingredients

Then creates a grocery basket.

---

# 68. Price Intelligence

Admin should monitor:

* Supplier price
* Historical procurement price
* Current selling price
* Competitor reference prices where legally/operationally appropriate
* Margin

The platform should not make unsupported claims such as “cheapest in Bangladesh.”

---

# 69. Analytics

## Customer KPIs

* Customer acquisition
* Conversion rate
* First-to-second-order conversion
* Repeat rate
* Subscription adoption
* Churn
* Average order value
* Lifetime value

## Commerce KPIs

* GMV
* Revenue
* Gross margin
* Net margin
* Average basket size
* Average savings
* Product contribution margin

## Operations KPIs

* Fulfillment time
* Picking accuracy
* Delivery success
* Return rate
* Stockout rate
* Wastage

---

# 70. Key North Star Metric

Recommended:

## **Monthly Active Household Markets**

Definition:

> Number of households successfully completing a monthly market order within a given month.

Secondary:

* Monthly recurring customers
* Average monthly basket value
* Customer retention
* Gross margin per market

---

# 71. Business Model

Potential revenue sources:

## 1. Product Margin

Primary revenue source.

## 2. Subscription

Optional premium membership.

## 3. Delivery Fee

For customers below minimum thresholds.

## 4. Private Label

Higher-margin products.

## 5. B2B

Bulk recurring orders.

## 6. Supplier Partnerships

Potential future commercial arrangements, subject to transparent commercial terms.

---

# 72. Subscription Membership

Future premium tier:

### Masik Bazar Plus

Potential benefits:

* Free delivery
* Priority slots
* Price lock
* Exclusive products
* Better Market Credits
* Early access to deals

Avoid excessive discounting; benefits should primarily improve convenience and predictability.

---

# 73. MVP Scope

The first release should NOT include everything.

## MVP must include:

### Customer

* Registration/login
* Household onboarding
* Product catalog
* Monthly basket generator
* Custom basket
* Budget selection
* Checkout
* Payment
* Delivery scheduling
* Order tracking
* Reorder
* Customer dashboard

### Admin

* Product management
* Category management
* Pricing
* Inventory
* Orders
* Customers
* Delivery zones
* Basic analytics

---

# 74. Phase 2

Add:

* Subscriptions
* Smart basket
* Savings dashboard
* Market history
* Market Credits
* Referral
* Supplier management
* Procurement management
* Advanced inventory
* Customer segmentation

---

# 75. Phase 3

Add:

* Price Lock
* Demand forecasting
* Consumption prediction
* Smart substitution
* AI basket builder
* B2B
* Private label
* Meal planner
* Natural-language shopping

---

# 76. Phase 4

Potentially:

* Mobile app
* Advanced AI
* Personalized household models
* Automated procurement forecasting
* Dynamic supplier optimization
* Private-label expansion
* Regional expansion

---

# 77. Recommended Technical Architecture

## Frontend

Recommended:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

---

## Backend

Possible:

* NestJS
* PostgreSQL
* Redis
* Background job system

---

## Storage

* Object storage for product images
* CDN for media

---

## Payments

Integrate appropriate Bangladesh payment gateways supporting:

* bKash
* Nagad
* Cards
* COD workflows

---

## Infrastructure

Start simple.

```text
Frontend
   ↓
API
   ↓
PostgreSQL
   ↓
Redis / Jobs
   ↓
Payment / SMS / Delivery integrations
```

Avoid prematurely building a distributed architecture.

---

# 78. Security Requirements

Must include:

* HTTPS
* Password hashing
* Session/token security
* Role-based access control
* Admin audit logs
* Payment security
* Rate limiting
* Input validation
* Database backups
* Sensitive-data protection

Admin roles:

* Super Admin
* Operations
* Inventory
* Procurement
* Customer Support
* Finance
* Delivery Manager

---

# 79. Order State Machine

```text
DRAFT
 ↓
PLACED
 ↓
CONFIRMED
 ↓
PAYMENT_PENDING / PAID
 ↓
PICKING
 ↓
PACKED
 ↓
DISPATCHED
 ↓
OUT_FOR_DELIVERY
 ↓
DELIVERED
```

Alternative states:

```text
CANCELLED
FAILED
RETURN_REQUESTED
RETURNED
REFUNDED
```

---

# 80. Subscription State Machine

```text
ACTIVE
 ↓
UPCOMING
 ↓
RENEWAL_PENDING
 ↓
RENEWED
```

Alternative:

```text
PAUSED
SKIPPED
CANCELLED
PAYMENT_FAILED
```

---

# 81. Customer Experience Example

### Customer

4-person family.

Budget:

**৳6,000**

The platform generates:

```text
Regular Market      ৳6,430
Masik Bazar         ৳5,890
Savings             ৳540
```

Customer removes:

* Premium tea

Adds:

* 1kg extra lentils

New total:

**৳5,960**

Customer schedules:

**October 3 — 6 PM–9 PM**

Places order.

Next month:

> **Your November market is ready.**

System suggests:

**৳5,920**

Customer clicks:

> **Order Same Market**

That's the ideal long-term user experience.

---

# 82. Differentiation Strategy

Masik Bazar should differentiate itself through a combination of:

### 1. Monthly-first commerce

Not product-first commerce.

### 2. Personalized basket generation

Customer doesn't need to know what to buy.

### 3. Budget optimization

Customer tells the platform what they can spend.

### 4. Bulk procurement

Lower costs through aggregated demand.

### 5. Subscription

Predictable recurring purchasing.

### 6. Savings transparency

Customer sees exactly what they saved.

### 7. Household intelligence

The platform learns the customer's recurring needs.

### 8. Private label

Long-term margin and differentiation.

---

# 83. What Masik Bazar Should Avoid

## Do not become another generic grocery marketplace.

Avoid trying to compete on:

* Thousands of SKUs
* Endless flash sales
* Random discounts
* Every possible grocery product
* Ultra-fast delivery as the primary proposition

The product's core identity should remain:

> **Monthly household procurement.**

---

# 84. Launch Strategy

Start with a limited geographic area.

Example:

### Phase 1

One city/region.

Limited delivery zones.

Limited SKU count.

Focus on:

* Staple groceries
* Cooking essentials
* Household essentials

---

# 85. Initial Product Assortment

Instead of thousands of products, start with perhaps:

### 100–300 high-frequency SKUs.

Focus on products that are:

* Frequently purchased
* Shelf-stable
* Easy to store
* Easy to transport
* Predictable in demand
* Suitable for bulk procurement

Fresh produce and highly perishable products can be introduced carefully later.

---

# 86. Launch Packages

Potential launch products:

### Essential Market

Budget-oriented.

### Family Market

Mainstream household.

### Premium Market

Higher-quality brands.

### Build Your Market

Fully customizable.

---

# 87. Marketing Concepts

## Campaign 1

> **“এই মাসের বাজার হয়ে গেছে?”**

Then:

> **“না হলে মাসিক বাজার করুন।”**

---

## Campaign 2

> **“বাজারের চিন্তা মাসে একবার।”**

---

## Campaign 3

> **“এক মাসের বাজার। একবারেই।”**

---

## Campaign 4

Show comparison:

```text
আপনার বাজার
৳6,420

মাসিক বাজার
৳5,890

সাশ্রয়
৳530
```

---

# 88. Customer Retention Loop

```text
Order
 ↓
Delivery
 ↓
Savings Report
 ↓
Consumption Prediction
 ↓
Next Market Recommendation
 ↓
One-Tap Reorder
 ↓
Subscription
 ↓
Market Credits
 ↓
Higher Retention
```

---

# 89. Long-Term Vision

Masik Bazar can eventually evolve from:

### Phase 1

Online monthly grocery store

↓

### Phase 2

Monthly grocery subscription

↓

### Phase 3

Personalized household procurement platform

↓

### Phase 4

Private-label consumer brand

↓

### Phase 5

Household commerce ecosystem

The ultimate concept:

> **Masik Bazar knows what your household needs, how much it needs, when it needs it, and what price makes sense—then handles the procurement for you.**

---

# 90. Final Product Definition

## Masik Bazar is:

**A personalized, budget-aware, subscription-driven monthly household grocery platform powered by bulk procurement and intelligent basket recommendations.**

It is **not merely an e-commerce website**.

The core product is:

> **The Monthly Market.**

Everything else—recommendations, subscriptions, savings, procurement, price tracking, private labels, loyalty, forecasting and AI—exists to make that product increasingly effortless and economically powerful.

---

# 91. MVP Success Criteria

The MVP should prove five hypotheses:

### Hypothesis 1

Customers are willing to purchase most of their monthly grocery needs in one order.

### Hypothesis 2

Customers value a pre-built basket instead of manually shopping.

### Hypothesis 3

Bulk procurement can create enough savings to make the proposition attractive while maintaining viable margins.

### Hypothesis 4

Customers will repeat the same monthly purchase.

### Hypothesis 5

Customers will eventually trust Masik Bazar to prepare their monthly market automatically.

If these five hypotheses are validated, the platform has the foundation to become a recurring-commerce business rather than a conventional grocery store.

---

# 92. The Core Product Loop

```text
        CUSTOMER
           │
           ▼
    Household Profile
           │
           ▼
     Monthly Basket
           │
           ▼
    Budget Optimization
           │
           ▼
        Checkout
           │
           ▼
       DELIVERY
           │
           ▼
    PURCHASE HISTORY
           │
           ▼
     SMARTER BASKET
           │
           ▼
     MONTHLY REORDER
           │
           ▼
      SUBSCRIPTION
           │
           ▼
   PREDICTABLE DEMAND
           │
           ▼
   BULK PROCUREMENT
           │
           ▼
     LOWER COST
           │
           ▼
     BETTER PRICING
           │
           └──────────────► CUSTOMER
```

## Product North Star

> **Make monthly grocery shopping disappear as a task.**
