import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Edit, 
  Mail, 
  ExternalLink,
  Calendar,
  AlertTriangle,
  Building
} from "lucide-react";
import { Application, ApplicationStatus, ApplicationType, Priority } from "@prisma/client";

export default function ApplicationTable({ applications, onEdit, onUpdate }: 
    {
    applications: Application[],
    onEdit: (app: Application) => void,
    onUpdate: (app: Application) => void
    }
) {
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

  const formatApplicationType = (type: ApplicationType) => {
    return type?.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b hover:bg-white border-gray-200">
              <TableHead className="font-semibold text-gray-700">Company</TableHead>
              <TableHead className="font-semibold text-gray-700">Role</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Priority</TableHead>
              <TableHead className="font-semibold text-gray-700">Applied Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Follow-up</TableHead>
              <TableHead className="font-semibold text-gray-700">Recruiter</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="hover:bg-gray-100 transition-colors border-b border-gray-100">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    {app.companyName}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{app.role}</div>
                    <div className="text-sm text-gray-500">
                      {formatApplicationType(app.applicationType)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`${getStatusColor(app.status)} border rounded-lg px-2 py-1 text-xs font-medium`}>
                    {app.status?.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-2 py-1 text-xs font-medium">
                    {formatApplicationType(app.applicationType)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`${getPriorityColor(app.priority)} border rounded-lg px-2 py-1 text-xs font-medium`}>
                    {app.priority}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {app.applicationDate ? format(new Date(app.applicationDate), "MMM d, yyyy") : 'N/A'}
                </TableCell>
                <TableCell>
                  {app.followUpDate ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-gray-600">
                        {format(new Date(app.followUpDate), "MMM d")}
                      </span>
                      {new Date(app.followUpDate) <= new Date() && (
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {app.recruiterName ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{app.recruiterName}</div>
                      {app.recruiterEmail && (
                        <div className="text-xs text-gray-500">{app.recruiterEmail}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      onClick={() => onEdit(app)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    {app.recruiterEmail && (
                      <Button
                        onClick={() => window.open(`mailto:${app.recruiterEmail}`, '_blank')}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-white"
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                    )}
                    {app.applicationUrl && (
                      <Button
                        onClick={() => {app.applicationUrl && window.open(app.applicationUrl, '_blank')}}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}