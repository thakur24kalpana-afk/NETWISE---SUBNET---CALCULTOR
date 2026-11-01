import { BookOpen, Braces, Radio, Shield, Wifi } from 'lucide-react'
import { panel, SectionTitle } from './ui'

export function NetworkReference() {
  const concepts = [
    { icon: Braces, title: 'IPv4 structure', text: 'A 32-bit address written as four decimal octets. Each octet represents 8 binary bits and ranges from 0 to 255.' },
    { icon: Shield, title: 'CIDR notation', text: 'The /prefix states how many leading bits identify the network. /24 means 24 network bits and 8 host bits.' },
    { icon: Wifi, title: 'Network address', text: 'The first address of a subnet. All host bits are zero and it identifies the network itself.' },
    { icon: Radio, title: 'Broadcast address', text: 'The final address of a conventional subnet. All host bits are one and traffic reaches every host.' },
  ]
  const masks = [['/8', '255.0.0.0', '16,777,214'], ['/16', '255.255.0.0', '65,534'], ['/24', '255.255.255.0', '254'], ['/25', '255.255.255.128', '126'], ['/26', '255.255.255.192', '62'], ['/27', '255.255.255.224', '30'], ['/28', '255.255.255.240', '14'], ['/29', '255.255.255.248', '6'], ['/30', '255.255.255.252', '2']]
  return <div className="space-y-5">
    <section className={`${panel} p-5 sm:p-6`}><SectionTitle eyebrow="Knowledge base" title="IPv4 networking reference" description="A concise subnetting reference for study, planning, and project demonstrations." />
      <div className="grid gap-4 md:grid-cols-2">{concepts.map((item) => <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/40 p-5"><item.icon className="mb-4 text-cyan-400" size={21} /><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p></article>)}</div>
    </section>
    <div className="grid gap-5 xl:grid-cols-2">
      <section className={`${panel} p-5 sm:p-6`}><SectionTitle eyebrow="Ranges" title="Private IPv4 addresses" /><div className="space-y-3">{[['10.0.0.0/8', '10.0.0.0 — 10.255.255.255'], ['172.16.0.0/12', '172.16.0.0 — 172.31.255.255'], ['192.168.0.0/16', '192.168.0.0 — 192.168.255.255']].map(([cidr, range]) => <div key={cidr} className="rounded-xl bg-slate-950/50 p-4"><strong className="font-mono text-cyan-300">{cidr}</strong><p className="mt-1 text-xs text-slate-500">{range}</p></div>)}<p className="text-sm leading-6 text-slate-400">Private addresses are used inside local networks and are not routed on the public internet. Public addresses are globally routable and assigned by network providers.</p></div></section>
      <section className={`${panel} p-5 sm:p-6`}><SectionTitle eyebrow="Quick table" title="Common subnet masks" /><table className="w-full text-sm"><thead><tr className="border-b border-slate-700 text-left text-xs text-slate-500"><th className="pb-3">CIDR</th><th className="pb-3">Mask</th><th className="pb-3 text-right">Usable hosts</th></tr></thead><tbody>{masks.map((row) => <tr key={row[0]} className="border-b border-slate-800"><td className="py-2.5 text-cyan-300">{row[0]}</td><td className="font-mono text-slate-300">{row[1]}</td><td className="text-right text-slate-400">{row[2]}</td></tr>)}</tbody></table></section>
    </div>
    <section className={`${panel} p-5 sm:p-6`}><SectionTitle eyebrow="Learning reference" title="Classful addressing" description="Modern networks use CIDR. Address classes remain useful as a historical and academic reference." /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[['A', '1.0.0.0 — 126.255.255.255'], ['B', '128.0.0.0 — 191.255.255.255'], ['C', '192.0.0.0 — 223.255.255.255'], ['D', '224.0.0.0 — 239.255.255.255 · Multicast'], ['E', '240.0.0.0 — 255.255.255.255 · Reserved']].map(([name, range]) => <div key={name} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="mb-2 flex items-center gap-2"><BookOpen size={15} className="text-cyan-400" /><strong className="text-white">Class {name}</strong></div><p className="text-xs leading-5 text-slate-400">{range}</p></div>)}</div></section>
  </div>
}

export function AboutProject() {
  return <section className={`${panel} overflow-hidden`}>
    <div className="border-b border-slate-800 bg-gradient-to-br from-blue-600/15 via-transparent to-cyan-500/10 p-6 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Computer Networks Project</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">NETWISE</h2><p className="mt-3 max-w-2xl text-slate-300">IPv4 Subnet and VLSM Calculator — an interactive networking utility built to make address planning accurate, visual, and easy to understand.</p></div>
    <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2">
      <div><h3 className="text-lg font-bold text-white">Project objective</h3><p className="mt-3 text-sm leading-7 text-slate-400">To calculate IPv4 subnet details and allocate IP addresses efficiently using subnetting and Variable Length Subnet Masking. NETWISE combines practical calculation tools with visual learning aids suitable for a classroom demonstration.</p>
        <dl className="mt-6 grid grid-cols-2 gap-3">{[['Project Name', 'NETWISE'], ['Subject', 'Computer Networks'], ['Project Type', 'Interactive Utility'], ['Runtime', 'Browser / Local']].map(([key, value]) => <div key={key} className="rounded-xl bg-slate-950/50 p-4"><dt className="text-xs text-slate-500">{key}</dt><dd className="mt-1 text-sm font-semibold text-white">{value}</dd></div>)}</dl>
      </div>
      <div><h3 className="text-lg font-bold text-white">Learning outcomes</h3><ul className="mt-3 space-y-3">{['Understand IPv4 addressing and binary structure.', 'Understand CIDR notation and subnet boundaries.', 'Calculate subnet masks, network and broadcast addresses.', 'Allocate IP addresses efficiently using VLSM.', 'Understand practical IP address management.'].map((item, index) => <li key={item} className="flex gap-3 text-sm text-slate-400"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-300">{index + 1}</span><span className="pt-0.5">{item}</span></li>)}</ul></div>
    </div>
  </section>
}
