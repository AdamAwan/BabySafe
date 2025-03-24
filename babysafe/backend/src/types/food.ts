export interface FoodSafetyInfo {
  name: string;
  isSafe: boolean;
  confidence: number;
  explanation: string;
  safeQuantity?: string;
  risks?: string[];
  benefits?: string[];
  alternatives?: string[];
  sourceUrl?: string;
}

export interface FoodSearchResponse {
  data: FoodSafetyInfo;
  metadata: {
    model: string;
    timestamp: string;
  };
} 