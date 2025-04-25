import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

// Himansa
import CourseForm from './pages/courses/AddCourseForm';
import AllCourses from './pages/courses/AllCourses';
import UserDashboard from './pages/user/UserDashboard';
import MyCourse from './pages/user/MyCourses';

// Sadith
import CheckImages from './components/CheckImages'; 
import AddPost from './pages/posts/AddPosts';
import ViewPost from './pages/posts/ViewPosts';
import UserPosts from './pages/posts/UserPosts';
import EditUserPosts from './pages/posts/EditUserPosts';

// Rashini
import CommentSystem from './pages/comments/CommentSystem';

const App = () => {
  return (
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
        <Route path="/my-courses" element={<MyCourse />} />
      </Routes>
    </Router>
  );
};

export default App;