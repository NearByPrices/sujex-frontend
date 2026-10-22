'use client'

import { use } from 'react'
import Link from 'next/link'
import { useEmployee } from '@/hooks/useHr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Mail, Phone, Briefcase, Calendar } from 'lucide-react'
import { RecordEditor, RecordField } from '@/components/ui/record-editor'
import api from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

const statusColor: Record<string, 'success' | 'warning' | 'default' | 'danger'> = {
  Active: 'success',
  OnLeave: 'warning',
  Resigned: 'default',
  Terminated: 'danger',
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: employee, isLoading } = useEmployee(id)
  const qc = useQueryClient()

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading…</div>
  if (!employee) return <div className="py-8 text-center text-gray-400">Employee not found</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/hr/employees">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{employee.fullName}</h1>
        <Badge variant={statusColor[employee.status] ?? 'default'}>{employee.status}</Badge>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase size={15} className="text-gray-400" />
          <span className="font-mono text-gray-500">{employee.employeeCode}</span>
          {employee.departmentName && <span>· {employee.departmentName}</span>}
          {employee.designationName && <span>· {employee.designationName}</span>}
        </div>

        {employee.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={15} className="text-gray-400" />
            <a href={`mailto:${employee.email}`} className="hover:text-blue-600">{employee.email}</a>
          </div>
        )}

        {employee.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={15} className="text-gray-400" />
            <span>{employee.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={15} className="text-gray-400" />
          <span>Joined {formatDate((employee as unknown as { joinDate?: string }).joinDate ?? employee.hireDate ?? new Date())}</span>
        </div>

        {employee.basicSalary != null && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Salary:</span> ${employee.basicSalary.toLocaleString()}
          </div>
        )}

        <div className="text-xs text-gray-400 pt-2 border-t">Added {formatDate(employee.createdAt)}</div>
      </div>
      <div className="mt-4"><RecordEditor value={employee as unknown as Record<string, unknown>} fields={employeeFields} onSave={async data => { await api.put(`/api/v1/hr/employees/${id}`, data); await qc.invalidateQueries({ queryKey: ['employee', id] }); await qc.invalidateQueries({ queryKey: ['employees'] }) }} /></div>
    </div>
  )
}

const employeeFields: RecordField[] = [
  { key: 'firstName', label: 'First name', required: true }, { key: 'lastName', label: 'Last name', required: true },
  { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }, { key: 'joinDate', label: 'Join date', required: true, type: 'date' },
  { key: 'dateOfBirth', label: 'Date of birth', type: 'date' }, { key: 'departmentId', label: 'Department ID' }, { key: 'designationId', label: 'Designation ID' },
  { key: 'managerId', label: 'Manager ID' }, { key: 'status', label: 'Status', required: true, type: 'select', options: ['Active', 'OnLeave', 'Resigned', 'Terminated'] },
  { key: 'basicSalary', label: 'Basic salary', type: 'number' }, { key: 'nationalId', label: 'National ID' }, { key: 'bankAccount', label: 'Bank account' },
]
