import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeContext";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { theme } = useTheme();

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };

  // Get theme-specific colors
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          background: 'bg-gray-800',
          text: 'text-gray-100',
          card: 'bg-gray-700',
          button: 'bg-blue-600 hover:bg-blue-700',
          dateText: 'text-gray-400'
        };
      case 'blushLavender':
        return {
          background: 'bg-purple-100',
          text: 'text-purple-900',
          card: 'bg-white',
          button: 'bg-purple-500 hover:bg-purple-600',
          dateText: 'text-purple-600'
        };
      case 'neonNight':
        return {
          background: 'bg-gray-900',
          text: 'text-purple-100',
          card: 'bg-gray-800',
          button: 'bg-purple-600 hover:bg-purple-700',
          dateText: 'text-purple-400'
        };
      case 'earthyBeige':
        return {
          background: 'bg-amber-50',
          text: 'text-stone-800',
          card: 'bg-white',
          button: 'bg-amber-500 hover:bg-amber-600',
          dateText: 'text-amber-700'
        };
      case 'galaxyFade':
        return {
          background: 'bg-pink-900',
          text: 'text-pink-100',
          card: 'bg-pink-800',
          button: 'bg-pink-600 hover:bg-pink-700',
          dateText: 'text-pink-300'
        };
      default:
        return {
          background: 'bg-gray-100',
          text: 'text-gray-900',
          card: 'bg-white',
          button: 'bg-blue-500 hover:bg-blue-600',
          dateText: 'text-gray-500'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "notes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesArray = [];
      querySnapshot.forEach((doc) => {
        notesArray.push({ ...doc.data(), id: doc.id });
      });
      // Sort by creation date (newest first)
      setNotes(notesArray.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addDoc(collection(db, "notes"), {
      content: newNote,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
    setNewNote("");
    setIsAddingNote(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setEditContent(note.content);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    await updateDoc(doc(db, "notes", editId), { content: editContent });
    setEditId(null);
    setEditContent("");
  };

  const noteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className={`w-full ${colors.background} ${colors.text} p-4 rounded-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        <button
          onClick={() => setIsAddingNote(true)}
          className={`p-2 rounded-full ${colors.button} text-white transition-colors`}
        >
          <FiPlus size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isAddingNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="relative">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note here..."
                className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${colors.text} ${colors.card}`}
                rows={3}
                autoFocus
              />
              <div className="absolute right-2 bottom-2 flex space-x-2">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
                <button
                  onClick={handleAddNote}
                  className="p-1 text-blue-500 hover:text-blue-700"
                >
                  <FiSave size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-gray-500 text-lg">No notes yet. Click the + button to add one!</p>
          </motion.div>
        ) : (
          <motion.ul className="space-y-4">
            {notes.map((note) => (
              <motion.li
                key={note.id}
                variants={noteVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className={`relative p-4 ${colors.card} rounded-lg shadow hover:shadow-md transition-all`}
              >
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                {editId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${colors.text} ${colors.card}`}
                      rows={3}
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className={`px-3 py-1 ${colors.button} text-white rounded transition-colors`}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="break-words pr-6">{note.content}</p>
                    <div className="flex items-center mt-2 text-xs ${colors.dateText}">
                      <FiClock className="mr-1" size={12} />
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;