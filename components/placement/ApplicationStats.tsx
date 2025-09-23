import React from "react";
import { Building, Clock, CheckCircle, XCircle, Calendar, Trophy } from "lucide-react";
import { Application } from "@prisma/client";

export default function ApplicationStats({ applications }: { applications: Application[] }) {
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviews: applications.filter(a => a.status === 'interview_scheduled').length,
    offers: applications.filter(a => a.status === 'offer_received').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    pending_followups: applications.filter(a => 
      a.followUpDate && new Date(a.followUpDate) <= new Date()
    ).length
  };

  const statItems = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: Building,
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      title: "Applied",
      value: stats.applied,
      icon: Clock,
      color: "bg-amber-50 border-amber-200 text-amber-700"
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: Calendar,
      color: "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: Trophy,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "bg-rose-50 border-rose-200 text-rose-700"
    },
    {
      title: "Follow-ups Due",
      value: stats.pending_followups,
      icon: CheckCircle,
      color: "bg-orange-50 border-orange-200 text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.color} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <stat.icon className="w-5 h-5" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium tracking-wide">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}