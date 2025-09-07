'use client'
import React from "react";
import { 
  LayoutDashboard, 
  Brain, 
  FileUser, 
  Briefcase, 
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { User } from "@/entities/User";



export default function Layout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
    //   const { data: userData } = await SupabaseClient.auth.getUser();
    //   setUser(userData);
    const { data 
        
    } = await supabase.auth.getUser();
    setUser(data.user);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const navigationItems = [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600"
    },
    {
      title: "Mock Tests",
      url: "mock-tests", 
      icon: Brain,
      color: "text-purple-600"
    },
    {
      title: "Resume Manager",
      url: "resume-manager",
      icon: FileUser,
      color: "text-green-600"
    },
    {
      title: "Placement Tracker",
      url: "placement-tracker",
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src='/logo.png' alt="Logo" width={100} height={100} className="w-10 h-10 text-white" />
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
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Image src='/logo.png' alt="Logo" width={100} height={100} className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">PrepApp</h1>
              <p className="text-sm text-gray-500">DU Student Portal</p>
            </div>
          </div>
        </div>

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

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 PrepApp for DU Students
          </p>
        </div>
      </div>

      <div className="lg:ml-64">
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