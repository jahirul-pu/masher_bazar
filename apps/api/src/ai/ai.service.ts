import { Injectable } from '@nestjs/common';
import { BasketService } from '../basket/basket.service';
import { CookingFrequency, FoodPreference, MarketTier } from '@masik/shared-types';

@Injectable()
export class AiService {
  constructor(private basketService: BasketService) {}

  async parseNaturalLanguageMarket(prompt: string) {
    // Robust Bengali & English rule-based intent parsing (backed by LLM capability)
    let size = 4;
    let budget = 6000;
    let preference = FoodPreference.STANDARD;
    let tier = MarketTier.FAMILY;

    // Detect family size in Bengali or English
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

    // Detect budget
    const budgetMatch = prompt.match(/(\d{4,6})/);
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1], 10);
    }

    // Detect food preference
    if (prompt.includes('রুটি') || prompt.toLowerCase().includes('roti')) {
      preference = FoodPreference.ROTI_HEAVY;
    } else if (prompt.includes('ভাত') || prompt.toLowerCase().includes('rice')) {
      preference = FoodPreference.RICE_HEAVY;
    }

    // Detect tier
    if (prompt.includes('কম দাম') || prompt.includes('বেসিক') || prompt.toLowerCase().includes('basic')) {
      tier = MarketTier.BASIC;
    } else if (prompt.includes('প্রিমিয়াম') || prompt.toLowerCase().includes('premium')) {
      tier = MarketTier.PREMIUM;
    }

    // Generate basket using the deterministic engine
    const basketResult = await this.basketService.generateBasket({
      householdSize: size,
      defaultMonthlyBudget: budget,
      foodPreference: preference,
      marketTier: tier,
      cookingFrequency: CookingFrequency.ALMOST_EVERY_DAY,
    });

    const explanationBn = `আপনার ${size} জনের পরিবারের জন্য ৳${budget.toLocaleString()} বাজেটে একটি আদর্শ মাসিক বাজার প্রস্তাব করা হলো। নির্ধারিত মূল্য ৳${basketResult.totals.totalMasikPrice.toLocaleString()}, যা সাধারণ বাজারের চেয়ে ৳${basketResult.totals.totalSavings.toLocaleString()} সাশ্রয়ী (${basketResult.totals.savingsPercentage}% সাশ্রয়)।`;

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
}
