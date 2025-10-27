import React, { useState, useEffect } from "react";
import { MockTest, User } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Plus, Trophy, Clock, Target, Zap, BookOpen } from "lucide-react";

import TestCreator from "../components/tests/TestCreator";
import TestList from "../components/tests/TestList";
import TestInterface from "../components/tests/TestInterface";

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await User.me();
    setUser(userData);
    
    const userTests = await MockTest.filter({ created_by: userData.email }, '-created_date');
    setTests(userTests);
  };

  const generateAITest = async (config) => {
    try {
      const prompt = `Generate a ${config.difficulty} difficulty mock test for ${config.subject} with ${config.total_questions} questions. 
      Each question should have 4 multiple choice options with explanations.
      Make questions relevant for placement preparation.
      Return in this exact format:
      {
        "questions": [
          {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }`;

      const result = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "number" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      const testData = {
        title: `${config.subject} - ${config.difficulty} Test`,
        subject: config.subject,
        difficulty: config.difficulty,
        duration_minutes: config.duration_minutes,
        total_questions: config.total_questions,
        questions: result.questions,
        status: "draft",
        is_ai_generated: true
      };

      const newTest = await MockTest.create(testData);
      setActiveTest(newTest);
      loadData();
    } catch (error) {
      console.error("Error generating test:", error);
    }
  };

  const startTest = (test) => {
    setActiveTest({...test, status: "in_progress"});
  };

  if (activeTest?.status === "in_progress") {
    return (
      <TestInterface 
        test={activeTest}
        onComplete={async (results) => {
          await MockTest.update(activeTest.id, results);
          setActiveTest(null);
          loadData();
        }}
        onExit={() => setActiveTest(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mock Tests</h1>
          </div>
          <p className="text-gray-600">
            AI-powered practice tests with adaptive difficulty and detailed analytics
          </p>
        </div>
        <Button
          onClick={() => setShowCreator(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Test
        </Button>
      </div>

      {/* Test Creator */}
      {showCreator && (
        <TestCreator 
          onGenerate={generateAITest}
          onClose={() => setShowCreator(false)}
          userType={user?.subscription_status}
        />
      )}

      {/* Tests List */}
      <TestList 
        tests={tests}
        onStartTest={startTest}
        onViewResults={(test) => setActiveTest(test)}
      />

      {/* Pro Upsell */}
      {user?.subscription_status !== 'pro' && (
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-6 text-center text-white">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Unlock Unlimited Tests</h3>
              <p className="text-indigo-100">
                Get unlimited AI-generated mock tests with detailed analytics and performance tracking
              </p>
              <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
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