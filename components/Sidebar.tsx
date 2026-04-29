'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, KeyRound, PlaySquare,
  Lightbulb, Settings, ChevronDown, TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { MCC_ACCOUNTS } from '@/lib/demo-data';

const NAV = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Overview'    },
  { href: '/dashboard/campaigns',   icon: Megaphone,       label: 'Campanii'    },
  { href: '/dashboard/keywords',    icon: KeyRound,        label: 'Keywords'    },
  { href: '/dashboard/ads',         icon: PlaySquare,      label: 'Anunțuri'   },
  { href: '/dashboard/insights',    icon: Lightbulb,       label: 'Recomandări' },
  { href: '/dashboard/settings',    icon: Settings,        label: 'Setări'     },
];

export default function Sidebar() {
  const path = usePathname();
  const [activeMCC, setActiveMCC] = useState(MCC_ACCOUNTS[0].id);
  const [mccOpen, setMccOpen] = useState(false);
  const currentMCC = MCC_ACCOUNTS.find(m => m.id === activeMCC)!;

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm leading-none">AdsAnalyzer</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Google Ads Platform</p>
          </div>
        </div>
      </div>

      {/* MCC Selector */}
      <div className="px-3 py-3 border-b border-slate-100">
        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2 px-2">Manager Account</p>
        <div className="relative">
          <button
            onClick={() => setMccOpen(v => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <div className="text-left min-w-0">
              <p className="text-slate-800 text-xs font-semibold truncate">{currentMCC.name}</p>
              <p className="text-slate-400 text-[10px]">{currentMCC.customerId}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${mccOpen ? 'rotate-180' : ''}`} />
          </button>
          {mccOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg overflow-hidden z-10 shadow-lg">
              {MCC_ACCOUNTS.map(mcc => (
                <button key={mcc.id} onClick={() => { setActiveMCC(mcc.id); setMccOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors ${activeMCC === mcc.id ? 'bg-blue-50' : ''}`}>
                  <p className="text-slate-800 text-xs font-semibold">{mcc.name}</p>
                  <p className="text-slate-400 text-[10px]">{mcc.customerId} · {mcc.accounts.length} conturi</p>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 px-2">
          <p className="text-slate-400 text-[10px]">{currentMCC.accounts.length} conturi client active</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2 px-2">Navigare</p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors text-sm font-medium
                ${active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-slate-400 text-[10px] text-center">AdsAnalyzer · v1.0</p>
      </div>
    </aside>
  );
}
