import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';
import { Provider } from '../utils/types/providers.interface';
import { Model } from '../utils/types/models.interface';

@Injectable()
export class ProvidersService {
  private readonly providersCollection = 'providers';
  private readonly modelsCollection = 'models';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<Provider[]> {
    const snapshot = await this.firebaseService.getFirestore()
      .collection(this.providersCollection)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Provider[];
  }

  async getModelsGroupedByProvider() {
    const [modelsSnapshot, providersSnapshot] = await Promise.all([
      this.firebaseService.getFirestore().collection(this.modelsCollection).get(),
      this.firebaseService.getFirestore().collection(this.providersCollection).get()
    ]);

    const models = modelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Model[];

    const providers = providersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Provider[];

    const grouped = {};
    providers.forEach((provider) => {
      grouped[provider.name] = models
        .filter((model) => model.provider_id === provider.id)
        .map((model) => model);
    });

    return grouped;
  }
}
