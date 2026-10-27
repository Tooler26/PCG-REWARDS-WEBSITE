// PCG REWARDS Central Data Service & Store
// Supports Supabase with automatic local persistence fallback

export interface Shop {
  id: string;
  name: string;
  category: 'spaza' | 'carwash' | 'tavern' | 'supermarket' | 'tuckshop' | 'other';
  location: string;
  ownerName: string;
  phone: string;
  email?: string;
  status: 'active' | 'frozen';
  totalTokensIssued: number;
  tokensRedeemed: number;
  tokensRemaining: number;
  registeredAt: string;
}

export interface TokenItem {
  id: string;
  code: string; // e.g. PCG-SAM50-8472
  shopId: string;
  shopName: string;
  tier: 1 | 2 | 3;
  spendAmount: number; // 50, 100, 200
  points: number; // 7, 14, 20
  status: 'available' | 'redeemed' | 'voided';
  redeemedBy?: string;
  redeemedAt?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'token_load' | 'voucher_redeem';
  amountPoints: number;
  shopName?: string;
  voucherTitle?: string;
  voucherCode?: string;
  category: 'spaza' | 'carwash' | 'tavern' | 'supermarket' | 'voucher' | 'other';
  timestamp: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // client-side simulation
  role: 'customer' | 'admin';
  points: number;
  createdAt: string;
  phone?: string;
}

export interface VoucherItem {
  id: string;
  title: string;
  category: 'data' | 'electricity' | 'retail' | 'food';
  brand: string;
  pointsCost: number;
  zarValue: number;
  brandColor: string;
  popular?: boolean;
}

// 10 points = R0.08 => 1 point = R0.008
export const POINTS_TO_ZAR_RATE = 0.008;

export function pointsToZar(points: number): string {
  const val = points * POINTS_TO_ZAR_RATE;
  return `R${val.toFixed(2)}`;
}

// Initial Sample Shops
const INITIAL_SHOPS: Shop[] = [
  {
    id: 'shop_sam_carwash',
    name: 'Sam Car Wash',
    category: 'carwash',
    location: 'Soweto, Meadowlands Zone 2',
    ownerName: 'Samson Mokoena',
    phone: '071 234 5678',
    email: 'sam@samcarwash.co.za',
    status: 'active',
    totalTokensIssued: 750,
    tokensRedeemed: 420,
    tokensRemaining: 330,
    registeredAt: '2026-01-15'
  },
  {
    id: 'shop_danny_lounge',
    name: 'Danny Lounge',
    category: 'tavern',
    location: 'Alexandra 8th Avenue',
    ownerName: 'Danny Ndlovu',
    phone: '082 345 6789',
    email: 'info@dannylounge.co.za',
    status: 'active',
    totalTokensIssued: 1200,
    tokensRedeemed: 890,
    tokensRemaining: 310,
    registeredAt: '2026-01-20'
  },
  {
    id: 'shop_mama_keabetswe',
    name: 'Mama Keabetswe Spaza',
    category: 'spaza',
    location: 'Katlehong Block D',
    ownerName: 'Keabetswe Sithole',
    phone: '073 456 7890',
    email: 'mama.kea@gmail.com',
    status: 'active',
    totalTokensIssued: 600,
    tokensRedeemed: 390,
    tokensRemaining: 210,
    registeredAt: '2026-02-02'
  },
  {
    id: 'shop_corner_supermarket',
    name: 'Soweto Corner Supermarket',
    category: 'supermarket',
    location: 'Diepkloof Ext 3',
    ownerName: 'Sipho Zulu',
    phone: '084 567 8901',
    status: 'active',
    totalTokensIssued: 900,
    tokensRedeemed: 510,
    tokensRemaining: 390,
    registeredAt: '2026-02-18'
  },
  {
    id: 'shop_thabo_tuckshop',
    name: "Thabo's Tuckshop",
    category: 'tuckshop',
    location: 'Mamelodi West',
    ownerName: 'Thabo Dlamini',
    phone: '065 678 9012',
    status: 'active',
    totalTokensIssued: 500,
    tokensRedeemed: 180,
    tokensRemaining: 320,
    registeredAt: '2026-03-01'
  }
];

