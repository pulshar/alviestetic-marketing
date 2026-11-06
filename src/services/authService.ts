import { User } from '../types';
import { storageService } from './storageService';
import { DEMO_PASSWORD } from '../data/mockData';

class AuthService {
  getCurrentUser(): User | null {
    const userId = storageService.getCurrentUserId();
    if (!userId) return null;
    const users = storageService.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = storageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: 'No existe ninguna cuenta asociada a este correo electrónico.' };
    }

    if (password !== DEMO_PASSWORD) {
      return { success: false, error: 'Contraseña incorrecta. (Demo: Demo123!)' };
    }

    if (user.status === 'inactive') {
      return { success: false, error: 'Esta cuenta de cliente se encuentra temporalmente desactivada por la empresa.' };
    }

    storageService.setCurrentUserId(user.id);
    storageService.addActivity({
      userId: user.id,
      userName: user.name,
      action: 'login',
      description: `Inició sesión en el portal desde ${user.company}`
    });

    return { success: true, user };
  }

  loginDemoUser(userId: string): User | null {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    storageService.setCurrentUserId(user.id);
    storageService.addActivity({
      userId: user.id,
      userName: user.name,
      action: 'login',
      description: `Acceso rápido demo como ${user.name} (${user.role === 'admin' ? 'Administrador' : 'Cliente'})`
    });

    return user;
  }

  logout(): void {
    storageService.setCurrentUserId(null);
  }

  canAccessBrand(user: User | null, brandId: string): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.assignedBrandIds.includes(brandId);
  }
}

export const authService = new AuthService();
