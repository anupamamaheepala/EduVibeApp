import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './pages/AuthContext';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddCourseForm from './pages/courses/AddCourseForm';
import AllCourses from './pages/courses/AllCourses';
import ViewCourse from './pages/user/CourseView';
import CheckImages from './components/CheckImages';
import CommentSystem from './pages/comments/CommentSystem';
import AddPost from './pages/posts/AddPosts';
import ViewPost from './pages/posts/ViewPosts';
import MyPosts from './pages/posts/UserPosts';
import EditUserPosts from './pages/posts/EditUserPosts';
import DeleteUserPosts from './pages/posts/DeleteUserPosts';
import ShareModal from './pages/posts/PostShareModal';
import UserRoutes from './pages/user/UserRoutes';
import SharedWithMe from './pages/posts/SharedPosts';
import SinglePostView from './pages/posts/SinglePostView';
import NotificationSystem from './pages/notifictions/NotificationSystem';

const App = () => {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="672064114622-86o0ke8k6adn1gcdptcutc2l5439kbkq.apps.googleusercontent.com">
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
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/posts" element={<ViewPost />} />
            <Route path="/MyPosts" element={<MyPosts />} />
            <Route path="/EditUserPosts/:postId" element={<EditUserPosts />} />
            <Route path="/DeleteUserPosts/:id" element={<DeleteUserPosts />} />
            <Route path="/ShareModal" element={<ShareModal />} />
            <Route path="/SharedWithMe" element={<SharedWithMe />} />
            <Route path="/post/:postId" element={<SinglePostView />} />
            <Route path="/notifications" element={<NotificationSystem />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard/*" element={<UserRoutes />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
};

export default App;