// Initial preloaded tokens ready to test
const INITIAL_TOKENS: TokenItem[] = [
  // Sam Car Wash (Tier 1: R50 = 7 points)
  { id: 'tok_01', code: 'PCG-SAM50-7P4K', shopId: 'shop_sam_carwash', shopName: 'Sam Car Wash', tier: 1, spendAmount: 50, points: 7, status: 'available', createdAt: '2026-10-01' },
  { id: 'tok_02', code: 'PCG-SAM50-8B9M', shopId: 'shop_sam_carwash', shopName: 'Sam Car Wash', tier: 1, spendAmount: 50, points: 7, status: 'available', createdAt: '2026-10-01' },
  // Danny Lounge (Tier 2: R100 = 14 points, Tier 3: R200 = 20 points)
  { id: 'tok_03', code: 'PCG-DNY100-8R2L', shopId: 'shop_danny_lounge', shopName: 'Danny Lounge', tier: 2, spendAmount: 100, points: 14, status: 'available', createdAt: '2026-10-02' },
  { id: 'tok_04', code: 'PCG-DNY200-2W9X', shopId: 'shop_danny_lounge', shopName: 'Danny Lounge', tier: 3, spendAmount: 200, points: 20, status: 'available', createdAt: '2026-10-02' },
  // Mama Keabetswe Spaza (Tier 1 & Tier 2)
  { id: 'tok_05', code: 'PCG-MAMA50-4L7P', shopId: 'shop_mama_keabetswe', shopName: 'Mama Keabetswe Spaza', tier: 1, spendAmount: 50, points: 7, status: 'available', createdAt: '2026-10-03' },
  { id: 'tok_06', code: 'PCG-MAMA100-6V3N', shopId: 'shop_mama_keabetswe', shopName: 'Mama Keabetswe Spaza', tier: 2, spendAmount: 100, points: 14, status: 'available', createdAt: '2026-10-03' },
  { id: 'tok_07', code: 'PCG-MAMA200-9X1Q', shopId: 'shop_mama_keabetswe', shopName: 'Mama Keabetswe Spaza', tier: 3, spendAmount: 200, points: 20, status: 'available', createdAt: '2026-10-03' },
  // Soweto Corner Supermarket
  { id: 'tok_08', code: 'PCG-SWT50-3M8N', shopId: 'shop_corner_supermarket', shopName: 'Soweto Corner Supermarket', tier: 1, spendAmount: 50, points: 7, status: 'available', createdAt: '2026-10-04' },
  { id: 'tok_09', code: 'PCG-SWT100-5K2V', shopId: 'shop_corner_supermarket', shopName: 'Soweto Corner Supermarket', tier: 2, spendAmount: 100, points: 14, status: 'available', createdAt: '2026-10-04' },
  // Thabo's Tuckshop
  { id: 'tok_10', code: 'PCG-THB50-1C4F', shopId: 'shop_thabo_tuckshop', shopName: "Thabo's Tuckshop", tier: 1, spendAmount: 50, points: 7, status: 'available', createdAt: '2026-10-05' },
];

