// Mobile CMS Seed Data

import {
  AppConfig,
  Banner,
  Article,
  Author,
  Category,
  Notification,
  FeatureFlag,
  NavigationMenu,
} from './types';

// =============================================================================
// APP CONFIG (1 instance)
// =============================================================================

export const appConfigSeed: AppConfig = {
  id: 'app-config-main',
  appVersion: '2.5.0',
  minimumSupportedVersion: '2.0.0',
  forceUpdate: false,
  maintenance: {
    enabled: false,
    message: 'We are performing scheduled maintenance. Please check back soon.',
    estimatedEndTime: undefined,
    allowedUserIds: ['admin-001', 'tester-001'],
  },
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'Inter, system-ui, sans-serif',
    darkMode: {
      enabled: true,
      automatic: true,
      scheduleStart: '20:00',
      scheduleEnd: '07:00',
    },
    customCSS: undefined,
  },
  api: {
    baseUrl: 'https://api.example.com/v2',
    timeout: 30000,
    retryAttempts: 3,
    cachePolicy: {
      defaultTTL: 300,
      maxAge: 3600,
      staleWhileRevalidate: true,
    },
  },
  analytics: {
    enabled: true,
    providers: [
      { name: 'Firebase', enabled: true, trackingId: 'UA-FIREBASE-001' },
      { name: 'Mixpanel', enabled: true, trackingId: 'MP-PROJECT-001' },
      { name: 'Amplitude', enabled: false, trackingId: undefined },
    ],
    sampleRate: 0.95,
  },
  updatedAt: '2024-12-15T10:30:00Z',
};

// =============================================================================
// AUTHORS (5 instances)
// =============================================================================

export const authorsSeed: Author[] = [
  {
    id: 'author-001',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    bio: 'Senior Tech Writer with 10+ years of experience in mobile development.',
    role: 'Senior Editor',
    socialLinks: {
      twitter: '@sarahchen_tech',
      linkedin: 'sarahchen',
      website: 'https://sarahchen.dev',
    },
  },
  {
    id: 'author-002',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Product strategist and UX enthusiast.',
    role: 'Product Writer',
    socialLinks: {
      twitter: '@marcusj',
      linkedin: 'marcus-johnson',
    },
  },
  {
    id: 'author-003',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Lifestyle and wellness content creator.',
    role: 'Contributing Writer',
    socialLinks: {
      website: 'https://elenawrites.com',
    },
  },
  {
    id: 'author-004',
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Breaking news and current events specialist.',
    role: 'News Editor',
    socialLinks: {
      twitter: '@davidpark_news',
    },
  },
  {
    id: 'author-005',
    name: 'AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
    bio: 'Automated content assistant for quick updates.',
    role: 'Bot',
  },
];

// =============================================================================
// CATEGORIES (6 instances)
// =============================================================================

export const categoriesSeed: Category[] = [
  { id: 'cat-tech', name: 'Technology', slug: 'technology', color: '#3B82F6', icon: 'cpu' },
  { id: 'cat-lifestyle', name: 'Lifestyle', slug: 'lifestyle', color: '#EC4899', icon: 'heart' },
  { id: 'cat-tutorial', name: 'Tutorials', slug: 'tutorials', color: '#10B981', icon: 'book' },
  { id: 'cat-news', name: 'News', slug: 'news', color: '#F59E0B', icon: 'newspaper' },
  { id: 'cat-product', name: 'Product Updates', slug: 'product-updates', color: '#8B5CF6', icon: 'package' },
  { id: 'cat-community', name: 'Community', slug: 'community', color: '#06B6D4', icon: 'users' },
];

// =============================================================================
// BANNERS (10 instances)
// =============================================================================

