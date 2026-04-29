'use client';
import { RECOMMENDATIONS, KEYWORDS, CAMPAIGNS } from '@/lib/demo-data';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, Zap, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};
const COLOR_MAP = {
  warning: { bg: 'bg-red-500/5', border: 'border-red-500/20', icon: 'text-red-400', badge: 'bg-red-500/15 text-red-400', btn: 'bg-red-500/20 hover:bg-red-500/30 text-red-400' },
  success: { bg: 'bg-green-500/5', border: 'border-green-500/20', icon: 'text-green-400', badge: 'bg-green-500/15 text-green-400', btn: 'bg-green-500/20 hover:bg-green-500/30 text-green-400' },
  info: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', icon: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-400', btn: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' },
};

const IMPACT_COLORS: Record<string, string> = {
  high: 'bg-orange-500/15 text-orange-400',
  medium: 'bg-yellow-500/15 text-yellow-400',
  low: 'bg-white/10 text-slate-400',
};

export default function InsightsPage() {
  const topKeyword = [...KEYWORDS].sort((a, b) => b.cpa - a.cpa)[0];
  const topCampaign = [...CAMPAIGNS].filter(c => c.roas > 0).sort((a, b) => b.roas - a.roas)[0];
  const wastedSpend = KEYWORDS.filter(k => k.qualityScore <= 4).reduce((s, k) => s + k.spend, 0);
  const highRoasCampaigns = CAMPAIGNS.filter(c => c.roas >= 4);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Recomandări & Insights</h1>
        <p className="text-slate-400 text-sm mt-0.5">Analiză automată · {RECOMMENDATIONS.length} recomandări active</p>
      </div>

      {/* Score overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Scor Cont', value: '72', suffix: '/100', color: 'text-yellow-400', sub: 'Necesită atenție' },
          { label: 'Recomandări High', value: String(RECOMMENDATIONS.filter(r => r.impact === 'high').length), suffix: '', color: 'text-red-400', sub: 'Impact ridicat' },
          { label: 'Spend risipit', value: `RON ${wastedSpend.toFixed(0)}`, suffix: '', color: 'text-orange-400', sub: 'QS ≤ 4' },
          { label: 'Campanii Top', value: String(highRoasCampaigns.length), suffix: '', color: 'text-green-400', sub: 'ROAS ≥ 4x' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`font-bold text-2xl ${s.color}`}>{s.value}<span className="text-sm text-slate-400">{s.suffix}</span></p>
            <p className="text-slate-400 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recommendations list */}
      <div className="space-y-3">
        <p className="text-white font-semibold text-sm uppercase tracking-wider text-slate-500">Recomandări automate</p>
        {RECOMMENDATIONS.map((r, i) => {
          const c = COLOR_MAP[r.type as keyof typeof COLOR_MAP] || COLOR_MAP.info;
          const Icon = ICON_MAP[r.type as keyof typeof ICON_MAP] || Info;
          return (
            <div key={i} className={`${c.bg} ${c.border} border rounded-xl p-5 flex items-start gap-4`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                <Icon size={18} className={c.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm">{r.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${IMPACT_COLORS[r.impact]}`}>
                        {r.impact.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">{r.description}</p>
                    <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                      <Zap size={11} /> {r.campaign}
                    </p>
                  </div>
                  <button className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${c.btn}`}>
                    {r.action} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={16} className="text-red-400" />
            <p className="text-white font-semibold text-sm">Top Keyword — CPA Ridicat</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-xs">Keyword</p>
              <p className="text-white font-mono text-sm mt-0.5">"{topKeyword.keyword}"</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'CPA', value: `RON ${topKeyword.cpa.toFixed(2)}`, color: 'text-red-400' },
                { label: 'Spend', value: `RON ${topKeyword.spend.toFixed(0)}`, color: 'text-orange-400' },
                { label: 'Conv.', value: String(topKeyword.conversions), color: 'text-slate-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-lg p-2.5">
                  <p className="text-slate-400 text-[10px]">{s.label}</p>
                  <p className={`font-bold text-sm mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-400" />
            <p className="text-white font-semibold text-sm">Top Campanie — ROAS</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-xs">Campanie</p>
              <p className="text-white text-sm mt-0.5 font-medium">{topCampaign.name}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'ROAS', value: `${topCampaign.roas}x`, color: 'text-green-400' },
                { label: 'CPA', value: `RON ${topCampaign.cpa.toFixed(2)}`, color: 'text-green-400' },
                { label: 'Conv.', value: String(topCampaign.conversions), color: 'text-slate-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-lg p-2.5">
                  <p className="text-slate-400 text-[10px]">{s.label}</p>
                  <p className={`font-bold text-sm mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
