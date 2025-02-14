export interface User {
  id?: string;
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  credits?: number;
} 