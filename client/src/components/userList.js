/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

const UserList = ({ isServerRendered, serverData }) => {
  const [users, setUsers] = useState(isServerRendered ? serverData.users : [])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:3000/api/users')
        const data = response.data.users
        setUsers(data)
        setError('')
      } catch (e) {
        setUsers(null)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    // Check if window is defined before using it
    if (!isServerRendered && typeof window !== 'undefined') {
      fetchUsers()
    }
  }, [isServerRendered])

  return (
    <div>
      <h1>Client-side Rendering</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users?.map((user) => (
            <li key={user.id}>
              <div style={{ display: 'inline-flex' }}>
                <p style={{ padding: '0px 6px' }}>{user.firstName}</p>
                <p style={{ padding: '0px 6px' }}>{user.lastName}</p>
                <p style={{ padding: '0px 6px' }}>{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p>{error}</p>}
    </div>
  )
}

export default UserList
