import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import User from './components/user/User';
import Home from './components/home/Home';
import AdoptionForm from './components/adoptionForm/AdoptionForm';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import AdminAdoptionRequests from './components/adminAdoptionRequests/AdminAdoptionRequests';
import AdminPets from './components/adminPets/AdminPets';
import AddPetForm from './components/addPetForm/AddPetForm';
import History from './components/history/History';


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdmin = token ? JSON.parse(atob(token.split('.')[1])).role === 'admin' : false; // Check if the user is an admin
  return isAdmin ? children : <Navigate to="/" replace />; // Redirect to homepage if not admin
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/pets" element={
          <ProtectedAdminRoute>
            <AdminPets />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/add" element={
          <ProtectedAdminRoute>
            <AddPetForm />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <ProtectedAdminRoute>
            <AddPetForm />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/adoptionRequest" element={
          <ProtectedAdminRoute>
            <AdminAdoptionRequests />
          </ProtectedAdminRoute>
        } />

        {/* User Routes - Protected */}
        <Route path="/pets" element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        } />
        <Route path="/adopt/:petId" element={
          <ProtectedRoute>
            <AdoptionForm />
          </ProtectedRoute>
        } />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<Login isAdmin />} />
        <Route path="/signup" element={<Signup />} />

        {/* History Route */}
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />

       
      </Routes>
    </Router>
  );
}
