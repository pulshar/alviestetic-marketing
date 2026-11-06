import { User, ClientStatus } from '../types';
import { storageService } from './storageService';

export interface CreateClientDTO {
  name: string;
  email: string;
  company: string;
  assignedBrandIds: string[];
  status: ClientStatus;
}

class ClientService {
  getClients(): User[] {
    const users = storageService.getUsers();
    return users.filter(u => u.role === 'client');
  }

  getClientById(id: string): User | null {
    const users = storageService.getUsers();
    return users.find(u => u.id === id && u.role === 'client') || null;
  }

  createClient(dto: CreateClientDTO, adminUser: User | null): User {
    const users = storageService.getUsers();
    const newClient: User = {
      id: `user_${Date.now()}`,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      company: dto.company.trim(),
      role: 'client',
      assignedBrandIds: dto.assignedBrandIds,
      status: dto.status,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`
    };

    storageService.saveUsers([...users, newClient]);

    if (adminUser) {
      storageService.addActivity({
        userId: adminUser.id,
        userName: adminUser.name,
        action: 'client_created',
        description: `Registró al cliente "${newClient.name}" (${newClient.company})`
      });
    }

    return newClient;
  }

  updateClient(id: string, updates: Partial<CreateClientDTO>, adminUser: User | null): User | null {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const existing = users[index];
    const updated: User = {
      ...existing,
      ...updates
    };

    users[index] = updated;
    storageService.saveUsers(users);

    if (adminUser) {
      storageService.addActivity({
        userId: adminUser.id,
        userName: adminUser.name,
        action: 'client_updated',
        description: `Actualizó datos y marcas del cliente "${updated.name}"`
      });
    }

    return updated;
  }

  toggleClientStatus(id: string, adminUser: User | null): User | null {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const currentStatus = users[index].status;
    const nextStatus: ClientStatus = currentStatus === 'active' ? 'inactive' : 'active';
    users[index] = { ...users[index], status: nextStatus };
    storageService.saveUsers(users);

    if (adminUser) {
      storageService.addActivity({
        userId: adminUser.id,
        userName: adminUser.name,
        action: 'client_updated',
        description: `Cambió estado de "${users[index].name}" a ${nextStatus.toUpperCase()}`
      });
    }

    return users[index];
  }

  deleteClient(id: string, adminUser: User | null): boolean {
    const users = storageService.getUsers();
    const toDelete = users.find(u => u.id === id);
    if (!toDelete) return false;

    const filtered = users.filter(u => u.id !== id);
    storageService.saveUsers(filtered);

    if (adminUser) {
      storageService.addActivity({
        userId: adminUser.id,
        userName: adminUser.name,
        action: 'client_updated',
        description: `Eliminó de prueba al cliente "${toDelete.name}"`
      });
    }

    return true;
  }
}

export const clientService = new ClientService();
