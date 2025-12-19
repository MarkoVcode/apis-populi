// Mobile CMS GraphQL API Types

// =============================================================================
// ENUMS
// =============================================================================

export type Platform = 'IOS' | 'ANDROID' | 'ALL';
export type NotificationType = 'PROMOTIONAL' | 'TRANSACTIONAL' | 'SYSTEM' | 'REMINDER' | 'SOCIAL';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type BannerStyle = 'FULL_WIDTH' | 'CARD' | 'FLOATING' | 'INLINE';
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type FeatureFlagType = 'BOOLEAN' | 'STRING' | 'NUMBER' | 'JSON';
export type UserSegment = 'ALL' | 'NEW_USERS' | 'RETURNING_USERS' | 'PREMIUM' | 'FREE';

// =============================================================================
// APP CONFIG
// =============================================================================

export interface MaintenanceConfig {
  enabled: boolean;
  message?: string;
  estimatedEndTime?: string;
  allowedUserIds: string[];
}

export interface DarkModeConfig {
  enabled: boolean;
  automatic: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  darkMode: DarkModeConfig;
  customCSS?: string;
}

export interface CachePolicy {
  defaultTTL: number;
  maxAge: number;
  staleWhileRevalidate: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  cachePolicy: CachePolicy;
}

export interface AnalyticsProvider {
  name: string;
  enabled: boolean;
  trackingId?: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  providers: AnalyticsProvider[];
  sampleRate: number;
}

export interface AppConfig {
  id: string;
  appVersion: string;
  minimumSupportedVersion: string;
  forceUpdate: boolean;
  maintenance: MaintenanceConfig;
  theme: ThemeConfig;
  api: ApiConfig;
  analytics: AnalyticsConfig;
  updatedAt: string;
}

// =============================================================================
// BANNERS
// =============================================================================

export interface CallToAction {
  text: string;
  url: string;
  deepLink?: string;
  action?: string;
}

export interface BannerTargeting {
  platforms: Platform[];
  segments: UserSegment[];
  countries?: string[];
  languages?: string[];
  minAppVersion?: string;
}

export interface BannerSchedule {
  startDate: string;
  endDate?: string;
  timezone: string;
  daysOfWeek?: number[];
}

export interface BannerAnalytics {
  campaignId?: string;
  source?: string;
  medium?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  cta: CallToAction;
  style: BannerStyle;
  placement: string;
  priority: number;
  targeting: BannerTargeting;
  schedule: BannerSchedule;
  analytics: BannerAnalytics;
  impressions: number;
  clicks: number;
}

// =============================================================================
// ARTICLES
// =============================================================================

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: string;
  socialLinks?: SocialLinks;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
  mimeType: string;
  caption?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  featuredImage?: MediaAsset;
  gallery?: MediaAsset[];
  readingTime: number;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
}

// =============================================================================
// NOTIFICATIONS (Base + Variants)
// =============================================================================

export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface PromotionalNotification extends BaseNotification {
  type: 'PROMOTIONAL';
  imageUrl: string;
  discountCode?: string;
  discountPercentage?: number;
  cta: CallToAction;
}

export interface TransactionalNotification extends BaseNotification {
  type: 'TRANSACTIONAL';
  orderId: string;
  orderStatus: string;
  trackingUrl?: string;
  amount?: number;
  currency?: string;
}

export interface SystemNotification extends BaseNotification {
  type: 'SYSTEM';
  actionRequired: boolean;
  actionUrl?: string;
  category: string;
}

export interface ReminderNotification extends BaseNotification {
  type: 'REMINDER';
  reminderTime: string;
  recurring: boolean;
  recurringPattern?: string;
  relatedItemId?: string;
  relatedItemType?: string;
}

export interface SocialNotification extends BaseNotification {
  type: 'SOCIAL';
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  action: string;
  targetId?: string;
  targetType?: string;
}

export type Notification =
  | PromotionalNotification
  | TransactionalNotification
  | SystemNotification
  | ReminderNotification
  | SocialNotification;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export interface RuleCondition {
  attribute: string;
  operator: string;
  value: unknown;
}

export interface FeatureFlagRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  value: unknown;
  percentage?: number;
  priority: number;
}

export interface FeatureFlagMetadata {
  owner?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  jiraTicket?: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  type: FeatureFlagType;
  defaultValue: unknown;
  enabled: boolean;
  rules: FeatureFlagRule[];
  metadata: FeatureFlagMetadata;
  evaluationCount: number;
}

// =============================================================================
// NAVIGATION
// =============================================================================

export interface NavigationBadge {
  text?: string;
  count?: number;
  color?: string;
  animated: boolean;
}

export interface ItemVisibility {
  platforms: Platform[];
  segments: UserSegment[];
  authenticated?: boolean;
  minAppVersion?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  url?: string;
  deepLink?: string;
  badge?: NavigationBadge;
  children?: NavigationItem[];
  visibility: ItemVisibility;
}

export interface NavigationMenu {
  id: string;
  name: string;
  location: string;
  items: NavigationItem[];
  updatedAt: string;
}

// =============================================================================
// API KEY CONFIG
// =============================================================================

export const MOBILE_API_KEYS = [
  'mobile-api-key-1',
  'mobile-api-key-2',
  'mobile-demo-key',
];
