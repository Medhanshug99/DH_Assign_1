'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadProof } from './actions'

export function UploadProofForm({ resultId }: { resultId: string }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await uploadProof(resultId, url)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input 
        type="url" 
        placeholder="Paste image URL of your scores..." 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        required
        className="text-sm"
      />
      <Button type="submit" size="sm" isLoading={loading}>
        Submit Proof
      </Button>
    </form>
  )
}
