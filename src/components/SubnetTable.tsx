import { ArrowUpDown, Download, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { NetworkResult } from '../lib/network'
import { formatNumber } from '../lib/network'
import { Button, panel, SectionTitle } from './ui'

type SortKey = 'network' | 'prefix' | 'usable'
export function SubnetTable({ rows, onExport }: { rows: NetworkResult[]; onExport: () => void }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('network')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const filtered = useMemo(() => [...rows].filter((row) => `${row.network}/${row.prefix}`.includes(search.trim())).sort((a, b) => sort === 'prefix' ? a.prefix - b.prefix : sort === 'usable' ? b.usable - a.usable : a.network.localeCompare(b.network, undefined, { numeric: true })), [rows, search, sort])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((Math.min(page, pageCount) - 1) * pageSize, Math.min(page, pageCount) * pageSize)
  return <section className={`${panel} p-5 sm:p-6`}>
    <SectionTitle eyebrow="Generated ranges" title="Subnet table" description={`${rows.length} sequential subnet${rows.length === 1 ? '' : 's'} generated from the selected network.`} action={<Button variant="secondary" onClick={onExport}><Download size={15} />Export CSV</Button>} />
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-500" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search network address..." className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500" /></label>
      <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-400"><ArrowUpDown size={14} /><select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="bg-transparent py-2.5 text-slate-200 outline-none"><option value="network">Network address</option><option value="prefix">CIDR</option><option value="usable">Usable hosts</option></select></label>
    </div>
    <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead><tr className="border-b border-slate-700 text-[10px] uppercase tracking-wider text-slate-500">{['#', 'Network address', 'CIDR', 'Subnet mask', 'First host', 'Last host', 'Broadcast', 'Total IPs', 'Usable'].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}</tr></thead>
      <tbody>{visible.map((row) => <tr key={`${row.network}/${row.prefix}`} className="border-b border-slate-800/80 hover:bg-slate-800/30"><td className="px-3 py-3 text-slate-500">{rows.indexOf(row) + 1}</td><td className="px-3 py-3 font-mono font-medium text-cyan-300">{row.network}</td><td className="px-3 py-3 text-white">/{row.prefix}</td><td className="px-3 py-3 text-slate-300">{row.mask}</td><td className="px-3 py-3 text-slate-300">{row.firstHost}</td><td className="px-3 py-3 text-slate-300">{row.lastHost}</td><td className="px-3 py-3 text-slate-300">{row.broadcast}</td><td className="px-3 py-3 text-slate-300">{formatNumber(row.total)}</td><td className="px-3 py-3 text-emerald-300">{formatNumber(row.usable)}</td></tr>)}</tbody>
    </table></div>
    {pageCount > 1 && <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Page {Math.min(page, pageCount)} of {pageCount}</span><div className="flex gap-2"><Button variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="secondary" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>Next</Button></div></div>}
  </section>
}
