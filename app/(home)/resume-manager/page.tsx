'use client'
import ResumeCard from '@/app/components/ResumeCard'
import ResumeList from '@/components/resume/ResumeList'
import ResumeUpload from '@/components/resume/ResumeUpload'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import React, { useState } from 'react'


export interface Resume {
    id: string
    title: string;
    target_role: string;
    file_url: string;
    ats_score: number;
    created_date: string;
    feedback: {
        strengths?: string[];
        weaknesses?: string[];
        suggestions?: string[];
    };
    share_link: string;
}


const resumes: Resume[] = [
  {
    id: '1',
    title: "Senior Frontend Engineer",
    target_role: "Frontend Engineer",
    file_url: "/uploads/resume_frontend_engineer.pdf",
    ats_score: 82,
    created_date: new Date('2025-09-01').toISOString(),
    feedback: {
      strengths: ["Clear project impact", "Strong React/TypeScript usage", "Good metrics included"],
      weaknesses: ["Lacks testing details", "No accessibility highlights"],
      suggestions: ["Add unit/integration testing section", "Mention a11y improvements", "Quantify performance optimizations"]
    },
    share_link: "/resume/demo123fe"
  },
  {
    id: '2',
    title: "Data Scientist Resume",
    target_role: "Data Scientist",
    file_url: "/uploads/resume_data_scientist.pdf",
    ats_score: 76,
    created_date: new Date('2025-09-02').toISOString(),
    feedback: {
      strengths: ["Relevant ML stack", "Good problem statements", "Shows collaboration"],
      weaknesses: ["Sparse model evaluation metrics", "No MLOps tooling listed"],
      suggestions: ["Include ROC/AUC or F1 scores", "List model monitoring tools", "Add brief on data pipeline scaling"]
    },
    share_link: "/resume/demo456ds"
  }
]


function page() {
  const [showUpload, setShowUpload] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);



  
  const handleUpload = async (file: File, targetRole: string) => {
    try {
      // const { file_url } = await UploadFile({ file });
      
      
      // const resumeData = {
      //   title: file.name.replace(/\.[^/.]+$/, ""),
      //   target_role: targetRole,
      //   file_url: file_url,
      //   ats_score: atsResult.score,
      //   feedback: {
      //     strengths: atsResult.strengths,
      //     weaknesses: atsResult.weaknesses, 
      //     suggestions: atsResult.suggestions
      //   },
      //   share_link: `${window.location.origin}/resume/${Math.random().toString(36).substring(7)}`
      // };

      setShowUpload(false);
    } catch (error) {
      console.error("Error processing resume:", error);
    }
  };


  return (
    <main className=' h-screen bg-white text-zinc-900 p-4 md:p-8 space-y-8'>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            RESUME MANAGER
          </h1>
          <p className="text-sm font-light text-zinc-500 mt-2">
            ATS SCORING • VERSIONING • SHARING
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-green-400 hover:bg-green-500 text-black brutalist-border brutalist-shadow font-black"
          >
            <Upload className="w-4 h-4 mr-2" />
            UPLOAD RESUME
          </Button>
          <Button
            onClick={() => setShowBuilder(true)}
            className="bg-blue-400 hover:bg-blue-500 text-black brutalist-border brutalist-shadow font-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            BUILD NEW
          </Button>
        </div>
      </div>



      {showUpload && (
        <ResumeUpload
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      

      <ResumeList 
        resumes={resumes}
        // onUpdate={loadData}
      />
    </main>
  )

}

export default page
