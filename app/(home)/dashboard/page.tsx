'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Briefcase, 
  Trophy, 
  Crown,
} from "lucide-react";

import DashboardStats from "@/components/dashboard/stats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions"; 
import { getApplications, getCurrentUser, getDashboardStats, getTests, getUser } from "@/app/server/db";
import { Application, Test, User } from "@prisma/client";

export default function Dashboard() {
  const [stats, setStats] = useState({});
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
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PrepApp</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your comprehensive platform for placement preparation, featuring AI-powered mock tests, resume optimization, and application tracking.
        </p>
      </div>

      {/* User Welcome */}
      {user && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-gray-600">
                  {user.course} • {user.graduationYear} Year • {user.university}
                </p>
              </div>
              {user.subscription !== 'pro' && (
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

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