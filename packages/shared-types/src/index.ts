// ==========================================
// 1. User & Roles & Authentication
// ==========================================

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATIONS = 'OPERATIONS',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  PROCUREMENT_MANAGER = 'PROCUREMENT_MANAGER',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  DELIVERY_RIDER = 'DELIVERY_RIDER',
}

export enum CustomerSegment {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  LOYAL = 'LOYAL',
  AT_RISK = 'AT_RISK',
  CHURNED = 'CHURNED',
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  loyaltyCredits: number;
  referralCode: string;
  referredById?: string;
  lifetimeSpend: number;
  lifetimeSavings: number;
  segment: CustomerSegment;
  salaryPayday?: number; // 1 - 31
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // 'Home', 'Office', etc.
  addressLine: string;
  areaZoneId: string;
  thana: string;
  district: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

// ==========================================
// 2. Household & Demographics
// ==========================================

export enum CookingFrequency {
  ALMOST_EVERY_DAY = 'ALMOST_EVERY_DAY',
  FOUR_TO_FIVE_DAYS = 'FOUR_TO_FIVE_DAYS',
  TWO_TO_THREE_DAYS = 'TWO_TO_THREE_DAYS',
  OCCASIONALLY = 'OCCASIONALLY',
}

export enum FoodPreference {
  STANDARD = 'STANDARD',
  RICE_HEAVY = 'RICE_HEAVY',
  ROTI_HEAVY = 'ROTI_HEAVY',
  MIXED = 'MIXED',
}

export enum MarketTier {
  BASIC = 'BASIC',
  FAMILY = 'FAMILY',
  PREMIUM = 'PREMIUM',
}

export interface Household {
  id: string;
  customerId: string;
  householdName: string;
  householdSize: number;
  adultCount: number;
  childCount: number;
  elderlyCount: number;
  cookingFrequency: CookingFrequency;
  foodPreference: FoodPreference;
  defaultMonthlyBudget: number; // in BDT
  marketTier: MarketTier;
  defaultAddressId?: string;
  createdAt: string;
}

// ==========================================
// 3. Products, Catalog & Substitution
// ==========================================

export enum ProductCategorySlug {
  STAPLES = 'staples',
  COOKING = 'cooking',
  SPICES = 'spices',
  PRODUCE = 'produce',
  BREAKFAST = 'breakfast',
  CLEANING = 'cleaning',
  PERSONAL_CARE = 'personal_care',
  BABY = 'baby',
  PET = 'pet',
  MASIK_ESSENTIALS = 'masik_essentials',
}

export interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  icon?: string;
  displayOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  isPrivateLabel: boolean; // e.g. Masik Bazar Essentials
  logoUrl?: string;
}

export enum ProductUnit {
  KG = 'KG',
  GRAM = 'GRAM',
  LITER = 'LITER',
  ML = 'ML',
  PCS = 'PCS',
  PACK = 'PACK',
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode?: string;
  nameEn: string;
  nameBn: string;
  unit: ProductUnit;
  unitValue: number; // e.g. 5 for 5KG
  mrp: number; // Reference market price
  masikPrice: number; // Selling price
  purchaseCost: number; // For margin protection
  minMarginPercent: number; // Default 8-12%
  isSubscriptionEligible: boolean;
  isPrivateLabel: boolean;
  images: string[];
  stockAvailable: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  categoryId: string;
  brandId: string;
  descriptionEn?: string;
  descriptionBn?: string;
  category?: Category;
  brand?: Brand;
  variants: ProductVariant[];
}

export enum SubstitutionType {
  DIRECT_EQUIVALENT = 'DIRECT_EQUIVALENT',
  ECONOMY_SAVER = 'ECONOMY_SAVER',
  PREMIUM_UPGRADE = 'PREMIUM_UPGRADE',
}

export interface ProductSubstitution {
  id: string;
  primaryVariantId: string;
  substituteVariantId: string;
  type: SubstitutionType;
  priceDelta: number; // Negative = saves money, Positive = extra cost
  substituteVariant?: ProductVariant;
}

// ==========================================
// 4. Baskets & Optimization
// ==========================================

export enum BasketType {
  RECOMMENDED = 'RECOMMENDED',
  CUSTOM = 'CUSTOM',
  SUBSCRIPTION_DRAFT = 'SUBSCRIPTION_DRAFT',
  REORDER = 'REORDER',
}

export interface BasketItem {
  id?: string;
  variantId: string;
  quantity: number;
  isRecurring: boolean; // Monthly staple vs one-off purchase
  unitMasikPrice: number;
  unitMrp: number;
  variant?: ProductVariant;
}

