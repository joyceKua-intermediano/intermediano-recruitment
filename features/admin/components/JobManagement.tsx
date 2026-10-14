'use client'

import { useState } from 'react'
import { useGetJobs, useCreateJob, useUpdateJob, useDeleteJob, useToggleJobStatus } from '../hooks/useJobManagement'
import { useAdminJobStore } from '@/lib/stores/admin/jobStore'
import { CreateJobInput, UpdateJobInput, Job, createJobSchema, updateJobSchema } from '../schemas/jobSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, EyeOff, Briefcase, Users, Calendar, NotebookPen } from 'lucide-react'
import { toast } from 'sonner'
import InterviewQuestionsDialog from '@/features/ai-interview/components/dialog/InterviewQuestionsDialog'
import { cn } from '@/lib/utils'

export function JobManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [jobId, setJobId] = useState("");
  const [jobTitle, setJobTitle] = useState<string>("");

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    fields: Partial<Record<keyof CreateJobInput, string>>
    arrays: Partial<
      Record<
        'essentialSkills' | 'responsibilities' | 'qualifications',
        Record<number, string>
      >
    >
  }>({ fields: {}, arrays: {} })
  const [formData, setFormData] = useState<CreateJobInput>({
    jobId: '',
    title: '',
    category: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    essentialSkills: [''],
    responsibilities: [''],
    qualifications: [''],
    isActive: true,
  })

  const { jobs, pagination, isLoading, error } = useAdminJobStore()
  const { refetch } = useGetJobs(currentPage, 10)
  const createJobMutation = useCreateJob()
  const updateJobMutation = useUpdateJob()
  const deleteJobMutation = useDeleteJob()
  const toggleStatusMutation = useToggleJobStatus()

  const handleInputChange = (field: keyof CreateJobInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors((prev) => {
      if (!prev.fields[field]) return prev
      const { [field]: _removed, ...rest } = prev.fields
      return { ...prev, fields: rest }
    })
  }

  const handleArrayInputChange = (field: keyof CreateJobInput, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }))
    if (
      field === 'essentialSkills' ||
      field === 'responsibilities' ||
      field === 'qualifications'
    ) {
      setValidationErrors((prev) => {
        const current = prev.arrays[field]
        if (!current?.[index]) return prev
        const { [index]: _removed, ...rest } = current
        return { ...prev, arrays: { ...prev.arrays, [field]: rest } }
      })
    }
  }

  const addArrayItem = (field: keyof CreateJobInput) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]).filter(item => item.trim() !== ''), '']
    }))
  }

  const removeArrayItem = (field: keyof CreateJobInput, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
    if (
      field === 'essentialSkills' ||
      field === 'responsibilities' ||
      field === 'qualifications'
    ) {
      setValidationErrors((prev) => {
        const current = prev.arrays[field]
        if (!current || Object.keys(current).length === 0) return prev

        const next: Record<number, string> = {}
        for (const [k, v] of Object.entries(current)) {
          const i = Number(k)
          if (Number.isNaN(i) || i === index) continue
          next[i > index ? i - 1 : i] = v
        }

        return { ...prev, arrays: { ...prev.arrays, [field]: next } }
      })
    }
  }

  const resetForm = () => {
    setFormData({
      jobId: '',
      title: '',
      category: '',
      description: '',
      location: '',
      type: '',
      salary: '',
      essentialSkills: [''],
      responsibilities: [''],
      qualifications: [''],
      isActive: true,
    })
    setValidationErrors({ fields: {}, arrays: {} })
  }

  const cleanFormData = (data: CreateJobInput): CreateJobInput => {
    return {
      ...data,
      essentialSkills: data.essentialSkills.filter(skill => skill.trim() !== ''),
      responsibilities: data.responsibilities.filter(resp => resp.trim() !== ''),
      qualifications: data.qualifications.filter(qual => qual.trim() !== ''),
    }
  }

  const handleCreateJob = async () => {
    const result = createJobSchema.safeParse(formData)
    if (!result.success) {
      const nextErrors: typeof validationErrors = { fields: {}, arrays: {} }
      for (const issue of result.error.issues) {
        const [field, index] = issue.path
        if (
          field === 'essentialSkills' ||
          field === 'responsibilities' ||
          field === 'qualifications'
        ) {
          if (typeof index === 'number') {
            nextErrors.arrays[field] ??= {}
            nextErrors.arrays[field]![index] = issue.message
          } else if (!nextErrors.fields[field]) {
            nextErrors.fields[field] = issue.message
          }
          continue
        }

        if (typeof field === 'string' && !nextErrors.fields[field as keyof CreateJobInput]) {
          nextErrors.fields[field as keyof CreateJobInput] = issue.message
        }
      }

      setValidationErrors(nextErrors)
      toast.error('Please fix the highlighted fields.')
      return
    }
    setValidationErrors({ fields: {}, arrays: {} })

    try {
      const cleanedData = cleanFormData(formData)
      await createJobMutation.mutateAsync(cleanedData)
      toast.success('Job created successfully!')
      setIsCreateDialogOpen(false)
      resetForm()
      refetch()
    } catch (error) {
      console.error('Job creation error:', error)
      if (error instanceof Error) {
        toast.error(`Failed to create job: ${error.message}`)
      } else {
        toast.error('Failed to create job')
      }
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setFormData({
      jobId: job.jobId,
      title: job.title,
      category: job.category,
      description: job.description,
      location: job.location,
      type: job.type,
      salary: job.salary,
      essentialSkills: job.essentialSkills,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      isActive: job.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateJob = async () => {
    if (!editingJob) return

    const result = updateJobSchema.safeParse({ id: editingJob.id, ...formData })
    if (!result.success) {
      const nextErrors: typeof validationErrors = { fields: {}, arrays: {} }
      for (const issue of result.error.issues) {
        const [field, index] = issue.path
        if (
          field === 'essentialSkills' ||
          field === 'responsibilities' ||
          field === 'qualifications'
        ) {
          if (typeof index === 'number') {
            nextErrors.arrays[field] ??= {}
            nextErrors.arrays[field]![index] = issue.message
          } else if (!nextErrors.fields[field]) {
            nextErrors.fields[field] = issue.message
          }
          continue
        }

        if (typeof field === 'string' && !nextErrors.fields[field as keyof CreateJobInput]) {
          nextErrors.fields[field as keyof CreateJobInput] = issue.message
        }
      }

      setValidationErrors(nextErrors)
      toast.error('Please fix the highlighted fields.')
      return
    }
    setValidationErrors({ fields: {}, arrays: {} })

    try {
      const cleanedData = cleanFormData(formData)
      console.log('Updating job data:', cleanedData)
      await updateJobMutation.mutateAsync({
        id: editingJob.id,
        ...cleanedData
      })
      toast.success('Job updated successfully!')
      setIsEditDialogOpen(false)
      setEditingJob(null)
      resetForm()
      refetch()
    } catch (error) {
      console.error('Job update error:', error)
      if (error instanceof Error) {
        toast.error(`Failed to update job: ${error.message}`)
      } else {
        toast.error('Failed to update job')
      }
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      await deleteJobMutation.mutateAsync(jobId)
      toast.success('Job deleted successfully!')
      refetch()
    } catch (error) {
      toast.error('Failed to delete job')
    }
  }

  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: jobId,
        isActive: !currentStatus
      })
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
      refetch()
    } catch (error) {
      toast.error('Failed to update job status')
    }
  }

  const renderArrayInputs = (field: keyof CreateJobInput, label: string) => (
    <div className="space-y-2">
      <Label className={cn(validationErrors.fields[field] && 'text-red-600')}>
        {label} *
      </Label>
      {validationErrors.fields[field] && (
        <p className="text-sm text-red-600">{validationErrors.fields[field]}</p>
      )}
      {(formData[field] as string[]).map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleArrayInputChange(field, index, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className={cn(
              (field === 'essentialSkills' ||
                field === 'responsibilities' ||
                field === 'qualifications') &&
                validationErrors.arrays[field]?.[index] &&
                'border-red-500 focus-visible:ring-red-500'
            )}
          />
          {(field === 'essentialSkills' ||
            field === 'responsibilities' ||
            field === 'qualifications') &&
            validationErrors.arrays[field]?.[index] && (
              <p className="self-center text-xs text-red-600">
                {validationErrors.arrays[field]![index]}
              </p>
            )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeArrayItem(field, index)}
            disabled={(formData[field] as string[]).length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addArrayItem(field)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  )

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Create and manage job postings</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogDescription>Fill in the details to create a new job posting</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobId" className={cn(validationErrors.fields.jobId && 'text-red-600')}>
                  Job ID *
                </Label>
                <Input
                  id="jobId"
                  value={formData.jobId}
                  onChange={(e) => handleInputChange('jobId', e.target.value)}
                  placeholder="e.g., DEV-001"
                  className={cn(validationErrors.fields.jobId && 'border-red-500 focus-visible:ring-red-500')}
                />
                {validationErrors.fields.jobId && (
                  <p className="text-sm text-red-600">{validationErrors.fields.jobId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className={cn(validationErrors.fields.title && 'text-red-600')}>
                  Job Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Senior Developer"
                  className={cn(validationErrors.fields.title && 'border-red-500 focus-visible:ring-red-500')}
                />
                {validationErrors.fields.title && (
                  <p className="text-sm text-red-600">{validationErrors.fields.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className={cn(validationErrors.fields.category && 'text-red-600')}>
                  Category *
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Development"
                  className={cn(validationErrors.fields.category && 'border-red-500 focus-visible:ring-red-500')}
                />
                {validationErrors.fields.category && (
                  <p className="text-sm text-red-600">{validationErrors.fields.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className={cn(validationErrors.fields.location && 'text-red-600')}>
                  Location *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., New York, NY"
                  className={cn(validationErrors.fields.location && 'border-red-500 focus-visible:ring-red-500')}
                />
                {validationErrors.fields.location && (
                  <p className="text-sm text-red-600">{validationErrors.fields.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className={cn(validationErrors.fields.type && 'text-red-600')}>
                  Job Type *
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className={cn(validationErrors.fields.type && 'border-red-500 focus-visible:ring-red-500')}>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.fields.type && (
                  <p className="text-sm text-red-600">{validationErrors.fields.type}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className={cn(validationErrors.fields.salary && 'text-red-600')}>
                  Salary *
                </Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="e.g., $80,000 - $120,000"
                  className={cn(validationErrors.fields.salary && 'border-red-500 focus-visible:ring-red-500')}
                />
                {validationErrors.fields.salary && (
                  <p className="text-sm text-red-600">{validationErrors.fields.salary}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className={cn(validationErrors.fields.description && 'text-red-600')}>
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter job description... (You can use basic HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, etc.)"
                rows={6}
                className={cn(
                  'min-h-[150px]',
                  validationErrors.fields.description &&
                    'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {validationErrors.fields.description && (
                <p className="text-sm text-red-600">{validationErrors.fields.description}</p>
              )}
              <p className="text-xs text-gray-500">
                Tip: You can use basic HTML tags like &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;ul&gt;&lt;li&gt;lists&lt;/li&gt;&lt;/ul&gt;
              </p>
            </div>
            {renderArrayInputs('essentialSkills', 'Essential Skills')}
            {renderArrayInputs('responsibilities', 'Responsibilities')}
            {renderArrayInputs('qualifications', 'Qualifications')}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob} disabled={createJobMutation.isPending}>
                {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    {job.title}
                  </CardTitle>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span>{job.category}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span>{job.location}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="capitalize">{job.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={ () => {
                  setIsQuestionDialogOpen(true)
                  setJobId(job.id)
                  setJobTitle(job.title)
                }}>
                <NotebookPen />
                </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleStatus(job.id, job.isActive)}
                    disabled={toggleStatusMutation.isPending}
                  >
                    {job.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditJob(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deleteJobMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{job._count?.applications || 0} applications</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-green-600 font-medium">{job.salary}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <InterviewQuestionsDialog jobId={jobId} jobTitle={jobTitle}  open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}/>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Update the job posting details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-jobId" className={cn(validationErrors.fields.jobId && 'text-red-600')}>
                Job ID *
              </Label>
              <Input
                id="edit-jobId"
                value={formData.jobId}
                onChange={(e) => handleInputChange('jobId', e.target.value)}
                placeholder="e.g., DEV-001"
                className={cn(validationErrors.fields.jobId && 'border-red-500 focus-visible:ring-red-500')}
              />
              {validationErrors.fields.jobId && (
                <p className="text-sm text-red-600">{validationErrors.fields.jobId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title" className={cn(validationErrors.fields.title && 'text-red-600')}>
                Job Title *
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior Developer"
                className={cn(validationErrors.fields.title && 'border-red-500 focus-visible:ring-red-500')}
              />
              {validationErrors.fields.title && (
                <p className="text-sm text-red-600">{validationErrors.fields.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className={cn(validationErrors.fields.category && 'text-red-600')}>
                Category *
              </Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Development"
                className={cn(validationErrors.fields.category && 'border-red-500 focus-visible:ring-red-500')}
              />
              {validationErrors.fields.category && (
                <p className="text-sm text-red-600">{validationErrors.fields.category}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location" className={cn(validationErrors.fields.location && 'text-red-600')}>
                Location *
              </Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., New York, NY"
                className={cn(validationErrors.fields.location && 'border-red-500 focus-visible:ring-red-500')}
              />
              {validationErrors.fields.location && (
                <p className="text-sm text-red-600">{validationErrors.fields.location}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type" className={cn(validationErrors.fields.type && 'text-red-600')}>
                Job Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className={cn(validationErrors.fields.type && 'border-red-500 focus-visible:ring-red-500')}>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.fields.type && (
                <p className="text-sm text-red-600">{validationErrors.fields.type}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-salary" className={cn(validationErrors.fields.salary && 'text-red-600')}>
                Salary *
              </Label>
              <Input
                id="edit-salary"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="e.g., $80,000 - $120,000"
                className={cn(validationErrors.fields.salary && 'border-red-500 focus-visible:ring-red-500')}
              />
              {validationErrors.fields.salary && (
                <p className="text-sm text-red-600">{validationErrors.fields.salary}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description" className={cn(validationErrors.fields.description && 'text-red-600')}>
              Description *
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter job description... (You can use basic HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, etc.)"
              rows={6}
              className={cn(
                'min-h-[150px]',
                validationErrors.fields.description &&
                  'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {validationErrors.fields.description && (
              <p className="text-sm text-red-600">{validationErrors.fields.description}</p>
            )}
            <p className="text-xs text-gray-500">
              Tip: You can use basic HTML tags like &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;ul&gt;&lt;li&gt;lists&lt;/li&gt;&lt;/ul&gt;
            </p>
          </div>
          {renderArrayInputs('essentialSkills', 'Essential Skills')}
          {renderArrayInputs('responsibilities', 'Responsibilities')}
          {renderArrayInputs('qualifications', 'Qualifications')}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className='cursor-pointer'>
              Cancel
            </Button>
            <Button onClick={handleUpdateJob} disabled={updateJobMutation.isPending} className='cursor-pointer'>
              {updateJobMutation.isPending ? 'Updating...' : 'Update Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
