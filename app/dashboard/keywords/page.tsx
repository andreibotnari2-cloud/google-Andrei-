'use client';
import { useState, useMemo } from 'react';
import { KEYWORDS } from '@/lib/demo-data';
import { AlertTriangle, TrendingDown, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type SortKey = 'keyword' | 'qualityScore' | 'clicks' | 'ctr' | 'cpc' | 'conversions' | 'cpa' | 'spend';
type SortDir = 'asc' | 'desc';

const MATCH_COLORS: Record<string, string> = {
  EXACT: 'bg-blue-500/15 text-blue-400',
  PHRASE: 'bg-purple-500/15 text-purple-400',
  BROAD: 'bg-orange-500/15 text-orange-400',
};

function qsColor(qs: number) {
  if (qs >= 7) return 'text-green-400';
  if (qs >= 5) return 'text-yellow-400';
  return 'text-red-400';
}

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-white/20" />;
  return dir === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />;
}

export default function KeywordsPage() {
  const [search, setSearch] = useState('');
  const [matchFilter, setMatchFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('spend');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const wastedSpend = KEYWORDS.filter(k => k.qualityScore <= 4).reduce((s, k) => s + k.spend, 0);
  const lowQsCount = KEYWORDS.filter(k => k.qualityScore < 5).length;

  const filtered = useMemo(() => {
    let list = KEYWORDS.filter(k => {
      if (matchFilter !== 'ALL' && k.matchType !== matchFilter) return false;
      if (search && !k.keyword.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (sortKey === 'keyword') {
        return sortDir === 'asc'
          ? (av as string).localeCompare(bv as string)
          : (bv as string).localeCompare(av as string);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [search, matchFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const Th = ({ label, col }: { label: string; col: SortKey }) => (
    <th onClick={() => toggleSort(col)}
      className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none whitespace-nowrap">
      <span className="flex items-center gap-1">{label}<SortIcon col={col} sortKey={sortKey} dir={sortDir} /></span>
    </th>
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Keywords</h1>
        <p className="text-slate-400 text-sm mt-0.5">{filtered.length} keywords · Aprilie 2026</p>
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-semibold text-sm">Spend risipit</p>
            <p className="text-slate-500 text-xs mt-0.5">RON {wastedSpend.toFixed(0)} cheltuiți pe keywords cu QS ≤ 4 luna aceasta</p>
          </div>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
          <TrendingDown size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">Quality Score scăzut</p>
            <p className="text-slate-500 text-xs mt-0.5">{lowQsCount} keywords cu QS sub 5 — afectează CPC și poziția anunțului</p>
          </div>
        </div>
      </div>

      {/* QS Distribution */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-white font-semibold mb-4">Distribuție Quality Score</p>
        <div className="flex items-end gap-2 h-20">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(score => {
            const count = KEYWORDS.filter(k => k.qualityScore === score).length;
            const maxCount = Math.max(...Array.from({ length: 10 }, (_, i) => KEYWORDS.filter(k => k.qualityScore === i + 1).length));
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={score} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-slate-400 text-[9px]">{count > 0 ? count : ''}</span>
                <div className="w-full rounded-t-sm transition-all" style={{
                  height: `${Math.max(height, count > 0 ? 8 : 0)}%`,
                  background: score >= 7 ? '#10B981' : score >= 5 ? '#F59E0B' : '#EF4444',
                  opacity: count === 0 ? 0.15 : 1,
                }} />
                <span className="text-slate-400 text-[9px]">{score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Caută keyword..."
            className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 w-56" />
        </div>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
          {['ALL', 'EXACT', 'PHRASE', 'BROAD'].map(m => (
            <button key={m} onClick={() => setMatchFilter(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${matchFilter === m ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              {m === 'ALL' ? 'Toate' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr>
                <Th label="Keyword" col="keyword" />
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Match</th>
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Campanie</th>
                <Th label="QS" col="qualityScore" />
                <Th label="Clicks" col="clicks" />
                <Th label="CTR" col="ctr" />
                <Th label="CPC" col="cpc" />
                <Th label="Conv." col="conversions" />
                <Th label="CPA" col="cpa" />
                <Th label="Spend" col="spend" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((k, i) => (
                <tr key={k.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-3.5">
                    <span className="text-white text-sm font-mono">{k.keyword}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${MATCH_COLORS[k.matchType] || ''}`}>{k.matchType}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs max-w-[180px] truncate">{k.campaignName}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, qi) => (
                          <div key={qi} className={`w-1 h-3 rounded-sm ${qi < k.qualityScore ? (k.qualityScore >= 7 ? 'bg-green-500' : k.qualityScore >= 5 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-slate-100'}`} />
                        ))}
                      </div>
                      <span className={`text-sm font-bold ${qsColor(k.qualityScore)}`}>{k.qualityScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 text-sm">{k.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-sm">{k.ctr.toFixed(2)}%</td>
                  <td className="px-4 py-3.5 text-slate-600 text-sm">RON {k.cpc.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-sm">{k.conversions}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold ${k.cpa > 50 ? 'text-red-400' : k.cpa > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                      RON {k.cpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold ${k.qualityScore <= 4 ? 'text-red-400' : 'text-slate-600'}`}>
                      RON {k.spend.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
