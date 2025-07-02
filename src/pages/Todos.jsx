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
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeContext";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { theme } = useTheme();
  const[showAppreciation,setShowAppreciation]=useState(false);
  const[currentMessage,setCurrentMessage]=useState("");

  const appreciationMessages = [
    "Great job completing all your tasks! 🎉",
    "Productivity champion! 💪",
    "You're on fire! 🔥",
    "Task master! All done! ✅",
    "Nothing can stop you now! 🚀"
  ];

  const toggleComplete = async (todo) => {
  const newCompletedStatus = !todo.completed;
  await updateDoc(doc(db, "todos", todo.id), {
    completed: newCompletedStatus,
  });

  if (newCompletedStatus) {
    const allCompleted = todos.every(t => t.id === todo.id ? newCompletedStatus : t.completed);
    if (allCompleted) {
      const randomMessage = appreciationMessages[
        Math.floor(Math.random() * appreciationMessages.length)
      ];
      setCurrentMessage(randomMessage);
      setShowAppreciation(true);
      setTimeout(() => setShowAppreciation(false), 3000);
    }
  }
};
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          background: 'bg-gray-800',
          text: 'text-gray-100',
          card: 'bg-gray-700',
          completedCard: 'bg-green-900/30',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'blushLavender':
        return {
          background: 'bg-purple-100',
          text: 'text-purple-900',
          card: 'bg-white',
          completedCard: 'bg-green-100',
          button: 'bg-purple-500 hover:bg-purple-600'
        };
      case 'neonNight':
        return {
          background: 'bg-gray-900',
          text: 'text-purple-100',
          card: 'bg-gray-800',
          completedCard: 'bg-green-900/30',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'earthyBeige':
        return {
          background: 'bg-amber-50',
          text: 'text-stone-800',
          card: 'bg-white',
          completedCard: 'bg-green-100',
          button: 'bg-amber-500 hover:bg-amber-600'
        };
      case 'galaxyFade':
        return {
          background: 'bg-pink-900',
          text: 'text-pink-100',
          card: 'bg-pink-800',
          completedCard: 'bg-green-900/30',
          button: 'bg-pink-600 hover:bg-pink-700'
        };
      default: 
        return {
          background: 'bg-gray-100',
          text: 'text-gray-900',
          card: 'bg-white',
          completedCard: 'bg-green-100',
          button: 'bg-blue-500 hover:bg-blue-600',
          accent: 'blue-500'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "todos"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray.sort((a, b) => a.completed - b.completed));
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "todos"), {
      task: newTask,
      completed: false,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
    setNewTask("");
    setIsAddingTask(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditContent(todo.task);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    await updateDoc(doc(db, "todos", editId), { 
      task: editContent 
    });
    setEditId(null);
    setEditContent("");
  };

  const todoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className={`w-full ${colors.background} ${colors.text} p-4 rounded-lg`}>
      <AnimatePresence>
        {showAppreciation && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className={`absolute top-4 left-0 right-0 mx-auto w-max px-6 py-3 rounded-lg ${
              theme === 'dark' || theme === 'neonNight' || theme === 'galaxyFade' 
                ? 'bg-purple-700 text-white' 
                : 'bg-green-100 text-green-800'
            } shadow-lg z-50`}
             >
            <div className="flex items-center">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mr-2 text-xl"
              >
                🌟
              </motion.span>
              <span>{currentMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Todos</h2>
        <button
          onClick={() => setIsAddingTask(true)}
          className={`p-2 rounded-full ${colors.button} text-white transition-colors`}
        >
          <FiPlus size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="relative">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task..."
                className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.accent} ${colors.text} ${colors.card}`}
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
                <button
                  onClick={handleAdd}
                  className={`p-1 text-${colors.accent} hover:text-${colors.accent}-700`}
                >
                  <FiSave size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-gray-500 text-lg">No todos yet. Click the + button to add one!</p>
          </motion.div>
        ) : (
          <motion.ul className="space-y-2">
            {todos.map((todo) => (
              <motion.li
                key={todo.id}
                variants={todoVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className={`flex items-start p-3 rounded-lg shadow hover:shadow-md transition-all ${
                  todo.completed ? colors.completedCard : colors.card
                }`}
              >
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full border ${
                    todo.completed
                      ? "bg-gray-400 border-gray-700 flex items-center justify-center"
                      : "border-gray-300 dark:border-gray-500"
                  }`}
                >
                  {todo.completed && <FiCheck className="text-white" size={14} />}
                </button>

                <div className="flex-1 min-w-0">
                  {editId === todo.id ? (
                    <div className="space-y-2">
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-${colors.accent} ${colors.text} ${colors.card}`}
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
                    <p
                      className={`break-words ${todo.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}
                    >
                      {todo.task}
                    </p>
                  )}
                </div>

                {editId !== todo.id && (
                  <div className="ml-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className={`p-1 text-gray-500 hover:text-${colors.accent} transition-colors`}
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Todos;