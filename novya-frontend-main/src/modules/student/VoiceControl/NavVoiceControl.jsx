 
// // this is main code
 
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaRobot } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './NavVoiceControl.css';
 
const NavVoiceControl = ({
  openLanguage,
  openNotifications,
  markAllRead,
  clearAllNotifications,
  deleteNotification,
  openCalendar,
  AddSchedule,
  EditSchedule,
  openScheduleInput,
  SaveSchedule,
  deleteSchedule,
  CancelSchedule,
  openRewardPoint,
  openStreak,
  setActiveTab,
  onNavigate,
}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [showWakeWord, setShowWakeWord] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [currentRewardPoints, setCurrentRewardPoints] = useState(0);
 
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const recognitionRef = useRef(null);
 
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'ml', label: 'മലയാളം' },
  ];
 
  // -----------------------
  // Lifecycle
  // -----------------------
  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }
 
    // Initialize wake word detection (always in English)
    initializeWakeWordDetection();
 
    // Load command history
    const savedHistory = localStorage.getItem('voiceCommandHistory');
    if (savedHistory) {
      try {
        setCommandHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.warn('Failed to parse voiceCommandHistory', e);
      }
    }
 
    // Load reward points
    loadRewardPoints();
 
    // Event listeners
    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    window.addEventListener('storage', handleStorageChange);
 
    return () => {
      // Remove listeners
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
      window.removeEventListener('storage', handleStorageChange);
 
      // Stop recognition if running
      try {
        if (recognitionRef.current) {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
      } catch (err) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // -----------------------
  // Reward points helpers
  // -----------------------
  const loadRewardPoints = () => {
    const points = parseInt(localStorage.getItem('rewardPoints'), 10) || 0;
    setCurrentRewardPoints(points);
  };
 
  const handleRewardPointsUpdate = (event) => {
    if (event?.detail?.rewardPoints !== undefined) {
      setCurrentRewardPoints(event.detail.rewardPoints);
    }
  };
 
  const handleStorageChange = (e) => {
    if (e.key === 'rewardPoints') {
      const points = parseInt(e.newValue, 10) || 0;
      setCurrentRewardPoints(points);
    }
 
    if (e.key === 'voiceCommandHistory') {
      try {
        const newHistory = JSON.parse(e.newValue || '[]');
        setCommandHistory(newHistory);
      } catch (err) {
        // ignore
      }
    }
  };
 
  // -----------------------
  // Wake-word detection (FORCED to English)
  // -----------------------
  const initializeWakeWordDetection = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
 
    // Stop any existing recognition first
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (err) {
      // ignore
    }
 
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // <<-- FORCE English for wake-word
 
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
 
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk;
        } else {
          interimTranscript += transcriptChunk;
        }
      }
 
      const combinedTranscript = (finalTranscript + interimTranscript).toLowerCase();
 
      // Check for wake word variations
      if (
        combinedTranscript.includes('hey nov') ||
        combinedTranscript.includes('hello nov') ||
        combinedTranscript.includes('hi nov') ||
        combinedTranscript.includes('okay nov') ||
        combinedTranscript.includes('novya') ||
        combinedTranscript.includes('hey now')
      ) {
        setShowWakeWord(true);
        setIsActive(true);
        speak("Yes! I'm listening. How can I help you?");
        // Give a short delay then start command listener
        setTimeout(() => {
          startCommandListening();
          setShowWakeWord(false);
        }, 800);
      }
    };
 
    recognition.onerror = (event) => {
      // Log but don't break the app
      console.error('Wake word detection error:', event?.error || event);
    };
 
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not start wake-word recognition', err);
    }
  };
 
  // -----------------------
  // Command listening (FORCED to English)
  // -----------------------
  const startCommandListening = () => {
    if (!isSupported) return;
 
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
 
    // Stop any existing recognition used for wake-word to avoid conflicts
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (err) {
      // ignore
    }
 
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // <<-- FORCE English for command recognition
 
    try {
      recognition.start();
    } catch (err) {
      console.warn('Could not start command recognition', err);
      return;
    }
 
    setListening(true);
    setTranscript('');
    setIsActive(true);
 
    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          // save final transcript and process
          setTranscript(text);
          processVoiceCommand(text);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // show interim while speaking
      if (interimTranscript) setTranscript(interimTranscript);
    };
 
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event?.error || event);
      setListening(false);
      setIsActive(false);
 
      if (event?.error === 'no-speech') {
        speak("I didn't hear anything. Please try again.");
      } else if (event?.error === 'audio-capture') {
        speak("I can't access your microphone. Please check your settings.");
      }
 
      // Add failed command to history
      const newCommand = {
        text: 'Recognition failed',
        timestamp: new Date().toISOString(),
        success: false,
      };
      const updatedHistory = [newCommand, ...commandHistory.slice(0, 9)];
      setCommandHistory(updatedHistory);
      try {
        localStorage.setItem('voiceCommandHistory', JSON.stringify(updatedHistory));
      } catch (e) {
        // ignore
      }
    };
 
    recognition.onend = () => {
      setListening(false);
      setIsActive(false);
      // restart wake-word detection after commands end
      setTimeout(() => {
        initializeWakeWordDetection();
      }, 500);
    };
 
    recognitionRef.current = recognition;
  };
 
  const startManualListening = () => {
    speak('What would you like to do?');
    setTimeout(() => {
      startCommandListening();
    }, 450);
  };
 
  const handleLogout = () => {
    speak('Logging out...');
    // Add your logout logic here
    navigate('/');
  };
 
  // -----------------------
  // Command processing helpers
  // -----------------------
  const cleanupAfterCommand = () => {
    setLanguageDropdownOpen(false);
    setAvatarDropdownOpen(false);
  };
 
  const processRewardPointsCommand = (lowerCommand) => {
    if (
      lowerCommand.includes('open reward') ||
      lowerCommand.includes('show reward') ||
      lowerCommand.includes('rewards tab') ||
      lowerCommand.includes('my reward') ||
      lowerCommand.includes('reward history') ||
      lowerCommand.includes('points history') ||
      lowerCommand.includes('how many coins') ||
      lowerCommand.includes('how many points') ||
      lowerCommand.includes('check my coins')
    ) {
      speak(`Opening your reward points. You have ${currentRewardPoints} coins.`);
      openRewardPoint?.();
      cleanupAfterCommand();
 
      window.dispatchEvent(
        new CustomEvent('voiceCommandTriggered', {
          detail: { command: 'open rewards' },
        })
      );
      return true;
    }
 
    if (lowerCommand.includes('how to earn') || lowerCommand.includes('earn coins')) {
      speak('Here are some ways to earn coins. Opening rewards page.');
      openRewardPoint?.();
      setTimeout(() => setActiveTab?.('earn'), 150);
      cleanupAfterCommand();
      return true;
    }
 
    if (lowerCommand.includes('how to use') || lowerCommand.includes('use coins') || lowerCommand.includes('spend coins')) {
      speak('Opening reward shop to spend your coins.');
      openRewardPoint?.();
      setTimeout(() => setActiveTab?.('use'), 150);
      cleanupAfterCommand();
      return true;
    }
 
    return false;
  };
 
  const processVoiceCommand = (command) => {
    if (!command) return;
    const lowerCommand = command.toLowerCase().trim();
    console.log('Processing voice command:', lowerCommand);
 
    // Save to history (successful)
    const historyEntry = {
      text: command,
      timestamp: new Date().toISOString(),
      success: true,
    };
    const updatedHistory = [historyEntry, ...commandHistory.slice(0, 9)];
    setCommandHistory(updatedHistory);
    try {
      localStorage.setItem('voiceCommandHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      // ignore
    }
 
    // Reward points commands
    if (processRewardPointsCommand(lowerCommand)) return;
 
    // LANGUAGE MATCH (this changes UI i18n but voice recognition remains English)
    const langMatch = lowerCommand.match(/\b(english|hindi|tamil|telugu|malayalam|kannada)\b/);
    if (langMatch) {
      const lang = langMatch[1];
      const map = { english: 'en', hindi: 'hi', tamil: 'ta', telugu: 'te', malayalam: 'ml', kannada: 'kn' };
      const code = map[lang];
      if (code) {
        i18n.changeLanguage(code);
        speak(`${lang.charAt(0).toUpperCase() + lang.slice(1)} language selected`);
        cleanupAfterCommand();
        return;
      }
    }
 
    if (/\b(change|switch|set).*language\b/.test(lowerCommand) && !langMatch) {
      speak("Which language would you like? Say for example, 'change language to Hindi'.");
      cleanupAfterCommand();
      return;
    }
 
    // Profile/Avatar commands
    if (lowerCommand.includes('profile') || lowerCommand.includes('avatar') || lowerCommand.includes('my profile') || lowerCommand.includes('account')) {
      if (lowerCommand.includes('open') || lowerCommand.includes('show')) {
        speak('Opening your profile');
        setAvatarDropdownOpen(true);
        return;
      }
 
      if (lowerCommand.includes('view') || lowerCommand.includes('go to')) {
        speak('Opening your profile page');
        onNavigate?.('/user-details');
        setAvatarDropdownOpen(false);
        return;
      }
 
      speak('Opening profile');
      setAvatarDropdownOpen(true);
      return;
    }
 
    // Logout command
    if (lowerCommand.includes('logout') || lowerCommand.includes('sign out') || lowerCommand.includes('log out')) {
      speak('Logging you out');
      handleLogout();
      return;
    }
 
    // Notification commands
    if (lowerCommand.includes('notification') || lowerCommand.includes('notifications') || lowerCommand.includes('alerts')) {
      speak('Opening notifications');
      openNotifications?.();
      cleanupAfterCommand();
      return;
    }
 
    // Calendar commands
    if (lowerCommand.includes('calendar') || lowerCommand.includes('schedule') || lowerCommand.includes('my schedule')) {
      speak('Opening your study calendar');
      openCalendar?.();
      cleanupAfterCommand();
      return;
    }
 
    // Streak commands
    if (lowerCommand.includes('streak') || lowerCommand.includes('my streak') || lowerCommand.includes('streak progress') || lowerCommand.includes('fire')) {
      speak('Showing your learning streak');
      openStreak?.();
      cleanupAfterCommand();
      return;
    }
 
    // Navigation map
    const navigationCommands = {
      mocktest: '/mock-test',
      'mock test': '/mock-test',
      classroom: '/learn',
      learn: '/learn',
      'quick practice': '/quick-practice',
      quickpractice: '/quick-practice',
      career: '/career',
      'study room': '/study-room',
      studyroom: '/study-room',
      home: '/student/dashboard',
      dashboard: '/student/dashboard',
      practice: '/practice',
      'typing master': '/typing-master',
      typing: '/typing-master',
      leaderboard: '/leadership',
      leadership: '/leadership',
      'daily summary': '/daily-summary',
      'quiz badges': '/quizbadges',
      badges: '/quizbadges',
      'profile page': '/user-details',
      'view profile': '/user-details',
      'my profile': '/user-details',
      'spin wheel': '/spin-wheel',
      wheel: '/spin-wheel',
      'voice control': location.pathname,
      'voice commands': location.pathname,
      'reward shop': () => {
        speak('Opening reward points section');
        openRewardPoint?.();
        setTimeout(() => {
          setActiveTab?.('use');
        }, 100);
      },
      'earn coins': () => {
        speak('Showing ways to earn coins');
        openRewardPoint?.();
        setTimeout(() => {
          setActiveTab?.('earn');
        }, 100);
      },
    };
 
    for (const [key, handler] of Object.entries(navigationCommands)) {
      if (lowerCommand.includes(key)) {
        if (typeof handler === 'function') {
          handler();
        } else {
          const action = key === 'home' ? 'dashboard' : key;
          speak(`Opening ${action}`);
          if (onNavigate) {
            onNavigate(handler);
          } else {
            navigate(handler);
          }
        }
        cleanupAfterCommand();
        return;
      }
    }
 
    // Special actions: start mocktest with chapter
    if (lowerCommand.includes('start mocktest') || lowerCommand.includes('begin mocktest')) {
      const chapterMatch = lowerCommand.match(/chapter\s+(\d+)/i);
      if (chapterMatch) {
        const chapter = chapterMatch[1];
        speak(`Starting mock test for chapter ${chapter}. Please select your subject.`);
        navigate('/mock-test');
      } else {
        speak('Opening mock test page. You can select your subject and chapter.');
        navigate('/mock-test');
      }
      cleanupAfterCommand();
      return;
    }
 
    if (lowerCommand.includes('start quick practice') || lowerCommand.includes('begin practice')) {
      speak('Starting quick practice session. Get ready to answer questions!');
      navigate('/quick-practice');
      cleanupAfterCommand();
      return;
    }
 
    // Help commands
    if (lowerCommand.includes('what can you do') || lowerCommand.includes('your commands') || lowerCommand.includes('help')) {
      const helpMessage = `I can help you: \n- Navigate to Mock Test, Classroom, Quick Practice, Spin Wheel and more,\n- Manage your reward points: say \"open reward points\", \"check my coins\", \"how to earn coins\", or \"how to use coins\",\n- Change language (say \"change language to hindi\"),\n- Open notifications (\"show notifications\"),\n- Manage your calendar and schedules,\n- Open your profile menu,\n- And more!\nTry saying \"Hey Nov... open reward points\" or \"Hey Nov... how many coins do I have?\"`;
      speak(helpMessage);
      cleanupAfterCommand();
      return;
    }
 
    // Utility commands
    if (lowerCommand.includes('thank you') || lowerCommand.includes('thanks')) {
      speak('You are welcome! Keep earning those coins and happy learning with Novya.');
      return;
    }
 
    if (lowerCommand.includes('stop') || lowerCommand.includes('cancel')) {
      speak('Command cancelled.');
      return;
    }
 
    if (lowerCommand.includes('clear history') || lowerCommand.includes('reset history')) {
      setCommandHistory([]);
      localStorage.removeItem('voiceCommandHistory');
      speak('Voice command history cleared.');
      return;
    }
 
    // Fallback
    const rewardSuggestion = currentRewardPoints > 0 ? ` By the way, you have ${currentRewardPoints} coins! Try saying \"how to use coins\" to learn how to spend them.` : ' Try saying \"how to earn coins\" to start collecting rewards!';
 
    speak(`I heard: \"${command}\".${rewardSuggestion}`);
  };
 
  // -----------------------
  // TTS
  // -----------------------
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
 
      const voices = window.speechSynthesis.getVoices() || [];
      const preferredVoice = voices.find((voice) => voice.name.includes('Google') || voice.name.includes('Natural') || (voice.lang || '').startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
 
      utterance.onstart = () => console.log('Speaking:', text);
      utterance.onerror = (event) => console.error('Speech synthesis error:', event);
 
      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('Failed to speak', e);
      }
    } else {
      console.log('Text to speak:', text);
    }
  };
 
  if (!isSupported) return null;
 
  return (
    <div className="voice-control-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {/* Wake Word Indicator */}
      {showWakeWord && (
        <div className="wake-word-indicator">
          <FaRobot size={16} />
          <span style={{ marginLeft: 6 }}>Hey Nov! Listening...</span>
        </div>
      )}
 
      <button
        onClick={startManualListening}
        className="mic-btn"
        title="Voice Assistant"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          border: '1px solid #d7d8daff',
          background: listening ? '#ffdde1' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {listening ? <FaMicrophoneSlash size={18} color="#f96e6e" /> : <FaMicrophone size={18} color="#0b0b0b" />}
      </button>
 
      {listening && (
        <div className="voice-listening-indicator">
          <div className="pulse-ring" />
          <span style={{ marginLeft: 8 }}>Listening...</span>
        </div>
      )}
 
      {transcript && (
        <div className="voice-transcript">
          <strong>You said:</strong>&nbsp;"{transcript}"
        </div>
      )}
    </div>
  );
};
 
export default NavVoiceControl;
 
 