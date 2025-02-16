import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ModelsService } from 'src/models/models.service';
import { FirebaseService } from '../services/firebase.service';
@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name);
  private openAI: OpenAI;
  private allProviders: any = [];
  private result = [];
  private readonly providersCollection = 'providers';

  private readonly SCORE_WEIGHTS = {
    latency: parseFloat(process.env.WEIGHT_LATENCY) || 0.4,
    inputCost: parseFloat(process.env.WEIGHT_INPUT_COST) || 0.2,
    outputCost: parseFloat(process.env.WEIGHT_OUTPUT_COST) || 0.2,
    reliability: parseFloat(process.env.WEIGHT_RELIABILITY) || 0.1,
    availability: parseFloat(process.env.WEIGHT_AVAILABILITY) || 0.1,
  };

  private readonly SCORE_THRESHOLDS = {
    maxLatency: parseFloat(process.env.MAX_LATENCY) || 5000, // 5 seconds
    minSuccessRate: parseFloat(process.env.MIN_SUCCESS_RATE) || 0.8,
  };

  constructor(
    private readonly modelService: ModelsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async pingAllProviders() {
    this.logger.log('Starting to ping all providers');
    let allModelsProviders = await this.modelService.findAll();

    const db = this.firebaseService.getFirestore();
    
    const providersSnapshot = db.collection(this.providersCollection);
    
    this.allProviders = await providersSnapshot.get().then((snapshot) => snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })));

    const allResponses = [];

    await Promise.all(
      Object.entries(allModelsProviders).map(async ([modelName, providers]) => {
        this.logger.debug(`Pinging providers for model: ${modelName}`);

        await Promise.all(
          providers.map(async (provider) => {
            this.logger.debug(`Pinging provider at ${provider.baseURL}`);

            const apiKey = this.getApiKey(provider.provider_id);
            if (!apiKey) {
                this.logger.warn(`Skipping provider ${provider.baseURL} - No API key found`);
                allResponses.push({
                    provider,
                    responseTime: null,
                    success: false,
                });
                return;
            }

            this.openAI = new OpenAI({
              baseURL: provider.baseURL,
              apiKey: apiKey,
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
          return this.firebaseService.getFirestore()
            .collection('models')
            .doc(update.id)
            .update({
              latency: update.responseTime,
              last_ping: new Date(),
              classment: update.classment,
            });
        }),
      );
      this.logger.log('Provider statuses updated successfully');
    } catch (error) {
      this.logger.error('Error updating provider statuses', error.stack);
    }
  }

  private calculateScore(provider, bestLatency) {
    if (!provider || provider.responseTime === null) return -Infinity;

    // Check if provider meets minimum requirements
    if (provider.responseTime > this.SCORE_THRESHOLDS.maxLatency) return -Infinity;
    if (provider.successRate < this.SCORE_THRESHOLDS.minSuccessRate) return -Infinity;

    // Normalize values
    const latencyScore = this.normalizeLatency(provider.responseTime, bestLatency);
    const inputCostScore = this.normalizeCost(provider?.provider?.input_price);
    const outputCostScore = this.normalizeCost(provider?.provider?.output_price);
    const reliabilityScore = provider.successRate || 1;
    const availabilityScore = provider.availability || 1;

    // Calculate weighted score
    return (
      this.SCORE_WEIGHTS.latency * latencyScore +
      this.SCORE_WEIGHTS.inputCost * inputCostScore +
      this.SCORE_WEIGHTS.outputCost * outputCostScore +
      this.SCORE_WEIGHTS.reliability * reliabilityScore +
      this.SCORE_WEIGHTS.availability * availabilityScore
    );
  }

  private normalizeLatency(responseTime, bestLatency) {
    if (responseTime <= 0) return 0;
    const latencyRatio = bestLatency / responseTime;
    return Math.min(1, Math.log(latencyRatio + 1));
  }

  private normalizeCost(cost) {
    if (cost === undefined || cost === null) return 1;
    // Convert cost to a score where lower costs are better
    return 1 / (1 + Math.log(1 + cost));
  }

  private sortProviders(providers) {
    if (!providers || providers.length === 0) return [];
    
    const bestLatency = Math.min(
      ...providers.map(p => p.responseTime || Infinity)
    );

    return providers
      .map(provider => ({
        ...provider,
        score: this.calculateScore(provider, bestLatency)
      }))
      .sort((a, b) => {
        if (a.score === b.score) {
          // If scores are equal, prefer the provider with better latency
          return a.responseTime - b.responseTime;
        }
        return b.score - a.score;
      });
  }

  private generateUpdates(providerGroup) {
    const sortedProviders = this.sortProviders(providerGroup.providers);
    
    return sortedProviders.map((provider, index) => {
      const score = provider.score || 0;
      const grade = this.calculateGrade(score);
      
      return {
        id: provider.provider.id,
        responseTime: provider.responseTime,
        classment: index + 1,
        score: score,
        grade: grade
      };
    });
  }

  private calculateGrade(score) {
    if (score < 0) return 'F';
    if (score >= 0.9) return 'A';
    if (score >= 0.8) return 'B';
    if (score >= 0.7) return 'C';
    if (score >= 0.6) return 'D';
    return 'F';
  }

  private getApiKey(providerId: string) {
    const providerName = this.getProviderName(providerId);
    if (!providerName) {
        this.logger.warn(`No provider found with ID: ${providerId}`);
        return null;
    }
    return process.env[`${providerName.toUpperCase()}_API_KEY`];
  }

  private getProviderName(id: string) {
    const provider = this.allProviders.find((provider) => provider.id === id);
    if (!provider) {
        this.logger.warn(`Provider not found with ID: ${id}`);
        return null;
    }
    return provider.name;
  }
}