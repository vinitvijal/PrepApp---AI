'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building, Grid3X3, List } from "lucide-react";

import ApplicationForm from "@/components/placement/ApplicationForm";
import ApplicationList from "@/components/placement/ApplicationList";
import ApplicationTable from "@/components/placement/ApplicationTable";
import ApplicationStats from "@/components/placement/ApplicationStats";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { addApplication, getUserApplications, updateApplication } from "@/app/server/db";
import { Application } from "@prisma/client";

export default function PlacementTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("cards");
  const supabase = createClient();

    // Load user on component mount
    React.useEffect(() => {
      loadData();
    }, []);
  

  
  


  const loadData = async () => {
    const { data} = await supabase.auth.getUser();
    if (!data.user) {
      setUser(null);
      setApplications([]);
      return;
    }
    setUser(data.user);

    const applications = await getUserApplications();
    setApplications(applications);

  };

  const handleSave = async (appData: Application) => {
    if (editingApp) {
      const res = await updateApplication(editingApp.id, appData);
      if (!res) {
        console.error("Failed to update application");
      }
    } else {
      const res = await addApplication(appData);
      if (!res) {
        console.error("Failed to add application");
      }
    }

    setShowForm(false);
    setEditingApp(null);
    loadData();
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setShowForm(true);
  };

  return (
    <main className="h-screen flex flex-col bg-zinc-50 text-zinc-900 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Placement Tracker
          </h1>
          <p className="text-sm text-gray-600">
            Track your job applications, follow-ups, and interview schedules
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <ApplicationStats applications={applications} />

      {/* Application Form */}
      {showForm && user && (
        <ApplicationForm
          application={editingApp}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingApp(null);
          }}
          userId={user.id}
        />
      )}

      {/* View Toggle & Applications */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6 pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-600" />
              Your Applications ({applications.length})
            </h2>
            
            {/* View Toggle */}
            <Tabs value={currentView} onValueChange={setCurrentView} className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="p-6 pt-6">
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <TabsContent value="cards" className="mt-0">
              <ApplicationList 
                applications={applications}
                onEdit={handleEdit}
                onUpdate={loadData}
              />
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              <ApplicationTable 
                applications={applications}
                onEdit={handleEdit}
                onUpdate={loadData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}