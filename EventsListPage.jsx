import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Home from './pages/Home';
import ShowDetail from './pages/ShowDetail';
import Register from './pages/Register';
import MyShows from './pages/MyShows';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#008080]">
        <div className="win98-raised p-6 text-center font-retro">
          <div className="text-lg mb-2">GhostCal</div>
          <div className="text-sm text-[#808080]">Loading...</div>
          <div className="win98-sunken h-4 w-48 mt-2 bg-white">
            <div className="h-full animate-pulse" style={{
              width: '60%',
              background: 'repeating-linear-gradient(90deg, #000080, #000080 8px, #0000a0 8px, #0000a0 16px)',
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shows" element={<Home />} />
      <Route path="/show" element={<ShowDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-shows" element={<MyShows />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App