import React, { useEffect } from 'react'
import Header from '../Common/Header.jsx'
import Footer from '../Common/Footer.jsx'
import { Outlet } from 'react-router'

const UserLayout = () => {
  

  return (
    <>
    <section id='app-scroll' className='scrollbar-hide h-screen overflow-y-scroll'>

    
    <Header/>
    <main className='min-h-screen ' >
      <Outlet/>
    </main>
    <Footer/>
    </section>
    </>
  )
}

export default UserLayout