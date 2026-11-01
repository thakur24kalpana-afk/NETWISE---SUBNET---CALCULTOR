import { Activity, Binary, BookOpen, Calculator, Info, LayoutDashboard, Menu, Network, RotateCcw, Router, X } from 'lucide-react'
import { Button } from './ui'

export type Page = 'dashboard' | 'ipv4' | 'vlsm' | 'explorer' | 'reference' | 'about'

const nav: { id: Page; label: string; icon: typeof Activity }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ipv4', label: 'IPv4 Calculator', icon: Calculator },
  { id: 'vlsm', label: 'VLSM Calculator', icon: Network },
  { id: 'explorer', label: 'Subnet Explorer', icon: Binary },
  { id: 'reference', label: 'Network Reference', icon: BookOpen },
  { id: 'about', label: 'About Project', icon: Info },
]

export function Sidebar({ page, setPage, open, setOpen }: { page: Page; setPage: (page: Page) => void; open: boolean; setOpen: (open: boolean) => void }) {
  return <>
    {open && <button className="fixed inset-0 z-30 bg-slate-950/75 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu overlay" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-[#080e1c]/95 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-3 text-left" onClick={() => setPage('dashboard')}>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-lg shadow-cyan-950"><Router size={23} /></span>
          <span><strong className="block text-lg tracking-[0.14em] text-white">NETWISE</strong><small className="text-[10px] uppercase tracking-wider text-cyan-400">Network intelligence</small></span>
        </button>
        <button className="text-slate-400 lg:hidden" onClick={() => setOpen(false)}><X size={20} /></button>
      </div>
      <div className="my-7 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <nav className="space-y-1.5">
        {nav.map((item) => <button key={item.id} onClick={() => { setPage(item.id); setOpen(false) }} className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${page === item.id ? 'bg-blue-500/15 text-cyan-300 ring-1 ring-blue-500/20' : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}`}>
          <item.icon size={18} className={page === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'} />{item.label}
          {page === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />}
        </button>)}
      </nav>
      <div className="mt-auto rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-300"><Activity size={14} /> Engine online</div>
        <p className="text-xs leading-relaxed text-slate-400">IPv4 calculation engine ready. All calculations run locally in your browser.</p>
      </div>
    </aside>
  </>
}

export function Header({ onMenu, onReset }: { onMenu: () => void; onReset: () => void }) {
  return <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#0b1120]/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenu} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"><Menu size={21} /></button>
        <div className="min-w-0"><h1 className="truncate text-base font-bold text-white sm:text-xl">IPv4 Subnet & VLSM Calculator</h1><p className="hidden text-xs text-slate-400 sm:block">Smart Network Address Planning</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Network online</div>
        <Button variant="secondary" onClick={onReset}><RotateCcw size={15} /><span className="hidden sm:inline">Reset</span></Button>
      </div>
    </div>
  </header>
}
