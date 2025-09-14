import { AnalyzeAndStoreResume } from '@/app/server/db'
import React from 'react'

function page() {
  AnalyzeAndStoreResume();
  return (
    <div>
      <h1>Placement Tracker Page</h1>
    </div>
  )
}

export default page
