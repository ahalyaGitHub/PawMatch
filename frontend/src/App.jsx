import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import User from './components/user/User';
import Home from './components/home/Home';
import AdoptionForm from './components/adoptionForm/AdoptionForm';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Double exclamation to convert to boolean
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<Login isAdmin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pets" element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }/>
        <Route path="/adopt/:petId" element={
          <ProtectedRoute>
            <AdoptionForm />
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}