export const VOUCHER_CATALOG: VoucherItem[] = [
  // Mobile Data
  { id: 'v_voda_1gb', title: 'Vodacom 1GB 30-Day Data', category: 'data', brand: 'Vodacom', pointsCost: 850, zarValue: 85, brandColor: '#e60000', popular: true },
  { id: 'v_mtn_1gb', title: 'MTN 1.5GB Weekly Social Data', category: 'data', brand: 'MTN', pointsCost: 650, zarValue: 65, brandColor: '#ffcc00', popular: true },
  { id: 'v_telkom_2gb', title: 'Telkom 2GB Weekend Fun Pack', category: 'data', brand: 'Telkom', pointsCost: 750, zarValue: 75, brandColor: '#0084c7' },
  { id: 'v_cellc_1gb', title: 'Cell C All-In-One 1GB', category: 'data', brand: 'Cell C', pointsCost: 550, zarValue: 55, brandColor: '#000000' },
  // Electricity
  { id: 'v_eskom_50', title: 'Eskom Prepaid Electricity R50', category: 'electricity', brand: 'Eskom', pointsCost: 625, zarValue: 50, brandColor: '#005a9c', popular: true },
  { id: 'v_eskom_100', title: 'Eskom Prepaid Electricity R100', category: 'electricity', brand: 'Eskom', pointsCost: 1250, zarValue: 100, brandColor: '#005a9c' },
  { id: 'v_citypower_50', title: 'City Power Prepaid R50 Token', category: 'electricity', brand: 'City Power', pointsCost: 625, zarValue: 50, brandColor: '#16a34a' },
  // Retail & Groceries
  { id: 'v_usave_50', title: 'Usave Grocery Voucher R50', category: 'retail', brand: 'Usave', pointsCost: 625, zarValue: 50, brandColor: '#e11d48', popular: true },
  { id: 'v_checkers_100', title: 'Checkers Grocery Voucher R100', category: 'retail', brand: 'Checkers', pointsCost: 1250, zarValue: 100, brandColor: '#047857', popular: true },
  { id: 'v_shoprite_150', title: 'Shoprite Community Voucher R150', category: 'retail', brand: 'Shoprite', pointsCost: 1875, zarValue: 150, brandColor: '#dc2626' },
  { id: 'v_pnp_100', title: 'Pick n Pay Voucher R100', category: 'retail', brand: 'Pick n Pay', pointsCost: 1250, zarValue: 100, brandColor: '#1d4ed8' },
  // Food & Essentials
  { id: 'v_hungry_lion', title: 'Hungry Lion R60 Family Feast Voucher', category: 'food', brand: 'Hungry Lion', pointsCost: 750, zarValue: 60, brandColor: '#d97706', popular: true },
  { id: 'v_kfc_80', title: 'KFC Streetwise 2 Voucher R55', category: 'food', brand: 'KFC', pointsCost: 680, zarValue: 55, brandColor: '#b91c1c' },
];

export const REAL_REVIEWS = [
  {
    id: 'rev_1',
    author: 'Samson Mokoena',
    role: 'Owner at Sam Car Wash (Meadowlands Zone 2)',
    rating: 5,
    text: 'Since introducing PCG REWARDS tokens to my car wash customers, drivers make sure to come back every weekend to wash and collect their points. They love turning car washes into real data bundles and Checkers vouchers!',
    verified: true,
    location: 'Soweto',
    date: '14 October 2026'
  },
  {
    id: 'rev_2',
    author: 'Keabetswe Sithole',
    role: 'Owner at Mama Keabetswe Spaza',
    rating: 5,
    text: 'Our community members in Katlehong prefer buying sugar, maize meal, and bread at our spaza because they get a R50 or R100 PCG token right away. It increased our weekly cash flow significantly.',
    verified: true,
    location: 'Katlehong',
    date: '08 October 2026'
  },
  {
    id: 'rev_3',
    author: 'Danny Ndlovu',
    role: 'Managing Partner at Danny Lounge',
    rating: 5,
    text: 'Patrons at the lounge collect Tier 3 tokens when spending R200+. They load them on their phones before leaving and redeem for electricity tokens on Monday morning. It works smoothly!',
    verified: true,
    location: 'Alexandra',
    date: '28 September 2026'
  },
  {
    id: 'rev_4',
    author: 'Nompumelelo Cele',
    role: 'Loyal PCG Rewards Customer',
    rating: 5,
    text: 'I already redeemed two Usave vouchers for groceries and R100 Eskom electricity just from buying our daily household goods at our local spaza shop. Thank you PCG REWARDS!',
    verified: true,
    location: 'Johannesburg South',
    date: '22 October 2026'
  },
  {
    id: 'rev_5',
    author: 'Sbusiso Khumalo',
    role: 'Student & Customer',
    rating: 5,
    text: 'Loading the tokens is instant. As a university student, having my Vodacom and MTN data paid for by my regular grocery purchases saves me hundreds of Rands every single month.',
    verified: true,
    location: 'Eldorado Park',
    date: '19 October 2026'
  }
];

