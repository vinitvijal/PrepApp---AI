import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Trophy } from "lucide-react";
import { Application, Test } from "@prisma/client";

interface RecentActivityProps {
    title: string;
    items: Test[] | Application[];
    type: 'tests' | 'applications';
    emptyMessage: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}


export default function RecentActivity({ title, items, type, emptyMessage, icon: Icon }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Icon className="w-5 h-5 text-gray-700" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-300 mb-2">
            <Icon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Icon className="w-5 h-5 text-gray-700" />
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
                        {(item as Test).title}
                      </h4>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {(item as Test).subject?.replace('_', ' ')}
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
                        {(item as Application).companyName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{(item as Application).role}</p>
                      <Badge
                        variant={
                          (item as Application).status === 'applied' ? 'secondary' :
                          (item as Application).status === 'interview_scheduled' ? 'default' :
                          (item as Application).status === 'offer_received' ? 'default' :
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
                    {format(new Date(item.createdAt), "MMM d")}
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