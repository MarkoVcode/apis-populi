// GraphQL Resolvers for Mobile CMS API

import { GraphQLScalarType, Kind } from 'graphql';
import {
  getAppConfig,
  getBanners,
  getBannerById,
  updateBannerStats,
  getArticles,
  getArticleById,
  getArticleBySlug,
  incrementArticleView,
  toggleArticleLike,
  getAuthors,
  getAuthorById,
  getCategories,
  getCategoryById,
  getNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
  getFeatureFlags,
  getFeatureFlagByKey,
  getNavigationMenus,
  getNavigationByLocation,
  resetMobileData,
  BannerFilter,
  ArticleFilter,
  NotificationFilter,
} from '../data/mobile/store';
import {
  applyDynamicAppConfig,
  applyDynamicBanner,
  applyDynamicArticle,
  applyDynamicNotification,
  applyDynamicFeatureFlag,
  applyDynamicNavigation,
  evaluateFeatureFlag,
  getLastSyncedAt,
} from '../data/mobile/dynamics';
import type { Notification, Article, Banner, FeatureFlag } from '../data/mobile/types';

// =============================================================================
// CUSTOM SCALARS
// =============================================================================

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 formatted date-time string',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value).toISOString();
    }
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value).toISOString();
    }
    return null;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJSONLiteral(ast: any): unknown {
  switch (ast.kind) {
    case Kind.STRING:
      return ast.value;
    case Kind.INT:
      return parseInt(ast.value, 10);
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.NULL:
      return null;
    case Kind.LIST:
      return ast.values.map((v: unknown) => parseJSONLiteral(v));
    case Kind.OBJECT: {
      const obj: Record<string, unknown> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ast.fields.forEach((field: any) => {
        obj[field.name.value] = parseJSONLiteral(field.value);
      });
      return obj;
    }
    default:
      return null;
  }
}

const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'Arbitrary JSON value',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    return parseJSONLiteral(ast);
  },
});

// =============================================================================
// PAGINATION HELPERS
// =============================================================================

