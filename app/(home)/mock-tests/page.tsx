import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'



/*START-> question card schema*/
const questions = [
  {
    quesID: 'DBMS001',
    quesTitle: 'What does DBMS stand for?',
    Options: ["A", "B", "C", "D"],
    correct: 1
  },
  {
    quesID: 'DBMS002',
    quesTitle: 'Which of the following is a type of DBMS?',
    Options: ["A", "B", "C", "D"],
    correct: 3
  },
  {
    quesID: 'DBMS003',
    quesTitle: 'What is the primary purpose of a DBMS?',
    Options: ["A", "B", "C", "D"],
    correct: 3
  },
  {
    quesID: 'DBMS004',
    quesTitle: 'Which of the following is NOT a DBMS?',
    Options: ["A", "B", "C", "D"],
    correct: 2
  },
  {
    quesID: 'DBMS005',
    quesTitle: 'What is a primary key?',
    Options: ["A", "B", "C", "D"],
    correct: 0
  },
  {
    quesID: 'DBMS006',
    quesTitle: 'Which SQL command is used to retrieve data from a database?',
    Options: ["A", "B", "C", "D"],
    correct: 0
  },
  {
    quesID: 'DBMS007',
    quesTitle: 'What is normalization in DBMS?',
    Options: ["A", "B", "C", "D"],
    correct: 0
  },
  {
    quesID: 'DBMS008',
    quesTitle: 'Which of the following is a disadvantage of a DBMS?',
    Options: ["A", "B", "C", "D"],
    correct: 3
  },
  {
    quesID: 'DBMS009',
    quesTitle: 'What is a foreign key?',
    Options: ["A", "B", "C", "D"],
    correct: 1
  },
  {
    quesID: 'DBMS010',
    quesTitle: 'Which of the following is a feature of a DBMS?',
    Options: ["A", "B", "C", "D"],
    correct: 3
  }
]
/*END-> question card schema*/


/*START-> footer schema*/
const footerData = [
  {
    title: 'Interview Prep',
    links: [
      { name: 'Data Structures', href: '#' },
      { name: 'Algorithms', href: '#' },
      { name: 'Behavioral Questions', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Coding Challenges', href: '#' },
      { name: 'Mock Interviews', href: '#' },
      { name: 'Career Advice', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Success Stories', href: '#' },
      { name: 'Terms & Privacy', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

// Reusable component for a footer column
const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col">
    <h3 className="text-lg font-bold text-gray-200 mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
          >
            <span className="relative z-10 font-medium">
              {link.name}
            </span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Reusable component for a social media link with a glowing effect
const SocialLink = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    aria-label={label}
    className="group transform transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0px_5px_rgba(255,255,255,0.7)]"
  >
    <Icon
      size={24}
      className="text-gray-400 transition-colors duration-300 group-hover:text-white"
    />
  </a>
);
/*END-> footer schema*/


function page() {
  return (

    

    <main className=' w-full h-screen p-4 bg-white flex flex-col'>
{/* START -> Header */} 
      <header className=' h-24 w-full border rounded-md flex justify-between items-center px-7 shadow-[0_0_5px_rgba(50,50,50,1)]'>
        <div className=' flex flex-col '>
          <h1 className=' text-3xl font-extrabold text-[#0A1828] '>MOCK TESTS</h1>
          <p className=' text-xs text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className=''>          
           <button className=' text-white bg-[#0A1828] font-extrabold px-4 py-2.5 rounded-md shadow-[0_4px_5px_rgba(10,24,40,1),inset_0_0_5px_rgba(255,255,255,0.8)] border-white border-2 '>+ Create Mock Test</button>
        </div>
      </header>
{/*END Header*/}



      <section className=' w-full flex-1 overflow-y-scroll scroll-mt-2 mt-4 rounded-md '>
       <div className='border-2 border-white p-4 rounded-md'>
    {questions.map((question) => (
      <div key={question.quesID} className=' bg-[#3f5f77] h-60 border-2 border-[#3f5f77] m-4 rounded-md p-4 flex flex-col '>
        <p className='text-xs text-gray-400 font-bold mt-2'>QID: {question.quesID}</p>
        <h2 className='text-xl font-extrabold mb-2 mt-2'>{question.quesTitle}</h2>
        <div className='mt-3 flex flex-col gap-2'>
          {question.Options.map((option, index) => (
            <div key={index} className='flex items-center space-x-2 p-1'>
              <input type="radio" id={`option-${question.quesID}-${index}`} name={`question-${question.quesID}`} value={option} />
              <label htmlFor={`option-${question.quesID}-${index}`} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

{/* START -> Footer*/}
      <div className="flex flex-col min-h-screen font-sans bg-gray-900 text-gray-300 border rounded-md">
     
      {/* Google Fonts Link */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />

   
      <footer className="bg-gray-800 text-gray-400 py-16 px-4 sm:px-6 lg:px-8 shadow-2xl border-t-2 rounded-md border-transparent relative overflow-hidden">
        
        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
       
        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent z-20"></div>

        <div className="max-w-7xl mx-auto z-10 relative">
        
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-12">
           
            {/*Social Section */}
            <div className="flex flex-col justify-start md:col-span-2 lg:col-span-1">
              <span className="font-extrabold text-5xl text-white leading-tight tracking-tight mb-2">
                Prep<span className="text-gray-400">Pro</span>
              </span>
              <p className="text-sm text-gray-500 max-w-sm">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis iure animi aperiam non ut, similique accusantium quia.
              </p>
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((link, index) => (
                  <SocialLink key={index} icon={link.icon} href={link.href} label={link.label} />
                ))}
              </div>
            </div>

            {/* Link Columns and Newsletter Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-3 gap-y-12 gap-x-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-x-12 sm:col-span-2">
                {footerData.map((column, index) => (
                  <FooterColumn key={index} title={column.title} links={column.links} />
                ))}
              </div>

              {/* Newsletter Section */}
              <div className="sm:col-span-1">
                <h3 className="text-lg font-bold text-gray-200 mb-4">Stay Updated</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Join our newsletter for exclusive tips and updates.
                </p>
                <div className="flex w-full max-w-sm space-x-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    type="button"
                    aria-label="Subscribe"
                    className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-16 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Prep Pro. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
{/* END Footer*/}
    </section>  


    </main>
  )
}

export default page
