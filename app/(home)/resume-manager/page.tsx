'use client'
import ResumeCard from '@/app/components/ResumeCard'
import ResumeUpload from '@/components/resume/ResumeUpload'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import React, { useState } from 'react'

function page() {
  const [showUpload, setShowUpload] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);



  
  const handleUpload = async (file: File, targetRole: string) => {
    try {
      // const { file_url } = await UploadFile({ file });
      
      
      const resumeData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        target_role: targetRole,
        file_url: file_url,
        ats_score: atsResult.score,
        feedback: {
          strengths: atsResult.strengths,
          weaknesses: atsResult.weaknesses, 
          suggestions: atsResult.suggestions
        },
        share_link: `${window.location.origin}/resume/${Math.random().toString(36).substring(7)}`
      };

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

      <section>
        <ResumeCard/>
      </section>
    </main>
  )

}

export default page
