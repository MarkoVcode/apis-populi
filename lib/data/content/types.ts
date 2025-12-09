// Content Pages API Types

export type PlacementPosition = 'hero' | 'promo' | 'sidebar';
export type PlacementType = 'banner' | 'text' | 'cta' | 'navigation' | 'widget';
export type Visibility = 'all' | 'anonymous' | 'authenticated';
export type UserSegment = 'anonymous' | 'standard' | 'premium' | 'vip';

export interface CallToAction {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | 'link';
}

export interface Placement {
  id: string;
  position: PlacementPosition;
  type: PlacementType;
  title: string;
  content: string;
  cta?: CallToAction;
  image_url?: string;
  priority: number;
  visibility: Visibility;
}

export interface PageMeta {
  keywords: string[];
  author: string;
  canonical_url: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  placements: Placement[];
  meta: PageMeta;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  locale?: string;
  interests?: string[];
}

export interface UserProfile {
  id?: string; // Alias for profile_id (for DataStore compatibility)
  profile_id: string;
  name: string;
  email?: string;
  preferences: UserPreferences;
  segment: UserSegment;
  created_at: string;
}

export interface ContentPageResponse extends ContentPage {
  // Dynamic fields added at response time
  publish_date: string;
  cache_control: string;
  etag: string;

  // Personalization info (if cookie present)
  personalized: boolean;
  user?: {
    name: string;
    segment: UserSegment;
  };
}

export interface ContentPageListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  placement_count: number;
  created_at: string;
  updated_at: string;
}

export interface CookieCreateRequest {
  name: string;
  email?: string;
  preferences?: UserPreferences;
  segment?: UserSegment;
}

export interface CookieResponse {
  profile_id: string;
  name: string;
  email?: string;
  preferences: UserPreferences;
  segment: UserSegment;
  created_at: string;
  message: string;
}

// Valid placements constant for validation
export const VALID_PLACEMENTS: PlacementPosition[] = ['hero', 'promo', 'sidebar'];
export const VALID_SEGMENTS: UserSegment[] = ['anonymous', 'standard', 'premium', 'vip'];
