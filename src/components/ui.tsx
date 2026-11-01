import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { X } from 'lucide-react'

export const panel = 'rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl'

export function Button({ className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-950/40 hover:brightness-110',
    secondary: 'border border-slate-600 bg-slate-800/80 text-slate-100 hover:border-cyan-500/60 hover:bg-slate-700/80',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    danger: 'text-rose-300 hover:bg-rose-500/10',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props} />
}

export function Field({ label, hint, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return <label className={`block ${className}`}>
    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    <input className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10" {...props} />
    {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
  </label>
}

export function SelectField({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    <select className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-500" {...props}>{children}</select>
  </label>
}

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">{eyebrow}</p><h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>{description && <p className="mt-1.5 max-w-2xl text-sm text-slate-400">{description}</p>}</div>
    {action}
  </div>
}

export function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return <div className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${type === 'success' ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100' : 'border-rose-500/30 bg-rose-950/90 text-rose-100'}`}>
    <span className={`h-2 w-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />{message}
    <button onClick={onClose} aria-label="Close notification" className="ml-auto text-current opacity-70 hover:opacity-100"><X size={16} /></button>
  </div>
}
