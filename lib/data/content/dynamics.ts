import {
  ContentPage,
  ContentPageResponse,
  UserProfile,
  Placement,
} from './types';
import crypto from 'crypto';

// Get publish date that changes every 5 minutes
export function getPublishDate(): string {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const period = Math.floor(now / fiveMinutes) * fiveMinutes;
  return new Date(period).toISOString();
}

// Generate ETag based on page content and time period
export function generateETag(page: ContentPage): string {
  const publishDate = getPublishDate();
  const content = JSON.stringify({
    id: page.id,
    version: page.version,
    publishDate,
  });
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 16);
}

// Random editor variations - simulates active editing
const editorVariations = [
  // Add/remove comma
  (text: string) => {
    if (Math.random() > 0.5 && text.includes(', ')) {
      const commaIndex = text.indexOf(', ');
      return text.slice(0, commaIndex) + text.slice(commaIndex + 1);
    }
    return text;
  },
  // Add comma after certain words
  (text: string) => {
    if (Math.random() > 0.7) {
      const words = ['however', 'therefore', 'moreover', 'also', 'today'];
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b(?!,)`, 'i');
        if (regex.test(text) && Math.random() > 0.5) {
          return text.replace(regex, `${word},`);
        }
      }
    }
    return text;
  },
  // Change "the" to "a" occasionally
  (text: string) => {
    if (Math.random() > 0.8 && text.includes(' the ')) {
      const index = text.indexOf(' the ');
      if (index > -1 && Math.random() > 0.5) {
        return text.slice(0, index) + ' a' + text.slice(index + 4);
      }
    }
    return text;
  },
  // Add/remove trailing period
  (text: string) => {
    if (Math.random() > 0.85) {
      if (text.endsWith('.')) {
        return text.slice(0, -1);
      } else if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
        return text + '.';
      }
    }
    return text;
  },
  // Replace "you" with "you'll" or vice versa
  (text: string) => {
    if (Math.random() > 0.75) {
      if (text.includes(' you ') && Math.random() > 0.5) {
        return text.replace(' you ', " you'll ");
      }
    }
    return text;
  },
  // Add "Updated:" prefix sometimes
  (text: string) => {
    if (Math.random() > 0.9 && !text.startsWith('Updated:')) {
      return 'Updated: ' + text;
    }
    return text;
  },
  // Minor word changes
  (text: string) => {
    if (Math.random() > 0.8) {
      const replacements: [string, string][] = [
        ['amazing', 'wonderful'],
        ['great', 'excellent'],
        ['help', 'assist'],
        ['get', 'receive'],
        ['check out', 'explore'],
      ];
      for (const [from, to] of replacements) {
        if (text.toLowerCase().includes(from) && Math.random() > 0.5) {
          const regex = new RegExp(`\\b${from}\\b`, 'i');
          return text.replace(regex, to);
        }
      }
    }
    return text;
  },
];

// Apply random editor variations to content
export function applyEditorVariations(content: string): string {
  let result = content;

  // Apply 1-3 random variations
  const numVariations = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...editorVariations].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numVariations && i < shuffled.length; i++) {
    result = shuffled[i](result);
  }

  return result;
}

// Apply variations to a placement
function applyPlacementVariations(placement: Placement): Placement {
  return {
    ...placement,
    content: applyEditorVariations(placement.content),
    title: Math.random() > 0.9 ? applyEditorVariations(placement.title) : placement.title,
  };
}

// Personalize content for a user
export function personalizeContent(
  page: ContentPage,
  profile: UserProfile | null
): ContentPageResponse {
  const publishDate = getPublishDate();
  const etag = generateETag(page);

  // Apply editor variations to all placements
  const variatedPlacements = page.placements.map(applyPlacementVariations);

  // Filter placements based on visibility and user status
  const filteredPlacements = variatedPlacements.filter(placement => {
    if (placement.visibility === 'all') return true;
    if (placement.visibility === 'anonymous' && !profile) return true;
    if (placement.visibility === 'authenticated' && profile) return true;
    return false;
  });

  // Personalize content if user profile exists
  let personalizedPlacements = filteredPlacements;
  if (profile) {
    personalizedPlacements = filteredPlacements.map(placement => {
      let content = placement.content;

      // Add personalized greeting for hero banners
      if (placement.position === 'hero' && placement.type === 'banner') {
        // Prepend the personalized greeting
        content = `Welcome back, ${profile.name}! ${content}`;
      }

      // Premium user gets special messaging
      if (profile.segment === 'premium' || profile.segment === 'vip') {
        if (placement.position === 'promo') {
          content = `[Exclusive for ${profile.segment} members] ` + content;
        }
      }

      return { ...placement, content };
    });
  }

  return {
    ...page,
    placements: personalizedPlacements,
    publish_date: publishDate,
    cache_control: 'max-age=300',
    etag,
    personalized: !!profile,
    user: profile
      ? {
          name: profile.name,
          segment: profile.segment,
        }
      : undefined,
  };
}

// Apply dynamic content to a page without personalization
export function applyDynamicContent(page: ContentPage): ContentPageResponse {
  return personalizeContent(page, null);
}
