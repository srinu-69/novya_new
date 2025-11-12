// MAIN FUNCTIONALITIES:

// 1. CHATBOG UI MANAGEMENT
// - Toggle chatbox open/close state
// - Manage message display with smooth scrolling
// - Handle typing indicators for bot responses

// 2. MESSAGE HANDLING SYSTEM
// - Send and receive text messages with timestamps
// - Store conversation history in state
// - Auto-scroll to latest message

// 3. KNOWLEDGE BASE & RESPONSE SYSTEM
// - Pre-defined patterns and responses for common queries
// - Intent recognition for user questions
// - Dynamic response generation based on query type

// 4. QUICK QUESTION FEATURE
// - Pre-populated common questions for quick access
// - One-click question submission
// - Covers frequent support topics

// 5. NATURAL LANGUAGE PROCESSING (BASIC)
// - Pattern matching for greeting, courses, pricing, etc.
// - Intent detection (question, support, course_info, pricing, career, duration)
// - Context-aware response generation

// 6. ENHANCED USER EXPERIENCE
// - Realistic typing simulation with random delays
// - Welcome messages on chat open
// - Online status indicator
// - Error handling for failed responses

// 7. SUPPORT TOPICS COVERED:
// - Course information and curriculum
// - Pricing and payment plans
// - Technical support and account issues
// - Career services and job placement
// - Course duration and schedules
// - General FAQs

// DATA FLOW:
// User Input → Intent Recognition → Pattern Matching → Response Generation → Display Message





import { useState, useEffect, useRef } from 'react';
import './Chatbox.css';


