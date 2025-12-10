import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControlSpinWheel = ({
  navigate,
  onSpin,
  spinsLeft = 0,
  isSpinning = false
}) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

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
      console.log("🎤 Spin Wheel Command:", transcript);
      setLastCommand(transcript);
      handleCommand(transcript);
    };

    recog.onerror = () => setListening(false);
    recognitionRef.current = recog;
  }, [spinsLeft, isSpinning]);

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

  const handleCommand = (cmd) => {
    const spoken = cmd.toLowerCase();

    // Spin wheel commands
    if (
      spoken.includes("spin") && 
      (spoken.includes("wheel") || spoken.includes("spin wheel"))
    ) {
      if (spinsLeft > 0 && !isSpinning) {
        onSpin?.();
      } else if (spinsLeft <= 0) {
        console.log("No spins left");
      } else if (isSpinning) {
        console.log("Wheel is already spinning");
      }
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

    if (spoken.includes("quick practice") || spoken.includes("quickpractice")) {
      navigate("/quiz");
      return;
    }

    if (spoken.includes("mock test") || spoken.includes("mocktest")) {
      navigate("/mock-test");
      return;
    }

    if (spoken.includes("typing master") || spoken.includes("typingmaster")) {
      navigate("/typing-master");
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
      const helpMessage = "You can say: 'Spin the wheel', 'Spin wheel', 'Go back', 'Home', 'Quick Practice', 'Mock Test', 'Typing Master'";
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

export default VoiceControlSpinWheel;

