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
  

  
  


  /**
   * Loads the current authenticated user and their applications into component state.
   *
   * Queries Supabase for the current user. If no user is present, clears user and applications state.
   * If a user is found, updates the user state then fetches the user's applications via getUserApplications()
   * and stores them in the applications state.
   *
   * @async
   * @returns {Promise<void>} Resolves once user and applications state have been updated.
   *
   * @remarks
   * - Calls `supabase.auth.getUser()` to determine authentication state.
   * - Calls `getUserApplications()` to retrieve application records for the authenticated user.
   * - Side effects: invokes `setUser(...)` and `setApplications(...)`.
   * - Intended to be used in an effect or event handler; ensure the component is still mounted when the promise resolves to avoid state updates on unmounted components.
   *
   * @throws Will propagate errors from Supabase or `getUserApplications()` (e.g., network or API errors); callers should handle errors as appropriate.
   */
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

  /**
   * Save handler that either updates an existing application or adds a new one.
   *
   * If an application is currently being edited (determined by `editingApp` in the surrounding scope),
   * this function calls `updateApplication` with the existing application's id and the provided `appData`.
   * Otherwise, it calls `addApplication` to create a new application record.
   *
   * On a failed add/update (indicated by a falsy response from the called function), an error is logged to the console.
   * After attempting the add/update the function closes the form UI (`setShowForm(false)`), clears the editing state
   * (`setEditingApp(null)`), and reloads the displayed data by calling `loadData()`.
   *
   * @param appData - The Application object containing data to add or update. Must conform to the `Application` type.
   * @returns A Promise that resolves once the save operation has been attempted and the UI/state updates have been applied.
   */
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

  /**
   * Prepares the UI to edit a given application.
   *
   * Sets the provided Application as the currently editing item and makes the edit form visible.
   *
   * @param app - The Application to edit; becomes the active editing context.
   * @returns void
   * @remarks
   * This function has side effects: it updates component state (e.g., sets the editing app and toggles form visibility).
   */
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