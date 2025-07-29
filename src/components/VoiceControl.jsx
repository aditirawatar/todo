
import React, { useState } from "react";

const VoiceControl = ({ onAdd, onDelete, onComplete }) => {
  const [listening, setListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  const handleCommand = (text) => {
    const command = text.toLowerCase();
    console.log("Voice input:", command);

    if (command.startsWith("add ")) {
      const task = command.replace("add ", "");
      onAdd(task);
    } else if (command.startsWith("delete ")) {
      const task = command.replace("delete ", "");
      onDelete(task);
    } else if (command.startsWith("mark ") && command.includes(" as done")) {
      const task = command.replace("mark ", "").replace(" as done", "");
      onComplete(task);
    } else {
      alert("Sorry, I didn't understand the command.");
    }
  };

  const startListening = () => {
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleCommand(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };
  };

  return (
    <button
      onClick={startListening}
      className="px-2 py-2 rounded bg-green-600 text-white hover:bg-green-700"
    >
      🎙️ {listening ? "Listening..." : "Voice Command"}
    </button>
  );
};

export default VoiceControl;
