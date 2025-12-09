import { createStore } from '../../db/store';
import {
  ContentPage,
  UserProfile,
  PlacementPosition,
  VALID_PLACEMENTS,
} from './types';
import { seedContentPages } from './seed';

// Create stores
export const contentPagesStore = createStore<ContentPage>('content', 'pages');
export const userProfilesStore = createStore<UserProfile>('content', 'profiles', 'profile_id');

// Initialization flag
let isInitialized = false;

// Initialize content data
export async function initializeContentData(): Promise<void> {
  if (isInitialized) return;

  const existingPages = await contentPagesStore.getAll();
  if (existingPages.length > 0) {
    isInitialized = true;
    return;
  }

  // Seed data sequentially to avoid race condition in index updates
  for (const page of seedContentPages) {
    await contentPagesStore.set(page);
  }
  isInitialized = true;
}

// Reset content data
export async function resetContentData(): Promise<void> {
  // Clear existing data
  await contentPagesStore.clear();
  await userProfilesStore.clear();

  // Reset initialization flag
  isInitialized = false;

  // Seed pages sequentially to avoid race condition in index updates
  for (const page of seedContentPages) {
    await contentPagesStore.set(page);
  }

  isInitialized = true;
}

// Get page by slug
export async function getPageBySlug(slug: string): Promise<ContentPage | null> {
  await initializeContentData();
  const pages = await contentPagesStore.getAll();
  return pages.find(p => p.slug === slug) || null;
}

// Get page with filtered placements
export async function getPageWithPlacements(
  slug: string,
  requestedPlacements?: PlacementPosition[]
): Promise<ContentPage | null> {
  const page = await getPageBySlug(slug);
  if (!page) return null;

  // If no specific placements requested, return all
  if (!requestedPlacements || requestedPlacements.length === 0) {
    return page;
  }

  // Filter placements
  const filteredPlacements = page.placements.filter(p =>
    requestedPlacements.includes(p.position)
  );

  return {
    ...page,
    placements: filteredPlacements,
  };
}

// Parse placements from query string
export function parsePlacements(searchParams: URLSearchParams): PlacementPosition[] {
  const placements: string[] = [];

  // Get all placement params
  const values = searchParams.getAll('placement');

  for (const value of values) {
    // Split comma-separated values
    placements.push(...value.split(',').map(p => p.trim().toLowerCase()));
  }

  // Deduplicate and validate
  const unique = [...new Set(placements)];
  return unique.filter(p => VALID_PLACEMENTS.includes(p as PlacementPosition)) as PlacementPosition[];
}

// User profile management
export async function createUserProfile(profile: UserProfile): Promise<void> {
  await userProfilesStore.set(profile);
}

export async function getUserProfile(profileId: string): Promise<UserProfile | null> {
  return userProfilesStore.get(profileId);
}

export async function deleteUserProfile(profileId: string): Promise<boolean> {
  return userProfilesStore.delete(profileId);
}

// Get all pages (for listing)
export async function getAllPages(): Promise<ContentPage[]> {
  await initializeContentData();
  return contentPagesStore.getAll();
}
