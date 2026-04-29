'use client';
import { useState, useEffect } from 'react';
import { MCC_ACCOUNTS, ACCOUNT_METRICS } from '@/lib/demo-data';
import { Eye, EyeOff, ChevronDown, ChevronUp, Search, Pencil, Check, X, Calendar } from 'lucide-react';

const STORAGE_KEY_HIDDEN = 'hidden-accounts';
const STORAGE_KEY_BUDGETS = 'account-budgets';

type PeriodKey = 'this_month' | 'last_month';

const PERIODS: Record<PeriodKey, { label: string; curr: string; prev: string }> = {
  this_month: { label: 'Această lună', curr: 'Aprilie', prev: 'Martie' },
  last_month: { label: 'Luna trecută', curr: 'Martie',  prev: 'Februarie' },
};

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

function BudgetEditor({ accountId, currency, defaultBudget }: { accountId: string; currency: string; defaultBudget: number }) {
  const storageKey = `${STORAGE_KEY_BUDGETS}-${accountId}`;
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(defaultBudget);
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
      <span className="font-semibold">{currency} {saved.toLocaleString()}</span>
      <Pencil size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function AccountCard({
  acc, mccName, hidden, onToggleHide, period,
}: {
  acc: { id: string; name: string; currency: string; status: string; paymentStatus: string };
  mccName: string;
  hidden: boolean;
  onToggleHide: () => void;
  period: PeriodKey;
}) {
  const [open, setOpen] = useState(false);
  const m = ACCOUNT_METRICS[acc.id];
  if (!m) return null;

  const cfg = PERIODS[period];
  const isLastMonth = period === 'last_month';

  // Current period values
  const spend       = isLastMonth ? m.prevSpend      : m.spend;
  const conversions = isLastMonth ? m.prevConversions : m.conversions;
  const cpa         = isLastMonth ? m.prevCpa         : m.cpa;
  // Previous period values (for comparison)
  const prevSpend       = isLastMonth ? 0 : m.prevSpend;
  const prevConversions = isLastMonth ? 0 : m.prevConversions;
  const prevCpa         = isLastMonth ? 0 : m.prevCpa;
  const hasComparison   = !isLastMonth;

  const budgetPct = m.budgetTotal > 0 ? (spend / m.budgetTotal) * 100 : 0;
  const isPaid = acc.paymentStatus === 'paid';

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${hidden ? 'opacity-50 border-slate-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>

      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${acc.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold text-sm truncate">{acc.name}</p>
            <p className="text-slate-400 text-[10px]">{acc.id} · {acc.currency} · {mccName}</p>
          </div>
          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {isPaid ? '✓ Achitat' : '✕ Stopat'}
          </span>
          {acc.status === 'paused' && (
            <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Paused</span>
          )}
        </div>

        <div className="flex items-center gap-5 ml-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-slate-400 text-[10px]">Campanii</p>
            <p className="text-slate-800 font-bold text-sm">{m.activeCampaigns}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] mb-0.5">Buget lunar</p>
            <BudgetEditor accountId={acc.id} currency={acc.currency} defaultBudget={m.budgetTotal} />
          </div>
          <button onClick={onToggleHide}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={hidden ? 'Arată contul' : 'Ascunde contul'}>
            {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
      </div>

      {/* 3 locked KPIs */}
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
                    : <span className="text-blue-600">mai {acc.currency} {(prevSpend - spend).toLocaleString()} până la {cfg.prev}</span>
                  }
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
                    : <span className="text-blue-600">mai {prevConversions - conversions} până la {cfg.prev}</span>
                  }
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
                    : <span className="text-red-500">+{acc.currency} {(cpa - prevCpa).toFixed(2)} față de {cfg.prev}</span>
                  }
                </p>
              )}
              {hasComparison && <p className="text-slate-400 text-[9px] mt-0.5">{cfg.prev}: {prevCpa > 0 ? `${acc.currency} ${prevCpa.toFixed(2)}` : '—'}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-7 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/60">
        {[
          { label: 'Clicks',      value: m.clicks > 0 ? m.clicks.toLocaleString() : '—',                sub: null,                                                                       color: 'text-slate-800' },
          { label: 'Impresii',    value: m.impressions > 0 ? m.impressions.toLocaleString() : '—',       sub: null,                                                                       color: 'text-slate-800' },
          { label: 'CTR',         value: m.ctr > 0 ? `${m.ctr.toFixed(2)}%` : '—',                      sub: m.ctr >= 3 ? 'Bun' : m.ctr > 0 ? 'Scăzut' : null,                          color: m.ctr >= 3 ? 'text-green-600' : 'text-orange-500' },
          { label: 'CPC',         value: m.cpc > 0 ? `${acc.currency} ${m.cpc.toFixed(2)}` : '—',       sub: null,                                                                       color: 'text-slate-800' },
          { label: 'Rata Conv.',  value: m.convRate > 0 ? `${m.convRate.toFixed(2)}%` : '—',             sub: m.convRate >= 2.5 ? 'Bun' : m.convRate > 0 ? 'Mediu' : null,               color: m.convRate >= 2.5 ? 'text-green-600' : 'text-orange-500' },
          { label: 'Impr. Share', value: m.searchImprShare > 0 ? `${m.searchImprShare.toFixed(1)}%` : '—', sub: m.searchImprShare >= 60 ? 'Bun' : m.searchImprShare > 0 ? 'Pierderi' : null, color: m.searchImprShare >= 60 ? 'text-green-600' : 'text-orange-500' },
          { label: 'Poz. medie',  value: m.avgPosition > 0 ? m.avgPosition.toFixed(1) : '—',            sub: m.avgPosition > 0 && m.avgPosition <= 2 ? 'Top' : m.avgPosition > 0 ? 'Mediu' : null, color: m.avgPosition > 0 && m.avgPosition <= 2 ? 'text-green-600' : 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="px-4 py-3">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-medium">{s.label}</p>
            <p className={`font-bold text-base mt-0.5 ${s.color}`}>{s.value}</p>
            {s.sub && <p className={`text-[10px] mt-0.5 font-medium ${s.color} opacity-70`}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Conversion categories */}
      {m.convCategories.length > 0 && (
        <>
          <button onClick={() => setOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-2.5 border-t border-slate-100 hover:bg-slate-50 transition-colors text-left">
            <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              Categorii conversii ({m.convCategories.length})
            </span>
            {open ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
          </button>
          {open && (
            <div className="border-t border-slate-100 divide-y divide-slate-50">
              {m.convCategories.map(cat => {
                const catPct = cat.prevConversions > 0 ? (cat.conversions / cat.prevConversions) * 100 : 0;
                const exceeded = cat.conversions >= cat.prevConversions;
                return (
                  <div key={cat.name} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-36 min-w-0">
                      <p className="text-slate-700 text-xs font-medium">{cat.name}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${exceeded ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(catPct, 100)}%` }} />
                      </div>
                      <span className="text-slate-800 font-semibold text-xs w-6 text-right">{cat.conversions}</span>
                      <span className="text-slate-400 text-[10px] w-20">/ {cat.prevConversions} ({PERIODS.this_month.prev})</span>
                    </div>
                    <div className="text-right w-28">
                      <p className="text-slate-500 text-xs">{acc.currency} {cat.cost.toFixed(2)} / conv</p>
                    </div>
                    <div className="text-right w-28">
                      {exceeded
                        ? <span className="text-green-600 text-[10px] font-semibold">+{cat.conversions - cat.prevConversions} față de {PERIODS.this_month.prev}</span>
                        : <span className="text-blue-600 text-[10px]">mai {cat.prevConversions - cat.conversions} până la {PERIODS.this_month.prev}</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIDDEN);
      if (saved) setHidden(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

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

  const allAccounts = MCC_ACCOUNTS.flatMap(mcc =>
    mcc.accounts.map(acc => ({ ...acc, mccName: mcc.name, mccId: mcc.id }))
  );
  const visible = allAccounts.filter(a => !hidden.has(a.id));

  // Group spend totals by currency
  const spendByCurrency = visible.reduce((acc, a) => {
    const m = ACCOUNT_METRICS[a.id];
    if (!m) return acc;
    const spend = isLastMonth ? m.prevSpend : m.spend;
    acc[a.currency] = (acc[a.currency] ?? 0) + spend;
    return acc;
  }, {} as Record<string, number>);

  const totalConv = visible.reduce((s, a) => s + (isLastMonth ? ACCOUNT_METRICS[a.id]?.prevConversions ?? 0 : ACCOUNT_METRICS[a.id]?.conversions ?? 0), 0);
  const prevConv  = visible.reduce((s, a) => s + (isLastMonth ? 0 : ACCOUNT_METRICS[a.id]?.prevConversions ?? 0), 0);

  const spendLabel = Object.entries(spendByCurrency)
    .map(([cur, val]) => `${cur} ${val.toLocaleString()}`)
    .join(' · ');

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Conturi MCC</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {cfg.curr} 2026 · {visible.length} conturi vizibile{hidden.size > 0 ? ` · ${hidden.size} ascunse` : ''}
          </p>
        </div>

        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setPeriodOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all font-medium"
          >
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

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `Spend total · ${cfg.curr}`, value: spendLabel || '—',         color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: `Conversii ${cfg.curr}${!isLastMonth ? ` / ${cfg.prev}` : ''}`, value: !isLastMonth ? `${totalConv} / ${prevConv}` : String(totalConv), color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Conturi vizibile',          value: `${visible.length} / ${allAccounts.length}`, color: 'bg-slate-50 border-slate-200 text-slate-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} border rounded-xl p-4`}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-70">{s.label}</p>
            <p className="font-bold text-lg">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
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

      {/* Accounts grouped by MCC */}
      {MCC_ACCOUNTS.map(mcc => {
        const mccAccounts = allAccounts
          .filter(a => a.mccId === mcc.id)
          .filter(a => showHidden || !hidden.has(a.id))
          .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));
        if (mccAccounts.length === 0) return null;
        return (
          <div key={mcc.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{mcc.name}</p>
              <span className="text-slate-300 text-xs">{mcc.customerId}</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            {mccAccounts.map(acc => (
              <AccountCard key={acc.id} acc={acc} mccName={mcc.name}
                hidden={hidden.has(acc.id)} onToggleHide={() => toggleHide(acc.id)}
                period={period} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
