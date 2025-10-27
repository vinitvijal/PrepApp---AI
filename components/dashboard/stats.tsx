import React from "react";
import { Brain, Trophy, FileUser, Briefcase, Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


export interface Stats {
    totalTests: number;
    completedTests: number;
    avgScore: string;
    totalResumes: number;
    totalApplications: number;
    pendingFollowups: number;
}
export default function DashboardStats({ stats }: { stats: Stats }) {
  const statItems = [
    {
      title: "Tests Taken",
      value: stats.totalTests || 0,
      icon: Brain,
      accent: "text-blue-700"
    },
    {
      title: "Average Score",
      value: `${stats.avgScore || 0}%`,
      icon: Trophy,
      accent: "text-yellow-700"
    },
    {
      title: "Resumes",
      value: stats.totalResumes || 0,
      icon: FileUser,
      accent: "text-green-700"
    },
    {
      title: "Applications",
      value: stats.totalApplications || 0,
      icon: Briefcase,
      accent: "text-purple-700"
    },
    {
      title: "Completed",
      value: stats.completedTests || 0,
      icon: Target,
      accent: "text-indigo-700"
    },
    {
      title: "Follow-ups",
      value: stats.pendingFollowups || 0,
      icon: Clock,
      accent: "text-red-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.title} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div className={`text-xs font-medium text-gray-500`}>{stat.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}