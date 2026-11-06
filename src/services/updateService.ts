import { PortalUpdate, User } from '../types';
import { storageService } from './storageService';

class UpdateService {
  getUpdatesForUser(user: User | null): PortalUpdate[] {
    if (!user) return [];
    const all = storageService.getUpdates();
    if (user.role === 'admin') {
      return all;
    }
    // For clients: show course updates (global to all clients) and updates for assigned brands
    return all.filter(u => {
      if (u.category === 'course' || !u.brandId) return true;
      return user.assignedBrandIds.includes(u.brandId);
    });
  }

  getUnreadCount(user: User | null): number {
    if (!user) return 0;
    const updates = this.getUpdatesForUser(user);
    return updates.filter(u => !u.readByUserIds.includes(user.id)).length;
  }

  markAsRead(updateId: string, userId: string): void {
    const all = storageService.getUpdates();
    const index = all.findIndex(u => u.id === updateId);
    if (index === -1) return;

    if (!all[index].readByUserIds.includes(userId)) {
      all[index].readByUserIds = [...all[index].readByUserIds, userId];
      storageService.saveUpdates(all);
    }
  }

  markAllAsRead(user: User): void {
    const all = storageService.getUpdates();
    const updated = all.map(u => {
      const isVisible =
        user.role === 'admin' ||
        u.category === 'course' ||
        !u.brandId ||
        user.assignedBrandIds.includes(u.brandId);

      if (isVisible && !u.readByUserIds.includes(user.id)) {
        return { ...u, readByUserIds: [...u.readByUserIds, user.id] };
      }
      return u;
    });
    storageService.saveUpdates(updated);
  }
}

export const updateService = new UpdateService();
