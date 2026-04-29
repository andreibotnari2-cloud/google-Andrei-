const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ADS_BASE = 'https://googleads.googleapis.com/v17';

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

async function gaqlSearch(customerId: string, query: string, loginCustomerId?: string) {
  const token = await getAccessToken();
  const id = customerId.replace(/-/g, '');
  const loginId = (loginCustomerId ?? process.env.MCC_CUSTOMER_ID ?? id).replace(/-/g, '');

  const res = await fetch(`${ADS_BASE}/customers/${id}/googleAds:search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      'login-customer-id': loginId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Ads API error: ${err}`);
  }
  return res.json();
}

export interface AccountInfo {
  id: string;
  name: string;
  currency: string;
  status: string;
}

export async function getMCCAccounts(mccId: string): Promise<AccountInfo[]> {
  const data = await gaqlSearch(mccId,
    `SELECT customer_client.id, customer_client.descriptive_name,
            customer_client.currency_code, customer_client.status
     FROM customer_client
     WHERE customer_client.level = 1
       AND customer_client.status != 'CANCELLED'`,
    mccId
  );

  return (data.results ?? []).map((r: any) => ({
    id: String(r.customerClient.id),
    name: r.customerClient.descriptiveName ?? 'Unnamed',
    currency: r.customerClient.currencyCode ?? 'USD',
    status: r.customerClient.status ?? 'UNKNOWN',
  }));
}

export interface AccountMetrics {
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  convRate: number;
  searchImprShare: number;
}

export async function getAccountMetrics(
  customerId: string,
  mccId: string,
  dateRange: 'THIS_MONTH' | 'LAST_MONTH' = 'THIS_MONTH'
): Promise<AccountMetrics> {
  const data = await gaqlSearch(
    customerId,
    `SELECT
       metrics.cost_micros,
       metrics.clicks,
       metrics.impressions,
       metrics.ctr,
       metrics.average_cpc,
       metrics.conversions,
       metrics.cost_per_conversion,
       metrics.conversions_from_interactions_rate,
       metrics.search_impression_share
     FROM customer
     WHERE segments.date DURING ${dateRange}`,
    mccId
  );

  const r = data.results?.[0];
  if (!r) return { spend: 0, clicks: 0, impressions: 0, conversions: 0, ctr: 0, cpc: 0, cpa: 0, convRate: 0, searchImprShare: 0 };

  const m = r.metrics;
  return {
    spend: Math.round((m.costMicros ?? 0) / 1_000_000),
    clicks: m.clicks ?? 0,
    impressions: m.impressions ?? 0,
    conversions: Math.round(m.conversions ?? 0),
    ctr: (m.ctr ?? 0) * 100,
    cpc: (m.averageCpc ?? 0) / 1_000_000,
    cpa: (m.costPerConversion ?? 0) / 1_000_000,
    convRate: (m.conversionsFromInteractionsRate ?? 0) * 100,
    searchImprShare: (m.searchImpressionShare ?? 0) * 100,
  };
}

export interface ConversionCategory {
  name: string;
  conversions: number;
  costPerConversion: number;
}

export async function getConversionCategories(
  customerId: string,
  mccId: string
): Promise<ConversionCategory[]> {
  const data = await gaqlSearch(
    customerId,
    `SELECT
       conversion_action.name,
       metrics.conversions,
       metrics.cost_per_conversion
     FROM conversion_action
     WHERE segments.date DURING THIS_MONTH
       AND metrics.conversions > 0`,
    mccId
  );

  return (data.results ?? []).map((r: any) => ({
    name: r.conversionAction?.name ?? 'Unknown',
    conversions: Math.round(r.metrics?.conversions ?? 0),
    costPerConversion: (r.metrics?.costPerConversion ?? 0) / 1_000_000,
  }));
}

export function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  );
}
