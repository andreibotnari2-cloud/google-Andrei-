'use client';
import { useState, useEffect } from 'react';
import { MCC_ACCOUNTS, ACCOUNT_METRICS } from '@/lib/demo-data';
import { Eye, EyeOff, ChevronDown, ChevronUp, Search } from 'lucide-react';

const STORAGE_KEY = 'hidden-accounts';
const PREV_MONTH = 'Martie';
const CURR_MONTH = 'Aprilie';

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 18, circ = 2 * Math.PI * r;
  const fill = Math.min(pct / 100, 1) * circ;
  return (
    <svg width={44} height={44} className="-rotate-90">
      <circle cx={22} cy={22} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={3.5} />
      <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={3.5}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function KpiBlock({
  label, curr, prev, currency, unit = '', inverse = false,
}: {
  label: string; curr: number; prev: number; currency: string; unit?: string; inverse?: boolean;
}) {
  const pct = prev > 0 ? (curr / prev) * 100 : 0;
  const remaining = prev - curr;
  const exceeded = curr >= prev;
  // for CPA lower is better (inverse)
  const isGood = inverse ? curr <= prev : curr >= prev;
  const color = exceeded ? (inverse ? (curr > prev ? '#EF4444' : '#10B981') : '#10B981') : '#3B82F6';

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <ProgressRing pct={pct} color={color} />
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/50">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p className="text-white font-bold text-sm leading-tight">
          {unit}{curr > 0 ? (Number.isInteger(curr) ? curr.toLocaleString() : curr.toFixed(0)) : '—'}
          {curr > 0 && <span className="text-white/30 text-[10px] font-normal"> {currency}</span>}
        </p>
        <p className="text-[10px] leading-tight mt-0.5">
          {exceeded ? (
            <span className="text-green-400 font-semibold">
              +{unit}{Math.abs(remaining) > 0 ? Math.abs(remaining).toLocaleString() : '0'} față de {PREV_MONTH}
            </span>
          ) : prev > 0 ? (
            <span className="text-blue-400">
              mai {unit === '' ? '' : unit}{remaining > 0 ? remaining.toLocaleString() : 0} până la {PREV_MONTH}
            </span>
          ) : (
            <span className="text-white/20">fără date</span>
          )}
        </p>
        <p className="text-white/20 text-[9px] mt-0.5">{PREV_MONTH}: {unit}{prev > 0 ? (Number.isInteger(prev) ? prev.toLocaleString() : prev.toFixed(0)) : '—'}</p>
      </div>
    </div>
  );
}

