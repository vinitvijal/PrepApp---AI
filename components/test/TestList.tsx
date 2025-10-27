
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Eye, Trophy, Clock, Target } from "lucide-react";
import { Difficulty, Subject, Test } from "@prisma/client";

export default function TestList({ tests, onStartTest, onViewResults }: {tests: Test[], onViewResults: (test: Test) => void, onStartTest: (test: Test) => void}) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-400 text-black';
      case 'medium': return 'bg-yellow-400 text-black';
      case 'hard': return 'bg-red-400 text-black';
      default: return 'bg-gray-400 text-black';
    }
  };

  const getSubjectColor = (subject: Subject) => {
    const colors = {
      quantitative: 'bg-blue-400',
      logical_reasoning: 'bg-purple-400', 
      verbal: 'bg-pink-400',
      programming: 'bg-green-400',
      general_knowledge: 'bg-orange-400',
      technical: 'bg-red-400'
    };
    return colors[subject] || 'bg-gray-400';
  };

  if (tests.length === 0) {
    return (
      <div className="bg-white brutalist-border brutalist-shadow p-8 text-center transform rotate-1">
        <div className="text-6xl font-black text-gray-400 mb-4">¯\_(ツ)_/¯</div>
        <h3 className="text-xl font-black text-black mb-2">NO TESTS YET</h3>
        <p className="font-bold text-gray-600">Create your first AI-generated mock test!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tests.map((test, index) => (
        <div
          key={test.id}
          className={`bg-white brutalist-border brutalist-shadow p-6 transform transition-all hover:scale-105 ${
            index % 2 === 0 ? 'rotate-1' : '-rotate-1'
          } hover:rotate-0`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className={`${getSubjectColor(test.subject)} brutalist-border p-3`}>
                  <Brain className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-black">
                    {test.title?.toUpperCase()}
                  </h3>
                  <p className="font-bold text-gray-600">
                    {test.subject?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${getDifficultyColor(test.difficulty)} brutalist-border font-bold`}>
                  {test.difficulty?.toUpperCase()}
                </Badge>
                <Badge className="bg-gray-200 text-black brutalist-border font-bold">
                  <Clock className="w-3 h-3 mr-1" />
                  {test.durationMinutes}MIN
                </Badge>
                <Badge className="bg-gray-200 text-black brutalist-border font-bold">
                  <Target className="w-3 h-3 mr-1" />
                  {test.totalQuestions}Q
                </Badge>
                {test.status === 'completed' && (
                  <Badge className="bg-green-400 text-black brutalist-border font-bold">
                    <Trophy className="w-3 h-3 mr-1" />
                    {test.score}%
                  </Badge>
                )}
              </div>

              <p className="text-sm font-bold text-gray-600">
                Created on {format(new Date(test.createdAt), "MMM d, yyyy")}
              </p>
            </div>

            <div className="flex gap-3">
              {test.status === 'completed' ? (
                <Button
                  onClick={() => onViewResults(test)}
                  className="bg-blue-400 hover:bg-blue-500 text-black brutalist-border brutalist-shadow font-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW RESULTS
                </Button>
              ) : (
                <Button
                  onClick={() => onStartTest(test)}
                  className="bg-green-400 hover:bg-green-500 text-black brutalist-border brutalist-shadow font-black"
                >
                  <Play className="w-4 h-4 mr-2" />
                  START TEST
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
