import { Promotion, User } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

class PromotionService {
  getPromotionsForBrand(brandId: string, user: User | null): Promotion[] {
    if (!user || !authService.canAccessBrand(user, brandId)) return [];
    const allPromotions = storageService.getPromotions();
    return allPromotions.filter(p => p.brandId === brandId);
  }

  getPromotionById(id: string, user: User | null): Promotion | null {
    if (!user) return null;
    const allPromotions = storageService.getPromotions();
    const promo = allPromotions.find(p => p.id === id);
    if (!promo) return null;

    if (!authService.canAccessBrand(user, promo.brandId)) {
      return null;
    }
    return promo;
  }

  getAllPromotionsForUser(user: User | null): Promotion[] {
    if (!user) return [];
    const allPromotions = storageService.getPromotions();
    if (user.role === 'admin') return allPromotions;
    return allPromotions.filter(p => user.assignedBrandIds.includes(p.brandId));
  }
}

export const promotionService = new PromotionService();
