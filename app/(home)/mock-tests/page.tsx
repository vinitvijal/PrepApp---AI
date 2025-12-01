'use client';
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Target, Zap } from "lucide-react";

import TestCreator, { TestConfig } from "@/components/test/TestCreator";
import TestList from "@/components/test/TestList";
import TestInterface, { TestResults } from "@/components/test/TestInterface";
import { generateMocktest } from "@/app/server/ai";
import { Test } from "@prisma/client";
import { getCurrentUser, getMockTests, updateTest } from "@/app/server/db";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default function MockTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Load tests on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Update test with results after completion
  const UpdateMockTest = async (testId: string, results: TestResults) => {
    try {
      await updateTest(testId, results.status, results.score, results.correct_answers, results.wrong_answers, results.weak_areas, results.time_taken_minutes);
      setActiveTest(null);
      loadData();
      console.log("Test updated with results:", results);
    } catch (error) {
      console.error("Error updating test:", error);
    }
  
  };

  // Load user and tests data
  const loadData = async () => {
    const userData = await getCurrentUser();
    setUser(userData);

    if (!userData) {
      console.log("User not logged in");
      return;
    }
    
    const userTests = await getMockTests(userData.id);
    setTests(userTests);
  };


  // Generate a new AI-powered mock test
  const generateAITest = async (config: TestConfig) => {
    try {
      // Generate test via AI
      const newTest = await generateMocktest(config.subject, config.difficulty, config.total_questions, config.duration_minutes);
      if (!newTest.ok) {
        console.log(newTest)
        throw new Error('Failed to generate test');
      }
      if (newTest.ok){
        setActiveTest(newTest.test);
        loadData();
      }
    } catch (error) {
      console.error("Error generating test:", error);
    }
  };


  // Start a test
  const startTest = (test: Test) => {
    setActiveTest({...test, status: "in_progress"});
  };

  if (activeTest?.status === "in_progress") {
    return (
      <TestInterface 
        test={activeTest}
        onComplete={async (testId: string, results: TestResults) => await UpdateMockTest(testId, results)}
        onExit={() => setActiveTest(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Mock Tests
          </h1>
          <p className="text-sm text-gray-600">
            AI-powered practice tests with adaptive difficulty and detailed analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Test
          </Button>
        </div>
      </div>

      {/* Test Creator */}
      {showCreator && (
        <TestCreator 
          onGenerate={generateAITest}
          onClose={() => setShowCreator(false)}
          userType={'free'}
        />
      )}

      {/* Tests List */}
      <div ref={listRef}>
        <TestList 
          tests={tests}
          onStartTest={startTest}
          onViewResults={(test: Test) => redirect(`/mock-tests/${test.id}`)}
        />
      </div>

      {/* Pro Upsell */}
      {user?.user_metadata.subscription_status !== 'pro' && (
        <Card className="border border-gray-200 bg-indigo-500 shadow-sm">
          <CardContent className="p-6 text-center text-gray-900">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-700" />
                </div>
              </div>
              <h3 className="text-xl text-white font-semibold">Unlock Unlimited Tests</h3>
              <p className="text-gray-100">
                Get unlimited AI-generated mock tests with detailed analytics and performance tracking.
              </p>
              <Button variant="secondary" className="bg-white text-indigo-700 hover:bg-gray-100 border border-gray-200">
                <Target className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}