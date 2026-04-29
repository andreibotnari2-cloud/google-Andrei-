import { NextRequest, NextResponse } from 'next/server';
import { getAccountMetrics, getConversionCategories, isConfigured } from '@/lib/google-ads';

export async function GET(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  const accountId = req.nextUrl.searchParams.get('accountId');
  const mccId = process.env.MCC_CUSTOMER_ID!;
  if (!accountId) return NextResponse.json({ error: 'missing accountId' }, { status: 400 });

  try {
    const [current, previous, convCategories] = await Promise.all([
      getAccountMetrics(accountId, mccId, 'THIS_MONTH'),
      getAccountMetrics(accountId, mccId, 'LAST_MONTH'),
      getConversionCategories(accountId, mccId),
    ]);
    return NextResponse.json({ current, previous, convCategories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
