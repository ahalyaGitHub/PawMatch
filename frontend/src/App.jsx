import React from 'react';
import { BrowserRouter as Router, Route, Routes, redirect, Navigate, Outlet } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import User from './components/user/User';
import Home from './components/home/Home';

const ProtectedRoute = (props) => {
  const { children } = props
  console.log(props)
  const isLoggedIn = !!localStorage.getItem('token') // !! will convert anything to boolean
  if (!isLoggedIn) {
    return <Navigate to={'/login'} replace />
  }
  return children
}

export default function App() {
  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/pets' element={<ProtectedRoute>
            <User />
          </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<Login isAdmin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  )
};
