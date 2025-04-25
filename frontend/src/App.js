// import TestConnection from './components/TestConnection';

// function App() {
//   return (
//     <div>
//       <TestConnection />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import { AuthProvider } from './context/Context';
import Home from './pages/Home';
import Signup from './pages/Signup';
import CheckImages from './components/CheckImages';
import CourseForm from './pages/courses/AddCourseForm'; // Added import for CourseForm
import AllCourses from './pages/courses/AllCourses';
import Login from './pages/Login';
import CommentSystem from './pages/comments/CommentSystem'; 
import AddPost from './pages/posts/AddPosts';
import ViewPost from './pages/posts/ViewPosts';
import UserPosts from './pages/posts/UserPosts';
import EditUserPosts from './pages/posts/EditUserPosts';
import DeleteUserPosts from './pages/posts/EditUserPosts';
function App() {
  return (
    //<AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-course" element={<CourseForm />} /> {/* New route for CourseForm */}
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/CheckImages" element={<CheckImages />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Comment" element={<CommentSystem />} />
          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/posts" element={<ViewPost />} />
          <Route path="/UserPosts" element={<UserPosts />} />
          <Route path="/EditUserPosts/:id" element={<EditUserPosts />} />
          <Route path="/DeleteUserPosts/:id" element={<DeleteUserPosts />} />
        </Routes>
      </Router>
    //</AuthProvider>
  );
}

export default App;