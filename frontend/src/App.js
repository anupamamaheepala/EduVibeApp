import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { AuthProvider, AuthContext } from './pages/context/AuthContext';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CourseForm from './pages/courses/AddCourseForm';
import AllCourses from './pages/courses/AllCourses';
import UserDashboard from './pages/user/UserDashboard';



const App = () => {
  return (
    //<AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/add-course" element={<CourseForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          
          

          
        </Routes>
      </Router>
    //</AuthProvider>
  );
};

export default App;