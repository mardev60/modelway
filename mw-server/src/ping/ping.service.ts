import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { ModelsService } from 'src/models/models.service';
import { Model as ModelDocument } from 'src/utils/schemas/models.schema';
import { Provider as ProviderDocument } from 'src/utils/schemas/providers.schema';

@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name);
  private openAI: OpenAI;
  private allProviders: any[] = [];
  private providersByResponseTimes: any[] = [];
  private result = [];

  constructor(
    private readonly modelService: ModelsService,
    @InjectModel(ProviderDocument.name)
    private readonly providerModel: Model<ProviderDocument>,
    @InjectModel(ModelDocument.name)
    private readonly modelModel: Model<ModelDocument>,
  ) {}

  //@Cron(CronExpression.EVERY_30_SECONDS)
  async pingAllProviders() {
    let allModelsProviders = await this.modelService.findAll();
    this.allProviders = await this.providerModel.find().exec();

    const allResponses = [];

    await Promise.all(
      Object.entries(allModelsProviders).map(async ([modelName, providers]) => {
        this.logger.debug(`Pinging ${modelName} providers`);

        await Promise.all(
          providers.map(async (provider) => {
            this.logger.debug(`Pinging ${provider.baseURL} provider`);

            this.openAI = new OpenAI({
              baseURL: provider.baseURL,
              apiKey: this.getApiKey(provider.provider_id),
            });

            const start = Date.now();

            try {
              await this.openAI.chat.completions.create({
                model: provider.src_model,
                messages: [
                  { role: 'system', content: '-' },
                  { role: 'user', content: '-' },
                ],
                max_tokens: 1,
              });

              const duration = Date.now() - start;
              console.log(`CALL -- ${provider.baseURL} -- `, duration);

              allResponses.push({
                provider,
                responseTime: duration,
                success: true,
              });
            } catch (error) {
              allResponses.push({
                provider,
                responseTime: null,
                success: false,
              });
            }
          }),
        );
      }),
    );

    const groupedProviders = allResponses.reduce((acc, item) => {
      const name = item.provider.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(item);
      return acc;
    }, {});

    this.result = Object.entries(groupedProviders).map(([name, providers]) => ({
      name,
      providers,
    }));

    console.log('----', this.result, '----');

    this.updateProvidersStatus();
  }

  async updateProvidersStatus() {
    // Collecte les mises à jour pour chaque providerGroup
    const updatePromises = this.result.flatMap((providerGroup) =>
      this.generateUpdates(providerGroup),
    );

    try {
      // Met à jour la base de données en parallèle pour chaque provider
      await Promise.all(
        updatePromises.map(async (update) => {
          return this.modelModel.updateOne(
            { _id: update.id },
            {
              $set: {
                latency: update.responseTime,
                last_ping: new Date(),
                classment: update.classment,
              },
            },
          );
        }),
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour des providers :', error);
    }
  }

  /**
   * Trie les providers en plaçant ceux avec `responseTime === null` à la fin.
   */
  private sortProvidersByResponseTime(providers) {
    return providers.sort((a, b) => {
      const aIsNull = a.responseTime === null;
      const bIsNull = b.responseTime === null;

      const areBothNull = aIsNull === bIsNull; // Vérifie si `a` et `b` ont le même état pour `responseTime`
      const providerRanking = aIsNull ? 1 : -1; // Attribue un classement basé sur le fait que `a` soit null ou non
      return areBothNull ? 0 : providerRanking; // Si `a` et `b` ont le même état (null ou non), ils restent dans l'ordre initial (retourne 0).
    });
  }

  /**
   * Génère un tableau de mises à jour avec classement.
   */
  private generateUpdates(providerGroup) {
    const sortedProviders = this.sortProvidersByResponseTime(
      providerGroup.providers,
    );

    return sortedProviders.map((provider, index) => ({
      id: provider.provider._id,
      responseTime: provider.responseTime,
      classment: index + 1,
    }));
  }

  getApiKey(providerId: string) {
    const providerName = this.getProviderName(providerId);
    return process.env[`${providerName.toUpperCase()}_API_KEY`];
  }

  getProviderName(id: string) {
    return this.allProviders.find((provider) => provider._id.equals(id)).name;
  }
}
