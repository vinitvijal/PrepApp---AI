import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function ApplicationTable({ applications, onEdit, onUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offer_received': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-green-200 text-green-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatApplicationType = (type) => {
    return type?.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-500">Start tracking your job applications to see them here.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Applied Date</TableHead>
              <TableHead className="font-semibold">Follow-up</TableHead>
              <TableHead className="font-semibold">Recruiter</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    {app.company_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{app.role}</div>
                    <div className="text-sm text-gray-500">
                      {formatApplicationType(app.application_type)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`${getStatusColor(app.status)} text-xs font-medium`}
                  >
                    {app.status?.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {formatApplicationType(app.application_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`${getPriorityColor(app.priority)} text-xs font-medium`}
                  >
                    {app.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {format(new Date(app.application_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {app.follow_up_date ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-gray-600">
                        {format(new Date(app.follow_up_date), "MMM d")}
                      </span>
                      {new Date(app.follow_up_date) <= new Date() && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {app.recruiter_name ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{app.recruiter_name}</div>
                      {app.recruiter_email && (
                        <div className="text-xs text-gray-500">{app.recruiter_email}</div>
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
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    {app.recruiter_email && (
                      <Button
                        onClick={() => window.open(`mailto:${app.recruiter_email}`, '_blank')}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                    )}
                    {app.application_url && (
                      <Button
                        onClick={() => window.open(app.application_url, '_blank')}
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