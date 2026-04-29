export const MCC_ACCOUNTS = [
  {
    id: 'mcc-274-086-4348',
    name: 'Schwiftyads-MCC',
    customerId: '274-086-4348',
    accounts: [
      { id: '183-473-0014', name: 'BoardShop.MD',       currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '542-339-5360', name: 'Lagmar',              currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '622-030-8778', name: 'Little Dent',         currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '412-048-6196', name: 'Metalica Zuev',       currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '150-945-9631', name: 'Orthodontica.md',     currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '462-332-1254', name: 'Profilactix',         currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '984-594-5688', name: 'SUPRATEN Bussines',   currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '751-564-5708', name: 'StarNet',             currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '415-655-2227', name: 'Top Estate',          currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '337-121-6713', name: 'Work Finder EU',      currency: 'MDL', status: 'active', paymentStatus: 'paid' },
      { id: '644-444-9213', name: 'XAuto',               currency: 'MDL', status: 'active', paymentStatus: 'paid' },
    ],
  },
];

export type ConvCategory = { name: string; conversions: number; prevConversions: number; cost: number };

export type AccountData = {
  spend: number; prevSpend: number;
  clicks: number; impressions: number; ctr: number; cpc: number;
  conversions: number; prevConversions: number;
  cpa: number; prevCpa: number;
  convRate: number; searchImprShare: number; avgPosition: number;
  budgetTotal: number; activeCampaigns: number;
  convCategories: ConvCategory[];
};

