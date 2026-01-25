import guangzhouTransitJson from "./guangzhou-transit.json";

// =====================
// Types
// =====================
export type RecommendationTimeBudget = {
  minMinutes?: number;
  recommendedMinutes?: number;
};

export type RecommendationItem = {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
  timeBudget?: RecommendationTimeBudget;
  howTo?: string[];
  plan?: Record<string, string>;
  facts?: unknown;
  riskNotes?: string[];
  searchQuery?: string;
};

export type RecommendationSection = {
  key: string;
  titleJa: string;
  descriptionJa?: string;
  items: RecommendationItem[];
};

export type RecommendationDoc = {
  slug: string;
  titleJa: string;
  subtitleJa?: string;
  meta?: unknown;
  guardrails?: {
    headlineJa?: string;
    rules?: string[];
    recommendedReturnTimeToAirport?: string;
  };
  sections: RecommendationSection[];
};

// =====================
// Registry
// =====================
const guangzhouTransit = guangzhouTransitJson as unknown as RecommendationDoc;

const docs: Record<string, RecommendationDoc> = {
  [guangzhouTransit.slug]: guangzhouTransit,
};

export function getRecommendationDoc(slug: string): RecommendationDoc | null {
  return docs[slug] ?? null;
}
