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
    blue:   'bg-blue-50 border-blue-100',
    green:  'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100',
    red:    'bg-red-50 border-red-100',
    teal:   'bg-teal-50 border-teal-100',
  };
  const accent: Record<string, string> = {
    blue: 'text-blue-600', green: 'text-green-600', purple: 'text-purple-600',
    orange: 'text-orange-600', red: 'text-red-600', teal: 'text-teal-600',
  };
  return (
    <div className={`${colors[color] || colors.blue} border rounded-xl p-4`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent[color] || accent.blue}`}>{label}</p>
      <p className="text-slate-900 text-2xl font-bold mb-1">{prefix}{value}{suffix}</p>
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-xs">vs {prefix}{prev}{suffix} luna trecută</p>
        <div className={`flex items-center gap-1 text-xs font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
