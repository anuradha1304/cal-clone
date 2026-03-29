'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event type?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/event-types/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete event type.')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to delete event type.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 text-gray-400 hover:text-red-600 transition-colors ${
        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Delete Event"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
