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
  private result = [];

  constructor(
    private readonly modelService: ModelsService,
    @InjectModel(ProviderDocument.name)
    private readonly providerModel: Model<ProviderDocument>,
    @InjectModel(ModelDocument.name)
    private readonly modelModel: Model<ModelDocument>,
  ) {}

  async pingAllProviders() {
    this.logger.log('Starting to ping all providers');
    let allModelsProviders = await this.modelService.findAll();
    this.allProviders = await this.providerModel.find().exec();

    const allResponses = [];

    await Promise.all(
      Object.entries(allModelsProviders).map(async ([modelName, providers]) => {
        this.logger.debug(`Pinging providers for model: ${modelName}`);

        await Promise.all(
          providers.map(async (provider) => {
            this.logger.debug(`Pinging provider at ${provider.baseURL}`);

            this.openAI = new OpenAI({
              baseURL: provider.baseURL,
              apiKey: this.getApiKey(provider.provider_id),
            });

            const start = Date.now();
            const timeout = 10000;

            try {
              const responsePromise = this.openAI.chat.completions.create({
                model: provider.src_model,
                messages: [
                  { role: 'system', content: '-' },
                  { role: 'user', content: '-' },
                ],
                max_tokens: 1,
              });

              await Promise.race([
                responsePromise,
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout')), timeout),
                ),
              ]);

              let duration = Date.now() - start;
              this.logger.log(
                `Provider ${provider.baseURL} responded in ${duration}ms`,
              );

              allResponses.push({
                provider,
                responseTime: duration,
                success: true,
              });
            } catch (error) {
              this.logger.warn(
                `Failed to ping provider ${provider.baseURL}: ${error.message}`,
              );
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

    this.logger.log('Completed provider pinging');
    this.updateProvidersStatus();
  }

  async updateProvidersStatus() {
    this.logger.log('Updating provider statuses');
    const updatePromises = this.result.flatMap((providerGroup) =>
      this.generateUpdates(providerGroup),
    );

    try {
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
      this.logger.log('Provider statuses updated successfully');
    } catch (error) {
      this.logger.error('Error updating provider statuses', error.stack);
    }
  }

  private calculateScore(provider, bestLatency) {
    if (!provider || provider.responseTime === null) return -Infinity;

    const weightLatency = 0.6;
    const weightInputCost = 0.15;
    const weightOutputCost = 0.25;

    const latencyRatio = bestLatency / provider.responseTime;
    const normalizedLatency = Math.log(latencyRatio + 1);

    const penalty =
      provider.responseTime > 2000
        ? Math.exp((provider.responseTime - 2000) / 1000) * 0.1
        : 1;

    return (
      weightLatency * normalizedLatency * penalty +
      weightInputCost * (1 - this.normalize(provider?.provider?.input_price)) +
      weightOutputCost * (1 - this.normalize(provider?.provider?.output_price))
    );
  }

  private sortProviders(providers) {
    const bestLatency = Math.min(
      ...providers.map((p) => p.responseTime || Infinity),
    );
    return providers.sort((a, b) => {
      if (a.responseTime === null) return 1;
      if (b.responseTime === null) return -1;
      return (
        this.calculateScore(b, bestLatency) -
        this.calculateScore(a, bestLatency)
      );
    });
  }

  private generateUpdates(providerGroup) {
    const sortedProviders = this.sortProviders(providerGroup.providers);

    return sortedProviders.map((provider, index) => ({
      id: provider.provider._id,
      responseTime: provider.responseTime,
      classment: index + 1,
    }));
  }

  private normalize(value: number) {
    return value > 0 ? 1 / value : 0;
  }

  getApiKey(providerId: string) {
    const providerName = this.getProviderName(providerId);
    return process.env[`${providerName.toUpperCase()}_API_KEY`];
  }

  getProviderName(id: string) {
    return this.allProviders.find((provider) => provider._id.equals(id)).name;
  }
}