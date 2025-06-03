export interface Message {
  id?: string;
  content: string;
  role: 'user' | 'assistant';
  isComplete?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  runId: string | null;
  error: string | null;
}

export interface APIResponse {
  chunk?: string;
  headers?: Headers;
}