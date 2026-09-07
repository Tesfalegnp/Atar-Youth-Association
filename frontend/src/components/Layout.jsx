import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ isAuthenticated, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800 selection:bg-primary-500 selection:text-white">
      {/* Global Header Navigation */}
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={onLogout} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Global International NGO Footer */}
      <Footer />
    </div>
  );
};

export default Layout;