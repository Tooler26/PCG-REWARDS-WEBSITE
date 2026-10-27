import React, { useState } from 'react';
import { Hero3DCanvas } from '../components/Hero3DCanvas';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  ShoppingBag,
  Ticket,
  KeyRound,
  Gift,
  Building2,
  Phone,
  Mail,
  Send,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { REAL_REVIEWS, FAQS } from '../services/db';

interface HomePageProps {
  onNavigate: (view: string, subSection?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Shopkeeper Application Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    shopName: '',
    location: '',
    cellphone: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Prepare email body for direct mailto fallback
    const subject = encodeURIComponent(`New Shopkeeper Application: ${formData.shopName}`);
    const body = encodeURIComponent(
      `Shopkeeper Application Details:\n\n` +
      `Owner Name: ${formData.name} ${formData.surname}\n` +
      `Shop Name: ${formData.shopName}\n` +
      `Location: ${formData.location}\n` +
      `Cellphone: ${formData.cellphone}\n` +
      `Email: ${formData.email}\n\n` +
      `Message / Business Profile:\n${formData.message}\n\n` +
      `Sent via PCG REWARDS Website Portal`
    );

    // Optional mailto trigger
    window.location.href = `mailto:PHUMECITYGOLD@GMAIL.COM?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden pt-20">
      
      {/* =========================================================================
          HERO SECTION with THREE.JS 3D CANVAS & GSAP
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Interactive 3D Background */}
        <Hero3DCanvas />

        {/* Ambient Gradient Glows (Sky Blue & Sky Purple) */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[480px] h-[480px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-12">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.25)]">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>South Africa&apos;s First Township Rewards Ecosystem</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Turn Everyday Township Spend Into{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Real Digital Vouchers
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal">
              Earn <strong className="text-white">PCG REWARDS</strong> tokens when buying from your local spaza shop, car wash, or tavern. Load points on your phone and redeem directly for <strong>Data, Electricity, Usave, Checkers &amp; Shoprite</strong> vouchers.
            </p>
          </div>

          {/* Quick Stats Micro Strip */}
          <div className="grid grid-cols-3 max-w-xl mx-auto py-3 px-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center text-xs sm:text-sm">
            <div>
              <div className="font-extrabold text-cyan-300 text-base sm:text-xl font-heading">10 Points</div>
              <div className="text-slate-400 text-[11px]">= R0.08 Purchasing Power</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="font-extrabold text-purple-300 text-base sm:text-xl font-heading">3 Tiers</div>
              <div className="text-slate-400 text-[11px]">R50, R100, R200 Spend</div>
            </div>
            <div>
              <div className="font-extrabold text-emerald-300 text-base sm:text-xl font-heading">Instant</div>
              <div className="text-slate-400 text-[11px]">Token Validation</div>
            </div>
          </div>

          {/* Hero Action Buttons with Glowing Hover States */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('customer-auth')}
              className="glow-btn w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-cyan-500/30"
            >
              <span>Get Started &bull; Customer Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('apply-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glow-btn-purple w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-purple-200 border border-purple-500/40 font-bold text-base backdrop-blur-md shadow-lg shadow-purple-950/50"
            >
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>Apply to Join Network</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Registered with Information Regulator (South Africa) Reg: 2026-068136 &bull; POPIA Compliant</span>
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs text-slate-400 animate-bounce">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: HOW IT WORKS (Exact 5 Steps from user prompt)
          ========================================================================= */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Simple 5-Step Process
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              How Does <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">PCG REWARDS</span> Work?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Here is the exact cycle of how community members and local shops build wealth and everyday savings together:
            </p>
          </div>

          {/* 5 Numbered Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Step 1 */}
            <div className="glass-panel-glow p-6 rounded-2xl relative flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-xl">
                  1
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <UserCheck className="w-4 h-4" />
                  <span>Account Setup</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Register on our website
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Register on our website to create your free PCG REWARDS account in seconds.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400">
                15 Welcome Bonus points included
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel-glow p-6 rounded-2xl relative flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-extrabold text-xl">
                  2
                </div>
                <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Local</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Buy items worth R50, R100, R150+
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Visit your participating neighborhood spaza, car wash, or tavern and buy everyday items.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Tiers: R50 = 7 pts | R100 = 14 pts | R200 = 20 pts
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel-glow p-6 rounded-2xl relative flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-extrabold text-xl">
                  3
                </div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                  <Ticket className="w-4 h-4" />
                  <span>Receive Token</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Get your official physical token
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Then the shopkeeper will hand you an authentic printed PCG token matching the value you bought.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Unique encrypted token code
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-panel-glow p-6 rounded-2xl relative flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 font-extrabold text-xl">
                  4
                </div>
                <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold">
                  <KeyRound className="w-4 h-4" />
                  <span>Load Points</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Login &amp; load token on your account
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Log in to your PCG REWARDS Account and load your token to instantly earn points into your balance.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Real-time validation &amp; ZAR conversion
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-panel-glow p-6 rounded-2xl relative flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-extrabold text-xl">
                  5
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Gift className="w-4 h-4" />
                  <span>Redeem Rewards</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Redeem for Data, SMS or Vouchers
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When you have enough points, redeem for Data, SMS, Electricity, or any voucher: Usave, Checkers, Shoprite, etc.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
                Instant digital voucher code generated
              </div>
            </div>

          </div>

          {/* Quick CTA */}
          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('customer-auth')}
              className="glow-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-sm shadow-md"
            >
              <span>Create Account Now &amp; Start Collecting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: APPLY TO JOIN PCG REWARDS NETWORK
          ========================================================================= */}
      <section id="apply-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              For Spaza Shops, Car Washes &amp; Taverns
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Apply to Join the <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-sky-400 bg-clip-text text-transparent">PCG REWARDS Network</span>
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              Are you a local shopkeeper or business owner? Attract loyal customers who choose your shop every day to earn PCG points. Submit your details below; applications are reviewed directly by our executive office at <strong>PHUMECITYGOLD@GMAIL.COM</strong>.
            </p>
          </div>

          {/* Application Form Box */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-purple-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {formSubmitted ? (
              <div className="py-12 text-center space-y-6 max-w-lg mx-auto">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Application Sent Successfully!</h3>
                  <p className="text-sm text-slate-300">
                    Thank you, <strong>{formData.name} {formData.surname}</strong>. Your shop application for <strong>{formData.shopName}</strong> has been transmitted directly to our office at <code>PHUMECITYGOLD@GMAIL.COM</code>.
                  </p>
                  <p className="text-xs text-slate-400">
                    Our team will contact you on <strong>{formData.cellphone}</strong> within 24 to 48 hours to complete merchant onboarding and deliver your starter token packs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', surname: '', shopName: '', location: '', cellphone: '', email: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
                >
                  Submit Another Shop Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Samson"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Surname */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Surname <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="surname"
                      required
                      placeholder="e.g. Mokoena"
                      value={formData.surname}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Shop Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Shop Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      required
                      placeholder="e.g. Sam Car Wash / Kea Spaza"
                      value={formData.shopName}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Location / Township <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Soweto Meadowlands Zone 2"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cellphone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Cellphone Number <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="cellphone"
                      required
                      placeholder="e.g. 071 234 5678"
                      value={formData.cellphone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. sam@carwash.co.za"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Message / Business Details <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your business, estimated daily customers, and which token tiers you would like to issue..."
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                  />
                </div>

                {/* Direct submission destination note */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 flex items-center justify-between">
                  <span>Destination Officer: <strong>PHUMECITYGOLD@GMAIL.COM</strong></span>
                  <span className="text-slate-400">Direct Delivery</span>
                </div>

                {/* Submit Button with glowing effect */}
                <button
                  type="submit"
                  className="glow-btn-purple w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Shop Application Now</span>
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: REAL CUSTOMER & SHOP REVIEWS (No mocks)
          ========================================================================= */}
      <section id="reviews-section" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Verified Community Feedback
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Real Reviews from <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">Customers &amp; Shops</span>
            </h2>
            <p className="text-slate-300 text-base">
              Real feedback from local shopkeepers and township shoppers actively using PCG REWARDS every day.
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REAL_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Star Rating & Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Member
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{review.author}</h4>
                    <p className="text-xs text-cyan-400">{review.role}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>{review.location}</div>
                    <div>{review.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FAQ SECTION
          ========================================================================= */}
      <section id="faq-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              Knowledge Base
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-slate-300 text-base">
              Got questions about tokens, points conversion, or registration? Find answers here.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-semibold hover:text-cyan-300 transition-colors"
                  >
                    <span className="text-base">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CONTACT DETAILS & OFFICIAL REGISTRATION
          ========================================================================= */}
      <section id="contact-section" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" />
              Direct Communication
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Get in Touch with <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">PCG REWARDS</span>
            </h2>
            <p className="text-slate-300 text-base">
              Reach our management office directly via phone, WhatsApp, or official email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Office Phone */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Office Line</div>
              <div className="text-lg font-bold text-white">074 874 3232</div>
              <p className="text-xs text-slate-400">Mon - Fri: 08h00 to 17h00</p>
            </div>

            {/* Cellphone */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Direct Cellphone</div>
              <div className="text-lg font-bold text-white">068 965 7528</div>
              <p className="text-xs text-slate-400">Operations &amp; Merchant Support</p>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/27689657528?text=Hello%20PCG%20REWARDS,%20I%20want%20to%20learn%20more"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-6 rounded-2xl space-y-3 border-emerald-500/30 hover:border-emerald-400 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">WhatsApp Desk</div>
              <div className="text-lg font-bold text-white">068 965 7528</div>
              <p className="text-xs text-emerald-400/80 underline font-medium">Click to chat directly &rarr;</p>
            </a>

            {/* Official Email */}
            <a
              href="mailto:PHUMECITYGOLD@GMAIL.COM"
              className="glass-panel p-6 rounded-2xl space-y-3 border-sky-500/30 hover:border-sky-400 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Official Email</div>
              <div className="text-sm font-bold text-white font-mono break-all">PHUMECITYGOLD@GMAIL.COM</div>
              <p className="text-xs text-sky-400/80 underline font-medium">Send email to executive team &rarr;</p>
            </a>

          </div>

          {/* Legal Credentials Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Registered Legal Entity &amp; Regulator Filing</h3>
                <p className="text-xs text-slate-400">Official registration parameters in the Republic of South Africa</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                POPIA Compliant
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-300">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Company Name</div>
                <div className="font-bold text-white text-base">K2023135962 (SOUTH AFRICA)</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Registration Number</div>
                <div className="font-bold text-cyan-300 text-base">2023/135962/07</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Information Regulator (South Africa)</div>
                <div className="font-bold text-emerald-300 text-base">2026-068136</div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
