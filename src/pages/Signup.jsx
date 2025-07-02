import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCred.user, {
        displayName: email.split("@")[0],
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
      });

      alert("✅ Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-200 dark:from-black dark:to-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6 transition-colors duration-300"
      >
        <div className="flex flex-col items-center">
          <img
            src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=signup"
            alt="signup-avatar"
            className="w-16 h-16"
          />
          <h2 className="text-2xl font-extrabold mt-2 text-center">
            Join the Fun ✨
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create your workspace today!
          </p>
        </div>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />

        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default Signup;
