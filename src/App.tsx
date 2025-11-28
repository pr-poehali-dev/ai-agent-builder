import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import Home from "./pages/Home";
import ScenarioSelection from "./pages/ScenarioSelection";
import DataUpload from "./pages/DataUpload";
import Validation from "./pages/Validation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SCENARIO_SELECTION} element={<ScenarioSelection />} />
          <Route path={ROUTES.DATA_UPLOAD} element={<DataUpload />} />
          <Route path={ROUTES.VALIDATION} element={<Validation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;