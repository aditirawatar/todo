import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/Navbar';
import TestFirestore from './components/TestFirestore';
import ImageUpload from './components/ImageUpload';
import Login from './pages/Login';
import Signup from './pages/Signup';
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase/firebase';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub(); // cleanup
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Home/>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
