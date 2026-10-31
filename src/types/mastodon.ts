export interface Account {
  id: string;
  username: string;
  acct: string;
  displayName: string;
  note: string;
  url: string;
  avatar: string;
  header: string;
  locked: boolean;
  bot: boolean;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  statusesCount: number;
  fields?: { name: string; value: string; verifiedAt?: string }[];
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'gifv' | 'audio';
  url: string;
  previewUrl: string;
  description?: string;
  blurhash?: string;
}

export interface PollOption {
  title: string;
  votesCount: number;
}

export interface Poll {
  id: string;
  expiresAt: string;
  expired: boolean;
  multiple: boolean;
  votesCount: number;
  votersCount: number;
  options: PollOption[];
  voted?: boolean;
  ownVotes?: number[];
}

export type StatusVisibility = 'public' | 'unlisted' | 'private' | 'direct';

export interface Status {
  id: string;
  createdAt: string;
  inReplyToId?: string | null;
  inReplyToAccountId?: string | null;
  sensitive: boolean;
  spoilerText: string;
  visibility: StatusVisibility;
  language: string;
  uri: string;
  url: string;
  repliesCount: number;
  reblogsCount: number;
  favouritesCount: number;
  favourited: boolean;
  reblogged: boolean;
  bookmarked: boolean;
  pinned?: boolean;
  content: string;
  account: Account;
  mediaAttachments: MediaAttachment[];
  mentions: { id: string; username: string; url: string; acct: string }[];
  tags: { name: string; url: string }[];
  poll?: Poll | null;
  reblog?: Status | null;
}

export type NotificationType = 'mention' | 'reblog' | 'favourite' | 'follow' | 'poll';

export interface Notification {
  id: string;
  type: NotificationType;
  createdAt: string;
  account: Account;
  status?: Status;
}

export interface TagTrend {
  name: string;
  url: string;
  history: { day: string; uses: number; accounts: number }[];
  totalUses: number;
}

export type TimelineType = 'home' | 'local' | 'federated' | 'explore' | 'notifications' | 'bookmarks' | 'favourites' | 'profile';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
