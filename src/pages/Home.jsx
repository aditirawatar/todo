import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeContext";

const themeStyles = {
  light: {
    background: "bg-gradient-to-br from-white via-gray-100 to-gray-200",
    text: "text-gray-900",
    footer: "text-gray-600",
    link: "text-gray-800 hover:text-gray-900"
  },
  dark: {
    background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
    text: "text-gray-100",
    footer: "text-gray-400",
    link: "text-gray-300 hover:text-white"
  },
  blushLavender: {
    background: "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200",
    text: "text-purple-900",
    footer: "text-purple-700",
    link: "text-purple-800 hover:text-purple-900"
  },
  neonNight: {
    background: "bg-gradient-to-r from-gray-900 via-purple-800 to-black",
    text: "text-white",
    footer: "text-purple-300",
    link: "text-purple-200 hover:text-white"
  },
  earthyBeige: {
    background: "bg-gradient-to-br from-amber-50 via-yellow-100 to-stone-200",
    text: "text-stone-800",
    footer: "text-stone-600",
    link: "text-stone-700 hover:text-stone-900"
  },
  galaxyFade: {
    background: "bg-gradient-to-br from-pink-300 via-pink-900 to-pink-600",
    text: "text-pink-200",
    footer: "text-pink-300",
    link: "text-pink-200 hover:text-white"
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const selectedTheme = themeStyles[theme] || themeStyles["light"];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${selectedTheme.background} ${selectedTheme.text} transition-colors duration-300`}>
      <div className="p-6 max-w-md w-full space-y-4 bg-transparent dark:bg-zinc-900/80 backdrop-blur-md rounded-lg shadow-md flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome to Doto</h1>
        <p className="text-sm opacity-80">
          This is your personal space. Use the navigation to explore your dashboard, profile, and more. Go on, get signed up.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Signup
        </button>
      </div>

      <footer className={`mt-8 mb-4 text-center text-sm ${selectedTheme.footer}`}>
        © {new Date().getFullYear()} Aditi Rawat —{' '}
        <a 
          href="https://github.com/aditirawatar" 
          className={`underline ${selectedTheme.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default Home;