import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';

const DEFAULT_QUOTA = 5;
const QUOTA_COLLECTION = 'models';
const USERS_COLLECTION = 'users';

@Injectable()
export class QuotasService {
  private readonly logger = new Logger(QuotasService.name);
  private quotaCache = new Map<string, number>();

  constructor(private readonly firebaseService: FirebaseService) {}

  async checkUserQuota(userId: string, modelId: string): Promise<number> {
    this.validateInput(userId, modelId);
    const cacheKey = this.getCacheKey(userId, modelId);

    if (this.quotaCache.has(cacheKey)) {
      return this.quotaCache.get(cacheKey);
    }

    try {
      const sanitizedModelId = this.sanitizeModelId(modelId);
      const docRef = await this.getModelQuotaDocRef(userId, sanitizedModelId);
      const doc = await docRef.get();

      if (!doc.exists) {
        this.logger.log(`Initializing quota for ${userId} and ${modelId}`);
        await docRef.set({
          user_id: userId,
          model_name: modelId,
          quota: DEFAULT_QUOTA,
        });
        this.quotaCache.set(cacheKey, DEFAULT_QUOTA);
        return DEFAULT_QUOTA;
      }

      const quota = doc.data().quota;
      this.quotaCache.set(cacheKey, quota);
      return quota;
    } catch (error) {
      this.logger.error(`Error in checkUserQuota: ${error.message}`, error.stack);
      throw new Error(`Error checking quota: ${error.message}`);
    }
  }

  async decrementQuota(userId: string, modelName: string): Promise<void> {
    this.validateInput(userId, modelName);
    const cacheKey = this.getCacheKey(userId, modelName);

    try {
      const sanitizedModelName = this.sanitizeModelId(modelName);
      const docRef = await this.getModelQuotaDocRef(userId, sanitizedModelName);
      const doc = await docRef.get();

      if (doc.exists) {
        const quota = doc.data()?.quota || 0;
        const newQuota = Math.max(0, quota - 1);
        await docRef.update({ quota: newQuota });
        this.quotaCache.set(cacheKey, newQuota);
      } else {
        this.logger.warn(`No quota document found for user ${userId} and model ${modelName}`);
      }
    } catch (error) {
      this.logger.error(`Error decrementing quota: ${error.message}`, error.stack);
      throw new Error(`Error decrementing quota: ${error.message}`);
    }
  }

  async getUserQuotas(userId: string): Promise<Record<string, number>> {
    this.validateInput(userId, 'dummy'); // Validate just the userId

    try {
      const userDocRef = await this.getUserDocRef(userId);
      const quotasCollection = await userDocRef.collection(QUOTA_COLLECTION).get();
      
      const quotas: Record<string, number> = {};
      quotasCollection.forEach(doc => {
        quotas[doc.id] = doc.data().quota;
      });

      return quotas;
    } catch (error) {
      this.logger.error(`Error getting user quotas: ${error.message}`, error.stack);
      throw new Error(`Error getting user quotas: ${error.message}`);
    }
  }

  async resetQuota(userId: string, modelName: string, newQuota: number = DEFAULT_QUOTA): Promise<void> {
    this.validateInput(userId, modelName);
    const cacheKey = this.getCacheKey(userId, modelName);

    try {
      const sanitizedModelName = this.sanitizeModelId(modelName);
      const docRef = await this.getModelQuotaDocRef(userId, sanitizedModelName);
      await docRef.set({
        user_id: userId,
        model_name: modelName,
        quota: newQuota,
      }, { merge: true });
      this.quotaCache.set(cacheKey, newQuota);
    } catch (error) {
      this.logger.error(`Error resetting quota: ${error.message}`, error.stack);
      throw new Error(`Error resetting quota: ${error.message}`);
    }
  }

  private async getModelQuotaDocRef(userId: string, modelId: string) {
    const userDocRef = await this.getUserDocRef(userId);
    return userDocRef.collection(QUOTA_COLLECTION).doc(modelId);
  }

  private async getUserDocRef(userId: string) {
    const userQuery = await this.firebaseService
      .getFirestore()
      .collection(USERS_COLLECTION)
      .where('uid', '==', userId)
      .get();

    if (userQuery.empty) {
      throw new Error(`User ${userId} not found`);
    }

    return userQuery.docs[0].ref;
  }

  private sanitizeModelId(modelId: string): string {
    return modelId.replace(/\//g, '_');
  }

  private validateInput(userId: string, modelId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId');
    }
    if (!modelId || typeof modelId !== 'string') {
      throw new Error('Invalid modelId');
    }
  }

  private getCacheKey(userId: string, modelId: string): string {
    return `${userId}:${modelId}`;
  }
}
