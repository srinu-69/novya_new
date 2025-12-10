import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControlCareer = ({
  navigate,
  onShowDetails,
  onCloseDetails,
  currentSection = null,
  availableSections = []
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
      console.log("🎤 Career Command:", transcript);
      setLastCommand(transcript);
      handleCommand(transcript);
    };

    recog.onerror = () => setListening(false);
    recognitionRef.current = recog;
  }, [currentSection, availableSections]);

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

    // Navigation commands
    if (spoken.includes("home") || spoken.includes("go to home")) {
      navigate("/dashboard");
      return;
    }

    if (spoken.includes("back") || spoken.includes("go back")) {
      navigate(-1);
      return;
    }

    // Section navigation
    if (spoken.includes("show quiz") || spoken.includes("open quiz") || spoken.includes("quiz performance")) {
      onShowDetails?.({ id: "quiz" });
      return;
    }

    if (spoken.includes("show mock") || spoken.includes("open mock") || spoken.includes("mock test performance")) {
      onShowDetails?.({ id: "mock" });
      return;
    }

    if (spoken.includes("show overall") || spoken.includes("open overall") || spoken.includes("overall performance")) {
      onShowDetails?.({ id: "overall" });
      return;
    }

    if (spoken.includes("close") || spoken.includes("close details") || spoken.includes("close modal")) {
      onCloseDetails?.();
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
      const helpMessage = "You can say: 'Show quiz', 'Show mock test', 'Show overall', 'Close', 'Scroll down', 'Scroll up', 'Go back', 'Home'";
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

export default VoiceControlCareer;

