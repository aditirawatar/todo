import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeContext";

const themeStyles = {
  light: {
    background: "bg-gradient-to-br from-white via-gray-100 to-gray-200",
    text: "text-gray-900",
  },
  dark: {
    background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
    text: "text-gray-100",
  },
  blushLavender: {
    background: "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200",
    text: "text-purple-900",
  },
  neonNight: {
    background: "bg-gradient-to-r from-gray-900 via-purple-800 to-black ",
    text: "text-white",
  },
  earthyBeige: {
    background: "bg-gradient-to-br from-amber-50 via-yellow-100 to-stone-200",
    text: "text-stone-800",
  },
  galaxyFade: {
    background: "bg-gradient-to-br from-pink-300 via-pink-900 to-pink-600 ",
  text: "text-pink-200"
  }
};


const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const selectedTheme = themeStyles[theme] || themeStyles["light"];

  return (
    <div className={`min-h-screen flex items-center justify-center ${selectedTheme.background} ${selectedTheme.text} transition-colors duration-300`}>
      <div className="p-6 max-w-md w-full space-y-4 bg-transparent dark:bg-zinc-900/80 backdrop-blur-md rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Welcome to Doto</h1>
        <p className="text-sm opacity-80">
          This is your personal space. Use the navigation to explore your dashboard, profile, and more. Go on get signedup.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Home;
