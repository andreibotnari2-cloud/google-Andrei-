import { NextResponse } from 'next/server';
import { getMCCAccounts, isConfigured } from '@/lib/google-ads';

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  try {
    const mccId = process.env.MCC_CUSTOMER_ID!;
    const accounts = await getMCCAccounts(mccId);
    return NextResponse.json({ accounts, mccId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
