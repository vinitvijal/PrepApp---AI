import React from 'react'


export interface Students {
    name: string,
    course: string, 
    marks: number | null
}


interface Question {
    qid: string,
    qtitle: string,
    qdesc?: string
}


function page() {
    

    var q: Question = {
        qid: "sdbfkjds",
        qtitle: "fhjaksld ashdfakjs asdkas",
        qdesc: "423"
    }
    
    var obj1: Students = {
        name: "Gunjal",
        course:  "MCA",
        marks: null
    }

    var obj2: Students = {
        name: "Vineet",
        course:  "MCA",
        marks: 50
    }

    var obj3: Students = {
        name: "Amit",
        course:  "MCA",
        marks: 85
    }


  return (
    <div className='bg-gray-900 h-screen w-full'>
      Hi {obj1.name}, {obj1.course}, got {obj1.marks} marks!
    </div>
  )
}

export default page
