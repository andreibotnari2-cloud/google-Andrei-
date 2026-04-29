'use client';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  prev: string;
  change: number;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export default function KPICard({ label, value, prev, change, prefix = '', suffix = '', color = 'blue' }: KPICardProps) {
  const up = change >= 0;
  const colors: Record<string, string> = {
    blue:   'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    green:  'from-green-500/10 to-green-600/5 border-green-500/20',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20',
    red:    'from-red-500/10 to-red-600/5 border-red-500/20',
    teal:   'from-teal-500/10 to-teal-600/5 border-teal-500/20',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color] || colors.blue} border rounded-xl p-4`}>
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
      <p className="text-white text-2xl font-bold mb-1">{prefix}{value}{suffix}</p>
      <div className="flex items-center justify-between">
        <p className="text-white/30 text-xs">vs {prefix}{prev}{suffix} luna trecută</p>
        <div className={`flex items-center gap-1 text-xs font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
