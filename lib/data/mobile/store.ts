import { createStore } from '../../db/store';
import {
  AppConfig,
  Banner,
  Article,
  Author,
  Category,
  Notification,
  FeatureFlag,
  NavigationMenu,
  Platform,
  UserSegment,
} from './types';
import {
  appConfigSeed,
  bannersSeed,
  articlesSeed,
  authorsSeed,
  categoriesSeed,
  notificationsSeed,
  featureFlagsSeed,
  navigationMenusSeed,
} from './seed';

// Create stores for each entity type
export const appConfigStore = createStore<AppConfig>('mobile', 'config');
export const bannersStore = createStore<Banner>('mobile', 'banners');
export const articlesStore = createStore<Article>('mobile', 'articles');
export const authorsStore = createStore<Author>('mobile', 'authors');
export const categoriesStore = createStore<Category>('mobile', 'categories');
export const notificationsStore = createStore<Notification>('mobile', 'notifications');
export const featureFlagsStore = createStore<FeatureFlag>('mobile', 'flags');
export const navigationMenusStore = createStore<NavigationMenu>('mobile', 'navigation');

// Initialization flag
let isInitialized = false;

// Initialize all mobile data
export async function initializeMobileData(): Promise<void> {
  if (isInitialized) return;

  // Check if data already exists
  const existingBanners = await bannersStore.getAll();
  if (existingBanners.length > 0) {
    isInitialized = true;
    return;
  }

  // Seed all data sequentially to avoid race conditions
  await appConfigStore.set(appConfigSeed);

  for (const author of authorsSeed) {
    await authorsStore.set(author);
  }

  for (const category of categoriesSeed) {
    await categoriesStore.set(category);
  }

  for (const banner of bannersSeed) {
    await bannersStore.set(banner);
  }

  for (const article of articlesSeed) {
    await articlesStore.set(article);
  }

  for (const notification of notificationsSeed) {
    await notificationsStore.set(notification);
  }

  for (const flag of featureFlagsSeed) {
    await featureFlagsStore.set(flag);
  }

  for (const menu of navigationMenusSeed) {
    await navigationMenusStore.set(menu);
  }

  isInitialized = true;
}

// Reset all mobile data
export async function resetMobileData(): Promise<void> {
  // Clear all stores
  await appConfigStore.clear();
  await bannersStore.clear();
  await articlesStore.clear();
  await authorsStore.clear();
  await categoriesStore.clear();
  await notificationsStore.clear();
  await featureFlagsStore.clear();
  await navigationMenusStore.clear();

  // Reset initialization flag and re-seed
  isInitialized = false;
  await initializeMobileData();
}

// =============================================================================
// APP CONFIG HELPERS
// =============================================================================

export async function getAppConfig(): Promise<AppConfig | null> {
  await initializeMobileData();
  return appConfigStore.get(appConfigSeed.id);
}

// =============================================================================
// BANNER HELPERS
// =============================================================================

export interface BannerFilter {
  placement?: string;
  platform?: Platform;
  segment?: UserSegment;
  active?: boolean;
}

export async function getBanners(filter?: BannerFilter): Promise<Banner[]> {
  await initializeMobileData();
  let banners = await bannersStore.getAll();

  if (filter) {
    if (filter.placement) {
      banners = banners.filter(b => b.placement === filter.placement);
    }
    if (filter.platform && filter.platform !== 'ALL') {
      banners = banners.filter(b =>
        b.targeting.platforms.includes('ALL') ||
        b.targeting.platforms.includes(filter.platform!)
      );
    }
    if (filter.segment && filter.segment !== 'ALL') {
      banners = banners.filter(b =>
        b.targeting.segments.includes('ALL') ||
        b.targeting.segments.includes(filter.segment!)
      );
    }
    if (filter.active !== undefined) {
      const now = new Date().toISOString();
      banners = banners.filter(b => {
        const started = b.schedule.startDate <= now;
        const notEnded = !b.schedule.endDate || b.schedule.endDate >= now;
        return filter.active ? (started && notEnded) : !(started && notEnded);
      });
    }
  }

  // Sort by priority
  return banners.sort((a, b) => a.priority - b.priority);
}

export async function getBannerById(id: string): Promise<Banner | null> {
  await initializeMobileData();
  return bannersStore.get(id);
}

export async function updateBannerStats(id: string, event: 'impression' | 'click'): Promise<Banner | null> {
  const banner = await getBannerById(id);
  if (!banner) return null;

  const updates = event === 'impression'
    ? { impressions: banner.impressions + 1 }
    : { clicks: banner.clicks + 1 };

  return bannersStore.update(id, updates);
}

// =============================================================================
// ARTICLE HELPERS
// =============================================================================

export interface ArticleFilter {
  categoryId?: string;
  authorId?: string;
  status?: string;
  tags?: string[];
  search?: string;
}

