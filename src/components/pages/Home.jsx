import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../nav_bar/NavBar'

function Home() {
  return (
    <div>
      <NavBar />
      Home

      <Link to="/UserDashboard">
        Go to User Dashboard
      </Link>
    </div>
  )
}

export default Home