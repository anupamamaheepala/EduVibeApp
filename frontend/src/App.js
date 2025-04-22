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

function App() {
  
  return (
    //<AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    //</AuthProvider>
  );
}

export default App;
