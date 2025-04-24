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
import AddPost from './components/AddPost';
import CheckImages from './components/CheckImages';

import CourseForm from './pages/courses/AddCourseForm'; // Added import for CourseForm
import AllCourses from './pages/courses/AllCourses';
import Login from './pages/Login';

function App() {
  return (
    //<AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-course" element={<CourseForm />} /> {/* New route for CourseForm */}
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/Signup" element={<Signup />} />

          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/CheckImages" element={<CheckImages />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    //</AuthProvider>
  );
}

export default App;