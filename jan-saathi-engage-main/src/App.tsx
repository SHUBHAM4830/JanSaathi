import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "./pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminBidManagement from "@/pages/AdminBidManagement";
import AdminIssueBidding from "@/pages/AdminIssueBidding";
import CitizenDashboard from "@/pages/CitizenDashboard";
import ContractorDashboard from "@/pages/ContractorDashboard";
import SubmitComplaint from "@/pages/SubmitComplaint";
import ComplaintDetails from "@/pages/ComplaintDetails";
import CommunityComplaints from "@/pages/CommunityComplaints";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bids/:issueId" element={<AdminBidManagement />} />
          <Route path="/admin/issue-bidding/:issueId" element={<AdminIssueBidding />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen-dashboard" element={<Navigate to="/citizen" replace />} />
          <Route path="/contractor" element={<ContractorDashboard />} />
          <Route path="/contractor-dashboard" element={<Navigate to="/contractor" replace />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/community-complaints" element={<CommunityComplaints />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;