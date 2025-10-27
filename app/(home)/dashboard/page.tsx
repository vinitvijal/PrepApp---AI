'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Briefcase, 
  Trophy, 
  Crown,
} from "lucide-react";

import DashboardStats, { Stats } from "@/components/dashboard/stats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions"; 
import { getApplications, getDashboardStats, getTests, getUser } from "@/app/server/db";
import { Application, Test, User } from "@prisma/client";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTests, setRecentTests] = useState<Test[]>([]);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await getUser();
      if (!userData){
        console.log("User not found");
        return;
      }
      setUser(userData);

      if (!userData) {
        console.log("User not logged in");
        return;
      }

      const dashboardData = await getDashboardStats();

      if (!dashboardData) {
        console.log("No dashboard data available");
        return;
      }
      const tests = await getTests(5);
      const applications = await getApplications(5);

      setRecentTests(tests);
      setRecentApps(applications);

      setStats({
        totalTests: dashboardData?.totalTests,
        completedTests: dashboardData?.completedTests,
        avgScore: dashboardData?.avgScore.toFixed(1),
        totalResumes: dashboardData?.totalResumes,
        totalApplications: dashboardData?.totalApplications,
        pendingFollowups: dashboardData?.pendingFollowups
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 py-8">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center ring-1 ring-gray-200">
            <Trophy className="w-7 h-7 text-gray-700" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
          Welcome to PrepApp
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Your platform for placement preparation featuring AI-powered mock tests, resume optimization, and application tracking.
        </p>
      </div>

      {/* User Welcome */}
      {user && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-sm text-gray-600">
                  {user.course} • {user.graduationYear} Year • {user.university}
                </p>
              </div>
              {user.subscription !== 'pro' && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {stats && <DashboardStats stats={stats} />}
      {/* Quick Actions */}
      {user && <QuickActions userType={user.subscription} />}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity 
          title="Recent Mock Tests"
          items={recentTests}
          type="tests"
          emptyMessage="No tests taken yet"
          icon={Brain}
        />
        <RecentActivity 
          title="Recent Applications"
          items={recentApps}
          type="applications"
          emptyMessage="No applications yet"
          icon={Briefcase}
        />
      </div>
    </div>
  );
}