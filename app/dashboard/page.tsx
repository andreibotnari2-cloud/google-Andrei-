'use client';
import { useState, useEffect } from 'react';
import { MCC_ACCOUNTS, ACCOUNT_METRICS } from '@/lib/demo-data';
import { Eye, EyeOff, ChevronDown, ChevronUp, Search, Pencil, Check, X } from 'lucide-react';

const STORAGE_KEY_HIDDEN = 'hidden-accounts';
const STORAGE_KEY_BUDGETS = 'account-budgets';
const PREV_MONTH = 'Martie';
const CURR_MONTH = 'Aprilie';

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
  acc, mccName, hidden, onToggleHide,
}: {
  acc: { id: string; name: string; currency: string; status: string; paymentStatus: string };
  mccName: string;
  hidden: boolean;
  onToggleHide: () => void;
}) {
  const [open, setOpen] = useState(false);
  const m = ACCOUNT_METRICS[acc.id];
  if (!m) return null;

  const budgetPct = m.budgetTotal > 0 ? (m.spend / m.budgetTotal) * 100 : 0;
  const isPaid = acc.paymentStatus === 'paid';

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${hidden ? 'opacity-50 border-slate-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>

      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Status dot */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${acc.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />

          {/* Name + ID */}
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold text-sm truncate">{acc.name}</p>
            <p className="text-slate-400 text-[10px]">{acc.id} · {acc.currency} · {mccName}</p>
          </div>

          {/* Payment status badge */}
          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {isPaid ? '✓ Achitat' : '✕ Stopat'}
          </span>

          {/* Account status badge */}
          {acc.status === 'paused' && (
            <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              Paused
            </span>
          )}
        </div>

        <div className="flex items-center gap-5 ml-4 flex-shrink-0">
          {/* Campanii active */}
          <div className="text-right">
            <p className="text-slate-400 text-[10px]">Campanii</p>
            <p className="text-slate-800 font-bold text-sm">{m.activeCampaigns}</p>
          </div>

          {/* Buget lunar editabil */}
          <div className="text-right">
            <p className="text-slate-400 text-[10px] mb-0.5">Buget lunar</p>
            <BudgetEditor accountId={acc.id} currency={acc.currency} defaultBudget={m.budgetTotal} />
          </div>

          {/* Hide toggle */}
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
                {acc.currency} {m.spend > 0 ? m.spend.toLocaleString() : '—'}
              </p>
              <p className="text-[10px] mt-0.5">
                {m.spend >= m.prevSpend
                  ? <span className="text-green-600 font-medium">+{acc.currency} {(m.spend - m.prevSpend).toLocaleString()} față de {PREV_MONTH}</span>
                  : <span className="text-blue-600">mai {acc.currency} {(m.prevSpend - m.spend).toLocaleString()} până la {PREV_MONTH}</span>
                }
              </p>
              <p className="text-slate-400 text-[9px] mt-0.5">{PREV_MONTH}: {acc.currency} {m.prevSpend.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* CONVERSII */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <ProgressRing
                pct={m.prevConversions > 0 ? (m.conversions / m.prevConversions) * 100 : 0}
                color={m.conversions >= m.prevConversions ? '#10B981' : '#2563EB'}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">
                {m.prevConversions > 0 ? Math.round((m.conversions / m.prevConversions) * 100) : 0}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Conversii</p>
              <p className="text-slate-900 font-bold text-sm">{m.conversions > 0 ? m.conversions : '—'}</p>
              <p className="text-[10px] mt-0.5">
                {m.conversions >= m.prevConversions
                  ? <span className="text-green-600 font-medium">+{m.conversions - m.prevConversions} față de {PREV_MONTH}</span>
                  : <span className="text-blue-600">mai {m.prevConversions - m.conversions} până la {PREV_MONTH}</span>
                }
              </p>
              <p className="text-slate-400 text-[9px] mt-0.5">{PREV_MONTH}: {m.prevConversions}</p>
            </div>
          </div>
        </div>

        {/* COST/CONV */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <ProgressRing
                pct={m.prevCpa > 0 ? (m.cpa / m.prevCpa) * 100 : 0}
                color={m.cpa <= m.prevCpa ? '#10B981' : '#EF4444'}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-500">
                {m.prevCpa > 0 ? Math.round((m.cpa / m.prevCpa) * 100) : 0}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Cost / Conversie</p>
              <p className={`font-bold text-sm ${m.cpa > m.prevCpa ? 'text-red-500' : m.cpa > 0 ? 'text-green-600' : 'text-slate-300'}`}>
                {m.cpa > 0 ? `${acc.currency} ${m.cpa.toFixed(0)}` : '—'}
              </p>
              <p className="text-[10px] mt-0.5">
                {m.cpa > 0 && m.prevCpa > 0
                  ? m.cpa <= m.prevCpa
                    ? <span className="text-green-600 font-medium">-{acc.currency} {(m.prevCpa - m.cpa).toFixed(0)} față de {PREV_MONTH}</span>
                    : <span className="text-red-500">+{acc.currency} {(m.cpa - m.prevCpa).toFixed(0)} față de {PREV_MONTH}</span>
                  : <span className="text-slate-300">fără date</span>
                }
              </p>
              <p className="text-slate-400 text-[9px] mt-0.5">{PREV_MONTH}: {m.prevCpa > 0 ? `${acc.currency} ${m.prevCpa.toFixed(0)}` : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="flex items-center gap-6 px-5 py-2.5 bg-slate-50 border-t border-slate-100">
        {[
          { label: 'Clicks', value: m.clicks > 0 ? m.clicks.toLocaleString() : '—' },
          { label: 'Impressions', value: m.impressions > 0 ? m.impressions.toLocaleString() : '—' },
          { label: 'CTR', value: m.ctr > 0 ? `${m.ctr.toFixed(2)}%` : '—' },
          { label: 'CPC', value: m.cpc > 0 ? `${acc.currency} ${m.cpc.toFixed(2)}` : '—' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-slate-400 text-[9px] uppercase tracking-wider">{s.label}</p>
            <p className="text-slate-600 text-xs font-semibold mt-0.5">{s.value}</p>
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
                      <span className="text-slate-400 text-[10px] w-20">/ {cat.prevConversions} ({PREV_MONTH})</span>
                    </div>
                    <div className="text-right w-28">
                      <p className="text-slate-500 text-xs">{acc.currency} {cat.cost.toFixed(0)} / conv</p>
                    </div>
                    <div className="text-right w-28">
                      {exceeded
                        ? <span className="text-green-600 text-[10px] font-semibold">+{cat.conversions - cat.prevConversions} față de {PREV_MONTH}</span>
                        : <span className="text-blue-600 text-[10px]">mai {cat.prevConversions - cat.conversions} până la {PREV_MONTH}</span>
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

  const allAccounts = MCC_ACCOUNTS.flatMap(mcc =>
    mcc.accounts.map(acc => ({ ...acc, mccName: mcc.name, mccId: mcc.id }))
  );
  const visible = allAccounts.filter(a => !hidden.has(a.id));
  const totalSpend = visible.reduce((s, a) => s + (ACCOUNT_METRICS[a.id]?.spend ?? 0), 0);
  const totalConv = visible.reduce((s, a) => s + (ACCOUNT_METRICS[a.id]?.conversions ?? 0), 0);
  const prevConv = visible.reduce((s, a) => s + (ACCOUNT_METRICS[a.id]?.prevConversions ?? 0), 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Conturi MCC</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {CURR_MONTH} 2026 · comparativ cu {PREV_MONTH} · {visible.length} conturi vizibile
            {hidden.size > 0 && ` · ${hidden.size} ascunse`}
          </p>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `Spend total ${CURR_MONTH}`, value: `RON ${totalSpend.toLocaleString()}`, color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: `Conversii ${CURR_MONTH} / ${PREV_MONTH}`, value: `${totalConv} / ${prevConv}`, color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Conturi vizibile', value: `${visible.length} / ${allAccounts.length}`, color: 'bg-slate-50 border-slate-200 text-slate-600' },
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
                hidden={hidden.has(acc.id)} onToggleHide={() => toggleHide(acc.id)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
