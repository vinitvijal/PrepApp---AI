import React from "react";
import { Brain, Trophy, FileUser, Briefcase, Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


interface StatsProps {
    totalTests: number;
    completedTests: number;
    avgScore: string;
    totalResumes: number;
    totalApplications: number;
    pendingFollowups: number;
}
export default function DashboardStats({ stats }: { stats: StatsProps }) {
  const statItems = [
    {
      title: "Tests Taken",
      value: stats.totalTests || 0,
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Average Score",
      value: `${stats.avgScore || 0}%`,
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    {
      title: "Resumes",
      value: stats.totalResumes || 0,
      icon: FileUser,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Applications",
      value: stats.totalApplications || 0,
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Completed",
      value: stats.completedTests || 0,
      icon: Target,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      title: "Follow-ups",
      value: stats.pendingFollowups || 0,
      icon: Clock,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.title} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow duration-200`}>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}