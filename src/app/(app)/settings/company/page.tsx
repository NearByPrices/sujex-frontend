'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Company { id: string; name: string; code?: string; email?: string; phone?: string; address?: string; website?: string; taxNumber?: string }

const schema = z.object({
  name: z.string().min(1, 'Company name required'),
  code: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  taxNumber: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function CompanySettingsPage() {
  const qc = useQueryClient()
  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ['company-settings'],
    queryFn: () => api.get('/api/v1/foundation/companies/current').then(r => r.data.data),
  })

  const update = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.put(`/api/v1/foundation/companies/${company?.id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['company-settings'] }),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (company) reset(company)
  }, [company, reset])

  const onSubmit = async (data: FormData) => { await update.mutateAsync(data as Record<string, unknown>) }

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading…</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <Input label="Company Name" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Code" {...register('code')} />
          <Input label="Tax Number" {...register('taxNumber')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Phone" {...register('phone')} />
        </div>
        <Input label="Website" {...register('website')} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            {...register('address')}
          />
        </div>

        {update.isSuccess && <p className="text-sm text-green-600">Settings saved successfully.</p>}
        {update.isError && <p className="text-sm text-red-600">Failed to save settings.</p>}

        <div className="pt-2">
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
