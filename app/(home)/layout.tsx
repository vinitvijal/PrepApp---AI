'use client'
import React from "react";
import { 
  LayoutDashboard, 
  Brain, 
  FileUser, 
  Briefcase, 
  Settings, 
  Zap,
  Crown,
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { User } from "@/entities/User";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [user, setUser] = React.useState(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
    //   const { data: userData } = await SupabaseClient.auth.getUser();
    //   setUser(userData);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const navigationItems = [
    {
      title: "Dashboard",
      url: "Dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600"
    },
    {
      title: "Mock Tests",
      url: "MockTests", 
      icon: Brain,
      color: "text-purple-600"
    },
    {
      title: "Resume Manager",
      url: "ResumeManager",
      icon: FileUser,
      color: "text-green-600"
    },
    {
      title: "Placement Tracker",
      url: "PlacementTracker",
      icon: Briefcase,
      color: "text-orange-600"
    }
  ];

  const isActive = (url: string) => location.startsWith(url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b shadow-sm p-4 relative z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">PrepApp</h1>
              <p className="text-xs text-gray-500">DU Student Portal</p>
            </div>
          </div>
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="sm"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">PrepApp</h1>
              <p className="text-sm text-gray-500">DU Student Portal</p>
            </div>
          </div>
        </div>

        {/* User Status */}
        {/* {user && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{user.full_name}</p>
              <p className="text-sm text-gray-600">{user.course} • {user.year} Year</p>
              <Badge variant={user.subscription_status === 'pro' ? 'default' : 'secondary'} className="text-xs">
                {user.subscription_status === 'pro' ? (
                  <><Crown className="w-3 h-3 mr-1" />Pro Member</>
                ) : (
                  'Free Plan'
                )}
              </Badge>
            </div>
          </div>
        )} */}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`block transition-colors duration-200`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.url) 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <item.icon className={`w-5 h-5 ${isActive(item.url) ? 'text-blue-700' : item.color}`} />
                <span className="font-medium">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2024 PrepApp for DU Students
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}