export const ACCOUNT_METRICS: Record<string, AccountData> = {
  '183-473-0014': { // BoardShop.MD
    spend: 8420, prevSpend: 7180, clicks: 4240, impressions: 128400, ctr: 3.30, cpc: 1.99,
    conversions: 94, prevConversions: 118, cpa: 89.57, prevCpa: 60.85,
    convRate: 2.22, searchImprShare: 61.4, avgPosition: 2.3,
    budgetTotal: 10000, activeCampaigns: 3,
    convCategories: [
      { name: 'Achiziții', conversions: 64, prevConversions: 84, cost: 74.22 },
      { name: 'Formulare', conversions: 30, prevConversions: 34, cost: 124.00 },
    ],
  },
  '542-339-5360': { // Lagmar
    spend: 5240, prevSpend: 4820, clicks: 2680, impressions: 74800, ctr: 3.58, cpc: 1.96,
    conversions: 62, prevConversions: 71, cpa: 84.52, prevCpa: 67.89,
    convRate: 2.31, searchImprShare: 54.2, avgPosition: 2.8,
    budgetTotal: 6000, activeCampaigns: 2,
    convCategories: [
      { name: 'Lead-uri', conversions: 42, prevConversions: 51, cost: 72.40 },
      { name: 'Apeluri',  conversions: 20, prevConversions: 20, cost: 120.00 },
    ],
  },
  '622-030-8778': { // Little Dent
    spend: 3280, prevSpend: 2940, clicks: 1540, impressions: 98200, ctr: 1.57, cpc: 2.13,
    conversions: 38, prevConversions: 42, cpa: 86.32, prevCpa: 70.00,
    convRate: 2.47, searchImprShare: 41.8, avgPosition: 3.4,
    budgetTotal: 4000, activeCampaigns: 1,
    convCategories: [
      { name: 'Formulare contact', conversions: 38, prevConversions: 42, cost: 86.32 },
    ],
  },
  '412-048-6196': { // Metalica Zuev
    spend: 4120, prevSpend: 3680, clicks: 1820, impressions: 64200, ctr: 2.83, cpc: 2.26,
    conversions: 44, prevConversions: 52, cpa: 93.64, prevCpa: 70.77,
    convRate: 2.42, searchImprShare: 47.6, avgPosition: 3.1,
    budgetTotal: 5000, activeCampaigns: 2,
    convCategories: [
      { name: 'Apeluri',  conversions: 28, prevConversions: 34, cost: 88.00 },
      { name: 'Formulare', conversions: 16, prevConversions: 18, cost: 105.00 },
    ],
  },
  '150-945-9631': { // Orthodontica.md
    spend: 6840, prevSpend: 5920, clicks: 3120, impressions: 94600, ctr: 3.30, cpc: 2.19,
    conversions: 78, prevConversions: 89, cpa: 87.69, prevCpa: 66.52,
    convRate: 2.50, searchImprShare: 58.3, avgPosition: 2.4,
    budgetTotal: 8000, activeCampaigns: 3,
    convCategories: [
      { name: 'Programări', conversions: 58, prevConversions: 68, cost: 72.41 },
      { name: 'Apeluri',    conversions: 20, prevConversions: 21, cost: 132.00 },
    ],
  },
  '462-332-1254': { // Profilactix
    spend: 2940, prevSpend: 2640, clicks: 1340, impressions: 48200, ctr: 2.78, cpc: 2.19,
    conversions: 32, prevConversions: 38, cpa: 91.88, prevCpa: 69.47,
    convRate: 2.39, searchImprShare: 43.2, avgPosition: 3.2,
    budgetTotal: 3500, activeCampaigns: 1,
    convCategories: [
      { name: 'Formulare', conversions: 32, prevConversions: 38, cost: 91.88 },
    ],
  },
  '984-594-5688': { // SUPRATEN Bussines
    spend: 12480, prevSpend: 10840, clicks: 5820, impressions: 186400, ctr: 3.12, cpc: 2.14,
    conversions: 138, prevConversions: 162, cpa: 90.43, prevCpa: 66.91,
    convRate: 2.37, searchImprShare: 55.8, avgPosition: 2.6,
    budgetTotal: 15000, activeCampaigns: 4,
    convCategories: [
      { name: 'Lead-uri B2B', conversions: 84,  prevConversions: 102, cost: 84.29 },
      { name: 'Apeluri',      conversions: 38,  prevConversions: 42,  cost: 108.00 },
      { name: 'Formulare',    conversions: 16,  prevConversions: 18,  cost: 124.00 },
    ],
  },
  '751-564-5708': { // StarNet
    spend: 18420, prevSpend: 15680, clicks: 8840, impressions: 284200, ctr: 3.11, cpc: 2.08,
    conversions: 198, prevConversions: 241, cpa: 93.03, prevCpa: 65.06,
    convRate: 2.24, searchImprShare: 63.4, avgPosition: 2.1,
    budgetTotal: 22000, activeCampaigns: 5,
    convCategories: [
      { name: 'Abonamente Internet', conversions: 128, prevConversions: 158, cost: 82.03 },
      { name: 'Apeluri',             conversions: 48,  prevConversions: 58,  cost: 118.00 },
      { name: 'Formulare contact',   conversions: 22,  prevConversions: 25,  cost: 142.00 },
    ],
  },
  '415-655-2227': { // Top Estate
    spend: 4820, prevSpend: 4210, clicks: 2040, impressions: 72400, ctr: 2.82, cpc: 2.36,
    conversions: 52, prevConversions: 61, cpa: 92.69, prevCpa: 69.02,
    convRate: 2.55, searchImprShare: 49.6, avgPosition: 2.7,
    budgetTotal: 6000, activeCampaigns: 2,
    convCategories: [
      { name: 'Vizionări proprietăți', conversions: 34, prevConversions: 41, cost: 78.50 },
      { name: 'Formulare contact',     conversions: 18, prevConversions: 20, cost: 130.00 },
    ],
  },
  '337-121-6713': { // Work Finder EU
    spend: 3940, prevSpend: 3580, clicks: 1820, impressions: 64600, ctr: 2.82, cpc: 2.16,
    conversions: 41, prevConversions: 48, cpa: 96.10, prevCpa: 74.58,
    convRate: 2.25, searchImprShare: 44.1, avgPosition: 3.0,
    budgetTotal: 5000, activeCampaigns: 2,
    convCategories: [
      { name: 'CV-uri trimise', conversions: 27, prevConversions: 32, cost: 84.00 },
      { name: 'Apeluri',        conversions: 14, prevConversions: 16, cost: 121.00 },
    ],
  },
  '644-444-9213': { // XAuto
    spend: 7180, prevSpend: 6240, clicks: 3240, impressions: 108400, ctr: 2.99, cpc: 2.22,
    conversions: 82, prevConversions: 96, cpa: 87.56, prevCpa: 65.00,
    convRate: 2.53, searchImprShare: 57.2, avgPosition: 2.5,
    budgetTotal: 9000, activeCampaigns: 3,
    convCategories: [
      { name: 'Test drive',     conversions: 42, prevConversions: 51, cost: 78.00 },
      { name: 'Formulare',      conversions: 28, prevConversions: 32, cost: 98.00 },
      { name: 'Apeluri',        conversions: 12, prevConversions: 13, cost: 142.00 },
    ],
  },
};

