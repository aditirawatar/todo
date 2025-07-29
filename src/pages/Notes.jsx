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
  serverTimestamp
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          background: 'bg-gray-800',
          text: 'text-gray-100',
          card: 'bg-gray-700',
          button: 'bg-blue-600 hover:bg-blue-700',
          dateText: 'text-gray-400',
          input: 'bg-gray-700 text-gray-100'
        };
      case 'blushLavender':
        return {
          background: 'bg-purple-100',
          text: 'text-purple-900',
          card: 'bg-white',
          button: 'bg-purple-500 hover:bg-purple-600',
          dateText: 'text-purple-600',
          input: 'bg-white text-purple-900'
        };
      case 'neonNight':
        return {
          background: 'bg-gray-900',
          text: 'text-purple-100',
          card: 'bg-gray-800',
          button: 'bg-purple-600 hover:bg-purple-700',
          dateText: 'text-purple-400',
          input: 'bg-gray-800 text-purple-100'
        };
      case 'earthyBeige':
        return {
          background: 'bg-amber-50',
          text: 'text-stone-800',
          card: 'bg-white',
          button: 'bg-amber-500 hover:bg-amber-600',
          dateText: 'text-amber-700',
          input: 'bg-white text-stone-800'
        };
      case 'galaxyFade':
        return {
          background: 'bg-pink-900',
          text: 'text-pink-100',
          card: 'bg-pink-800',
          button: 'bg-pink-600 hover:bg-pink-700',
          dateText: 'text-pink-300',
          input: 'bg-pink-800 text-pink-100'
        };
      default:
        return {
          background: 'bg-gray-100',
          text: 'text-gray-900',
          card: 'bg-white',
          button: 'bg-blue-500 hover:bg-blue-600',
          dateText: 'text-gray-500',
          input: 'bg-white text-gray-900'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "notes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const notesArray = [];
        querySnapshot.forEach((doc) => {
          notesArray.push({ ...doc.data(), id: doc.id });
        });
        setNotes(notesArray.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "notes"), {
        content: newNote,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewNote("");
      setIsAddingNote(false);
      setError(null);
    } catch (error) {
      console.error("Error adding note: ", error);
      setError("Failed to add note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "notes", id));
      setError(null);
    } catch (error) {
      console.error("Error deleting note: ", error);
      setError("Failed to delete note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setEditContent(note.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, "notes", editId), { 
        content: editContent,
        updatedAt: serverTimestamp() 
      });
      setEditId(null);
      setEditContent("");
      setError(null);
    } catch (error) {
      console.error("Error updating note: ", error);
      setError("Failed to update note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const noteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (loading && notes.length === 0) {
    return (
      <div className={`w-full ${colors.background} ${colors.text} p-4 rounded-lg flex justify-center items-center h-64`}>
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${colors.background} ${colors.text} p-4 rounded-lg`}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        <button
          onClick={() => setIsAddingNote(true)}
          className={`p-2 rounded-full ${colors.button} text-white transition-colors`}
          disabled={loading}
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
            <form onSubmit={handleAddNote}>
              <div className="relative">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your note here..."
                  className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${colors.input}`}
                  rows={3}
                  autoFocus
                  required
                  disabled={loading}
                />
                <div className="absolute right-2 bottom-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    <FiX size={20} />
                  </button>
                  <button
                    type="submit"
                    className="p-1 text-blue-500 hover:text-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : <FiSave size={20} />}
                  </button>
                </div>
              </div>
            </form>
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
            <p className={`${colors.dateText} text-lg`}>No notes yet. Click the + button to add one!</p>
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
                    disabled={loading}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    title="Delete"
                    disabled={loading}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                {editId === note.id ? (
                  <form onSubmit={handleUpdate}>
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${colors.input}`}
                        rows={3}
                        autoFocus
                        required
                        disabled={loading}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditId(null)}
                          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`px-3 py-1 ${colors.button} text-white rounded transition-colors`}
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="break-words pr-6">{note.content}</p>
                    <div className={`flex items-center mt-2 text-xs ${colors.dateText}`}>
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