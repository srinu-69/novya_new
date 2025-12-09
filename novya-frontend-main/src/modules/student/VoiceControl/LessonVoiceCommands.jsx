// src/student/LessonVoiceCommands.jsx
import React, { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const LessonVoiceCommands = ({
  videoRef,
  setActiveTab,
  handleVoiceAI,
  addNewNote,
  saveNote,
  deleteActiveNote,
}) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Voice recognition not supported");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      console.log("VOICE HEARD:", transcript);
      handleVoiceCommand(transcript);
    };

    setRecognition(recog);
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  // ----------------------------------------------------
  // 🔥 MATCH ALL LESSON PAGE COMMANDS
  // ----------------------------------------------------
  const handleVoiceCommand = (cmd) => {
    const video = videoRef?.current;

    // VIDEO CONTROLS
    if (cmd.includes("play video")) return video?.play();
    if (cmd.includes("pause video")) return video?.pause();
    if (cmd.includes("stop video")) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    if (cmd.includes("forward")) video.currentTime += 10;
    if (cmd.includes("backward")) video.currentTime -= 10;
    if (cmd.includes("skip")) video.currentTime = video.duration - 2;
    if (cmd.includes("restart")) video.currentTime = 0;

  // TAB NAVIGATION
if (cmd.includes("overview")) return setActiveTab("overview");

if (
  cmd.includes("lesson checklist") ||
  cmd.includes("checklist")
)
  return setActiveTab("checklist");

if (
  cmd.includes("quick practice") ||
  cmd.includes("practice")
)
  return setActiveTab("practice");

// FIXED: AI Assistant Navigation
if (
  cmd.includes("ai assistant") ||
  cmd.includes("assistant") ||
  cmd.includes("open assistant") ||
  cmd.includes("open ai") ||
  cmd.includes("go to ai") ||
  cmd.includes("open chat") ||
  cmd.includes("ai tab")
)
  return setActiveTab("ai-assistant");

if (cmd.includes("notes")) return setActiveTab("notes");

  };

  // ----------------------------------------------------
  // 🔴 FIXED MIC BUTTON (TOP-RIGHT)
  // ----------------------------------------------------
  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      {!listening ? (
        <button
          onClick={startListening}
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#0ea5e9",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <Mic size={28} color="#fff" />
        </button>
      ) : (
        <button
          onClick={stopListening}
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#ef4444",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            animation: "pulse 1s infinite",
          }}
        >
          <MicOff size={28} color="#fff" />
        </button>
      )}
    </div>
  );
};

export default LessonVoiceCommands;
