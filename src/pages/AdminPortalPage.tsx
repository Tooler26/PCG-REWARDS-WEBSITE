import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  dbService,
  Shop,
  TokenItem,
  UserAccount,
  Transaction,
  pointsToZar
} from '../services/db';
import {
  Shield,
  Building2,
  Ticket,
  Trophy,
  FileSpreadsheet,
  Users,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  Flame,
  Search,
  Lock,
  RotateCcw,
  LogOut,
  ExternalLink,
  Printer,
  Sparkles,
  TrendingUp,
  BarChart3,
  Ban,
  ArrowRight
} from 'lucide-react';

interface AdminPortalPageProps {
  currentUser: UserAccount;
  onSignOut: () => void;
  onNavigateHome: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  currentUser,
  onSignOut,
  onNavigateHome
}) => {
  const [activeModule, setActiveModule] = useState<'metrics' | 'shops' | 'tokens' | 'leaderboard' | 'reports' | 'users'>('metrics');

  // Live state
  const [shops, setShops] = useState<Shop[]>([]);
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Token Mint Form State
  const [selectedShopId, setSelectedShopId] = useState('');
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const [tokenQuantity, setTokenQuantity] = useState<number>(250); // Default bulk 250 as requested
  const [mintSuccessMessage, setMintSuccessMessage] = useState('');

  // Register New Shop State
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState<Shop['category']>('spaza');
  const [newShopLocation, setNewShopLocation] = useState('');
  const [newShopOwner, setNewShopOwner] = useState('');
  const [newShopPhone, setNewShopPhone] = useState('');
  const [newShopEmail, setNewShopEmail] = useState('');
  const [shopRegisterSuccess, setShopRegisterSuccess] = useState('');

  // User Support / Password Reset State
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [userSupportMessage, setUserSupportMessage] = useState('');

  // Search Token State
  const [searchTokenQuery, setSearchTokenQuery] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setShops([...dbService.getShops()]);
    setTokens([...dbService.getTokens()]);
    setUsers([...dbService.getAllUsers()]);
    setTransactions([...dbService.getAllTransactions()]);

    if (!selectedShopId && dbService.getShops().length > 0) {
      setSelectedShopId(dbService.getShops()[0].id);
    }
  };

  // Metrics Calculations
  const totalPointsLoadedAllTime = tokens
    .filter(t => t.status === 'redeemed')
    .reduce((sum, t) => sum + t.points, 0);

  // Points loaded this month
  const totalPointsThisMonth = totalPointsLoadedAllTime; // synced
  const totalZarThisMonth = pointsToZar(totalPointsThisMonth);

  const totalTokensAvailable = tokens.filter(t => t.status === 'available').length;
  const totalTokensRedeemed = tokens.filter(t => t.status === 'redeemed').length;

  // Generate Tokens Handler
  const handleGenerateTokens = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopId) return;

    try {
      const generated = dbService.generateTokensForShop(selectedShopId, selectedTier, Number(tokenQuantity));
      refreshData();
      setMintSuccessMessage(`Successfully minted ${generated.length} Tier ${selectedTier} tokens for ${generated[0]?.shopName}!`);
      
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      setTimeout(() => setMintSuccessMessage(''), 6000);
    } catch (err: any) {
      alert(err.message || 'Error generating tokens');
    }
  };

  // Register Shop Handler
  const handleRegisterShop = (e: React.FormEvent) => {
    e.preventDefault();
    const shop = dbService.registerShop(
      newShopName,
      newShopCategory,
      newShopLocation,
      newShopOwner,
      newShopPhone,
      newShopEmail
    );

    // Automatically mint initial batch of tokens for this shop
    dbService.generateTokensForShop(shop.id, 1, 50);

    refreshData();
    setShopRegisterSuccess(`Shop "${shop.name}" registered successfully with 50 starter Tier 1 tokens!`);
    setNewShopName('');
    setNewShopLocation('');
    setNewShopOwner('');
    setNewShopPhone('');
    setNewShopEmail('');

    setTimeout(() => setShopRegisterSuccess(''), 6000);
  };

  // Void / Freeze Shop Handler (Fraud Prevention)
  const handleToggleFreezeShop = (shopId: string) => {
    dbService.toggleShopFreeze(shopId);
    refreshData();
  };

  // Reset Customer Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToEdit || !newPasswordInput.trim()) return;

    dbService.adminResetUserPassword(selectedUserToEdit.id, newPasswordInput.trim());
    setUserSupportMessage(`Password for ${selectedUserToEdit.username} successfully updated to: ${newPasswordInput.trim()}`);
    setNewPasswordInput('');
    setSelectedUserToEdit(null);
    refreshData();

    setTimeout(() => setUserSupportMessage(''), 5000);
  };

  // Toggle bad / stuck token
  const handleFixToken = (tokenId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'voided' ? 'available' : 'voided';
    dbService.adminFixToken(tokenId, nextStatus);
    refreshData();
  };

  // Leaderboard ranking
  const sortedShopsByPerformance = [...shops].sort((a, b) => b.tokensRedeemed - a.tokensRedeemed);

  // Filtered users for support
  const filteredUsers = users.filter(
    u => u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
         u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  // Filtered tokens for audit
  const filteredTokens = tokens.filter(
    t => t.code.toLowerCase().includes(searchTokenQuery.toLowerCase()) ||
         t.shopName.toLowerCase().includes(searchTokenQuery.toLowerCase())
  ).slice(0, 50); // limit preview

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* =========================================================================
          ADMIN SIDEBAR NAVIGATION
          ========================================================================= */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 flex md:flex-col justify-between shrink-0 z-30 sticky top-0 md:h-screen backdrop-blur-xl p-4">
        
        <div className="space-y-6">
          {/* Logo & Portal Header */}
          <div onClick={onNavigateHome} className="flex items-center gap-3 cursor-pointer group">
            <div className="p-1 rounded-xl bg-purple-500/20 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <img src="/pcg-rewards-logo.jpg" alt="PCG REWARDS" className="w-9 h-9 object-contain rounded-lg" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">PCG REWARDS</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Admin Console</span>
            </div>
          </div>

          {/* Module Links */}
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveModule('metrics')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeModule === 'metrics'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Overview &amp; Metrics</span>
            </button>

            <button
              onClick={() => setActiveModule('tokens')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeModule === 'tokens'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4 text-cyan-400" />
              <span>Token Forge &amp; Mint</span>
            </button>

            <button
              onClick={() => setActiveModule('shops')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeModule === 'shops'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Merchant Hub &amp; Shops</span>
            </button>

            <button
              onClick={() => setActiveModule('leaderboard')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeModule === 'leaderboard'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Shop Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveModule('reports')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeModule === 'reports'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              <span>Sponsor Full Reports</span>
            </button>

            <button
              onClick={() => setActiveModule('users')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeModule === 'users'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-pink-400" />
              <span>User &amp; Token Support</span>
            </button>
          </nav>
        </div>

        {/* Footer info & sign out */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400">
            <div>Signed in: <strong className="text-white">Thuloane Phume (Tools)</strong></div>
            <div className="text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Central Store Connected</span>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 border border-rose-900/40 text-rose-300 hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* =========================================================================
          MAIN ADMIN WORKSPACE
          ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Top greeting bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">
              Administrator Executive Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              THULOANE PHUME COMMAND CENTER
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              View Public Website
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Super Admin Level
            </span>
          </div>
        </div>

        {/* MODULE 1: OVERVIEW & METRICS */}
        {activeModule === 'metrics' && (
          <div className="space-y-8">
            
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="uppercase tracking-wider font-semibold">Total Points Loaded</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white font-heading">
                  {totalPointsThisMonth.toLocaleString()} <span className="text-xs text-purple-400 font-normal">PCG</span>
                </div>
                <div className="text-xs text-slate-400">
                  Across all registered shops this period
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="uppercase tracking-wider font-semibold">ZAR Equivalent</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 font-heading">
                  {totalZarThisMonth}
                </div>
                <div className="text-xs text-slate-400">
                  Converted at 10 pts = R0.08
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="uppercase tracking-wider font-semibold">Active Merchants</span>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white font-heading">
                  {shops.length} <span className="text-xs text-emerald-400 font-normal">Shops</span>
                </div>
                <div className="text-xs text-slate-400">
                  {shops.filter(s => s.status === 'active').length} active &bull; {shops.filter(s => s.status === 'frozen').length} flagged
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="uppercase tracking-wider font-semibold">Token Inventory</span>
                  <Ticket className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white font-heading">
                  {totalTokensAvailable.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  Available in field &bull; {totalTokensRedeemed} redeemed
                </div>
              </div>

            </div>

            {/* Monthly Trend Analytics Graph */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-white">Monthly Points Loaded &amp; Turnover Graph</h3>
                  <p className="text-xs text-slate-400">Aggregated shop load trajectory converted to ZAR value</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">{totalZarThisMonth} ZAR Total Impact</span>
                </div>
              </div>

              <div className="h-48 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 600 160">
                  <defs>
                    <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="30" x2="600" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="130" x2="600" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* Dynamic path */}
                  <path
                    d="M 20 135 Q 120 125, 200 95 T 380 60 T 580 25"
                    fill="none"
                    stroke="url(#adminGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  <circle cx="20" cy="135" r="5" fill="#a855f7" />
                  <circle cx="200" cy="95" r="5" fill="#38bdf8" />
                  <circle cx="380" cy="60" r="5" fill="#0ea5e9" />
                  <circle cx="580" cy="25" r="7" fill="#10b981" />
                </svg>
              </div>

              <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Week 1 (Launch)</span>
                <span>Week 2 (Merchant Expansion)</span>
                <span>Week 3 (Tavern &amp; Carwash Onboarding)</span>
                <span className="text-emerald-400 font-bold">Week 4 ({totalPointsThisMonth} PCG)</span>
              </div>
            </div>

            {/* Quick module jumps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveModule('tokens')}
                className="glow-btn-purple p-5 rounded-2xl bg-purple-950/40 border border-purple-700/50 text-left hover:scale-[1.01] transition-all"
              >
                <Ticket className="w-6 h-6 text-purple-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Generate Shop Tokens</h4>
                <p className="text-xs text-slate-400">Mint 250 bulk batches for R50, R100 or R200 tiers.</p>
              </button>

              <button
                onClick={() => setActiveModule('shops')}
                className="glow-btn p-5 rounded-2xl bg-slate-900 border border-cyan-700/50 text-left hover:scale-[1.01] transition-all"
              >
                <Building2 className="w-6 h-6 text-cyan-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Register New Shop</h4>
                <p className="text-xs text-slate-400">Add local spaza, tavern, or car wash to network.</p>
              </button>

              <button
                onClick={() => setActiveModule('reports')}
                className="p-5 rounded-2xl bg-slate-900 border border-emerald-700/50 text-left hover:scale-[1.01] transition-all"
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Pull Sponsor Report</h4>
                <p className="text-xs text-slate-400">Export performance metrics and sponsorship proposals.</p>
              </button>
            </div>

          </div>
        )}

        {/* MODULE 2: TOKEN MINT & GENERATOR */}
        {activeModule === 'tokens' && (
          <div className="space-y-8">
            <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Ticket className="w-3.5 h-3.5" />
                  Token Forge &amp; Mint
                </div>
                <h2 className="text-2xl font-bold text-white">Generate Tokens for Registered Shops</h2>
                <p className="text-xs text-slate-400">
                  Create unique single-use token batches tied to a specific merchant. When customers redeem them, the shop&apos;s name will display in their history.
                </p>
              </div>

              {mintSuccessMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{mintSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleGenerateTokens} className="space-y-6">
                
                {/* Select Shop */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Select Target Merchant / Shop
                  </label>
                  <select
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-purple-400 outline-none"
                  >
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name} ({shop.location}) — Remaining Tokens: {shop.tokensRemaining}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3 Tiers Required by prompt */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Select Spend Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Tier 1 */}
                    <div
                      onClick={() => setSelectedTier(1)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedTier === 1
                          ? 'bg-purple-900/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-cyan-300">Tier 1</div>
                      <div className="text-lg font-black text-white">Spend R50</div>
                      <div className="text-xs font-semibold text-emerald-400">= 7 PCG Points</div>
                    </div>

                    {/* Tier 2 */}
                    <div
                      onClick={() => setSelectedTier(2)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedTier === 2
                          ? 'bg-purple-900/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-cyan-300">Tier 2</div>
                      <div className="text-lg font-black text-white">Spend R100</div>
                      <div className="text-xs font-semibold text-emerald-400">= 14 PCG Points</div>
                    </div>

                    {/* Tier 3 */}
                    <div
                      onClick={() => setSelectedTier(3)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedTier === 3
                          ? 'bg-purple-900/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-cyan-300">Tier 3</div>
                      <div className="text-lg font-black text-white">Spend R200</div>
                      <div className="text-xs font-semibold text-emerald-400">= 20 PCG Points</div>
                    </div>

                  </div>
                </div>

                {/* Bulk Quantity options (e.g. 250 tokens bulk) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Bulk Generation Quantity
                  </label>
                  <div className="flex gap-3">
                    {[50, 100, 250, 500].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setTokenQuantity(qty)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          tokenQuantity === qty
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {qty} Tokens
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Mint Button */}
                <button
                  type="submit"
                  className="glow-btn-purple w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  <span>MINT {tokenQuantity} TOKENS FOR SHOP</span>
                </button>

              </form>

            </div>

            {/* Recent Minted Tokens Stream */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Token Mint Inspection (Live 50 Tokens)</h3>
                <span className="text-xs text-slate-400">{tokens.length} total tokens in registry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                {tokens.slice(-30).reverse().map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-cyan-300">{t.code}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'available'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : t.status === 'redeemed'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>{t.shopName}</span>
                      <span className="text-purple-300 font-semibold">Tier {t.tier} (+{t.points} pts)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MODULE 3: MERCHANT HUB & SHOPS */}
        {activeModule === 'shops' && (
          <div className="space-y-8">
            
            {/* Register New Shop Form */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Onboarding Station
                </div>
                <h2 className="text-2xl font-bold text-white">Register a New Merchant Shop</h2>
                <p className="text-xs text-slate-400">
                  Enroll local township spaza shops, taverns, and car washes into the PCG REWARDS network.
                </p>
              </div>

              {shopRegisterSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{shopRegisterSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterShop} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Shop Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mokoena Spaza"
                      value={newShopName}
                      onChange={(e) => setNewShopName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Category</label>
                    <select
                      value={newShopCategory}
                      onChange={(e) => setNewShopCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400"
                    >
                      <option value="spaza">Spaza Shop</option>
                      <option value="carwash">Car Wash</option>
                      <option value="tavern">Tavern / Lounge</option>
                      <option value="supermarket">Supermarket</option>
                      <option value="tuckshop">Tuckshop</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Location / Township</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Soweto Zone 4"
                      value={newShopLocation}
                      onChange={(e) => setNewShopLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samson Mokoena"
                      value={newShopOwner}
                      onChange={(e) => setNewShopOwner(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 071 234 5678"
                      value={newShopPhone}
                      onChange={(e) => setNewShopPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="owner@domain.co.za"
                      value={newShopEmail}
                      onChange={(e) => setNewShopEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="glow-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm"
                >
                  Register Shop &amp; Issue Starter Tokens
                </button>
              </form>
            </div>

            {/* List of Registered Shops & Token Inventory Tracker & Fraud Freeze */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-white">Shop Registry &amp; Inventory Tracker</h3>
                  <p className="text-xs text-slate-400">Monitor token volume left per shop and enforce compliance</p>
                </div>
                <span className="text-xs text-slate-400">{shops.length} merchants registered</span>
              </div>

              <div className="divide-y divide-slate-800">
                {shops.map((shop) => (
                  <div key={shop.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{shop.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                          {shop.category}
                        </span>
                        {shop.status === 'frozen' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            FROZEN / VOIDED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {shop.location} &bull; Owner: {shop.ownerName} &bull; {shop.phone}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Inventory Tracker Indicator */}
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Tokens Remaining:</div>
                        <div className="text-base font-mono font-bold text-cyan-300">
                          {shop.tokensRemaining} <span className="text-xs text-slate-500 font-normal">/ {shop.totalTokensIssued}</span>
                        </div>
                      </div>

                      {/* Freeze / Void Button for Fraud Control */}
                      <button
                        onClick={() => handleToggleFreezeShop(shop.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          shop.status === 'active'
                            ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300'
                            : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{shop.status === 'active' ? 'Void / Freeze Tokens' : 'Unfreeze Shop'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MODULE 4: SHOP LEADERBOARD */}
        {activeModule === 'leaderboard' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Trophy className="w-3.5 h-3.5" />
                    Network Rankings
                  </div>
                  <h2 className="text-2xl font-bold text-white">Merchant Performance Leaderboard</h2>
                  <p className="text-xs text-slate-400">
                    Which shops in the PCG REWARDS network are generating the highest customer token redemptions
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {sortedShopsByPerformance.map((shop, idx) => (
                  <div key={shop.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-950'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="font-bold text-base text-white">{shop.name}</div>
                        <div className="text-xs text-slate-400">
                          {shop.location} &bull; Category: <span className="capitalize">{shop.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-cyan-300 font-mono">
                        {shop.tokensRedeemed} Tokens Loaded
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">
                        {pointsToZar(shop.tokensRedeemed * 14)} Estimated Spend Impact
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 5: SPONSOR & STAKEHOLDER FULL REPORT */}
        {activeModule === 'reports' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Full Stakeholder &amp; Sponsor Proposal Report</h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive operational report on points loaded, merchant turnover, and redemption metrics for investor and grant proposals.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="glow-btn px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Export Proposal PDF</span>
                </button>
              </div>

              {/* Printable Proposal Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/pcg-rewards-logo.jpg" alt="PCG REWARDS" className="w-12 h-12 rounded-xl object-contain" />
                    <div>
                      <h3 className="font-bold text-white text-lg">PCG REWARDS &bull; PERFORMANCE DOSSIER</h3>
                      <p className="text-xs text-slate-400">Entity: K2023135962 (SOUTH AFRICA) &bull; Reg: 2023/135962/07</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Date of Report: {new Date().toLocaleDateString()}</div>
                    <div className="text-emerald-400 font-semibold">Information Regulator Reg: 2026-068136</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Registered Merchants</div>
                    <div className="text-2xl font-bold text-white">{shops.length}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Total Tokens Minted</div>
                    <div className="text-2xl font-bold text-white">{tokens.length}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Total Points Issued</div>
                    <div className="text-2xl font-bold text-cyan-300">{totalPointsThisMonth} PCG</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Economic Value Created</div>
                    <div className="text-2xl font-bold text-emerald-400">{totalZarThisMonth} ZAR</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">Executive Proposal Summary:</h4>
                  <p>
                    PCG REWARDS has successfully digitized township commerce across spaza shops, car washes, and community taverns. With a baseline valuation model where 10 PCG Points corresponds to R0.08 in merchant redemption purchasing power, member households capture tangible cost-of-living offsets by converting discretionary spend into essential utility vouchers (data, prepaid electricity, grocery vouchers).
                  </p>
                  <p>
                    Sponsors seeking high-impact township outreach and ESG compliance benefit from direct ledger visibility, zero leakage, and verified community footfall.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 6: USER & TOKEN SUPPORT */}
        {activeModule === 'users' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Member Password Reset &amp; Token Repair</h2>
                <p className="text-xs text-slate-400">
                  Resolve forgotten passwords for customers and fix bad or disputed tokens directly.
                </p>
              </div>

              {userSupportMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{userSupportMessage}</span>
                </div>
              )}

              {/* Search User */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Search Member Accounts
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* User Results */}
              <div className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-sm">{u.username}</div>
                      <div className="text-xs text-slate-400">{u.email} &bull; Balance: {u.points} PCG</div>
                    </div>
                    <button
                      onClick={() => setSelectedUserToEdit(u)}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 text-xs text-purple-200 font-semibold"
                    >
                      Change Password
                    </button>
                  </div>
                ))}
              </div>

              {/* Password Change Form Modal */}
              {selectedUserToEdit && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-3">
                  <h4 className="font-bold text-white text-sm">
                    Reset Password for: {selectedUserToEdit.username} ({selectedUserToEdit.email})
                  </h4>
                  <form onSubmit={handleResetPassword} className="flex gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Enter new temporary password..."
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                    >
                      Apply Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUserToEdit(null)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {/* Bad Token Fixer */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Bad / Disputed Token Status Override</h4>
                <p className="text-xs text-slate-400">
                  Search any token code to restore or void it if customer reported an issue.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search token code e.g. PCG-SAM50-..."
                    value={searchTokenQuery}
                    onChange={(e) => setSearchTokenQuery(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  {filteredTokens.slice(0, 5).map((tok) => (
                    <div key={tok.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-cyan-300">{tok.code}</span>
                        <span className="text-slate-400 ml-2">({tok.shopName})</span>
                        <span className="text-purple-300 ml-2">Status: {tok.status}</span>
                      </div>
                      <button
                        onClick={() => handleFixToken(tok.id, tok.status)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Toggle Status ({tok.status === 'available' ? 'Void' : 'Restore'})
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};
