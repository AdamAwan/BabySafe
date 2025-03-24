import { searchFood } from '../services/foodApi';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai');

describe('foodApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchFood', () => {
    it('should return food safety information for a valid query', async () => {
      const mockResponse = {
        data: {
          name: 'Salmon',
          isSafe: true,
          confidence: 0.95,
          explanation: 'Salmon is safe to eat during pregnancy when properly cooked.',
          safeQuantity: '2-3 servings per week',
          risks: ['Mercury content'],
          benefits: ['High in omega-3 fatty acids'],
          alternatives: ['Tilapia', 'Cod'],
          sourceUrl: 'https://www.mayoclinic.org/pregnancy/food-safety'
        },
        metadata: {
          model: 'gpt-4',
          timestamp: new Date().toISOString()
        }
      };

      (OpenAI as jest.Mock).mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: JSON.stringify(mockResponse.data)
                }
              }],
              model: 'gpt-4'
            })
          }
        }
      }));

      const result = await searchFood('salmon');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      (OpenAI as jest.Mock).mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      await expect(searchFood('salmon')).rejects.toThrow('Failed to fetch food safety information');
    });

    it('should validate and sanitize source URLs', async () => {
      const mockResponse = {
        data: {
          name: 'Test Food',
          isSafe: true,
          confidence: 0.9,
          explanation: 'Test explanation',
          sourceUrl: 'https://invalid-domain.com'
        },
        metadata: {
          model: 'gpt-4',
          timestamp: new Date().toISOString()
        }
      };

      (OpenAI as jest.Mock).mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: JSON.stringify(mockResponse.data)
                }
              }],
              model: 'gpt-4'
            })
          }
        }
      }));

      const result = await searchFood('test food');
      expect(result.data.sourceUrl).toBeUndefined();
    });
  });
}); 