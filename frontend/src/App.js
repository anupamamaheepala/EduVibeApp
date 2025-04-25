import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CourseForm from './pages/courses/CourseForm';
import AllCourses from './pages/courses/AllCourses';
import UserDashboard from './pages/userprofile/UserDashboard';
import UserProfile from './pages/userprofile/UserProfile';
//import MyCourses from './pages/userprofile/MyCourses';
//import MyLearningPlans from './pages/userprofile/MyLearningPlans';
//import NotFound from './pages/userprofile/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/add-course" element={<CourseForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Protected Routes */}
          {/*<Route
            path="/profile"
            element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
          />
          <Route
            path="/my-courses"
            element={<ProtectedRoute><MyCourses /></ProtectedRoute>}
          />
          <Route
            path="/my-learning-plans"
            element={<ProtectedRoute><MyLearningPlans /></ProtectedRoute>}
          />*/}

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;