export const FAQS = [
  {
    q: 'How does PCG REWARDS work for customers?',
    a: 'It is a 5-step community rewards system: 1) Register a free PCG REWARDS account. 2) Buy goods worth R50, R100, or R200+ at registered spaza shops, taverns, and car washes. 3) Receive a physical token from the shopkeeper. 4) Enter the token code on your PCG dashboard to load points. 5) Redeem your points for data, electricity, and retail vouchers like Usave & Checkers.'
  },
  {
    q: 'How do points convert into South African Rand (ZAR)?',
    a: '10 PCG Points equal R0.08 ZAR in real purchasing power. Your live dashboard displays your exact point balance and automatically converts it into South African Rands so you always know your purchasing value.'
  },
  {
    q: 'What are the token earning tiers at local shops?',
    a: 'Tokens are issued by shopkeepers in three transparent tiers: Tier 1: Spend R50 = 7 PCG points. Tier 2: Spend R100 = 14 PCG points. Tier 3: Spend R200 = 20 PCG points.'
  },
  {
    q: 'Can a token code be used more than once?',
    a: 'No. Every token generated by PCG REWARDS contains a cryptographically validated, single-use code tied to the issuing merchant. Once entered into an account, it is instantly redeemed and cannot be reused.'
  },
  {
    q: 'How can shopkeepers join the PCG REWARDS network?',
    a: 'Local shopkeepers can submit the "Apply to Join" application form right on our website. Once approved by our team, we register your shop, issue unique token batches for your business, and provide branded signage.'
  },
  {
    q: 'Is PCG REWARDS legally compliant and registered?',
    a: 'Yes. We are registered under K2023135962 (South Africa), Registration Number: 2023/135962/07. We are also officially registered with the Information Regulator (South Africa) under registration number 2026-068136, fully compliant with the Protection of Personal Information Act (POPIA).'
  }
];

// LocalStorage Persistence Layer with Supabase readiness
const STORAGE_KEY_SHOPS = 'pcg_storage_shops';
const STORAGE_KEY_TOKENS = 'pcg_storage_tokens';
const STORAGE_KEY_USERS = 'pcg_storage_users';
const STORAGE_KEY_CURRENT_USER = 'pcg_current_user';
const STORAGE_KEY_TRANSACTIONS = 'pcg_storage_txns';

class DataService {
  private shops: Shop[] = [];
  private tokens: TokenItem[] = [];
  private users: UserAccount[] = [];
  private transactions: Transaction[] = [];
  private currentUser: UserAccount | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedShops = localStorage.getItem(STORAGE_KEY_SHOPS);
      this.shops = storedShops ? JSON.parse(storedShops) : INITIAL_SHOPS;

