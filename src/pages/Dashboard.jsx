import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeContext";
import { FiMenu, FiHome, FiX } from "react-icons/fi";
import Notes from "./Notes";
import Todos from "./Todos";

const Dashboard = () => {
  const navigate = useNavigate();
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("notes");
 
  //Themes
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          navbar: 'bg-gray-900',
          sidebar: 'bg-gray-800',
          text: 'text-gray-100',
          button: 'bg-gray-500 hover:bg-gray-700',
          activeButton: 'bg-gray-700',
          icon: 'text-white hover:text-gray-400',
          border: 'border-gray-700'
        };
      case 'blushLavender':
        return {
          navbar: 'bg-purple-800',
          sidebar: 'bg-purple-100',
          text: 'text-purple-900',
          button: 'bg-purple-500  hover:bg-purple-300',
          activeButton: 'bg-purple-900 text-white',
          icon: 'text-white hover:text-purple-400',
          border: 'border-purple-200'
        };
      case 'neonNight':
        return {
          navbar: 'bg-gray-900',
          sidebar: 'bg-purple-900',
          text: 'text-purple-100',
          button: 'bg-gray-800 hover:bg-gray-700',
          activeButton: 'bg-purple-600 ',
          icon: 'text-purple-300 hover:text-white',
          border: 'border-purple-900'
        };
      case 'earthyBeige':
        return {
          navbar: 'bg-amber-700',
          sidebar: 'bg-amber-50',
          text: 'text-stone-800',
          button: 'bg-amber-500 hover:bg-amber-400',
          activeButton: 'bg-amber-700',
          icon: 'text-amber-700 hover:text-amber-900',
          border: 'border-amber-200'
        };
      case 'galaxyFade':
        return {
          navbar: 'bg-pink-200',
          sidebar: 'bg-pink-900',
          text: 'text-pink-100',
          button: 'bg-pink-800 hover:bg-pink-700',
          activeButton: 'bg-pink-700',
          icon: 'text-pink-900 hover:text-white',
          border: 'border-pink-800'
        };
      default:
        return {
          navbar: 'bg-gray-800',
          sidebar: 'bg-white',
          text: 'text-gray-800',
          button: 'bg-black-500 hover:bg-white hover:text-black',
          activeButton: 'bg-gray-800 text-white',
          icon: 'text-white hover:text-gray-500',
          border: 'border-gray-300'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const fetchBackground = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "userSettings", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBackgroundUrl(docSnap.data().dashboardBackground || "");
      }
    };

    fetchBackground();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/*Navbar*/}
      <nav className={`${colors.navbar} text-white p-4 shadow-md flex justify-between items-center`}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className={`text-xl ${colors.icon}`}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <button
          onClick={() => navigate("/")}
          className={`flex items-center ${colors.button} px-4 py-2 rounded-md transition-colors`}
        >
          <FiHome className="mr-2" />
          Home
        </button>
      </nav>

      <main className="flex-1 relative flex">
        <div
          className={`absolute inset-0 ${!backgroundUrl ? 'bg-gradient-to-br from-white via-gray-100 to-gray-200' : ''}`}
          style={{
            backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        {backgroundUrl && <div className={`absolute inset-0 bg-black/30`} />}

        {/*Sidebar*/}
        {sidebarOpen && (
          <div className={`relative z-20 w-64 p-4 ${colors.sidebar} ${colors.text} shadow-lg border-r ${colors.border}`}>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <button
              onClick={() => setActiveView("notes")}
              className={`w-full text-left mb-2 p-3 rounded-lg transition-colors ${
                activeView === "notes" 
                  ? `${colors.activeButton} font-medium`
                  : `hover:bg-opacity-50 ${colors.button.replace('hover:', '')}/20`
              }`}
            >
              📝 Notes
            </button>
            <button
              onClick={() => setActiveView("todos")}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeView === "todos" 
                  ? `${colors.activeButton} font-medium`
                  : `hover:bg-opacity-50 ${colors.button.replace('hover:', '')}/20`
              }`}
            >
              ✅ Todos
            </button>
          </div>
        )}
        
        <div className={`relative z-10 flex-1 p-6 overflow-auto`}>
          <div className="max-w-4xl mx-auto">
            {activeView === "notes" && <Notes />}
            {activeView === "todos" && <Todos />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;