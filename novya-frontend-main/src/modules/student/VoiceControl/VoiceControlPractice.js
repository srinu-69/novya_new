import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControlPractice = ({
  navigate,
  currentPage = "main", // "main", "quickpractice", "mocktest", "spinwheel", "typingmaster"
  onNavigateToPage
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
      console.log("🎤 Practice Command:", transcript);
      setLastCommand(transcript);
      handleCommand(transcript);
    };

    recog.onerror = () => setListening(false);
    recognitionRef.current = recog;
  }, [currentPage]);

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

    // Navigation to different practice pages
    if (
      spoken.includes("quick practice") ||
      spoken.includes("quick practice") ||
      spoken.includes("go to quick practice") ||
      spoken.includes("open quick practice")
    ) {
      if (onNavigateToPage) {
        onNavigateToPage("quickpractice");
      } else {
        navigate("/quiz");
      }
      return;
    }

    if (
      spoken.includes("mock test") ||
      spoken.includes("mocktest") ||
      spoken.includes("go to mock test") ||
      spoken.includes("open mock test")
    ) {
      if (onNavigateToPage) {
        onNavigateToPage("mocktest");
      } else {
        navigate("/mocktest");
      }
      return;
    }

    if (
      spoken.includes("spin wheel") ||
      spoken.includes("spinwheel") ||
      spoken.includes("go to spin wheel") ||
      spoken.includes("open spin wheel")
    ) {
      if (onNavigateToPage) {
        onNavigateToPage("spinwheel");
      } else {
        navigate("/practice");
      }
      return;
    }

    if (
      spoken.includes("typing master") ||
      spoken.includes("typingmaster") ||
      spoken.includes("go to typing master") ||
      spoken.includes("open typing master") ||
      spoken.includes("typing practice")
    ) {
      if (onNavigateToPage) {
        onNavigateToPage("typingmaster");
      } else {
        navigate("/typing-master");
      }
      return;
    }

    // General navigation
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
      const helpMessage = "You can say: 'Quick Practice', 'Mock Test', 'Spin Wheel', 'Typing Master', 'Go back', 'Home', 'Scroll down', 'Scroll up'";
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

export default VoiceControlPractice;

