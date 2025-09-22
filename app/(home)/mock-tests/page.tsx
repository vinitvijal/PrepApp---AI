import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'


function page() {
  return (
    <main className=' w-full h-screen p-4 bg-white flex flex-col'>
      <header className=' h-24 w-full border rounded-md flex justify-between items-center px-7 shadow-[0_0_5px_rgba(59,59,59,0.6)]'>
        <div className=' flex flex-col '>
          <h1 className=' text-3xl font-extrabold text-[#0A1828] '>MOCK TESTS</h1>
          <p className=' text-xs text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className=''>          
           <button className=' text-white bg-[#0A1828] font-extrabold px-4 py-2.5 rounded-md shadow-[0_4px_5px_rgba(10,24,40,1),inset_0_0_5px_rgba(255,255,255,0.8)] border-white border-2 '>+ Create Mock Test</button>
        </div>
      </header>




      <section className=' w-full flex-1 overflow-y-scroll scroll-mt-2 mt-4 rounded-md '>
       <div className='border-2 border-white p-4 rounded-md'>
        <div className=' bg-[#d1d4fa] h-40 border-2 border-[#d1d4fa] mb-4 rounded-md'>
          <span className='rounded-full h-8'>hii</span>
        </div>
       <div className=' bg-[#d1d4fa] h-40 border-2 border-[#d1d4fa] mb-4 rounded-md'>
          Card
        </div>
        <div className=' bg-[#d1d4fa] h-40 border-2 border-[#d1d4fa] mb-4 rounded-md'>
          Card
        </div>
        <div className=' bg-[#d1d4fa] h-40 border-2 border-[#d1d4fa] mb-4 rounded-md'>
          Card
        </div>
        <div className=' bg-[#d1d4fa] h-40 border-2 border-[#d1d4fa] mb-4 rounded-md'>
          Card
        </div>
      </div>

        <footer className='mt-4 mb-0 h-24 w-full border-t-4 border-gray-600 bg-gray-200 text-gray-600 rounded-md flex justify-between flex-col items-center px-4'>
        
          <div className='flex justify-around p-8 text-4xl'><h1 className=' text-2xl font-semibold'>APP_NAME</h1></div>
         <div className='w-full flex justify-evenly text-s bg-gray-200 border rounded-md m-0 '>
          <div className='flex flex-col p-18'>
            <span>data</span>
            <span>data</span>
            <span>data</span>
            <span>data</span>
          </div>
          
            <div className='flex flex-col p-18'>
            <span>data</span>
            <span>data</span>
            <span>data</span>
            <span>data</span>
          </div>

            <div className='flex flex-col p-18'>
            <span>data</span>
            <span>data</span>
            <span>data</span>
            <span>data</span>
          </div>
            <div className='flex flex-col p-18'>
            <span>data</span>
            <span>data</span>
            <span>data</span>
            <span>data</span>
          </div>

            <div className='flex flex-col p-18'>
            <span>data</span>
            <span>data</span>
            <span>data</span>
            <span>data</span>
          </div>
         </div> 
      </footer>
    </section>  








    </main>
  )
}

export default page
