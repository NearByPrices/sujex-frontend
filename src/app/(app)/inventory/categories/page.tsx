'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProductCategories, useCreateCategory } from '@/hooks/useInventoryExtra'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  code: z.string().optional(),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: categories, isLoading } = useProductCategories()
  const createCategory = useCreateCategory()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await createCategory.mutateAsync(data as Record<string, unknown>)
    reset()
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>
          {showForm ? <><X size={14} className="mr-1" /> Cancel</> : <><Plus size={14} className="mr-1" /> Add Category</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 rounded-lg bg-white p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 gap-3">
            <Input label="Name" error={errors.name?.message} {...register('name')} />
            <Input label="Code" {...register('code')} />
            <Input label="Description" {...register('description')} />
          </div>
          <div className="mt-3">
            <Button type="submit" size="sm" isLoading={isSubmitting}>Save Category</Button>
          </div>
        </form>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && categories?.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No categories yet</td></tr>
            )}
            {categories?.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.code ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{c.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
