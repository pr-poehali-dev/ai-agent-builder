export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'document' | 'api' | 'database';
  size?: number;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
}

export interface ValidationIssue {
  id: string;
  type: 'contradiction' | 'duplicate' | 'ambiguity';
  severity: 'high' | 'medium' | 'low';
  description: string;
  sources: string[];
  status: 'pending' | 'resolved' | 'approved';
}

export interface Agent {
  id: string;
  name: string;
  scenario: string;
  status: 'draft' | 'training' | 'ready' | 'published';
  apiKey?: string;
  createdAt: string;
  dataSources: DataSource[];
}

export interface AgentState {
  currentScenario: Scenario | null;
  dataSources: DataSource[];
  validationIssues: ValidationIssue[];
  agent: Agent | null;
  isLoading: boolean;
  error: string | null;
}
