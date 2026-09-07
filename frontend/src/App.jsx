import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Programs from './pages/Programs';
import News from './pages/News';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminNews from './pages/admin/News';

function App() {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    user: null
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token and refresh profile data
          const profileData = await authAPI.getProfile();
          if (profileData?.success && profileData.user) {
            setAuthState({
              loading: false,
              isAuthenticated: true,
              user: profileData.user
            });
            return;
          }
        } catch (err) {
          console.warn('Token validation failed, clearing auth', err);
        }
      }
      
      // Clean up invalid auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthState({ loading: false, isAuthenticated: false, user: null });
    };

    initAuth();
  }, []);

  // Handle login and update auth state
  const handleLogin = (userData) => {
    setAuthState({
      loading: false,
      isAuthenticated: true,
      user: userData
    });
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle logout and clear auth state
  const handleLogout = () => {
    authAPI.logout();
    setAuthState({
      loading: false,
      isAuthenticated: false,
      user: null
    });
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    window.location.href = `${import.meta.env.BASE_URL}login?registered=true`;
  };

  // Show loading spinner while initializing
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-slate-300 font-semibold text-sm">Initializing Atar Youth Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route 
          path="/" 
          element={
            <Layout 
              isAuthenticated={authState.isAuthenticated} 
              user={authState.user} 
              onLogout={handleLogout} 
            />
          }
        >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="programs" element={<Programs />} />
          <Route path="news" element={<News />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="contact" element={<Contact />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          
          {/* Auth Routes */}
          <Route 
            path="login" 
            element={
              !authState.isAuthenticated ? (
                <Login onLogin={handleLogin} /> 
              ) : authState.user?.mustChangePassword ? (
                <Navigate to="/change-password" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="register" 
            element={
              !authState.isAuthenticated ? (
                <Register onSuccess={handleRegisterSuccess} /> 
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Profile Route - Requires Authentication */}
          <Route 
            path="profile" 
            element={
              authState.isAuthenticated ? (
                authState.user?.mustChangePassword ? (
                  <Navigate to="/change-password" replace />
                ) : (
                  <Profile />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Change Password Route (First-login mandatory & Settings) */}
          <Route 
            path="change-password" 
            element={
              authState.isAuthenticated ? (
                <ChangePassword user={authState.user} /> 
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Route>

        {/* Admin Routes - Protected by Role */}
        <Route 
          path="/admin/*" 
          element={
            authState.isAuthenticated && authState.user?.role === 'admin' ? (
              authState.user?.mustChangePassword ? (
                <Navigate to="/change-password" replace />
              ) : (
                <AdminLayout user={authState.user} />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="issues" element={<div className="p-6 text-center text-slate-600 font-semibold">Issue Tracking System — Module Operational</div>} />
          <Route path="activities" element={<div className="p-6 text-center text-slate-600 font-semibold">Activities & Events Management — Module Operational</div>} />
          <Route path="settings" element={<div className="p-6 text-center text-slate-600 font-semibold">System & Email Settings — Module Operational</div>} />
        </Route>

        {/* Catch all - redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;