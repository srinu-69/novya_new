import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControlQuickPractice = ({
  navigate,
  currentPage = "class_selection", // 'class_selection', 'subject_selection', 'quiz'
  selectedClass = null,
  selectedSubject = null,
  currentQuestion = 0,
  totalQuestions = 0,
  quizStarted = false,
  onSelectClass,
  onSelectSubject,
  onStartQuiz,
  onNextQuestion,
  onPreviousQuestion,
  onAnswerQuestion,
  onFinishQuiz,
  onBack,
  availableClasses = [],
  availableSubjects = [],
  currentOptions = []
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
      console.log("🎤 QuickPractice Command:", transcript);
      setLastCommand(transcript);
      handleCommand(transcript);
    };

    recog.onerror = () => setListening(false);
    recognitionRef.current = recog;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [currentPage, selectedClass, selectedSubject, quizStarted, currentQuestion, availableClasses, availableSubjects]);

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

  const extractNumber = (text) => {
    // First try to match digits (including "8th", "7th", etc.)
    const digitMatch = text.match(/\b(\d+)(?:st|nd|rd|th)?\b/);
    if (digitMatch) return parseInt(digitMatch[1]);
    
    // Then try word numbers
    const wordToNumber = {
      one: 1, first: 1, two: 2, second: 2, three: 3, third: 3,
      four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
    };
    const words = text.split(" ");
    for (const w of words) {
      if (wordToNumber[w]) return wordToNumber[w];
    }
    return null;
  };

  // Helper to find class by name or number
  const findClassByName = (spoken, classes) => {
    if (!classes || classes.length === 0) return null;
    
    // Extract number from spoken text
    const num = extractNumber(spoken);
    if (num) {
      // Try to match by number in class name (e.g., "Class 8", "8", "Grade 8")
      for (const className of classes) {
        const classStr = String(className).toLowerCase();
        // Check if class name contains the number
        if (classStr.includes(String(num)) || classStr.includes(`grade ${num}`) || classStr.includes(`class ${num}`)) {
          return className;
        }
      }
    }
    
    // Try direct name matching
    const spokenLower = spoken.toLowerCase();
    for (const className of classes) {
      const classStr = String(className).toLowerCase();
      if (spokenLower.includes(classStr) || classStr.includes(spokenLower)) {
        return className;
      }
    }
    
    return null;
  };

  const handleCommand = (cmd) => {
    const spoken = cmd.toLowerCase();

    // Navigation commands
    if (spoken.includes("home") || spoken.includes("go to home")) {
      navigate("/dashboard");
      return;
    }

    if (spoken.includes("back") || spoken.includes("go back")) {
      if (onBack) {
        onBack();
      } else {
        navigate(-1);
      }
      return;
    }

    if (spoken.includes("practice") || spoken.includes("go to practice")) {
      navigate("/practice");
      return;
    }

    // Class selection - handle "go to grade 8", "class 8", "8th grade", etc.
    if (currentPage === "class_selection") {
      if (spoken.includes("class") || spoken.includes("grade") || spoken.includes("go to")) {
        const matchedClass = findClassByName(spoken, availableClasses);
        if (matchedClass) {
          onSelectClass?.(matchedClass);
          return;
        }
        
        // Fallback: try by index
        const num = extractNumber(spoken);
        if (num && availableClasses.length > 0) {
          const classIndex = num - 1;
          if (classIndex >= 0 && classIndex < availableClasses.length) {
            onSelectClass?.(availableClasses[classIndex]);
          }
        }
      }
      return;
    }

    // Subject selection - handle "maths", "science", "english", etc.
    if (currentPage === "subject_selection") {
      if (spoken.includes("subject") || spoken.includes("select") || spoken.includes("choose") || spoken.includes("open")) {
        // Try to find subject by name first
        const subjectMap = {
          'math': 'Maths', 'maths': 'Maths', 'mathematics': 'Maths',
          'science': 'Science', 'sci': 'Science',
          'english': 'English', 'eng': 'English',
          'history': 'History', 'hist': 'History',
          'civics': 'Civics', 'civic': 'Civics',
          'geography': 'Geography', 'geo': 'Geography',
          'computer': 'Computer', 'computers': 'Computer', 'comp': 'Computer',
          'economics': 'Economics', 'econ': 'Economics'
        };
        
        // Check for subject name in spoken text
        for (const [key, value] of Object.entries(subjectMap)) {
          if (spoken.includes(key)) {
            const foundSubject = availableSubjects.find(sub => 
              String(sub).toLowerCase().includes(value.toLowerCase()) || 
              String(sub).toLowerCase() === value.toLowerCase()
            );
            if (foundSubject) {
              onSelectSubject?.(foundSubject);
              return;
            }
          }
        }
        
        // Fallback: try by index
        const num = extractNumber(spoken);
        if (num && availableSubjects.length > 0) {
          const subjectIndex = num - 1;
          if (subjectIndex >= 0 && subjectIndex < availableSubjects.length) {
            onSelectSubject?.(availableSubjects[subjectIndex]);
          }
        }
      }
      return;
    }

    // Quiz commands
    if (quizStarted) {
      if (spoken.includes("next") || spoken.includes("next question")) {
        onNextQuestion?.();
        return;
      }

      if (spoken.includes("previous") || spoken.includes("previous question") || spoken.includes("back")) {
        onPreviousQuestion?.();
        return;
      }

      if (spoken.includes("finish") || spoken.includes("submit") || spoken.includes("end quiz")) {
        onFinishQuiz?.();
        return;
      }

      // Answer selection (A, B, C, D or 1, 2, 3, 4)
      if (spoken.includes("option") || spoken.includes("answer") || spoken.includes("select")) {
        const optionMatch = spoken.match(/\b(a|b|c|d|1|2|3|4|one|two|three|four|first|second|third|fourth)\b/);
        if (optionMatch) {
          const option = optionMatch[1].toLowerCase();
          let index = -1;
          if (option === 'a' || option === '1' || option === 'one' || option === 'first') index = 0;
          else if (option === 'b' || option === '2' || option === 'two' || option === 'second') index = 1;
          else if (option === 'c' || option === '3' || option === 'three' || option === 'third') index = 2;
          else if (option === 'd' || option === '4' || option === 'four' || option === 'fourth') index = 3;
          
          if (index >= 0 && index < currentOptions.length) {
            onAnswerQuestion?.(index);
          }
        }
        return;
      }
    }

    // Start quiz
    if (spoken.includes("start") || spoken.includes("begin") || spoken.includes("start quiz")) {
      onStartQuiz?.();
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

export default VoiceControlQuickPractice;

