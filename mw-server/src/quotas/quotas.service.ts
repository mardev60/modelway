import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';

@Injectable()
export class QuotasService {
  private readonly quotasCollection = 'model_user_quotas';

  constructor(private readonly firebaseService: FirebaseService) {}

  async checkUserQuota(userId: string, modelId: string): Promise<number> {
    const sanitizedModelId = modelId.replace(/\//g, '_');
  
    try {
      const docRef = this.firebaseService
        .getFirestore()
        .collection('users')
        .doc(userId)
        .collection('models')
        .doc(sanitizedModelId);

      const doc = await docRef.get();

      if (!doc.exists) {
        console.log(
          `🎯 No quota found for ${userId} and ${modelId}, initializing to 5.`,
        );

        await docRef.set({
          user_id: userId,
          model_name: modelId,
          quota: 5,
        });

        return 5;
      }

      const quotaDoc = doc.data();
      return quotaDoc.quota;
    } catch (error) {
      console.error('Error in checkUserQuota:', error);
      throw new Error(`Error checking quota: ${error.message}`);
    }
  }

  async decrementQuota(userId: string, modelName: string): Promise<void> {
    try {
      const sanitizedModelName = modelName.replace(/\//g, '_');
      
      const docRef = this.firebaseService
        .getFirestore()
        .collection('users')
        .doc(userId)
        .collection('models')
        .doc(sanitizedModelName);

      const doc = await docRef.get();

      if (doc.exists) {
        const quota = doc.data()?.quota || 0;
        await docRef.update({
          quota: Math.max(0, quota - 1)
        });
      } else {
        console.warn(`No quota document found for user ${userId} and model ${modelName}`);
      }
    } catch (error) {
      console.error('Error decrementing quota:', error);
      throw new Error(`Error decrementing quota: ${error.message}`);
    }
  }
}
