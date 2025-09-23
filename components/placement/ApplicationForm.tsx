'use client'
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { Application, ApplicationStatus, ApplicationType, Priority } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

  interface Props {
    application: Application | null
    onSave: (data: Application) => void
    onClose: () => void
    userId: string
  }

  export default function ApplicationForm({ application, onSave, onClose, userId }: Props) {
    const [formData, setFormData] = useState<Application>(
      application || {
        id: uuidv4(),
        userId,
        companyName: '',
        role: '',
        applicationDate: null,
        status: 'applied',
        applicationType: 'internship',
        recruiterName: '',
        recruiterEmail: '',
        jobDescription: '',
        salaryRange: '',
        interviewDate: null,
        followUpDate: null,
        notes: '',
        priority: 'medium',
        applicationUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    )

    const overlayRef = useRef<HTMLDivElement | null>(null)
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const firstFieldRef = useRef<HTMLInputElement | null>(null)

    const statusOptions: { value: ApplicationStatus; label: string }[] = [
      { value: 'applied', label: 'Applied' },
      { value: 'under_review', label: 'Under Review' },
      { value: 'interview_scheduled', label: 'Interview Scheduled' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'offer_received', label: 'Offer Received' },
      { value: 'accepted', label: 'Accepted' },
    ]

    const formatDate = (d: Date | null) => (d ? new Date(d).toISOString().split('T')[0] : '')
    const formatDateTimeLocal = (d: Date | null) => {
      if (!d) return ''
      const date = new Date(d)
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    useEffect(() => {
      firstFieldRef.current?.focus()
    }, [])

    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return
      const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      const getItems = () => Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(el => !el.hasAttribute('disabled'))
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return
        const items = getItems()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
      window.addEventListener('keydown', handleTab)
      return () => window.removeEventListener('keydown', handleTab)
    }, [])

    const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose()
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({ ...formData, updatedAt: new Date() })
    }

    const requiredValid = formData.companyName.trim() && formData.role.trim()

    return (
      <div
        ref={overlayRef}
        onMouseDown={handleBackdropMouseDown}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-form-title"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div ref={dialogRef} className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 animate-in fade-in-0 zoom-in-95">
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex justify-between items-start">
            <div>
              <h2 id="application-form-title" className="text-xl font-semibold tracking-tight text-gray-900">
                {application ? 'Edit Application' : 'New Application'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Press Esc or click outside to close</p>
            </div>
            <Button aria-label="Close dialog" variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Basics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input
                    ref={firstFieldRef}
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    placeholder="e.g. OpenAI"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Role *</Label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="e.g. Software Engineer Intern"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Classification</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as ApplicationStatus })}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Type</Label>
                  <Select value={formData.applicationType} onValueChange={(v) => setFormData({ ...formData, applicationType: v as ApplicationType })}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as Priority })}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Timeline</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Application Date</Label>
                    <Input type="date" value={formatDate(formData.applicationDate)} onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value ? new Date(e.target.value) : null })} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Follow-up Date</Label>
                    <Input type="date" value={formatDate(formData.followUpDate)} onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value ? new Date(e.target.value) : null })} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                {formData.status === 'interview_scheduled' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Interview Date & Time</Label>
                    <Input type="datetime-local" value={formatDateTimeLocal(formData.interviewDate)} onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value ? new Date(e.target.value) : null })} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Contacts & Links</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Recruiter Name</Label>
                    <Input value={formData.recruiterName || ''} onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })} placeholder="Jane Doe" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Recruiter Email</Label>
                    <Input type="email" value={formData.recruiterEmail || ''} onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })} placeholder="jane@company.com" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Application URL</Label>
                  <Input type="url" value={formData.applicationUrl || ''} onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })} placeholder="https://careers.company.com/jobs/123" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Notes</h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <Textarea rows={4} value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Interview prep topics, follow-up reminders, compensation details..." className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </section>

              <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" onClick={onClose} className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md shadow-sm hover:shadow transition-colors">Cancel</Button>
                <Button type="submit" disabled={!requiredValid} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md shadow-sm hover:shadow">
                  <Save className="w-4 h-4 mr-2" />
                  Save Application
                </Button>
              </div>
          </form>
        </div>
      </div>
    )
  }
