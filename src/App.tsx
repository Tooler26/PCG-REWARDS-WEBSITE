import React, { useState, useEffect } from 'react';
import { dbService, UserAccount } from './services/db';
import { CinematicSplash } from './components/CinematicSplash';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminAuthPage } from './pages/AdminAuthPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'customer-auth' | 'customer-dashboard' | 'admin-auth' | 'admin-portal'>('home');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Sync with dbService on mount and handle initial URL hash
  useEffect(() => {
    const existing = dbService.getCurrentUser();
    if (existing) {
      setCurrentUser(existing);
    }

    const handleHash = () => {
      const hash = window.location.hash;
      const activeUser = dbService.getCurrentUser();
      if (activeUser) {
        setCurrentUser(activeUser);
      }

      if (hash === '#login' || hash === '#signup') {
        setCurrentView('customer-auth');
      } else if (hash === '#admin-login') {
        setCurrentView('admin-auth');
      } else if (hash === '#customer' || hash === '#dashboard') {
        if (activeUser && activeUser.role === 'customer') {
          setCurrentView('customer-dashboard');
        } else {
          setCurrentView('customer-auth');
        }
      } else if (hash === '#admin') {
        if (activeUser && activeUser.role === 'admin') {
          setCurrentView('admin-portal');
        } else {
          setCurrentView('admin-auth');
        }
      } else if (hash === '#home' || !hash) {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: string, subSection?: string) => {
    if (view === 'home') {
      window.location.hash = '#home';
      setCurrentView('home');
      if (subSection) {
        setTimeout(() => {
          const el = document.getElementById(subSection);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'customer-auth') {
      window.location.hash = '#login';
      setCurrentView('customer-auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'customer-dashboard') {
      window.location.hash = '#customer';
      setCurrentView('customer-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin-auth') {
      window.location.hash = '#admin-login';
      setCurrentView('admin-auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin-portal') {
      window.location.hash = '#admin';
      setCurrentView('admin-portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCustomerLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      navigateTo('admin-portal');
    } else {
      navigateTo('customer-dashboard');
    }
  };

  const handleAdminLoginSuccess = (admin: UserAccount) => {
    setCurrentUser(admin);
    navigateTo('admin-portal');
  };

  const handleSignOut = () => {
    dbService.setCurrentUser(null);
    setCurrentUser(null);
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 4-second Cinematic Splash Screen on initial load */}
      {showSplash && (
        <CinematicSplash onComplete={() => setShowSplash(false)} />
      )}

      {/* VIEW: HOME PAGE */}
      {currentView === 'home' && (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={navigateTo}
            currentUser={currentUser}
            onSignOut={handleSignOut}
          />
          <main className="flex-1">
            <HomePage onNavigate={navigateTo} />
          </main>
          <Footer onNavigate={navigateTo} />
        </>
      )}

      {/* VIEW: CUSTOMER AUTH (SEPARATE STANDALONE PAGE) */}
      {currentView === 'customer-auth' && (
        <CustomerAuthPage
          onSuccessLogin={handleCustomerLoginSuccess}
          onNavigateHome={() => navigateTo('home')}
        />
      )}

      {/* VIEW: CUSTOMER DASHBOARD (SEPARATE STANDALONE PAGE) */}
      {currentView === 'customer-dashboard' && currentUser && (
        <CustomerDashboardPage
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onNavigateHome={() => navigateTo('home')}
        />
      )}

      {/* VIEW: ADMIN AUTH (SEPARATE STANDALONE PAGE) */}
      {currentView === 'admin-auth' && (
        <AdminAuthPage
          onSuccessLogin={handleAdminLoginSuccess}
          onNavigateHome={() => navigateTo('home')}
        />
      )}

      {/* VIEW: ADMIN PORTAL (SEPARATE STANDALONE PAGE) */}
      {currentView === 'admin-portal' && currentUser && (
        <AdminPortalPage
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onNavigateHome={() => navigateTo('home')}
        />
      )}

    </div>
  );
}

export default App;
