export type NetworkResult = {
  ip: string
  prefix: number
  network: string
  broadcast: string
  mask: string
  wildcard: string
  firstHost: string
  lastHost: string
  total: number
  usable: number
  ipClass: string
  type: string
  ipBinary: string[]
  maskBinary: string[]
}

export function parseIP(ip: string): number | null {
  const parts = ip.trim().split('.')
  if (parts.length !== 4) return null
  if (parts.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return null
  return parts.reduce((value, part) => value * 256 + Number(part), 0)
}

export function numToIP(value: number) {
  const safe = Math.max(0, Math.min(0xffffffff, Math.floor(value)))
  return [24, 16, 8, 0].map((shift) => Math.floor(safe / 2 ** shift) % 256).join('.')
}

export function prefixToMask(prefix: number) {
  if (prefix === 0) return '0.0.0.0'
  const value = 2 ** 32 - 2 ** (32 - prefix)
  return numToIP(value)
}

export function maskToPrefix(mask: string): number | null {
  const value = parseIP(mask)
  if (value === null) return null
  const binary = value.toString(2).padStart(32, '0')
  if (!/^1*0*$/.test(binary)) return null
  return binary.indexOf('0') === -1 ? 32 : binary.indexOf('0')
}

export function ipClass(ip: string) {
  const first = Number(ip.split('.')[0])
  if (first === 127) return 'Loopback'
  if (first <= 126) return 'Class A'
  if (first <= 191) return 'Class B'
  if (first <= 223) return 'Class C'
  if (first <= 239) return 'Class D'
  return 'Class E'
}

export function ipType(ip: string) {
  const value = parseIP(ip)!
  const first = Number(ip.split('.')[0])
  if (value === 0xffffffff) return 'Limited broadcast'
  if (first === 10 || (value >= parseIP('172.16.0.0')! && value <= parseIP('172.31.255.255')!) ||
    (value >= parseIP('192.168.0.0')! && value <= parseIP('192.168.255.255')!)) return 'Private'
  if (first === 127) return 'Loopback'
  if (first >= 224 && first <= 239) return 'Multicast'
  if (first >= 240) return 'Reserved'
  return 'Public'
}

export function calculateNetwork(ip: string, prefix: number): NetworkResult {
  const value = parseIP(ip)
  if (value === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new Error('Enter a valid IPv4 address and a CIDR prefix from 0 to 32.')
  }
  const total = 2 ** (32 - prefix)
  const networkValue = Math.floor(value / total) * total
  const broadcastValue = networkValue + total - 1
  const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, total - 2)
  const first = prefix >= 31 ? networkValue : networkValue + 1
  const last = prefix >= 31 ? broadcastValue : broadcastValue - 1
  const mask = prefixToMask(prefix)
  const wildcard = numToIP(0xffffffff - parseIP(mask)!)
  const binary = (address: string) => address.split('.').map((octet) => Number(octet).toString(2).padStart(8, '0'))
  return {
    ip,
    prefix,
    network: numToIP(networkValue),
    broadcast: numToIP(broadcastValue),
    mask,
    wildcard,
    firstHost: numToIP(first),
    lastHost: numToIP(last),
    total,
    usable,
    ipClass: ipClass(ip),
    type: ipType(ip),
    ipBinary: binary(ip),
    maskBinary: binary(mask),
  }
}

export function generateSubnets(result: NetworkResult, requestedCount: number) {
  const count = Math.max(1, Math.min(256, requestedCount))
  const extraBits = Math.ceil(Math.log2(count))
  const prefix = result.prefix + extraBits
  if (prefix > 32) throw new Error('That many subnets cannot be created from the selected network.')
  const subnetSize = 2 ** (32 - prefix)
  const base = parseIP(result.network)!
  return Array.from({ length: count }, (_, index) => calculateNetwork(numToIP(base + index * subnetSize), prefix))
}

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)
