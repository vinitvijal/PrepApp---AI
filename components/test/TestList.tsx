
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Eye, Trophy, Clock, Target } from "lucide-react";
import { Difficulty, Subject, Test } from "@prisma/client";

export default function TestList({ tests, onStartTest, onViewResults }: {tests: Test[], onViewResults: (test: Test) => void, onStartTest: (test: Test) => void}) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject: Subject) => {
    const colors = {
      quantitative: 'bg-blue-100 text-blue-700',
      logical_reasoning: 'bg-purple-100 text-purple-700', 
      verbal: 'bg-pink-100 text-pink-700',
      programming: 'bg-green-100 text-green-700',
      general_knowledge: 'bg-orange-100 text-orange-700',
      technical: 'bg-red-100 text-red-700'
    } as Record<Subject, string>;
    return colors[subject] || 'bg-gray-100 text-gray-700';
  };

  if (tests.length === 0) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
        <div className="text-5xl font-semibold text-gray-300 mb-4">¯\_(ツ)_/¯</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests yet</h3>
        <p className="text-gray-600">Create your first AI-generated mock test.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tests.map((test, index) => (
        <div
          key={test.id}
          className={`bg-white border rounded-lg shadow-sm p-6`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className={`${getSubjectColor(test.subject)} rounded-md p-3`}>
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                    {test.title?.toUpperCase()}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {test.subject?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${getDifficultyColor(test.difficulty)} font-medium` }>
                  {test.difficulty?.toUpperCase()}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700 font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {test.durationMinutes}MIN
                </Badge>
                <Badge className="bg-gray-100 text-gray-700 font-medium">
                  <Target className="w-3 h-3 mr-1" />
                  {test.totalQuestions}Q
                </Badge>
                {test.status === 'completed' && (
                  <Badge className="bg-green-100 text-green-800 font-medium">
                    <Trophy className="w-3 h-3 mr-1" />
                    {test.score}%
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Created on {format(new Date(test.createdAt), "MMM d, yyyy")}
              </p>
            </div>

            <div className="flex gap-3">
              {test.status === 'completed' ? (
                <Button
                  onClick={() => onViewResults(test)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View results
                </Button>
              ) : (
                <Button
                  onClick={() => onStartTest(test)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start test
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
