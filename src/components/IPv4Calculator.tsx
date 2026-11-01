import { Check, ChevronRight, Copy, Play } from 'lucide-react'
import { prefixToMask } from '../lib/network'
import { Button, Field, panel, SectionTitle, SelectField } from './ui'

export type IPv4Form = { ip: string; prefix: number; mask: string; subnets: number; hosts: number }

export function IPv4Calculator({ form, onChange, onCalculate, onCopy, compact = false }: { form: IPv4Form; onChange: (form: IPv4Form) => void; onCalculate: () => void; onCopy: (value: string, label: string) => void; compact?: boolean }) {
  const examples = [
    ['Class A', '10.0.0.0', 8], ['Class B', '172.16.0.0', 16], ['Class C', '192.168.1.0', 24], ['Private', '192.168.10.0', 24],
  ] as const
  const setPrefix = (prefix: number) => onChange({ ...form, prefix, mask: prefixToMask(prefix) })
  return <section className={`${panel} p-5 sm:p-6`}>
    <SectionTitle eyebrow="IPv4 engine" title="Subnet calculator" description="Enter any IPv4 address and CIDR prefix to inspect its complete network range." />
    <div className={`grid gap-4 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-5'}`}>
      <Field label="IPv4 address" value={form.ip} onChange={(e) => onChange({ ...form, ip: e.target.value })} placeholder="192.168.1.0" />
      <SelectField label="CIDR prefix" value={form.prefix} onChange={(e) => setPrefix(Number(e.target.value))}>
        {Array.from({ length: 33 }, (_, i) => <option key={i} value={i}>/{i} — {prefixToMask(i)}</option>)}
      </SelectField>
      <SelectField label="Subnet mask" value={form.mask} onChange={(e) => { const prefix = Number(e.target.selectedOptions[0].dataset.prefix); onChange({ ...form, mask: e.target.value, prefix }) }}>
        {Array.from({ length: 33 }, (_, i) => <option key={i} value={prefixToMask(i)} data-prefix={i}>{prefixToMask(i)}</option>)}
      </SelectField>
      {!compact && <Field label="Required subnets" type="number" min={1} max={256} value={form.subnets} onChange={(e) => onChange({ ...form, subnets: Number(e.target.value) })} />}
      {!compact && <Field label="Required hosts" type="number" min={1} value={form.hosts} onChange={(e) => onChange({ ...form, hosts: Number(e.target.value) })} />}
    </div>
    <div className="mt-4">
      <input aria-label="CIDR prefix slider" type="range" min="0" max="32" value={form.prefix} onChange={(e) => setPrefix(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400" />
      <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>/0 — Entire IPv4 space</span><span>/16</span><span>/32 — Single host</span></div>
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-5">
      <span className="mr-1 text-xs text-slate-500">Quick examples</span>
      {examples.map(([label, ip, prefix]) => <Button key={label} variant="ghost" className="!px-3 !py-2 text-xs" onClick={() => onChange({ ...form, ip, prefix, mask: prefixToMask(prefix) })}>{label}</Button>)}
      <div className="ml-auto flex gap-2">
        <Button variant="secondary" onClick={() => onCopy(`${form.ip}/${form.prefix}`, 'IP address')}><Copy size={15} />Copy IP</Button>
        <Button onClick={onCalculate}><Play size={16} fill="currentColor" />Calculate<ChevronRight size={15} /></Button>
      </div>
    </div>
    {form.hosts > 0 && <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-500/8 p-3 text-xs text-blue-200"><Check size={15} className="mt-0.5 shrink-0 text-cyan-400" /> Host requirement is used as a planning aid. VLSM allocation is available on the dedicated VLSM page.</div>}
  </section>
}
