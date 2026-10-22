'use client'

import { useEffect, useState } from 'react'
import { Button } from './button'
import { Check, Pencil, X } from 'lucide-react'

export type RecordField = {
  key: string
  label: string
  required?: boolean
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select'
  options?: string[]
}

export function RecordEditor({
  value,
  fields,
  onSave,
}: {
  value: Record<string, unknown>
  fields: RecordField[]
  onSave: (data: Record<string, unknown>) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Record<string, unknown>>(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setForm(value), [value])

  const update = (key: string, next: string | boolean) => setForm(current => ({ ...current, [key]: next }))
  const save = async () => {
    setError('')
    for (const field of fields) {
      if (field.required && !String(form[field.key] ?? '').trim()) {
        setError(`${field.label} is required.`)
        return
      }
    }
    setSaving(true)
    try {
      await onSave(form)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) return <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Pencil size={14} className="mr-1" /> Edit details</Button>

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
      <div className="mb-3 flex items-center justify-between"><p className="font-semibold text-gray-900">Edit details</p><Button size="sm" variant="ghost" onClick={() => { setForm(value); setEditing(false) }}><X size={15} /></Button></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(field => {
          const fieldValue = form[field.key]
          const common = { className: 'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none', value: fieldValue == null ? '' : field.type === 'date' ? String(fieldValue).slice(0, 10) : String(fieldValue), onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => update(field.key, event.target.value) }
          return <label key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2 text-sm text-gray-700' : 'text-sm text-gray-700'}>{field.label}{field.required && <span className="ml-1 text-red-600">*</span>}
            {field.type === 'textarea' ? <textarea {...common} rows={3} /> : field.type === 'select' ? <select {...common}>{field.options?.map(option => <option key={option} value={option}>{option}</option>)}</select> : <input {...common} type={field.type ?? 'text'} />}
          </label>
        })}
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4 flex gap-2"><Button size="sm" onClick={save} isLoading={saving}><Check size={14} className="mr-1" /> Save changes</Button><Button size="sm" variant="outline" onClick={() => { setForm(value); setEditing(false) }}>Cancel</Button></div>
    </div>
  )
}
