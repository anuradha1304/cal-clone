'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    // In a real app we would use window.location.origin
    // but for this UI purpose, a relative or fake absolute works if not deployed
    const url = `${window.location.origin}/book/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center group"
      aria-label="Copy link"
      title="Copy link"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <Link2 className="h-4 w-4 group-hover:text-zinc-950" />
      )}
    </button>
  )
}