export interface Basket {
  id: string;
  householdId: string;
  basketType: BasketType;
  items: BasketItem[];
  totalMasikPrice: number;
  totalMarketPrice: number;
  totalSavings: number;
  savingsPercentage: number;
  isBudgetOptimized: boolean;
  optimizedItemsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. Subscription & Price Lock
// ==========================================

export enum SubscriptionType {
  SAME_BASKET = 'SAME_BASKET',
  SMART_BASKET = 'SMART_BASKET',
  CUSTOM = 'CUSTOM',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export interface Subscription {
  id: string;
  householdId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  deliveryDayOfMonth: number; // 1-31
  deliverySlotId: string;
  addressId: string;
  paymentMethodToken?: string;
  priceLockActiveUntil?: string;
  nextBillingDate: string;
  items: BasketItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceLockContract {
  id: string;
  subscriptionId: string;
  householdId: string;
  lockedTotalAmount: number;
  lockedUntilDate: string;
  itemSnapshot: BasketItem[];
  isActive: boolean;
}

// ==========================================
// 6. Orders, Delivery & State Machine
// ==========================================

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAID = 'PAID',
  PICKING = 'PICKING',
  PACKED = 'PACKED',
  DISPATCHED = 'DISPATCHED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  COD = 'COD',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  CARD_SSLCOMMERZ = 'CARD_SSLCOMMERZ',
  MARKET_CREDITS = 'MARKET_CREDITS',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface DeliveryZone {
  id: string;
  name: string; // Gulshan, Banani, Uttara, Dhanmondi, Mirpur, Savar
  baseDeliveryFee: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface DeliverySlot {
  id: string;
  zoneId: string;
  title: string; // e.g. "9 AM – 12 PM"
  startTime: string;
  endTime: string;
  maxOrdersPerDay: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productNameEn: string;
  productNameBn: string;
  quantity: number;
  unitPrice: number;
  referenceMrp: number;
  totalPrice: number;
  totalSavings: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MB-2026-10042
  householdId: string;
  addressId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  creditsUsed: number;
  grandTotal: number;
  totalSavings: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliverySlotId: string;
  deliveryDate: string;
  priceLocked: boolean;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. WMS, Inventory & Procurement
// ==========================================

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface InventoryBatch {
  id: string;
  warehouseId: string;
  variantId: string;
  batchNumber: string;
  mfgDate?: string;
  expiryDate?: string;
  purchaseCost: number;
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
  locationBin: string; // e.g. "A1-B3-S2"
}

export enum PickingBatchStatus {
  GENERATED = 'GENERATED',
  PICKING = 'PICKING',
  PICKED = 'PICKED',
  PACKED = 'PACKED',
}

export interface PickingBatch {
  id: string;
  batchCode: string;
  warehouseId: string;
  deliverySlotId: string;
  deliveryDate: string;
  orderIds: string[];
  status: PickingBatchStatus;
  assignedPickerId?: string;
  aggregatedItems: {
    variantId: string;
    productNameEn: string;
    totalRequiredQty: number;
    pickedQty: number;
    locationBin: string;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  leadTimeDays: number;
  paymentTerms: string;
  reliabilityScore: number; // 0 - 100
  isActive: boolean;
}

export enum POStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  warehouseId: string;
  status: POStatus;
  totalCost: number;
  expectedDeliveryDate: string;
  items: {
    variantId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
  createdAt: string;
}

// ==========================================
// 8. Loyalty, Referrals & B2B
// ==========================================

export enum CreditTransactionType {
  ORDER_CASHBACK = 'ORDER_CASHBACK',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  ORDER_REDEMPTION = 'ORDER_REDEMPTION',
}

export interface MarketCreditLedger {
  id: string;
  customerId: string;
  amount: number;
  balanceAfter: number;
  type: CreditTransactionType;
  referenceId?: string; // Order ID or Referral ID
  note?: string;
  createdAt: string;
}

export interface B2BAccount {
  id: string;
  companyName: string;
  binNumber: string;
  contactPerson: string;
  contactPhone: string;
  creditLimit: number;
  currentCreditUsed: number;
  paymentCycleDays: number;
  isActive: boolean;
}

// ==========================================
// 9. AI & Bengali NLP
// ==========================================

export interface NlpMarketRequest {
  rawPrompt: string; // e.g. "আমাদের বাসায় ৪ জন। মাসে ৫ হাজার টাকার বাজার করি।"
  householdId?: string;
}

export interface NlpMarketResponse {
  interpretedHouseholdSize: number;
  interpretedBudget: number;
  interpretedPreference: FoodPreference;
  interpretedTier: MarketTier;
  recommendedBasket: Basket;
  summaryExplanationBn: string;
}
