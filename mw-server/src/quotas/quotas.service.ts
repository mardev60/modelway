import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';

@Injectable()
export class QuotasService {
  private readonly quotasCollection = 'model_user_quotas';

  constructor(private readonly firebaseService: FirebaseService) {}

  async checkUserQuota(userId: string, modelName: string): Promise<number> {
    try {
      const snapshot = await this.firebaseService
        .getFirestore()
        .collection(this.quotasCollection)
        .where('user_id', '==', userId)
        .where('model_name', '==', modelName)
        .get();

      if (snapshot.empty) {
        console.log(
          `🎯 Aucun quota trouvé pour ${userId} et ${modelName}, initialisation à 5.`,
        );

        // Initialiser une nouvelle entrée avec 5 quotas
        const newQuotaRef = this.firebaseService
          .getFirestore()
          .collection(this.quotasCollection)
          .doc(`${userId}_${modelName}`); // Clé unique utilisateur + modèle

        await newQuotaRef.set({
          user_id: userId,
          model_name: modelName,
          quota: 5,
        });

        return 5; // Retourne le quota par défaut
      }

      const quotaDoc = snapshot.docs[0].data();
      return quotaDoc.quota;
    } catch (error) {
      console.error('Error in checkUserQuota:', error);
      return 0;
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