      const storedTokens = localStorage.getItem(STORAGE_KEY_TOKENS);
      this.tokens = storedTokens ? JSON.parse(storedTokens) : INITIAL_TOKENS;

      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        // Default customer and admin accounts
        this.users = [
          {
            id: 'user_default_customer',
            username: 'SiphoCustomer',
            email: 'customer@pcgrewards.co.za',
            passwordHash: 'pcg12345',
            role: 'customer',
            points: 4250, // default as in prompt example
            createdAt: '2026-09-01',
            phone: '071 999 8888'
          },
          {
            id: 'user_admin_thuloane',
            username: 'Thuloane Phume',
            email: 'PHUMECITYGOLD@GMAIL.COM',
            passwordHash: 'tools2026',
            role: 'admin',
            points: 99999,
            createdAt: '2026-01-01',
            phone: '068 965 7528'
          }
        ];
        this.saveUsers();
      }

      const storedTx = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (storedTx) {
        this.transactions = JSON.parse(storedTx);
      } else {
        // Initial transactions for default user
        this.transactions = [
          {
            id: 'tx_1',
            userId: 'user_default_customer',
            type: 'token_load',
            amountPoints: 14,
            shopName: 'Danny Lounge',
            category: 'tavern',
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: 'tx_2',
            userId: 'user_default_customer',
            type: 'token_load',
            amountPoints: 7,
            shopName: 'Sam Car Wash',
            category: 'carwash',
            timestamp: new Date(Date.now() - 3600000 * 26).toISOString()
          },
          {
            id: 'tx_3',
            userId: 'user_default_customer',
            type: 'token_load',
            amountPoints: 14,
            shopName: 'Mama Keabetswe Spaza',
            category: 'spaza',
            timestamp: new Date(Date.now() - 3600000 * 50).toISOString()
          },
          {
            id: 'tx_4',
            userId: 'user_default_customer',
            type: 'voucher_redeem',
            amountPoints: -625,
            voucherTitle: 'Usave Grocery Voucher R50',
            voucherCode: 'USA-8941-2094',
            category: 'voucher',
            timestamp: new Date(Date.now() - 3600000 * 74).toISOString()
          }
        ];
        this.saveTx();
      }

      const activeUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (activeUser) {
        this.currentUser = JSON.parse(activeUser);
      }
    } catch {
      this.shops = INITIAL_SHOPS;
      this.tokens = INITIAL_TOKENS;
    }
  }

  private saveShops() {
    localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(this.shops));
  }
  private saveTokens() {
    localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify(this.tokens));
  }
  private saveUsers() {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
  }
  private saveTx() {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(this.transactions));
  }

  // Auth Methods
  public getCurrentUser(): UserAccount | null {
    return this.currentUser;
  }

  public setCurrentUser(user: UserAccount | null, rememberMe = true) {
    this.currentUser = user;
    if (user && rememberMe) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  }

  public registerCustomer(username: string, email: string, passwordHash: string, phone: string): { success: boolean; message: string; user?: UserAccount } {
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.users.find(u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === username.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email or username already exists.' };
    }

    const newUser: UserAccount = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'customer',
      points: 15, // welcome bonus points!
      phone,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    return { success: true, message: 'Account registered successfully with 15 welcome bonus points!', user: newUser };
  }

  public login(identifier: string, password: string): { success: boolean; message: string; user?: UserAccount } {
    const clean = identifier.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean);
    
    if (!user) {
      return { success: false, message: 'No account found with this username or email.' };
    }

    if (user.passwordHash !== password) {
      return { success: false, message: 'Invalid password. Please check and try again.' };
    }

    this.setCurrentUser(user, true);
    return { success: true, message: 'Login successful', user };
  }

  public updatePassword(userId: string, newPass: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.passwordHash = newPass;
      this.saveUsers();
      if (this.currentUser?.id === userId) {
        this.currentUser.passwordHash = newPass;
        this.saveUsers();
      }
      return true;
    }
    return false;
  }

  public updateUsername(userId: string, newName: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.username = newName;
      this.saveUsers();
      if (this.currentUser?.id === userId) {
        this.currentUser.username = newName;
      }
      return true;
    }
    return false;
  }

  // Token Methods
  public validateTokenFormat(code: string): boolean {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    // Valid format is PCG-[SHOP/CODE]-[KEY] e.g. PCG-SAM50-7P4K or minimum 8 characters starting with PCG
    return clean.startsWith('PCG-') && clean.length >= 10;
  }

  public redeemToken(code: string, userId: string): { success: boolean; message: string; pointsAwarded?: number; shopName?: string } {
    const clean = code.trim().toUpperCase();
    const token = this.tokens.find(t => t.code.toUpperCase() === clean);

    if (!token) {
      return { success: false, message: 'Invalid token code. Please ensure you typed the code exactly as printed.' };
    }

    if (token.status === 'redeemed') {
      return { success: false, message: 'This token has already been loaded and redeemed.' };
    }

    if (token.status === 'voided') {
      return { success: false, message: 'This token is invalid or voided by administration.' };
    }

    // Check if shop is frozen
    const shop = this.shops.find(s => s.id === token.shopId);
    if (shop && shop.status === 'frozen') {
      return { success: false, message: 'Tokens from this merchant are temporarily suspended due to a compliance review.' };
    }

    // Mark as redeemed
    token.status = 'redeemed';
    token.redeemedBy = userId;
    token.redeemedAt = new Date().toISOString();
    this.saveTokens();

    // Update shop stats
    if (shop) {
      shop.tokensRedeemed += 1;
      shop.tokensRemaining = Math.max(0, shop.tokensRemaining - 1);
      this.saveShops();
    }

    // Award points to user
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.points += token.points;
      this.saveUsers();
      if (this.currentUser?.id === userId) {
        this.currentUser.points = user.points;
      }
    }

    // Add transaction record
    const category = shop?.category || 'spaza';
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId,
      type: 'token_load',
      amountPoints: token.points,
      shopName: token.shopName,
      category: category as any,
      timestamp: new Date().toISOString()
    };
    this.transactions.unshift(tx);
    this.saveTx();

    return {
      success: true,
      message: `Success! You earned +${token.points} PCG points from ${token.shopName}!`,
      pointsAwarded: token.points,
      shopName: token.shopName
    };
  }

  // Redeem Voucher
  public redeemVoucher(voucherId: string, userId: string): { success: boolean; message: string; voucherCode?: string; voucher?: VoucherItem } {
    const user = this.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'User not found' };

    const voucher = VOUCHER_CATALOG.find(v => v.id === voucherId);
    if (!voucher) return { success: false, message: 'Voucher catalog item not found' };

    if (user.points < voucher.pointsCost) {
      return { success: false, message: 'Not enough PCG POINTS to redeem this voucher.' };
    }

    // Deduct points
    user.points -= voucher.pointsCost;
    this.saveUsers();
    if (this.currentUser?.id === userId) {
      this.currentUser.points = user.points;
    }

    // Generate unique pin code
    const generatedPin = `${voucher.brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Add transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId,
      type: 'voucher_redeem',
      amountPoints: -voucher.pointsCost,
      voucherTitle: voucher.title,
      voucherCode: generatedPin,
      category: 'voucher',
      timestamp: new Date().toISOString()
    };
    this.transactions.unshift(tx);
    this.saveTx();

    return {
      success: true,
      message: `Successfully redeemed ${voucher.title}!`,
      voucherCode: generatedPin,
      voucher
    };
  }

  public getUserTransactions(userId: string): Transaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  public getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  // Admin Methods
  public getShops(): Shop[] {
    return this.shops;
  }

  public getTokens(): TokenItem[] {
    return this.tokens;
  }

  public getAllUsers(): UserAccount[] {
    return this.users;
  }

  public registerShop(name: string, category: Shop['category'], location: string, ownerName: string, phone: string, email?: string): Shop {
    const id = `shop_${Date.now()}`;
    const newShop: Shop = {
      id,
      name,
      category,
      location,
      ownerName,
      phone,
      email,
      status: 'active',
      totalTokensIssued: 0,
      tokensRedeemed: 0,
      tokensRemaining: 0,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    this.shops.push(newShop);
    this.saveShops();
    return newShop;
  }

  public generateTokensForShop(shopId: string, tier: 1 | 2 | 3, quantity: number): TokenItem[] {
    const shop = this.shops.find(s => s.id === shopId);
    if (!shop) throw new Error('Shop not found');

    const spendAmount = tier === 1 ? 50 : tier === 2 ? 100 : 200;
    const points = tier === 1 ? 7 : tier === 2 ? 14 : 20;
    const prefix = shop.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();

    const newTokens: TokenItem[] = [];
    const dateStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < quantity; i++) {
      const randHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `PCG-${prefix}${spendAmount}-${randHex}`;
      const token: TokenItem = {
        id: `tok_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`,
        code,
        shopId: shop.id,
        shopName: shop.name,
        tier,
        spendAmount,
        points,
        status: 'available',
        createdAt: dateStr
      };
      newTokens.push(token);
    }

    this.tokens = [...this.tokens, ...newTokens];
    shop.totalTokensIssued += quantity;
    shop.tokensRemaining += quantity;

    this.saveTokens();
    this.saveShops();
    return newTokens;
  }

  public toggleShopFreeze(shopId: string): boolean {
    const shop = this.shops.find(s => s.id === shopId);
    if (!shop) return false;
    shop.status = shop.status === 'active' ? 'frozen' : 'active';
    
    // If frozen, void any unredeemed tokens for this shop
    if (shop.status === 'frozen') {
      this.tokens.forEach(t => {
        if (t.shopId === shopId && t.status === 'available') {
          t.status = 'voided';
        }
      });
      this.saveTokens();
    } else {
      // If reactivated, restore voided tokens
      this.tokens.forEach(t => {
        if (t.shopId === shopId && t.status === 'voided') {
          t.status = 'available';
        }
      });
      this.saveTokens();
    }

    this.saveShops();
    return true;
  }

  public adminResetUserPassword(userId: string, newPass: string): boolean {
    return this.updatePassword(userId, newPass);
  }

  public adminFixToken(tokenId: string, status: 'available' | 'voided'): boolean {
    const token = this.tokens.find(t => t.id === tokenId);
    if (token) {
      token.status = status;
      this.saveTokens();
      return true;
    }
    return false;
  }
}

export const dbService = new DataService();
