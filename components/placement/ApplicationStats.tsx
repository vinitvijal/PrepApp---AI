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
      title: "TOTAL APPS",
      value: stats.total,
      icon: Building,
      color: "bg-blue-400"
    },
    {
      title: "APPLIED",
      value: stats.applied,
      icon: Clock,
      color: "bg-yellow-400"
    },
    {
      title: "INTERVIEWS",
      value: stats.interviews,
      icon: Calendar,
      color: "bg-purple-400"
    },
    {
      title: "OFFERS",
      value: stats.offers,
      icon: Trophy,
      color: "bg-green-400"
    },
    {
      title: "REJECTED",
      value: stats.rejected,
      icon: XCircle,
      color: "bg-red-400"
    },
    {
      title: "FOLLOW-UPS",
      value: stats.pending_followups,
      icon: CheckCircle,
      color: "bg-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={stat.title}
          className={`${stat.color} brutalist-border brutalist-shadow p-4 transform transition-all duration-200 hover:scale-105 ${
            index % 2 === 0 ? 'rotate-1' : '-rotate-1'
          } hover:rotate-0`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <stat.icon className="w-6 h-6 text-black" />
            <div className="text-2xl font-black text-black">{stat.value}</div>
            <div className="text-xs font-bold text-black tracking-wider">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}