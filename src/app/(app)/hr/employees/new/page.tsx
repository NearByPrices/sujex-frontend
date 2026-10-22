'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCreateEmployee, useDepartments } from '@/hooks/useHr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  employeeCode: z.string().min(1, 'Employee code required'),
  hireDate: z.string().min(1, 'Hire date required'),
  departmentId: z.string().optional(),
  basicSalary: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewEmployeePage() {
  const router = useRouter()
  const { data: departments } = useDepartments()
  const createEmployee = useCreateEmployee()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await createEmployee.mutateAsync({
      ...data,
      basicSalary: data.basicSalary ? parseFloat(data.basicSalary) : undefined,
      email: data.email || undefined,
    })
    router.push('/hr/employees')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/hr/employees">
          <Link href="/hr/employees"><Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button></Link>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Employee</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Employee Code" error={errors.employeeCode?.message} {...register('employeeCode')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" {...register('phone')} />
        <Input label="Hire Date" type="date" error={errors.hireDate?.message} {...register('hireDate')} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            {...register('departmentId')}
          >
            <option value="">— None —</option>
            {departments?.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <Input label="Basic Salary" type="number" step="0.01" {...register('basicSalary')} />

        {createEmployee.error && (
          <p className="text-sm text-red-600">Failed to create employee. Please try again.</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={isSubmitting}>Create Employee</Button>
          <Link href="/hr/employees"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  )
}
