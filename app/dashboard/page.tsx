'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Search, Pencil, Check, X, Calendar, Loader2, RefreshCw } from 'lucide-react';

const STORAGE_KEY_HIDDEN = 'hidden-accounts';
const STORAGE_KEY_BUDGETS = 'account-budgets';

type PeriodKey = 'this_month' | 'last_month';

const MONTH_NAMES_RO = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
const now = new Date();
const currMonth = MONTH_NAMES_RO[now.getMonth()];
const prevMonth = MONTH_NAMES_RO[(now.getMonth() - 1 + 12) % 12];

const PERIODS: Record<PeriodKey, { label: string; curr: string; prev: string }> = {
  this_month: { label: 'Această lună', curr: currMonth, prev: prevMonth },
  last_month: { label: 'Luna trecută',  curr: prevMonth, prev: MONTH_NAMES_RO[(now.getMonth() - 2 + 12) % 12] },
};

interface ApiMetrics {
  spend: number; clicks: number; impressions: number; conversions: number;
  ctr: number; cpc: number; cpa: number; convRate: number; searchImprShare: number;
}

interface ApiConvCategory {
  name: string; conversions: number; costPerConversion: number;
}

interface AccountEntry {
  id: string; name: string; currency: string; status: string; mccId: string;
}

interface AccountMetricsData {
  current: ApiMetrics; previous: ApiMetrics; convCategories: ApiConvCategory[];
}

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 18, circ = 2 * Math.PI * r;
  const fill = Math.min(pct / 100, 1) * circ;
  return (
    <svg width={44} height={44} className="-rotate-90">
      <circle cx={22} cy={22} r={r} fill="none" stroke="#E2E8F0" strokeWidth={3.5} />
      <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={3.5}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function BudgetEditor({ accountId, currency }: { accountId: string; currency: string }) {
  const storageKey = `${STORAGE_KEY_BUDGETS}-${accountId}`;
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(0);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const v = localStorage.getItem(storageKey);
    if (v) setSaved(Number(v));
  }, [storageKey]);

  function save() {
    const n = Number(draft.replace(/\D/g, ''));
    if (n > 0) { setSaved(n); localStorage.setItem(storageKey, String(n)); }
    setEditing(false);
  }

  if (editing) return (
    <div className="flex items-center gap-1">
      <span className="text-slate-400 text-xs">{currency}</span>
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
        className="w-24 px-2 py-0.5 text-xs border border-blue-400 rounded bg-blue-50 text-slate-900 focus:outline-none font-semibold" />
      <button onClick={save} className="text-green-600 hover:text-green-700"><Check size={13} /></button>
      <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={13} /></button>
    </div>
  );

  return (
    <button onClick={() => { setDraft(String(saved)); setEditing(true); }}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 group transition-colors">
      {saved > 0
        ? <span className="font-semibold">{currency} {saved.toLocaleString()}</span>
        : <span className="text-slate-300 italic">Setează buget</span>}
      <Pencil size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function AccountCard({
  acc, mccId, hidden, onToggleHide, period, metrics,
}: {
  acc: AccountEntry;
  mccId: string;
  hidden: boolean;
  onToggleHide: () => void;
  period: PeriodKey;
  metrics: AccountMetricsData | null;
}) {
  const [open, setOpen] = useState(false);
  const cfg = PERIODS[period];
  const isLastMonth = period === 'last_month';

  const current = metrics?.current;
  const previous = metrics?.previous;
  const convCategories = metrics?.convCategories ?? [];

  const spend       = (isLastMonth ? previous?.spend       : current?.spend)       ?? 0;
  const conversions = (isLastMonth ? previous?.conversions : current?.conversions) ?? 0;
  const cpa         = (isLastMonth ? previous?.cpa         : current?.cpa)         ?? 0;
  const prevSpend       = isLastMonth ? 0 : (previous?.spend       ?? 0);
  const prevConversions = isLastMonth ? 0 : (previous?.conversions ?? 0);
  const prevCpa         = isLastMonth ? 0 : (previous?.cpa         ?? 0);
  const hasComparison   = !isLastMonth;

  const storageKey = `${STORAGE_KEY_BUDGETS}-${acc.id}`;
  const [budgetTotal, setBudgetTotal] = useState(0);
  useEffect(() => {
    const v = localStorage.getItem(storageKey);
    if (v) setBudgetTotal(Number(v));
  }, [storageKey]);
  const budgetPct = budgetTotal > 0 ? (spend / budgetTotal) * 100 : 0;

  const clicks          = current?.clicks          ?? 0;
  const impressions     = current?.impressions     ?? 0;
  const ctr             = current?.ctr             ?? 0;
  const cpc             = current?.cpc             ?? 0;
  const convRate        = current?.convRate        ?? 0;
  const searchImprShare = current?.searchImprShare ?? 0;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${hidden ? 'opacity-50 border-slate-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${acc.status === 'ENABLED' ? 'bg-green-500' : 'bg-slate-300'}`} />
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold text-sm truncate">{acc.name}</p>
            <p className="text-slate-400 text-[10px]">{acc.id} · {acc.currency} · {mccId}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 ml-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-slate-400 text-[10px] mb-0.5">Buget lunar</p>
            <BudgetEditor accountId={acc.id} currency={acc.currency} />
          </div>
          <button onClick={onToggleHide}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={hidden ? 'Arată contul' : 'Ascunde contul'}>
            {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
      </div>

      {!metrics ? (
        <div className="flex items-center justify-center py-8 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Se încarcă metricile...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {/* BUGET */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <ProgressRing pct={budgetPct} color={budgetPct >= 95 ? '#F59E0B' : '#2563EB'} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">
                    {Math.round(budgetPct)}%
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Buget cheltuit</p>
                  <p className="text-slate-900 font-bold text-sm">
                    {acc.currency} {spend > 0 ? spend.toLocaleString() : '—'}
                  </p>
                  {hasComparison && (
                    <p className="text-[10px] mt-0.5">
                      {spend >= prevSpend
                        ? <span className="text-green-600 font-medium">+{acc.currency} {(spend - prevSpend).toLocaleString()} față de {cfg.prev}</span>
                        : <span className="text-blue-600">mai {acc.currency} {(prevSpend - spend).toLocaleString()} față de {cfg.prev}</span>}
                    </p>
                  )}
                  {hasComparison && <p className="text-slate-400 text-[9px] mt-0.5">{cfg.prev}: {acc.currency} {prevSpend.toLocaleString()}</p>}
                </div>
              </div>
            </div>

            {/* CONVERSII */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <ProgressRing
                    pct={hasComparison && prevConversions > 0 ? (conversions / prevConversions) * 100 : 100}
                    color={!hasComparison ? '#2563EB' : conversions >= prevConversions ? '#10B981' : '#2563EB'}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">
                    {hasComparison && prevConversions > 0 ? Math.round((conversions / prevConversions) * 100) : '—'}%
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Conversii</p>
                  <p className="text-slate-900 font-bold text-sm">{conversions > 0 ? conversions : '—'}</p>
                  {hasComparison && (
                    <p className="text-[10px] mt-0.5">
                      {conversions >= prevConversions
                        ? <span className="text-green-600 font-medium">+{conversions - prevConversions} față de {cfg.prev}</span>
                        : <span className="text-blue-600">mai {prevConversions - conversions} față de {cfg.prev}</span>}
                    </p>
                  )}
                  {hasComparison && <p className="text-slate-400 text-[9px] mt-0.5">{cfg.prev}: {prevConversions}</p>}
                </div>
              </div>
            </div>

            {/* COST/CONV */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <ProgressRing
                    pct={hasComparison && prevCpa > 0 ? (cpa / prevCpa) * 100 : 100}
                    color={!hasComparison ? '#2563EB' : cpa <= prevCpa ? '#10B981' : '#EF4444'}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">
                    {hasComparison && prevCpa > 0 ? Math.round((cpa / prevCpa) * 100) : '—'}%
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Cost / Conversie</p>
                  <p className={`font-bold text-sm ${hasComparison && cpa > prevCpa ? 'text-red-500' : cpa > 0 ? 'text-green-600' : 'text-slate-300'}`}>
                    {cpa > 0 ? `${acc.currency} ${cpa.toFixed(2)}` : '—'}
                  </p>
                  {hasComparison && cpa > 0 && prevCpa > 0 && (
                    <p className="text-[10px] mt-0.5">
                      {cpa <= prevCpa
                        ? <span className="text-green-600 font-medium">-{acc.currency} {(prevCpa - cpa).toFixed(2)} față de {cfg.prev}</span>
                        : <span className="text-red-500">+{acc.currency} {(cpa - prevCpa).toFixed(2)} față de {cfg.prev}</span>}
                    </p>
                  )}
                  {hasComparison && <p className="text-slate-400 text-[9px] mt-0.5">{cfg.prev}: {prevCpa > 0 ? `${acc.currency} ${prevCpa.toFixed(2)}` : '—'}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/60">
            {[
              { label: 'Clicks',      value: clicks > 0 ? clicks.toLocaleString() : '—',                   color: 'text-slate-800' },
              { label: 'Impresii',    value: impressions > 0 ? impressions.toLocaleString() : '—',          color: 'text-slate-800' },
              { label: 'CTR',         value: ctr > 0 ? `${ctr.toFixed(2)}%` : '—',                         color: ctr >= 3 ? 'text-green-600' : 'text-orange-500' },
              { label: 'CPC',         value: cpc > 0 ? `${acc.currency} ${cpc.toFixed(2)}` : '—',          color: 'text-slate-800' },
              { label: 'Rata Conv.',  value: convRate > 0 ? `${convRate.toFixed(2)}%` : '—',                color: convRate >= 2.5 ? 'text-green-600' : 'text-orange-500' },
              { label: 'Impr. Share', value: searchImprShare > 0 ? `${searchImprShare.toFixed(1)}%` : '—', color: searchImprShare >= 60 ? 'text-green-600' : 'text-orange-500' },
            ].map(s => (
              <div key={s.label} className="px-4 py-3">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-medium">{s.label}</p>
                <p className={`font-bold text-base mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {convCategories.length > 0 && (
            <>
              <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-2.5 border-t border-slate-100 hover:bg-slate-50 transition-colors text-left">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  Categorii conversii ({convCategories.length})
                </span>
                {open ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
              </button>
              {open && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {convCategories.map(cat => (
                    <div key={cat.name} className="flex items-center gap-4 px-5 py-3">
                      <div className="w-48 min-w-0">
                        <p className="text-slate-700 text-xs font-medium">{cat.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-semibold text-xs">{cat.conversions}</span>
                        <span className="text-slate-400 text-[10px]">conversii</span>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-slate-500 text-xs">{acc.currency} {cat.costPerConversion.toFixed(2)} / conv</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>('this_month');
  const [periodOpen, setPeriodOpen] = useState(false);

  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [mccId, setMccId] = useState('');
  const [metricsMap, setMetricsMap] = useState<Record<string, AccountMetricsData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIDDEN);
      if (saved) setHidden(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const accRes = await fetch('/api/ads/accounts');
      if (!accRes.ok) {
        const body = await accRes.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${accRes.status}`);
      }
      const accData: { accounts: { id: string; name: string; currency: string; status: string }[]; mccId: string } = await accRes.json();
      const entries: AccountEntry[] = accData.accounts.map(a => ({ ...a, mccId: accData.mccId }));
      setMccId(accData.mccId);
      setAccounts(entries);

      const metricsResults = await Promise.allSettled(
        entries.map(async acc => {
          const res = await fetch(`/api/ads/metrics?accountId=${acc.id}`);
          if (!res.ok) throw new Error(`metrics error for ${acc.id}`);
          const data: AccountMetricsData = await res.json();
          return { id: acc.id, data };
        })
      );

      const map: Record<string, AccountMetricsData> = {};
      metricsResults.forEach(r => {
        if (r.status === 'fulfilled') map[r.value.id] = r.value.data;
      });
      setMetricsMap(map);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Eroare necunoscută');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function toggleHide(id: string) {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(STORAGE_KEY_HIDDEN, JSON.stringify([...next]));
      return next;
    });
  }

  const cfg = PERIODS[period];
  const isLastMonth = period === 'last_month';
  const visible = accounts.filter(a => !hidden.has(a.id));

  const spendByCurrency = visible.reduce((acc, a) => {
    const m = metricsMap[a.id];
    if (!m) return acc;
    const spend = isLastMonth ? m.previous.spend : m.current.spend;
    acc[a.currency] = (acc[a.currency] ?? 0) + spend;
    return acc;
  }, {} as Record<string, number>);

  const totalConv = visible.reduce((s, a) => s + ((isLastMonth ? metricsMap[a.id]?.previous.conversions : metricsMap[a.id]?.current.conversions) ?? 0), 0);
  const prevConv  = visible.reduce((s, a) => s + (isLastMonth ? 0 : (metricsMap[a.id]?.previous.conversions ?? 0)), 0);

  const spendLabel = Object.entries(spendByCurrency)
    .map(([cur, val]) => `${cur} ${val.toLocaleString()}`)
    .join(' · ') || '—';

  const filtered = accounts
    .filter(a => showHidden || !hidden.has(a.id))
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Conturi MCC</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {cfg.curr} {now.getFullYear()} · {visible.length} conturi vizibile{hidden.size > 0 ? ` · ${hidden.size} ascunse` : ''}
            {mccId && <span className="ml-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">{mccId}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors disabled:opacity-50">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Reîncarcă
          </button>
          <div className="relative">
            <button onClick={() => setPeriodOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all font-medium">
              <Calendar size={14} className="text-blue-500" />
              {cfg.label}
              <ChevronDown size={13} className={`text-slate-400 transition-transform ${periodOpen ? 'rotate-180' : ''}`} />
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[180px]">
                {(Object.entries(PERIODS) as [PeriodKey, typeof PERIODS[PeriodKey]][]).map(([key, p]) => (
                  <button key={key} onClick={() => { setPeriod(key); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${period === key ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700'}`}>
                    {p.label}
                    <span className="block text-[10px] text-slate-400 font-normal">{p.curr} vs {p.prev}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          <strong>Eroare:</strong> {error}
          {error === 'not_configured' && (
            <p className="mt-1 text-xs text-red-500">Variabilele de mediu Google Ads nu sunt configurate în Vercel.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `Spend total · ${cfg.curr}`, value: loading ? '...' : spendLabel, color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: `Conversii ${cfg.curr}${!isLastMonth ? ` / ${cfg.prev}` : ''}`, value: loading ? '...' : (!isLastMonth ? `${totalConv} / ${prevConv}` : String(totalConv)), color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Conturi vizibile', value: `${visible.length} / ${accounts.length}`, color: 'bg-slate-50 border-slate-200 text-slate-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} border rounded-xl p-4`}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-70">{s.label}</p>
            <p className="font-bold text-lg">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Caută cont..."
            className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400" />
        </div>
        {hidden.size > 0 && (
          <button onClick={() => setShowHidden(v => !v)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors">
            {showHidden ? <Eye size={13} /> : <EyeOff size={13} />}
            {showHidden ? 'Ascunde' : 'Arată'} {hidden.size} cont{hidden.size !== 1 ? 'uri' : ''} ascuns{hidden.size !== 1 ? 'e' : ''}
          </button>
        )}
      </div>

      {loading && accounts.length === 0 ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Se încarcă conturile din Google Ads...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {mccId && (
            <div className="flex items-center gap-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">MCC · {mccId}</p>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          )}
          {filtered.map(acc => (
            <AccountCard
              key={acc.id}
              acc={acc}
              mccId={mccId}
              hidden={hidden.has(acc.id)}
              onToggleHide={() => toggleHide(acc.id)}
              period={period}
              metrics={metricsMap[acc.id] ?? null}
            />
          ))}
          {filtered.length === 0 && !loading && (
            <p className="text-center text-slate-400 py-10 text-sm">Niciun cont găsit.</p>
          )}
        </div>
      )}
    </div>
  );
}
