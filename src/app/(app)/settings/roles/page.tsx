'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Plus, X, Key } from 'lucide-react'

interface AppRole { id: string; name: string; description?: string; userCount: number; permissions: string[] }
interface Permission { id: string; code: string; name: string; module: string }

const roleSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().optional(),
})
type RoleForm = z.infer<typeof roleSchema>

export default function RolesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [permRole, setPermRole] = useState<AppRole | null>(null)
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ data: AppRole[] }>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/v1/roles').then(r => r.data),
  })

  const { data: permsData } = useQuery<{ data: Permission[] }>({
    queryKey: ['permissions'],
    queryFn: () => api.get('/api/v1/roles/permissions').then(r => r.data),
    enabled: !!permRole,
  })

  const createRole = useMutation({
    mutationFn: (d: RoleForm) => api.post('/api/v1/roles', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); setShowCreate(false); reset() },
  })

  const deleteRole = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/roles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  })

  const savePerms = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      api.post(`/api/v1/roles/${id}/permissions`, { permissions }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); setPermRole(null) },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
  })

  const roles: AppRole[] = data?.data ?? []
  const permissions: Permission[] = permsData?.data ?? []

  const permsByModule = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = []
    acc[p.module].push(p)
    return acc
  }, {} as Record<string, Permission[]>)

  const openPermissions = (role: AppRole) => {
    setPermRole(role)
    setSelectedPerms(role.permissions ?? [])
  }

  const togglePerm = (code: string) => {
    setSelectedPerms(prev => prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code])
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={14} className="mr-1" /> New Role</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Role Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Users</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && roles.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No roles defined</td></tr>
            )}
            {roles.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.description ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{r.userCount}</td>
                <td className="px-4 py-3 text-gray-600">{r.permissions?.length ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openPermissions(r)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <Key size={12} /> Permissions
                    </button>
                    <button
                      onClick={() => deleteRole.mutate(r.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Role</h2>
              <button onClick={() => { setShowCreate(false); reset() }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit((v) => createRole.mutate(v))} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role Name *</label>
                <input {...register('name')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input {...register('description')} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { setShowCreate(false); reset() }}>Cancel</Button>
                <Button type="submit" size="sm" disabled={createRole.isPending}>
                  {createRole.isPending ? 'Saving…' : 'Create Role'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {permRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl max-h-[80vh] flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Permissions — {permRole.name}</h2>
              <button onClick={() => setPermRole(null)}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {Object.entries(permsByModule).map(([module, perms]) => (
                <div key={module}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">{module}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {perms.map(p => (
                      <label key={p.code} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(p.code)}
                          onChange={() => togglePerm(p.code)}
                          className="rounded"
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {permissions.length === 0 && <p className="text-sm text-gray-400">No permissions defined yet.</p>}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" size="sm" onClick={() => setPermRole(null)}>Cancel</Button>
              <Button size="sm" disabled={savePerms.isPending}
                onClick={() => savePerms.mutate({ id: permRole.id, permissions: selectedPerms })}>
                {savePerms.isPending ? 'Saving…' : 'Save Permissions'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
