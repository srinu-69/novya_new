// TeacherVoiceControl.jsx - FIXED VERSION
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

// Helper function to find buttons by text (moved outside)
const findButtonByText = (textOptions) => {
  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    const buttonText = (button.textContent || button.innerText || '').toLowerCase();
    for (const text of textOptions) {
      if (buttonText.includes(text.toLowerCase())) {
        return button;
      }
    }
  }
  return null;
};

export default function TeacherVoiceControl({ api }) {
  const safeApi = api || {};
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const navigate = useNavigate();
  const micRef = useRef();

  // speak using browser voice (Voice A)
  const speak = (text) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      // optional: set voice/lang if desired
      utter.lang = "en-US";
      synth.speak(utter);
    } catch (e) {
      console.warn("speechSynthesis error", e);
    }
  };

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      console.error("Voice Error:", e);
      setIsListening(false);
      speak("I encountered an error with voice recognition.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setLastCommand(transcript);
      handleCommand(transcript);
    };
  }, []);

  const handleCommand = (cmd) => {
    if (!cmd) return;
    
    console.log("Voice command received:", cmd);
    
    // ============================================
    // ATTENDANCE PAGE SPECIFIC COMMANDS (NEW ADDITIONS)
    // ============================================
    
    // Navigate to attendance page
    if (
      cmd.includes("attendance") || 
      cmd.includes("open attendance") || 
      cmd.includes("go to attendance") ||
      cmd.includes("show attendance")
    ) {
      speak("Opening attendance management");
      navigate("/teacher/attendance");
      return;
    }

    // Daily view commands
    if (
      cmd.includes("daily view") || 
      cmd.includes("show daily view") || 
      cmd.includes("switch to daily") ||
      cmd.includes("daily attendance")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const dailyButton = findButtonByText(['📅 daily', 'daily view', 'daily']);
          if (dailyButton) {
            dailyButton.click();
            speak("Switching to daily view");
          } else {
            speak("Daily view not available");
          }
        }, 100);
      } else {
        speak("Please go to attendance page first");
      }
      return;
    }

    // Weekly view commands
    if (
      cmd.includes("weekly view") || 
      cmd.includes("show weekly view") || 
      cmd.includes("switch to weekly") ||
      cmd.includes("weekly attendance")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const weeklyButton = findButtonByText(['📊 weekly', 'weekly view', 'weekly']);
          if (weeklyButton) {
            weeklyButton.click();
            speak("Switching to weekly view");
          } else {
            speak("Weekly view not available");
          }
        }, 100);
      } else {
        speak("Please go to attendance page first");
      }
      return;
    }

    // Monthly view commands
    if (
      cmd.includes("monthly view") || 
      cmd.includes("show monthly view") || 
      cmd.includes("switch to monthly") ||
      cmd.includes("monthly attendance")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const monthlyButton = findButtonByText(['📈 monthly', 'monthly view', 'monthly']);
          if (monthlyButton) {
            monthlyButton.click();
            speak("Switching to monthly view");
          } else {
            speak("Monthly view not available");
          }
        }, 100);
      } else {
        speak("Please go to attendance page first");
      }
      return;
    }

    // Save attendance
    if (
      cmd.includes("save attendance") || 
      cmd.includes("save") || 
      cmd.includes("save data") ||
      cmd.includes("save today's attendance")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const saveButton = findButtonByText(['💾 save', 'save attendance', 'save']);
          if (saveButton) {
            saveButton.click();
            speak("Saving attendance data");
          } else {
            speak("Save button not found");
          }
        }, 100);
      }
      return;
    }

    // Export to Excel
    if (
      cmd.includes("export to excel") || 
      cmd.includes("export excel") || 
      cmd.includes("download excel") ||
      cmd.includes("export attendance")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const exportButton = findButtonByText(['📤 excel', 'export to excel', 'export']);
          if (exportButton) {
            exportButton.click();
            speak("Exporting attendance to Excel");
          } else {
            speak("Export button not found");
          }
        }, 100);
      }
      return;
    }

    // Mark all present
    if (
      cmd.includes("mark all present") || 
      cmd.includes("mark everyone present") || 
      cmd.includes("all present")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          // Find all status select dropdowns and set them to "present"
          const selects = document.querySelectorAll('select');
          let count = 0;
          selects.forEach(select => {
            if (select.value !== 'present') {
              select.value = 'present';
              select.dispatchEvent(new Event('change', { bubbles: true }));
              count++;
            }
          });
          speak(`Marked ${count} students as present`);
        }, 100);
      }
      return;
    }

    // Mark all absent
    if (
      cmd.includes("mark all absent") || 
      cmd.includes("mark everyone absent") || 
      cmd.includes("all absent")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const selects = document.querySelectorAll('select');
          let count = 0;
          selects.forEach(select => {
            if (select.value !== 'absent') {
              select.value = 'absent';
              select.dispatchEvent(new Event('change', { bubbles: true }));
              count++;
            }
          });
          speak(`Marked ${count} students as absent`);
        }, 100);
      }
      return;
    }

    // Show attendance statistics
    if (
      cmd.includes("attendance statistics") || 
      cmd.includes("show statistics") || 
      cmd.includes("attendance stats")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        const presentElements = document.querySelectorAll('[style*="3CB371"]');
        const absentElements = document.querySelectorAll('[style*="DC3545"]');
        const lateElements = document.querySelectorAll('[style*="FFA500"]');
        
        const presentCount = presentElements.length;
        const absentCount = absentElements.length;
        const lateCount = lateElements.length;
        const total = presentCount + absentCount + lateCount;
        
        speak(`Attendance statistics: ${presentCount} present, ${absentCount} absent, ${lateCount} late. Total ${total} students.`);
      }
      return;
    }

    // Previous week
    if (
      cmd.includes("previous week") || 
      cmd.includes("last week") || 
      cmd.includes("go back one week")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const prevButton = findButtonByText(['← previous week', 'previous week', 'prev']);
          if (prevButton) {
            prevButton.click();
            speak("Going to previous week");
          }
        }, 100);
      }
      return;
    }

    // Next week
    if (
      cmd.includes("next week") || 
      cmd.includes("go forward one week")
    ) {
      if (window.location.pathname.includes("/teacher/attendance")) {
        setTimeout(() => {
          const nextButton = findButtonByText(['next week →', 'next week', 'next']);
          if (nextButton) {
            nextButton.click();
            speak("Going to next week");
          }
        }, 100);
      }
      return;
    }

    // Change date
    if (cmd.includes("change date to") || cmd.includes("set date to")) {
      const dateMatch = cmd.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
      if (dateMatch) {
        const day = dateMatch[1];
        const month = dateMatch[2].toLowerCase();
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const monthIndex = months.indexOf(month);
        
        if (monthIndex !== -1 && window.location.pathname.includes("/teacher/attendance")) {
          setTimeout(() => {
            const year = new Date().getFullYear();
            const formattedDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const dateInput = document.querySelector('input[type="date"]');
            if (dateInput) {
              dateInput.value = formattedDate;
              dateInput.dispatchEvent(new Event('change', { bubbles: true }));
              speak(`Date changed to ${month} ${day}`);
            }
          }, 100);
        }
      }
      return;
    }

    // Change month
    if (cmd.includes("change month to") || cmd.includes("set month to")) {
      const monthMatch = cmd.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
      if (monthMatch) {
        const month = monthMatch[1].toLowerCase();
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const monthIndex = months.indexOf(month);
        
        if (monthIndex !== -1 && window.location.pathname.includes("/teacher/attendance")) {
          setTimeout(() => {
            const year = new Date().getFullYear();
            const formattedMonth = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            
            const monthInput = document.querySelector('input[type="month"]');
            if (monthInput) {
              monthInput.value = formattedMonth;
              monthInput.dispatchEvent(new Event('change', { bubbles: true }));
              speak(`Month changed to ${month}`);
            }
          }, 100);
        }
      }
      return;
    }

    // ============================================
    // USER LIST SPECIFIC COMMANDS (KEEP AS IS)
    // ============================================
    
    // View student details
    if (
      cmd.includes("view student details") || 
      cmd.includes("show student details") || 
      cmd.includes("student details") ||
      cmd.includes("open student details")
    ) {
      speak("Opening student details");
      navigate("/teacher/student-details");
      return;
    }

    // View parent details
    if (
      cmd.includes("view parent details") || 
      cmd.includes("show parent details") || 
      cmd.includes("parent details") ||
      cmd.includes("open parent details")
    ) {
      speak("Opening parent details");
      navigate("/teacher/parent-details");
      return;
    }

    // View student overview (within UserList)
    if (
      cmd.includes("view student overview") || 
      cmd.includes("show student overview") || 
      cmd.includes("student overview") ||
      cmd.includes("show students overview")
    ) {
      if (window.location.pathname.includes("/teacher/userlist")) {
        setTimeout(() => {
          const studentButton = findButtonByText(['students overview', 'students', '📊']);
          if (studentButton) {
            studentButton.click();
            speak("Showing student overview");
          } else {
            speak("Could not find student overview button");
          }
        }, 100);
      } else {
        speak("Please go to user list first by saying 'Open user list'");
      }
      return;
    }

    // View parent overview (within UserList)
    if (
      cmd.includes("view parent overview") || 
      cmd.includes("show parent overview") || 
      cmd.includes("parent overview") ||
      cmd.includes("show parents overview")
    ) {
      if (window.location.pathname.includes("/teacher/userlist")) {
        setTimeout(() => {
          const parentButton = findButtonByText(['parents overview', 'parents', '👨‍👩‍👧‍👦']);
          if (parentButton) {
            parentButton.click();
            speak("Showing parent overview");
          } else {
            speak("Could not find parent overview button");
          }
        }, 100);
      } else {
        speak("Please go to user list first by saying 'Open user list'");
      }
      return;
    }

    // Manage students
    if (
      cmd.includes("manage students") || 
      cmd.includes("manage student") || 
      cmd.includes("go to manage students") ||
      cmd.includes("student management")
    ) {
      speak("Managing students");
      navigate("/teacher/student-details");
      return;
    }

    // Manage parents
    if (
      cmd.includes("manage parents") || 
      cmd.includes("manage parent") || 
      cmd.includes("go to manage parents") ||
      cmd.includes("parent management")
    ) {
      speak("Managing parents");
      navigate("/teacher/parent-details");
      return;
    }

    // Switch to students tab (when in UserList)
    if (
      cmd.includes("switch to students") || 
      cmd.includes("show students") || 
      cmd.includes("students tab") ||
      cmd.includes("go to students tab")
    ) {
      if (window.location.pathname.includes("/teacher/userlist")) {
        setTimeout(() => {
          const studentButton = findButtonByText(['students overview', 'students']);
          if (studentButton) {
            studentButton.click();
            speak("Switching to students tab");
          }
        }, 100);
      }
      return;
    }

    // Switch to parents tab (when in UserList)
    if (
      cmd.includes("switch to parents") || 
      cmd.includes("show parents") || 
      cmd.includes("parents tab") ||
      cmd.includes("go to parents tab")
    ) {
      if (window.location.pathname.includes("/teacher/userlist")) {
        setTimeout(() => {
          const parentButton = findButtonByText(['parents overview', 'parents']);
          if (parentButton) {
            parentButton.click();
            speak("Switching to parents tab");
          }
        }, 100);
      }
      return;
    }

    // User List statistics
    if (cmd.includes("total students") || cmd.includes("how many students")) {
      speak("You have 45 students, 38 are active");
      return;
    }

    if (cmd.includes("total parents") || cmd.includes("how many parents")) {
      speak("You have 45 parents connected");
      return;
    }

    if (cmd.includes("pending messages") || cmd.includes("unread messages")) {
      speak("You have 12 pending messages requiring attention");
      return;
    }

    if (cmd.includes("average performance") || cmd.includes("class average")) {
      speak("The average performance is 82 percent");
      return;
    }

    // User List search
    if (cmd.includes("search for") || cmd.includes("find")) {
      const searchQuery = cmd.replace('search for', '').replace('find', '').trim();
      if (searchQuery) {
        setTimeout(() => {
          // Try to find the search input in UserList
          const searchInput = document.querySelector('input[type="text"]');
          if (searchInput && searchInput.placeholder && 
              (searchInput.placeholder.toLowerCase().includes('search') || 
               searchInput.placeholder.toLowerCase().includes('find'))) {
            searchInput.value = searchQuery;
            // Trigger React's onChange event
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype, "value"
            ).set;
            nativeInputValueSetter.call(searchInput, searchQuery);
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
            speak(`Searching for ${searchQuery}`);
          } else {
            speak("Search not available on this page");
          }
        }, 100);
      }
      return;
    }

    if (cmd.includes("clear search") || cmd.includes("reset search")) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput && searchInput.placeholder && 
            (searchInput.placeholder.toLowerCase().includes('search') || 
             searchInput.placeholder.toLowerCase().includes('find'))) {
          searchInput.value = '';
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, "value"
          ).set;
          nativeInputValueSetter.call(searchInput, '');
          const event = new Event('input', { bubbles: true });
          searchInput.dispatchEvent(event);
          speak("Search cleared");
        }
      }, 100);
      return;
    }

    // ============================================
    // ORIGINAL COMMANDS (KEEP AS IS)
    // ============================================
    
    // NAVIGATION
    if (cmd.includes("dashboard") || cmd.includes("go to dashboard")) {
      speak("Opening dashboard");
      navigate("/teacher/dashboard");
      return;
    }
    if (cmd.includes("progress") || cmd.includes("results") || cmd.includes("open progress")) {
      speak("Opening results");
      navigate("/teacher/results");
      return;
    }
    if (cmd.includes("user list") || cmd.includes("users") || cmd.includes("open users")) {
      speak("Opening user list");
      navigate("/teacher/userlist");
      return;
    }
    if (cmd.includes("logout") || cmd.includes("log out")) {
      speak("Logging out");
      navigate("/");
      return;
    }

    // HEADER CONTROLS via api (direct state control)
    if (
      cmd.includes("open notification") ||
      cmd.includes("open notifications") ||
      cmd.includes("show notification") ||
      cmd.includes("show notifications")
    ) {
      safeApi.openNotifications?.();
      speak("Notifications opened");
      return;
    }

    if (
      cmd.includes("close notification") ||
      cmd.includes("close notifications") ||
      cmd.includes("hide notification") ||
      cmd.includes("hide notifications")
    ) {
      safeApi.closeNotifications?.();
      speak("Notifications closed");
      return;
    }

    if (cmd.includes("toggle notification") || cmd.includes("toggle notifications")) {
      safeApi.toggleNotifications?.();
      speak("Toggling notifications");
      return;
    }

    if (cmd.includes("open profile") || cmd.includes("open teacher profile") || cmd.includes("show profile")) {
      api.openProfile?.();
      speak("Profile opened");
      return;
    }
    if (cmd.includes("close profile") || cmd.includes("hide profile")) {
      api.closeProfile?.();
      speak("Profile closed");
      return;
    }

    if (cmd.includes("open language") || cmd.includes("show language")) {
      api.openLanguage?.();
      speak("Language selector opened");
      return;
    }
    if (cmd.includes("close language") || cmd.includes("hide language")) {
      api.closeLanguage?.();
      speak("Language selector closed");
      return;
    }

    // Language change commands (default list)
    if (cmd.includes("change language to hindi") || cmd.includes("switch to hindi") || cmd === "hindi") {
      api.changeLanguage?.("hi");
      speak("Language changed to Hindi");
      return;
    }
    if (cmd.includes("change language to telugu") || cmd.includes("switch to telugu") || cmd === "telugu") {
      api.changeLanguage?.("te");
      speak("Language changed to Telugu");
      return;
    }
    if (cmd.includes("change language to tamil") || cmd.includes("switch to tamil") || cmd === "tamil") {
      api.changeLanguage?.("ta");
      speak("Language changed to Tamil");
      return;
    }
    if (cmd.includes("change language to kannada") || cmd.includes("switch to kannada") || cmd === "kannada") {
      api.changeLanguage?.("kn");
      speak("Language changed to Kannada");
      return;
    }
    if (cmd.includes("change language to malayalam") || cmd.includes("switch to malayalam") || cmd === "malayalam") {
      api.changeLanguage?.("ml");
      speak("Language changed to Malayalam");
      return;
    }
    if (cmd.includes("change language to english") || cmd.includes("switch to english") || cmd === "english") {
      api.changeLanguage?.("en");
      speak("Language changed to English");
      return;
    }

    // Dark mode
    if (cmd.includes("enable dark mode") || cmd.includes("turn on dark mode")) {
      api.enableDark?.(true);
      speak("Dark mode enabled");
      return;
    }
    if (cmd.includes("disable dark mode") || cmd.includes("turn off dark mode")) {
      api.enableDark?.(false);
      speak("Dark mode disabled");
      return;
    }
    if (cmd.includes("toggle dark mode")) {
      api.toggleDark?.();
      speak("Toggling dark mode");
      return;
    }

    // Menu
    if (cmd.includes("open menu") || cmd.includes("open the menu")) {
      api.openMenu?.();
      speak("Opening menu");
      return;
    }
    if (cmd.includes("close menu") || cmd.includes("close the menu")) {
      api.openMenu?.(); // same toggle
      speak("Closing menu");
      return;
    }

    // Extra commands
    if (cmd.includes("scroll down")) {
      window.scrollBy({ top: 400, behavior: "smooth" });
      speak("Scrolling down");
      return;
    }
    if (cmd.includes("scroll up")) {
      window.scrollBy({ top: -400, behavior: "smooth" });
      speak("Scrolling up");
      return;
    }
    if (cmd.includes("go back")) {
      window.history.back();
      speak("Going back");
      return;
    }
    if (cmd.includes("go forward")) {
      window.history.forward();
      speak("Going forward");
      return;
    }
    if (cmd.includes("refresh") || cmd.includes("reload page")) {
      window.location.reload();
      return;
    }
    if (cmd.includes("close all dropdowns") || cmd.includes("close everything")) {
      api.closeAllDropdowns?.();
      speak("Closed all dropdowns");
      return;
    }
    
    // TIME COMMAND
    if (
      cmd.includes("what's the time") ||
      cmd.includes("what is the time") ||
      cmd.includes("tell me the time") ||
      cmd.includes("current time") ||
      cmd.includes("time now") ||
      cmd.includes("time please")
    ) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const formatted = `${hours % 12 || 12}:${minutes} ${period}`;
      speak(`The time is ${formatted}`);
      return;
    }

    // Help command - Updated to include attendance commands
    if (cmd.includes("help") || cmd.includes("what can i say")) {
      const helpMessage = "You can say: " +
        // Navigation
        "'Open dashboard', 'Open attendance', 'Open user list', 'Open results', 'Go back' " +
        // Attendance
        "'Daily view', 'Weekly view', 'Monthly view', 'Save attendance', 'Export to Excel', " +
        "'Mark all present', 'Mark all absent', 'Show statistics', 'Previous week', 'Next week', " +
        "'Change date to [date]', 'Change month to [month]' " +
        // User List
        "'View student details', 'View parent details', 'Show student overview', 'Show parent overview', " +
        "'Manage students', 'Manage parents', 'Switch to students', 'Switch to parents', " +
        "'Search for [name]', 'Clear search', " +
        // Header controls
        "'Open notifications', 'Close notifications', 'Open profile', 'Change language to [language]', " +
        "'Dark mode on', 'Dark mode off', 'What's the time'";
      speak(helpMessage);
      return;
    }

    // not matched
    speak("Sorry, I didn't understand that command. Try saying 'help' for available commands.");
  };

  const toggleListening = () => {
    if (!SpeechRecognition) {
      speak("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) recognition?.stop();
    else recognition?.start();
  };

  return (
    <div
      className="voice-control-wrapper"
      style={{
        display: "flex",
        alignItems: "center",
        marginRight: "10px",
      }}
    >
      <button
        ref={micRef}
        onClick={toggleListening}
        className="mic-btn"
        title="Voice Assistant"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          background: isListening ? "#ffdde1" : "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <i
          className={`bi ${isListening ? "bi-mic-fill" : "bi-mic"}`}
          style={{
            fontSize: "1.3rem",
            color: isListening ? "#f08da2ff" : "#2D5D7B",
          }}
        ></i>
      </button>

      <span
        style={{
          fontSize: "0.75rem",
          color: "#64748b",
          marginLeft: "8px",
          width: "180px",
          minHeight: "20px",
          display: "flex",
          alignItems: "center"
        }}
      >
        {isListening ? "Listening..." : (lastCommand ? `Heard: ${lastCommand}` : "Ready")}
      </span>
    </div>
  );
}