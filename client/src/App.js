// App.js
import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import UserList from './components/userList'

const initialData = globalThis.__INITIAL_DATA__

const Home = () => <h2>Home</h2>
const About = () => <h2>About</h2>

const App = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>

    <Routes>
      <Route
        path="/users"
        element={<UserList isServerRendered={true} serverData={initialData} />}
      />
      <Route path="/about" element={<About />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </div>
)

export default App
