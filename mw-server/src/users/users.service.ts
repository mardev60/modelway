import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../utils/types/users.interface';

@Injectable()
export class UsersService {
  private readonly usersCollection = 'users';

  constructor(private readonly firebaseService: FirebaseService) {}

  async getUserInfo(uid: string) {
    try {
      // First try to get from Firestore
      const userDoc = await this.firebaseService.getFirestore()
        .collection(this.usersCollection)
        .where('uid', '==', uid)
        .get();

      if (!userDoc.empty) {
        const userData = userDoc.docs[0];
        return { id: userData.id, ...userData.data() } as User;
      }

      // If not found, get from Firebase Auth and create in Firestore
      const firebaseUser = await this.firebaseService.getAuth().getUser(uid);
      return this.createUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        credits: 0,
      });
    } catch (error) {
      throw new Error('Error fetching user info');
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const docRef = await this.firebaseService.getFirestore()
      .collection(this.usersCollection)
      .add({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as User;
  }
} 