function AccountCard({
  acc, mccName, hidden, onToggleHide,
}: {
  acc: { id: string; name: string; currency: string; status: string };
  mccName: string;
  hidden: boolean;
  onToggleHide: () => void;
}) {
  const [open, setOpen] = useState(false);
  const m = ACCOUNT_METRICS[acc.id];
  if (!m) return null;

  const budgetPct = m.budgetTotal > 0 ? (m.spend / m.budgetTotal) * 100 : 0;
  const prevBudgetPct = m.budgetTotal > 0 ? (m.prevSpend / m.budgetTotal) * 100 : 0;

  return (
    <div className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-all ${hidden ? 'border-white/[0.04] opacity-50' : 'border-white/[0.07]'}`}>
      {/* Account header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${acc.status === 'active' ? 'bg-green-400' : 'bg-white/20'}`} />
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{acc.name}</p>
            <p className="text-white/30 text-[10px] mt-0.5">{acc.id} · {acc.currency} · {mccName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <div className="text-right">
            <p className="text-white/30 text-[10px]">Campanii active</p>
            <p className="text-white font-bold text-sm">{m.activeCampaigns}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onToggleHide}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-white/30 hover:text-white/60 transition-colors"
              title={hidden ? 'Arată contul' : 'Ascunde contul'}>
              {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3 locked KPIs */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.05] px-0">
        {/* BUGET */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <ProgressRing pct={budgetPct} color={budgetPct >= 95 ? '#F59E0B' : '#3B82F6'} />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/50">
                {Math.round(budgetPct)}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Buget lunar</p>
              <p className="text-white font-bold text-sm">
                {acc.currency} {m.spend > 0 ? m.spend.toLocaleString() : '—'}
              </p>
              <p className="text-[10px] mt-0.5">
                {m.spend >= m.prevSpend ? (
                  <span className="text-green-400">+{acc.currency} {(m.spend - m.prevSpend).toLocaleString()} față de {PREV_MONTH}</span>
                ) : (
                  <span className="text-blue-400">mai {acc.currency} {(m.prevSpend - m.spend).toLocaleString()} până la {PREV_MONTH}</span>
                )}
              </p>
              <p className="text-white/20 text-[9px] mt-0.5">{PREV_MONTH}: {acc.currency} {m.prevSpend.toLocaleString()} · Limită: {acc.currency} {m.budgetTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* CONVERSII */}
        <div className="px-5 py-4">
          <KpiBlock
            label="Conversii"
            curr={m.conversions}
            prev={m.prevConversions}
            currency={acc.currency}
            unit=""
          />
        </div>

        {/* COST/CONV */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <ProgressRing
                pct={m.prevCpa > 0 ? (m.cpa / m.prevCpa) * 100 : 0}
                color={m.cpa <= m.prevCpa ? '#10B981' : '#EF4444'}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/50">
                {m.prevCpa > 0 ? Math.round((m.cpa / m.prevCpa) * 100) : 0}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold mb-0.5">Cost / Conversie</p>
              <p className={`font-bold text-sm ${m.cpa > m.prevCpa ? 'text-red-400' : m.cpa > 0 ? 'text-green-400' : 'text-white/20'}`}>
                {m.cpa > 0 ? `${acc.currency} ${m.cpa.toFixed(0)}` : '—'}
              </p>
              <p className="text-[10px] mt-0.5">
                {m.cpa > 0 && m.prevCpa > 0 ? (
                  m.cpa <= m.prevCpa ? (
                    <span className="text-green-400">-{acc.currency} {(m.prevCpa - m.cpa).toFixed(0)} față de {PREV_MONTH}</span>
                  ) : (
                    <span className="text-red-400">+{acc.currency} {(m.cpa - m.prevCpa).toFixed(0)} față de {PREV_MONTH}</span>
                  )
                ) : <span className="text-white/20">fără date</span>}
              </p>
              <p className="text-white/20 text-[9px] mt-0.5">{PREV_MONTH}: {m.prevCpa > 0 ? `${acc.currency} ${m.prevCpa.toFixed(0)}` : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary metrics row */}
      <div className="flex items-center gap-6 px-5 py-3 bg-white/[0.02] border-t border-white/[0.04]">
        {[
          { label: 'Spend', value: m.spend > 0 ? `${acc.currency} ${m.spend.toLocaleString()}` : '—' },
          { label: 'Clicks', value: m.clicks > 0 ? m.clicks.toLocaleString() : '—' },
          { label: 'Impressions', value: m.impressions > 0 ? m.impressions.toLocaleString() : '—' },
          { label: 'CTR', value: m.ctr > 0 ? `${m.ctr.toFixed(2)}%` : '—' },
          { label: 'CPC', value: m.cpc > 0 ? `${acc.currency} ${m.cpc.toFixed(2)}` : '—' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-white/25 text-[9px] uppercase tracking-wider">{s.label}</p>
            <p className="text-white/60 text-xs font-semibold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Conversion categories toggle */}
      {m.convCategories.length > 0 && (
        <>
          <button
            onClick={() => setOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-2.5 border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors text-left"
          >
            <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">
              Categorii conversii ({m.convCategories.length})
            </span>
            {open ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/30" />}
          </button>

          {open && (
            <div className="border-t border-white/[0.04] divide-y divide-white/[0.03]">
              {m.convCategories.map(cat => {
                const catPct = cat.prevConversions > 0 ? (cat.conversions / cat.prevConversions) * 100 : 0;
                const exceeded = cat.conversions >= cat.prevConversions;
                return (
                  <div key={cat.name} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-36 min-w-0">
                      <p className="text-white/70 text-xs font-medium">{cat.name}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${exceeded ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(catPct, 100)}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold text-xs w-6 text-right">{cat.conversions}</span>
                      <span className="text-white/25 text-[10px] w-16">/ {cat.prevConversions} ({PREV_MONTH})</span>
                    </div>
                    <div className="text-right w-28">
                      <p className="text-white/50 text-xs">{acc.currency} {cat.cost.toFixed(0)} / conv</p>
                    </div>
                    <div className="text-right w-24">
                      {exceeded ? (
                        <span className="text-green-400 text-[10px] font-semibold">+{cat.conversions - cat.prevConversions} față de {PREV_MONTH}</span>
                      ) : (
                        <span className="text-blue-400 text-[10px]">mai {cat.prevConversions - cat.conversions} până la {PREV_MONTH}</span>
                      )}
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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHidden(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  function toggleHide(id: string) {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  const allAccounts = MCC_ACCOUNTS.flatMap(mcc =>
    mcc.accounts.map(acc => ({ ...acc, mccName: mcc.name, mccId: mcc.id }))
  );

  const visible = allAccounts.filter(a => !hidden.has(a.id));
  const totalSpend = visible.reduce((s, a) => s + (ACCOUNT_METRICS[a.id]?.spend ?? 0), 0);
  const totalConv = visible.reduce((s, a) => s + (ACCOUNT_METRICS[a.id]?.conversions ?? 0), 0);
  const prevTotalConv = visible.reduce((s, a) => s + (ACCOUNT_METRICS[a.id]?.prevConversions ?? 0), 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Conturi MCC</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {CURR_MONTH} 2026 · comparativ cu {PREV_MONTH} · {visible.length} conturi vizibile
            {hidden.size > 0 && ` · ${hidden.size} ascunse`}
          </p>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `Spend total ${CURR_MONTH}`, value: `RON ${totalSpend.toLocaleString()}` },
          { label: `Conversii ${CURR_MONTH}`, value: `${totalConv} / ${prevTotalConv} (${PREV_MONTH})` },
          { label: 'Conturi vizibile', value: `${visible.length} / ${allAccounts.length}` },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-white font-bold text-lg">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Caută cont..."
            className="w-full pl-8 pr-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50" />
        </div>
        {hidden.size > 0 && (
          <button onClick={() => setShowHidden(v => !v)}
            className="flex items-center gap-2 px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-white/50 hover:text-white/80 transition-colors">
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
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{mcc.name}</p>
              <span className="text-white/20 text-xs">{mcc.customerId}</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            {mccAccounts.map(acc => (
              <AccountCard
                key={acc.id}
                acc={acc}
                mccName={mcc.name}
                hidden={hidden.has(acc.id)}
                onToggleHide={() => toggleHide(acc.id)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
