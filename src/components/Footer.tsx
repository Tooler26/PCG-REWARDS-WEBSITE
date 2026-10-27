import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, ShieldCheck, FileText, Lock, Globe, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'popia' | null>(null);

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Registration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/pcg-rewards-logo.jpg"
                alt="PCG REWARDS"
                className="w-10 h-10 object-contain rounded-lg border border-cyan-500/30"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                PCG REWARDS
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              South Africa&apos;s township and community loyalty ecosystem. Fueling local spaza shops, car washes, and taverns with digital rewards that turn everyday cash spend into data, electricity, and grocery vouchers.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 text-slate-300">
              <div className="font-semibold text-cyan-300">Official Company Details:</div>
              <div>Company: <strong className="text-white">K2023135962 (SOUTH AFRICA)</strong></div>
              <div>Reg Number: <strong className="text-white">2023/135962/07</strong></div>
              <div className="text-[11px] text-emerald-400 font-medium">
                Information Regulator (South Africa): <strong>2026-068136</strong>
              </div>
            </div>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:PHUMECITYGOLD@GMAIL.COM"
                  className="flex items-center gap-2.5 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-mono text-xs">PHUMECITYGOLD@GMAIL.COM</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Office: <strong className="text-slate-200">074 874 3232</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Cellphone: <strong className="text-slate-200">068 965 7528</strong></span>
              </li>
              <li>
                <a
                  href="https://wa.me/27689657528?text=Hello%20PCG%20REWARDS,%20I%20would%20like%20to%20inquire%20about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: <strong>068 965 7528</strong></span>
                </a>
              </li>
            </ul>

            {/* Social Channels */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 block mb-2 font-medium">
                Official Channels
              </span>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/27689657528"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all hover:scale-105"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all hover:scale-105"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <Globe className="w-4 h-4" />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-all hover:scale-105"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Portals & Directory
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('customer-auth')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Customer Member Sign In / Sign Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-auth')}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  Admin Executive Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Apply as Merchant / Spaza Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  How It Works (5-Step Guide)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: POPIA & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              POPIA Compliance
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              PCG REWARDS processes customer and merchant data strictly in accordance with the Protection of Personal Information Act (POPIA). Your information is encrypted and protected under Information Regulator authorization.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <button
                onClick={() => setActiveLegalModal('privacy')}
                className="text-left text-slate-300 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegalModal('terms')}
                className="text-left text-slate-300 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Terms of Service
              </button>
              <button
                onClick={() => setActiveLegalModal('popia')}
                className="text-left text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                POPIA Compliance Notice &amp; Rights
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} PCG REWARDS. All rights reserved. Registered in the Republic of South Africa.
          </div>
          <div className="flex items-center gap-4">
            <span>ZAR Rate: 10 Points = R0.08</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin-auth')}
              className="text-slate-400 hover:text-purple-400 transition-colors"
            >
              Administrator Access
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-slate-300 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {activeLegalModal === 'privacy' && 'Privacy Policy'}
                {activeLegalModal === 'terms' && 'Terms of Service'}
                {activeLegalModal === 'popia' && 'Protection of Personal Information Act (POPIA)'}
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg text-white"
              >
                Close
              </button>
            </div>

            <div className="text-sm space-y-3 leading-relaxed">
              {activeLegalModal === 'privacy' && (
                <>
                  <p><strong>1. Information Collection:</strong> PCG REWARDS (K2023135962 South Africa) collects member username, contact numbers, and token redemption ledger entries solely for the delivery of loyalty incentives and voucher fulfillment.</p>
                  <p><strong>2. Third Parties:</strong> We do not sell or trade user data. Token verification occurs via encrypted internal protocol.</p>
                  <p><strong>3. Security:</strong> All tokens and user credentials are encrypted. You can request account updates or erasure at any time via <code>PHUMECITYGOLD@GMAIL.COM</code>.</p>
                </>
              )}
              {activeLegalModal === 'terms' && (
                <>
                  <p><strong>1. Token Validity:</strong> PCG tokens are single-use loyalty credits issued by registered local merchants (Spaza shops, Car washes, Lounges). Once loaded, they cannot be transferred or reused.</p>
                  <p><strong>2. Value &amp; Redemption:</strong> 10 PCG Points have a baseline purchasing value of R0.08 ZAR. Points may be redeemed for digital utility vouchers (airtime, data, prepaid electricity, and grocery vouchers) subject to inventory availability.</p>
                  <p><strong>3. Anti-Fraud:</strong> Generating unauthorized tokens or attempting duplicate redemptions results in immediate account freeze and revocation of point balances.</p>
                </>
              )}
              {activeLegalModal === 'popia' && (
                <>
                  <p><strong>Information Regulator Registration Number: 2026-068136</strong></p>
                  <p>In accordance with the South African Protection of Personal Information Act 4 of 2013 (&quot;POPIA&quot;):</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                    <li>PCG REWARDS collects only necessary personal information required to administer the rewards program.</li>
                    <li>Users have the legal right to request access to, correction of, or deletion of their personal information.</li>
                    <li>Information Officer Contact: <code>PHUMECITYGOLD@GMAIL.COM</code> | Phone: <code>068 965 7528</code>.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium text-sm"
              >
                Understood &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
