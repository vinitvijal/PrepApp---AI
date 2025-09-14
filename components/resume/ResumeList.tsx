import { Resume } from '@/app/(home)/resume-manager/page';
import React from 'react'



function ResumeList({ resumes }: {resumes: Resume[]}) {



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
    <div>
      
    </div>
  )
}

export default ResumeList
