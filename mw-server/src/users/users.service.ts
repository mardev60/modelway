import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { auth } from 'firebase-admin';
import { User } from '../utils/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getUserInfo(uid: string) {
    try {
      // First try to get from our database
      let user = await this.userModel.findOne({ uid }).exec();
      
      if (!user) {
        // If not found in our db, get from Firebase and create in our db
        const firebaseUser = await auth().getUser(uid);
        user = await this.createUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      }

      return user;
    } catch (error) {
      throw new Error('Error fetching user info');
    }
  }

  async createUser(userData: Partial<User>) {
    const user = new this.userModel(userData);
    return user.save();
  }
} 