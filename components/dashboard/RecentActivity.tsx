import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, Trophy, Calendar } from "lucide-react";

export default function RecentActivity({ title, items, type, emptyMessage, icon: Icon }) {
  if (items.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-gray-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Icon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                index !== items.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {type === 'tests' ? (
                    <>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.subject?.replace('_', ' ')}
                        </Badge>
                        {item.status === 'completed' && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            <Trophy className="w-3 h-3 mr-1" />
                            {item.score}%
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.company_name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{item.role}</p>
                      <Badge 
                        variant={
                          item.status === 'applied' ? 'secondary' :
                          item.status === 'interview_scheduled' ? 'default' :
                          item.status === 'offer_received' ? 'default' :
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {item.status?.replace('_', ' ')}
                      </Badge>
                    </>
                  )}
                </div>
                <div className="text-right flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    {format(new Date(item.created_date), "MMM d")}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}