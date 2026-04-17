import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>Home

      <Link to="/UserDashBord">
        Go to User Dashboard
      </Link>
    </div>
  )
}

export default Home