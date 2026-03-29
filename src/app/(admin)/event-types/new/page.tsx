import { EventTypeForm } from '../components/EventTypeForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewEventTypePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/event-types" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Add a new event type</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new event type for people to book times with.</p>
      </div>

      <EventTypeForm />
    </div>
  )
}
