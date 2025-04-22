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

function App() {
  
  return (
    //<AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </Router>
    //</AuthProvider>
  );
}

export default App;
