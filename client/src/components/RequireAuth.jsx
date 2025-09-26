import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RequireAuth = ({ children }) => {
	const { isLogedIn } = useContext(AppContext)
	const location = useLocation()
	if (!isLogedIn) {
		return <Navigate to="/login" state={{ from: location.pathname }} replace />
	}
	return children
}

export default RequireAuth

