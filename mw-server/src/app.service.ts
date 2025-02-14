import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { FirebaseService } from './services/firebase.service';
import { Model } from './utils/types/models.interface';
import { Provider } from './utils/types/providers.interface';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface APICallOptions {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  classment?: number;
  maxRetries?: number;
  retryDelay?: number;
}

@Injectable()
export class AppService {
  private openAI: OpenAI;
  private allProviders: Provider[] = [];
  private readonly logger = new Logger(AppService.name);
  private readonly modelsCollection = 'models';
  private readonly providersCollection = 'providers';

  constructor(private readonly firebaseService: FirebaseService) {}

  async callApi({
    model,
    systemPrompt,
    userPrompt,
    classment = 1,
    maxRetries = 4,
    retryDelay = 500,
  }: APICallOptions): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    this.logger.log(`Calling API for model ${model} (classement ${classment})`);

    if (!this.allProviders.length) {
      const providersSnapshot = await this.firebaseService.getFirestore()
        .collection(this.providersCollection)
        .get();
      
      this.allProviders = providersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Provider[];
    }

    // Count providers for the model
    const modelsSnapshot = await this.firebaseService.getFirestore()
      .collection(this.modelsCollection)
      .where('name', '==', model)
      .get();
    
    const providersCount = modelsSnapshot.size;

    if (classment > providersCount) {
      throw new Error(`All providers for model ${model} have failed`);
    }

    // Get provider for the model and classment
    const providerSnapshot = await this.firebaseService.getFirestore()
      .collection(this.modelsCollection)
      .where('name', '==', model)
      .where('classment', '==', classment)
      .get();

    if (providerSnapshot.empty) {
      throw new Error(
        `No provider found for model ${model} with classment ${classment}`,
      );
    }

    const provider = {
      id: providerSnapshot.docs[0].id,
      ...providerSnapshot.docs[0].data()
    } as Model;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        this.openAI = await this.initializeOpenAI(
          provider.baseURL,
          provider.provider_id,
        );

        return await this.openAI.chat.completions.create({
          model: provider.src_model,
          messages,
          max_tokens: 1,
        });
      } catch (error) {
        this.logger.error(
          `Provider ${this.getProviderName(provider.provider_id)} for ${provider.name} (classment ${classment}, retry ${retry + 1}/${maxRetries})`
        );

        if (retry < maxRetries - 1) {
          await this.delay(retryDelay);
          continue;
        }

        return this.callApi({
          model,
          systemPrompt,
          userPrompt,
          classment: classment + 1,
          maxRetries,
          retryDelay,
        });
      }
    }

    throw new Error('Unexpected end of execution');
  }

  private async initializeOpenAI(baseURL: string, providerId: string): Promise<OpenAI> {
    return new OpenAI({
      baseURL,
      apiKey: this.getApiKey(providerId),
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getApiKey(providerId: string): string {
    const providerName = this.getProviderName(providerId);
    const apiKey = process.env[`${providerName.toUpperCase()}_API_KEY`];

    if (!apiKey) {
      throw new Error(`No API key found for provider ${providerName}`);
    }

    return apiKey;
  }

  private getProviderName(id: string): string {
    const provider = this.allProviders.find((provider) => provider.id === id);

    if (!provider) {
      throw new Error(`Provider with id ${id} not found`);
    }

    return provider.name;
  }
}
