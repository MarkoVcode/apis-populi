// GraphQL Schema Definition for Mobile CMS API

export const typeDefs = /* GraphQL */ `
  # =============================================================================
  # SCALARS
  # =============================================================================
  scalar DateTime
  scalar JSON

  # =============================================================================
  # ENUMS
  # =============================================================================
  enum Platform {
    IOS
    ANDROID
    ALL
  }

  enum NotificationType {
    PROMOTIONAL
    TRANSACTIONAL
    SYSTEM
    REMINDER
    SOCIAL
  }

  enum NotificationPriority {
    LOW
    NORMAL
    HIGH
    URGENT
  }

  enum BannerStyle {
    FULL_WIDTH
    CARD
    FLOATING
    INLINE
  }

  enum ArticleStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum FeatureFlagType {
    BOOLEAN
    STRING
    NUMBER
    JSON
  }

  enum UserSegment {
    ALL
    NEW_USERS
    RETURNING_USERS
    PREMIUM
    FREE
  }

  # =============================================================================
  # APP CONFIG - Deeply nested configuration object
  # =============================================================================
  type AppConfig {
    id: ID!
    appVersion: String!
    minimumSupportedVersion: String!
    forceUpdate: Boolean!
    maintenance: MaintenanceConfig!
    theme: ThemeConfig!
    api: ApiConfig!
    analytics: AnalyticsConfig!
    updatedAt: DateTime!
    lastSyncedAt: DateTime!
  }

  type MaintenanceConfig {
    enabled: Boolean!
    message: String
    estimatedEndTime: DateTime
    allowedUserIds: [String!]!
  }

  type ThemeConfig {
    primaryColor: String!
    secondaryColor: String!
    fontFamily: String!
    darkMode: DarkModeConfig!
    customCSS: String
  }

  type DarkModeConfig {
    enabled: Boolean!
    automatic: Boolean!
    scheduleStart: String
    scheduleEnd: String
  }

  type ApiConfig {
    baseUrl: String!
    timeout: Int!
    retryAttempts: Int!
    cachePolicy: CachePolicy!
  }

  type CachePolicy {
    defaultTTL: Int!
    maxAge: Int!
    staleWhileRevalidate: Boolean!
  }

  type AnalyticsConfig {
    enabled: Boolean!
    providers: [AnalyticsProvider!]!
    sampleRate: Float!
  }

  type AnalyticsProvider {
    name: String!
    enabled: Boolean!
    trackingId: String
  }

  # =============================================================================
  # BANNERS - Array with promotional content
  # =============================================================================
  type Banner {
    id: ID!
    title: String!
    subtitle: String
    imageUrl: String!
    thumbnailUrl: String
    backgroundColor: String
    textColor: String
    cta: CallToAction!
    style: BannerStyle!
    placement: String!
    priority: Int!
    targeting: BannerTargeting!
    schedule: BannerSchedule!
    analytics: BannerAnalytics!
    impressions: Int!
    clicks: Int!
    lastUpdatedAt: DateTime!
  }

  type CallToAction {
    text: String!
    url: String!
    deepLink: String
    action: String
  }

  type BannerTargeting {
    platforms: [Platform!]!
    segments: [UserSegment!]!
    countries: [String!]
    languages: [String!]
    minAppVersion: String
  }

  type BannerSchedule {
    startDate: DateTime!
    endDate: DateTime
    timezone: String!
    daysOfWeek: [Int!]
  }

  type BannerAnalytics {
    campaignId: String
    source: String
    medium: String
  }

  type BannerConnection {
    edges: [BannerEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type BannerEdge {
    node: Banner!
    cursor: String!
  }

  # =============================================================================
  # ARTICLES - Paginated rich content with media
  # =============================================================================
  type Article {
    id: ID!
    slug: String!
    title: String!
    excerpt: String!
    content: String!
    author: Author!
    category: Category!
    tags: [String!]!
    featuredImage: MediaAsset
    gallery: [MediaAsset!]
    readingTime: Int!
    status: ArticleStatus!
    publishedAt: DateTime
    createdAt: DateTime!
    modifiedAt: DateTime!
    viewCount: Int!
    likeCount: Int!
  }

  type Author {
    id: ID!
    name: String!
    avatar: String
    bio: String
    role: String!
    socialLinks: SocialLinks
  }

  type SocialLinks {
    twitter: String
    linkedin: String
    website: String
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    color: String
    icon: String
  }

  type MediaAsset {
    id: ID!
    url: String!
    altText: String
    width: Int
    height: Int
    mimeType: String!
    caption: String
  }

  type ArticleConnection {
    edges: [ArticleEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ArticleEdge {
    node: Article!
    cursor: String!
  }

  # =============================================================================
  # NOTIFICATIONS - Polymorphic notification types
  # =============================================================================
  interface Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    priority: NotificationPriority!
    read: Boolean!
    createdAt: DateTime!
    expiresAt: DateTime
  }

  type PromotionalNotification implements Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    priority: NotificationPriority!
    read: Boolean!
    createdAt: DateTime!
    expiresAt: DateTime
    imageUrl: String!
    discountCode: String
    discountPercentage: Int
    cta: CallToAction!
  }

  type TransactionalNotification implements Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    priority: NotificationPriority!
    read: Boolean!
    createdAt: DateTime!
    expiresAt: DateTime
    orderId: String!
    orderStatus: String!
    trackingUrl: String
    amount: Float
    currency: String
  }

  type SystemNotification implements Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    priority: NotificationPriority!
    read: Boolean!
    createdAt: DateTime!
    expiresAt: DateTime
    actionRequired: Boolean!
    actionUrl: String
    category: String!
  }

  type ReminderNotification implements Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    priority: NotificationPriority!
    read: Boolean!
    createdAt: DateTime!
    expiresAt: DateTime
    reminderTime: DateTime!
    recurring: Boolean!
    recurringPattern: String
    relatedItemId: String
    relatedItemType: String
  }

  type SocialNotification implements Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    priority: NotificationPriority!
    read: Boolean!
    createdAt: DateTime!
    expiresAt: DateTime
    actorId: String!
    actorName: String!
    actorAvatar: String
    action: String!
    targetId: String
    targetType: String
  }

  type NotificationConnection {
    edges: [NotificationEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
    unreadCount: Int!
    requestId: ID!
    requestTimestamp: DateTime!
  }

  type NotificationEdge {
    node: Notification!
    cursor: String!
  }

  # =============================================================================
  # FEATURE FLAGS - Key-value with targeting rules
  # =============================================================================
  type FeatureFlag {
    id: ID!
    key: String!
    name: String!
    description: String
    type: FeatureFlagType!
    defaultValue: JSON!
    enabled: Boolean!
    rules: [FeatureFlagRule!]!
    metadata: FeatureFlagMetadata!
    lastEvaluatedAt: DateTime!
    evaluationCount: Int!
  }

  type FeatureFlagRule {
    id: ID!
    name: String!
    conditions: [RuleCondition!]!
    value: JSON!
    percentage: Int
    priority: Int!
  }

  type RuleCondition {
    attribute: String!
    operator: String!
    value: JSON!
  }

  type FeatureFlagMetadata {
    owner: String
    createdAt: DateTime!
    updatedAt: DateTime!
    tags: [String!]
    jiraTicket: String
  }

  type FeatureFlagsResponse {
    flags: [FeatureFlag!]!
    evaluatedAt: DateTime!
    context: EvaluationContext
  }

  type EvaluationContext {
    platform: Platform
    appVersion: String
    userSegment: UserSegment
    userId: String
  }

  # =============================================================================
  # NAVIGATION - Hierarchical menu structure
  # =============================================================================
  type NavigationMenu {
    id: ID!
    name: String!
    location: String!
    items: [NavigationItem!]!
    updatedAt: DateTime!
  }

  type NavigationItem {
    id: ID!
    label: String!
    icon: String
    url: String
    deepLink: String
    badge: NavigationBadge
    children: [NavigationItem!]
    visibility: ItemVisibility!
  }

  type NavigationBadge {
    text: String
    count: Int
    color: String
    animated: Boolean!
  }

  type ItemVisibility {
    platforms: [Platform!]!
    segments: [UserSegment!]!
    authenticated: Boolean
    minAppVersion: String
  }

  # =============================================================================
  # PAGINATION
  # =============================================================================
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # =============================================================================
  # INPUT TYPES
  # =============================================================================
  input ArticleFilterInput {
    categoryId: ID
    tags: [String!]
    status: ArticleStatus
    authorId: ID
    search: String
  }

  input BannerFilterInput {
    placement: String
    platform: Platform
    segment: UserSegment
    active: Boolean
  }

  input NotificationFilterInput {
    types: [NotificationType!]
    read: Boolean
    priority: NotificationPriority
  }

  input FeatureFlagContextInput {
    platform: Platform
    appVersion: String
    userSegment: UserSegment
    userId: String
  }

  input PaginationInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  # =============================================================================
  # QUERIES
  # =============================================================================
  type Query {
    # App Configuration (single nested object)
    appConfig: AppConfig!

    # Banners (array with targeting)
    banners(filter: BannerFilterInput, pagination: PaginationInput): BannerConnection!
    banner(id: ID!): Banner

    # Articles (paginated with rich content)
    articles(filter: ArticleFilterInput, pagination: PaginationInput): ArticleConnection!
    article(id: ID!): Article
    articleBySlug(slug: String!): Article

    # Notifications (polymorphic)
    notifications(filter: NotificationFilterInput, pagination: PaginationInput): NotificationConnection!
    notification(id: ID!): Notification

    # Feature Flags (with targeting rules)
    featureFlags(context: FeatureFlagContextInput): FeatureFlagsResponse!
    featureFlag(key: String!): FeatureFlag

    # Navigation (hierarchical)
    navigation(location: String!): NavigationMenu
    navigationMenus: [NavigationMenu!]!

    # Utility
    categories: [Category!]!
    authors: [Author!]!
  }

  # =============================================================================
  # MUTATIONS
  # =============================================================================
  type Mutation {
    # Mark notification as read
    markNotificationRead(id: ID!): Notification

    # Mark all notifications as read
    markAllNotificationsRead: NotificationConnection!

    # Track banner impression/click
    trackBannerEvent(bannerId: ID!, event: String!): Banner

    # Increment article view
    trackArticleView(id: ID!): Article

    # Like article
    toggleArticleLike(id: ID!): Article

    # Reset all data
    resetData: ResetResponse!
  }

  type ResetResponse {
    success: Boolean!
    message: String!
    timestamp: DateTime!
  }
`;

// Export as SDL string for the schema introspection endpoint
export const schemaSDL = typeDefs;
