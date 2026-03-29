'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { EventTypeForm } from '../../components/EventTypeForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditEventTypePage() {
  const params = useParams()
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch('/api/event-types/' + params.id)
        .then((r) => r.json())
        .then((data) => {
          setInitialData({ ...data, description: data.description || '' })
          setLoading(false)
        })
    }
  }, [params.id])

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/event-types"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back
      </Link>
      <h1 className="text-2xl font-semibold mb-8">Edit event type</h1>
      {initialData && <EventTypeForm initialData={initialData} />}
    </div>
  )
}
