import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileUser, Briefcase,  Zap, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Subscription } from "@prisma/client";

export default function QuickActions({ userType }: { userType: Subscription }) {
  const actions = [
    {
      title: "Take Mock Test",
      description: "AI-generated questions tailored to your level",
      icon: Brain,
      url: "/mock-tests",
      tileBg: "bg-blue-50 ring-blue-100",
      iconColor: "text-blue-700"
    },
    {
      title: "Manage Resume",
      description: "Upload and get ATS compatibility scores",
      icon: FileUser,
      url: "/resume-manager",
      tileBg: "bg-green-50 ring-green-100",
      iconColor: "text-green-700"
    },
    {
      title: "Track Applications",
      description: "Monitor your job application progress",
      icon: Briefcase,
      url: "/placement-tracker",
      tileBg: "bg-purple-50 ring-purple-100",
      iconColor: "text-purple-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
        <p className="text-gray-600">Jump into your preparation journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link key={action.title} href={action.url} className="group">
            <Card className={`bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-14 h-14 rounded-xl ring-1 flex items-center justify-center ${action.tileBg}`}>
                    <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {userType !== 'pro' && (
        <Card className="bg-blue-50 border border-blue-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-white rounded-xl ring-1 ring-blue-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-700" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Unlock Pro Features</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>Unlimited AI Tests</div>
                <div>Advanced Analytics</div>
                <div>Premium Content</div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}