export const bannersSeed: Banner[] = [
  {
    id: 'banner-001',
    title: 'Summer Sale - Up to 50% Off!',
    subtitle: 'Limited time offer on premium features',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=200',
    backgroundColor: '#FEF3C7',
    textColor: '#92400E',
    cta: { text: 'Shop Now', url: '/sale', deepLink: 'app://sale', action: 'navigate' },
    style: 'FULL_WIDTH',
    placement: 'home_hero',
    priority: 1,
    targeting: { platforms: ['ALL'], segments: ['ALL'], countries: ['US', 'CA', 'GB'] },
    schedule: { startDate: '2024-12-01T00:00:00Z', endDate: '2024-12-31T23:59:59Z', timezone: 'UTC' },
    analytics: { campaignId: 'summer-sale-2024', source: 'app', medium: 'banner' },
    impressions: 45230,
    clicks: 3421,
  },
  {
    id: 'banner-002',
    title: 'New Feature: Dark Mode',
    subtitle: 'Try our beautiful new dark theme',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    backgroundColor: '#1F2937',
    textColor: '#F9FAFB',
    cta: { text: 'Enable Now', url: '/settings/theme', deepLink: 'app://settings/theme' },
    style: 'CARD',
    placement: 'home_bottom',
    priority: 2,
    targeting: { platforms: ['IOS', 'ANDROID'], segments: ['RETURNING_USERS'], minAppVersion: '2.3.0' },
    schedule: { startDate: '2024-11-15T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'dark-mode-launch', source: 'app' },
    impressions: 28150,
    clicks: 8934,
  },
  {
    id: 'banner-003',
    title: 'Invite Friends, Get Rewards',
    subtitle: 'Share the love and earn credits',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    backgroundColor: '#ECFDF5',
    textColor: '#065F46',
    cta: { text: 'Start Sharing', url: '/referral', deepLink: 'app://referral' },
    style: 'FLOATING',
    placement: 'profile_top',
    priority: 3,
    targeting: { platforms: ['ALL'], segments: ['PREMIUM', 'RETURNING_USERS'] },
    schedule: { startDate: '2024-10-01T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'referral-q4', source: 'app', medium: 'floating' },
    impressions: 15670,
    clicks: 2341,
  },
  {
    id: 'banner-004',
    title: 'Premium Upgrade',
    subtitle: 'Unlock all features for $9.99/mo',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
    backgroundColor: '#FDF4FF',
    textColor: '#86198F',
    cta: { text: 'Upgrade', url: '/premium', deepLink: 'app://premium' },
    style: 'INLINE',
    placement: 'article_bottom',
    priority: 4,
    targeting: { platforms: ['ALL'], segments: ['FREE', 'NEW_USERS'] },
    schedule: { startDate: '2024-09-01T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'premium-conversion', source: 'app' },
    impressions: 92340,
    clicks: 4521,
  },
  {
    id: 'banner-005',
    title: 'iOS 18 Optimized',
    subtitle: 'Experience the best on your new iPhone',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
    backgroundColor: '#EFF6FF',
    textColor: '#1E40AF',
    cta: { text: 'Learn More', url: '/ios18', deepLink: 'app://features/ios18' },
    style: 'FULL_WIDTH',
    placement: 'home_hero',
    priority: 5,
    targeting: { platforms: ['IOS'], segments: ['ALL'], minAppVersion: '2.5.0' },
    schedule: { startDate: '2024-12-10T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'ios18-launch', source: 'app' },
    impressions: 8920,
    clicks: 1245,
  },
  {
    id: 'banner-006',
    title: 'Android Widget Now Available',
    subtitle: 'Quick access right from your home screen',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    backgroundColor: '#F0FDF4',
    textColor: '#166534',
    cta: { text: 'Add Widget', url: '/widget', deepLink: 'app://widget/setup' },
    style: 'CARD',
    placement: 'home_bottom',
    priority: 6,
    targeting: { platforms: ['ANDROID'], segments: ['ALL'] },
    schedule: { startDate: '2024-11-01T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'android-widget', source: 'app' },
    impressions: 12450,
    clicks: 3210,
  },
  {
    id: 'banner-007',
    title: 'Holiday Special',
    subtitle: 'Gift subscriptions now available',
    imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800',
    backgroundColor: '#FEF2F2',
    textColor: '#991B1B',
    cta: { text: 'Gift Now', url: '/gift', deepLink: 'app://gift' },
    style: 'FULL_WIDTH',
    placement: 'category_top',
    priority: 1,
    targeting: { platforms: ['ALL'], segments: ['PREMIUM', 'RETURNING_USERS'], countries: ['US', 'CA'] },
    schedule: { startDate: '2024-12-15T00:00:00Z', endDate: '2024-12-26T23:59:59Z', timezone: 'America/New_York', daysOfWeek: [0, 6] },
    analytics: { campaignId: 'holiday-2024', source: 'app', medium: 'banner' },
    impressions: 5430,
    clicks: 876,
  },
  {
    id: 'banner-008',
    title: 'Join Our Community',
    subtitle: 'Connect with 1M+ users worldwide',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    backgroundColor: '#FFF7ED',
    textColor: '#9A3412',
    cta: { text: 'Join Discord', url: 'https://discord.gg/example', action: 'external' },
    style: 'INLINE',
    placement: 'article_bottom',
    priority: 7,
    targeting: { platforms: ['ALL'], segments: ['NEW_USERS', 'FREE'] },
    schedule: { startDate: '2024-08-01T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'community-growth', source: 'app' },
    impressions: 67890,
    clicks: 5432,
  },
  {
    id: 'banner-009',
    title: 'Rate Us on App Store',
    subtitle: 'Help us reach more users',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    backgroundColor: '#FFFBEB',
    textColor: '#B45309',
    cta: { text: 'Rate Now', url: 'itms-apps://itunes.apple.com/app/id123456', action: 'external' },
    style: 'FLOATING',
    placement: 'profile_bottom',
    priority: 8,
    targeting: { platforms: ['IOS'], segments: ['RETURNING_USERS', 'PREMIUM'] },
    schedule: { startDate: '2024-06-01T00:00:00Z', timezone: 'UTC' },
    analytics: { campaignId: 'app-store-rating', source: 'app' },
    impressions: 23450,
    clicks: 1876,
  },
  {
    id: 'banner-010',
    title: 'Free Trial Extended',
    subtitle: 'Try Premium free for 30 days',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    backgroundColor: '#F5F3FF',
    textColor: '#5B21B6',
    cta: { text: 'Start Trial', url: '/trial', deepLink: 'app://premium/trial' },
    style: 'CARD',
    placement: 'home_hero',
    priority: 2,
    targeting: { platforms: ['ALL'], segments: ['FREE', 'NEW_USERS'] },
    schedule: { startDate: '2024-12-01T00:00:00Z', endDate: '2025-01-15T23:59:59Z', timezone: 'UTC' },
    analytics: { campaignId: 'trial-extension', source: 'app' },
    impressions: 34560,
    clicks: 6789,
  },
];

// =============================================================================
// ARTICLES (18 instances)
// =============================================================================

export const articlesSeed: Article[] = [
  {
    id: 'article-001',
    slug: 'getting-started-with-our-app',
    title: 'Getting Started: Your Complete Guide',
    excerpt: 'Learn how to set up and get the most out of our mobile application in just 5 minutes.',
    content: `# Getting Started with Our App

Welcome to our comprehensive getting started guide! This tutorial will walk you through everything you need to know to become a power user.

## Step 1: Create Your Account

First, download the app from your device's app store and create an account. You can sign up using:
- Email and password
- Google Sign-In
- Apple ID

## Step 2: Customize Your Profile

Head to Settings > Profile to customize your experience. You can:
- Upload a profile picture
- Set your display name
- Choose your preferred language

## Step 3: Explore Features

Take a tour of our main features:
1. **Dashboard** - Your personalized home screen
2. **Discover** - Find new content and recommendations
3. **Library** - Access your saved items

Happy exploring!`,
    authorId: 'author-001',
    categoryId: 'cat-tutorial',
    tags: ['getting-started', 'tutorial', 'beginner'],
    featuredImage: {
      id: 'img-001',
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
      altText: 'Mobile app on smartphone',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 5,
    status: 'PUBLISHED',
    publishedAt: '2024-11-01T09:00:00Z',
    createdAt: '2024-10-28T14:30:00Z',
    viewCount: 15234,
    likeCount: 892,
  },
  {
    id: 'article-002',
    slug: 'dark-mode-deep-dive',
    title: 'Dark Mode: A Deep Dive into Our New Theme',
    excerpt: 'Explore the science behind dark mode and how we designed ours for maximum comfort.',
    content: `# Dark Mode: A Deep Dive

Our new dark mode isn't just an inverted color scheme - it's a carefully crafted experience designed for your eyes.

## Why Dark Mode?

Studies show that dark mode can:
- Reduce eye strain in low-light conditions
- Save battery life on OLED screens
- Improve focus for some users

## Our Design Philosophy

We chose a neutral dark gray (#1F2937) instead of pure black to reduce contrast harshness. Our accent colors were adjusted for optimal visibility.

## How to Enable

1. Go to Settings
2. Select Theme
3. Choose "Dark" or "Auto"

The auto setting will switch based on your system preferences or the time of day.`,
    authorId: 'author-002',
    categoryId: 'cat-product',
    tags: ['dark-mode', 'design', 'accessibility', 'ui'],
    featuredImage: {
      id: 'img-002',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
      altText: 'Dark mode interface',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 4,
    status: 'PUBLISHED',
    publishedAt: '2024-11-15T11:00:00Z',
    createdAt: '2024-11-10T16:20:00Z',
    viewCount: 8765,
    likeCount: 543,
  },
  {
    id: 'article-003',
    slug: 'productivity-tips-for-busy-professionals',
    title: '10 Productivity Tips for Busy Professionals',
    excerpt: 'Maximize your efficiency with these expert tips tailored for the modern professional.',
    content: `# 10 Productivity Tips for Busy Professionals

In today's fast-paced world, every minute counts. Here are our top tips to help you stay productive.

## 1. Time Blocking

Schedule specific blocks for different tasks. Our app's calendar integration makes this seamless.

## 2. The Two-Minute Rule

If a task takes less than two minutes, do it immediately.

## 3. Batch Similar Tasks

Group similar activities together to maintain focus.

## 4. Use Focus Mode

Enable our Focus Mode to minimize distractions during deep work sessions.

## 5. Regular Breaks

Use the Pomodoro technique - 25 minutes of work, 5 minutes of rest.

...and more tips inside!`,
    authorId: 'author-003',
    categoryId: 'cat-lifestyle',
    tags: ['productivity', 'tips', 'work-life-balance', 'professionals'],
    featuredImage: {
      id: 'img-003',
      url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200',
      altText: 'Professional workspace',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 7,
    status: 'PUBLISHED',
    publishedAt: '2024-11-20T08:00:00Z',
    createdAt: '2024-11-18T10:15:00Z',
    viewCount: 12456,
    likeCount: 1023,
  },
  {
    id: 'article-004',
    slug: 'app-update-v2-5-release-notes',
    title: 'Version 2.5 Release Notes: What\'s New',
    excerpt: 'Discover all the exciting new features and improvements in our latest update.',
    content: `# Version 2.5 Release Notes

We're thrilled to announce version 2.5, our biggest update yet!

## New Features

### Enhanced Dark Mode
- Automatic scheduling
- OLED-optimized true black option
- Custom accent colors

### Performance Improvements
- 40% faster app launch
- Reduced memory usage
- Smoother animations

### New Widgets (Android)
- Quick action widget
- Stats at a glance
- Customizable layouts

## Bug Fixes
- Fixed notification sync issues
- Resolved rare crash on startup
- Improved offline mode reliability

Thank you for your continued support!`,
    authorId: 'author-004',
    categoryId: 'cat-product',
    tags: ['release-notes', 'update', 'v2.5', 'features'],
    featuredImage: {
      id: 'img-004',
      url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
      altText: 'App update',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 3,
    status: 'PUBLISHED',
    publishedAt: '2024-12-10T15:00:00Z',
    createdAt: '2024-12-08T11:30:00Z',
    viewCount: 23456,
    likeCount: 1876,
  },
  {
    id: 'article-005',
    slug: 'interview-with-our-founder',
    title: 'Founder Interview: Building for the Future',
    excerpt: 'An exclusive interview with our CEO about the company vision and what\'s next.',
    content: `# Interview with Our Founder

We sat down with our CEO to discuss the journey so far and the exciting road ahead.

## Q: What inspired you to start this company?

"I noticed a gap in the market for truly user-friendly productivity tools. Our mission has always been to make technology work for people, not the other way around."

## Q: What's your proudest achievement?

"Reaching 10 million active users while maintaining a 4.8-star rating. It shows that our community-first approach works."

## Q: What can users expect next?

"We're working on some game-changing features around AI-powered automation. Stay tuned for our 2025 roadmap announcement!"`,
    authorId: 'author-001',
    categoryId: 'cat-news',
    tags: ['interview', 'founder', 'company', 'vision'],
    featuredImage: {
      id: 'img-005',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200',
      altText: 'Business professional',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 6,
    status: 'PUBLISHED',
    publishedAt: '2024-12-05T10:00:00Z',
    createdAt: '2024-12-01T09:00:00Z',
    viewCount: 9876,
    likeCount: 654,
  },
  {
    id: 'article-006',
    slug: 'community-spotlight-december',
    title: 'Community Spotlight: December 2024',
    excerpt: 'Celebrating our amazing community members and their creative use cases.',
    content: `# Community Spotlight: December 2024

Every month, we highlight incredible members of our community who inspire us all.

## Featured User: @ProductivityPro

Maria from Barcelona has created an entire workflow system using our app that she shares with over 50,000 followers.

## Top Community Contributions

1. Custom theme pack by @DesignMaster
2. Integration tutorial by @TechGuru
3. Beginner's guide translation (Spanish) by @LocalHero

## Join the Conversation

- Discord: 50,000+ members
- Reddit: r/OurAppCommunity
- Twitter: #OurAppTips`,
    authorId: 'author-003',
    categoryId: 'cat-community',
    tags: ['community', 'spotlight', 'users', 'december'],
    featuredImage: {
      id: 'img-006',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
      altText: 'Community members',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 4,
    status: 'PUBLISHED',
    publishedAt: '2024-12-01T12:00:00Z',
    createdAt: '2024-11-28T14:00:00Z',
    viewCount: 5432,
    likeCount: 432,
  },
  {
    id: 'article-007',
    slug: 'mastering-keyboard-shortcuts',
    title: 'Master These Keyboard Shortcuts to Work Faster',
    excerpt: 'Level up your efficiency with these essential keyboard shortcuts for power users.',
    content: `# Mastering Keyboard Shortcuts

Keyboard shortcuts can dramatically speed up your workflow. Here are the essentials.

## Navigation

- **Cmd/Ctrl + K**: Quick search
- **Cmd/Ctrl + N**: New item
- **Cmd/Ctrl + Shift + P**: Command palette

## Editing

- **Cmd/Ctrl + B**: Bold text
- **Cmd/Ctrl + I**: Italic text
- **Cmd/Ctrl + Z**: Undo

## Pro Tips

Hold Shift with any navigation shortcut to select content as you move.

Download our shortcut cheatsheet in the Settings menu!`,
    authorId: 'author-001',
    categoryId: 'cat-tutorial',
    tags: ['shortcuts', 'productivity', 'tips', 'power-user'],
    featuredImage: {
      id: 'img-007',
      url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200',
      altText: 'Keyboard',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 3,
    status: 'PUBLISHED',
    publishedAt: '2024-11-25T09:00:00Z',
    createdAt: '2024-11-22T11:00:00Z',
    viewCount: 7654,
    likeCount: 567,
  },
  {
    id: 'article-008',
    slug: 'ai-features-coming-2025',
    title: 'AI Features Coming in 2025: A Preview',
    excerpt: 'Get a sneak peek at the AI-powered features we\'re building for next year.',
    content: `# AI Features Coming in 2025

We're investing heavily in AI to make your experience even better.

## Smart Suggestions

Our AI will learn your patterns and suggest actions before you even think of them.

## Automated Workflows

Create complex automations using natural language. Just describe what you want!

## Intelligent Search

Find anything instantly with semantic search that understands context.

## Privacy First

All AI features are optional and process data locally when possible.

Join our beta program to try these features early!`,
    authorId: 'author-002',
    categoryId: 'cat-tech',
    tags: ['ai', '2025', 'preview', 'roadmap', 'machine-learning'],
    featuredImage: {
      id: 'img-008',
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
      altText: 'AI concept',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 5,
    status: 'PUBLISHED',
    publishedAt: '2024-12-12T14:00:00Z',
    createdAt: '2024-12-10T09:00:00Z',
    viewCount: 18765,
    likeCount: 2345,
  },
  {
    id: 'article-009',
    slug: 'work-from-home-setup-guide',
    title: 'The Ultimate Work From Home Setup Guide',
    excerpt: 'Create the perfect home office environment for maximum productivity.',
    content: `# The Ultimate Work From Home Setup Guide

Working from home requires the right environment. Here's how to set it up.

## Essential Hardware

1. Ergonomic chair - Your back will thank you
2. External monitor - More screen real estate
3. Quality webcam - For professional video calls
4. Good lighting - Reduce eye strain

## Software Stack

Combine our app with these tools:
- Video conferencing
- Time tracking
- Cloud storage

## Productivity Environment

- Dedicated workspace
- Noise management
- Regular break schedule`,
    authorId: 'author-003',
    categoryId: 'cat-lifestyle',
    tags: ['work-from-home', 'setup', 'productivity', 'remote-work'],
    featuredImage: {
      id: 'img-009',
      url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200',
      altText: 'Home office',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 6,
    status: 'PUBLISHED',
    publishedAt: '2024-11-08T10:00:00Z',
    createdAt: '2024-11-05T13:00:00Z',
    viewCount: 11234,
    likeCount: 876,
  },
  {
    id: 'article-010',
    slug: 'security-best-practices',
    title: 'Security Best Practices: Protect Your Account',
    excerpt: 'Keep your account safe with these essential security recommendations.',
    content: `# Security Best Practices

Your security is our top priority. Here's how to maximize your protection.

## Enable Two-Factor Authentication

2FA adds an extra layer of security beyond your password.

1. Go to Settings > Security
2. Enable Two-Factor Authentication
3. Choose your preferred method (Authenticator app recommended)

## Strong Passwords

- Use at least 12 characters
- Mix uppercase, lowercase, numbers, and symbols
- Never reuse passwords

## Regular Security Checks

We recommend reviewing your security settings monthly.`,
    authorId: 'author-004',
    categoryId: 'cat-tutorial',
    tags: ['security', '2fa', 'privacy', 'account'],
    featuredImage: {
      id: 'img-010',
      url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
      altText: 'Security lock',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 4,
    status: 'PUBLISHED',
    publishedAt: '2024-10-15T09:00:00Z',
    createdAt: '2024-10-12T10:30:00Z',
    viewCount: 6543,
    likeCount: 432,
  },
  {
    id: 'article-011',
    slug: 'integration-with-slack',
    title: 'How to Integrate with Slack for Team Collaboration',
    excerpt: 'Connect your account with Slack to streamline team communication.',
    content: `# Integrating with Slack

Boost your team's productivity by connecting with Slack.

## Setup Process

1. Go to Integrations in Settings
2. Click "Connect Slack"
3. Authorize the app in Slack
4. Choose which notifications to receive

## Available Features

- Instant notifications in Slack channels
- Create items directly from Slack
- Daily/weekly digests
- @mention support

Perfect for distributed teams!`,
    authorId: 'author-001',
    categoryId: 'cat-tutorial',
    tags: ['integration', 'slack', 'teams', 'collaboration'],
    featuredImage: {
      id: 'img-011',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
      altText: 'Team collaboration',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 3,
    status: 'PUBLISHED',
    publishedAt: '2024-11-30T11:00:00Z',
    createdAt: '2024-11-27T15:00:00Z',
    viewCount: 4321,
    likeCount: 234,
  },
  {
    id: 'article-012',
    slug: 'mindfulness-and-technology',
    title: 'Mindfulness in the Digital Age',
    excerpt: 'How to maintain balance and mental wellness while staying connected.',
    content: `# Mindfulness in the Digital Age

Technology should enhance our lives, not overwhelm them.

## Digital Wellness Features

Our app includes tools to help you stay balanced:

### Screen Time Awareness
Track how much time you spend in the app.

### Focus Sessions
Block distracting notifications during deep work.

### Daily Limits
Set usage limits and get gentle reminders.

## Tips for Balance

1. Scheduled digital detox periods
2. Notification batching
3. Mindful app usage
4. Regular breaks

Your mental health matters to us.`,
    authorId: 'author-003',
    categoryId: 'cat-lifestyle',
    tags: ['mindfulness', 'wellness', 'digital-health', 'balance'],
    featuredImage: {
      id: 'img-012',
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
      altText: 'Meditation',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 5,
    status: 'PUBLISHED',
    publishedAt: '2024-12-08T08:00:00Z',
    createdAt: '2024-12-05T12:00:00Z',
    viewCount: 8765,
    likeCount: 765,
  },
  {
    id: 'article-013',
    slug: 'api-documentation-overview',
    title: 'API Documentation: Build Custom Integrations',
    excerpt: 'Everything developers need to know about our public API.',
    content: `# API Documentation Overview

Build powerful integrations with our RESTful API.

## Getting Started

1. Generate an API key in Settings > Developer
2. Read our authentication guide
3. Explore endpoints in our interactive docs

## Key Endpoints

- \`GET /api/v2/items\` - List all items
- \`POST /api/v2/items\` - Create new item
- \`PUT /api/v2/items/:id\` - Update item
- \`DELETE /api/v2/items/:id\` - Delete item

## Rate Limits

- Free: 100 requests/minute
- Premium: 1000 requests/minute
- Enterprise: Custom limits

Full documentation at developers.example.com`,
    authorId: 'author-002',
    categoryId: 'cat-tech',
    tags: ['api', 'developers', 'documentation', 'integration'],
    featuredImage: {
      id: 'img-013',
      url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200',
      altText: 'Code on screen',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 4,
    status: 'PUBLISHED',
    publishedAt: '2024-10-20T14:00:00Z',
    createdAt: '2024-10-18T09:00:00Z',
    viewCount: 3456,
    likeCount: 198,
  },
  {
    id: 'article-014',
    slug: 'customer-success-story-startup',
    title: 'Customer Success: How StartupXYZ Scaled with Our App',
    excerpt: 'A case study on how a growing startup uses our platform to stay organized.',
    content: `# Customer Success: StartupXYZ

Learn how StartupXYZ went from 5 to 50 employees while staying organized.

## The Challenge

"We were drowning in spreadsheets and missed deadlines," says their COO.

## The Solution

After adopting our platform:
- 40% reduction in missed deadlines
- Team collaboration improved dramatically
- Onboarding time cut in half

## Key Features Used

1. Team workspaces
2. Automated workflows
3. Integration with their existing tools

## Results

"It's now the central hub for everything we do." - StartupXYZ CEO`,
    authorId: 'author-001',
    categoryId: 'cat-news',
    tags: ['case-study', 'startup', 'success-story', 'business'],
    featuredImage: {
      id: 'img-014',
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200',
      altText: 'Startup team',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 5,
    status: 'PUBLISHED',
    publishedAt: '2024-11-12T10:00:00Z',
    createdAt: '2024-11-08T11:00:00Z',
    viewCount: 4567,
    likeCount: 321,
  },
  {
    id: 'article-015',
    slug: 'upcoming-features-q1-2025',
    title: 'Upcoming Features: Q1 2025 Roadmap',
    excerpt: 'A preview of what we\'re building for the first quarter of next year.',
    content: `# Q1 2025 Roadmap

Here's what's coming in the first quarter of 2025.

## January

- Enhanced search with filters
- New mobile widgets
- Improved offline mode

## February

- AI-powered suggestions (beta)
- Team analytics dashboard
- Custom themes

## March

- Workflow automation builder
- Advanced permissions
- API v3 preview

## How to Get Early Access

Join our beta program at beta.example.com!`,
    authorId: 'author-004',
    categoryId: 'cat-product',
    tags: ['roadmap', '2025', 'features', 'preview'],
    featuredImage: {
      id: 'img-015',
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
      altText: 'Planning',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 3,
    status: 'PUBLISHED',
    publishedAt: '2024-12-15T16:00:00Z',
    createdAt: '2024-12-12T14:00:00Z',
    viewCount: 15678,
    likeCount: 1432,
  },
  {
    id: 'article-016',
    slug: 'draft-mobile-redesign',
    title: 'Mobile App Redesign Preview',
    excerpt: 'Early look at our upcoming mobile app redesign.',
    content: `# Mobile App Redesign Preview

We're working on a major visual refresh for our mobile apps.

## Design Goals

- Cleaner, more modern interface
- Improved navigation
- Better accessibility
- Faster performance

## Expected Release

Q2 2025

*This article is a draft and subject to change.*`,
    authorId: 'author-002',
    categoryId: 'cat-product',
    tags: ['mobile', 'redesign', 'preview', 'design'],
    featuredImage: {
      id: 'img-016',
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
      altText: 'Mobile design',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 2,
    status: 'DRAFT',
    createdAt: '2024-12-14T10:00:00Z',
    viewCount: 0,
    likeCount: 0,
  },
  {
    id: 'article-017',
    slug: 'archived-legacy-features',
    title: 'Legacy Features Being Retired',
    excerpt: 'Information about deprecated features being removed.',
    content: `# Legacy Features Being Retired

As part of our platform modernization, some older features are being retired.

## Deprecated Features

- Classic theme (use Dark/Light instead)
- API v1 endpoints (migrate to v2)
- Desktop app (web app recommended)

## Migration Guides

Visit our help center for step-by-step migration guides.

## Timeline

All deprecated features will be removed by March 2025.`,
    authorId: 'author-005',
    categoryId: 'cat-news',
    tags: ['deprecated', 'legacy', 'migration', 'archive'],
    featuredImage: {
      id: 'img-017',
      url: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200',
      altText: 'Archive',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 2,
    status: 'ARCHIVED',
    publishedAt: '2024-06-01T09:00:00Z',
    createdAt: '2024-05-28T11:00:00Z',
    viewCount: 2345,
    likeCount: 45,
  },
  {
    id: 'article-018',
    slug: 'weekly-tips-newsletter',
    title: 'This Week\'s Tips: Boost Your Workflow',
    excerpt: 'Quick tips from our team to help you work smarter this week.',
    content: `# This Week's Tips

Quick productivity boosts for your workflow!

## Tip 1: Use Quick Actions

Press Cmd/Ctrl + K to access quick actions from anywhere.

## Tip 2: Keyboard Navigation

Tab and Shift+Tab navigate between items quickly.

## Tip 3: Bulk Operations

Select multiple items with Shift+Click for batch actions.

See you next week with more tips!`,
    authorId: 'author-005',
    categoryId: 'cat-tutorial',
    tags: ['tips', 'weekly', 'productivity', 'shortcuts'],
    featuredImage: {
      id: 'img-018',
      url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200',
      altText: 'Tips',
      width: 1200,
      height: 800,
      mimeType: 'image/jpeg',
    },
    readingTime: 2,
    status: 'PUBLISHED',
    publishedAt: '2024-12-16T08:00:00Z',
    createdAt: '2024-12-15T17:00:00Z',
    viewCount: 3210,
    likeCount: 287,
  },
];

// =============================================================================
// NOTIFICATIONS (25 instances - 5 per type)
// =============================================================================

export const notificationsSeed: Notification[] = [
  // PROMOTIONAL (5)
  {
    id: 'notif-promo-001',
    type: 'PROMOTIONAL',
    title: 'Flash Sale: 40% Off Premium',
    body: 'Limited time offer! Upgrade to Premium and save 40% on your first year.',
    priority: 'HIGH',
    read: false,
    createdAt: '2024-12-18T10:00:00Z',
    expiresAt: '2024-12-20T23:59:59Z',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
    discountCode: 'FLASH40',
    discountPercentage: 40,
    cta: { text: 'Claim Offer', url: '/premium', deepLink: 'app://premium/upgrade' },
  },
  {
    id: 'notif-promo-002',
    type: 'PROMOTIONAL',
    title: 'New Year, New Features',
    body: 'Start 2025 right with our latest premium features. Special pricing available!',
    priority: 'NORMAL',
    read: false,
    createdAt: '2024-12-15T14:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400',
    cta: { text: 'Learn More', url: '/features', deepLink: 'app://features' },
  },
  {
    id: 'notif-promo-003',
    type: 'PROMOTIONAL',
    title: 'Refer a Friend, Get $10',
    body: 'Share the love! For every friend who signs up, you both get $10 credit.',
    priority: 'LOW',
    read: true,
    createdAt: '2024-12-10T09:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400',
    cta: { text: 'Share Now', url: '/referral', deepLink: 'app://referral' },
  },
  {
    id: 'notif-promo-004',
    type: 'PROMOTIONAL',
    title: 'Black Friday Extended!',
    body: 'Our biggest sale of the year continues. 50% off all annual plans.',
    priority: 'HIGH',
    read: true,
    createdAt: '2024-11-30T08:00:00Z',
    expiresAt: '2024-12-03T23:59:59Z',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
    discountCode: 'BLACKFRIDAY50',
    discountPercentage: 50,
    cta: { text: 'Shop Now', url: '/sale', deepLink: 'app://sale' },
  },
  {
    id: 'notif-promo-005',
    type: 'PROMOTIONAL',
    title: 'Student Discount Available',
    body: 'Verify your student status and get 60% off Premium.',
    priority: 'NORMAL',
    read: true,
    createdAt: '2024-11-25T11:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    discountPercentage: 60,
    cta: { text: 'Verify Status', url: '/student', deepLink: 'app://student-verify' },
  },

  // TRANSACTIONAL (5)
  {
    id: 'notif-trans-001',
    type: 'TRANSACTIONAL',
    title: 'Payment Successful',
    body: 'Your Premium subscription has been renewed for another year.',
    priority: 'NORMAL',
    read: false,
    createdAt: '2024-12-17T15:30:00Z',
    orderId: 'ORD-2024-78432',
    orderStatus: 'completed',
    amount: 79.99,
    currency: 'USD',
  },
  {
    id: 'notif-trans-002',
    type: 'TRANSACTIONAL',
    title: 'Receipt Available',
    body: 'Your December invoice is ready for download.',
    priority: 'LOW',
    read: false,
    createdAt: '2024-12-01T00:00:00Z',
    orderId: 'INV-2024-12-001',
    orderStatus: 'completed',
    amount: 9.99,
    currency: 'USD',
  },
  {
    id: 'notif-trans-003',
    type: 'TRANSACTIONAL',
    title: 'Order Shipped',
    body: 'Your merchandise order is on its way!',
    priority: 'NORMAL',
    read: true,
    createdAt: '2024-12-14T10:00:00Z',
    orderId: 'ORD-2024-78100',
    orderStatus: 'shipped',
    trackingUrl: 'https://tracking.example.com/ABC123',
    amount: 34.99,
    currency: 'USD',
  },
  {
    id: 'notif-trans-004',
    type: 'TRANSACTIONAL',
    title: 'Payment Failed',
    body: 'We couldn\'t process your payment. Please update your payment method.',
    priority: 'URGENT',
    read: false,
    createdAt: '2024-12-16T09:00:00Z',
    orderId: 'ORD-2024-78500',
    orderStatus: 'failed',
    amount: 9.99,
    currency: 'USD',
  },
  {
    id: 'notif-trans-005',
    type: 'TRANSACTIONAL',
    title: 'Refund Processed',
    body: 'Your refund of $24.99 has been processed. Allow 3-5 business days.',
    priority: 'NORMAL',
    read: true,
    createdAt: '2024-12-10T14:00:00Z',
    orderId: 'REF-2024-00234',
    orderStatus: 'refunded',
    amount: 24.99,
    currency: 'USD',
  },

  // SYSTEM (5)
  {
    id: 'notif-sys-001',
    type: 'SYSTEM',
    title: 'Update Available: v2.5.1',
    body: 'A new update is available with bug fixes and improvements.',
    priority: 'NORMAL',
    read: false,
    createdAt: '2024-12-18T08:00:00Z',
    actionRequired: false,
    actionUrl: 'app://update',
    category: 'update',
  },
  {
    id: 'notif-sys-002',
    type: 'SYSTEM',
    title: 'Scheduled Maintenance',
    body: 'We\'ll be performing maintenance on Dec 21, 2-4 AM UTC.',
    priority: 'HIGH',
    read: false,
    createdAt: '2024-12-17T12:00:00Z',
    actionRequired: false,
    category: 'maintenance',
  },
  {
    id: 'notif-sys-003',
    type: 'SYSTEM',
    title: 'Security Alert: New Login',
    body: 'New login detected from Chrome on Windows. Was this you?',
    priority: 'URGENT',
    read: false,
    createdAt: '2024-12-16T22:30:00Z',
    actionRequired: true,
    actionUrl: '/security/sessions',
    category: 'security',
  },
  {
    id: 'notif-sys-004',
    type: 'SYSTEM',
    title: 'Terms of Service Updated',
    body: 'We\'ve updated our Terms of Service. Please review the changes.',
    priority: 'LOW',
    read: true,
    createdAt: '2024-12-01T00:00:00Z',
    actionRequired: true,
    actionUrl: '/legal/terms',
    category: 'legal',
  },
  {
    id: 'notif-sys-005',
    type: 'SYSTEM',
    title: 'Password Changed Successfully',
    body: 'Your account password was changed. If this wasn\'t you, contact support.',
    priority: 'HIGH',
    read: true,
    createdAt: '2024-12-12T16:45:00Z',
    actionRequired: false,
    category: 'security',
  },

  // REMINDER (5)
  {
    id: 'notif-remind-001',
    type: 'REMINDER',
    title: 'Items in Your Cart',
    body: 'You have 3 items waiting in your cart. Complete your purchase!',
    priority: 'NORMAL',
    read: false,
    createdAt: '2024-12-18T09:00:00Z',
    reminderTime: '2024-12-18T09:00:00Z',
    recurring: false,
    relatedItemId: 'cart-001',
    relatedItemType: 'cart',
  },
  {
    id: 'notif-remind-002',
    type: 'REMINDER',
    title: 'Weekly Review Time',
    body: 'It\'s time for your weekly review. Take 10 minutes to reflect.',
    priority: 'NORMAL',
    read: false,
    createdAt: '2024-12-16T17:00:00Z',
    reminderTime: '2024-12-16T17:00:00Z',
    recurring: true,
    recurringPattern: 'weekly',
  },
  {
    id: 'notif-remind-003',
    type: 'REMINDER',
    title: 'Trial Ending Soon',
    body: 'Your free trial ends in 3 days. Upgrade to keep your premium features.',
    priority: 'HIGH',
    read: false,
    createdAt: '2024-12-15T10:00:00Z',
    reminderTime: '2024-12-18T10:00:00Z',
    recurring: false,
    relatedItemId: 'trial-001',
    relatedItemType: 'subscription',
  },
  {
    id: 'notif-remind-004',
    type: 'REMINDER',
    title: 'Saved Item Price Drop',
    body: 'An item on your wishlist is now 20% off!',
    priority: 'NORMAL',
    read: true,
    createdAt: '2024-12-14T11:00:00Z',
    reminderTime: '2024-12-14T11:00:00Z',
    recurring: false,
    relatedItemId: 'wishlist-item-005',
    relatedItemType: 'wishlist',
  },
  {
    id: 'notif-remind-005',
    type: 'REMINDER',
    title: 'Goal Check-In',
    body: 'How are you progressing on your goals this week?',
    priority: 'LOW',
    read: true,
    createdAt: '2024-12-13T08:00:00Z',
    reminderTime: '2024-12-13T08:00:00Z',
    recurring: true,
    recurringPattern: 'weekly',
    relatedItemId: 'goals-weekly',
    relatedItemType: 'goals',
  },

  // SOCIAL (5)
  {
    id: 'notif-social-001',
    type: 'SOCIAL',
    title: 'New Follower',
    body: 'Alex Kim started following you.',
    priority: 'LOW',
    read: false,
    createdAt: '2024-12-18T11:30:00Z',
    actorId: 'user-alex-kim',
    actorName: 'Alex Kim',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    action: 'followed',
    targetId: 'current-user',
    targetType: 'profile',
  },
  {
    id: 'notif-social-002',
    type: 'SOCIAL',
    title: 'Comment on Your Post',
    body: 'Sarah Chen commented: "Great tips! Thanks for sharing."',
    priority: 'NORMAL',
    read: false,
    createdAt: '2024-12-17T14:20:00Z',
    actorId: 'user-sarah-chen',
    actorName: 'Sarah Chen',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',
    action: 'commented',
    targetId: 'post-123',
    targetType: 'post',
  },
  {
    id: 'notif-social-003',
    type: 'SOCIAL',
    title: 'Liked Your Comment',
    body: 'Marcus Johnson liked your comment.',
    priority: 'LOW',
    read: true,
    createdAt: '2024-12-16T09:15:00Z',
    actorId: 'user-marcus-johnson',
    actorName: 'Marcus Johnson',
    action: 'liked',
    targetId: 'comment-456',
    targetType: 'comment',
  },
  {
    id: 'notif-social-004',
    type: 'SOCIAL',
    title: 'Mentioned You',
    body: 'Elena Rodriguez mentioned you in a post.',
    priority: 'NORMAL',
    read: true,
    createdAt: '2024-12-15T16:00:00Z',
    actorId: 'user-elena-rodriguez',
    actorName: 'Elena Rodriguez',
    actorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    action: 'mentioned',
    targetId: 'post-789',
    targetType: 'post',
  },
  {
    id: 'notif-social-005',
    type: 'SOCIAL',
    title: 'Shared Your Post',
    body: 'David Park shared your post with their followers.',
    priority: 'NORMAL',
    read: true,
    createdAt: '2024-12-14T12:30:00Z',
    actorId: 'user-david-park',
    actorName: 'David Park',
    actorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    action: 'shared',
    targetId: 'post-101',
    targetType: 'post',
  },
];

// =============================================================================
// FEATURE FLAGS (12 instances)
// =============================================================================

export const featureFlagsSeed: FeatureFlag[] = [
  {
    id: 'flag-001',
    key: 'new_checkout_flow',
    name: 'New Checkout Flow',
    description: 'Enables the redesigned checkout experience with fewer steps.',
    type: 'BOOLEAN',
    defaultValue: false,
    enabled: true,
    rules: [
      {
        id: 'rule-001-1',
        name: 'Premium Users',
        conditions: [{ attribute: 'userSegment', operator: 'equals', value: 'PREMIUM' }],
        value: true,
        priority: 1,
      },
      {
        id: 'rule-001-2',
        name: '50% Rollout',
        conditions: [],
        value: true,
        percentage: 50,
        priority: 2,
      },
    ],
    metadata: {
      owner: 'checkout-team',
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
      tags: ['checkout', 'ux', 'experiment'],
      jiraTicket: 'FEAT-1234',
    },
    evaluationCount: 45230,
  },
  {
    id: 'flag-002',
    key: 'home_layout',
    name: 'Home Screen Layout',
    description: 'Controls the layout style of the home screen.',
    type: 'STRING',
    defaultValue: 'grid',
    enabled: true,
    rules: [
      {
        id: 'rule-002-1',
        name: 'iOS List View',
        conditions: [{ attribute: 'platform', operator: 'equals', value: 'IOS' }],
        value: 'list',
        priority: 1,
      },
    ],
    metadata: {
      owner: 'mobile-team',
      createdAt: '2024-10-15T00:00:00Z',
      updatedAt: '2024-11-20T00:00:00Z',
      tags: ['ui', 'mobile', 'layout'],
    },
    evaluationCount: 128450,
  },
  {
    id: 'flag-003',
    key: 'max_cart_items',
    name: 'Maximum Cart Items',
    description: 'Maximum number of items allowed in cart.',
    type: 'NUMBER',
    defaultValue: 25,
    enabled: true,
    rules: [
      {
        id: 'rule-003-1',
        name: 'Premium Limit',
        conditions: [{ attribute: 'userSegment', operator: 'in', value: ['PREMIUM', 'RETURNING_USERS'] }],
        value: 100,
        priority: 1,
      },
    ],
    metadata: {
      owner: 'commerce-team',
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z',
      tags: ['cart', 'limits'],
    },
    evaluationCount: 89234,
  },
  {
    id: 'flag-004',
    key: 'ab_test_config',
    name: 'A/B Test Configuration',
    description: 'JSON configuration for active A/B tests.',
    type: 'JSON',
    defaultValue: { experiments: [], enabled: false },
    enabled: true,
    rules: [
      {
        id: 'rule-004-1',
        name: 'Active Experiments',
        conditions: [],
        value: {
          experiments: [
            { id: 'exp-001', name: 'button-color', variants: ['blue', 'green'] },
            { id: 'exp-002', name: 'pricing-page', variants: ['control', 'variant-a'] },
          ],
          enabled: true,
        },
        percentage: 100,
        priority: 1,
      },
    ],
    metadata: {
      owner: 'growth-team',
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z',
      tags: ['ab-test', 'experiments'],
    },
    evaluationCount: 156780,
  },
  {
    id: 'flag-005',
    key: 'dark_mode_v2',
    name: 'Dark Mode V2',
    description: 'New dark mode with OLED black option.',
    type: 'BOOLEAN',
    defaultValue: false,
    enabled: true,
    rules: [
      {
        id: 'rule-005-1',
        name: 'Android OLED',
        conditions: [
          { attribute: 'platform', operator: 'equals', value: 'ANDROID' },
          { attribute: 'appVersion', operator: 'greaterThan', value: '2.4.0' },
        ],
        value: true,
        priority: 1,
      },
    ],
    metadata: {
      owner: 'design-team',
      createdAt: '2024-11-15T00:00:00Z',
      updatedAt: '2024-12-05T00:00:00Z',
      tags: ['dark-mode', 'ui', 'oled'],
    },
    evaluationCount: 67890,
  },
  {
    id: 'flag-006',
    key: 'ai_suggestions',
    name: 'AI-Powered Suggestions',
    description: 'Enable AI-based content and action suggestions.',
    type: 'BOOLEAN',
    defaultValue: false,
    enabled: false,
    rules: [],
    metadata: {
      owner: 'ai-team',
      createdAt: '2024-12-10T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
      tags: ['ai', 'ml', 'beta'],
      jiraTicket: 'AI-500',
    },
    evaluationCount: 0,
  },
  {
    id: 'flag-007',
    key: 'notification_channels',
    name: 'Notification Channels',
    description: 'Available notification delivery channels.',
    type: 'JSON',
    defaultValue: { push: true, email: true, sms: false, inApp: true },
    enabled: true,
    rules: [
      {
        id: 'rule-007-1',
        name: 'Premium SMS',
        conditions: [{ attribute: 'userSegment', operator: 'equals', value: 'PREMIUM' }],
        value: { push: true, email: true, sms: true, inApp: true },
        priority: 1,
      },
    ],
    metadata: {
      owner: 'notifications-team',
      createdAt: '2024-08-01T00:00:00Z',
      updatedAt: '2024-10-15T00:00:00Z',
      tags: ['notifications', 'channels'],
    },
    evaluationCount: 234567,
  },
  {
    id: 'flag-008',
    key: 'search_algorithm',
    name: 'Search Algorithm Version',
    description: 'Which search algorithm to use.',
    type: 'STRING',
    defaultValue: 'v2',
    enabled: true,
    rules: [
      {
        id: 'rule-008-1',
        name: 'Beta v3',
        conditions: [{ attribute: 'userSegment', operator: 'equals', value: 'PREMIUM' }],
        value: 'v3-beta',
        percentage: 20,
        priority: 1,
      },
    ],
    metadata: {
      owner: 'search-team',
      createdAt: '2024-07-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      tags: ['search', 'algorithm'],
    },
    evaluationCount: 567890,
  },
  {
    id: 'flag-009',
    key: 'rate_limit_multiplier',
    name: 'Rate Limit Multiplier',
    description: 'Multiplier for API rate limits.',
    type: 'NUMBER',
    defaultValue: 1,
    enabled: true,
    rules: [
      {
        id: 'rule-009-1',
        name: 'Premium Rate Limit',
        conditions: [{ attribute: 'userSegment', operator: 'equals', value: 'PREMIUM' }],
        value: 5,
        priority: 1,
      },
      {
        id: 'rule-009-2',
        name: 'Returning User Boost',
        conditions: [{ attribute: 'userSegment', operator: 'equals', value: 'RETURNING_USERS' }],
        value: 2,
        priority: 2,
      },
    ],
    metadata: {
      owner: 'platform-team',
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z',
      tags: ['api', 'rate-limit'],
    },
    evaluationCount: 890123,
  },
  {
    id: 'flag-010',
    key: 'widget_enabled',
    name: 'Home Screen Widget',
    description: 'Enable home screen widget feature.',
    type: 'BOOLEAN',
    defaultValue: true,
    enabled: true,
    rules: [
      {
        id: 'rule-010-1',
        name: 'iOS Widget',
        conditions: [
          { attribute: 'platform', operator: 'equals', value: 'IOS' },
          { attribute: 'appVersion', operator: 'greaterThan', value: '2.3.0' },
        ],
        value: true,
        priority: 1,
      },
      {
        id: 'rule-010-2',
        name: 'Android Widget',
        conditions: [{ attribute: 'platform', operator: 'equals', value: 'ANDROID' }],
        value: true,
        priority: 2,
      },
    ],
    metadata: {
      owner: 'mobile-team',
      createdAt: '2024-10-01T00:00:00Z',
      updatedAt: '2024-11-15T00:00:00Z',
      tags: ['widget', 'mobile'],
    },
    evaluationCount: 123456,
  },
  {
    id: 'flag-011',
    key: 'maintenance_mode',
    name: 'Maintenance Mode',
    description: 'Enable maintenance mode for the app.',
    type: 'BOOLEAN',
    defaultValue: false,
    enabled: false,
    rules: [],
    metadata: {
      owner: 'ops-team',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      tags: ['maintenance', 'ops'],
    },
    evaluationCount: 1000000,
  },
  {
    id: 'flag-012',
    key: 'onboarding_flow',
    name: 'Onboarding Flow Version',
    description: 'Which onboarding flow to show new users.',
    type: 'STRING',
    defaultValue: 'standard',
    enabled: true,
    rules: [
      {
        id: 'rule-012-1',
        name: 'Simplified for New',
        conditions: [{ attribute: 'userSegment', operator: 'equals', value: 'NEW_USERS' }],
        value: 'simplified',
        percentage: 50,
        priority: 1,
      },
    ],
    metadata: {
      owner: 'growth-team',
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
      tags: ['onboarding', 'new-users', 'experiment'],
      jiraTicket: 'GROWTH-789',
    },
    evaluationCount: 45678,
  },
];

// =============================================================================
// NAVIGATION MENUS (3 instances)
// =============================================================================

export const navigationMenusSeed: NavigationMenu[] = [
  {
    id: 'nav-main',
    name: 'Main Navigation',
    location: 'main',
    items: [
      {
        id: 'nav-home',
        label: 'Home',
        icon: 'home',
        url: '/',
        deepLink: 'app://home',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'nav-discover',
        label: 'Discover',
        icon: 'compass',
        url: '/discover',
        deepLink: 'app://discover',
        badge: { text: 'New', color: '#10B981', animated: true },
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
        children: [
          {
            id: 'nav-discover-trending',
            label: 'Trending',
            icon: 'trending-up',
            url: '/discover/trending',
            deepLink: 'app://discover/trending',
            visibility: { platforms: ['ALL'], segments: ['ALL'] },
          },
          {
            id: 'nav-discover-categories',
            label: 'Categories',
            icon: 'grid',
            url: '/discover/categories',
            deepLink: 'app://discover/categories',
            visibility: { platforms: ['ALL'], segments: ['ALL'] },
            children: [
              {
                id: 'nav-cat-tech',
                label: 'Technology',
                url: '/discover/categories/tech',
                visibility: { platforms: ['ALL'], segments: ['ALL'] },
              },
              {
                id: 'nav-cat-lifestyle',
                label: 'Lifestyle',
                url: '/discover/categories/lifestyle',
                visibility: { platforms: ['ALL'], segments: ['ALL'] },
              },
            ],
          },
          {
            id: 'nav-discover-featured',
            label: 'Featured',
            icon: 'star',
            url: '/discover/featured',
            deepLink: 'app://discover/featured',
            visibility: { platforms: ['ALL'], segments: ['ALL'] },
          },
        ],
      },
      {
        id: 'nav-library',
        label: 'My Library',
        icon: 'bookmark',
        url: '/library',
        deepLink: 'app://library',
        badge: { count: 12, color: '#3B82F6', animated: false },
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
      {
        id: 'nav-premium',
        label: 'Premium',
        icon: 'crown',
        url: '/premium',
        deepLink: 'app://premium',
        badge: { text: 'Upgrade', color: '#F59E0B', animated: true },
        visibility: { platforms: ['ALL'], segments: ['FREE', 'NEW_USERS'] },
      },
      {
        id: 'nav-settings',
        label: 'Settings',
        icon: 'settings',
        url: '/settings',
        deepLink: 'app://settings',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
    ],
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'nav-footer',
    name: 'Footer Navigation',
    location: 'footer',
    items: [
      {
        id: 'footer-about',
        label: 'About Us',
        url: '/about',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'footer-careers',
        label: 'Careers',
        url: '/careers',
        badge: { text: 'Hiring', color: '#10B981', animated: false },
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'footer-blog',
        label: 'Blog',
        url: '/blog',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'footer-help',
        label: 'Help Center',
        url: '/help',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'footer-privacy',
        label: 'Privacy Policy',
        url: '/privacy',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'footer-terms',
        label: 'Terms of Service',
        url: '/terms',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
      {
        id: 'footer-contact',
        label: 'Contact',
        url: '/contact',
        visibility: { platforms: ['ALL'], segments: ['ALL'] },
      },
    ],
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: 'nav-profile',
    name: 'Profile Sidebar',
    location: 'profile',
    items: [
      {
        id: 'profile-overview',
        label: 'Overview',
        icon: 'user',
        url: '/profile',
        deepLink: 'app://profile',
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
      {
        id: 'profile-activity',
        label: 'Activity',
        icon: 'activity',
        url: '/profile/activity',
        deepLink: 'app://profile/activity',
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
      {
        id: 'profile-notifications',
        label: 'Notifications',
        icon: 'bell',
        url: '/profile/notifications',
        deepLink: 'app://profile/notifications',
        badge: { count: 5, color: '#EF4444', animated: true },
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
      {
        id: 'profile-subscription',
        label: 'Subscription',
        icon: 'credit-card',
        url: '/profile/subscription',
        deepLink: 'app://profile/subscription',
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
      {
        id: 'profile-security',
        label: 'Security',
        icon: 'shield',
        url: '/profile/security',
        deepLink: 'app://profile/security',
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
      {
        id: 'profile-preferences',
        label: 'Preferences',
        icon: 'sliders',
        url: '/profile/preferences',
        deepLink: 'app://profile/preferences',
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
        children: [
          {
            id: 'pref-theme',
            label: 'Theme',
            url: '/profile/preferences/theme',
            visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
          },
          {
            id: 'pref-language',
            label: 'Language',
            url: '/profile/preferences/language',
            visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
          },
          {
            id: 'pref-privacy',
            label: 'Privacy',
            url: '/profile/preferences/privacy',
            visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
          },
        ],
      },
      {
        id: 'profile-logout',
        label: 'Log Out',
        icon: 'log-out',
        url: '/logout',
        deepLink: 'app://logout',
        visibility: { platforms: ['ALL'], segments: ['ALL'], authenticated: true },
      },
    ],
    updatedAt: '2024-12-10T14:30:00Z',
  },
];
