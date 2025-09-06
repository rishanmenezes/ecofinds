import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/Layout/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import AddProduct from "./pages/AddProduct";
import MyListings from "./pages/MyListings";
import Cart from "./pages/Cart";
import Purchases from "./pages/Purchases";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// App Layout with Navbar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/feed" replace /> : <Index />} />
      <Route path="/auth" element={user ? <Navigate to="/feed" replace /> : <Auth />} />
      <Route 
        path="/feed" 
        element={
          <AppLayout>
            <Feed />
          </AppLayout>
        } 
      />
      <Route 
        path="/add-product" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddProduct />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-listings" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyListings />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Cart />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/purchases" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Purchases />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
