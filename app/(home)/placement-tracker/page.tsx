'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Plus, Building, Grid3X3, List } from "lucide-react";

import ApplicationForm from "@/components/placement/ApplicationForm";
import ApplicationList from "@/components/placement/ApplicationList";
import ApplicationTable from "@/components/placement/ApplicationTable";
import ApplicationStats from "@/components/placement/ApplicationStats";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function PlacementTracker() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("cards");
  const supabase = createClient();

    // Load user on component mount
    React.useEffect(() => {
      loadData();
    }, []);
  
  
  


  const loadData = async () => {
    const { data} = await supabase.auth.getUser();
    setUser(data.user);
    
    // Load applications from Supabase
  };

  // const handleSave = async (appData) => {
  //   if (editingApp) {
  //     await Application.update(editingApp.id, appData);
  //   } else {
  //     await Application.create(appData);
  //   }
  //   setShowForm(false);
  //   setEditingApp(null);
  //   loadData();
  // };

  // const handleEdit = (app) => {
  //   setEditingApp(app);
  //   setShowForm(true);
  // };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Placement Tracker</h1>
          </div>
          <p className="text-gray-600">
            Track your job applications, follow-ups, and interview schedules
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <ApplicationStats applications={applications} />

      {/* Application Form */}
      {/* {showForm && (
        // <ApplicationForm
        //   application={editingApp}
        //   onSave={handleSave}
        //   onClose={() => {
        //     setShowForm(false);
        //     setEditingApp(null);
        //   }}
        // />
      )} */}

      {/* View Toggle & Applications */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-600" />
              Your Applications ({applications.length})
            </CardTitle>
            
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
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <TabsContent value="cards" className="mt-0">
              {/* <ApplicationList 
                applications={applications}
                onEdit={handleEdit}
                onUpdate={loadData}
              /> */}
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              {/* <ApplicationTable 
                applications={applications}
                onEdit={handleEdit}
                onUpdate={loadData}
              /> */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}