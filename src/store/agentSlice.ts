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

export interface Agent {
  id: string;
  name: string;
  scenario: string;
  status: 'draft' | 'training' | 'ready' | 'published';
  apiKey?: string;
  createdAt: string;
  dataSources: DataSource[];
}

interface AgentState {
  currentScenario: Scenario | null;
  dataSources: DataSource[];
  validationIssues: ValidationIssue[];
  agent: Agent | null;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
}

const initialState: AgentState = {
  currentScenario: null,
  dataSources: [],
  validationIssues: [],
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
  setLoading,
  setError,
  setCurrentStep,
  resetAgent,
} = agentSlice.actions;

export default agentSlice.reducer;