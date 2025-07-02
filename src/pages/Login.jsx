import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { googleProvider,auth } from '@/firebase/firebase';
import { motion } from 'framer-motion';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
  };

  const handleGoogleLogin=async()=>{
    try{
      const result=await signInWithPopup(auth,googleProvider);
      navigate("/dashboard");
    }catch(error){
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('✅ Login successful!');
      navigate('/dashboard');
    } catch (error) {
      alert('❌ ' + error.message);
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-200 dark:from-black dark:to-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6 transition-colors duration-300"
      >
        <div className="flex flex-col items-center">
          <img
            src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=login"
            alt="login-avatar"
            className="w-16 h-16"
          />
          <h2 className="text-2xl font-extrabold mt-2 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Login to your personalized space
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
        >
          Login
        </button>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
        <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2 bg-white border rounded-xl text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
        >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
      Sign in with Google
      </button>

      </form>
    </motion.div>
  );
};

export default Login;
