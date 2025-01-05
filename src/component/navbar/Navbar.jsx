import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
  return (
 
    <div className='navbarr'>
       
        <Link to='/' >Task Dashboard</Link>
        <Link to='/task-followup' >Task Follow-Up</Link>
        <Link to='/door-management' >Doer Management</Link>
        <Link to='/delogate-task' >Delogate Task</Link>
      
    </div>

  )
}

export default Navbar
