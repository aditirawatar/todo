import React, { useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeContext";
import { doc, setDoc } from "firebase/firestore";

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarStyle, setAvatarStyle] = useState("initials");
  const { theme, setTheme } = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const avatarURL = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${user?.email}`;

  const handleSaveInfo = async () => {
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: avatarURL,
      });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Failed to update profile: " + err.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDeleteBg = async () => {
  try {
    await setDoc(doc(db, "userSettings", user.uid), {
      dashboardBackground: ""
    }, { merge: true });

    alert("✅ Background image deleted!");
  } catch (error) {
    console.error("Delete error:", error);
    alert("❌ Failed to delete background: " + error.message);
  }
};

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "doto-app");
    data.append("cloud_name", "dplllmgie");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dplllmgie/image/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (json.secure_url) {
        await setDoc(doc(db, "userSettings", user.uid), {
          dashboardBackground: json.secure_url,
        });

        alert("✅ Background uploaded successfully!");
        navigate("/dashboard");
      } else {
        console.error(json);
        alert("❌ Upload failed. Check console for details.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Upload failed: " + error.message);
    }

    setUploading(false);
  };

  if (!user) {
    return <p className="p-6 text-red-500">You must be logged in to view this page.</p>;
  }

  const inputClass = `mt-1 p-2 border w-full rounded transition
    ${theme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-black"}
    focus:outline-none focus:ring-2 focus:ring-purple-500`;

  const pageBgClass =
    theme === "dark"
      ? "bg-black text-white"
      : theme === "blushLavender"
      ? "bg-gradient-to-r from-pink-100 to-purple-200 text-black"
      : theme === "neonNight"
      ? "bg-gradient-to-r from-gray-900 via-purple-800 to-black text-white"
      : theme === "earthyBeige"
      ? "bg-gradient-to-r from-yellow-100 to-yellow-300 text-black"
      : theme === "galaxyFade"
      ? "bg-gradient-to-br from-pink-950 via-pink-800 to-black text-pink-200"
      : "bg-white text-black";

  return (
    <div className={`min-h-screen transition-colors duration-500 ${pageBgClass}`}>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-300 mt-3 ml-3 text-black px-4 py-1 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
      >
        Dashboard
      </button>

      <div className="p-6 max-w-md mx-auto space-y-4 bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md rounded-lg shadow-md transition-all">
        <h2 className="text-2xl font-bold">👤 Profile Settings</h2>

        <img
          src={avatarURL}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border"
        />

        <label className="block">
          <span className="font-semibold">Display Name:</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="font-semibold">Avatar Style:</span>
          <select
            value={avatarStyle}
            onChange={(e) => setAvatarStyle(e.target.value)}
            className={inputClass}
          >
            {["initials", "fun-emoji", "avataaars", "adventurer", "bottts", "notionists"].map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-semibold">Upload Dashboard Background Image:</span>
          <input
            type="file"
            onChange={handleFileChange}
            className={inputClass}
            accept="image/*"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            {uploading ? "Uploading..." : "Upload Background"}
          </button>

          <button
          onClick={handleDeleteBg}
          className="mt-2 bg-red-600 text-white px-4 py-2  ml-3 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </label>

        <label className="block">
          <span className="font-semibold">Choose Theme:</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={inputClass}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="blushLavender">Blush & Lavender</option>
            <option value="neonNight">Neon Night</option>
            <option value="earthyBeige">Earthy Beige</option>
            <option value="galaxyFade">Galaxy Fade</option>
          </select>
        </label>

        <button
          onClick={handleSaveInfo}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
