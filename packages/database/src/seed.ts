import { PrismaClient, UserRole, MarketTier, ProductUnit, SubstitutionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Masher Bazar Enterprise Database Seed...');

  // 1. Delivery Zones & Slots for Dhaka Metropolitan
  console.log('📍 Seeding Dhaka Delivery Zones & Slots...');
  const dhakaZones = [
    { name: 'Gulshan', minOrder: 1500, fee: 60 },
    { name: 'Banani', minOrder: 1500, fee: 60 },
    { name: 'Uttara', minOrder: 1500, fee: 50 },
    { name: 'Dhanmondi', minOrder: 1500, fee: 60 },
    { name: 'Mirpur', minOrder: 1200, fee: 40 },
    { name: 'Savar', minOrder: 1500, fee: 60 },
  ];

  const slotConfigs = [
    { title: 'Morning Slot (9 AM – 12 PM)', start: '09:00', end: '12:00', cap: 150 },
    { title: 'Afternoon Slot (12 PM – 3 PM)', start: '12:00', end: '15:00', cap: 100 },
    { title: 'Evening Slot (3 PM – 6 PM)', start: '15:00', end: '18:00', cap: 150 },
    { title: 'Night Slot (6 PM – 9 PM)', start: '18:00', end: '21:00', cap: 200 },
  ];

  for (const z of dhakaZones) {
    const zone = await prisma.deliveryZone.upsert({
      where: { name: z.name },
      update: { baseDeliveryFee: z.fee, minOrderAmount: z.minOrder },
      create: { name: z.name, baseDeliveryFee: z.fee, minOrderAmount: z.minOrder },
    });

    for (const s of slotConfigs) {
      const existingSlot = await prisma.deliverySlot.findFirst({
        where: { zoneId: zone.id, title: s.title },
      });
      if (!existingSlot) {
        await prisma.deliverySlot.create({
          data: {
            zoneId: zone.id,
            title: s.title,
            startTime: s.start,
            endTime: s.end,
            maxOrdersPerDay: s.cap,
          },
        });
      }
    }
  }

  // 2. Central Warehouse
  console.log('🏬 Seeding Central Fulfillment Hub...');
  const warehouse = await prisma.warehouse.upsert({
    where: { id: 'wh-dhaka-central' },
    update: {},
    create: {
      id: 'wh-dhaka-central',
      name: 'Dhaka Central Hub (Mirpur)',
      location: 'Section 12, Mirpur, Dhaka',
    },
  });

  // 3. Brands
  console.log('🏷️ Seeding Brands...');
  const brandsData = [
    { name: 'Masher Bazar Essentials', isPrivate: true },
    { name: 'Teer', isPrivate: false },
    { name: 'Rupchanda', isPrivate: false },
    { name: 'Chashi', isPrivate: false },
    { name: 'Radhuni', isPrivate: false },
    { name: 'Bashundhara', isPrivate: false },
    { name: 'ACI Pure', isPrivate: false },
    { name: 'Fresh', isPrivate: false },
    { name: 'Unilever Bangladesh', isPrivate: false },
    { name: 'Square Toiletries', isPrivate: false },
  ];

  const brandMap: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { name: b.name },
      update: { isPrivateLabel: b.isPrivate },
      create: { name: b.name, isPrivateLabel: b.isPrivate },
    });
    brandMap[b.name] = brand.id;
  }

  // 4. Categories
  console.log('📂 Seeding Categories...');
  const categoriesData = [
    { slug: 'staples_rice', nameEn: 'Rice (চাল)', nameBn: 'চাল', order: 1 },
    { slug: 'staples_lentils', nameEn: 'Lentils & Pulses (ডাল)', nameBn: 'ডাল', order: 2 },
    { slug: 'cooking_oil', nameEn: 'Edible Oil (ভোজ্য তেল)', nameBn: 'তেল', order: 3 },
    { slug: 'staples_flour', nameEn: 'Atta & Flour (আটা ও ময়দা)', nameBn: 'আটা ও ময়দা', order: 4 },
    { slug: 'spices', nameEn: 'Spices & Seasoning (মসলা)', nameBn: 'মসলা', order: 5 },
    { slug: 'cooking_salt', nameEn: 'Salt & Sugar (লবণ ও চিনি)', nameBn: 'লবণ ও চিনি', order: 6 },
    { slug: 'grocery_sugar', nameEn: 'Sugar (চিনি)', nameBn: 'চিনি', order: 7 },
    { slug: 'produce_potato', nameEn: 'Potatoes (আলু)', nameBn: 'আলু', order: 8 },
    { slug: 'produce_onion', nameEn: 'Onions & Garlic (পেঁয়াজ ও রসুন)', nameBn: 'পেঁয়াজ ও রসুন', order: 9 },
    { slug: 'cleaning_detergent', nameEn: 'Laundry & Detergents (ডিটারজেন্ট)', nameBn: 'ডিটারজেন্ট', order: 10 },
    { slug: 'cleaning_soap', nameEn: 'Soaps & Hygiene (সাবান)', nameBn: 'সাবান', order: 11 },
    { slug: 'household_tissue', nameEn: 'Tissue & Paper (টিস্যু)', nameBn: 'টিস্যু', order: 12 },
  ];

  const categoryMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameBn: c.nameBn, displayOrder: c.order },
      create: { slug: c.slug, nameEn: c.nameEn, nameBn: c.nameBn, displayOrder: c.order },
    });
    categoryMap[c.slug] = cat.id;
  }

  // 5. Products & Product Variants
  console.log('📦 Seeding Products & Variants with Savings & Margins...');

  interface ProductSeed {
    slug: string;
    nameEn: string;
    nameBn: string;
    categorySlug: string;
    brandName: string;
    variants: {
      sku: string;
      nameEn: string;
      nameBn: string;
      unit: ProductUnit;
      unitVal: number;
      mrp: number;
      masikPrice: number;
      purchaseCost: number;
      isPrivate?: boolean;
    }[];
  }

  const productsToSeed: ProductSeed[] = [
    // Rice
    {
      slug: 'miniket-rice',
      nameEn: 'Premium Miniket Rice',
      nameBn: 'প্রিমিয়াম মিনিকেট চাল',
      categorySlug: 'staples_rice',
      brandName: 'Chashi',
      variants: [
        { sku: 'RICE-MINI-CHASHI-25K', nameEn: 'Chashi Miniket Rice 25kg', nameBn: 'চাষী মিনিকেট চাল ২৫ কেজি', unit: ProductUnit.KG, unitVal: 25, mrp: 2150, masikPrice: 1980, purchaseCost: 1820 },
        { sku: 'RICE-MINI-CHASHI-10K', nameEn: 'Chashi Miniket Rice 10kg', nameBn: 'চাষী মিনিকেট চাল ১০ কেজি', unit: ProductUnit.KG, unitVal: 10, mrp: 880, masikPrice: 810, purchaseCost: 745 },
      ],
    },
    {
      slug: 'masik-everyday-miniket',
      nameEn: 'Masher Essentials Everyday Miniket Rice',
      nameBn: 'মাসের বাজার এসেনশিয়ালস মিনিকেট চাল',
      categorySlug: 'staples_rice',
      brandName: 'Masher Bazar Essentials',
      variants: [
        { sku: 'RICE-MINI-MB-25K', nameEn: 'Masher Essentials Miniket Rice 25kg', nameBn: 'মাসের বাজার এসেনশিয়ালস মিনিকেট চাল ২৫ কেজি', unit: ProductUnit.KG, unitVal: 25, mrp: 2100, masikPrice: 1890, purchaseCost: 1720, isPrivate: true },
      ],
    },
    {
      slug: 'nazirshail-rice',
      nameEn: 'Select Nazirshail Rice',
      nameBn: 'সিলেক্ট নাজিরশাইল চাল',
      categorySlug: 'staples_rice',
      brandName: 'Teer',
      variants: [
        { sku: 'RICE-NAZIR-TEER-25K', nameEn: 'Teer Premium Nazirshail 25kg', nameBn: 'তীর প্রিমিয়াম নাজিরশাইল ২৫ কেজি', unit: ProductUnit.KG, unitVal: 25, mrp: 2350, masikPrice: 2160, purchaseCost: 1990 },
      ],
    },

    // Soybean Oil
    {
      slug: 'rupchanda-soybean-oil',
      nameEn: 'Rupchanda Fortified Soybean Oil',
      nameBn: 'রূপচাঁদা সয়াবিন তেল',
      categorySlug: 'cooking_oil',
      brandName: 'Rupchanda',
      variants: [
        { sku: 'OIL-SOYA-RUP-5L', nameEn: 'Rupchanda Soybean Oil 5 Liter', nameBn: 'রূপচাঁদা সয়াবিন তেল ৫ লিটার', unit: ProductUnit.LITER, unitVal: 5, mrp: 860, masikPrice: 815, purchaseCost: 760 },
        { sku: 'OIL-SOYA-RUP-2L', nameEn: 'Rupchanda Soybean Oil 2 Liter', nameBn: 'রূপচাঁদা সয়াবিন তেল ২ লিটার', unit: ProductUnit.LITER, unitVal: 2, mrp: 350, masikPrice: 332, purchaseCost: 310 },
      ],
    },
    {
      slug: 'teer-soybean-oil',
      nameEn: 'Teer Pure Soybean Oil',
      nameBn: 'তীর পিওর সয়াবিন তেল',
      categorySlug: 'cooking_oil',
      brandName: 'Teer',
      variants: [
        { sku: 'OIL-SOYA-TEER-5L', nameEn: 'Teer Soybean Oil 5 Liter', nameBn: 'তীর সয়াবিন তেল ৫ লিটার', unit: ProductUnit.LITER, unitVal: 5, mrp: 850, masikPrice: 795, purchaseCost: 740 },
      ],
    },
    {
      slug: 'masik-pure-soybean-oil',
      nameEn: 'Masher Essentials Fortified Soybean Oil',
      nameBn: 'মাসের বাজার এসেনশিয়ালস সয়াবিন তেল',
      categorySlug: 'cooking_oil',
      brandName: 'Masher Bazar Essentials',
      variants: [
        { sku: 'OIL-SOYA-MB-5L', nameEn: 'Masher Essentials Soybean Oil 5 Liter', nameBn: 'মাসের বাজার এসেনশিয়ালস সয়াবিন তেল ৫ লিটার', unit: ProductUnit.LITER, unitVal: 5, mrp: 850, masikPrice: 775, purchaseCost: 715, isPrivate: true },
      ],
    },

    // Lentils
    {
      slug: 'desi-masoor-dal',
      nameEn: 'Desi Red Lentils (Masoor Dal)',
      nameBn: 'দেশি মসুর ডাল',
      categorySlug: 'staples_lentils',
      brandName: 'ACI Pure',
      variants: [
        { sku: 'DAL-MASOOR-ACI-2K', nameEn: 'ACI Pure Desi Masoor Dal 2kg', nameBn: 'এসিআই পিওর দেশি মসুর ডাল ২ কেজি', unit: ProductUnit.KG, unitVal: 2, mrp: 340, masikPrice: 310, purchaseCost: 285 },
      ],
    },
    {
      slug: 'masik-desi-masoor-dal',
      nameEn: 'Masher Essentials Red Lentils',
      nameBn: 'মাসের বাজার এসেনশিয়ালস দেশি মসুর ডাল',
      categorySlug: 'staples_lentils',
      brandName: 'Masher Bazar Essentials',
      variants: [
        { sku: 'DAL-MASOOR-MB-2K', nameEn: 'Masher Essentials Desi Masoor Dal 2kg', nameBn: 'মাসের বাজার এসেনশিয়ালস দেশি মসুর ডাল ২ কেজি', unit: ProductUnit.KG, unitVal: 2, mrp: 330, masikPrice: 290, purchaseCost: 260, isPrivate: true },
      ],
    },

    // Flour / Atta
    {
      slug: 'fresh-atta',
      nameEn: 'Fresh Whole Wheat Atta',
      nameBn: 'ফ্রেশ হোল হুইট আটা',
      categorySlug: 'staples_flour',
      brandName: 'Fresh',
      variants: [
        { sku: 'FLOUR-ATTA-FRESH-5K', nameEn: 'Fresh Whole Wheat Atta 5kg', nameBn: 'ফ্রেশ লাল আটা ৫ কেজি', unit: ProductUnit.KG, unitVal: 5, mrp: 325, masikPrice: 295, purchaseCost: 270 },
      ],
    },
    {
      slug: 'masik-flour-atta',
      nameEn: 'Masher Essentials Premium Atta',
      nameBn: 'মাসের বাজার এসেনশিয়ালস প্রিমিয়াম আটা',
      categorySlug: 'staples_flour',
      brandName: 'Masher Bazar Essentials',
      variants: [
        { sku: 'FLOUR-ATTA-MB-5K', nameEn: 'Masher Essentials Premium Atta 5kg', nameBn: 'মাসের বাজার এসেনশিয়ালস আটা ৫ কেজি', unit: ProductUnit.KG, unitVal: 5, mrp: 320, masikPrice: 280, purchaseCost: 250, isPrivate: true },
      ],
    },

    // Spices & Salt & Sugar
    {
      slug: 'pure-vacuum-salt',
      nameEn: 'ACI Pure Vacuum Salt',
      nameBn: 'এসিআই পিওর লবণ',
      categorySlug: 'cooking_salt',
      brandName: 'ACI Pure',
      variants: [
        { sku: 'SALT-ACI-1K', nameEn: 'ACI Pure Salt 1kg', nameBn: 'এসিআই পিওর লবণ ১ কেজি', unit: ProductUnit.KG, unitVal: 1, mrp: 42, masikPrice: 38, purchaseCost: 32 },
      ],
    },
    {
      slug: 'white-refined-sugar',
      nameEn: 'Fresh Refined White Sugar',
      nameBn: 'ফ্রেশ চিনি',
      categorySlug: 'grocery_sugar',
      brandName: 'Fresh',
      variants: [
        { sku: 'SUGAR-FRESH-2K', nameEn: 'Fresh Refined Sugar 2kg', nameBn: 'ফ্রেশ চিনি ২ কেজি', unit: ProductUnit.KG, unitVal: 2, mrp: 310, masikPrice: 288, purchaseCost: 265 },
      ],
    },
    {
      slug: 'radhuni-turmeric-powder',
      nameEn: 'Radhuni Turmeric Powder',
      nameBn: 'রাঁধুনী হলুদ গুঁড়া',
      categorySlug: 'spices',
      brandName: 'Radhuni',
      variants: [
        { sku: 'SPICE-TURM-RAD-500G', nameEn: 'Radhuni Turmeric 500g', nameBn: 'রাঁধুনী হলুদ ৫০০ গ্রাম', unit: ProductUnit.GRAM, unitVal: 500, mrp: 280, masikPrice: 260, purchaseCost: 235 },
      ],
    },
    {
      slug: 'radhuni-chili-powder',
      nameEn: 'Radhuni Chili Powder',
      nameBn: 'রাঁধুনী মরিচ গুঁড়া',
      categorySlug: 'spices',
      brandName: 'Radhuni',
      variants: [
        { sku: 'SPICE-CHILI-RAD-500G', nameEn: 'Radhuni Chili Powder 500g', nameBn: 'রাঁধুনী মরিচ ৫০০ গ্রাম', unit: ProductUnit.GRAM, unitVal: 500, mrp: 360, masikPrice: 335, purchaseCost: 300 },
      ],
    },

    // Produce
    {
      slug: 'munshiganj-fresh-potato',
      nameEn: 'Munshiganj Diamond Potato',
      nameBn: 'মুন্সীগঞ্জ ডায়মন্ড আলু',
      categorySlug: 'produce_potato',
      brandName: 'Masher Bazar Essentials',
      variants: [
        { sku: 'PROD-POTATO-5K', nameEn: 'Fresh Potato 5kg Bag', nameBn: 'তাজা আলু ৫ কেজি ব্যাগ', unit: ProductUnit.KG, unitVal: 5, mrp: 260, masikPrice: 230, purchaseCost: 200, isPrivate: true },
      ],
    },
    {
      slug: 'pabna-desi-onion',
      nameEn: 'Pabna Desi Onion',
      nameBn: 'পাবনার দেশি পেঁয়াজ',
      categorySlug: 'produce_onion',
      brandName: 'Masher Bazar Essentials',
      variants: [
        { sku: 'PROD-ONION-5K', nameEn: 'Pabna Desi Onion 5kg Bag', nameBn: 'পাবনা দেশি পেঁয়াজ ৫ কেজি ব্যাগ', unit: ProductUnit.KG, unitVal: 5, mrp: 450, masikPrice: 395, purchaseCost: 350, isPrivate: true },
      ],
    },

    // Cleaning & Hygiene
    {
      slug: 'wheel-washing-powder',
      nameEn: 'Wheel 2in1 Washing Powder',
      nameBn: 'হুইল ডিটারজেন্ট পাউডার',
      categorySlug: 'cleaning_detergent',
      brandName: 'Unilever Bangladesh',
      variants: [
        { sku: 'DET-WHEEL-2K', nameEn: 'Wheel 2in1 Detergent 2kg', nameBn: 'হুইল ডিটারজেন্ট ২ কেজি', unit: ProductUnit.KG, unitVal: 2, mrp: 360, masikPrice: 330, purchaseCost: 300 },
      ],
    },
    {
      slug: 'lifebuoy-total-soap',
      nameEn: 'Lifebuoy Total Soap Bar (Pack of 4)',
      nameBn: 'লাইফবয় টোটাল সাবান ৪টি প্যাক',
      categorySlug: 'cleaning_soap',
      brandName: 'Unilever Bangladesh',
      variants: [
        { sku: 'SOAP-LIFEBUOY-4P', nameEn: 'Lifebuoy Soap 4x100g', nameBn: 'লাইফবয় সাবান ৪টি', unit: ProductUnit.PACK, unitVal: 4, mrp: 240, masikPrice: 218, purchaseCost: 195 },
      ],
    },
    {
      slug: 'bashundhara-facial-tissue',
      nameEn: 'Bashundhara Facial Tissue Box (4-Pack)',
      nameBn: 'বসুন্ধরা ফেসিয়াল টিস্যু ৪টি প্যাক',
      categorySlug: 'household_tissue',
      brandName: 'Bashundhara',
      variants: [
        { sku: 'TISSUE-BASH-4P', nameEn: 'Bashundhara Facial Tissue 4x120s', nameBn: 'বসুন্ধরা টিস্যু ৪ প্যাক', unit: ProductUnit.PACK, unitVal: 4, mrp: 280, masikPrice: 250, purchaseCost: 220 },
      ],
    },
  ];

  const variantMap: Record<string, string> = {};

  for (const p of productsToSeed) {
    const categoryId = categoryMap[p.categorySlug];
    const brandId = brandMap[p.brandName];

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { nameEn: p.nameEn, nameBn: p.nameBn, categoryId, brandId },
      create: { slug: p.slug, nameEn: p.nameEn, nameBn: p.nameBn, categoryId, brandId },
    });

    for (const v of p.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          nameEn: v.nameEn,
          nameBn: v.nameBn,
          unit: v.unit,
          unitValue: v.unitVal,
          mrp: v.mrp,
          masikPrice: v.masikPrice,
          purchaseCost: v.purchaseCost,
          isPrivateLabel: v.isPrivate || false,
          stockAvailable: 500,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          nameEn: v.nameEn,
          nameBn: v.nameBn,
          unit: v.unit,
          unitValue: v.unitVal,
          mrp: v.mrp,
          masikPrice: v.masikPrice,
          purchaseCost: v.purchaseCost,
          isPrivateLabel: v.isPrivate || false,
          stockAvailable: 500,
          images: [`https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80`],
        },
      });

      variantMap[v.sku] = variant.id;

      // Seed initial warehouse inventory batch
      await prisma.inventoryBatch.create({
        data: {
          warehouseId: warehouse.id,
          variantId: variant.id,
          batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
          purchaseCost: v.purchaseCost,
          physicalStock: 500,
          reservedStock: 0,
          availableStock: 500,
          locationBin: `AISLE-A1-BIN-${v.sku.slice(0, 3)}`,
        },
      });
    }
  }

  // 6. Substitution Relationships
  console.log('🔄 Seeding Smart Product Substitution Maps...');
  const substitutionsData = [
    // Rupchanda Oil -> Teer Oil -> Masik Essentials
    {
      primarySku: 'OIL-SOYA-RUP-5L',
      subSku: 'OIL-SOYA-TEER-5L',
      type: SubstitutionType.ECONOMY_SAVER,
      delta: -20,
    },
    {
      primarySku: 'OIL-SOYA-RUP-5L',
      subSku: 'OIL-SOYA-MB-5L',
      type: SubstitutionType.ECONOMY_SAVER,
      delta: -40,
    },
    // Chashi Miniket -> Masik Essentials Miniket
    {
      primarySku: 'RICE-MINI-CHASHI-25K',
      subSku: 'RICE-MINI-MB-25K',
      type: SubstitutionType.ECONOMY_SAVER,
      delta: -90,
    },
    // ACI Dal -> Masik Essentials Dal
    {
      primarySku: 'DAL-MASOOR-ACI-2K',
      subSku: 'DAL-MASOOR-MB-2K',
      type: SubstitutionType.ECONOMY_SAVER,
      delta: -20,
    },
    // Fresh Atta -> Masik Essentials Atta
    {
      primarySku: 'FLOUR-ATTA-FRESH-5K',
      subSku: 'FLOUR-ATTA-MB-5K',
      type: SubstitutionType.ECONOMY_SAVER,
      delta: -15,
    },
  ];

  for (const s of substitutionsData) {
    const primaryId = variantMap[s.primarySku];
    const subId = variantMap[s.subSku];

    if (primaryId && subId) {
      await prisma.productSubstitution.upsert({
        where: {
          primaryVariantId_substituteVariantId: {
            primaryVariantId: primaryId,
            substituteVariantId: subId,
          },
        },
        update: { type: s.type, priceDelta: s.delta },
        create: {
          primaryVariantId: primaryId,
          substituteVariantId: subId,
          type: s.type,
          priceDelta: s.delta,
        },
      });
    }
  }

  // 7. Seed Admin & Test Customer Users
  console.log('👤 Seeding System Users & Profiles...');
  const adminUser = await prisma.user.upsert({
    where: { phone: '+8801700000000' },
    update: { role: UserRole.SUPER_ADMIN },
    create: {
      phone: '+8801700000000',
      email: 'admin@masikbazar.com',
      fullName: 'Masher Bazar Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { phone: '+8801800000000' },
    update: { role: UserRole.CUSTOMER },
    create: {
      phone: '+8801800000000',
      email: 'customer@test.com',
      fullName: 'Tanvir Hossain',
      role: UserRole.CUSTOMER,
    },
  });

  const customerProfile = await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      referralCode: 'TANVIR2026',
      loyaltyCredits: 150,
      salaryPayday: 3,
    },
  });

  const defaultZone = await prisma.deliveryZone.findFirst({ where: { name: 'Gulshan' } });

  if (defaultZone) {
    const address = await prisma.address.create({
      data: {
        userId: customerUser.id,
        label: 'Home',
        addressLine: 'Road 11, House 42, Block D, Gulshan 1',
        areaZoneId: defaultZone.id,
        thana: 'Gulshan',
        district: 'Dhaka',
        isDefault: true,
      },
    });

    await prisma.household.create({
      data: {
        customerId: customerProfile.id,
        householdName: 'Hossain Household',
        householdSize: 4,
        adultCount: 2,
        childCount: 2,
        cookingFrequency: 'ALMOST_EVERY_DAY',
        foodPreference: 'STANDARD',
        defaultMonthlyBudget: 6000,
        marketTier: MarketTier.FAMILY,
        defaultAddressId: address.id,
      },
    });
  }

  console.log('✅ Masher Bazar Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
