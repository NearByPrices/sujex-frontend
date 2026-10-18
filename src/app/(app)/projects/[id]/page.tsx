'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useProject, useProjectTasks, useCreateTask } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Plus, CheckCircle2, Circle } from 'lucide-react'

const taskStatusIcon = (status: string) =>
  status === 'Done' ? <CheckCircle2 size={15} className="text-green-500" /> : <Circle size={15} className="text-gray-300" />

const priorityColor: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-50 text-blue-700',
  High: 'bg-orange-50 text-orange-700',
  Urgent: 'bg-red-50 text-red-700',
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: project, isLoading: loadingProject } = useProject(id)
  const { data: tasks, isLoading: loadingTasks } = useProjectTasks(id)
  const createTask = useCreateTask()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')

  const addTask = async () => {
    if (!taskTitle.trim()) return
    await createTask.mutateAsync({ projectId: id, data: { title: taskTitle, status: 'Todo', priority: 'Medium' } })
    setTaskTitle('')
    setShowTaskForm(false)
  }

  if (loadingProject) return <div className="py-8 text-center text-gray-400">Loading…</div>
  if (!project) return <div className="py-8 text-center text-gray-400">Project not found</div>

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/projects">
          <Button variant="outline" size="sm"><ArrowLeft size={14} className="mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <Badge variant={project.status === 'Active' ? 'success' : 'default'}>{project.status}</Badge>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          {project.code && <div><span className="text-gray-400">Code</span><p className="font-mono mt-1">{project.code}</p></div>}
          {project.startDate && <div><span className="text-gray-400">Start</span><p className="mt-1">{formatDate(project.startDate)}</p></div>}
          {project.endDate && <div><span className="text-gray-400">End</span><p className="mt-1">{formatDate(project.endDate)}</p></div>}
          {project.budget != null && <div><span className="text-gray-400">Budget</span><p className="mt-1 font-mono">{project.budget.toLocaleString()}</p></div>}
        </div>
        {project.description && <p className="mt-3 text-sm text-gray-600">{project.description}</p>}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Tasks</h2>
          <Button size="sm" variant="outline" onClick={() => setShowTaskForm(v => !v)}>
            <Plus size={14} className="mr-1" /> Add Task
          </Button>
        </div>

        {showTaskForm && (
          <div className="mb-3 flex gap-2">
            <input
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Task title…"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              autoFocus
            />
            <Button size="sm" onClick={addTask}>Add</Button>
            <Button size="sm" variant="outline" onClick={() => setShowTaskForm(false)}>Cancel</Button>
          </div>
        )}

        <div className="rounded-lg bg-white shadow-sm border border-gray-100 divide-y">
          {loadingTasks && <div className="px-4 py-6 text-center text-sm text-gray-400">Loading…</div>}
          {!loadingTasks && tasks?.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No tasks yet</div>
          )}
          {tasks?.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3">
              {taskStatusIcon(t.status)}
              <span className={`flex-1 text-sm ${t.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {t.title}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${priorityColor[t.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                {t.priority}
              </span>
              {t.dueDate && <span className="text-xs text-gray-400">{formatDate(t.dueDate)}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
