import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../services/firebase.service';
import { Model } from '../utils/types/models.interface';

@Injectable()
export class ModelsService {
  private readonly modelsCollection = 'models';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<{ [key: string]: Model[] }> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .get();

    const models = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Nettoyage des clés
      const cleanedData = Object.entries(data).reduce(
        (acc, [key, value]) => {
          const trimmedKey = key.trim(); // Supprime les espaces inutiles
          acc[trimmedKey] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

      return {
        id: doc.id,
        ...cleanedData,
      };
    }) as Model[];

    console.log(models);

    const groupedByName = models.reduce(
      (acc, model) => {
        if (!acc[model.name]) {
          acc[model.name] = [];
        }
        acc[model.name].push(model);
        return acc;
      },
      {} as { [key: string]: Model[] },
    );

    return groupedByName;
  }

  async findDistinctModelNames(): Promise<string[]> {
    const models = await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .get();

    const names = models.docs.map((doc) => doc.data().name);
    return [...new Set(names)]; // Utilise Set pour éliminer les doublons
  }

  async findByGroup(groupName: string): Promise<Model[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .where('name', '==', groupName)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Model[];
  }

  async create(modelData: Partial<Model>): Promise<Model> {
    const docRef = await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .add({
        ...modelData,
        createdAt: new Date(),
      });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Model;
  }

  async delete(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .doc(id)
      .delete();
  }

  async findByName(name: string): Promise<Model[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection(this.modelsCollection)
      .where('name', '==', name)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Model[];
  }
}
