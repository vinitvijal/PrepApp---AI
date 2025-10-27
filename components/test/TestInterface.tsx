
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Flag, ArrowLeft, ArrowRight } from "lucide-react";

export default function TestInterface({ test, onComplete, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test.duration_minutes * 60);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = useCallback(async () => {
    const questions = test.questions || [];
    let correct = 0;
    const weakAreas = [];

    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correct++;
      } else {
        weakAreas.push(test.subject);
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const results = {
      status: "completed",
      score: score,
      correct_answers: correct,
      wrong_answers: questions.length - correct,
      time_taken_minutes: test.duration_minutes - Math.floor(timeLeft / 60),
      weak_areas: [...new Set(weakAreas)]
    };

    setShowResults({...results, answers});
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

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white brutalist-border brutalist-shadow p-8 transform -rotate-1">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-black tracking-tight">
                TEST COMPLETED!
              </h1>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-400 brutalist-border p-4">
                  <div className="text-3xl font-black text-black">{showResults.score}%</div>
                  <div className="font-bold text-black">SCORE</div>
                </div>
                <div className="bg-blue-400 brutalist-border p-4">
                  <div className="text-3xl font-black text-black">{showResults.correct_answers}</div>
                  <div className="font-bold text-black">CORRECT</div>
                </div>
                <div className="bg-red-400 brutalist-border p-4">
                  <div className="text-3xl font-black text-black">{showResults.wrong_answers}</div>
                  <div className="font-bold text-black">WRONG</div>
                </div>
              </div>

              <Button
                onClick={() => onComplete(showResults)}
                className="bg-black text-white brutalist-border brutalist-shadow font-black"
              >
                SAVE RESULTS
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = test.questions || [];
  const currentQ = questions[currentQuestion];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-black text-white brutalist-border brutalist-shadow p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={onExit}
                className="bg-red-400 hover:bg-red-500 text-black brutalist-border font-black"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-black">{test.title?.toUpperCase()}</h1>
                <p className="font-bold text-gray-300">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Clock className="w-5 h-5" />
                <span className="text-xl font-black">{formatTime(timeLeft)}</span>
              </div>
              <Button
                onClick={handleSubmit}
                className="bg-yellow-400 hover:bg-yellow-500 text-black brutalist-border brutalist-shadow font-black"
              >
                <Flag className="w-4 h-4 mr-2" />
                FINISH
              </Button>
            </div>
          </div>
          <Progress 
            value={(currentQuestion + 1) / questions.length * 100} 
            className="mt-4 h-3 brutalist-border" 
          />
        </div>

        {/* Question */}
        {currentQ && (
          <div className="bg-white brutalist-border brutalist-shadow p-8 transform rotate-1">
            <h2 className="text-2xl font-black text-black mb-6 leading-tight">
              {currentQ.question}
            </h2>
            
            <div className="space-y-4">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 brutalist-border font-bold transition-all hover:scale-105 ${
                    answers[currentQuestion] === index
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white brutalist-border flex items-center justify-center font-black">
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
            className="bg-gray-400 hover:bg-gray-500 text-black brutalist-border brutalist-shadow font-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            PREVIOUS
          </Button>
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestion === questions.length - 1}
            className="bg-blue-400 hover:bg-blue-500 text-black brutalist-border brutalist-shadow font-black"
          >
            NEXT
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
