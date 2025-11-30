'use client'

import { useEffect, useMemo, useState } from 'react'

interface ResumeViewerProps {
  fileUrl: string
  downloadName: string
  rid: string
}

export default function ResumeViewer({ fileUrl, downloadName, rid }: ResumeViewerProps) {
  const [viewerSrc, setViewerSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false

    async function loadPdf() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(fileUrl, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Preview failed (${response.status})`)
        }
        const arrayBuffer = await response.arrayBuffer()
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setViewerSrc(objectUrl)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load PDF preview')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPdf()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [fileUrl])

  const downloadHref = useMemo(() => fileUrl, [fileUrl])

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-6">
      <a
        href={downloadHref}
        download={downloadName}
        className="inline-flex w-fit items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
      >
        Download PDF
      </a>

      {loading && (
        <div className="flex h-[calc(100vh-160px)] w-full items-center justify-center border border-dashed border-slate-300 bg-white text-sm text-slate-500">
          Loading preview…
        </div>
      )}

      {error && !loading && (
        <div className="flex h-[calc(100vh-160px)] w-full flex-col items-center justify-center gap-2 border border-rose-200 bg-rose-50 px-6 text-center text-sm text-rose-600">
          <p>Unable to display the PDF inline.</p>
          <p className="text-xs text-rose-500">{error}</p>
          <p className="text-xs text-slate-600">You can still use the download button above to view the file.</p>
        </div>
      )}

      {viewerSrc && !loading && !error && (
        <object
          data={viewerSrc}
          type="application/pdf"
          className="h-[calc(100vh-160px)] w-full border border-slate-300 bg-white shadow-sm"
        >
          <iframe
            src={viewerSrc}
            title={`Resume ${rid}`}
            className="h-full w-full"
            allow="fullscreen"
          />
        </object>
      )}
    </div>
  )
}
