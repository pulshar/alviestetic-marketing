import { Brand, User } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

class BrandService {
  getBrandsForUser(user: User | null): Brand[] {
    if (!user) return [];
    const allBrands = storageService.getBrands();
    if (user.role === 'admin') {
      return allBrands;
    }
    return allBrands.filter(b => user.assignedBrandIds.includes(b.id));
  }

  getBrandById(id: string, user: User | null): Brand | null {
    if (!user) return null;
    if (!authService.canAccessBrand(user, id)) return null;

    const allBrands = storageService.getBrands();
    return allBrands.find(b => b.id === id) || null;
  }

  createBrand(data: Omit<Brand, 'id' | 'createdAt'>): Brand {
    const brands = storageService.getBrands();
    const newBrand: Brand = {
      ...data,
      id: `brand_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    storageService.saveBrands([...brands, newBrand]);
    return newBrand;
  }

  updateBrand(id: string, updates: Partial<Brand>): Brand | null {
    const brands = storageService.getBrands();
    const index = brands.findIndex(b => b.id === id);
    if (index === -1) return null;

    const updated = { ...brands[index], ...updates };
    brands[index] = updated;
    storageService.saveBrands(brands);
    return updated;
  }
}

export const brandService = new BrandService();
