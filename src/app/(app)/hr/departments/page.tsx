'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDepartments, useCreateDepartment } from '@/hooks/useHr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  code: z.string().optional(),
  companyId: z.string().min(1, 'Company ID required'),
})
type FormData = z.infer<typeof schema>

export default function DepartmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: departments, isLoading } = useDepartments()
  const createDepartment = useCreateDepartment()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await createDepartment.mutateAsync(data as Record<string, unknown>)
    reset()
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>
          {showForm ? <><X size={14} className="mr-1" /> Cancel</> : <><Plus size={14} className="mr-1" /> Add Department</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 rounded-lg bg-white p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">New Department</h2>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Name" error={errors.name?.message} {...register('name')} />
            <Input label="Code" {...register('code')} />
            <Input label="Company ID" error={errors.companyId?.message} {...register('companyId')} />
          </div>
          <div className="mt-3">
            <Button type="submit" size="sm" isLoading={isSubmitting}>Save</Button>
          </div>
        </form>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && departments?.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No departments yet</td></tr>
            )}
            {departments?.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{d.code ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{d.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
