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

import CheckImages from './components/CheckImages';
import CourseForm from './pages/courses/AddCourseForm'; // Added import for CourseForm
import AllCourses from './pages/courses/AllCourses';
import Login from './pages/Login';
import CommentSystem from './pages/comments/CommentSystem'; 
import AddPost from './pages/posts/AddPosts';
import ViewPost from './pages/posts/ViewPosts';
import UserPosts from './pages/posts/UserPosts';
import EditUserPosts from './pages/posts/EditUserPosts';
function App() {

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
          
          

          

          <Route path="/CheckImages" element={<CheckImages />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Comment" element={<CommentSystem />} />
          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/posts" element={<ViewPost />} />
          <Route path="/UserPosts" element={<UserPosts />} />
          <Route path="/EditUserPosts/:id" element={<EditUserPosts />} />

        </Routes>
      </Router>
    //</AuthProvider>
  );
};

export default App;