export const OVERVIEW_METRICS = {
  thisMonth: {
    spend: 28450,
    clicks: 14820,
    impressions: 412600,
    conversions: 348,
    ctr: 3.59,
    cpc: 1.92,
    cpa: 81.75,
    roas: 4.2,
    convRate: 2.35,
  },
  lastMonth: {
    spend: 24100,
    clicks: 12300,
    impressions: 387000,
    conversions: 289,
    ctr: 3.18,
    cpc: 1.96,
    cpa: 83.39,
    roas: 3.8,
    convRate: 2.35,
  },
};

export const DAILY_PERFORMANCE = [
  { date: '01 Apr', spend: 820, clicks: 430, conversions: 9, impressions: 12400 },
  { date: '02 Apr', spend: 910, clicks: 480, conversions: 11, impressions: 13200 },
  { date: '03 Apr', spend: 780, clicks: 410, conversions: 8, impressions: 11800 },
  { date: '04 Apr', spend: 1050, clicks: 560, conversions: 14, impressions: 15600 },
  { date: '05 Apr', spend: 960, clicks: 510, conversions: 12, impressions: 14200 },
  { date: '06 Apr', spend: 720, clicks: 380, conversions: 7, impressions: 10900 },
  { date: '07 Apr', spend: 690, clicks: 360, conversions: 6, impressions: 10200 },
  { date: '08 Apr', spend: 1120, clicks: 590, conversions: 16, impressions: 16800 },
  { date: '09 Apr', spend: 1080, clicks: 570, conversions: 15, impressions: 16100 },
  { date: '10 Apr', spend: 990, clicks: 520, conversions: 13, impressions: 14800 },
  { date: '11 Apr', spend: 1200, clicks: 630, conversions: 18, impressions: 18200 },
  { date: '12 Apr', spend: 1150, clicks: 610, conversions: 17, impressions: 17600 },
  { date: '13 Apr', spend: 870, clicks: 460, conversions: 10, impressions: 13100 },
  { date: '14 Apr', spend: 840, clicks: 440, conversions: 9, impressions: 12700 },
];

