// VoiceControl.jsx - SIMPLIFIED & RELIABLE VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVolumeUp, 
  FaRobot,
  FaKeyboard,
  FaTimes,
  FaChevronDown,
  FaInfoCircle
} from 'react-icons/fa';
import '../VoiceControl/VoiceControl.css';

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(true); // Set to true by default
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // 🎤 Initialize Speech Recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice recognition not supported in this browser. Try Chrome or Edge.');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setFeedback('🎤 Listening... Speak now');
    };

    recognition.onresult = (event) => {
      const transcriptText = event.results[0][0].transcript;
      setTranscript(transcriptText);
      console.log('Voice command:', transcriptText);
      processCommand(transcriptText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch(event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('No microphone found. Please check your microphone.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        default:
          setError(`Error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => setFeedback(''), 2000);
    };

    return recognition;
  }, []);

  // 🎯 SIMPLIFIED: Process Voice Commands
  const processCommand = useCallback((command) => {
    const normalizedCommand = command.toLowerCase().trim();
    let response = '';
    
    console.log('Processing command:', normalizedCommand);

    // SIMPLE NAVIGATION COMMANDS
    if (normalizedCommand.includes('dashboard') || normalizedCommand.includes('home')) {
      navigate('/student/dashboard');
      response = 'Navigating to dashboard';
    }
    else if (normalizedCommand.includes('class 7')) {
      navigate('/learn');
      response = 'Opening Class 7';
    }
    else if (normalizedCommand.includes('class 8')) {
      navigate('/learn/class8');
      response = 'Opening Class 8';
    }
    else if (normalizedCommand.includes('class 9')) {
      navigate('/learn/class9');
      response = 'Opening Class 9';
    }
    else if (normalizedCommand.includes('class 10')) {
      navigate('/learn/class10');
      response = 'Opening Class 10';
    }
    else if (normalizedCommand.includes('classroom') || normalizedCommand.includes('learn')) {
      navigate('/learn');
      response = 'Opening classroom';
    }
    else if (normalizedCommand.includes('mock test') || normalizedCommand.includes('mocktest')) {
      navigate('/mock-test');
      response = 'Opening mock test';
    }
    else if (normalizedCommand.includes('quick practice')) {
      navigate('/quick-practice');
      response = 'Opening quick practice';
    }
    else if (normalizedCommand.includes('practice')) {
      navigate('/practice');
      response = 'Opening practice section';
    }
    else if (normalizedCommand.includes('career')) {
      navigate('/career');
      response = 'Opening career';
    }
    else if (normalizedCommand.includes('study room')) {
      navigate('/study-room');
      response = 'Opening study room';
    }
    else if (normalizedCommand.includes('profile') || normalizedCommand.includes('user details')) {
      navigate('/user-details');
      response = 'Opening profile';
    }
    else if (normalizedCommand.includes('spin wheel')) {
      navigate('/spin-wheel');
      response = 'Opening spin wheel';
    }
    else if (normalizedCommand.includes('typing')) {
      navigate('/typing-master');
      response = 'Opening typing master';
    }
    else if (normalizedCommand.includes('daily summary')) {
      navigate('/daily-summary');
      response = 'Opening daily summary';
    }
    else if (normalizedCommand.includes('leadership') || normalizedCommand.includes('leaderboard')) {
      navigate('/leadership');
      response = 'Opening leadership board';
    }
    else if (normalizedCommand.includes('badges')) {
      navigate('/quizbadges');
      response = 'Opening badges';
    }
    
    // SIMPLE ACTION COMMANDS
    else if (normalizedCommand.includes('calendar') || normalizedCommand.includes('schedule')) {
      response = 'Opening calendar';
      // Trigger calendar manually since DOM selectors might fail
      setTimeout(() => {
        const event = new MouseEvent('mouseenter', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        const calendarWrapper = document.querySelector('.icon-wrapper');
        if (calendarWrapper) calendarWrapper.dispatchEvent(event);
      }, 100);
    }
    else if (normalizedCommand.includes('notification') || normalizedCommand.includes('alert')) {
      response = 'Opening notifications';
      setTimeout(() => {
        const event = new MouseEvent('mouseenter', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        const notificationWrapper = document.querySelectorAll('.icon-wrapper')[1];
        if (notificationWrapper) notificationWrapper.dispatchEvent(event);
      }, 100);
    }
    else if (normalizedCommand.includes('streak') || normalizedCommand.includes('fire')) {
      response = 'Showing streak';
      setTimeout(() => {
        const streakBtn = document.querySelector('.streak-button');
        if (streakBtn) streakBtn.click();
      }, 100);
    }
    else if (normalizedCommand.includes('language') || normalizedCommand.includes('change language')) {
      response = 'Opening language selector';
      setTimeout(() => {
        const event = new MouseEvent('mouseenter', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        const langWrapper = document.querySelector('.language-wrapper');
        if (langWrapper) langWrapper.dispatchEvent(event);
      }, 100);
    }
    
    // SIMPLE LOGOUT - NO COMPLEX SELECTORS
    else if (normalizedCommand.includes('logout') || normalizedCommand.includes('sign out')) {
      response = 'Logging out...';
      // Simple logout by triggering your navbar's logout function
      setTimeout(() => {
        // Try to find logout button
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
          if (btn.textContent && btn.textContent.toLowerCase().includes('logout')) {
            btn.click();
          }
        });
      }, 500);
    }
    
    // QUERY COMMANDS
    else if (normalizedCommand.includes('how many points') || normalizedCommand.includes('reward points')) {
      const points = localStorage.getItem('rewardPoints') || '0';
      response = `You have ${parseInt(points).toLocaleString()} reward points`;
    }
    else if (normalizedCommand.includes('what is my streak') || normalizedCommand.includes('current streak')) {
      const streak = localStorage.getItem('learningStreak');
      const streakData = streak ? JSON.parse(streak).streak : 0;
      response = `Your current streak is ${streakData} days`;
    }
    
    // VOICE CONTROL COMMANDS
    else if (normalizedCommand.includes('help') || normalizedCommand.includes('commands')) {
      setShowCommands(true);
      response = 'Showing available commands';
    }
    else if (normalizedCommand.includes('stop') || normalizedCommand.includes('close voice')) {
      setIsActive(false);
      response = 'Voice control deactivated';
    }
    else if (normalizedCommand.includes('start voice') || normalizedCommand.includes('activate voice')) {
      setIsActive(true);
      response = 'Voice control activated';
    }
    
    // GREETINGS
    else if (normalizedCommand.includes('hello') || normalizedCommand.includes('hi')) {
      response = 'Hello! How can I help you today?';
    }
    else if (normalizedCommand.includes('thank you') || normalizedCommand.includes('thanks')) {
      response = "You're welcome!";
    }
    
    // FALLBACK
    else {
      response = "I didn't understand that. Say 'help' to see available commands.";
    }

    // Show feedback
    setFeedback(response);
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback('');
    }, 3000);

  }, [navigate]);

  // 🎤 Start/Stop Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setFeedback('Stopped listening');
    } else {
      setTranscript('');
      setError('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Failed to start voice recognition. Please refresh and try again.');
      }
    }
  };

  // 🎯 Handle Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Space to toggle voice control
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsActive(prev => !prev);
      }
      
      // Escape to close commands list
      if (e.code === 'Escape') {
        setShowCommands(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🎤 Initialize on mount
  useEffect(() => {
    if (isActive) {
      recognitionRef.current = initializeSpeechRecognition();
    }
  }, [isActive, initializeSpeechRecognition]);

  // 🎯 Available Commands List
  const commandsList = [
    {
      category: 'Navigation',
      commands: [
        'Go to dashboard',
        'Open classroom',
        'Open class 7',
        'Open class 8', 
        'Open class 9',
        'Open class 10',
        'Open practice',
        'Open mock test',
        'Open quick practice',
        'Open career',
        'Open study room'
      ]
    },
    {
      category: 'Quick Actions',
      commands: [
        'Open calendar',
        'Open notifications',
        'Show streak',
        'Change language',
        'Logout'
      ]
    },
    {
      category: 'Queries',
      commands: [
        'How many reward points?',
        'What is my streak?'
      ]
    }
  ];

  // 🎤 Manual Command Input
  const handleManualCommand = (e) => {
    if (e.key === 'Enter' && transcript.trim()) {
      processCommand(transcript);
      setTranscript('');
    }
  };

  if (!isActive) {
    return (
      <button
        className="voice-activation-btn"
        onClick={() => setIsActive(true)}
        title="Activate Voice Control (Ctrl+Space)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
      >
        <FaMicrophone size={14} />
        <span></span>
      </button>
    );
  }

  return (
    <div className="voice-control-container">
      {/* Main Voice Control Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'white',
        padding: '8px 12px',
        borderRadius: '50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #667eea'
      }}>
        <button
          onClick={toggleListening}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? '#ef4444' : '#667eea',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
        </button>
        
        {/* Status Indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', color: '#667eea', minWidth: '70px' }}>
            {isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>

        {/* Commands Button */}
        <button
          onClick={() => setShowCommands(!showCommands)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Show commands"
        >
          <FaChevronDown size={12} style={{ transform: showCommands ? 'rotate(180deg)' : 'none' }} />
        </button>

        {/* Deactivate Button */}
        <button
          onClick={() => setIsActive(false)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Deactivate voice control"
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* Feedback Panel */}
      {feedback && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '8px',
          padding: '10px 15px',
          background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#374151',
          zIndex: '1000'
        }}>
          <FaVolumeUp size={14} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '8px',
          padding: '10px 15px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#dc2626',
          zIndex: '1000'
        }}>
          <span style={{ fontWeight: '500' }}>{error}</span>
        </div>
      )}

      {/* Commands List */}
      {showCommands && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '8px',
          width: '350px',
          maxWidth: '90vw',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: '1001',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <FaRobot size={16} />
            <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', flex: '1' }}>
              Voice Commands
            </h3>
            <button 
              onClick={() => setShowCommands(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FaTimes size={12} />
            </button>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '15px' }}>
            {commandsList.map((category, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  paddingBottom: '5px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  {category.category}
                </h4>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  {category.commands.map((cmd, cmdIndex) => (
                    <li key={cmdIndex} style={{
                      padding: '8px 12px',
                      marginBottom: '5px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#4b5563',
                      borderLeft: '3px solid #667eea'
                    }}>
                      {cmd}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 15px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>
              <FaKeyboard size={12} />
              <span>Press <kbd style={{
                background: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#374151'
              }}>Ctrl</kbd> + <kbd style={{
                background: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#374151'
              }}>Space</kbd> to toggle voice control</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#6b7280' }}>
              <FaInfoCircle size={12} />
              <span>Say "Help" to see this list anytime</span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Command Input */}
      <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', marginTop: '8px' }}>
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={handleManualCommand}
          placeholder="Type command and press Enter..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default VoiceControl;