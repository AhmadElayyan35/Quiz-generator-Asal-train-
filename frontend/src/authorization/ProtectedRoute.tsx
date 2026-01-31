import React, { ReactNode, useContext } from 'react'
import { TokenContext } from '../context/TokenContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(TokenContext)
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to='/login' replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
