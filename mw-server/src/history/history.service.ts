import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';
import { History } from '../utils/types/history.interface';

@Injectable()
export class HistoryService {
  private readonly historyCollection = 'history';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(historyData: Omit<History, 'id'>): Promise<History> {
    const docRef = await this.firebaseService.getFirestore()
      .collection(this.historyCollection)
      .add(historyData);

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as History;
  }

  async findAllByUserId(userId: string): Promise<History[]> {
    const snapshot = await this.firebaseService.getFirestore()
      .collection(this.historyCollection)
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date
        timestamp: data.timestamp?.toDate() || new Date()
      } as History;
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    const batch = this.firebaseService.getFirestore().batch();
    const snapshot = await this.firebaseService.getFirestore()
      .collection(this.historyCollection)
      .where('userId', '==', userId)
      .get();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  async getRecentlyUsedModels(userId: string, limit: number = 5): Promise<{ model: string; count: number }[]> {
    const snapshot = await this.firebaseService.getFirestore()
      .collection(this.historyCollection)
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    // Create a map to count model usage
    const modelUsage = new Map<string, number>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const currentCount = modelUsage.get(data.model) || 0;
      modelUsage.set(data.model, currentCount + 1);
    });

    // Convert to array and sort by count
    const sortedModels = Array.from(modelUsage.entries())
      .map(([model, count]) => ({ 
        model, 
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedModels;
  }
} 