interface PaginationInput {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

function encodeCursor(id: string): string {
  return Buffer.from(`cursor:${id}`).toString('base64');
}

function decodeCursor(cursor: string): string {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  return decoded.replace('cursor:', '');
}

function paginateItems<T extends { id: string }>(
  items: T[],
  pagination?: PaginationInput
): { edges: Array<{ node: T; cursor: string }>; pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string; endCursor?: string }; totalCount: number } {
  const totalCount = items.length;

  if (!pagination) {
    const edges = items.map((item) => ({
      node: item,
      cursor: encodeCursor(item.id),
    }));
    return {
      edges,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
      totalCount,
    };
  }

  let startIndex = 0;
  let endIndex = items.length;

  // Handle 'after' cursor
  if (pagination.after) {
    const afterId = decodeCursor(pagination.after);
    const afterIndex = items.findIndex((item) => item.id === afterId);
    if (afterIndex !== -1) {
      startIndex = afterIndex + 1;
    }
  }

  // Handle 'before' cursor
  if (pagination.before) {
    const beforeId = decodeCursor(pagination.before);
    const beforeIndex = items.findIndex((item) => item.id === beforeId);
    if (beforeIndex !== -1) {
      endIndex = beforeIndex;
    }
  }

  // Apply 'first' limit
  if (pagination.first !== undefined) {
    endIndex = Math.min(startIndex + pagination.first, endIndex);
  }

  // Apply 'last' limit
  if (pagination.last !== undefined) {
    startIndex = Math.max(endIndex - pagination.last, startIndex);
  }

  const slicedItems = items.slice(startIndex, endIndex);
  const edges = slicedItems.map((item) => ({
    node: item,
    cursor: encodeCursor(item.id),
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage: endIndex < items.length,
      hasPreviousPage: startIndex > 0,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
    },
    totalCount,
  };
}

// =============================================================================
// RESOLVERS
// =============================================================================

export const resolvers = {
  // Custom Scalars
  DateTime: DateTimeScalar,
  JSON: JSONScalar,

  // Interface type resolver for Notification
  Notification: {
    __resolveType(notification: Notification) {
      switch (notification.type) {
        case 'PROMOTIONAL':
          return 'PromotionalNotification';
        case 'TRANSACTIONAL':
          return 'TransactionalNotification';
        case 'SYSTEM':
          return 'SystemNotification';
        case 'REMINDER':
          return 'ReminderNotification';
        case 'SOCIAL':
          return 'SocialNotification';
        default:
          return null;
      }
    },
  },

  // =============================================================================
  // QUERY RESOLVERS
  // =============================================================================
  Query: {
    // App Config
    async appConfig() {
      const config = await getAppConfig();
      if (!config) throw new Error('App config not found');
      return applyDynamicAppConfig(config);
    },

    // Banners
    async banners(_: unknown, { filter, pagination }: { filter?: BannerFilter; pagination?: PaginationInput }) {
      const banners = await getBanners(filter);
      const dynamicBanners = banners.map(applyDynamicBanner);
      return paginateItems(dynamicBanners, pagination);
    },

    async banner(_: unknown, { id }: { id: string }) {
      const banner = await getBannerById(id);
      if (!banner) return null;
      return applyDynamicBanner(banner);
    },

    // Articles
    async articles(_: unknown, { filter, pagination }: { filter?: ArticleFilter; pagination?: PaginationInput }) {
      const articles = await getArticles(filter);
      const dynamicArticles = await Promise.all(
        articles.map(async (article) => {
          const author = await getAuthorById(article.authorId);
          const category = await getCategoryById(article.categoryId);
          return {
            ...applyDynamicArticle(article),
            author,
            category,
          };
        })
      );
      return paginateItems(dynamicArticles, pagination);
    },

    async article(_: unknown, { id }: { id: string }) {
      const article = await getArticleById(id);
      if (!article) return null;
      const author = await getAuthorById(article.authorId);
      const category = await getCategoryById(article.categoryId);
      return {
        ...applyDynamicArticle(article),
        author,
        category,
      };
    },

    async articleBySlug(_: unknown, { slug }: { slug: string }) {
      const article = await getArticleBySlug(slug);
      if (!article) return null;
      const author = await getAuthorById(article.authorId);
      const category = await getCategoryById(article.categoryId);
      return {
        ...applyDynamicArticle(article),
        author,
        category,
      };
    },

    // Notifications
    async notifications(_: unknown, { filter, pagination }: { filter?: NotificationFilter; pagination?: PaginationInput }) {
      const notifications = await getNotifications(filter);
      const dynamicNotifications = notifications.map(applyDynamicNotification);
      const paginated = paginateItems(dynamicNotifications, pagination);
      const unreadCount = await getUnreadCount();

      return {
        ...paginated,
        unreadCount,
      };
    },

    async notification(_: unknown, { id }: { id: string }) {
      const notification = await getNotificationById(id);
      if (!notification) return null;
      return applyDynamicNotification(notification);
    },

    // Feature Flags
    async featureFlags(_: unknown, { context }: { context?: { platform?: string; appVersion?: string; userSegment?: string; userId?: string } }) {
      const flags = await getFeatureFlags();
      const dynamicFlags = flags.map((flag) => {
        const dynamicFlag = applyDynamicFeatureFlag(flag);
        // If context provided, we could evaluate but keep all fields visible
        return dynamicFlag;
      });

      return {
        flags: dynamicFlags,
        evaluatedAt: getLastSyncedAt(),
        context: context || null,
      };
    },

    async featureFlag(_: unknown, { key }: { key: string }) {
      const flag = await getFeatureFlagByKey(key);
      if (!flag) return null;
      return applyDynamicFeatureFlag(flag);
    },

    // Navigation
    async navigation(_: unknown, { location }: { location: string }) {
      const menu = await getNavigationByLocation(location);
      if (!menu) return null;
      return applyDynamicNavigation(menu);
    },

    async navigationMenus() {
      const menus = await getNavigationMenus();
      return menus.map(applyDynamicNavigation);
    },

    // Utility
    async categories() {
      return getCategories();
    },

    async authors() {
      return getAuthors();
    },
  },

  // =============================================================================
  // MUTATION RESOLVERS
  // =============================================================================
  Mutation: {
    async markNotificationRead(_: unknown, { id }: { id: string }) {
      const notification = await markNotificationRead(id);
      if (!notification) return null;
      return applyDynamicNotification(notification);
    },

    async markAllNotificationsRead() {
      const notifications = await markAllNotificationsRead();
      const dynamicNotifications = notifications.map(applyDynamicNotification);
      const paginated = paginateItems(dynamicNotifications);
      const unreadCount = await getUnreadCount();

      return {
        ...paginated,
        unreadCount,
      };
    },

    async trackBannerEvent(_: unknown, { bannerId, event }: { bannerId: string; event: string }) {
      if (event !== 'impression' && event !== 'click') {
        throw new Error('Invalid event type. Must be "impression" or "click"');
      }
      const banner = await updateBannerStats(bannerId, event);
      if (!banner) return null;
      return applyDynamicBanner(banner);
    },

    async trackArticleView(_: unknown, { id }: { id: string }) {
      const article = await incrementArticleView(id);
      if (!article) return null;
      const author = await getAuthorById(article.authorId);
      const category = await getCategoryById(article.categoryId);
      return {
        ...applyDynamicArticle(article),
        author,
        category,
      };
    },

    async toggleArticleLike(_: unknown, { id }: { id: string }) {
      const article = await toggleArticleLike(id);
      if (!article) return null;
      const author = await getAuthorById(article.authorId);
      const category = await getCategoryById(article.categoryId);
      return {
        ...applyDynamicArticle(article),
        author,
        category,
      };
    },

    async resetData() {
      await resetMobileData();
      return {
        success: true,
        message: 'All mobile CMS data has been reset to initial state',
        timestamp: new Date().toISOString(),
      };
    },
  },

  // =============================================================================
  // FIELD RESOLVERS
  // =============================================================================
  Article: {
    async author(article: Article & { author?: unknown }) {
      if (article.author) return article.author;
      return getAuthorById(article.authorId);
    },
    async category(article: Article & { category?: unknown }) {
      if (article.category) return article.category;
      return getCategoryById(article.categoryId);
    },
  },
};
