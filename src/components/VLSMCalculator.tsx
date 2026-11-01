import { AlertCircle, ClipboardCopy, Copy, Download, Eraser, Network, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { calculateNetwork, formatNumber, numToIP, parseIP } from '../lib/network'
import type { VlsmAllocation, VlsmRequirement } from '../lib/vlsm'
import { Button, Field, panel, SectionTitle } from './ui'

type Props = {
  startIP: string
  setStartIP: (value: string) => void
  prefix: number
  setPrefix: (value: number) => void
  requirements: VlsmRequirement[]
  setRequirements: (value: VlsmRequirement[]) => void
  allocations: VlsmAllocation[]
  remaining: number
  error: string
  onCalculate: () => void
  onReset: () => void
  onLoadExample: () => void
  onCopy: (value: string, label: string) => void
  onCopyResults: () => void
  onExport: () => void
}

const colors = [
  'from-cyan-500 to-blue-600',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
]

export function VLSMCalculator(props: Props) {
  const {
    startIP, setStartIP, prefix, setPrefix, requirements, setRequirements, allocations,
    remaining, error, onCalculate, onReset, onLoadExample, onCopy, onCopyResults, onExport,
  } = props

  const update = (id: string, field: 'name' | 'hosts', value: string) => {
    setRequirements(requirements.map((item) => item.id === id
      ? { ...item, [field]: field === 'hosts' ? Number(value) : value }
      : item))
  }
  const addRequirement = () => setRequirements([
    ...requirements,
    { id: crypto.randomUUID(), name: `Department ${requirements.length + 1}`, hosts: 10 },
  ])

  let base = null
  try {
    base = calculateNetwork(startIP, prefix)
  } catch {
    base = null
  }

  const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.total, 0)
  const totalSpace = base?.total ?? 0
  const utilization = totalSpace ? (totalAllocated / totalSpace) * 100 : 0
  const remainingStart = allocations.length ? numToIP(parseIP(allocations[allocations.length - 1].broadcast)! + 1) : base?.network

  return <div className="space-y-5">
    <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-blue-600/15 via-slate-900/70 to-cyan-500/10 p-6 sm:p-8">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400"><Network size={16} />Network planning workspace</div>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">VLSM Calculator</h2>
        <p className="mt-2 text-base font-medium text-cyan-100">Variable Length Subnet Masking — Smart IP Address Allocation</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">Allocate IP addresses efficiently by assigning different subnet sizes according to the host requirements of each department.</p>
      </div>
    </section>

    <section className={`${panel} p-5 sm:p-6`}>
      <SectionTitle
        eyebrow="Step 01"
        title="Base network"
        description="Define the parent IPv4 network that will contain every allocated subnet."
        action={<Button variant="secondary" onClick={onLoadExample}><Sparkles size={15} />Load example</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Base network address" value={startIP} onChange={(event) => setStartIP(event.target.value)} placeholder="192.168.1.0" />
        <Field label="Network prefix" type="number" min={0} max={32} value={prefix} onChange={(event) => setPrefix(Number(event.target.value))} hint="Enter a CIDR prefix from /0 to /32." />
      </div>
      {base ? <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <NetworkMetric label="Base network" value={`${base.network}/${base.prefix}`} />
        <NetworkMetric label="Subnet mask" value={base.mask} />
        <NetworkMetric label="Total address space" value={formatNumber(base.total)} />
        <NetworkMetric label="Available host capacity" value={formatNumber(base.usable)} />
      </div> : <InlineError message="Enter a valid IPv4 address and a prefix from 0 to 32." />}
    </section>

    <section className={`${panel} p-5 sm:p-6`}>
      <SectionTitle
        eyebrow="Step 02"
        title="Subnet requirements"
        description="Add departments and the number of usable host addresses each one requires."
        action={<div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={addRequirement}><Plus size={15} />Add subnet</Button>
          <Button variant="danger" onClick={() => setRequirements([])} disabled={!requirements.length}><Eraser size={15} />Clear all</Button>
        </div>}
      />
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <div className="hidden grid-cols-[56px_1fr_180px_90px] gap-3 border-b border-slate-800 bg-slate-950/60 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid">
          <span>No.</span><span>Department name</span><span>Required hosts</span><span className="text-right">Action</span>
        </div>
        {requirements.length ? requirements.map((item, index) => <div key={item.id} className={`grid gap-3 p-4 sm:grid-cols-[56px_1fr_180px_90px] sm:items-center ${index % 2 ? 'bg-slate-950/30' : 'bg-slate-900/20'} ${index ? 'border-t border-slate-800/80' : ''}`}>
          <span className="hidden text-sm font-semibold text-slate-500 sm:block">{String(index + 1).padStart(2, '0')}</span>
          <label><span className="mb-1.5 block text-[10px] uppercase tracking-wider text-slate-500 sm:hidden">Department name</span><input aria-label={`Department ${index + 1} name`} value={item.name} onChange={(event) => update(item.id, 'name', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10" /></label>
          <label><span className="mb-1.5 block text-[10px] uppercase tracking-wider text-slate-500 sm:hidden">Required hosts</span><input aria-label={`${item.name} required hosts`} type="number" min={1} step={1} value={item.hosts || ''} onChange={(event) => update(item.id, 'hosts', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10" /></label>
          <Button aria-label={`Remove ${item.name}`} variant="danger" className="sm:justify-self-end" onClick={() => setRequirements(requirements.filter((row) => row.id !== item.id))}><Trash2 size={16} /><span className="sm:hidden">Remove subnet</span></Button>
        </div>) : <div className="p-8 text-center"><Network size={26} className="mx-auto text-slate-600" /><p className="mt-3 text-sm text-slate-400">No subnet requirements added.</p><Button variant="secondary" className="mt-4" onClick={addRequirement}><Plus size={15} />Add first subnet</Button></div>}
      </div>

      {error && <InlineError message={error} />}
      <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onReset}><RotateCcw size={15} />Reset</Button>
          <Button variant="ghost" onClick={addRequirement}><Plus size={15} />Add subnet</Button>
        </div>
        <Button className="min-h-12 flex-1 text-sm uppercase tracking-wider sm:ml-auto sm:max-w-sm" onClick={onCalculate} disabled={!requirements.length || !base}><Network size={18} />Calculate VLSM</Button>
      </div>
      <p className="mt-3 text-xs text-slate-500">Requirements are allocated largest-first. One-host requirements use /32; two-host point-to-point requirements use /31; larger LANs reserve network and broadcast addresses.</p>
    </section>

    {allocations.length > 0 && <>
      <section className={`${panel} p-5 sm:p-6`}>
        <SectionTitle
          eyebrow="Allocation summary"
          title="VLSM Allocation Results"
          description={`${allocations.length} non-overlapping subnet blocks allocated inside ${base?.network}/${base?.prefix}.`}
          action={<div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={onCopyResults}><ClipboardCopy size={15} />Copy results</Button><Button variant="secondary" onClick={onExport}><Download size={15} />Export CSV</Button></div>}
        />
        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-5">
          <SummaryMetric label="Total address space" value={formatNumber(totalSpace)} />
          <SummaryMetric label="Allocated addresses" value={formatNumber(totalAllocated)} />
          <SummaryMetric label="Remaining addresses" value={formatNumber(remaining)} />
          <SummaryMetric label="Number of subnets" value={String(allocations.length)} />
          <SummaryMetric label="Address utilization" value={`${utilization.toFixed(1)}%`} />
        </div>
        <AllocationTable rows={allocations} onCopy={onCopy} />
      </section>

      <section className={`${panel} p-5 sm:p-6`}>
        <SectionTitle eyebrow="Visual network allocation" title={`${base?.network}/${base?.prefix} address map`} description="Block widths reflect each subnet's share of the parent address space." />
        <div className="mb-6 flex h-20 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
          {allocations.map((row, index) => <div key={row.id} title={`${row.name}: ${row.network}/${row.prefix}`} className={`flex min-w-12 flex-col items-center justify-center border-r border-slate-950/60 bg-gradient-to-br px-2 text-center text-white ${colors[index % colors.length]}`} style={{ flexGrow: row.total }}>
            <strong className="max-w-full truncate text-[10px] sm:text-xs">{row.name}</strong><span className="text-[10px] opacity-80">/{row.prefix}</span>
          </div>)}
          {remaining > 0 && <div className="grid min-w-16 place-items-center bg-slate-800 px-2 text-center text-[10px] font-semibold text-slate-400" style={{ flexGrow: remaining }}>Unallocated<br />{formatNumber(remaining)}</div>}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {allocations.map((row, index) => <div key={row.id} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <span className={`mt-1 h-3 w-3 shrink-0 rounded-sm bg-gradient-to-br ${colors[index % colors.length]}`} />
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-white">{row.name}</strong><span className="rounded-md bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-300">/{row.prefix}</span></div><p className="mt-1 truncate font-mono text-xs text-slate-500">{row.network} — {row.broadcast}</p></div>
          </div>)}
          {remaining > 0 && <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/20 p-4"><span className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-slate-700" /><div><strong className="text-sm text-slate-300">Remaining space</strong><p className="mt-1 text-xs text-slate-500">{formatNumber(remaining)} addresses available</p><p className="mt-1 font-mono text-xs text-slate-600">{remainingStart} — {base?.broadcast}</p></div></div>}
        </div>
      </section>
    </>}
  </div>
}

function NetworkMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1.5 truncate font-mono text-sm font-semibold text-slate-100" title={value}>{value}</p></div>
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-blue-500/15 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-white">{value}</p></div>
}

function InlineError({ message }: { message: string }) {
  return <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/8 p-3 text-sm text-rose-200"><AlertCircle size={17} className="mt-0.5 shrink-0 text-rose-400" />{message}</div>
}

function AllocationTable({ rows, onCopy }: { rows: VlsmAllocation[]; onCopy: (value: string, label: string) => void }) {
  const headings = ['No.', 'Department', 'Hosts required', 'Network address', 'CIDR', 'Subnet mask', 'First host', 'Last host', 'Broadcast', 'Total IPs', 'Unused hosts']
  return <div className="overflow-x-auto rounded-xl border border-slate-800"><table className="w-full min-w-[1280px] text-left text-sm">
    <thead><tr className="border-b border-slate-700 bg-slate-950/70 text-[10px] uppercase tracking-wider text-slate-500">{headings.map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.id} className={`border-b border-slate-800/80 transition hover:bg-cyan-500/5 ${index % 2 ? 'bg-slate-950/30' : 'bg-slate-900/10'}`}>
      <td className="px-3 py-4 text-slate-500">{index + 1}</td>
      <td className="px-3 py-4 font-semibold text-white">{row.name}</td>
      <td className="px-3 py-4 text-slate-300">{formatNumber(row.requested)}</td>
      <td className="px-3 py-4"><button onClick={() => onCopy(`${row.network}/${row.prefix}`, `${row.name} network`)} className="inline-flex items-center gap-2 font-mono font-medium text-cyan-300 hover:text-cyan-200">{row.network}<Copy size={13} /></button></td>
      <td className="px-3 py-4 font-mono text-white">/{row.prefix}</td>
      <td className="px-3 py-4 font-mono text-slate-300">{row.mask}</td>
      <td className="px-3 py-4 font-mono text-slate-300">{row.firstHost}</td>
      <td className="px-3 py-4 font-mono text-slate-300">{row.lastHost}</td>
      <td className="px-3 py-4 font-mono text-slate-300">{row.broadcast}</td>
      <td className="px-3 py-4 text-slate-300">{formatNumber(row.total)}</td>
      <td className="px-3 py-4 text-emerald-300">{formatNumber(row.unused)}</td>
    </tr>)}</tbody>
  </table></div>
}
