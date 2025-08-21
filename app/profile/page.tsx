import React from 'react'
import Header from '../components/Header'
import { headerQuote } from '../server/header'

async function page() {
    const response = await headerQuote();
  return (
    <div>
        <Header/>
        {response}
    </div>
  )
}

export default page