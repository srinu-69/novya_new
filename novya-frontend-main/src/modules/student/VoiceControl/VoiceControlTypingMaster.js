import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControlTypingMaster = ({
  navigate,
  onStartTest,
  onPauseTest,
  onResumeTest,
  onResetTest,
  onSelectDifficulty,
  isTestRunning = false,
  isTestPaused = false
}) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

  // Initialize speech recognizer
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();
      console.log("🎤 Typing Master Command:", transcript);
      setLastCommand(transcript);
      handleCommand(transcript);
    };

    recog.onerror = () => setListening(false);
    recognitionRef.current = recog;
  }, [isTestRunning, isTestPaused]);

  const startListening = () => {
    setListening(true);
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current?.stop();
  };

  const toggleListening = () => {
    listening ? stopListening() : startListening();
  };

  // Command handler
  const handleCommand = (cmd) => {
    const spoken = cmd.toLowerCase();

    // Test control commands
    if (
      (spoken.includes("start") || spoken.includes("begin")) &&
      (spoken.includes("test") || spoken.includes("typing"))
    ) {
      if (!isTestRunning && !isTestPaused) {
        onStartTest?.();
      }
      return;
    }

    if (spoken.includes("pause") && isTestRunning && !isTestPaused) {
      onPauseTest?.();
      return;
    }

    if (spoken.includes("resume") && isTestPaused) {
      onResumeTest?.();
      return;
    }

    if (spoken.includes("reset") || spoken.includes("restart")) {
      onResetTest?.();
      return;
    }

    // Difficulty selection
    if (spoken.includes("easy") || spoken.includes("beginner")) {
      onSelectDifficulty?.("easy");
      return;
    }

    if (spoken.includes("medium") || spoken.includes("intermediate")) {
      onSelectDifficulty?.("medium");
      return;
    }

    if (spoken.includes("hard") || spoken.includes("difficult") || spoken.includes("advanced")) {
      onSelectDifficulty?.("hard");
      return;
    }

    // Navigation commands
    if (spoken.includes("home") || spoken.includes("go to home")) {
      navigate("/dashboard");
      return;
    }

    if (spoken.includes("back") || spoken.includes("go back")) {
      navigate(-1);
      return;
    }

    if (spoken.includes("practice") || spoken.includes("go to practice")) {
      navigate("/practice");
      return;
    }

    // Scroll commands
    if (spoken.includes("scroll down")) {
      window.scrollBy({ top: 400, behavior: "smooth" });
      return;
    }

    if (spoken.includes("scroll up")) {
      window.scrollBy({ top: -400, behavior: "smooth" });
      return;
    }

    // Help command
    if (spoken.includes("help") || spoken.includes("what can i say")) {
      const helpMessage = "You can say: 'Start test', 'Pause', 'Resume', 'Reset', 'Easy', 'Medium', 'Hard', 'Go back', 'Home'";
      console.log(helpMessage);
      return;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: listening ? "#10b981" : "#0f766e",
        color: "white",
        padding: "14px 20px",
        borderRadius: "50px",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
      onClick={toggleListening}
      title={listening ? "Click to stop listening" : "Click to start voice control"}
    >
      <span style={{ fontSize: "18px" }}>🎤</span>
      <span>{listening ? "Listening..." : "Voice Control"}</span>
    </div>
  );
};

export default VoiceControlTypingMaster;

