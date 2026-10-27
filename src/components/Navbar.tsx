import React, { useState } from 'react';
import { Menu, X, Shield, User, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, subSection?: string) => void;
  currentUser: any;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home', sectionId);
    } else if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Top-Left Company Logo & Branding */}
        <div
          onClick={() => handleNavClick()}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative p-1 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 border border-cyan-400/30 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)]">
            <img
              src="/pcg-rewards-logo.jpg"
              alt="PCG REWARDS Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
              PCG REWARDS
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Township Loyalty Network
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
          >
            How It Works
          </button>

          <button
            onClick={() => handleNavClick('apply-section')}
            className="px-3 py-2 rounded-lg hover:text-purple-400 hover:bg-slate-900/60 transition-colors"
          >
            Apply to Join
          </button>

          <button
            onClick={() => handleNavClick('reviews-section')}
            className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
          >
            Reviews
          </button>

          <button
            onClick={() => handleNavClick('faq-section')}
            className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
          >
            FAQ
          </button>

          <button
            onClick={() => handleNavClick('contact-section')}
            className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons (Customer Login & Admin Portal) */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin-portal' : 'customer-dashboard')}
                className="glow-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm shadow-md"
              >
                <User className="w-4 h-4" />
                <span>{currentUser.username} (Dashboard)</span>
              </button>
              <button
                onClick={onSignOut}
                className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              {/* Customer Login Button (Takes users to dedicated separate page) */}
              <button
                onClick={() => onNavigate('customer-auth')}
                className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Customer Login</span>
              </button>

              {/* Admin Portal Button (Takes users to dedicated separate page) */}
              <button
                onClick={() => onNavigate('admin-auth')}
                className="glow-btn-purple flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-purple-100 text-sm font-semibold border border-purple-500/30 shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
              >
                <Shield className="w-4 h-4 text-purple-300" />
                <span>Admin Portal</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => onNavigate('customer-auth')}
            className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('apply-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Apply to Join PCG Network
            </button>
            <button
              onClick={() => handleNavClick('reviews-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavClick('faq-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavClick('contact-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Contact Details
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('customer-auth');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm"
            >
              <User className="w-4 h-4" />
              Customer Login / Sign Up
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin-auth');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200 font-semibold text-sm"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
