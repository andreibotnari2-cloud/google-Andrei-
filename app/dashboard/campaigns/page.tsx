'use client';
import { useState, useMemo } from 'react';
import { CAMPAIGNS } from '@/lib/demo-data';
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter, Search } from 'lucide-react';

type SortKey = 'name' | 'spend' | 'clicks' | 'conversions' | 'cpa' | 'roas' | 'ctr' | 'qualityScore';
type SortDir = 'asc' | 'desc';

const TYPE_LABELS: Record<string, string> = {
  SEARCH: 'Search', DISPLAY: 'Display', SHOPPING: 'Shopping',
  VIDEO: 'Video', PERFORMANCE_MAX: 'Perf Max',
};
const TYPE_COLORS: Record<string, string> = {
  SEARCH: 'bg-blue-500/15 text-blue-400',
  DISPLAY: 'bg-purple-500/15 text-purple-400',
  SHOPPING: 'bg-orange-500/15 text-orange-400',
  VIDEO: 'bg-red-500/15 text-red-400',
  PERFORMANCE_MAX: 'bg-teal-500/15 text-teal-400',
};

function roasColor(roas: number) {
  if (roas === 0) return 'text-white/30';
  if (roas >= 4) return 'text-green-400';
  if (roas >= 2) return 'text-yellow-400';
  return 'text-red-400';
}

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-white/20" />;
  return dir === 'asc' ? <ChevronUp size={13} className="text-blue-400" /> : <ChevronDown size={13} className="text-blue-400" />;
}

export default function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ENABLED' | 'PAUSED'>('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('spend');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const allTypes = ['ALL', ...Array.from(new Set(CAMPAIGNS.map(c => c.type)))];

  const sorted = useMemo(() => {
    let list = CAMPAIGNS.filter(c => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && c.type !== typeFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? -1;
      const bv = b[sortKey] ?? -1;
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [search, statusFilter, typeFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const Th = ({ label, col }: { label: string; col: SortKey }) => (
    <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-white/70 select-none whitespace-nowrap"
      onClick={() => toggleSort(col)}>
      <span className="flex items-center gap-1">{label}<SortIcon col={col} sortKey={sortKey} dir={sortDir} /></span>
    </th>
  );

  const totalSpend = sorted.reduce((s, c) => s + c.spend, 0);
  const totalConversions = sorted.reduce((s, c) => s + c.conversions, 0);
  const totalClicks = sorted.reduce((s, c) => s + c.clicks, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Campanii</h1>
          <p className="text-white/40 text-sm mt-0.5">{sorted.length} campanii · Aprilie 2026</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Spend', value: `RON ${totalSpend.toLocaleString()}` },
          { label: 'Total Clicks', value: totalClicks.toLocaleString() },
          { label: 'Total Conversii', value: totalConversions.toString() },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-white font-bold text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Caută campanie..."
            className="pl-8 pr-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 w-56" />
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-lg p-1">
          {(['ALL', 'ENABLED', 'PAUSED'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {s === 'ALL' ? 'Toate' : s === 'ENABLED' ? 'Active' : 'Paused'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-white/30" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-blue-500/50">
            {allTypes.map(t => <option key={t} value={t} className="bg-[#1A1D27]">{t === 'ALL' ? 'Toate tipurile' : TYPE_LABELS[t] || t}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/[0.06]">
              <tr>
                <Th label="Campanie" col="name" />
                <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Tip</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Status</th>
                <Th label="Buget" col="spend" />
                <Th label="Spend" col="spend" />
                <Th label="Clicks" col="clicks" />
                <Th label="CTR" col="ctr" />
                <Th label="Conv." col="conversions" />
                <Th label="CPA" col="cpa" />
                <Th label="ROAS" col="roas" />
                <Th label="QS" col="qualityScore" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const budgetPct = c.budget > 0 ? Math.min((c.spend / c.budget) * 100, 100) : 0;
                return (
                  <tr key={c.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-white text-sm font-medium">{c.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">{c.account}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[c.type] || 'bg-white/10 text-white/50'}`}>
                        {TYPE_LABELS[c.type] || c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${c.status === 'ENABLED' ? 'text-green-400' : 'text-white/30'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ENABLED' ? 'bg-green-400' : 'bg-white/20'}`} />
                        {c.status === 'ENABLED' ? 'Activ' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="min-w-[80px]">
                        <p className="text-white/60 text-xs mb-1">RON {c.budget}</p>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden w-16">
                          <div className={`h-full rounded-full ${budgetPct >= 100 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${budgetPct}%` }} />
                        </div>
                        <p className="text-white/30 text-[10px] mt-0.5">{budgetPct.toFixed(0)}% folosit</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-white text-sm font-semibold">
                      {c.spend > 0 ? `RON ${c.spend.toLocaleString()}` : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-white/70 text-sm">{c.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-white/70 text-sm">{c.ctr.toFixed(2)}%</td>
                    <td className="px-4 py-3.5 text-white/70 text-sm">{c.conversions}</td>
                    <td className="px-4 py-3.5 text-white/70 text-sm">
                      {c.cpa > 0 ? `RON ${c.cpa.toFixed(2)}` : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-bold text-sm ${roasColor(c.roas)}`}>
                        {c.roas > 0 ? `${c.roas}x` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {c.qualityScore !== null ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 10 }).map((_, qi) => (
                              <div key={qi} className={`w-1 h-3 rounded-sm ${qi < c.qualityScore! ? (c.qualityScore! >= 7 ? 'bg-green-500' : c.qualityScore! >= 5 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-white/[0.08]'}`} />
                            ))}
                          </div>
                          <span className={`text-xs font-bold ${c.qualityScore >= 7 ? 'text-green-400' : c.qualityScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {c.qualityScore}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white/20 text-xs">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">Nicio campanie găsită</div>
        )}
      </div>
    </div>
  );
}
