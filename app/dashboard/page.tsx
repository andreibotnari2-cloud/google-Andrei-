'use client';
import { useState, useEffect } from 'react';
import { MCC_ACCOUNTS, ACCOUNT_METRICS } from '@/lib/demo-data';
import { Eye, EyeOff, TrendingUp, TrendingDown, ChevronRight, Search } from 'lucide-react';

const STORAGE_KEY = 'hidden-accounts';

function roasColor(roas: number) {
  if (roas === 0) return 'text-white/20';
  if (roas >= 4) return 'text-green-400';
  if (roas >= 2.5) return 'text-yellow-400';
  return 'text-red-400';
}

function roasBg(roas: number) {
  if (roas === 0) return 'bg-white/[0.04]';
  if (roas >= 4) return 'bg-green-500/10';
  if (roas >= 2.5) return 'bg-yellow-500/10';
  return 'bg-red-500/10';
}

function BudgetBar({ spend, budget }: { spend: number; budget: number }) {
  const pct = budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-white/30 mb-1">
        <span>{pct.toFixed(0)}% din buget</span>
        <span>{budget.toLocaleString()}</span>
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 95 ? 'bg-orange-500' : 'bg-blue-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
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

  const filtered = allAccounts.filter(acc => {
    if (!showHidden && hidden.has(acc.id)) return false;
    if (search && !acc.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const visible = allAccounts.filter(acc => !hidden.has(acc.id));
  const totalSpend = visible.reduce((s, acc) => s + (ACCOUNT_METRICS[acc.id]?.spend ?? 0), 0);
  const totalConversions = visible.reduce((s, acc) => s + (ACCOUNT_METRICS[acc.id]?.conversions ?? 0), 0);
  const totalClicks = visible.reduce((s, acc) => s + (ACCOUNT_METRICS[acc.id]?.clicks ?? 0), 0);
  const avgRoas = visible.length > 0
    ? visible.reduce((s, acc) => s + (ACCOUNT_METRICS[acc.id]?.roas ?? 0), 0) / visible.filter(a => (ACCOUNT_METRICS[a.id]?.roas ?? 0) > 0).length
    : 0;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Conturi MCC</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {visible.length} conturi active · {hidden.size > 0 && `${hidden.size} ascunse`} · Aprilie 2026
          </p>
        </div>
      </div>

      {/* Totals row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Spend', value: `RON ${totalSpend.toLocaleString()}`, sub: `${visible.length} conturi vizibile` },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), sub: 'toate conturile' },
          { label: 'Total Conversii', value: totalConversions.toString(), sub: 'toate conturile' },
          { label: 'ROAS Mediu', value: avgRoas > 0 ? `${avgRoas.toFixed(1)}x` : '—', sub: 'conturi cu date' },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-white/25 text-[10px] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Caută cont..."
            className="w-full pl-8 pr-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        {hidden.size > 0 && (
          <button
            onClick={() => setShowHidden(v => !v)}
            className="flex items-center gap-2 px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            {showHidden ? <Eye size={13} /> : <EyeOff size={13} />}
            {showHidden ? 'Ascunde' : `Arată`} {hidden.size} cont{hidden.size !== 1 ? 'uri' : ''} ascuns{hidden.size !== 1 ? 'e' : ''}
          </button>
        )}
      </div>

      {/* Accounts per MCC */}
      {MCC_ACCOUNTS.map(mcc => {
        const mccAccounts = filtered.filter(a => a.mccId === mcc.id);
        if (mccAccounts.length === 0) return null;
        return (
          <div key={mcc.id} className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{mcc.name}</p>
              <span className="text-white/20 text-xs">{mcc.customerId}</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/[0.05]">
                  <tr>
                    <th className="text-left px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Cont</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Spend</th>
                    <th className="text-right px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Clicks</th>
                    <th className="text-right px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Conv.</th>
                    <th className="text-right px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">CPA</th>
                    <th className="text-right px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">ROAS</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Buget folosit</th>
                    <th className="px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-wider">Camp.</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {mccAccounts.map((acc, i) => {
                    const m = ACCOUNT_METRICS[acc.id];
                    const isHidden = hidden.has(acc.id);
                    return (
                      <tr
                        key={acc.id}
                        className={`border-b border-white/[0.03] transition-colors
                          ${isHidden ? 'opacity-40' : 'hover:bg-white/[0.02]'}
                          ${i % 2 === 1 ? 'bg-white/[0.01]' : ''}`}
                      >
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-white text-sm font-medium">{acc.name}</p>
                            <p className="text-white/30 text-[10px] mt-0.5">{acc.id} · {acc.currency}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold w-fit ${acc.status === 'active' ? 'text-green-400' : 'text-white/30'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'active' ? 'bg-green-400' : 'bg-white/20'}`} />
                            {acc.status === 'active' ? 'Activ' : 'Paused'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-white font-semibold text-sm">
                            {m.spend > 0 ? `${acc.currency} ${m.spend.toLocaleString()}` : <span className="text-white/20">—</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-white/60 text-sm">{m.clicks > 0 ? m.clicks.toLocaleString() : '—'}</td>
                        <td className="px-4 py-3.5 text-right text-white/60 text-sm">{m.conversions > 0 ? m.conversions : '—'}</td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-sm font-semibold ${m.cpa > 90 ? 'text-red-400' : m.cpa > 0 ? 'text-white/70' : 'text-white/20'}`}>
                            {m.cpa > 0 ? `${acc.currency} ${m.cpa.toFixed(0)}` : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${roasBg(m.roas)} ${roasColor(m.roas)}`}>
                            {m.roas > 0 ? `${m.roas}x` : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 min-w-[140px]">
                          <BudgetBar spend={m.spend} budget={m.budgetTotal} />
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-xs font-semibold ${m.activeCampaigns > 0 ? 'text-white/60' : 'text-white/20'}`}>
                            {m.activeCampaigns}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleHide(acc.id)}
                              title={isHidden ? 'Arată contul' : 'Ascunde contul'}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-white/30 hover:text-white/70 transition-colors"
                            >
                              {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-white/30 hover:text-white/70 transition-colors">
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
