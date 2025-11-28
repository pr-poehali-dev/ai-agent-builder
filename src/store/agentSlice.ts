import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AgentStats {
  totalRequests: number;
  requestsToday: number;
  avgResponseTime: number;
  satisfactionRate: number;
}

export interface Agent {
  id: string;
  name: string;
  scenario: string;
  status: 'draft' | 'training' | 'ready' | 'published';
  apiKey?: string;
  createdAt: string;
  dataSources: DataSource[];
  stats?: AgentStats;
}

interface AgentState {
  currentScenario: Scenario | null;
  dataSources: DataSource[];
  validationIssues: ValidationIssue[];
  agent: Agent | null;
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  currentStep: number;
}

const initialState: AgentState = {
  currentScenario: null,
  dataSources: [],
  agents: [],
  validationIssues: [
    {
      id: '1',
      type: 'contradiction',
      severity: 'high',
      description: 'Обнаружено противоречие в сроках доставки: в одном документе указано "3-5 дней", в другом "5-7 рабочих дней"',
      sources: ['delivery_policy.pdf', 'faq.txt'],
      status: 'pending',
    },
    {
      id: '2',
      type: 'duplicate',
      severity: 'medium',
      description: 'Информация о возврате товара дублируется в двух разных файлах с идентичным содержанием',
      sources: ['return_policy.pdf', 'customer_guide.docx'],
      status: 'pending',
    },
    {
      id: '3',
      type: 'ambiguity',
      severity: 'low',
      description: 'Неясная формулировка в разделе о гарантии: "длительный срок службы" не имеет конкретных временных рамок',
      sources: ['warranty_info.pdf'],
      status: 'pending',
    },
  ],
  agent: null,
  isLoading: false,
  error: null,
  currentStep: 0,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setScenario: (state, action: PayloadAction<Scenario>) => {
      state.currentScenario = action.payload;
      state.currentStep = 1;
      state.error = null;
    },
    addDataSource: (state, action: PayloadAction<DataSource>) => {
      state.dataSources.push(action.payload);
    },
    removeDataSource: (state, action: PayloadAction<string>) => {
      state.dataSources = state.dataSources.filter(ds => ds.id !== action.payload);
    },
    updateDataSource: (state, action: PayloadAction<{ id: string; updates: Partial<DataSource> }>) => {
      const index = state.dataSources.findIndex(ds => ds.id === action.payload.id);
      if (index !== -1) {
        state.dataSources[index] = { ...state.dataSources[index], ...action.payload.updates };
      }
    },
    setValidationIssues: (state, action: PayloadAction<ValidationIssue[]>) => {
      state.validationIssues = action.payload;
    },
    updateValidationIssue: (state, action: PayloadAction<{ id: string; status: ValidationIssue['status'] }>) => {
      const issue = state.validationIssues.find(i => i.id === action.payload.id);
      if (issue) {
        issue.status = action.payload.status;
      }
    },
    setAgent: (state, action: PayloadAction<Agent>) => {
      state.agent = action.payload;
      const existingIndex = state.agents.findIndex(a => a.id === action.payload.id);
      if (existingIndex !== -1) {
        state.agents[existingIndex] = action.payload;
      } else {
        state.agents.push(action.payload);
      }
    },
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    updateAgentStatus: (state, action: PayloadAction<{ id: string; status: Agent['status'] }>) => {
      const agent = state.agents.find(a => a.id === action.payload.id);
      if (agent) {
        agent.status = action.payload.status;
      }
      if (state.agent?.id === action.payload.id) {
        state.agent.status = action.payload.status;
      }
    },
    deleteAgent: (state, action: PayloadAction<string>) => {
      state.agents = state.agents.filter(a => a.id !== action.payload);
      if (state.agent?.id === action.payload) {
        state.agent = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    resetAgent: () => initialState,
  },
});

export const {
  setScenario,
  addDataSource,
  removeDataSource,
  updateDataSource,
  setValidationIssues,
  updateValidationIssue,
  setAgent,
  setAgents,
  updateAgentStatus,
  deleteAgent,
  setLoading,
  setError,
  setCurrentStep,
  resetAgent,
} = agentSlice.actions;

export default agentSlice.reducer;