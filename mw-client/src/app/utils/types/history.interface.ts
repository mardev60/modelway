export interface History {
  id: string;
  timestamp: Date;
  model: string;
  app: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  speed: number;
  provider: string;
} 