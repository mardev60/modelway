import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { MODEL_PROVIDERS, ProviderConfig } from './providers.config';

interface ProviderPerformance {
  config: ProviderConfig;
  responseTime: number;
  success: boolean;
}

@Injectable()
export class AppService {
  private provider: OpenAI;
  private cachedProviders: Record<string, { config: ProviderConfig; expiresAt: number }> = {};
  private cacheDurationMs = 5 * 60 * 1000; 
  private bestProvider: ProviderConfig;

  async callApi(model: string, systemPrompt: string, userPrompt: string) {
    try {
      await this.setProvider(model);
      return await this.provider.chat.completions.create({
        model: this.bestProvider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });
    } catch (error) {
      console.error(`Échec avec le provider principal: ${error.message}`);
      const fallbackProviderConfig = await this.getFallbackProvider(model);
      if (fallbackProviderConfig) {
        this.provider = new OpenAI({
          baseURL: fallbackProviderConfig.baseURL,
          apiKey: fallbackProviderConfig.apiKey,
        });
        return this.provider.chat.completions.create({
          model: fallbackProviderConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        });
      } else {
        throw new Error('Aucun provider disponible même après échec.');
      }
    }
  }

  async setProvider(model: string) {
    const now = Date.now();
    console.log(this.cachedProviders);

    this.bestProvider = await this.chooseBestProviderForModel(model);

    if (!this.bestProvider) {
      throw new Error(`Aucun provider disponible pour le modèle "${model}".`);
    }

    this.provider = new OpenAI({
      baseURL: this.bestProvider.baseURL,
      apiKey: this.bestProvider.apiKey,
    });
  }

  async chooseBestProviderForModel(model: string): Promise<ProviderConfig | null> {
    const providers = MODEL_PROVIDERS[model];

    if (!providers || providers.length === 0) {
      throw new Error(`Aucun provider configuré pour le modèle "${model}".`);
    }

    const performanceResults: ProviderPerformance[] = await Promise.all(
      providers.map(async (providerConfig) => {
        const openaiInstance = new OpenAI({
          baseURL: providerConfig.baseURL,
          apiKey: providerConfig.apiKey,
        });

        const start = Date.now();
        try {
          await openaiInstance.chat.completions.create({
            model: providerConfig.model,
            messages: [
              { role: 'system', content: 'Ping' },
              { role: 'user', content: 'Ping' },
            ],
            max_tokens: 1,
          });
          const duration = Date.now() - start;
          console.log(`Provider ${providerConfig.name} répond en ${duration}ms.`);
          return { config: providerConfig, responseTime: duration, success: true };
        } catch (error) {
          console.error(`Erreur avec le provider ${providerConfig.name} :`, error.message);
          return { config: providerConfig, responseTime: Infinity, success: false };
        }
      }),
    );

    const successfulProviders = performanceResults.filter(p => p.success);

    if (successfulProviders.length === 0) {
      return null;
    }

    successfulProviders.sort((a, b) => a.responseTime - b.responseTime);
    const bestProvider = successfulProviders[0].config;

    console.log(`Provider sélectionné pour le modèle "${model}": ${bestProvider.name}`);

    return bestProvider;
  }

  async getFallbackProvider(model: string): Promise<ProviderConfig | null> {
    const providers = MODEL_PROVIDERS[model];
    if (!providers || providers.length < 2) {
      return null;
    }
    
    return providers[1];
  }
}