export async function getArticles(filter?: ArticleFilter): Promise<Article[]> {
  await initializeMobileData();
  let articles = await articlesStore.getAll();

  if (filter) {
    if (filter.categoryId) {
      articles = articles.filter(a => a.categoryId === filter.categoryId);
    }
    if (filter.authorId) {
      articles = articles.filter(a => a.authorId === filter.authorId);
    }
    if (filter.status) {
      articles = articles.filter(a => a.status === filter.status);
    }
    if (filter.tags && filter.tags.length > 0) {
      articles = articles.filter(a =>
        filter.tags!.some(tag => a.tags.includes(tag))
      );
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower)
      );
    }
  }

  // Sort by published date (newest first), drafts at end
  return articles.sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === 'DRAFT') return 1;
      if (b.status === 'DRAFT') return -1;
    }
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return dateB.localeCompare(dateA);
  });
}

export async function getArticleById(id: string): Promise<Article | null> {
  await initializeMobileData();
  return articlesStore.get(id);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await initializeMobileData();
  const articles = await articlesStore.getAll();
  return articles.find(a => a.slug === slug) || null;
}

export async function incrementArticleView(id: string): Promise<Article | null> {
  const article = await getArticleById(id);
  if (!article) return null;
  return articlesStore.update(id, { viewCount: article.viewCount + 1 });
}

export async function toggleArticleLike(id: string): Promise<Article | null> {
  const article = await getArticleById(id);
  if (!article) return null;
  // Simple toggle - in reality, you'd track per-user
  return articlesStore.update(id, { likeCount: article.likeCount + 1 });
}

// =============================================================================
// AUTHOR & CATEGORY HELPERS
// =============================================================================

export async function getAuthors(): Promise<Author[]> {
  await initializeMobileData();
  return authorsStore.getAll();
}

export async function getAuthorById(id: string): Promise<Author | null> {
  await initializeMobileData();
  return authorsStore.get(id);
}

export async function getCategories(): Promise<Category[]> {
  await initializeMobileData();
  return categoriesStore.getAll();
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await initializeMobileData();
  return categoriesStore.get(id);
}

// =============================================================================
// NOTIFICATION HELPERS
// =============================================================================

export interface NotificationFilter {
  types?: string[];
  read?: boolean;
  priority?: string;
}

export async function getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
  await initializeMobileData();
  let notifications = await notificationsStore.getAll();

  if (filter) {
    if (filter.types && filter.types.length > 0) {
      notifications = notifications.filter(n => filter.types!.includes(n.type));
    }
    if (filter.read !== undefined) {
      notifications = notifications.filter(n => n.read === filter.read);
    }
    if (filter.priority) {
      notifications = notifications.filter(n => n.priority === filter.priority);
    }
  }

  // Sort by creation date (newest first)
  return notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  await initializeMobileData();
  return notificationsStore.get(id);
}

export async function markNotificationRead(id: string): Promise<Notification | null> {
  const notification = await getNotificationById(id);
  if (!notification) return null;
  return notificationsStore.update(id, { read: true }) as Promise<Notification | null>;
}

export async function markAllNotificationsRead(): Promise<Notification[]> {
  await initializeMobileData();
  const notifications = await notificationsStore.getAll();

  for (const notification of notifications) {
    if (!notification.read) {
      await notificationsStore.update(notification.id, { read: true });
    }
  }

  return getNotifications();
}

export async function getUnreadCount(): Promise<number> {
  const notifications = await getNotifications({ read: false });
  return notifications.length;
}

// =============================================================================
// FEATURE FLAG HELPERS
// =============================================================================

export interface FeatureFlagContext {
  platform?: Platform;
  appVersion?: string;
  userSegment?: UserSegment;
  userId?: string;
  customAttributes?: Record<string, unknown>;
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  await initializeMobileData();
  return featureFlagsStore.getAll();
}

export async function getFeatureFlagByKey(key: string): Promise<FeatureFlag | null> {
  await initializeMobileData();
  const flags = await featureFlagsStore.getAll();
  return flags.find(f => f.key === key) || null;
}

export async function incrementFlagEvaluation(key: string): Promise<FeatureFlag | null> {
  const flag = await getFeatureFlagByKey(key);
  if (!flag) return null;
  return featureFlagsStore.update(flag.id, {
    evaluationCount: flag.evaluationCount + 1,
  });
}

// =============================================================================
// NAVIGATION HELPERS
// =============================================================================

export async function getNavigationMenus(): Promise<NavigationMenu[]> {
  await initializeMobileData();
  return navigationMenusStore.getAll();
}

export async function getNavigationByLocation(location: string): Promise<NavigationMenu | null> {
  await initializeMobileData();
  const menus = await navigationMenusStore.getAll();
  return menus.find(m => m.location === location) || null;
}
