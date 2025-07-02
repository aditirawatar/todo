// src/pages/Navbar.jsx
import { MorphingText } from "@/components/magicui/morphing-text";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useTheme } from "@/components/ThemeContext";

const themeStyles = {
  light: {
  background: "bg-gradient-to-br from-white via-gray-100 to-gray-200",
  text: "text-gray-900"
},
  dark: {
  background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
  text: "text-gray-100"
},
  blushLavender: {
  background: "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200",
  text: "text-purple-900"
},
  neonNight: {
  background: "bg-gradient-to-br from-black via-purple-900 to-indigo-800",
  text: "text-blue-900"
},
 earthyBeige: {
  background: "bg-gradient-to-br from-amber-50 via-yellow-100 to-stone-200",
  text: "text-stone-800"
},
  galaxyFade: {
  background: "bg-gradient-to-br from-pink-950 via-pink-800 to-black ",
  text: "text-pink-600"
}
};

function Navbar({ currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const selectedTheme = themeStyles[theme] || themeStyles["light"];
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const fallbackAvatar = currentUser?.email
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`
    : "/default-profile.png";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div
      className={`h-20 flex items-center justify-between px-6 ${selectedTheme.background} ${selectedTheme.text} transition-all duration-300`}
    >
      <div className="flex items-center space-x-4">
        <MorphingText
          className={`text-xl font-semibold tracking-wide ${selectedTheme.text}`}
          texts={["todo", "doto"]}
        />
      </div>

      <div className="flex items-center space-x-6">
        <ShinyButton
          className={`rounded-xl h-10 px-3 ${selectedTheme.text} bg-white/80 dark:bg-black/30 backdrop-blur hover:pointer`}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </ShinyButton>

        {currentUser ? (
          <>
            <img
              src={currentUser.photoURL || fallbackAvatar}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white hover:cursor-pointer"
              onClick={() => navigate("/profile")}
            />
            <InteractiveHoverButton
              className={`rounded bg-white/80 dark:bg-black/30 ${selectedTheme.text} backdrop-blur hover:pointer`}
              onClick={handleLogout}
            >
              Logout
            </InteractiveHoverButton>
          </>
        ) : isAuthPage ? (
          <InteractiveHoverButton
            className={`rounded bg-white/80 dark:bg-black/30 ${selectedTheme.text} backdrop-blur hover:pointer`}
            onClick={() => navigate("/")}
          >
            Home
          </InteractiveHoverButton>
        ) : (
          <InteractiveHoverButton
            className={`rounded bg-white/80 dark:bg-black/30 ${selectedTheme.text} backdrop-blur hover:pointer`}
            onClick={() => navigate("/login")}
          >
            Login
          </InteractiveHoverButton>
        )}
      </div>
    </div>
  );
}

export default Navbar;
