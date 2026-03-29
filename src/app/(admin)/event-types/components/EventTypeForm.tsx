'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const eventTypeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  duration: z.coerce.number().min(15).max(120),
  slug: z.string().min(1, 'URL Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
})

type EventTypeFormValues = z.infer<typeof eventTypeSchema>

interface EventTypeFormProps {
  initialData?: EventTypeFormValues & { id: string }
}

export function EventTypeForm({ initialData }: EventTypeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<EventTypeFormValues>({
    resolver: zodResolver(eventTypeSchema) as any,
    defaultValues: initialData || {
      title: '',
      description: '',
      duration: 30,
      slug: '',
    },
  })

  const titleValue = watch('title')

  // Auto-generate slug from title only if user hasn't explicitly touched the slug field
  useEffect(() => {
    if (!isEditing && !touchedFields.slug && titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [titleValue, isEditing, touchedFields.slug, setValue])

  const onSubmit = async (data: EventTypeFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing ? `/api/event-types/${initialData.id}` : '/api/event-types'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to save event type')
      }

      router.push('/event-types')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-gray-200 rounded-lg max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <div className="mt-1">
          <input
            {...register('title')}
            type="text"
            id="title"
            className={`block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g. 30 Min Meeting"
          />
        </div>
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          URL Slug
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            cal.com/
          </span>
          <input
            {...register('slug')}
            type="text"
            id="slug"
            className={`block w-full min-w-0 flex-1 rounded-none rounded-r-md border py-2 px-3 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm ${
              errors.slug ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="30-min-meeting"
          />
        </div>
        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <div className="mt-1">
          <select
            {...register('duration')}
            id="duration"
            className={`block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm ${
              errors.duration ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            className={`block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="A quick 30 minute chat to discuss..."
          />
        </div>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push('/event-types')}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
