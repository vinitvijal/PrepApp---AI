'use client'
import React from "react";
import { 
  LayoutDashboard, 
  Brain, 
  FileUser, 
  Briefcase, 
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Toaster } from "sonner";
// import { Badge } from "@/components/ui/badge";
// import { User } from "@/entities/User";



export default function Layout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const supabase = createClient();

  // Load user on component mount
  React.useEffect(() => {
    loadUser();
  }, []);



  // Load current authenticated user from Supabase
  const loadUser = async () => {
    try {
      const { data} = await supabase.auth.getUser();
      setUser(data.user);
    } catch (error) {
      console.log("User not logged in");
    }
  };


  // Navigation items for the sidebar
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



  // Check if a navigation item is active based on the current location
  const isActive = (url: string) => location.startsWith(url);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors />
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

                    <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 p-4 bg-white">
                      {user && (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {user.user_metadata.avatar_url ? (
                              <Image
                                src={user.user_metadata.avatar_url}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 font-semibold">
                                {user.user_metadata.full_name
                                  ? user.user_metadata.full_name.charAt(0)
                                  : 'U'}
                              </span>
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">
                              {user.user_metadata.full_name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email || 'No Email'}
                            </p>
                          </div>
                          <Button
                            onClick={async () => {
                              await supabase.auth.signOut();
                              setUser(null);
                              window.location.reload();
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Sign Out
                          </Button>
                        </div>
                      )}
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