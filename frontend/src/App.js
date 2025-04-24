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


function App() {
  
  return (
    //<AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/CheckImages" element={<CheckImages />} />
        </Routes>
      </Router>
    //</AuthProvider>
  );
}

export default App;
