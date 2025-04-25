import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/AuthContext';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CourseForm from './pages/courses/AddCourseForm';
import AllCourses from './pages/courses/AllCourses';
import UserDashboard from './pages/user/UserDashboard';
import CheckImages from './components/CheckImages';
import CommentSystem from './pages/comments/CommentSystem';
import AddPost from './pages/posts/AddPosts';
import ViewPost from './pages/posts/ViewPosts';
import UserPosts from './pages/posts/UserPosts';
import EditUserPosts from './pages/posts/EditUserPosts';

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
          <Route path="/dashboard/*" element={<UserDashboard />} />
          <Route path="/check-images" element={<CheckImages />} />
          <Route path="/comment" element={<CommentSystem />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/posts" element={<ViewPost />} />
          <Route path="/user-posts" element={<UserPosts />} />
          <Route path="/edit-user-posts/:id" element={<EditUserPosts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;