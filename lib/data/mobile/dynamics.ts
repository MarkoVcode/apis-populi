// Dynamic content simulation for Mobile CMS
// Makes content appear "alive" with time-based variations

import {
  AppConfig,
  Banner,
  Article,
  Notification,
  FeatureFlag,
  NavigationMenu,
} from './types';

// =============================================================================
// TIME-BASED HELPERS
// =============================================================================

// Get a timestamp that changes every 5 minutes (deterministic)
export function getLastSyncedAt(): string {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const period = Math.floor(now / fiveMinutes) * fiveMinutes;
  return new Date(period).toISOString();
}

// Get a modified timestamp with slight variation
export function getModifiedAt(baseDate: string): string {
  const base = new Date(baseDate).getTime();
  const now = Date.now();
  const minutesSinceBase = Math.floor((now - base) / 60000);
  // Add variation based on minutes elapsed, reset every hour
  const variation = (minutesSinceBase % 60) * 60000;
  return new Date(base + variation).toISOString();
}

// Simple hash function for deterministic variations
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// =============================================================================
// TRAFFIC SIMULATION
// =============================================================================

// Traffic multiplier based on time of day
function getTrafficMultiplier(): number {
  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 12) return 1.5;   // Morning peak
  if (hour >= 18 && hour <= 21) return 2.0;  // Evening peak
  if (hour >= 0 && hour <= 6) return 0.3;    // Night low
  return 1.0;
}

// Get simulated count with traffic-based variations
export function getSimulatedCount(baseCount: number, id: string): number {
  const trafficMultiplier = getTrafficMultiplier();
  const idHash = hashCode(id);
  const minuteOfHour = new Date().getMinutes();

  // Add variation based on hash and current minute
  const variation = Math.floor((idHash % 100) * trafficMultiplier);
  const minuteVariation = Math.floor(minuteOfHour / 10) * (idHash % 10);

  return baseCount + variation + minuteVariation;
}

// =============================================================================
// CONTENT VARIATIONS (simulates editor changes)
// =============================================================================

const textVariations: Array<(text: string, seed: number) => string> = [
  // Minor punctuation changes
  (text, seed) => {
    if (seed % 10 === 0 && text.includes('!')) {
      return text.replace('!', '.');
    }
    return text;
  },
  // Word substitutions
  (text, seed) => {
    if (seed % 7 === 0) {
      const subs: [string, string][] = [
        ['amazing', 'incredible'],
        ['great', 'fantastic'],
        ['new', 'latest'],
        ['now', 'today'],
        ['get', 'grab'],
      ];
      for (const [from, to] of subs) {
        if (text.toLowerCase().includes(from)) {
          return text.replace(new RegExp(`\\b${from}\\b`, 'i'), to);
        }
      }
    }
    return text;
  },
  // Add/remove trailing punctuation
  (text, seed) => {
    if (seed % 15 === 0) {
      if (text.endsWith('.')) {
        return text.slice(0, -1);
      } else if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
        return text + '.';
      }
    }
    return text;
  },
];

// Apply content variation based on time and ID
export function applyContentVariation(text: string, id: string): string {
  const seed = hashCode(id) + new Date().getMinutes();
  let result = text;

  for (const variation of textVariations) {
    result = variation(result, seed);
  }

  return result;
}

// =============================================================================
// ENTITY-SPECIFIC DYNAMIC FUNCTIONS
// =============================================================================

// Apply dynamic fields to AppConfig
export function applyDynamicAppConfig(config: AppConfig): AppConfig & { lastSyncedAt: string } {
  return {
    ...config,
    updatedAt: getModifiedAt(config.updatedAt),
    lastSyncedAt: getLastSyncedAt(),
  };
}

// Apply dynamic fields to Banner
export function applyDynamicBanner(banner: Banner): Banner & { lastUpdatedAt: string } {
  return {
    ...banner,
    title: applyContentVariation(banner.title, banner.id),
    subtitle: banner.subtitle ? applyContentVariation(banner.subtitle, banner.id) : undefined,
    impressions: getSimulatedCount(banner.impressions, banner.id),
    lastUpdatedAt: getModifiedAt(banner.schedule.startDate),
  };
}

// Apply dynamic fields to Article
export function applyDynamicArticle(article: Article): Article & { modifiedAt: string } {
  return {
    ...article,
    viewCount: getSimulatedCount(article.viewCount, article.id),
    likeCount: getSimulatedCount(article.likeCount, article.id + '-likes'),
    modifiedAt: getModifiedAt(article.publishedAt || article.createdAt),
  };
}

