import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ApiToken } from '../utils/types/api-token.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiTokenService {
  private readonly tokensCollection = 'api_tokens';

  constructor(private readonly firebaseService: FirebaseService) {}

  async generateToken(userId: string, name: string): Promise<ApiToken> {
    const token = randomBytes(32).toString('hex');
    
    const apiToken: ApiToken = {
      id: randomBytes(16).toString('hex'),
      userId,
      token,
      name,
      createdAt: new Date(),
      isActive: true,
    };

    await this.firebaseService
      .getFirestore()
      .collection(this.tokensCollection)
      .doc(apiToken.id)
      .set(apiToken);

    return apiToken;
  }

  async validateToken(token: string): Promise<ApiToken | null> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.tokensCollection)
      .where('token', '==', token)
      .where('isActive', '==', true)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const apiToken = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as ApiToken;

    // Update last used timestamp
    await this.firebaseService
      .getFirestore()
      .collection(this.tokensCollection)
      .doc(apiToken.id)
      .update({ lastUsedAt: new Date() });

    return apiToken;
  }

  async getTokensByUserId(userId: string): Promise<ApiToken[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.tokensCollection)
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ApiToken[];
  }

  async deactivateToken(tokenId: string, userId: string): Promise<void> {
    const tokenRef = this.firebaseService
      .getFirestore()
      .collection(this.tokensCollection)
      .doc(tokenId);

    const token = await tokenRef.get();
    if (!token.exists || token.data().userId !== userId) {
      throw new Error('Token not found or unauthorized');
    }

    await tokenRef.update({ isActive: false });
  }
} 