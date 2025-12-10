import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControlLearn = ({
  subjects = [],
  selectedSubject,
  chapters = [],
  subtopics = {},
  todayAgenda,
  navigate,
  onSubjectChange,
  onChapterExpand,
  onSubtopicOpen,
  onStartTask,
  currentClass = '7'
}) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  // ⭐ Track last expanded chapter
  const lastExpandedChapterRef = useRef(null);

  // -----------------------------------------
  // Convert spoken words → numbers
  // -----------------------------------------
  const wordToNumberMap = {
    one: 1, first: 1,
    two: 2, second: 2,
    three: 3, third: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10
  };

  const extractNumber = (text) => {
    const digit = text.match(/\d+/);
    if (digit) return parseInt(digit[0]);

    const words = text.split(" ");
    for (const w of words) {
      if (wordToNumberMap[w]) return wordToNumberMap[w];
    }
    return null;
  };

  // -----------------------------------------
  // Initialize speech recognizer
  // -----------------------------------------
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
      console.log("🎤 Command:", transcript);
      handleCommand(transcript);
    };

    recog.onerror = () => setListening(false);
    recognitionRef.current = recog;
  }, []);

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

  // -------------------------------------------------------------------
  // ⭐ MAIN COMMAND HANDLER
  // -------------------------------------------------------------------
  const handleCommand = (cmd) => {
    const spoken = cmd.toLowerCase();

    // -------------------------------------------------------------------
    // 0️⃣ Fallback subjects if empty
    // -------------------------------------------------------------------
    const safeSubjects =
      subjects.length > 0
        ? subjects
        : [
            { name: "Maths" },
            { name: "Science" },
            { name: "English" },
            { name: "History" },
            { name: "Civics" },
            { name: "Geography" },
            { name: "Economics" },
            { name: "Computer" }
          ];

    // -------------------------------------------------------------------
    // 1️⃣ Combined command: "open civics class 9"
    // -------------------------------------------------------------------
    const comboMatch = spoken.match(/open\s+(\w+)\s+class\s*(7|8|9|10)/);
    if (comboMatch) {
      const detectedSubject = comboMatch[1];
      const detectedClass = comboMatch[2];

      console.log("✔ Combined command detected:", detectedSubject, detectedClass);

      onSubjectChange(detectedSubject);

      navigate(`/learn/class${detectedClass}?subject=${detectedSubject}`);
      return;
    }

    // -------------------------------------------------------------------
    // 2️⃣ CLASS detection (no return!)
    // -------------------------------------------------------------------
    const classMatch = spoken.match(/\bclass\s*(7|8|9|10)\b/);
    let detectedClass = null;

    if (classMatch) {
      detectedClass = classMatch[1];
      console.log("✔ Class detected:", detectedClass);

      navigate(`/learn/class${detectedClass}?subject=${selectedSubject}`);
    }

    // -------------------------------------------------------------------
    // 3️⃣ SUBJECT detection
    // -------------------------------------------------------------------
    safeSubjects.forEach((sub) => {
      const subjectName = sub.name.toLowerCase();

      const aliases = [
        subjectName,
        subjectName.replace("s", ""), // computers → computer
        subjectName.replace("ers", "er"),
        subjectName.replace("ics", "ic"), // civics → civic
        subjectName.replace(" ", ""),
        subjectName.slice(0, 4) // comp, math, hist
      ];

      if (aliases.some((a) => spoken.includes(a))) {
        console.log("✔ Subject detected:", sub.name);

        onSubjectChange(sub.name);

        const finalClass = detectedClass || 7;

        setTimeout(() => {
          navigate(`/learn/class${finalClass}?subject=${sub.name}`);
        }, detectedClass ? 350 : 0);
      }
    });

    // -------------------------------------------------------------------
    // 4️⃣ Start task
    // -------------------------------------------------------------------
    if (spoken.includes("start task")) {
      onStartTask?.();
    }

    // -------------------------------------------------------------------
    // 5️⃣ Chapter expand
    // -------------------------------------------------------------------
    if (spoken.includes("open chapter")) {
      const num = extractNumber(spoken);
      if (num) {
        lastExpandedChapterRef.current = num;
        onChapterExpand(num);
      }
    }

    // -------------------------------------------------------------------
    // 6️⃣ Go to full chapter
    // -------------------------------------------------------------------
    if (spoken.includes("go to chapter")) {
      const num = extractNumber(spoken);
      if (num) {
        const chapter = chapters.find((c) => c.number === num);
        if (chapter) {
          navigate(
            `/lesson/class${currentClass}/${selectedSubject}/${num}?chapterTitle=${chapter.title}`
          );
        }
      }
    }

    // -------------------------------------------------------------------
    // 7️⃣ Subtopic open
    // -------------------------------------------------------------------
    if (
      spoken.includes("open topic") ||
      spoken.includes("open subtopic") ||
      spoken.includes("go to topic") ||
      spoken.includes("go to subtopic")
    ) {
      const num = extractNumber(spoken);
      if (!num) return;

      const subIndex = num - 1;

      const activeChapter =
        lastExpandedChapterRef.current ||
        todayAgenda?.chapter?.number ||
        chapters[0]?.number;

      const chapterObj = chapters.find((c) => c.number === activeChapter);
      if (!chapterObj) return;

      // Get subtopics from the subtopics prop (structured as subtopics[class][subject][chapter])
      const chapterSubtopics = subtopics?.[currentClass]?.[selectedSubject]?.[activeChapter] || [];
      const subtopicName = chapterSubtopics[subIndex] || `Subtopic ${num}`;

      // Use the callback if provided, otherwise navigate directly
      if (onSubtopicOpen) {
        onSubtopicOpen(activeChapter, subIndex, chapterObj.title, subtopicName);
      } else {
        navigate(
          `/lesson/class${currentClass}/${selectedSubject}/${chapterObj.number}?chapterTitle=${chapterObj.title}&subtopic=${encodeURIComponent(
            subtopicName
          )}`
        );
      }
    }

    // -------------------------------------------------------------------
    // 8️⃣ Back
    // -------------------------------------------------------------------
    if (spoken.includes("back")) {
      navigate(-1);
    }

    // -------------------------------------------------------------------
    // 9️⃣ Home
    // -------------------------------------------------------------------
    if (spoken.includes("home")) {
      navigate("/dashboard");
    }
  };

  // -------------------------------------------------------------------
  // UI button
  // -------------------------------------------------------------------
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
        zIndex: 9999
      }}
      onClick={toggleListening}
    >
      🎤 {listening ? "Listening..." : "Voice Control"}
    </div>
  );
};

export default VoiceControlLearn;
