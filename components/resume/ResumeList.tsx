import { format } from 'date-fns'
import { AlertTriangle, ExternalLink, FileUser, Pencil, Share, Star, Trophy } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { Resume } from '@prisma/client'



function ResumeList({ resumes }: { resumes: Resume[] }) {
  const getScoreStyle = (score: number) => {
    if (score >= 80) return 'bg-emerald-200 text-emerald-900 border-emerald-400'
    if (score >= 60) return 'bg-amber-200 text-amber-700 border-amber-400'
    return 'bg-rose-200 text-rose-700 border-rose-400'
  }

  const copyShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink)
    console.log('Share link copied!')
  }



  if (resumes.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <FileUser className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Upload your first resume to start tracking ATS scores and get improvement feedback.
        </p>
      </div>
    )
  }



  return (
    <div className="gap-6 flex flex-1 flex-col overflow-y-auto pr-2">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  <FileUser className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                    {resume.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">{resume.targetRole}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created {format(new Date(resume.createdDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

                {resume.atsScore !== null && resume.atsScore !== undefined && (
                <div className={`${getScoreStyle(resume.atsScore)} border rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-current" />
                    <span className="font-semibold text-sm tracking-wide">ATS Score</span>
                  </div>
                  <span className="text-xl font-bold">
                    {resume.atsScore}
                    <span className="text-sm font-medium text-gray-500"> /100</span>
                  </span>
                  </div>
                </div>
                )}

                <div className="space-y-3">
                  {resume.strengths && resume.strengths?.length > 0 && (
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Star className="w-4 h-4" /> Strengths
                      </h4>
                      <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
                        {resume.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.weaknesses && resume.weaknesses?.length > 0 && (
                    <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
                      <h4 className="font-semibold text-rose-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <AlertTriangle className="w-4 h-4" /> Improvements
                      </h4>
                      <ul className="text-sm text-rose-800 space-y-1 list-disc list-inside">
                        {resume.weaknesses.map((weakness, i) => (
                          <li key={i}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                    {resume.suggestions && resume.suggestions?.length > 0 && (
                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                      <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Pencil className="w-4 h-4" /> Suggestions
                        </h4>
                        <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                        {resume.suggestions.map((suggestion, i) => (
                            <li key={i}>{suggestion}</li>
                        ))}
                        </ul>   
                    </div>
                    )}
                </div>
            </div>

            <div className="flex flex-row md:flex-col gap-3 md:w-40">
              <Button
                onClick={() => window.open(resume.fileUrl, '_blank')}
                className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md shadow-sm hover:shadow transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button
                onClick={() => copyShareLink(resume.fileUrl)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ResumeList
