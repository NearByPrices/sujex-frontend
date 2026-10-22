'use client'

import { useState } from 'react'
import { useWarehouses, useCreateWarehouse } from '@/hooks/useInventory'
import { useCompanies } from '@/hooks/useFoundation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

export default function WarehousesPage() {
  const { data, isLoading } = useWarehouses()
  const { data: companies } = useCompanies()
  const create = useCreateWarehouse()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', address: '', companyId: '' })

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    await create.mutateAsync(form)
    setForm({ name: '', code: '', address: '', companyId: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>{showForm ? <><X size={14} className="mr-1" /> Cancel</> : <><Plus size={14} className="mr-1" /> Add Warehouse</>}</Button>
      </div>

      {showForm && <form onSubmit={save} className="mb-6 grid gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-4">
        <Input label="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input label="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
        <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <div><label className="mb-1 block text-sm font-medium text-gray-700">Company</label><select required value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="">Select company</option>{companies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="md:col-span-4"><Button type="submit" isLoading={create.isPending}>Save Warehouse</Button>{create.isError && <p className="mt-2 text-sm text-red-600">Could not save warehouse. Please check the form and API connection.</p>}</div>
      </form>}

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No warehouses</td></tr>}
            {data?.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{w.name}</td>
                <td className="px-4 py-3 text-gray-600">{w.code ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{w.address ?? '—'}</td>
                <td className="px-4 py-3"><Badge variant={w.isActive ? 'success' : 'default'}>{w.isActive ? 'Active' : 'Inactive'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
