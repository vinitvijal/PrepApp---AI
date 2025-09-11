import ResumeCard from '@/app/components/ResumeCard'
import { Upload } from 'lucide-react'
import React from 'react'

function page() {
  return (
    <main className=' h-screen bg-white'>
      <Header/>
      <section>
        <ResumeCard/>
      </section>
    </main>
  )





  function Header() {
    return <header className=' w-full flex flex-col md:flex-row md:justify-between items-center px-8  py-4 bg-zinc-100'>
      <div>
        <h1 className=' text-black text-3xl'>RESUME MANAGER</h1>
        <p className=' text-zinc-700 text-xs'>ATS SCORING • VERSIONING • SHARING</p>
      </div>
      <div>
        <button className=' bg-green-500 py-2 px-4 flex'><Upload /> Upload Resume</button>
      </div>
    </header>
  }
}

export default page