// Apply dynamic fields to Notification
export function applyDynamicNotification<T extends Notification>(notification: T): T {
  // Make some notifications appear "fresher"
  const hash = hashCode(notification.id);
  const minutesAgo = hash % 60;
  const hourAgo = Date.now() - (60 * 60 * 1000);

  // If notification is older than an hour and hash condition met, make it appear recent
  const originalTime = new Date(notification.createdAt).getTime();
  if (originalTime < hourAgo && hash % 5 === 0) {
    const freshTime = new Date(Date.now() - minutesAgo * 60000).toISOString();
    return {
      ...notification,
      createdAt: freshTime,
    };
  }

  return notification;
}

// Apply dynamic fields to FeatureFlag
export function applyDynamicFeatureFlag(flag: FeatureFlag): FeatureFlag & { lastEvaluatedAt: string } {
  return {
    ...flag,
    evaluationCount: getSimulatedCount(flag.evaluationCount, flag.key),
    lastEvaluatedAt: getLastSyncedAt(),
    metadata: {
      ...flag.metadata,
      updatedAt: getModifiedAt(flag.metadata.updatedAt),
    },
  };
}

// Apply dynamic fields to NavigationMenu
export function applyDynamicNavigation(menu: NavigationMenu): NavigationMenu {
  // Update badge counts based on time
  const dynamicItems = menu.items.map(item => {
    if (item.badge?.count !== undefined) {
      const dynamicCount = getSimulatedCount(item.badge.count, item.id);
      return {
        ...item,
        badge: {
          ...item.badge,
          count: dynamicCount,
        },
      };
    }
    return item;
  });

  return {
    ...menu,
    items: dynamicItems,
    updatedAt: getModifiedAt(menu.updatedAt),
  };
}

// =============================================================================
// EVALUATION CONTEXT HELPERS
// =============================================================================

export interface EvaluationContext {
  platform?: string;
  appVersion?: string;
  userSegment?: string;
  userId?: string;
}

// Compare versions (simple semver comparison)
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 !== p2) return p1 - p2;
  }
  return 0;
}

// Evaluate a rule condition
export function evaluateCondition(
  condition: { attribute: string; operator: string; value: unknown },
  context: EvaluationContext
): boolean {
  const contextValue = getContextValue(condition.attribute, context);

  switch (condition.operator) {
    case 'equals':
      return contextValue === condition.value;
    case 'notEquals':
      return contextValue !== condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(contextValue);
    case 'notIn':
      return Array.isArray(condition.value) && !condition.value.includes(contextValue);
    case 'greaterThan':
      if (condition.attribute === 'appVersion' && typeof contextValue === 'string' && typeof condition.value === 'string') {
        return compareVersions(contextValue, condition.value) > 0;
      }
      return Number(contextValue) > Number(condition.value);
    case 'lessThan':
      if (condition.attribute === 'appVersion' && typeof contextValue === 'string' && typeof condition.value === 'string') {
        return compareVersions(contextValue, condition.value) < 0;
      }
      return Number(contextValue) < Number(condition.value);
    case 'contains':
      return typeof contextValue === 'string' && typeof condition.value === 'string' &&
        contextValue.toLowerCase().includes(condition.value.toLowerCase());
    default:
      return false;
  }
}

function getContextValue(attribute: string, context: EvaluationContext): unknown {
  switch (attribute) {
    case 'platform':
      return context.platform;
    case 'appVersion':
      return context.appVersion;
    case 'userSegment':
      return context.userSegment;
    case 'userId':
      return context.userId;
    default:
      return undefined;
  }
}

// Evaluate feature flag rules against context
export function evaluateFeatureFlag(
  flag: FeatureFlag,
  context: EvaluationContext
): unknown {
  if (!flag.enabled) {
    return flag.defaultValue;
  }

  // Sort rules by priority
  const sortedRules = [...flag.rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    // Check all conditions
    const allConditionsMet = rule.conditions.every(condition =>
      evaluateCondition(condition, context)
    );

    if (allConditionsMet) {
      // Handle percentage rollout
      if (rule.percentage !== undefined && rule.percentage < 100) {
        const hash = hashCode(context.userId || 'anonymous' + flag.key);
        const bucket = hash % 100;
        if (bucket >= rule.percentage) {
          continue; // Skip this rule, try next
        }
      }

      return rule.value;
    }
  }

  return flag.defaultValue;
}
