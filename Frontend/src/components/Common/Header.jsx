import React from 'react'
import Topbar from '../Layout/Topbar.jsx'
import Navbar from './Navbar.jsx'
import CartDrawer from '../Layout/CartDrawer.jsx'

const Header = () => {
  return (
    <>
        <Topbar/>
    <section className='shadow-lg sticky top-0 z-50 bg-white ' >
        <Navbar />
        <CartDrawer/>
    </section>
    </>
  )
}

export default Header