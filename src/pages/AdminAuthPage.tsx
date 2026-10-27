import React, { useState } from 'react';
import { dbService, UserAccount } from '../services/db';
import { Shield, Lock, User, AlertOctagon, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminAuthPageProps {
  onSuccessLogin: (adminUser: UserAccount) => void;
  onNavigateHome: () => void;
}

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({
  onSuccessLogin,
  onNavigateHome
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessSplash, setShowSuccessSplash] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserAccount | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrorModal(false);

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check if valid admin credentials for Thuloane Phume / executive staff
    const isAdminMatch =
      (cleanId === 'phumecitygold@gmail.com' ||
       cleanId === 'thuloanephume3@gmail.com' ||
       cleanId === 'thuloane phume' ||
       cleanId === 'tools' ||
       cleanId === 'admin') &&
      (cleanPass === 'tools2026' || cleanPass === 'tools' || cleanPass === 'pcg2026');

    // Also check dbService for admin account
    const dbAdmin = dbService.getAllUsers().find(
      u => u.role === 'admin' &&
           (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) &&
           u.passwordHash === cleanPass
    );

    if (isAdminMatch || dbAdmin) {
      const activeAdmin: UserAccount = dbAdmin || {
        id: 'user_admin_thuloane',
        username: 'Thuloane Phume',
        email: 'PHUMECITYGOLD@GMAIL.COM',
        passwordHash: cleanPass,
        role: 'admin',
        points: 99999,
        createdAt: '2026-01-01'
      };

      dbService.setCurrentUser(activeAdmin, true);
      setAuthenticatedUser(activeAdmin);

      // Trigger user's required splash screen message
      setShowSuccessSplash(true);

      setTimeout(() => {
        onSuccessLogin(activeAdmin);
      }, 3500);
    } else {
      // Wrong inputs -> POPUP required by user
      setShowErrorModal(true);
    }
  };

  // SUCCESSFUL ADMIN LOGIN SPLASH SCREEN:
  // "THULOANE PHUME IS THE GREATNESS KEEP IT UP TOOLS"
  if (showSuccessSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-mesh-gradient opacity-80 pointer-events-none" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="relative p-3 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-cyan-500/30 border border-purple-400/40 shadow-[0_0_60px_rgba(168,85,247,0.5)] mx-auto w-24 h-24 flex items-center justify-center">
            <img src="/pcg-rewards-logo.jpg" alt="PCG REWARDS" className="w-20 h-20 object-contain rounded-xl" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Executive Access Authorized
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent font-heading">
              THULOANE PHUME IS THE GREATNESS KEEP IT UP TOOLS
            </h1>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Initializing PCG REWARDS Merchant &amp; Token Command System...
            </p>
          </div>

          <div className="w-64 mx-auto h-2 bg-slate-900 rounded-full overflow-hidden border border-purple-900/50 p-0.5">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-full animate-indeterminate shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-900"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <img src="/pcg-rewards-logo.jpg" alt="PCG REWARDS" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-extrabold text-sm tracking-tight text-white">PCG REWARDS</span>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="relative z-10 max-w-md w-full mx-auto my-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Administrative Command Center
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Admin Executive Portal
            </h2>
            <p className="text-xs text-slate-400">
              Restricted management console for merchant registration, token generation, and audit reporting.
            </p>
          </div>

          {/* Quick preset for Thuloane Phume */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Executive Quick Access:</span>
              <span className="text-[11px] text-slate-400">Thuloane Phume (Tools)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIdentifier('PHUMECITYGOLD@GMAIL.COM');
                setPassword('tools2026');
              }}
              className="px-3 py-1 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-semibold text-xs transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            
            {/* Username or Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="PHUMECITYGOLD@GMAIL.COM / Tools"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-purple-400 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Security Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-purple-400 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="glow-btn-purple w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 hover:from-purple-600 hover:to-sky-600 text-white font-bold text-sm shadow-xl shadow-purple-950/50 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-purple-300" />
              <span>Verify &amp; Enter Admin Portal</span>
            </button>
          </form>

        </div>
      </div>

      {/* ERROR MODAL: "YOU ARE NOT THULOANE PHUME STAY OUT PLEASE THANK YOU" */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_50px_rgba(225,29,72,0.4)]">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white tracking-wide font-heading">
                ACCESS RESTRICTED
              </h3>
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-base font-extrabold text-rose-200 tracking-wide uppercase">
                &ldquo;YOU ARE NOT THULOANE PHUME STAY OUT PLEASE THANK YOU&rdquo;
              </div>
              <p className="text-xs text-slate-400">
                Only authorized administrative personnel are permitted into this area.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onNavigateHome}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Return Home
              </button>
              <button
                type="button"
                onClick={() => setShowErrorModal(false)}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Credentials */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 pb-2">
        K2023135962 (SOUTH AFRICA) &bull; Official Registration: 2023/135962/07 &bull; Reg: 2026-068136
      </div>
    </div>
  );
};
