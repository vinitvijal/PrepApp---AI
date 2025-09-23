import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  Edit, 
  Calendar, 
  Mail, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from "lucide-react";

export default function ApplicationList({ applications, onEdit, onUpdate }) {
  const getStatusColor = (status: string) => {
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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
    <div className="grid gap-4">
      {applications.map((app) => (
        <Card key={app.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {app.company_name}
                    </h3>
                    <p className="text-gray-600 text-lg">{app.role}</p>
                    <p className="text-sm text-gray-500">
                      Applied on {format(new Date(app.application_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={`${getStatusColor(app.status)} font-medium`}>
                    {app.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={`${getPriorityColor(app.priority)} font-medium border`}>
                    {app.priority?.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge variant="outline" className="font-medium">
                    {app.application_type?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {app.recruiter_name && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      Recruiter Contact
                    </h4>
                    <p className="text-gray-700 font-medium">{app.recruiter_name}</p>
                    {app.recruiter_email && (
                      <p className="text-sm text-blue-600 font-medium">{app.recruiter_email}</p>
                    )}
                  </div>
                )}

                {app.follow_up_date && (
                  <div className={`rounded-lg p-4 mb-4 border ${
                    new Date(app.follow_up_date) <= new Date() 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {new Date(app.follow_up_date) <= new Date() ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className={`font-semibold text-sm ${
                        new Date(app.follow_up_date) <= new Date() 
                          ? 'text-red-800' 
                          : 'text-yellow-800'
                      }`}>
                        Follow-up {new Date(app.follow_up_date) <= new Date() ? 'Overdue' : 'Scheduled'}: {' '}
                        {format(new Date(app.follow_up_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                )}

                {app.interview_date && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-sm text-purple-800">
                        Interview: {format(new Date(app.interview_date), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>
                )}

                {app.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-700">{app.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-2 md:w-32">
                <Button
                  onClick={() => onEdit(app)}
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {app.recruiter_email && (
                  <Button
                    onClick={() => window.open(`mailto:${app.recruiter_email}`, '_blank')}
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
                {app.application_url && (
                  <Button
                    onClick={() => window.open(app.application_url, '_blank')}
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}