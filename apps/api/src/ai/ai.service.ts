import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { BasketService } from '../basket/basket.service';
import { CookingFrequency, FoodPreference, MarketTier, BasketItem } from '@masik/shared-types';

export interface MealPlanInputDto {
  householdSize: number;
  breakfastType: 'roti' | 'khichuri' | 'cereal' | 'mixed';
  weeklyMeals: {
    chickenCurryDaysPerWeek: number; // e.g. 3
    fishCurryDaysPerWeek: number;    // e.g. 3
    beefOrMuttonDaysPerWeek: number; // e.g. 1
    khichuriDaysPerWeek: number;     // e.g. 2
    dalDaily: boolean;               // e.g. true
  };
  marketTier?: MarketTier;
}

@Injectable()
export class AiService {
  private aiClient: GoogleGenAI | null = null;

  constructor(private basketService: BasketService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * 1. Bengali Natural Language Market Builder
   * Uses Gemini 2.5 Flash if API key is configured, with robust regex/intent parsing fallback.
   */
  async parseNaturalLanguageMarket(prompt: string) {
    let size = 4;
    let budget = 6000;
    let preference = FoodPreference.STANDARD;
    let tier = MarketTier.FAMILY;
    let explanationBn = '';

    if (this.aiClient) {
      try {
        const response = await this.aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an AI assistant for Masher Bazar (মাসের বাজার), a monthly grocery OS in Bangladesh.
Analyze the user's natural language input: "${prompt}"
Return ONLY valid JSON with keys:
- "householdSize": number (default 4)
- "budget": number (in BDT, default 6000)
- "foodPreference": "STANDARD" | "RICE_HEAVY" | "ROTI_HEAVY"
- "marketTier": "BASIC" | "FAMILY" | "PREMIUM"
- "explanationBn": string in polite, friendly Bengali explaining what market was prepared.`,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          size = parsed.householdSize || size;
          budget = parsed.budget || budget;
          preference = parsed.foodPreference || preference;
          tier = parsed.marketTier || tier;
          explanationBn = parsed.explanationBn || '';
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local heuristic parser', err);
      }
    }

    // Heuristic parser fallback
    if (!explanationBn) {
      const sizeMatchBn = prompt.match(/(\d+|এক|দুই|তিন|চার|পাঁচ|ছয়|সাত|আট)\s*(জন|মানুষ)/);
      const sizeMatchEn = prompt.match(/(\d+)\s*(people|person|members)/i);

      if (sizeMatchBn) {
        const bnDigits: Record<string, number> = {
          '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8,
          'এক': 1, 'দুই': 2, 'তিন': 3, 'চার': 4, 'পাঁচ': 5, 'ছয়': 6, 'সাত': 7, 'আট': 8,
        };
        size = bnDigits[sizeMatchBn[1]] || parseInt(sizeMatchBn[1], 10) || 4;
      } else if (sizeMatchEn) {
        size = parseInt(sizeMatchEn[1], 10) || 4;
      }

      const budgetMatch = prompt.match(/(\d{4,6})/);
      if (budgetMatch) {
        budget = parseInt(budgetMatch[1], 10);
      }

      if (prompt.includes('রুটি') || prompt.toLowerCase().includes('roti')) {
        preference = FoodPreference.ROTI_HEAVY;
      } else if (prompt.includes('ভাত') || prompt.toLowerCase().includes('rice')) {
        preference = FoodPreference.RICE_HEAVY;
      }

      if (prompt.includes('কম দাম') || prompt.includes('বেসিক') || prompt.toLowerCase().includes('basic')) {
        tier = MarketTier.BASIC;
      } else if (prompt.includes('প্রিমিয়াম') || prompt.toLowerCase().includes('premium')) {
        tier = MarketTier.PREMIUM;
      }

      explanationBn = `আপনার ${size} জনের পরিবারের জন্য ৳${budget.toLocaleString()} বাজেটে একটি আদর্শ মাসের বাজার প্রস্তাব করা হলো।`;
    }

    // Generate basket using the deterministic engine
    const basketResult = await this.basketService.generateBasket({
      householdSize: size,
      defaultMonthlyBudget: budget,
      foodPreference: preference,
      marketTier: tier,
      cookingFrequency: CookingFrequency.ALMOST_EVERY_DAY,
    });

    return {
      parsedParameters: {
        householdSize: size,
        targetBudget: budget,
        foodPreference: preference,
        marketTier: tier,
      },
      basket: basketResult,
      explanationBn,
    };
  }

  /**
   * 2. Meal-to-Market Engine (Section 67 PRD)
   * Converts a 30-day household meal recipe plan into raw grocery ingredient quotas
   * (kg Rice, L Oil, kg Dal, kg Atta, kg Potato/Onion, g Spices) and creates a basket.
   */
  async convertMealPlanToMarket(mealPlan: MealPlanInputDto) {
    const size = Math.max(1, mealPlan.householdSize || 4);
    const weeks = 4.3; // 30 days ~= 4.3 weeks

    // Calculate monthly recipe occurrences
    const chickenMeals = Math.round((mealPlan.weeklyMeals.chickenCurryDaysPerWeek || 3) * weeks);
    const fishMeals = Math.round((mealPlan.weeklyMeals.fishCurryDaysPerWeek || 3) * weeks);
    const beefMeals = Math.round((mealPlan.weeklyMeals.beefOrMuttonDaysPerWeek || 1) * weeks);
    const khichuriMeals = Math.round((mealPlan.weeklyMeals.khichuriDaysPerWeek || 2) * weeks);
    const hasDailyDal = mealPlan.weeklyMeals.dalDaily ?? true;

    // Ingredient calculations (calibrated for Bangladeshi culinary norms per 4-person meal):
    // Rice per curry meal: ~400g per 4 persons
    const totalCurryMeals = chickenMeals + fishMeals + beefMeals;
    let riceKg = Math.round((totalCurryMeals * 0.45 * (size / 4)) + (khichuriMeals * 0.35 * (size / 4)));

    // Oil per meal: ~80ml for chicken/fish curry, ~100ml for beef, ~70ml for khichuri
    let oilLiters = Math.round(
      ((chickenMeals * 0.08) + (fishMeals * 0.08) + (beefMeals * 0.12) + (khichuriMeals * 0.07)) * (size / 4)
    );
    oilLiters = Math.max(2, oilLiters);

    // Lentils (Dal): ~100g per daily dal meal + 150g per khichuri
    let dalKg = Math.round(((hasDailyDal ? 30 * 0.1 : 15 * 0.1) + (khichuriMeals * 0.15)) * (size / 4));
    dalKg = Math.max(1, dalKg);

    // Atta Flour: Roti breakfasts (60 breakfasts = 2 per day)
    let attaKg = mealPlan.breakfastType === 'roti' ? Math.round(30 * 0.35 * (size / 4)) : 5;

    // Produce: Onions & Potatoes
    let onionKg = Math.round((totalCurryMeals * 0.15 + khichuriMeals * 0.1) * (size / 4));
    let potatoKg = Math.round((totalCurryMeals * 0.2 + khichuriMeals * 0.15) * (size / 4));

    // Clamp minimums
    riceKg = Math.max(10, riceKg);
    onionKg = Math.max(3, onionKg);
    potatoKg = Math.max(3, potatoKg);

    // Generate enriched basket via basketService
    const basketResult = await this.basketService.generateBasket({
      householdSize: size,
      defaultMonthlyBudget: 6500,
      marketTier: mealPlan.marketTier || MarketTier.FAMILY,
      foodPreference: mealPlan.breakfastType === 'roti' ? FoodPreference.ROTI_HEAVY : FoodPreference.STANDARD,
      cookingFrequency: CookingFrequency.ALMOST_EVERY_DAY,
    });

    return {
      mealPlanSummary: {
        householdSize: size,
        monthlyMeals: {
          chickenCurry: chickenMeals,
          fishCurry: fishMeals,
          beefOrMuttonCurry: beefMeals,
          khichuri: khichuriMeals,
          dalBhatDays: hasDailyDal ? 30 : 15,
        },
        calculatedRawRequirements: {
          riceKg,
          oilLiters,
          dalKg,
          attaKg,
          onionKg,
          potatoKg,
        },
      },
      recommendedBasket: basketResult,
      explanationBn: `আপনার ৩০ দিনের মিল প্ল্যান (${chickenMeals}টি মুরগি, ${fishMeals}টি মাছ, ${khichuriMeals}টি খিচুড়ি) বিশ্লেষণ করে মোট ${riceKg} কেজি চাল, ${oilLiters} লিটার তেল ও ${dalKg} কেজি ডালের প্রয়োজনীয় বাজার প্রস্তুত করা হলো।`,
    };
  }
}
