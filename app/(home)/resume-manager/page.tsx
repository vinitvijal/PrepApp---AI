'use client'
import { AnalyzeAndStoreResume, getUserResumes } from '@/app/server/db'
import { getPresignedUploadUrl } from '@/app/server/r2'
// import ResumeCard from '@/app/components/ResumeCard'
import ResumeList from '@/components/resume/ResumeList'
import ResumeUpload from '@/components/resume/ResumeUpload'
import { Button } from '@/components/ui/button'
import { Resume } from '@prisma/client'
import { Plus, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'






function Page() {
  const [showUpload, setShowUpload] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);



  async function loadResumes() {
    const res = await getUserResumes();
    setResumes(res);
  }


  const handleUpload = async (file: File, targetRole: string) => {
    try {

      const fileName = encodeURIComponent(file.name) + '-' + Date.now();
      const fileType = encodeURIComponent(file.type);

      const response = await getPresignedUploadUrl(fileName, fileType, 'resumes');

      if (!response.success) {
        throw new Error(response.error || "Failed to get upload URL");
      }
      const { url } = response;
      console.log(url)
      if (!url) {
        throw new Error("Invalid upload URL");
      }

      const formData = new FormData();
      formData.append('file', file);

      const resp = await fetch(url, {
          method: 'PUT',
          body: formData,
      });


      if (!resp.ok) {
          throw new Error("Upload failed");
      }
      console.log("File uploaded successfully");
      console.log("Response After Upload:", response);

      const filePath = url.split('/').slice(3).join('/').split('?')[0]; 

      const share_link = `https://prepapp.vinucode.in//${filePath}`


      const Analysis = await AnalyzeAndStoreResume(share_link, targetRole, file.name);
      console.log(Analysis);
      loadResumes();
      setShowUpload(false);
    } catch (error) {
      console.error("Error processing resume:", error);
    }
  };


  


  useEffect(() => {

    loadResumes();
  }, []);

  return (
    <main className=' h-screen flex flex-col bg-zinc-50 text-zinc-900 p-4 md:p-8 space-y-8'>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Resume Manager
          </h1>
          <p className="text-sm text-gray-600">
            ATS scoring, version history & easy sharing
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md shadow-sm hover:shadow transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
          <Button
            onClick={() => setShowBuilder(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Build New
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

export default Page
