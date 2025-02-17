import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';
import { Model } from '../utils/types/models.interface';
import { Provider } from '../utils/types/providers.interface';

@Injectable()
export class ProvidersService {
  private readonly providersCollection = 'providers';
  private readonly modelsCollection = 'models';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<Provider[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.providersCollection)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Provider[];
  }

  async findByName(name: string): Promise<Provider> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.providersCollection)
      .where('name', '==', name)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error('Provider not found');
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Provider;
  }

  async getModels(id: string): Promise<Model[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .where('provider_id', '==', id)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Model[];
  }

  async getModelsGroupedByProvider() {
    const [modelsSnapshot, providersSnapshot] = await Promise.all([
      this.firebaseService
        .getFirestore()
        .collection(this.modelsCollection)
        .get(),
      this.firebaseService
        .getFirestore()
        .collection(this.providersCollection)
        .get(),
    ]);

    const models = modelsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Model[];

    const providers = providersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Provider[];

    const grouped = {};
    providers.forEach((provider) => {
      grouped[provider.name] = models
        .filter((model) => model.provider_id === provider.id)
        .map((model) => model);
    });

    return grouped;
  }

  async create(providerData: Provider): Promise<Provider> {
    const docRef = await this.firebaseService
      .getFirestore()
      .collection(this.providersCollection)
      .add(providerData);

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Provider;
  }

  async delete(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection(this.providersCollection)
      .doc(id)
      .delete();
  }
}
