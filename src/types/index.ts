export type UserRole = 'admin' | 'client';
export type ClientStatus = 'active' | 'inactive' | 'invited';
export type AssetType = 'image' | 'video';
export type AssetFormat = 'JPG' | 'PNG' | 'MP4' | 'WEBM';

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  assignedBrandIds: string[];
  status: ClientStatus;
  createdAt: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  sharepointFolderUrl: string; // Prepared for future SharePoint integration
  sharepointDriveId: string;   // Prepared for Microsoft Graph drive
  sharepointFolderPath: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  brandId: string;
  title: string;
  description: string;
  season: string;
  coverImageUrl: string;
  sharepointSubfolderPath: string; // Prepared for SharePoint subfolder
  publishedAt: string;
  assetCount: number;
}

export interface Asset {
  id: string;
  promotionId: string;
  brandId: string;
  title: string;
  description: string;
  type: AssetType;
  format: AssetFormat;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  dimensions?: string;
  duration?: string;
  url: string;
  thumbnailUrl: string;
  downloadUrl: string;
  publishedAt: string;
  tags: string[];
}

export type CourseType = 'online' | 'presencial';
export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado' | 'Profesional';

export interface CourseInstructor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  type: CourseType;
  level?: CourseLevel;
  duration?: string;
  price: string;
  instructor: CourseInstructor;
  coverImageUrl: string;
  topics: string[];
  enrollUrl: string;
  location?: string;
  startDate?: string;
  badgeText?: string;
  publishedAt: string;
  categoryName?: string;
}

export interface TutorLmsConfig {
  baseUrl: string;
  coursesEndpoint: string;
  alternateEndpoint?: string;
  autoSyncOnLoad: boolean;
  totalCourses?: number;
  totalPages?: number;
  lastSyncAt?: string;
  lastStatus?: 'connected' | 'cors_or_offline' | 'error';
  lastStatusMessage?: string;
}

export interface PortalUpdate {
  id: string;
  brandId?: string;
  promotionId?: string;
  courseId?: string;
  category?: 'promotion' | 'course' | 'system';
  title: string;
  description: string;
  newAssetsCount?: number;
  publishedAt: string;
  readByUserIds: string[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'download_single' | 'download_zip' | 'client_created' | 'client_updated';
  description: string;
  timestamp: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  browserPush: boolean;
  weeklyDigest: boolean;
  batchNotifications: boolean;
}
