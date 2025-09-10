import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

function page() {
  return (
    <main className=' w-full h-screen p-4 bg-white flex flex-col'>
      <header className=' h-24 w-full border border-zinc-300 text-black rounded-md flex justify-between items-center px-4'>
        <div className=' flex flex-col'>
          <h1 className=' text-2xl font-semibold'>MOCK TESTS</h1>
          <p className=' text-xs text-zinc-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className=' bg-green-600 text-white px-4 py-2 rounded-md '>+ Create Mock Test</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
              Create Mock Test
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button >Save changes</Button>
          </DialogFooter>

          </DialogContent>
        </Dialog>
      </header>




      <section className=' w-full flex-1 overflow-y-scroll mt-4'>
        <div className=' bg-yellow-300 h-40 border-2 border-black mb-4'>
          Card
        </div>
        <div className=' bg-yellow-300 h-40 border-2 border-black mb-4'>
          Card
        </div>
        <div className=' bg-yellow-300 h-40 border-2 border-black mb-4'>
          Card
        </div>
        <div className=' bg-yellow-300 h-40 border-2 border-black mb-4'>
          Card
        </div>
        <div className=' bg-yellow-300 h-40 border-2 border-black mb-4'>
          Card
        </div>
        <div className=' bg-yellow-300 h-40 border-2 border-black mb-4'>
          Card
        </div>


        <footer className=' h-24 w-full border border-zinc-300 text-black rounded-md flex justify-between items-center px-4'>
        <div className=' flex flex-col '>
          <h1 className=' text-2xl font-semibold'>MOCK TESTS</h1>
          <p className=' text-xs text-zinc-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </footer>
      </section>





  


    </main>
  )
}

export default page
