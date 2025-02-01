import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Model as ModelDocument } from './utils/schemas/models.schema';
import { Provider as ProviderDocument } from './utils/schemas/providers.schema';

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
  private allProviders: ProviderDocument[] = [];
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(ModelDocument.name)
    private readonly modelModel: Model<ModelDocument>,
    @InjectModel(ProviderDocument.name)
    private readonly providerModel: Model<ProviderDocument>,
  ) {}

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
      this.allProviders = await this.providerModel.find().lean().exec();
    }

    // on stocke le nombre de providers pour le modèle en question
    const providersCount = await this.modelModel.countDocuments({ name: model }).exec();

    if (classment > providersCount) {
      throw new Error(
        `All providers for model ${model} have failed`,
      );
    }

    // on recupère le provider pour le modèle et le classment en question
    const provider = await this.modelModel.findOne({ name: model, classment: classment }).lean().exec();

    if (!provider) {
      throw new Error(
        `No provider found for model ${model} with classment ${classment}`,
      );
    }

    // on crée les messages à envoyer à l'API
    const messages: ChatMessage[] = [ { role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }];

    // on appelle l'API
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        this.openAI = await this.initializeOpenAI(
          provider.baseURL,
          provider.provider_id,
        );

        return await this.openAI.chat.completions.create({
          model: provider.src_model,
          messages,
          max_tokens: 1, // a modifier par la suite, mais pour les tests c ok
        });
      } catch (error) {
        this.logger.error( `Provider ${this.getProviderName(provider.provider_id)} for ${provider.name} (classment ${classment}, retry ${retry + 1}/${maxRetries})` )

        // si une erreur est survenue, on attend un peu avant de réessayer
        if (retry < maxRetries - 1) {
          await this.delay(retryDelay);
          continue;
        }

        // si toutes les tentatives ont échoué, essayer le provider suivant
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

  private async initializeOpenAI(
    baseURL: string,
    providerId: string,
  ): Promise<OpenAI> {
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
    const provider = this.allProviders.find(
      (provider) => provider._id.toString() === id.toString(),
    );

    if (!provider) {
      throw new Error(`Provider with id ${id} not found`);
    }

    return provider.name;
  }
}
