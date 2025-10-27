import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileUser, Briefcase, Plus, Zap, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Subscription } from "@prisma/client";

export default function QuickActions({ userType }: { userType: Subscription }) {
  const actions = [
    {
      title: "Take Mock Test",
      description: "AI-generated questions tailored to your level",
      icon: Brain,
      url: "/mock-tests",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Manage Resume",
      description: "Upload and get ATS compatibility scores",
      icon: FileUser,
      url: "/resume-manager",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Track Applications",
      description: "Monitor your job application progress",
      icon: Briefcase,
      url: "/placement-tracker",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
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
            <Card className={`${action.bgColor} border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105 h-full`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-8 h-8 text-white" />
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
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-6 text-center text-white">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Unlock Pro Features</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>✨ Unlimited AI Tests</div>
                <div>📊 Advanced Analytics</div>
                <div>🎯 Premium Content</div>
              </div>
              <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
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