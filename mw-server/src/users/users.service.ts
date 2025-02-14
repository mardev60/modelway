import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class UsersService {
  async getUserInfo(uid: string) {
    try {
      const userRecord = await auth().getUser(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        createdAt: userRecord.metadata.creationTime,
      };
    } catch (error) {
      throw new Error('Error fetching user info');
    }
  }
} 