const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Enhanced knowledge base with more natural responses
  const knowledgeBase = {
    greeting: {
      patterns: ['hello', 'hi', 'hey'],
      responses: [
        "Hello there! How can I assist you with your coding journey today?",
        "Hi! What would you like to know about our courses?",
        "Hey coder! Ready to learn something new today?"
      ]
    },
    courses: {
      patterns: ['courses', 'offer', 'what do you teach'],
      responses: [
        "We offer courses in: Web Development (HTML, CSS, JS), React, Node.js, Python, and Data Science. Which one interests you?",
        "Our curriculum includes frontend, backend, and full-stack development courses. Any specific area you're curious about?"
      ]
    },
    bootcamp: {
      patterns: ['bootcamp', 'intensive', 'immersive'],
      responses: [
        "Our bootcamps are intensive 12-week programs with hands-on projects. We have full-time and part-time options available.",
        "The bootcamp includes daily coding challenges, weekly projects, and career support. Would you like details on the schedule?"
      ]
    },
    pricing: {
      patterns: ['price', 'cost', 'fee', 'how much'],
      responses: [
        "We have flexible options: $20/month for basic access or $199/year for all courses. Bootcamps start at $2,500 with financing available.",
        "Pricing depends on the program. Individual courses start at $49, while our comprehensive bootcamp is $2,500. Need help choosing?"
      ]
    },
    contact: {
      patterns: ['contact', 'email', 'support', 'help'],
      responses: [
        "You can email us at info@novya.in or call 8886042228 from 9am-5pm EST.",
        "For immediate help, try our live support at info@novya.in or use the chat button on our website."
      ]
    },
    thanks: {
      patterns: ['thank', 'thanks', 'appreciate'],
      responses: [
        "You're very welcome! Happy coding!",
        "Glad I could help! Let me know if you have any other questions.",
        "No problem at all! Come back anytime you need help."
      ]
    },
    default: {
      responses: [
        "I'm still learning. Could you rephrase that or ask about our courses, pricing, or support?",
        "That's an interesting question! For detailed answers, please visit our FAQ section or contact support.",
        "I understand you're asking about: {input}. Let me connect you with more specific resources..."
      ]
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const welcomeResponses = [
        "Hello! I'm your coding course assistant. What would you like to learn today?",
        "Hi there! I can help with course info, pricing, or technical support. What's on your mind?",
        "Welcome to Coding Academy! How can I assist you with your learning journey today?"
      ];
      const randomWelcome = welcomeResponses[Math.floor(Math.random() * welcomeResponses.length)];
      
      setMessages([{ 
        text: randomWelcome, 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [isOpen, messages.length]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    handleSubmit({ preventDefault: () => {} }, question);
  };

  const handleSubmit = async (e, quickQuestion) => {
    e.preventDefault();
    const question = quickQuestion || inputValue;
    if (question.trim() === '') return;
    
    // Add user message with timestamp
    const userMessage = { 
      text: question, 
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Simulate typing delay (more realistic timing)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const botResponse = await getEnhancedBotResponse(question);
      
      // Add bot response with timestamp
      setMessages(prev => [...prev, { 
        text: botResponse, 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting. Please try again later or contact info@novya.in", 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getEnhancedBotResponse = async (userInput) => {
    const inputLower = userInput.toLowerCase();
    
    // Check for exact matches first
    for (const [data] of Object.entries(knowledgeBase)) {
      if (data.patterns.some(pattern => inputLower.includes(pattern))) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // If no exact match, try to understand the intent
    const intent = understandUserIntent(userInput);
    return generateResponseBasedOnIntent(intent, userInput);
  };

  const understandUserIntent = (input) => {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('how') || inputLower.includes('where') || inputLower.includes('when')) {
      return 'question';
    }
    if (inputLower.includes('problem') || inputLower.includes('issue') || inputLower.includes('error')) {
      return 'support';
    }
    if (inputLower.includes('course') || inputLower.includes('learn') || inputLower.includes('study')) {
      return 'course_info';
    }
    if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('fee')) {
      return 'pricing';
    }
    if (inputLower.includes('job') || inputLower.includes('career') || inputLower.includes('hire')) {
      return 'career';
    }
    if (inputLower.includes('time') || inputLower.includes('duration') || inputLower.includes('long')) {
      return 'duration';
    }
    
    return 'general';
  };

  const generateResponseBasedOnIntent = (intent, originalInput) => {
    // Simulate thinking time
    const thinkTime = 500 + Math.random() * 1500;
    
    // Return a promise to simulate async API call
    return new Promise(resolve => {
      setTimeout(() => {
        switch(intent) {
          case 'course_info':
            resolve("Our courses include video lessons, coding exercises, and real-world projects. They're designed for all skill levels! Which technology are you most interested in?");
            break;
          case 'pricing':
            resolve("We offer several pricing options to fit different budgets. Monthly access is $20, annual is $199 (save 17%), and bootcamps start at $2,500 with payment plans available. Need help choosing?");
            break;
          case 'support':
            resolve("For technical issues, please email info@novya.in with:\n1. Your account email\n2. Course name\n3. Detailed description of the issue\nWe typically respond within 2 business hours.");
            break;
          case 'career':
            resolve("Our career services include resume reviews, interview prep, and job search strategies. 85% of bootcamp grads land tech jobs within 6 months! Want our career guide PDF?");
            break;
          case 'duration':
            resolve("Course durations vary:\n- Mini-courses: 2-4 weeks\n- Comprehensive courses: 8-12 weeks\n- Bootcamps: 12 weeks full-time or 24 weeks part-time\nWhat fits your schedule?");
            break;
          case 'question':
            resolve(`Regarding "${originalInput}", I recommend checking our FAQ at codingcourse.com/faq. If you don't find your answer there, our support team can help!`);
            break;
          default:
            const defaultResponses = knowledgeBase.default.responses;
            const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            resolve(randomResponse.replace('{input}', originalInput));
        }
      }, thinkTime);
    });
  };

  // More natural quick questions
  const commonQuestions = [
    "What's the best course for beginners?",
    "Do you offer payment plans?",
    "How do I reset my password?",
    "What's included in the bootcamp?",
    "Can I get a course preview?",
    "Do you offer certificates?"
  ];

  return (
    <div className="chatbox-container">
      {isOpen && (
        <div className="chatbox-popup">
          <div className="chatbox-header">
            <div className="header-content">
              <h3>Course Assistant</h3>
              <div className="status">
                <span className="status-indicator"></span>
                <span>Online</span>
              </div>
            </div>
            <button onClick={toggleChatbox} className="close-btn">×</button>
          </div>
          <div className="chatbox-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <div className="message-time">{message.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="quick-questions">
            <p>Quick questions:</p>
            <div className="quick-questions-grid">
              {commonQuestions.map((question, index) => (
                <button 
                  key={index} 
                  onClick={() => handleQuickQuestion(question)}
                  className="quick-question-btn"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="chatbox-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              required
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20px" height="20px">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
      <button onClick={toggleChatbox} className="chatbox-icon">
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbox;