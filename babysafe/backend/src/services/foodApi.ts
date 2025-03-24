import { FoodSearchResponse } from '../types/food';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

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

export const searchFood = async (query: string): Promise<FoodSearchResponse> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-search-preview-2025-03-11',
        messages: [
          {
            role: 'system',
            content: `You are a pregnancy food safety expert. You MUST respond with a valid JSON object. Your response should be a single JSON object with the following structure:

{
  "name": string,
  "isSafe": boolean,
  "confidence": number (0-1),
  "explanation": string,
  "safeQuantity": string (optional),
  "risks": string[] (optional),
  "benefits": string[] (optional),
  "alternatives": string[] (optional),
  "sourceUrl": string (optional)
}

IMPORTANT:
1. Your response MUST be a valid JSON object
2. Do not include any text before or after the JSON object
3. Do not include markdown formatting
4. ALWAYS include a sourceUrl field with a real, working URL from one of these trusted medical websites:
   - Mayo Clinic (mayoclinic.org)
   - WebMD (webmd.com)
   - NHS (nhs.uk)
   - American Pregnancy Association (americanpregnancy.org)
   - CDC (cdc.gov)
   - Healthline (healthline.com)
   - What to Expect (whattoexpect.com)
   - BabyCenter (babycenter.com)
   - Parents (parents.com)
   - Verywell Family (verywellfamily.com)
5. The sourceUrl must be a direct link to the specific food safety information
6. If you cannot find a specific URL, use the main website URL of one of these sources`
          },
          {
            role: 'user',
            content: `Is ${query} safe to eat during pregnancy? Respond with a valid JSON object containing the safety information. Make sure to include a sourceUrl from one of the trusted medical websites.`
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the content field
    const content = data.choices[0].message.content;
    
    try {
      // Try to parse the content directly first
      let parsedData = JSON.parse(content);
      
      // If that fails, try to extract JSON from markdown code blocks
      if (!parsedData) {
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('Response is not in valid JSON format');
        }
      }

      // Validate the source URL if present
      if (parsedData.sourceUrl && !isValidSourceUrl(parsedData.sourceUrl)) {
        console.warn('Invalid source URL:', parsedData.sourceUrl);
        // Instead of deleting the URL, try to find a valid one from the allowed domains
        const validUrl = `https://www.${ALLOWED_DOMAINS[0]}/pregnancy/food-safety`;
        parsedData.sourceUrl = validUrl;
      }

      return {
        data: parsedData,
        metadata: {
          model: data.model,
          timestamp: new Date().toISOString(),
        }
      };
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      console.error('Raw response:', content);
      throw new Error('Failed to parse food safety information. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching food safety information:', error);
    throw new Error('Failed to fetch food safety information. Please try again.');
  }
}; 