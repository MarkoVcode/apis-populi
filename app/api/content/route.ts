import { NextResponse } from 'next/server';
import { initializeContentData } from '@/lib/data/content/store';

export async function GET() {
  await initializeContentData();

  return NextResponse.json({
    name: 'Content Pages API',
    version: '1.0.0',
    description: 'CMS-like content delivery API with page sections, placements, dynamic content variations, and cookie-based personalization',
    authentication: {
      required: false,
      personalization: {
        method: 'Cookie',
        cookie_name: 'content_personalization',
        description: 'Optional cookie for personalized content. Create via POST /api/content/cookie',
      },
    },
    features: {
      placements: {
        available: ['hero', 'promo', 'sidebar'],
        description: 'Filter page placements using query parameter',
        examples: ['?placement=hero,promo', '?placement=hero&placement=sidebar'],
      },
      dynamic_content: {
        publish_date: 'Changes every 5 minutes',
        editor_variations: 'Small content changes simulate active editing',
        etag: 'Changes with content for cache validation',
      },
      personalization: {
        anonymous: 'Generic content for all users',
        authenticated: 'Personalized greetings and segment-specific content',
        segments: ['anonymous', 'standard', 'premium', 'vip'],
      },
    },
    endpoints: {
      pages: '/api/content/pages',
      page_detail: '/api/content/pages/{slug}',
      cookie_create: 'POST /api/content/cookie',
      cookie_get: 'GET /api/content/cookie',
      cookie_delete: 'DELETE /api/content/cookie',
      openapi: '/api/content/openapi.yaml',
      reset: '/api/content/reset',
    },
    available_pages: [
      'header',
      'footer',
      'main-menu',
      'main-content',
      'how-to',
      'about-company',
      'contact',
      'privacy-policy',
      'terms-of-service',
      'faq',
    ],
    rate_limit: {
      requests_per_minute: 200,
      burst: 40,
    },
  });
}
