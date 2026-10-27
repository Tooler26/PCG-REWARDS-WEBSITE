import React, { useState } from 'react';
import { dbService, UserAccount } from '../services/db';
import {
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface CustomerAuthPageProps {
  onSuccessLogin: (user: UserAccount) => void;
  onNavigateHome: () => void;
}

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({
  onSuccessLogin,
  onNavigateHome
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [signInError, setSignInError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePopia, setAgreePopia] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Loading Transition
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passStrength = getPasswordStrength(signUpPassword);
  const getStrengthLabel = (score: number) => {
    if (score <= 25) return { label: 'Weak', color: 'bg-rose-500' };
    if (score <= 50) return { label: 'Fair', color: 'bg-amber-500' };
    if (score <= 75) return { label: 'Good', color: 'bg-cyan-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const res = dbService.login(signInIdentifier, signInPassword);
    if (!res.success || !res.user) {
      setSignInError(res.message);
      return;
    }

    // Role-aware routing & Loading into PCG REWARDS splash
    setIsLoggingIn(true);
    setTimeout(() => {
      onSuccessLogin(res.user!);
    }, 1200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess('');

    if (!agreeTerms || !agreePopia) {
      setSignUpError('Please agree to the Terms of Service and POPIA privacy terms.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match. Please re-enter.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }

    const res = dbService.registerCustomer(signUpUsername, signUpEmail, signUpPassword, signUpPhone);
    if (!res.success || !res.user) {
      setSignUpError(res.message);
      return;
    }

    setSignUpSuccess('Account registered successfully! Logging you in...');
    setIsLoggingIn(true);
    setTimeout(() => {
      onSuccessLogin(res.user!);
    }, 1400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const users = dbService.getAllUsers();
    const found = users.find(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (found) {
      setForgotSuccess(`Account identified. Your password hint or reset instruction has been sent to ${forgotEmail}. (Temporary recovery pass: ${found.passwordHash})`);
    } else {
      setForgotSuccess(`If an account with ${forgotEmail} exists, password reset instructions have been dispatched.`);
    }
  };

  // Loading Splash Screen when logging in
  if (isLoggingIn) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_50px_rgba(14,165,233,0.4)] mb-6 animate-pulse">
          <img src="/pcg-rewards-logo.jpg" alt="PCG REWARDS" className="w-20 h-20 object-contain rounded-xl" />
        </div>
        <div className="space-y-3 max-w-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            Loading into your PCG REWARDS
          </h2>
          <p className="text-xs text-slate-400">
            Authorizing session &amp; synchronizing wallet balances...
          </p>
          <div className="w-48 mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-900"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <img src="/pcg-rewards-logo.jpg" alt="PCG REWARDS" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-extrabold text-sm tracking-tight text-white">PCG REWARDS</span>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 max-w-md w-full mx-auto my-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-2xl space-y-6">
          
          {/* Brand header in form */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Customer Member Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'signin'
                ? 'Sign in to access your digital token wallet and vouchers'
                : 'Join PCG REWARDS and receive 15 welcome bonus points'}
            </p>
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('signin'); setSignInError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setSignUpError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {signInError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              {/* Demo Quick Fill for testing convenience */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Demo Customer:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSignInIdentifier('customer@pcgrewards.co.za');
                    setSignInPassword('pcg12345');
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Fill Sample Credentials
                </button>
              </div>

              {/* Username or Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SiphoCustomer or name@domain.co.za"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-300 cursor-pointer select-none">
                  Remember me (stay signed in)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="glow-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20 active:scale-98 transition-all"
              >
                Sign In to Account
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {signUpError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              {signUpSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{signUpSuccess}</span>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Choose unique username"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Cellphone Number (for voucher SMS)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 072 123 4567"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>

                {/* Live Password Strength Meter */}
                {signUpPassword.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Password Strength:</span>
                      <span className="font-semibold text-slate-200">
                        {getStrengthLabel(passStrength).label}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthLabel(passStrength).color}`}
                        style={{ width: `${passStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes: Terms & POPIA */}
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                  />
                  <span>
                    I agree to the <strong>PCG REWARDS Terms &amp; Conditions</strong> and acknowledge that 10 points equals R0.08 purchasing value.
                  </span>
                </label>

                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreePopia}
                    onChange={(e) => setAgreePopia(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                  />
                  <span>
                    I consent to POPIA personal data processing for rewards and voucher distribution (Reg No: <strong>2026-068136</strong>).
                  </span>
                </label>
              </div>

              {/* Submit Sign Up Button */}
              <button
                type="submit"
                className="glow-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                Create Account &amp; Claim 15 Points
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 text-slate-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Password Recovery
              </h3>
              <button
                onClick={() => { setShowForgotModal(false); setForgotSuccess(''); }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
                  {forgotSuccess}
                </div>
                <button
                  onClick={() => { setShowForgotModal(false); setForgotSuccess(''); }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter the email address tied to your PCG REWARDS account. We will verify your account and trigger reset authentication.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@domain.co.za"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-sm text-white transition-colors"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Credentials */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 pb-2">
        K2023135962 (SOUTH AFRICA) &bull; Official Information Regulator Registered 2026-068136
      </div>
    </div>
  );
};
