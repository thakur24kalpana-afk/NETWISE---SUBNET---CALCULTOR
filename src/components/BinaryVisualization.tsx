import type { NetworkResult } from '../lib/network'
import { formatNumber } from '../lib/network'
import { panel, SectionTitle } from './ui'

export function BinaryVisualization({ result }: { result: NetworkResult }) {
  const bits = result.ipBinary.join('').split('')
  const maskBits = result.maskBinary.join('').split('')
  const percentage = Math.round((result.prefix / 32) * 100)
  return <section className={`${panel} overflow-hidden p-5 sm:p-6`}>
    <SectionTitle eyebrow="Subnet visualization" title="Binary address boundary" description="Cyan cells are network bits; violet cells are host bits." />
    <div className="mb-6 grid grid-cols-4 gap-2">
      {result.ip.split('.').map((octet, index) => <div key={index} className="rounded-xl border border-slate-700 bg-slate-950/60 py-3 text-center"><span className="font-mono text-xl font-bold text-white">{octet}</span><span className="mt-1 block text-[10px] uppercase tracking-wider text-slate-500">Octet {index + 1}</span></div>)}
    </div>
    <BinaryRow label="IP address" bits={bits} prefix={result.prefix} />
    <BinaryRow label="Subnet mask" bits={maskBits} prefix={result.prefix} mask />
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <Metric label="Network bits" value={`${result.prefix} bits`} />
      <Metric label="Host bits" value={`${32 - result.prefix} bits`} />
      <Metric label="Host capacity" value={`${formatNumber(result.usable)} usable`} />
    </div>
    <div className="mt-5"><div className="mb-2 flex justify-between text-xs text-slate-400"><span>Network / host boundary</span><span>{percentage}% network</span></div><div className="flex h-2.5 overflow-hidden rounded-full bg-violet-500/30"><div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" style={{ width: `${percentage}%` }} /></div></div>
  </section>
}

function BinaryRow({ label, bits, prefix, mask = false }: { label: string; bits: string[]; prefix: number; mask?: boolean }) {
  return <div className="mb-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><div className="grid grid-cols-32 gap-0.5 overflow-hidden rounded-lg">
    {bits.map((bit, index) => <span key={index} className={`grid h-7 min-w-0 place-items-center font-mono text-[9px] sm:text-[11px] ${index < prefix ? 'bg-cyan-500/20 text-cyan-200' : 'bg-violet-500/15 text-violet-300'} ${index > 0 && index % 8 === 0 ? 'ml-1' : ''}`}>{mask ? bit : bit}</span>)}
  </div></div>
}
function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-white">{value}</p></div>
}
