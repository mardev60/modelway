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
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.quotasCollection)
      .where('user_id', '==', userId)
      .where('model_name', '==', modelName)
      .get();

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const quota = snapshot.docs[0].data();

      await docRef.update({
        quota: Math.max(0, quota.quota - 1),
      });
    }
  }
}
