import { useEffect, useMemo, useState } from 'react'
import { BinaryVisualization } from './components/BinaryVisualization'
import { ResultDetails, SummaryCards } from './components/Dashboard'
import { IPv4Calculator, type IPv4Form } from './components/IPv4Calculator'
import { AboutProject, NetworkReference } from './components/Reference'
import { Header, Sidebar, type Page } from './components/Shell'
import { SubnetTable } from './components/SubnetTable'
import { Toast } from './components/ui'
import { VLSMCalculator } from './components/VLSMCalculator'
import { calculateNetwork, generateSubnets, type NetworkResult } from './lib/network'
import { calculateVlsm, type VlsmAllocation, type VlsmRequirement } from './lib/vlsm'

const defaultForm: IPv4Form = { ip: '192.168.1.0', prefix: 24, mask: '255.255.255.0', subnets: 4, hosts: 50 }
const defaultRequirements: VlsmRequirement[] = [
  { id: 'a', name: 'Department A', hosts: 100 }, { id: 'b', name: 'Department B', hosts: 50 },
  { id: 'c', name: 'Department C', hosts: 25 }, { id: 'd', name: 'Department D', hosts: 10 },
]

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState<IPv4Form>(defaultForm)
  const [result, setResult] = useState<NetworkResult>(() => calculateNetwork(defaultForm.ip, defaultForm.prefix))
  const [subnets, setSubnets] = useState<NetworkResult[]>(() => generateSubnets(calculateNetwork(defaultForm.ip, defaultForm.prefix), defaultForm.subnets))
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [vlsmIP, setVlsmIP] = useState('192.168.1.0')
  const [vlsmPrefix, setVlsmPrefix] = useState(24)
  const [requirements, setRequirements] = useState(defaultRequirements)
  const [allocations, setAllocations] = useState<VlsmAllocation[]>([])
  const [remaining, setRemaining] = useState(0)
  const [vlsmError, setVlsmError] = useState('')

  useEffect(() => {
    const timer = toast ? window.setTimeout(() => setToast(null), 3200) : undefined
    return () => timer && window.clearTimeout(timer)
  }, [toast])

  const notify = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type })
  const updateForm = (nextForm: IPv4Form) => {
    setForm(nextForm)
    try {
      const nextResult = calculateNetwork(nextForm.ip, nextForm.prefix)
      setResult(nextResult)
      setSubnets(generateSubnets(nextResult, nextForm.subnets))
    } catch {
      // Keep the most recent valid result visible while the user edits an incomplete value.
    }
  }
  const calculate = () => {
    try {
      const next = calculateNetwork(form.ip, form.prefix)
      const nextSubnets = generateSubnets(next, form.subnets)
      setResult(next); setSubnets(nextSubnets); notify('Network calculation completed.')
    } catch (error) { notify(error instanceof Error ? error.message : 'Unable to calculate network.', 'error') }
  }
  const calculateVLSM = () => {
    try {
      const output = calculateVlsm(vlsmIP, vlsmPrefix, requirements)
      setAllocations(output.allocations); setRemaining(output.remaining); setVlsmError(''); notify('VLSM plan allocated successfully.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to calculate VLSM.'
      setAllocations([]); setRemaining(0); setVlsmError(message); notify(message, 'error')
    }
  }
  const resetVLSM = () => {
    setVlsmIP('192.168.1.0'); setVlsmPrefix(24); setRequirements(defaultRequirements.map((item) => ({ ...item })))
    setAllocations([]); setRemaining(0); setVlsmError(''); notify('VLSM calculator reset.')
  }
  const loadVLSMExample = () => {
    const example = defaultRequirements.map((item) => ({ ...item }))
    setVlsmIP('192.168.1.0'); setVlsmPrefix(24); setRequirements(example)
    try {
      const output = calculateVlsm('192.168.1.0', 24, example)
      setAllocations(output.allocations); setRemaining(output.remaining); setVlsmError(''); notify('Example allocation loaded.')
    } catch {
      setAllocations([]); setRemaining(0)
    }
  }
  const updateVlsmIP = (value: string) => { setVlsmIP(value); setAllocations([]); setRemaining(0); setVlsmError('') }
  const updateVlsmPrefix = (value: number) => { setVlsmPrefix(value); setAllocations([]); setRemaining(0); setVlsmError('') }
  const updateRequirements = (value: VlsmRequirement[]) => { setRequirements(value); setAllocations([]); setRemaining(0); setVlsmError('') }
  const reset = () => {
    const initial = calculateNetwork(defaultForm.ip, defaultForm.prefix)
    setForm(defaultForm); setResult(initial); setSubnets(generateSubnets(initial, defaultForm.subnets))
    setVlsmIP('192.168.1.0'); setVlsmPrefix(24); setRequirements(defaultRequirements.map((item) => ({ ...item }))); setAllocations([]); setRemaining(0); setVlsmError('')
    notify('Calculator reset to the default network.')
  }
  const copy = async (value: string, label: string) => {
    try { await navigator.clipboard.writeText(value); notify(`${label} copied to clipboard.`) }
    catch { notify('Clipboard access is not available.', 'error') }
  }
  const exportRows = (rows: (NetworkResult | VlsmAllocation)[], name: string) => {
    const headers = ['Name', 'Network', 'CIDR', 'Subnet Mask', 'First Host', 'Last Host', 'Broadcast', 'Total IPs', 'Usable Hosts']
    const data = rows.map((row, index) => [('name' in row ? row.name : `Subnet ${index + 1}`), row.network, `/${row.prefix}`, row.mask, row.firstHost, row.lastHost, row.broadcast, row.total, row.usable])
    const csv = [headers, ...data].map((line) => line.map((value) => `"${value}"`).join(',')).join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = name; link.click(); URL.revokeObjectURL(link.href)
    notify('CSV export downloaded.')
  }
  const copyVlsmResults = () => {
    const text = allocations.map((row, index) => `${index + 1}. ${row.name} | ${row.requested} hosts | ${row.network}/${row.prefix} | Mask ${row.mask} | Hosts ${row.firstHost} - ${row.lastHost} | Broadcast ${row.broadcast}`).join('\n')
    copy(text, 'VLSM results')
  }
  const exportVlsm = () => {
    const headers = ['No.', 'Department', 'Hosts Required', 'Network Address', 'CIDR', 'Subnet Mask', 'First Host', 'Last Host', 'Broadcast', 'Total IPs', 'Usable Hosts', 'Unused Host Capacity']
    const data = allocations.map((row, index) => [index + 1, row.name, row.requested, row.network, `/${row.prefix}`, row.mask, row.firstHost, row.lastHost, row.broadcast, row.total, row.usable, row.unused])
    const csv = [headers, ...data].map((line) => line.map((value) => `"${value}"`).join(',')).join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'netwise-vlsm.csv'; link.click(); URL.revokeObjectURL(link.href)
    notify('VLSM CSV export downloaded.')
  }

  const dashboard = useMemo(() => <div className="space-y-5"><SummaryCards result={result} /><div className="grid gap-5 2xl:grid-cols-[1.15fr_.85fr]"><IPv4Calculator form={form} onChange={updateForm} onCalculate={calculate} onCopy={copy} compact /><ResultDetails result={result} onCopy={copy} /></div><BinaryVisualization result={result} /></div>, [result, form])

  return <div className="min-h-screen bg-[#0B1120] text-slate-200">
    <Sidebar page={page} setPage={setPage} open={menuOpen} setOpen={setMenuOpen} />
    <div className="lg:pl-72"><Header onMenu={() => setMenuOpen(true)} onReset={reset} />
      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {page === 'dashboard' && dashboard}
        {page === 'ipv4' && <div className="space-y-5"><SummaryCards result={result} /><IPv4Calculator form={form} onChange={updateForm} onCalculate={calculate} onCopy={copy} /><ResultDetails result={result} onCopy={copy} /><BinaryVisualization result={result} /></div>}
        {page === 'vlsm' && <VLSMCalculator startIP={vlsmIP} setStartIP={updateVlsmIP} prefix={vlsmPrefix} setPrefix={updateVlsmPrefix} requirements={requirements} setRequirements={updateRequirements} allocations={allocations} remaining={remaining} error={vlsmError} onCalculate={calculateVLSM} onReset={resetVLSM} onLoadExample={loadVLSMExample} onCopy={copy} onCopyResults={copyVlsmResults} onExport={exportVlsm} />}
        {page === 'explorer' && <div className="space-y-5"><BinaryVisualization result={result} /><SubnetTable rows={subnets} onExport={() => exportRows(subnets, 'netwise-subnets.csv')} /></div>}
        {page === 'reference' && <NetworkReference />}
        {page === 'about' && <AboutProject />}
      </main>
    </div>
    {toast && <Toast {...toast} onClose={() => setToast(null)} />}
  </div>
}
