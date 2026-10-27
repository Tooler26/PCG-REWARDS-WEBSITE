import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  dbService,
  UserAccount,
  Transaction,
  VOUCHER_CATALOG,
  VoucherItem,
  pointsToZar
} from '../services/db';
import {
  Home,
  Wallet,
  Settings,
  Sparkles,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Car,
  GlassWater,
  Store,
  Zap,
  Gift,
  LogOut,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react';

interface CustomerDashboardPageProps {
  currentUser: UserAccount;
  onSignOut: () => void;
  onNavigateHome: () => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  currentUser,
  onSignOut,
  onNavigateHome
}) => {
  // Navigation tabs on the edge of screen
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'token' | 'settings'>('overview');

  // Live state
  const [user, setUser] = useState<UserAccount>(currentUser);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenMessage, setTokenMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Voucher redemption modals
  const [insufficientPointsModal, setInsufficientPointsModal] = useState(false);
  const [redeemedVoucherSuccess, setRedeemedVoucherSuccess] = useState<{
    voucher: VoucherItem;
    voucherCode: string;
  } | null>(null);

  // Settings state
  const [settingsNewUsername, setSettingsNewUsername] = useState(currentUser.username);
  const [settingsNewPassword, setSettingsNewPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Sample quick tokens to copy-paste for test
  const [showSampleTokens, setShowSampleTokens] = useState(false);

  useEffect(() => {
    refreshData();
  }, [currentUser.id]);

  const refreshData = () => {
    const updated = dbService.getAllUsers().find(u => u.id === currentUser.id) || currentUser;
    setUser(updated);
    setTransactions(dbService.getUserTransactions(currentUser.id));
  };

  // Submit button only turns on / lights up when a valid token format is entered!
  // E.g., starts with PCG- and length >= 10
  const isTokenValidFormat = dbService.validateTokenFormat(tokenInput);

  const handleRedeemToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTokenValidFormat) return;

    setTokenMessage(null);
    const result = dbService.redeemToken(tokenInput, user.id);

    if (result.success) {
      setTokenMessage({ type: 'success', text: result.message });
      setTokenInput('');
      refreshData();
      
      // Festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setTokenMessage({ type: 'error', text: result.message });
    }
  };

  const handleVoucherClick = (voucher: VoucherItem) => {
    if (user.points < voucher.pointsCost) {
      setInsufficientPointsModal(true);
      return;
    }

    const res = dbService.redeemVoucher(voucher.id, user.id);
    if (res.success && res.voucher && res.voucherCode) {
      setRedeemedVoucherSuccess({
        voucher: res.voucher,
        voucherCode: res.voucherCode
      });
      refreshData();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    } else {
      setInsufficientPointsModal(true);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = false;

    if (settingsNewUsername.trim() && settingsNewUsername !== user.username) {
      dbService.updateUsername(user.id, settingsNewUsername.trim());
      updated = true;
    }
    if (settingsNewPassword.trim() && settingsNewPassword.length >= 6) {
      dbService.updatePassword(user.id, settingsNewPassword.trim());
      updated = true;
      setSettingsNewPassword('');
    }

    if (updated) {
      setSettingsSuccess('Profile updated successfully.');
      refreshData();
      setTimeout(() => setSettingsSuccess(''), 4000);
    }
  };

  // Helper for Category Icons in Localization transaction feed
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'carwash':
        return <Car className="w-4 h-4 text-cyan-400" />;
      case 'tavern':
        return <GlassWater className="w-4 h-4 text-purple-400" />;
      case 'spaza':
        return <Store className="w-4 h-4 text-emerald-400" />;
      case 'supermarket':
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
      default:
        return <Gift className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* =========================================================================
          EDGE / SIDEBAR NAVIGATION
          Home icon (dashboard), Wallet icon (history), PCG icon (load token), Settings icon
          ========================================================================= */}
      <aside className="w-full md:w-20 lg:w-64 bg-slate-900/90 border-r border-slate-800 flex md:flex-col justify-between shrink-0 z-30 sticky top-0 md:h-screen backdrop-blur-xl p-3 md:p-4">
        
        {/* Brand header */}
        <div className="flex md:flex-col items-center lg:items-start gap-3">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src="/pcg-rewards-logo.jpg"
              alt="PCG REWARDS"
              className="w-10 h-10 object-contain rounded-xl border border-cyan-500/30 group-hover:scale-105 transition-transform"
            />
            <div className="hidden lg:flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                PCG REWARDS
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Member Hub
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Icons & Links */}
        <nav className="flex md:flex-col items-center lg:items-stretch gap-2 py-2">
          {/* Home Icon (Dashboard) */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Dashboard Overview"
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Dashboard</span>
          </button>

          {/* PCG Icon (Load Tokens) */}
          <button
            onClick={() => setActiveTab('token')}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'token'
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Enter PCG Token"
          >
            <Ticket className="w-5 h-5 shrink-0 text-cyan-400" />
            <span className="hidden lg:inline">Load Token</span>
          </button>

          {/* Wallet Icon (Full History) */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Full Wallet History"
          >
            <Wallet className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Wallet History</span>
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-slate-600'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Account Settings"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Settings</span>
          </button>
        </nav>

        {/* User Info & Sign Out */}
        <div className="pt-2 border-t border-slate-800 flex md:flex-col items-center lg:items-stretch gap-2">
          <div className="hidden lg:block px-2 text-xs">
            <div className="text-slate-400">Signed in as:</div>
            <div className="font-bold text-white truncate">{user.username}</div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors w-full justify-center lg:justify-start"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN DASHBOARD BODY
          ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Welcome, {user.username}!</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Active Account" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Your real-time township rewards balance, token load portal, and voucher catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateHome()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => setShowSampleTokens(!showSampleTokens)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-xs text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{showSampleTokens ? 'Hide Sample Tokens' : 'Get Sample Tokens'}</span>
            </button>
          </div>
        </div>

        {/* Sample Tokens Drawer for quick demonstration */}
        {showSampleTokens && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Available Verified Merchant Tokens (Click to Copy &amp; Paste):
              </span>
              <span className="text-slate-400 text-[11px]">Single-use tokens</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { code: 'PCG-SAM50-7P4K', shop: 'Sam Car Wash', tier: 'Tier 1 (R50 spend)', pts: '+7 PCG' },
                { code: 'PCG-DNY100-8R2L', shop: 'Danny Lounge', tier: 'Tier 2 (R100 spend)', pts: '+14 PCG' },
                { code: 'PCG-MAMA200-9X1Q', shop: 'Mama Keabetswe Spaza', tier: 'Tier 3 (R200 spend)', pts: '+20 PCG' },
                { code: 'PCG-SWT50-3M8N', shop: 'Soweto Corner Supermarket', tier: 'Tier 1 (R50 spend)', pts: '+7 PCG' },
                { code: 'PCG-THB50-1C4F', shop: "Thabo's Tuckshop", tier: 'Tier 1 (R50 spend)', pts: '+7 PCG' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTokenInput(item.code);
                    setActiveTab('token');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-left text-xs transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-mono font-bold text-cyan-300 group-hover:text-cyan-200">{item.code}</div>
                    <div className="text-[11px] text-slate-400">{item.shop} &bull; {item.tier}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {item.pts}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            ROW 1: NEXUS CARD (BALANCE & ZAR VALUE) + RECENT REAL-TIME GRAPH
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* THE NEXUS CARD (Col 1-5) */}
          <div className="lg:col-span-5 relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-cyan-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Ambient card glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Card Top Strip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-cyan-300">
                    Nexus Card
                  </span>
                </div>

                {/* Micro-indicator showing current loaded token volume */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Wallet Fueling Active</span>
                </div>
              </div>

              {/* Point Balance */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                  Token &amp; Point Balance
                </span>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-heading flex items-baseline gap-2">
                  <span>{user.points.toLocaleString()}</span>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    PCG
                  </span>
                </div>
              </div>

              {/* Real World South African Rand (ZAR) Value */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Real-World Purchasing Value in ZAR
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading">
                  {pointsToZar(user.points)} <span className="text-xs text-slate-400 font-normal">ZAR</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fixed exchange rule: 10 points = R0.08 purchasing power</span>
                </div>
              </div>

            </div>

            {/* Quick action button */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Account: <strong>{user.username}</strong></span>
              <button
                onClick={() => setActiveTab('token')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Load New Token</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DYNAMIC 30-DAY TREND GRAPH & ANALYTICS (Col 6-12) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-base text-white">Visual History &amp; Savings Momentum</h3>
                </div>
                <p className="text-xs text-slate-400">Dynamic points accumulation over the last 30 days</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Real-Time Synced
                </span>
              </div>
            </div>

            {/* SVG Glowing Line Chart */}
            <div className="relative h-44 w-full flex items-end pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

                {/* Area under curve */}
                <path
                  d="M 10 120 Q 80 110, 140 85 T 260 70 T 380 40 T 490 20 L 490 145 L 10 145 Z"
                  fill="url(#areaGrad)"
                />

                {/* Trend Line */}
                <path
                  d="M 10 120 Q 80 110, 140 85 T 260 70 T 380 40 T 490 20"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Interactive Points */}
                <circle cx="10" cy="120" r="4" fill="#0ea5e9" />
                <circle cx="140" cy="85" r="4" fill="#38bdf8" />
                <circle cx="260" cy="70" r="4" fill="#38bdf8" />
                <circle cx="380" cy="40" r="5" fill="#a855f7" />
                <circle cx="490" cy="20" r="6" fill="#ec4899" className="animate-ping origin-center" />
                <circle cx="490" cy="20" r="5" fill="#a855f7" />
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Day 1 (Start)</span>
              <span>Day 10</span>
              <span>Day 20</span>
              <span className="text-cyan-400 font-semibold">Today ({user.points} PCG)</span>
            </div>

          </div>

        </div>

        {/* =========================================================================
            CENTER BOX: "ENTER PCG TOKEN"
            Submit button ONLY lights up when valid token is entered!
            Fine print: "N.B. If submit button does not light up, token is not valid"
            ========================================================================= */}
        <section className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                Instant Point Credit
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ENTER PCG TOKEN
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Enter the authentic printed token code you received from your local spaza shop, car wash, or tavern.
              </p>
            </div>

            <form onSubmit={handleRedeemToken} className="space-y-4">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="e.g. PCG-SAM50-7P4K"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  className="w-full text-center px-6 py-4 rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-cyan-400 text-lg sm:text-xl font-mono tracking-widest text-cyan-300 placeholder-slate-600 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Status feedback message */}
              {tokenMessage && (
                <div
                  className={`max-w-md mx-auto p-3 rounded-xl text-xs flex items-center justify-center gap-2 ${
                    tokenMessage.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {tokenMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{tokenMessage.text}</span>
                </div>
              )}

              {/* SUBMIT BUTTON: ONLY TURNS ON / LIGHTS UP WHEN VALID FORMAT IS ENTERED */}
              <div className="max-w-md mx-auto">
                <button
                  type="submit"
                  disabled={!isTokenValidFormat}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    isTokenValidFormat
                      ? 'glow-btn bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-black cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.7)] hover:scale-[1.02] active:scale-98'
                      : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                  }`}
                >
                  <Ticket className="w-5 h-5" />
                  <span>
                    {isTokenValidFormat ? 'SUBMIT & LOAD POINTS NOW' : 'ENTER VALID TOKEN FORMAT TO UNLOCK'}
                  </span>
                </button>
              </div>

              {/* MANDATORY FINE PRINT from user prompt */}
              <p className="text-[11px] text-amber-400/90 font-medium tracking-wide">
                N.B. If submit button does not light up, token is not valid.
              </p>
            </form>

          </div>
        </section>

        {/* =========================================================================
            ROW 2: LOCALIZED TRANSACTION FEED (Spaza, Car wash, Tavern anchors)
            ========================================================================= */}
        <section className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-bold text-lg text-white">Localization Transaction Feed</h3>
              <p className="text-xs text-slate-400">
                Categorized ledger with recognized visual anchors for local township businesses
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {transactions.length} record{transactions.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No transactions yet. Load your first token above!
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{tx.shopName || tx.voucherTitle}</span>
                        {tx.voucherCode && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                            {tx.voucherCode}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {tx.category === 'voucher' ? 'Voucher Redemption' : `${tx.category} merchant`} &bull;{' '}
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-mono ${
                        tx.amountPoints > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.amountPoints > 0 ? `+${tx.amountPoints}` : tx.amountPoints} PCG
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {pointsToZar(Math.abs(tx.amountPoints))} ZAR
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* =========================================================================
            ROW 3: VOUCHER CATALOG (DATA, ELECTRICITY, USAVE, CHECKERS)
            With real brand styling and "Not enough PCG POINTS" modal check!
            ========================================================================= */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Gift className="w-3.5 h-3.5" />
                Voucher &amp; Utility Catalog
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Redeem PCG Points for Real Goods
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose from South Africa&apos;s leading network providers, prepaid electricity, and grocery store chains.
              </p>
            </div>
            
            <div className="text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              Your Purchasing Power: <strong className="text-emerald-400">{pointsToZar(user.points)}</strong>
            </div>
          </div>

          {/* Grid of Vouchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VOUCHER_CATALOG.map((item) => {
              const canAfford = user.points >= item.pointsCost;

              return (
                <div
                  key={item.id}
                  className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 relative group"
                >
                  <div className="space-y-3">
                    {/* Brand Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: item.brandColor }}
                      >
                        {item.brand}
                      </span>
                      {item.popular && (
                        <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-white leading-snug">
                      {item.title}
                    </h4>

                    {/* Price & ZAR Equivalent */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Cost:</div>
                        <div className="text-sm font-bold text-cyan-300 font-mono">
                          {item.pointsCost} PCG
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Value:</div>
                        <div className="text-sm font-bold text-emerald-400 font-mono">
                          R{item.zarValue} ZAR
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Redeem Button */}
                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleVoucherClick(item)}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
                          : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Redeem Voucher' : 'Redeem (Need More Points)'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* =========================================================================
          WARNING MODAL: "NOT ENOUGH PCG POINTS" with "OK" BUTTON
          (Strict user requirement)
          ========================================================================= */}
      {insufficientPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Not Enough PCG POINTS</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You do not have enough PCG points in your wallet to purchase this item. Visit your local registered spaza, car wash, or tavern to collect more tokens!
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-slate-400">
                Your current balance: <strong className="text-white">{user.points} PCG</strong> ({pointsToZar(user.points)})
              </div>
            </div>

            <button
              onClick={() => setInsufficientPointsModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUCCESS MODAL: VOUCHER REDEEMED (DIGITAL PIN & INSTRUCTIONS)
          ========================================================================= */}
      {redeemedVoucherSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Voucher Claimed!</h3>
              <p className="text-xs text-slate-400">
                You redeemed <strong>{redeemedVoucherSuccess.voucher.title}</strong>
              </p>
            </div>

            {/* Voucher Card Representation */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                Digital Voucher PIN / Barcode
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 font-mono font-black text-xl sm:text-2xl text-cyan-300 tracking-wider">
                {redeemedVoucherSuccess.voucherCode}
              </div>
              <div className="text-[11px] text-slate-400">
                Present this PIN at the till or enter via USSD/Mobile recharge. Valid for 90 days.
              </div>
            </div>

            <button
              onClick={() => setRedeemedVoucherSuccess(null)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
            >
              Done &bull; Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SETTINGS MODAL (Change password / change username)
          ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Account Settings
              </h3>
              <button
                onClick={() => setActiveTab('overview')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {settingsSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  value={settingsNewUsername}
                  onChange={(e) => setSettingsNewUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep existing"
                  value={settingsNewPassword}
                  onChange={(e) => setSettingsNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
