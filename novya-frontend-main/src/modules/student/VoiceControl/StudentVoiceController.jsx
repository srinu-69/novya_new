
import React, { useEffect, useRef, useState } from "react";
import { Mic, HelpCircle } from "lucide-react";

const StudentVoiceController = ({ onAction }) => {
  const recognitionRef = useRef(null);
  const lastSubjectRef = useRef(null); // remember last subject
  const [listening, setListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false); // 👈 for the help popup

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // ---------------------------------------------------------
  //         MAIN VOICE COMMAND PROCESSING
  // ---------------------------------------------------------
  const handleVoiceCommand = (rawText) => {
    console.log("RAW:", rawText);

    let text = rawText.toLowerCase().replace(/[^\w\s]/g, "").trim();

    const numbers = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };

    Object.keys(numbers).forEach((word) => {
      text = text.replace(new RegExp(`\\b${word}\\b`, "g"), numbers[word]);
    });

    console.log("NORMALIZED:", text);

    const fullAction = text;

    // -------------------------------------------------
    // 1️⃣ SUBJECT DETECTION (with aliases)
    // -------------------------------------------------
    const subjectMap = {
      maths: "Maths",
      math: "Maths",
      science: "Science",
      english: "English",
      history: "History",
      civics: "Civics",
      geography: "Geography",

      economics: "Economics",
      economic: "Economics",
      economy: "Economics",

      computer: "Computer",
      computers: "Computer",
      biology: "Biology",
    };

    let detectedSubject = null;

    Object.keys(subjectMap).forEach((word) => {
      if (text.includes(word)) {
        detectedSubject = subjectMap[word];
        console.log("✔ SUBJECT DETECTED (raw):", word, "→", detectedSubject);

        text = text.replace(word, "").trim();
      }
    });

    if (detectedSubject) {
      lastSubjectRef.current = detectedSubject;
      onAction({
        action: "openSubject",
        data: detectedSubject,
        originalFullAction: fullAction,
      });
    }

    const currentSubject = lastSubjectRef.current || null;

    // -------------------------------------------------
    // 2️⃣ CLASS DETECTION
    // -------------------------------------------------
    const classMatch = text.match(/class\s?(7|8|9|10)/);
    if (classMatch) {
      onAction({
        action: "openClass",
        data: classMatch[1],
        subject: currentSubject,
      });
    }

    // -------------------------------------------------
    // 3️⃣ COMBO DETECTION: chapter X topic Y
    // -------------------------------------------------
    const comboMatch = text.match(/chapter\s?(\d+).*?(topic|subtopic)\s?(\d+)/);

    if (comboMatch) {
      const chapterNumber = parseInt(comboMatch[1], 10);
      const subtopicIndex = parseInt(comboMatch[3], 10) - 1;

      console.log("✔ COMBO DETECTED:", chapterNumber, subtopicIndex);

      onAction({
        action: "openSubtopicWithNames",
        data: { chapterNumber, subtopicIndex },
        subject: currentSubject,
        needsSubjectSwitch: true,
      });

      return;
    }

    // -------------------------------------------------
    // 4️⃣ SUBTOPIC ONLY
    // -------------------------------------------------
    const topicMatch = text.match(/(topic|subtopic)\s?(\d+)/);
    if (topicMatch) {
      const subtopicIndex = parseInt(topicMatch[2], 10) - 1;

      onAction({
        action: "openSubtopic",
        data: { chapterNumber: null, subtopicIndex },
        subject: currentSubject,
        needsSubjectSwitch: true,
      });

      return;
    }

    // -------------------------------------------------
    // 5️⃣ CHAPTER ONLY
    // -------------------------------------------------
    const chapterMatch = text.match(/chapter\s?(\d+)/);
    if (chapterMatch) {
      const chapterNumber = parseInt(chapterMatch[1], 10);

      onAction({
        action: "openChapter",
        data: chapterNumber,
        subject: currentSubject,
        needsSubjectSwitch: true,
      });

      return;
    }

    console.log("❌ No matching voice command.");
  };

  // ---------------------------------------------------------
  //  SPEECH RECOGNITION INITIALIZATION
  // ---------------------------------------------------------
  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      console.log("VOICE:", spoken);
      handleVoiceCommand(spoken);
    };

    recognitionRef.current = recognition;
  }, []); // run once

  const startListening = () => {
    recognitionRef.current?.start();
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        position: "relative",
      }}
    >
      {/* Mic + Help icon row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {/* Mic button */}
        <button
          onClick={startListening}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: listening ? "#10b981" : "#0f766e",
            color: "white",
            cursor: "pointer",
            boxShadow: listening ? "0 0 15px #10b981" : "none",
          }}
        >
          <Mic size={28} />
        </button>

        {/* Help icon */}
        <button
          onClick={() => setShowHelp((prev) => !prev)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            border: "1px solid #0f766e",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="How to use voice commands"
        >
          <HelpCircle size={20} color="#0f766e" />
        </button>
      </div>

      {/* Status text */}
      <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>
        {listening ? "Listening..." : "Tap to Speak"}
      </p>

      {/* Help popup */}
      {showHelp && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "320px",
            background: "#0f172a",
            color: "white",
            padding: "12px 14px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(15,23,42,0.6)",
            fontSize: "13px",
            textAlign: "left",
            zIndex: 50,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "14px" }}>
              Voice Commands Guide
            </span>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ lineHeight: 1.5 }}>
            <div style={{ marginBottom: "6px" }}>
              <strong>1. Full command (subject + chapter + topic)</strong>
              <div style={{ marginLeft: "10px", marginTop: "2px" }}>
                <div>• “Maths chapter 4 topic 2 open”</div>
                <div>• “Civics chapter 1 subtopic 3 open”</div>
              </div>
            </div>

            <div style={{ marginBottom: "6px" }}>
              <strong>2. Subject and chapter only</strong>
              <div style={{ marginLeft: "10px", marginTop: "2px" }}>
                <div>• “Computer open”</div>
                <div>• “Computer chapter 2”</div>
              </div>
            </div>

            <div style={{ marginBottom: "4px" }}>
              <strong>3. Topic only (when chapter is already open)</strong>
              <div style={{ marginLeft: "10px", marginTop: "2px" }}>
                <div>• “topic 1 open”</div>
                <div>• “subtopic 4”</div>
              </div>
            </div>

            <div style={{ marginTop: "6px", color: "#9ca3af" }}>
              Tip: You can also say numbers as words, like “chapter four topic
              two”.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVoiceController;