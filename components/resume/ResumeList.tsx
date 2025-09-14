import { Resume } from '@/app/(home)/resume-manager/page';
import { format } from 'date-fns';
import { AlertTriangle, ExternalLink, FileUser, Share, Star, Trophy } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';



function ResumeList({ resumes }: {resumes: Resume[]}) {

const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-400 text-black';
    if (score >= 60) return 'bg-yellow-400 text-black';
    return 'bg-red-400 text-black';
  };

    
  const copyShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    alert('SHARE LINK COPIED!');
  };



  if (resumes.length === 0) {
    return (
      <div className="bg-white brutalist-border brutalist-shadow p-8 text-center transform rotate-1">
        <div className="text-6xl font-black text-gray-400 mb-4">¯\_(ツ)_/¯</div>
        <h3 className="text-xl font-black text-black mb-2">NO RESUMES YET</h3>
        <p className="font-bold text-gray-600">Upload your first resume to get started!</p>
      </div>
    );
  }



  return (
    <div className="grid gap-6">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className={`bg-white brutalist-border brutalist-shadow p-6 `}
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-400 brutalist-border p-3">
                  <FileUser className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-black">
                    {resume.title?.toUpperCase()}
                  </h3>
                  <p className="font-bold text-gray-600">{resume.target_role}</p>
                  <p className="text-sm font-bold text-gray-500">
                    Created {format(new Date(resume.created_date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* ATS Score */}
              {resume.ats_score && (
                <div className={`${getScoreColor(resume.ats_score)} brutalist-border p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-black" />
                      <span className="font-black text-black">ATS SCORE</span>
                    </div>
                    <span className="text-2xl font-black text-black">
                      {resume.ats_score}/100
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback Summary */}
              {resume.feedback && (
                <div className="space-y-2">
                  {resume.feedback.strengths && resume.feedback.strengths?.length > 0 && (
                    <div className="bg-green-100 brutalist-border p-3">
                      <h4 className="font-black text-black mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        STRENGTHS
                      </h4>
                      <div className="text-sm font-bold text-black space-y-1">
                        {resume.feedback.strengths.slice(0, 2).map((strength, i) => (
                          <div key={i}>• {strength}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {resume.feedback.weaknesses && resume.feedback.weaknesses?.length > 0 && (
                    <div className="bg-red-100 brutalist-border p-3">
                      <h4 className="font-black text-black mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        IMPROVEMENTS
                      </h4>
                      <div className="text-sm font-bold text-black space-y-1">
                        {resume.feedback.weaknesses.slice(0, 2).map((weakness, i) => (
                          <div key={i}>• {weakness}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 md:w-40">
              <Button
                onClick={() => window.open(resume.file_url, '_blank')}
                className="bg-gray-400 hover:bg-gray-500 text-black brutalist-border brutalist-shadow font-black"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                VIEW
              </Button>
              <Button
                onClick={() => copyShareLink(resume.share_link)}
                className="bg-purple-400 hover:bg-purple-500 text-black brutalist-border brutalist-shadow font-black"
              >
                <Share className="w-4 h-4 mr-2" />
                SHARE
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ResumeList
