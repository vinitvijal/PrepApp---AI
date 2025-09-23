'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { Application, ApplicationStatus, ApplicationType, Priority } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export default function ApplicationForm({ application, onSave, onClose, userId }: { application: Application | null, onSave: (data: Application) => void, onClose: () => void, userId: string }) {
  const [formData, setFormData] = useState<Application>(application || 
      {
        id: uuidv4(),
        userId: userId,
        companyName: "ABC",
        role: "SDE Intern",
        applicationDate: null,
        status: "applied",
        applicationType: "internship",
        recruiterName: '',
        recruiterEmail: '',
        jobDescription: '',
        salaryRange: '',
        interviewDate: null,
        followUpDate: null,
        notes: '',
        priority: "medium",
        applicationUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  const statusOptions: { value: ApplicationStatus, label: string }[] = [
    { value: "applied", label: "Applied" },
    { value: "under_review", label: "Under Review" },
    { value: "interview_scheduled", label: "Interview Scheduled" },
    { value: "rejected", label: "Rejected" },
    { value: "offer_received", label: "Offer Received" },
    { value: "accepted", label: "Accepted" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {application ? 'Edit Application' : 'New Application'}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Company Name *</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Role *</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as ApplicationStatus})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Type</Label>
              <Select
                value={formData.applicationType}
                onValueChange={(value) => setFormData({...formData, applicationType: value as ApplicationType})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value as Priority})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Application Date</Label>
              <Input
                type="date"
                value={formData.applicationDate ? formData.applicationDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, applicationDate: new Date(e.target.value)})}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Follow-up Date</Label>
              <Input
                type="date"
                value={formData.followUpDate ? formData.followUpDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, followUpDate: new Date(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Recruiter Name</Label>
              <Input
                value={formData.recruiterName || ''}
                onChange={(e) => setFormData({...formData, recruiterName: e.target.value})}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Recruiter Email</Label>
              <Input
                type="email"
                value={formData.recruiterEmail || ''}
                onChange={(e) => setFormData({...formData, recruiterEmail: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Application URL</Label>
            <Input
              type="url"
              placeholder="Link to job posting or application portal"
              value={formData.applicationUrl || ''}
              onChange={(e) => setFormData({...formData, applicationUrl: e.target.value})}
            />
          </div>

          {formData.status === 'interview_scheduled' && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Interview Date & Time</Label>
              <Input
                type="datetime-local"
                value={formData.interviewDate ? formData.interviewDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, interviewDate: new Date(e.target.value)})}
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Notes</Label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              placeholder="Additional notes, preparation steps, etc."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
