import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Patients from "./pages/Patients";
import PatientForm from "./pages/PatientForm";
import PatientBulkUpload from "./pages/PatientBulkUpload";
import MedicalDocuments from "./pages/MedicalDocuments";
import MCUUpload from "./pages/MCUUpload";
import MCUData from "./pages/MCUData";
import PDFHistory from "./pages/PDFHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Default redirect to patients */}
              <Route path="/" element={<Navigate to="/patients" replace />} />
              
              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Patient Management */}
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id/edit" element={<PatientForm />} />
              <Route path="/patients/bulk-upload" element={<PatientBulkUpload />} />
              
              {/* Medical Documents */}
              <Route path="/medical-documents" element={<MedicalDocuments />} />
              
              {/* MCU Management */}
              <Route path="/mcu/upload" element={<MCUUpload />} />
              <Route path="/mcu/data" element={<MCUData />} />
              <Route path="/mcu/pdf-history" element={<PDFHistory />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
