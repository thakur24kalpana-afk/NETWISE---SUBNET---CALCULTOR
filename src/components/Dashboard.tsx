import { Box, Copy, Globe2, Layers3, Radio, ShieldCheck } from 'lucide-react'
import type { NetworkResult } from '../lib/network'
import { formatNumber } from '../lib/network'
import { Button, panel, SectionTitle } from './ui'

export function SummaryCards({ result }: { result: NetworkResult }) {
  const items = [
    { label: 'Network Address', value: result.network, icon: Globe2, tone: 'text-cyan-300 bg-cyan-500/10' },
    { label: 'Subnet Mask', value: result.mask, icon: ShieldCheck, tone: 'text-blue-300 bg-blue-500/10' },
    { label: 'Total IP Addresses', value: formatNumber(result.total), icon: Layers3, tone: 'text-violet-300 bg-violet-500/10' },
    { label: 'Usable Host Addresses', value: formatNumber(result.usable), icon: Radio, tone: 'text-emerald-300 bg-emerald-500/10' },
    { label: 'Network Class', value: result.ipClass, icon: Box, tone: 'text-amber-300 bg-amber-500/10' },
    { label: 'CIDR Prefix', value: `/${result.prefix}`, icon: Layers3, tone: 'text-rose-300 bg-rose-500/10' },
  ]
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">{items.map((item) => <div key={item.label} className={`${panel} group p-4 transition hover:-translate-y-0.5 hover:border-slate-600`}>
    <div className={`mb-4 grid h-9 w-9 place-items-center rounded-lg ${item.tone}`}><item.icon size={17} /></div>
    <p className="truncate text-xs text-slate-500">{item.label}</p><p className="mt-1 truncate text-base font-bold text-white" title={item.value}>{item.value}</p>
  </div>)}</div>
}

export function ResultDetails({ result, onCopy }: { result: NetworkResult; onCopy: (value: string, label: string) => void }) {
  const details = [
    ['Network address', result.network], ['Broadcast address', result.broadcast], ['First usable host', result.firstHost],
    ['Last usable host', result.lastHost], ['Subnet mask', result.mask], ['Wildcard mask', result.wildcard],
    ['Address class', result.ipClass], ['Address type', result.type],
  ]
  const text = details.map(([key, value]) => `${key}: ${value}`).join('\n')
  return <section className={`${panel} p-5 sm:p-6`}>
    <SectionTitle eyebrow="Calculated results" title={`${result.network}/${result.prefix}`} description={`Address range ${result.network} — ${result.broadcast}`} action={<div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => onCopy(result.mask, 'Subnet mask')}><Copy size={15} />Copy mask</Button><Button variant="secondary" onClick={() => onCopy(text, 'Network details')}><Copy size={15} />Copy details</Button></div>} />
    <div className="grid gap-x-8 sm:grid-cols-2">
      {details.map(([key, value]) => <div key={key} className="flex items-center justify-between border-b border-slate-800 py-3.5"><span className="text-sm text-slate-400">{key}</span><button onClick={() => onCopy(value, key)} className="font-mono text-sm font-semibold text-slate-100 hover:text-cyan-300">{value}</button></div>)}
    </div>
  </section>
}
