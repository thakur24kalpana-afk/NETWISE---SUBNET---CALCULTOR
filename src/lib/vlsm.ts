import { calculateNetwork, numToIP, parseIP, type NetworkResult } from './network'

export type VlsmRequirement = {
  id: string
  name: string
  hosts: number
}

export type VlsmAllocation = NetworkResult & {
  id: string
  name: string
  requested: number
  unused: number
}

export type VlsmPlan = {
  base: NetworkResult
  allocations: VlsmAllocation[]
  totalAllocated: number
  remaining: number
  utilization: number
}

function subnetSizeForHosts(hosts: number) {
  // A single endpoint can use /32 and two point-to-point endpoints can use /31.
  if (hosts === 1) return 1
  if (hosts === 2) return 2
  return 2 ** Math.ceil(Math.log2(hosts + 2))
}

export function calculateVlsm(startIP: string, startPrefix: number, requirements: VlsmRequirement[]): VlsmPlan {
  const base = calculateNetwork(startIP, startPrefix)
  if (!requirements.length) throw new Error('Add at least one subnet requirement before calculating.')

  requirements.forEach((requirement, index) => {
    if (!requirement.name.trim()) throw new Error(`Enter a department name for row ${index + 1}.`)
    if (!Number.isInteger(requirement.hosts) || requirement.hosts < 1) {
      throw new Error(`${requirement.name || `Row ${index + 1}`} must have a positive whole-number host count.`)
    }
    if (requirement.hosts > 0xfffffffe) throw new Error(`${requirement.name} exceeds the IPv4 address space.`)
  })

  const baseValue = parseIP(base.network)!
  const endValue = parseIP(base.broadcast)!
  let cursor = baseValue

  const allocations = [...requirements]
    .sort((a, b) => b.hosts - a.hosts)
    .map((requirement): VlsmAllocation => {
      const size = subnetSizeForHosts(requirement.hosts)
      const prefix = 32 - Math.log2(size)
      const alignedStart = Math.ceil(cursor / size) * size

      if (alignedStart < baseValue || alignedStart + size - 1 > endValue) {
        throw new Error(
          `Insufficient address space: ${requirement.name} needs ${size.toLocaleString()} addresses, but the base ${base.network}/${base.prefix} cannot fit all requirements.`,
        )
      }

      const result = calculateNetwork(numToIP(alignedStart), prefix)
      cursor = alignedStart + size
      return {
        ...result,
        id: requirement.id,
        name: requirement.name.trim(),
        requested: requirement.hosts,
        unused: Math.max(0, result.usable - requirement.hosts),
      }
    })

  const totalAllocated = allocations.reduce((total, allocation) => total + allocation.total, 0)
  const remaining = Math.max(0, base.total - totalAllocated)
  return {
    base,
    allocations,
    totalAllocated,
    remaining,
    utilization: base.total ? (totalAllocated / base.total) * 100 : 0,
  }
}
