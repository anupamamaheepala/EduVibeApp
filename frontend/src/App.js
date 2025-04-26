import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/AuthContext';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddCourseForm from './pages/courses/AddCourseForm'; // Fixed import
import AllCourses from './pages/courses/AllCourses';
import CheckImages from './components/CheckImages';
import CommentSystem from './pages/comments/CommentSystem';
import UserPosts from './pages/posts/UserPosts';
import EditUserPosts from './pages/posts/EditUserPosts';
import DeleteUserPosts from './pages/posts/DeleteUserPosts';
import UserRoutes from './pages/user/UserRoutes'; // Will create this file

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
          <Route path="/add-course" element={<AddCourseForm />} />
          <Route path="/edit-course/:courseId" element={<AddCourseForm />} />

          {/* Posts and Comments */}
          <Route path="/check-images" element={<CheckImages />} />
          <Route path="/comment" element={<CommentSystem />} />
          {/* Comment out missing routes to avoid errors */}
          {/* <Route path="/add-post" element={<AddPost />} /> */}
          {/* <Route path="/posts" element={<ViewPost />} /> */}
          <Route path="/user-posts" element={<UserPosts />} />
          <Route path="/edit-user-posts/:id" element={<EditUserPosts />} />
          <Route path="/delete-user-posts/:id" element={<DeleteUserPosts />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard/*" element={<UserRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;