export const CAMPAIGNS = [
  {
    id: 'c1', name: 'Search - Brand Keywords', status: 'ENABLED',
    type: 'SEARCH', budget: 500, spend: 428, impressions: 42600,
    clicks: 3840, ctr: 9.01, cpc: 0.11, conversions: 89, cpa: 4.81, roas: 9.2,
    qualityScore: 9, account: 'ShiftyAds - eCommerce RO',
  },
  {
    id: 'c2', name: 'Search - Generic Products', status: 'ENABLED',
    type: 'SEARCH', budget: 1200, spend: 1180, impressions: 98200,
    clicks: 2940, ctr: 2.99, cpc: 0.40, conversions: 62, cpa: 19.03, roas: 5.6,
    qualityScore: 7, account: 'ShiftyAds - eCommerce RO',
  },
  {
    id: 'c3', name: 'Performance Max - All Products', status: 'ENABLED',
    type: 'PERFORMANCE_MAX', budget: 2000, spend: 1960, impressions: 124000,
    clicks: 3200, ctr: 2.58, cpc: 0.61, conversions: 78, cpa: 25.13, roas: 4.1,
    qualityScore: null, account: 'ShiftyAds - eCommerce RO',
  },
  {
    id: 'c4', name: 'Display - Remarketing', status: 'ENABLED',
    type: 'DISPLAY', budget: 400, spend: 388, impressions: 215000,
    clicks: 820, ctr: 0.38, cpc: 0.47, conversions: 18, cpa: 21.56, roas: 3.8,
    qualityScore: null, account: 'Client Auto MD',
  },
  {
    id: 'c5', name: 'Search - Competitors', status: 'ENABLED',
    type: 'SEARCH', budget: 600, spend: 612, impressions: 28400,
    clicks: 980, ctr: 3.45, cpc: 0.62, conversions: 14, cpa: 43.71, roas: 2.1,
    qualityScore: 5, account: 'Client Auto MD',
  },
  {
    id: 'c6', name: 'Shopping - Top Products', status: 'PAUSED',
    type: 'SHOPPING', budget: 800, spend: 0, impressions: 0,
    clicks: 0, ctr: 0, cpc: 0, conversions: 0, cpa: 0, roas: 0,
    qualityScore: null, account: 'Fashion Store RO',
  },
  {
    id: 'c7', name: 'YouTube - Brand Awareness', status: 'ENABLED',
    type: 'VIDEO', budget: 500, spend: 468, impressions: 89000,
    clicks: 1240, ctr: 1.39, cpc: 0.38, conversions: 8, cpa: 58.50, roas: 1.9,
    qualityScore: null, account: 'Imobiliare Chișinău',
  },
];

export const KEYWORDS = [
  { id: 'k1', keyword: 'cumpara pantofi online', matchType: 'EXACT', campaignName: 'Search - Generic Products', status: 'ENABLED', qualityScore: 8, clicks: 420, impressions: 5200, ctr: 8.08, cpc: 0.28, conversions: 18, cpa: 6.53, spend: 117.6 },
  { id: 'k2', keyword: 'pantofi sport barbati', matchType: 'PHRASE', campaignName: 'Search - Generic Products', status: 'ENABLED', qualityScore: 7, clicks: 380, impressions: 6800, ctr: 5.59, cpc: 0.32, conversions: 14, cpa: 8.69, spend: 121.6 },
  { id: 'k3', keyword: 'incaltaminte dama ieftina', matchType: 'BROAD', campaignName: 'Search - Generic Products', status: 'ENABLED', qualityScore: 4, clicks: 280, impressions: 18400, ctr: 1.52, cpc: 0.68, conversions: 3, cpa: 63.47, spend: 190.4 },
  { id: 'k4', keyword: '[brand name] pantofi', matchType: 'EXACT', campaignName: 'Search - Brand Keywords', status: 'ENABLED', qualityScore: 10, clicks: 1240, impressions: 13200, ctr: 9.39, cpc: 0.08, conversions: 52, cpa: 1.91, spend: 99.2 },
  { id: 'k5', keyword: 'ghete toamna iarna', matchType: 'PHRASE', campaignName: 'Search - Generic Products', status: 'ENABLED', qualityScore: 6, clicks: 310, impressions: 9200, ctr: 3.37, cpc: 0.41, conversions: 9, cpa: 14.12, spend: 127.1 },
  { id: 'k6', keyword: 'pantofi casual barbati online', matchType: 'BROAD', campaignName: 'Search - Generic Products', status: 'ENABLED', qualityScore: 3, clicks: 180, impressions: 24000, ctr: 0.75, cpc: 0.94, conversions: 1, cpa: 169.20, spend: 169.2 },
  { id: 'k7', keyword: 'magazin incaltaminte online', matchType: 'EXACT', campaignName: 'Search - Competitors', status: 'ENABLED', qualityScore: 5, clicks: 290, impressions: 4800, ctr: 6.04, cpc: 0.58, conversions: 5, cpa: 33.64, spend: 168.2 },
  { id: 'k8', keyword: 'reduceri pantofi', matchType: 'PHRASE', campaignName: 'Search - Brand Keywords', status: 'ENABLED', qualityScore: 9, clicks: 680, impressions: 7800, ctr: 8.72, cpc: 0.09, conversions: 28, cpa: 2.19, spend: 61.2 },
];

