import { mockModel } from './models';

export const mockCollection = {
  get: jest.fn(),
  where: jest.fn().mockReturnThis(),
};

export const mockSnapshot = {
  docs: [
    {
      id: mockModel.id,
      data: () => mockModel,
    },
  ],
  empty: false,
  size: 1,
};

export const mockProviderSnapshot = {
  docs: [
    {
      id: 'openai',
      data: () => ({
        id: 'openai',
        name: 'OpenAI',
        baseURL: 'https://api.openai.com/v1',
      }),
    },
  ],
  empty: false,
  size: 1,
};
