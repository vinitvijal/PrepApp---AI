import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  Edit, 
  Calendar, 
  Mail, 
  ExternalLink,
  AlertCircle,
  User
} from "lucide-react";
import { Application, ApplicationStatus, Priority } from "@prisma/client";

export default function ApplicationList({ applications, onEdit, onUpdate }: { 
    applications: Application[],
    onEdit: (app: Application) => void,
    onUpdate: (app: Application) => void
}) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under_review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'interview_scheduled': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'offer_received': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'accepted': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <Building className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Start tracking your job applications to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="gap-6 flex flex-1 flex-col overflow-y-auto">
      {applications.map((app) => (
        <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                    {app.companyName}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">{app.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied on {app.applicationDate ? format(new Date(app.applicationDate), "MMM d, yyyy") : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`${getStatusColor(app.status)} border rounded-lg px-3 py-1 text-xs font-medium`}>
                  {app.status?.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`${getPriorityColor(app.priority)} border rounded-lg px-3 py-1 text-xs font-medium`}>
                  {app.priority?.toUpperCase()} PRIORITY
                </span>
                <span className="bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-3 py-1 text-xs font-medium">
                  {app.applicationType?.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {app.recruiterName && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-600" />
                    Recruiter Contact
                  </h4>
                  <p className="text-gray-700 font-medium">{app.recruiterName}</p>
                  {app.recruiterEmail && (
                    <p className="text-sm text-blue-600 font-medium">{app.recruiterEmail}</p>
                  )}
                </div>
              )}

              {app.followUpDate && (
                <div className={`rounded-lg p-4 mb-4 border ${
                  new Date(app.followUpDate) <= new Date() 
                    ? 'bg-rose-50 border-rose-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {new Date(app.followUpDate) <= new Date() ? (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Calendar className="w-4 h-4 text-amber-600" />
                    )}
                    <span className={`font-semibold text-sm ${
                      new Date(app.followUpDate) <= new Date() 
                        ? 'text-rose-700'
                        : 'text-amber-700'
                    }`}>
                      Follow-up {new Date(app.followUpDate) <= new Date() ? 'Overdue' : 'Scheduled'}: {' '}
                      {format(new Date(app.followUpDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              )}

              {app.interviewDate && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-sm text-purple-700">
                      Interview: {format(new Date(app.interviewDate), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
              )}

              {app.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Notes</h4>
                  <p className="text-sm text-gray-700">{app.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-3 md:w-40">
              <Button
                onClick={() => onEdit(app)}
                className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md shadow-sm hover:shadow transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {app.recruiterEmail && (
                <Button
                  onClick={() => window.open(`mailto:${app.recruiterEmail}`, '_blank')}
                  className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md shadow-sm hover:shadow transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              )}
              {app.applicationUrl && (
                <Button
                  onClick={() => {app.applicationUrl && window.open(app.applicationUrl, '_blank')}}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}