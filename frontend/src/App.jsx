import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { Home } from './pages/Home';
import { Equipment } from './pages/Equipment';
import { Matches } from './pages/Matches';
import { Tournaments } from './pages/Tournaments';
import { Events } from './pages/Events';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';

function MainApp() {
  const getPageFromHash = () => {
    const raw = window.location.hash.replace('#', '').split('?')[0];
    return ['home', 'equipment', 'matches', 'tournaments', 'events', 'admin', 'login'].includes(raw)
      ? raw
      : 'home';
  };

  const [activePage, setActivePage] = useState(getPageFromHash);
  const [toast, setToast] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onHashChange = () => {
      setActivePage(getPageFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handlePageChange = (page) => {
    window.location.hash = page;
    setActivePage(page);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={handlePageChange} showToast={showToast} />;
      case 'equipment':
        return <Equipment showToast={showToast} />;
      case 'matches':
        return <Matches showToast={showToast} />;
      case 'tournaments':
        return <Tournaments showToast={showToast} />;
      case 'events':
        return <Events showToast={showToast} />;
      case 'login':
        return <AdminLogin setActivePage={handlePageChange} showToast={showToast} />;
      case 'admin':
        return isAdmin ? (
          <AdminDashboard showToast={showToast} />
        ) : (
          <AdminLogin setActivePage={handlePageChange} showToast={showToast} />
        );
      default:
        return <Home setActivePage={handlePageChange} showToast={showToast} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar activePage={activePage} setActivePage={handlePageChange} />
      
      <main className="page-wrapper" style={{ flex: 1 }}>
        {renderPage()}
      </main>

      <Footer setActivePage={handlePageChange} />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
