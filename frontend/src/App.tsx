import React from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PgListings from '@/pages/PgListings';
import PgDetail from '@/pages/PgDetail';
import TenantDashboard from '@/pages/TenantDashboard';
import OwnerDashboard from '@/pages/OwnerDashboard';
import ListPg from '@/pages/ListPg';
import Complaints from '@/pages/Complaints';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/pgs" component={PgListings} />
          <Route path="/pgs/:id" component={PgDetail} />
          
          <Route path="/dashboard/tenant">
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantDashboard />
            </ProtectedRoute>
          </Route>
          
          <Route path="/dashboard/owner">
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          </Route>
          
          <Route path="/list-pg">
            <ProtectedRoute allowedRoles={['owner']}>
              <ListPg />
            </ProtectedRoute>
          </Route>
          
          <Route path="/complaints">
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
