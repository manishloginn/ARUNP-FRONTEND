import { lazy, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./component/home/Home.jsx'))
const Navbar = lazy(() => import('./component/navbar/Navbar.jsx'))
const Followup = lazy(() => import('./component/followup/Followup.jsx'))
const Doormanagement = lazy(() => import('./component/doormanagement/Doormanagement.jsx'))
const Delogatetask = lazy(() => import('./component/delogatetask/Delogatetask.jsx'))
const Login = lazy(() => import('./component/login/Login.jsx'))

function App() {
  const [count, setCount] = useState(0)

  

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/task-followup' Component={Followup} />
          <Route path='/door-management' Component={Doormanagement} />
          <Route path='/delogate-task' Component={Delogatetask} />
          <Route path='/login' Component={Login} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