export const RECOMMENDATIONS = [
  {
    type: 'warning',
    title: 'Keyword cu CPA ridicat — consideră pauza',
    description: '"incaltaminte dama ieftina" — CPA: 63.47 RON, conversii: 3. Cheltuiești 190 RON fără ROI.',
    campaign: 'Search - Generic Products',
    impact: 'high',
    action: 'Pause Keyword',
  },
  {
    type: 'warning',
    title: 'Quality Score scăzut (3/10)',
    description: '"pantofi casual barbati online" — QS 3. Landing page slab sau Ad Relevance scăzut.',
    campaign: 'Search - Generic Products',
    impact: 'high',
    action: 'Improve Ad & LP',
  },
  {
    type: 'info',
    title: 'Campanie limitată de buget',
    description: '"Search - Competitors" a cheltuit 102% din buget. Conversii pierdute estimate: 8/zi.',
    campaign: 'Search - Competitors',
    impact: 'medium',
    action: 'Increase Budget',
  },
  {
    type: 'success',
    title: 'Brand campaign performantă — scalează',
    description: '"Search - Brand Keywords" ROAS 9.2x, CPA 4.81 RON. Poți crește bugetul cu 40%.',
    campaign: 'Search - Brand Keywords',
    impact: 'high',
    action: 'Scale Budget',
  },
  {
    type: 'info',
    title: 'Adaugă negative keywords',
    description: 'Search Terms raport: 34% trafic irelevant pe "Search - Generic Products".',
    campaign: 'Search - Generic Products',
    impact: 'medium',
    action: 'Review Search Terms',
  },
];

export const DEVICE_DATA = [
  { device: 'Mobile', clicks: 8920, spend: 16240, conversions: 198, ctr: 3.8 },
  { device: 'Desktop', clicks: 4820, spend: 9680, conversions: 132, ctr: 3.2 },
  { device: 'Tablet', clicks: 1080, spend: 2530, conversions: 18, ctr: 2.9 },
];

export const HOURLY_DATA = [
  { hour: '00', conversions: 2, clicks: 120 },
  { hour: '01', conversions: 1, clicks: 80 },
  { hour: '02', conversions: 0, clicks: 60 },
  { hour: '03', conversions: 0, clicks: 45 },
  { hour: '04', conversions: 1, clicks: 70 },
  { hour: '05', conversions: 2, clicks: 140 },
  { hour: '06', conversions: 4, clicks: 280 },
  { hour: '07', conversions: 8, clicks: 520 },
  { hour: '08', conversions: 14, clicks: 820 },
  { hour: '09', conversions: 18, clicks: 1020 },
  { hour: '10', conversions: 22, clicks: 1180 },
  { hour: '11', conversions: 24, clicks: 1240 },
  { hour: '12', conversions: 20, clicks: 1100 },
  { hour: '13', conversions: 19, clicks: 1060 },
  { hour: '14', conversions: 21, clicks: 1140 },
  { hour: '15', conversions: 23, clicks: 1200 },
  { hour: '16', conversions: 26, clicks: 1320 },
  { hour: '17', conversions: 28, clicks: 1440 },
  { hour: '18', conversions: 24, clicks: 1240 },
  { hour: '19', conversions: 18, clicks: 980 },
  { hour: '20', conversions: 12, clicks: 720 },
  { hour: '21', conversions: 8, clicks: 480 },
  { hour: '22', conversions: 5, clicks: 320 },
  { hour: '23', conversions: 3, clicks: 200 },
];
