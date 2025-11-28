import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ROUTES } from "@/constants/routes";
import Home from "./pages/Home";
import ScenarioSelection from "./pages/ScenarioSelection";
import DataUpload from "./pages/DataUpload";
import Validation from "./pages/Validation";
import AgentPublish from "./pages/AgentPublish";
import AgentDashboard from "./pages/AgentDashboard";
import AgentDetails from "./pages/AgentDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SCENARIO_SELECT} element={<ScenarioSelection />} />
            <Route path={ROUTES.DATA_UPLOAD} element={<DataUpload />} />
            <Route path={ROUTES.DATA_VALIDATION} element={<Validation />} />
            <Route path={ROUTES.AGENT_PUBLISH} element={<AgentPublish />} />
            <Route path={ROUTES.AGENT_DASHBOARD} element={<AgentDashboard />} />
            <Route path={ROUTES.AGENT_DETAILS} element={<AgentDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;