export interface ProviderConfig {
  name: string;
  baseURL?: string;
  apiKey: string;
  model: string;
}

export const MODEL_PROVIDERS: Record<string, ProviderConfig[]> = {
  'deepseek/deepseek-v3': [
    {
      name: 'DeepSeek',
      baseURL: 'https://api.deepseek.com',
      apiKey: 'sk-0e7a3cb813544b5eb0b690411799ae63',
      model : 'deepseek-chat',
    },
    {
      name: 'Together',
      baseURL: 'https://api.together.xyz/v1',
      apiKey: '193e7efe058c23377ab6e780024a3f88d15406bba12b1329f7d1b624b8148f1b',
      model : 'deepseek-ai/DeepSeek-V3',
    }

  ],
  'meta-llama/Llama-3.3-70B-Instruct-Turbo': [
    {
      name: 'Together',
      baseURL: 'https://api.together.xyz/v1',
      apiKey: '193e7efe058c23377ab6e780024a3f88d15406bba12b1329f7d1b624b8148f1b',
      model : 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
    },
  ],
};