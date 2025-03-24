import { FoodSearchResponse } from '../types/food';

const API_BASE_URL = 'http://localhost:3001/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// List of allowed domains for source URLs
const ALLOWED_DOMAINS = [
  'mayoclinic.org',
  'webmd.com',
  'nhs.uk',
  'americanpregnancy.org',
  'cdc.gov',
  'healthline.com',
  'whattoexpect.com',
  'babycenter.com',
  'parents.com',
  'verywellfamily.com'
];

// Function to validate if a URL is from an allowed domain
const isValidSourceUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ALLOWED_DOMAINS.some(domain => urlObj.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

// Function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchFood = async (query: string): Promise<FoodSearchResponse> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch food safety information');
      }

      const data = await response.json();

      // Validate response data
      if (!data || !data.data || typeof data.data !== 'object') {
        throw new Error('Invalid response format');
      }

      // Validate source URL if present
      if (data.data.sourceUrl && !isValidSourceUrl(data.data.sourceUrl)) {
        console.warn('Invalid source URL received:', data.data.sourceUrl);
        data.data.sourceUrl = undefined;
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      // Don't retry on validation errors or if the request was aborted
      if (error instanceof Error && 
          (error.message.includes('Invalid input') || error.name === 'AbortError')) {
        throw error;
      }

      // Wait before retrying
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * attempt);
      }
    }
  }

  throw lastError || new Error('Failed to fetch food safety information after multiple attempts');
}; 