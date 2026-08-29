import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleSignIn } from './GoogleSignIn';
import { Dashboard } from './Dashboard';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<GoogleSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
