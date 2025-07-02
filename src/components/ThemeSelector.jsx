// src/components/ThemeSelector.jsx
import React from "react";
import { useTheme } from "@/components/ThemeContext";

const customThemes = [
  { name: "default", label: "Default Light/Dark" },
  { name: "blush-lavender", label: "Blush & Lavender" },
  { name: "neon-night", label: "Neon Night" },
  { name: "earthy-beige", label: "Earthy Beige" },
  { name: "galaxy-fade", label: "Galaxy Fade" },
];

function ThemeSelector() {
  const { theme, setTheme, customTheme, setCustomTheme } = useTheme();

  const handleThemeChange = (selectedTheme) => {
    if (selectedTheme === "default") {
      setCustomTheme(null);
      setTheme(theme === "dark" ? "light" : "dark");
    } else {
      setCustomTheme(selectedTheme);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Choose Theme</h2>
      <div className="grid grid-cols-2 gap-3">
        {customThemes.map((t) => (
          <button
            key={t.name}
            onClick={() => handleThemeChange(t.name)}
            className={`rounded px-4 py-2 text-sm font-medium transition-all border 
              ${customTheme === t.name || (t.name === "default" && !customTheme)
                ? "bg-black text-white border-black dark:bg-white dark:text-black"
                : "bg-white text-black border-gray-300 dark:bg-black dark:text-white dark:border-gray-600"}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
