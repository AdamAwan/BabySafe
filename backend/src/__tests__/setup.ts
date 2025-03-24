import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.PORT = '3001';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.CACHE_TTL = '3600';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.NODE_ENV = 'test';

// Increase timeout for all tests
jest.setTimeout(10000); 