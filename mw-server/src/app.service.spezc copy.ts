import { Test, TestingModule } from '@nestjs/testing';
import { mockChatGPTResponse } from './__mocks__/api-responses';
import {
  mockCollection,
  mockProviderSnapshot,
  mockSnapshot,
} from './__mocks__/firebase';
import { AppService } from './app.service';
import { HistoryService } from './history/history.service';
import { QuotasService } from './quotas/quotas.service';
import { FirebaseService } from './services/firebase.service';
import { UsersService } from './users/users.service';

describe('AppService', () => {
  let service: AppService;
  let usersService: UsersService;
  let quotasService: QuotasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: FirebaseService,
          useValue: {
            getFirestore: jest.fn().mockReturnValue({
              collection: jest.fn().mockImplementation((collectionName) => ({
                ...mockCollection,
                get: jest
                  .fn()
                  .mockResolvedValue(
                    collectionName === 'providers'
                      ? mockProviderSnapshot
                      : mockSnapshot,
                  ),
              })),
            }),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            create: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            decrementCredits: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: QuotasService,
          useValue: {
            decrementQuota: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    usersService = module.get<UsersService>(UsersService);
    quotasService = module.get<QuotasService>(QuotasService);

    // Setup mocks
    mockCollection.get.mockResolvedValue(mockSnapshot);
    process.env.OPENAI_API_KEY = 'my-test-api-key';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('callApi', () => {
    it('should successfully call the API and return a response', async () => {
      // Mock OpenAI chat completion
      jest.spyOn(service as any, 'initializeOpenAI').mockResolvedValue({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockChatGPTResponse),
          },
        },
      });

      const result = await service.callApi({
        model: 'gpt-4',
        systemPrompt:
          'You are a fullstack developer and you are a expert in NestJS and Angular',
        userPrompt:
          'Can you create a simple NestJS application with a Angular frontend?',
        userId: 'user1',
        isTest: false,
      });

      expect(result).toEqual(mockChatGPTResponse);
      expect(mockCollection.where).toHaveBeenCalledWith('name', '==', 'gpt-4');
      expect(usersService.decrementCredits).toHaveBeenCalledWith(
        'user1',
        expect.any(Number),
      );
    });

    it('should throw error when no provider is found', async () => {
      mockCollection.get.mockResolvedValueOnce({
        ...mockSnapshot,
        empty: true,
      });

      await expect(
        service.callApi({
          model: 'gpt-4',
          systemPrompt: 'You are a helpful assistant',
          userPrompt: 'Hello',
          userId: 'user1',
          isTest: true,
        }),
      ).rejects.toThrow('All providers for model gpt-4 have failed');
    });

    it('should decrement quota after successful API test call', async () => {
      jest.spyOn(service as any, 'initializeOpenAI').mockResolvedValue({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockChatGPTResponse),
          },
        },
      });

      await service.callApi({
        model: 'gpt-4',
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Hello',
        userId: 'user1',
        isTest: true,
      });

      expect(quotasService.decrementQuota).toHaveBeenCalledWith(
        'user1',
        'gpt-4',
      );
    });
  });
});
