import { User, Brand, Promotion, Asset, PortalUpdate, ActivityLog, Course, TutorLmsConfig } from '../types';
import {
  INITIAL_USERS,
  INITIAL_BRANDS,
  INITIAL_PROMOTIONS,
  INITIAL_ASSETS,
  INITIAL_UPDATES,
  INITIAL_ACTIVITY
} from '../data/mockData';
import { INITIAL_COURSES } from '../data/mockCourses';
import { cleanHtmlText } from '../utils/textUtils';

const KEYS = {
  USERS: 'alviestetic_users',
  BRANDS: 'alviestetic_brands',
  PROMOTIONS: 'alviestetic_promotions',
  ASSETS: 'alviestetic_assets',
  UPDATES: 'alviestetic_updates',
  ACTIVITY: 'alviestetic_activity',
  CURRENT_USER_ID: 'alviestetic_current_user_id',
  COURSES: 'alviestetic_courses',
  CACHED_COURSE_IDS: 'alviestetic_cached_course_ids',
  TUTOR_CONFIG: 'alviestetic_tutor_config',
  VERSION: 'alviestetic_data_version'
};

const DEFAULT_TUTOR_CONFIG: TutorLmsConfig = {
  baseUrl: 'https://alviestetic.es',
  coursesEndpoint: '/wp-json/tutor/v1/courses?order=asc',
  alternateEndpoint: '',
  autoSyncOnLoad: true,
  totalCourses: 37,
  totalPages: 2,
  lastStatus: 'connected',
  lastStatusMessage: 'Listo para sincronizar cursos desde Tutor LMS REST API (alviestetic.es)'
};

const CURRENT_VERSION = '2026_alviestetic_courses_v8';

class StorageService {
  constructor() {
    this.checkVersionMigration();
  }

  private checkVersionMigration(): void {
    try {
      const storedVersion = localStorage.getItem(KEYS.VERSION);
      if (storedVersion !== CURRENT_VERSION) {
        this.resetToFactoryDefaults();
        localStorage.setItem(KEYS.VERSION, CURRENT_VERSION);
      }
    } catch {
      // Ignore if localStorage is unavailable
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage [${key}]:`, e);
    }
  }

  // Users
  getUsers(): User[] {
    return this.getItem<User[]>(KEYS.USERS, INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    this.setItem(KEYS.USERS, users);
  }

  // Current session user ID
  getCurrentUserId(): string | null {
    return localStorage.getItem(KEYS.CURRENT_USER_ID) || 'user_laura'; // Default to Laura Martín for instant preview
  }

  setCurrentUserId(id: string | null): void {
    if (id) {
      localStorage.setItem(KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
  }

  // Brands
  getBrands(): Brand[] {
    return this.getItem<Brand[]>(KEYS.BRANDS, INITIAL_BRANDS);
  }

  saveBrands(brands: Brand[]): void {
    this.setItem(KEYS.BRANDS, brands);
  }

  // Promotions
  getPromotions(): Promotion[] {
    return this.getItem<Promotion[]>(KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
  }

  savePromotions(promotions: Promotion[]): void {
    this.setItem(KEYS.PROMOTIONS, promotions);
  }

  // Assets
  getAssets(): Asset[] {
    return this.getItem<Asset[]>(KEYS.ASSETS, INITIAL_ASSETS);
  }

  saveAssets(assets: Asset[]): void {
    this.setItem(KEYS.ASSETS, assets);
  }

  // Updates
  getUpdates(): PortalUpdate[] {
    const raw = this.getItem<PortalUpdate[]>(KEYS.UPDATES, INITIAL_UPDATES);
    return raw.map(u => ({
      ...u,
      title: cleanHtmlText(u.title),
      description: cleanHtmlText(u.description)
    }));
  }

  saveUpdates(updates: PortalUpdate[]): void {
    const sanitized = updates.map(u => ({
      ...u,
      title: cleanHtmlText(u.title),
      description: cleanHtmlText(u.description)
    }));
    this.setItem(KEYS.UPDATES, sanitized);
  }

  // Activity logs
  getActivity(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(KEYS.ACTIVITY, INITIAL_ACTIVITY);
  }

  saveActivity(activity: ActivityLog[]): void {
    this.setItem(KEYS.ACTIVITY, activity);
  }

  addActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const current = this.getActivity();
    const newLog: ActivityLog = {
      ...log,
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.saveActivity([newLog, ...current.slice(0, 49)]);
  }

  // Courses
  getCourses(): Course[] {
    const raw = this.getItem<Course[]>(KEYS.COURSES, INITIAL_COURSES);
    return raw.map(c => this.sanitizeCourse(c));
  }

  saveCourses(courses: Course[]): void {
    const sanitized = courses.map(c => this.sanitizeCourse(c));
    this.setItem(KEYS.COURSES, sanitized);
  }

  private sanitizeCourse(c: Course): Course {
    return {
      ...c,
      title: cleanHtmlText(c.title),
      shortDescription: c.shortDescription ? cleanHtmlText(c.shortDescription) : undefined,
      description: cleanHtmlText(c.description),
      categoryName: c.categoryName ? cleanHtmlText(c.categoryName) : undefined,
      badgeText: c.badgeText ? cleanHtmlText(c.badgeText) : undefined,
      duration: c.duration ? cleanHtmlText(c.duration) : c.duration,
      price: c.price ? cleanHtmlText(c.price) : c.price,
      topics: Array.isArray(c.topics) ? c.topics.map(t => cleanHtmlText(t)) : [],
      instructor: {
        ...c.instructor,
        name: cleanHtmlText(c.instructor?.name || ''),
        role: cleanHtmlText(c.instructor?.role || '')
      }
    };
  }

  // Cached course IDs (used to detect when a new course appears from Tutor LMS)
  getCachedCourseIds(): string[] {
    return this.getItem<string[]>(KEYS.CACHED_COURSE_IDS, INITIAL_COURSES.map(c => c.id));
  }

  saveCachedCourseIds(ids: string[]): void {
    this.setItem(KEYS.CACHED_COURSE_IDS, ids);
  }

  // Tutor LMS Configuration
  getTutorConfig(): TutorLmsConfig {
    return this.getItem<TutorLmsConfig>(KEYS.TUTOR_CONFIG, DEFAULT_TUTOR_CONFIG);
  }

  saveTutorConfig(config: TutorLmsConfig): void {
    this.setItem(KEYS.TUTOR_CONFIG, config);
  }

  // Reset demo data back to clean initial seed
  resetToFactoryDefaults(): void {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
    localStorage.setItem(KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
    localStorage.setItem(KEYS.UPDATES, JSON.stringify(INITIAL_UPDATES));
    localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITY));
    localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    localStorage.setItem(KEYS.CACHED_COURSE_IDS, JSON.stringify(INITIAL_COURSES.map(c => c.id)));
    localStorage.setItem(KEYS.TUTOR_CONFIG, JSON.stringify(DEFAULT_TUTOR_CONFIG));
    localStorage.setItem(KEYS.CURRENT_USER_ID, 'user_laura');
  }
}

export const storageService = new StorageService();
