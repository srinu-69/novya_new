import React, { useRef, useState, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaList, FaTimes } from "react-icons/fa";
import "./VoiceControlParent.css";

const VoiceControlParent = ({
  setSelectedSection,
  parentName,
  notifications = [],
  onLogout,
  changeLanguage,
  openLanguageMenu,
  openNotificationsMenu,
  openParentProfile
}) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [showCommandList, setShowCommandList] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  // Available commands for display
  const availableCommands = [
    {
      category: "Navigation",
      commands: [
        { phrase: "Go to home", action: "navigates to dashboard" },
        { phrase: "Open profile", action: "opens child profile" },
        { phrase: "My profile", action: "opens parent profile" },
        { phrase: "Open attendance", action: "shows attendance" },
        { phrase: "Open progress", action: "shows grades" },
        { phrase: "Open homework", action: "shows assignments" },
        { phrase: "Open mock reports", action: "shows test reports" },
        { phrase: "Open study planner", action: "shows study plan" },
        { phrase: "Open contact", action: "shows contact page" }
      ]
    },
    {
      category: "Actions",
      commands: [
        { phrase: "Read notifications", action: "reads your notifications" },
        { phrase: "Open language menu", action: "opens language dropdown" },
        { phrase: "Show notifications", action: "opens notifications panel" },
        { phrase: "Log out", action: "logs you out" }
      ]
    },
    {
      category: "Information",
      commands: [
        { phrase: "What time is it", action: "tells current time" },
        { phrase: "What's the date", action: "tells today's date" },
        { phrase: "What day is today", action: "tells day of week" }
      ]
    },
    {
      category: "Language",
      commands: [
        { phrase: "Change language to Hindi", action: "sets language to Hindi" },
        { phrase: "Change language to Telugu", action: "sets language to Telugu" },
        { phrase: "Change language to Tamil", action: "sets language to Tamil" },
        { phrase: "Change language to Kannada", action: "sets language to Kannada" },
        { phrase: "Change language to Malayalam", action: "sets language to Malayalam" },
        { phrase: "Change language to English", action: "sets language to English" }
      ]
    }
  ];

  const normalize = (text) => {
    if (!text) return "";
    
    const cleaned = text
      .replace(/’/g, "'")
      .replace(/`/g, "'")
      .replace(/[^\w'\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    return cleaned;
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition not supported on this browser/device.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setTranscript("");
    setHelpMessage("");
    setListening(true);

    recognition.onresult = (event) => {
      const raw = event.results[0][0].transcript || "";
      const normalized = normalize(raw);
      console.log("[VoiceControlParent] raw transcript:", raw);
      console.log("[VoiceControlParent] normalized:", normalized);
      setTranscript(raw);
      
      // Add to command history
      setCommandHistory(prev => [
        { command: raw, timestamp: new Date().toLocaleTimeString(), success: true },
        ...prev.slice(0, 9) // Keep only last 10 commands
      ]);
      
      handleCommand(normalized, raw);
    };

    recognition.onerror = (e) => {
      console.warn("[VoiceControlParent] recognition error:", e);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("[VoiceControlParent] recognition start failed:", e);
      setListening(false);
    }
  };

  useEffect(() => {
    if (!transcript) return;

    const timer = setTimeout(() => {
      setTranscript("");
    }, 1500);

    return () => clearTimeout(timer);
  }, [transcript]);

  // Helper to test presence of any of words
  const containsAny = (cmd, words) => {
    for (const w of words) {
      if (cmd.indexOf(w) !== -1) return true;
    }
    return false;
  };

  // Show command list
  const showCommandsList = () => {
    setShowCommandList(true);
    speak("Here are all available voice commands");
  };

  // MAIN COMMAND HANDLER
  const handleCommand = (cmd, raw = "") => {
    if (!cmd) {
      speak("I didn't catch that. Try saying 'what can you do' for help.");
      return;
    }

    // SHOW COMMANDS LIST
    if (/\b(show commands|command list|list commands|all commands|available commands)\b/.test(cmd)) {
      showCommandsList();
      return;
    }

    // OPEN PARENT PROFILE
    if (
      cmd.includes("parent profile") ||
      cmd.includes("my profile") ||
      (cmd.includes("profile") && !cmd.includes("child"))
    ) {
      if (typeof openParentProfile === "function") {
        openParentProfile();
        speak("Opening your profile");
      }
      return;
    }

    // OPEN CHILD PROFILE
    if (
      cmd.includes("child profile") ||
      cmd.includes("student profile") ||
      cmd.includes("kid profile")
    ) {
      execute("profile");
      speak("Opening child profile");
      return;
    }

    // QUICK HELP
    if (/\b(what can you do|help|show commands|commands)\b/.test(cmd)) {
      return showHelp();
    }

    // TIME queries
    if (/\b(what('?s| is) the time|what time is it|current time|tell me the time|time right now|what's the time|what s the time)\b/.test(cmd)) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      speak(`It is ${timeStr}`);
      return;
    }

    // LOGOUT
    if (/\b(log ?out|sign ?out)\b/.test(cmd)) {
      speak("Logging out now");
      if (typeof onLogout === "function") onLogout();
      return;
    }

    // READ NOTIFICATIONS
    if (/\b(read|show|tell me|play) (my )?(notification|notifications|alerts|messages|message)\b/.test(cmd)
      || /\b(read notifications|read notification|read my notifications|read alerts)\b/.test(cmd)
      || (cmd.startsWith("read ") && containsAny(cmd, ["notification", "notifications", "alert", "alerts", "message", "messages"]))) {
      return readNotifications();
    }

    // OPEN LANGUAGE DROPDOWN
    if (cmd.includes("open language") || cmd.includes("language menu")) {
      if (typeof openLanguageMenu === "function") {
        openLanguageMenu();
        speak("Opening language menu");
      } else {
        speak("Language menu not available");
      }
      return;
    }

    // OPEN NOTIFICATIONS POPUP
    if (
      cmd.includes("open notification") ||
      cmd.includes("open notifications") ||
      cmd.includes("show notifications")
    ) {
      if (typeof openNotificationsMenu === "function") {
        openNotificationsMenu();
        speak("Opening notifications");
      } else {
        speak("Notifications panel not available");
      }
      return;
    }

    // DAY OF WEEK
    if (
      /\b(what('?s| is) the day|day today|current day|today day)\b/.test(cmd)
    ) {
      const day = new Date().toLocaleDateString([], { weekday: "long" });
      speak(`Today is ${day}`);
      return;
    }

    // DATE
    if (
      /\b(what('?s| is) the date|today'?s date|current date|date today)\b/.test(cmd)
    ) {
      const date = new Date().toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      speak(`Today's date is ${date}`);
      return;
    }

    // LANGUAGE CHANGE
    const langMatch = cmd.match(/\b(hindi|telugu|tamil|kannada|malayalam|english)\b/);
    if (langMatch) {
      const name = langMatch[1];
      const map = { hindi: "hi", telugu: "te", tamil: "ta", kannada: "kn", malayalam: "ml", english: "en" };
      const code = map[name];
      if (code) {
        return changeTo(code, capitalize(name));
      }
    }
    if (/\b(change|switch|set).*language\b/.test(cmd) && !langMatch) {
      speak("Which language would you like? Say for example, 'change language to Hindi'.");
      return;
    }

    // NAVIGATION
    if (/\b(open|show|go to)?\s*(home|dashboard)\b/.test(cmd)) return execute("home");
    if (/\b(open|show|go to)\s*child profile\b/.test(cmd)) return execute("profile");
    if (/\b(open|show|go to)?\s*(attendance|show attendance)\b/.test(cmd)) return execute("attendance");
    if (/\b(open|show|go to)?\s*(progress|grades|report card|report)\b/.test(cmd)) return execute("grades");
    if (/\b(open|show|go to)?\s*(homework|assignment|assignments)\b/.test(cmd)) return execute("homework");
    if (/\b(open|show|go to)?\s*(mock|mock test|mock reports|test reports|reports)\b/.test(cmd)) return execute("mockreports");
    if (/\b(open|show|go to)?\s*(study planner|study plan|planner|study)\b/.test(cmd)) return execute("studyplanner");
    if (/\b(open|show|go to)?\s*(contact|contact us|helpdesk|support)\b/.test(cmd)) return execute("faq");

    // fallback
    speak(`I heard: "${raw || cmd}". I don't understand that command. Say "show commands" for all available options.`);
  };

  const execute = (section) => {
    if (typeof setSelectedSection === "function") {
      setSelectedSection(section);
      speak(`Opening ${friendlyName(section)}`);
    } else {
      console.warn("[VoiceControlParent] setSelectedSection not provided.");
      speak("Navigation function is not available.");
    }
  };

  const friendlyName = (key) => {
    const map = {
      home: "home",
      profile: "profile",
      attendance: "attendance",
      grades: "progress",
      homework: "homework",
      mockreports: "mock test reports",
      studyplanner: "study planner",
      faq: "contact"
    };
    return map[key] || key;
  };

  const changeTo = (code, name) => {
    if (!code) {
      speak("Language not recognized.");
      return;
    }
    if (typeof changeLanguage === "function") {
      changeLanguage(code);
      speak(`Changed language to ${name}`);
    } else {
      console.warn("[VoiceControlParent] changeLanguage prop missing.");
      speak("Language change function is not available.");
    }
  };

  const readNotifications = () => {
    if (!notifications || notifications.length === 0) {
      speak("You have no notifications.");
      return;
    }
    const unread = notifications.filter(n => !n.read);
    const list = (unread.length ? unread : notifications).slice(0, 6);
    let message = list.length === 0 ? "No new notifications." : `You have ${list.length} notifications. `;
    list.forEach((n, i) => {
      const title = n.title || `notification ${i+1}`;
      const msg = n.message ? `: ${n.message}` : ".";
      message += `${title}${msg} `;
    });
    speak(message);
  };

  const showHelp = () => {
    const msgLines = [
      'You can say: open attendance, open homework, open profile, read notifications,',
      'change language to Hindi, Telugu, Tamil, Kannada, Malayalam or English,',
      'ask "what time is it", or say "logout".',
      'Say "show commands" to see all available voice commands.'
    ];
    setHelpMessage(msgLines.join("\n"));
    speak("I can help you navigate and read notifications. I have shown commands on screen.");
  };

  const speak = (text) => {
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("[VoiceControlParent] speak error:", e);
    }
  };

  const capitalize = (s) => s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <div className="parent-voice-control-container">
      {/* Voice Commands List Button */}
      <button
        className="parent-commands-btn"
        onClick={() => setShowCommandList(!showCommandList)}
        aria-label="Show voice commands"
        title="Show all voice commands"
      >
        <FaList size={15} />
      </button>

      {/* Voice Control Button */}
      <button
        className={`parent-voice-btn ${listening ? "listening" : ""}`}
        onClick={startListening}
        aria-label="Parent voice control"
        title="Start voice control"
      >
        {listening ? <FaMicrophoneSlash size={15} /> : <FaMicrophone size={15} />}
      </button>

      {/* Command List Modal */}
      {showCommandList && (
        <div className="parent-commands-modal">
          <div className="commands-modal-header">
            <h3>🎤 Available Voice Commands</h3>
            <button
              className="close-commands-btn"
              onClick={() => setShowCommandList(false)}
              aria-label="Close commands list"
            >
              <FaTimes size={14} />
            </button>
          </div>
          
          <div className="commands-modal-content">
            {availableCommands.map((category, index) => (
              <div key={index} className="command-category">
                <h4>{category.category}</h4>
                <div className="command-list">
                  {category.commands.map((cmd, cmdIndex) => (
                    <div key={cmdIndex} className="command-item">
                      <div className="command-phrase">"{cmd.phrase}"</div>
                      <div className="command-action">{cmd.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="command-history">
                <h4>Recent Commands</h4>
                <div className="history-list">
                  {commandHistory.slice(0, 5).map((item, index) => (
                    <div key={index} className="history-item">
                      <span className="history-command">"{item.command}"</span>
                      <span className="history-time">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="commands-tips">
              <p><strong>💡 Tips:</strong></p>
              <ul>
                <li>Say "show commands" to open this list</li>
                <li>Say "what can you do" for quick help</li>
                <li>Speak clearly in a quiet environment</li>
                <li>Click the microphone to start listening</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="parent-transcript">
          <strong>You said:</strong> "{transcript}"
        </div>
      )}

      {/* Help Message Display */}
      {helpMessage && (
        <div className="parent-help-box">
          <pre>{helpMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceControlParent;