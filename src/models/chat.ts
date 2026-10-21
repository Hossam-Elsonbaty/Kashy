export interface CreditWindow {
  limit: number;
  used: number;
  reserved: number;
  remaining: number;
  resetsAtUtc: string;
}

export interface CreditAllowance {
  tier: string;
  daily: CreditWindow;
  monthly: CreditWindow;
}

export interface ChatModelChoice { id: string; name: string; isDefault: boolean }
export interface ChatMetric { id: string; label: string; value: number | null; unit: string }
export interface ChatChart {
  type: string;
  title: string;
  labels: string[];
  series: { name: string; values: number[] }[];
  evidenceId: string;
}
export interface FinancialQuery {
  analysis: string;
  from: string | null;
  to: string | null;
  compareFrom: string | null;
  compareTo: string | null;
  cashbookId: string | null;
  categoryId: string | null;
  paymentMethodId: string | null;
  direction: string;
  search: string | null;
  includeChart: boolean;
  clarification: string | null;
}
export interface ChatAnalysis {
  query: FinancialQuery;
  currency: string;
  metrics: ChatMetric[];
  charts: ChatChart[];
  entries: { id: string; date: string; name: string | null; amount: number; direction: string }[];
  suggestions: { text: string; evidenceId: string }[];
  limitations: string[];
  evidence: { id: string; description: string; retrievedAtUtc: string }[];
}
export interface ChatResponse {
  conversationId: string;
  answer: string;
  data: ChatAnalysis | null;
  needsClarification: boolean;
  credits: CreditAllowance | null;
}
export interface ChatTurn { question: string; response: ChatResponse; createdAtUtc: string }
export interface ChatConversation { id: string; userId: string; turns: ChatTurn[] }
export interface SavedChat { id: string; updatedAt: string }

export interface ManagedModel {
  id: string;
  name: string;
  providerName: string;
  providerKey: string;
  invocationId: string;
  isEnabled: boolean;
  maxInputTokens: number;
  maxOutputTokens: number;
  disabledReason: string | null;
}
export interface Tier {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  dailyTokenLimit: number;
  monthlyTokenLimit: number;
  defaultModelId: string;
}
export interface ManagedTier { tier: Tier; allowedModelIds: string[] }
export interface ChatSettings { defaultTierId: string; tokensPerCredit: number }
export interface UsageRecord {
  id: string;
  userId: string;
  tierId: string;
  modelId: string;
  createdAtUtc: string;
  inputTokens: number;
  outputTokens: number;
  chargedTokens: number;
  reservedTokens: number;
  status: string;
  reconciliationReason: string | null;
}
