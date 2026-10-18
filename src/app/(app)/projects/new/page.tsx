'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCreateProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(1, 'Project name required'),
  code: z.string().optional(),
  description: z.string().optional(),
  companyId: z.string().min(1, 'Company ID required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewProjectPage() {
  const router = useRouter()
  const createProject = useCreateProject()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await createProject.mutateAsync({
      ...data,
      budget: data.budget ? parseFloat(data.budget) : undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    })
    router.push('/projects')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/projects">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <Input label="Project Name" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Code" {...register('code')} />
          <Input label="Company ID" error={errors.companyId?.message} {...register('companyId')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            {...register('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" {...register('startDate')} />
          <Input label="End Date" type="date" {...register('endDate')} />
        </div>
        <Input label="Budget" type="number" step="0.01" {...register('budget')} />

        {createProject.error && (
          <p className="text-sm text-red-600">Failed to create project. Please try again.</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={isSubmitting}>Create Project</Button>
          <Link href="/projects"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  )
}
