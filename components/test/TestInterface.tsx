
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Flag, ArrowLeft, ArrowRight } from "lucide-react";
import { Question, Test, TestStatus } from "@prisma/client";
import { getQuestionsByTestId } from "@/app/server/db";


export interface TestResults {
    status: TestStatus;
    score: number;
    correct_answers: number;
    wrong_answers: number;
    time_taken_minutes: number;
    weak_areas: string[];
    [key: number]: number;
}
export default function TestInterface({ test, onComplete, onExit }: { test: Test, onComplete: (testId: string, results: TestResults) => void, onExit: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [showResults, setShowResults] = useState<TestResults | null>(null);
  const [questionset, setQuestionset] = useState<Question[]>([]);

  const handleSubmit = useCallback(async () => {
    const questions = questionset || [];
    let correct = 0;
    const weakAreas: string[] = [];

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      } else {
        weakAreas.push(test.subject);
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const results: TestResults = {
      status: "completed",
      score: score,
      correct_answers: correct,
      wrong_answers: questions.length - correct,
      time_taken_minutes: test.durationMinutes - Math.floor(timeLeft / 60),
      weak_areas: [...new Set(weakAreas)]
    };

    setShowResults(results);
  }, [answers, test, timeLeft]); // Dependencies for useCallback

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit(); // Call handleSubmit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]); // Add handleSubmit to useEffect dependencies

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const fetchQuestions = async () => {
    const questionsFromDB = await getQuestionsByTestId(test.id);
    setQuestionset(questionsFromDB);

  }

    useEffect(() => {
        fetchQuestions();
    }, [test.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border rounded-lg shadow-sm p-8">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Test completed
              </h1>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="text-3xl font-semibold text-green-700">{showResults.score}%</div>
                  <div className="text-sm font-medium text-green-800">Score</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="text-3xl font-semibold text-blue-700">{showResults.correct_answers}</div>
                  <div className="text-sm font-medium text-blue-800">Correct</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-3xl font-semibold text-red-700">{showResults.wrong_answers}</div>
                  <div className="text-sm font-medium text-red-800">Wrong</div>
                </div>
              </div>

              <Button
                onClick={() => onComplete(test.id, showResults)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save results
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = questionset || [];
  const currentQ = questions[currentQuestion];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={onExit} variant="outline" className="border-gray-300 text-gray-700">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{test.title?.toUpperCase()}</h1>
                <p className="text-sm font-medium text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
              <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Flag className="w-4 h-4 mr-2" />
                Finish
              </Button>
            </div>
          </div>
          <Progress 
            value={(currentQuestion + 1) / questions.length * 100} 
            className="mt-4 h-2" 
          />
        </div>

        {/* Question */}
        {currentQ && (
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-tight">
              {currentQ.questionText}
            </h2>
            
            <div className="space-y-4">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-md border transition-colors ${
                    answers[currentQuestion] === index
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${
                      answers[currentQuestion] === index ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-gray-300 text-gray-700 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestion === questions.length - 1}
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
