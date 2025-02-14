export interface ApiToken {
  id: string;
  userId: string;
  token: string;
  name: string;
  createdAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
} 