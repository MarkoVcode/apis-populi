import { NextResponse } from 'next/server';
import { initializeMobileData } from '@/lib/data/mobile/store';

export async function GET() {
  await initializeMobileData();

  return NextResponse.json({
    name: 'Mobile CMS API (GraphQL)',
    version: '1.0.0',
    description: 'GraphQL API for mobile content management system with app configuration, banners, articles, notifications, feature flags, and navigation',
    type: 'GraphQL',
    authentication: {
      required: true,
      method: 'API Key',
      header: 'X-API-Key',
      query_param: 'api_key',
      demo_keys: ['mobile-api-key-1', 'mobile-api-key-2', 'mobile-demo-key'],
    },
    endpoints: {
      graphql: '/api/mobile/graphql',
      schema: '/api/mobile/schema.graphql',
      reset: '/api/mobile/reset',
    },
    features: {
      queries: {
        appConfig: 'Deeply nested app configuration object',
        banners: 'Promotional banners with targeting and scheduling',
        articles: 'Paginated articles with rich content and author info',
        notifications: 'Polymorphic notifications (5 types)',
        featureFlags: 'Feature flags with targeting rules',
        navigation: 'Hierarchical navigation menus',
      },
      mutations: {
        markNotificationRead: 'Mark a notification as read',
        markAllNotificationsRead: 'Mark all notifications as read',
        trackBannerEvent: 'Track banner impressions and clicks',
        trackArticleView: 'Increment article view count',
        toggleArticleLike: 'Like/unlike an article',
        resetData: 'Reset all data to initial state',
      },
      dynamic_content: {
        lastSyncedAt: 'Changes every 5 minutes',
        viewCounts: 'Simulated traffic-based variations',
        contentVariations: 'Minor text changes simulate active editing',
      },
      pagination: 'Relay-style cursor pagination',
      filtering: 'Filter by platform, segment, status, etc.',
    },
    query_examples: {
      appConfig: 'query { appConfig { appVersion theme { primaryColor darkMode { enabled } } } }',
      banners: 'query { banners(filter: { platform: IOS }) { edges { node { title imageUrl } } } }',
      articles: 'query { articles(pagination: { first: 5 }) { edges { node { title author { name } } } } }',
      notifications: 'query { notifications { edges { node { type title ... on PromotionalNotification { discountCode } } } } }',
      featureFlags: 'query { featureFlags { flags { key enabled defaultValue } } }',
      navigation: 'query { navigation(location: "main") { items { label children { label } } } }',
    },
    rate_limit: {
      requests_per_minute: 100,
      burst: 20,
    },
  });
}
