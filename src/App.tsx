import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useOneSignal } from "@/hooks/useOneSignal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { AuthProvider } from "@/components/auth/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";

// OneSignal initialization component
const OneSignalInit = () => {
  const { isInitialized, isSubscribed, requestPermission, sendTags } = useOneSignal();

  useEffect(() => {
    // Send initial tags when subscribed
    if (isSubscribed) {
      sendTags({
        app: "bulking-schedule",
        platform: "web",
      });
    }
  }, [isSubscribed, sendTags]);

  useEffect(() => {
    // Auto-request permission after 5 seconds if not subscribed
    if (isInitialized && !isSubscribed) {
      const timer = setTimeout(() => {
        requestPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isSubscribed, requestPermission]);

  return null;
};

const App = () => (

  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <OneSignalInit />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);


export default App;
