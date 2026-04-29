'use client';
import { OVERVIEW_METRICS, DAILY_PERFORMANCE, DEVICE_DATA, HOURLY_DATA, CAMPAIGNS } from '@/lib/demo-data';
import KPICard from '@/components/KPICard';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Calendar, RefreshCw, Download } from 'lucide-react';

const pct = (a: number, b: number) => ((a - b) / b) * 100;
const m = OVERVIEW_METRICS;

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

export default function Dashboard() {
  const topCampaigns = [...CAMPAIGNS].sort((a, b) => b.spend - a.spend).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Overview Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Aprilie 2026 · Toate conturile</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg text-sm text-white/70 transition-colors">
            <Calendar size={14} /> Apr 1 – Apr 29
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg text-sm text-white/70 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-semibold transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <KPICard label="Cheltuieli" value={m.thisMonth.spend.toLocaleString()} prev={m.lastMonth.spend.toLocaleString()} change={pct(m.thisMonth.spend, m.lastMonth.spend)} prefix="RON " color="blue" />
        <KPICard label="Click-uri" value={m.thisMonth.clicks.toLocaleString()} prev={m.lastMonth.clicks.toLocaleString()} change={pct(m.thisMonth.clicks, m.lastMonth.clicks)} color="teal" />
        <KPICard label="Conversii" value={m.thisMonth.conversions.toString()} prev={m.lastMonth.conversions.toString()} change={pct(m.thisMonth.conversions, m.lastMonth.conversions)} color="green" />
        <KPICard label="CPA" value={m.thisMonth.cpa.toFixed(2)} prev={m.lastMonth.cpa.toFixed(2)} change={-pct(m.thisMonth.cpa, m.lastMonth.cpa)} prefix="RON " color="purple" />
        <KPICard label="ROAS" value={m.thisMonth.roas.toFixed(1)} prev={m.lastMonth.roas.toFixed(1)} change={pct(m.thisMonth.roas, m.lastMonth.roas)} suffix="x" color="orange" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">CTR</div>
          <div>
            <p className="text-white font-bold text-lg">{m.thisMonth.ctr.toFixed(2)}%</p>
            <p className="text-white/40 text-xs">Click-Through Rate</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-sm">CPC</div>
          <div>
            <p className="text-white font-bold text-lg">RON {m.thisMonth.cpc.toFixed(2)}</p>
            <p className="text-white/40 text-xs">Cost Per Click</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-sm">CVR</div>
          <div>
            <p className="text-white font-bold text-lg">{m.thisMonth.convRate.toFixed(2)}%</p>
            <p className="text-white/40 text-xs">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Spend + Conversions chart */}
        <div className="col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white font-semibold">Spend & Conversii zilnice</p>
              <p className="text-white/30 text-xs mt-0.5">Ultimele 14 zile</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-white/40"><span className="w-3 h-0.5 bg-blue-400 inline-block rounded"/>Spend</span>
              <span className="flex items-center gap-1.5 text-white/40"><span className="w-3 h-0.5 bg-green-400 inline-block rounded"/>Conversii</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DAILY_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <p className="text-white font-semibold mb-1">Device Breakdown</p>
          <p className="text-white/30 text-xs mb-5">Clicks per dispozitiv</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={DEVICE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="clicks" paddingAngle={3}>
                {DEVICE_DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {DEVICE_DATA.map((d, i) => (
              <div key={d.device} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white/60">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[i] }} />
                  {d.device}
                </span>
                <span className="text-white font-semibold">{((d.clicks / DEVICE_DATA.reduce((s, x) => s + x.clicks, 0)) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Campaigns */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <p className="text-white font-semibold mb-4">Top Campanii după Spend</p>
          <div className="space-y-3">
            {topCampaigns.map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs font-medium truncate">{c.name}</span>
                    <span className="text-white text-xs font-bold ml-2 flex-shrink-0">RON {c.spend.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.spend / topCampaigns[0].spend) * 100}%` }} />
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${c.roas >= 4 ? 'bg-green-500/15 text-green-400' : c.roas >= 2 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}>
                  {c.roas > 0 ? `${c.roas}x` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Heatmap simplified */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <p className="text-white font-semibold mb-1">Conversii per oră</p>
          <p className="text-white/30 text-xs mb-4">Când convertesc utilizatorii</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={HOURLY_DATA.filter((_, i) => i % 2 === 0)} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
              <YAxis tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="conversions" fill="#8B5CF6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
