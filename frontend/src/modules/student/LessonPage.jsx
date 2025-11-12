import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  FileText, 
  MessageCircle, 
  X,
  AlertCircle,
  Play,
  Send,
  Bot,
  User,
  Calendar,
  StickyNote,
  Plus,
  Trash2,
  MoreHorizontal,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { API_CONFIG, fastAPI, djangoAPI } from '../../config/api';

const LessonPage = () => {
  const { class: classNumber, subject, chapterNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ensure we have valid values for class, subject, and chapter
  const safeClassNumber = classNumber || 'Unknown';
  const safeSubject = subject || 'Unknown';
  const safeChapterNumber = chapterNumber || 'Unknown';
  const videoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [remainingChances, setRemainingChances] = useState(3);
  
  // AI Assistant States
  const [chatMessages, setChatMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Sticky Notes States
  const [stickyNotes, setStickyNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showNotesList, setShowNotesList] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistory, setShowHistory] = useState(false);

  // Centralized state for the checklist
  const [checklistStatus, setChecklistStatus] = useState({
    videoWatched: false,
    practiceAttempted: false,
    quizPassed: false
  });

  const queryParams = new URLSearchParams(location.search);
  const chapterTitle = queryParams.get('chapterTitle') || `Chapter ${safeChapterNumber}`;
  const subtopicName = queryParams.get('subtopic');

  const getChapterKey = () => `quiz_chances_${safeClassNumber}_${safeSubject}_${safeChapterNumber}`;
  const getChapterDateKey = () => `quiz_date_${safeClassNumber}_${safeSubject}_${safeChapterNumber}`;
  const getNotesKey = () => `sticky_notes_${safeClassNumber}_${safeSubject}_${safeChapterNumber}`;
  const getHistoryKey = () => `chat_history_${safeClassNumber}_${safeSubject}_${safeChapterNumber}`;

  useEffect(() => {
    const today = new Date().toDateString();
    const chapterKey = getChapterKey();
    const chapterDateKey = getChapterDateKey();
    
    const storedDate = sessionStorage.getItem(chapterDateKey);
    const storedChances = sessionStorage.getItem(chapterKey);
    
    if (storedDate === today) {
      setRemainingChances(parseInt(storedChances) || 3);
    } else {
      setRemainingChances(3);
      sessionStorage.setItem(chapterKey, '3');
      sessionStorage.setItem(chapterDateKey, today);
    }

    // Generate session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);

    // Load notes from database
    const loadNotesFromDatabase = async () => {
      try {
        setNotesLoading(true);
        const response = await djangoAPI.get(
          `${API_CONFIG.DJANGO.AI_ASSISTANT.GET_MANUAL_NOTES}?class_name=Class ${safeClassNumber}&subject=${safeSubject}&chapter=${safeChapterNumber}`
        );
        
        if (response.manual_notes && response.manual_notes.length > 0) {
          const formattedNotes = response.manual_notes.map(note => ({
            id: note.note_id,
            content: note.note_content,
            color: note.color || '#fef3c7',
            timestamp: new Date(note.created_at).toLocaleString(),
            dbId: note.note_id // Keep track of database ID
          }));
          setStickyNotes(formattedNotes);
          setActiveNoteId(formattedNotes[0].id);
        } else {
          // No notes in database, create initial note
          const initialNote = { id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() };
          setStickyNotes([initialNote]);
          setActiveNoteId(initialNote.id);
        }
        setNotesLoading(false);
      } catch (error) {
        console.error('Failed to load notes from database:', error);
        // Fallback to sessionStorage
        const savedNotes = sessionStorage.getItem(getNotesKey());
        if (savedNotes) {
          const parsed = JSON.parse(savedNotes);
          setStickyNotes(parsed.length > 0 ? parsed : [{ id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() }]);
          if (parsed.length > 0) {
            setActiveNoteId(parsed[0].id);
          }
        } else {
          const initialNote = { id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() };
          setStickyNotes([initialNote]);
          setActiveNoteId(initialNote.id);
        }
        setNotesLoading(false);
      }
    };

    // Load chat history from database
    const loadChatHistory = async () => {
      try {
        const response = await djangoAPI.get(
          `${API_CONFIG.DJANGO.AI_ASSISTANT.GET_CHAT_HISTORY}?class_name=Class ${safeClassNumber}&subject=${safeSubject}&chapter=${encodeURIComponent(chapterTitle)}`
        );
        
        if (response.chat_history && response.chat_history.length > 0) {
          const formatted = response.chat_history.map(chat => ({
            id: chat.chat_id,
            userMessage: chat.user_message,
            aiResponse: chat.ai_response,
            timestamp: new Date(chat.message_timestamp).toLocaleString()
          }));
          setChatHistory(formatted);
        }
      } catch (error) {
        console.error('Failed to load chat history from database:', error);
        // Fallback to sessionStorage
        const savedHistory = sessionStorage.getItem(getHistoryKey());
        if (savedHistory) {
          setChatHistory(JSON.parse(savedHistory));
        }
      }
    };

    loadNotesFromDatabase();
    loadChatHistory();
  }, [safeClassNumber, safeSubject, safeChapterNumber]);

  useEffect(() => {
    if (isVideoCompleted) {
      setChecklistStatus(prev => ({ ...prev, videoWatched: true }));
    }
  }, [isVideoCompleted]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  const currentLesson = {
    title: chapterTitle,
    subtopic: subtopicName,
    file: `/videos/${safeSubject}/chapter-${safeChapterNumber}.mp4`,
    pdf: `/pdfs/${safeSubject}/chapter-${safeChapterNumber}.pdf`,
    about: `Learn about ${safeSubject} concepts in ${chapterTitle}${subtopicName ? ` - ${subtopicName}` : ''}. This ${subtopicName ? 'subtopic' : 'chapter'} covers important topics that will help you build a strong foundation.`
  };

  const checklistItems = [
    { id: 1, task: `Watch full video of ${currentLesson.title}`, status: checklistStatus.videoWatched ? "completed" : "in-progress" },
    { id: 2, task: "Attempt practice quiz", status: checklistStatus.practiceAttempted ? "completed" : "pending" },
  ];

  const practiceQuestions = [
    { id: 1, question: `Practice questions for ${currentLesson.title}` },
  ];

  const handleVideoEnd = () => {
    setIsVideoCompleted(true);
  };

  const handleStartQuiz = () => {
    if (remainingChances > 0) {
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setQuizScore(0);
      setQuizCompleted(false);
    }
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === 0) {
      setQuizScore(prevScore => prevScore + 1);
    }
    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      const newChances = remainingChances - 1;
      setRemainingChances(newChances);
      
      const chapterKey = getChapterKey();
      sessionStorage.setItem(chapterKey, newChances.toString());
      
      const isPassed = quizScore >= 2;
      setChecklistStatus(prev => ({
        ...prev,
        practiceAttempted: true,
        quizPassed: isPassed
      }));
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  const handleRetryQuiz = () => {
    if (remainingChances > 0) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setQuizScore(0);
      setQuizCompleted(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const currentInput = userInput.trim();
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT, {
        class_level: `Class ${safeClassNumber}`,
        subject: safeSubject,
          chapter: currentLesson.title,
        student_question: currentInput,
          chat_history: chatMessages
      });

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          messageType: data.type,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Save to history (for display)
        const historyEntry = {
          id: Date.now(),
          userMessage: currentInput,
          aiResponse: data.response,
          timestamp: new Date().toLocaleString()
        };
        const updatedHistory = [historyEntry, ...chatHistory];
        setChatHistory(updatedHistory);
        sessionStorage.setItem(getHistoryKey(), JSON.stringify(updatedHistory));
        
        // Save to database
        try {
          await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_CHAT_MESSAGE, {
            class_name: `Class ${safeClassNumber}`,
            subject: safeSubject,
            chapter: currentLesson.title,
            subtopic: subtopicName || '',
            user_message: currentInput,
            ai_response: data.response,
            response_type: data.type || 'general',
            session_id: sessionId
          });
          console.log('✅ Chat message saved to database');
          
          // Save study plan if detected
          if (data.type === 'study_plan' || currentInput.toLowerCase().includes('study plan')) {
            await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_STUDY_PLAN, {
              class_name: `Class ${safeClassNumber}`,
              subject: safeSubject,
              chapter: currentLesson.title,
              subtopic: subtopicName || '',
              plan_title: `Study Plan for ${currentLesson.title}`,
              plan_content: data.response,
              plan_type: 'study_plan',
              difficulty_level: 'medium',
              estimated_duration_hours: 2
            });
            console.log('✅ Study plan saved to database');
          }
          
          // Save AI notes if detected
          if (data.type === 'notes' || currentInput.toLowerCase().includes('note')) {
            await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_AI_NOTE, {
              class_name: `Class ${safeClassNumber}`,
              subject: safeSubject,
              chapter: currentLesson.title,
              subtopic: subtopicName || '',
              note_title: `Notes for ${currentLesson.title}`,
              note_content: data.response,
              note_type: 'ai_generated'
            });
            console.log('✅ AI notes saved to database');
          }
        } catch (dbError) {
          console.error('❌ Failed to save to database:', dbError);
          // Continue anyway - data is in sessionStorage
        }
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        messageType: 'error',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionType) => {
    const topicText = subtopicName ? ` - ${subtopicName}` : '';
    const messages = {
      study_plan: `Can you create a study plan with topics for ${currentLesson.title}${topicText} in ${safeSubject}?`,
      notes: `Please provide comprehensive notes on ${currentLesson.title}${topicText} in ${safeSubject}`,
    };

    const message = messages[actionType];
    setUserInput(message);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const clearChat = () => {
    setChatMessages([]);
    setShowQuickActions(true);
  };

  const copyToClipboard = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      content: '',
      color: getRandomColor(),
      timestamp: new Date().toLocaleString()
    };
    setStickyNotes(prev => [...prev, newNote]);
    setActiveNoteId(newNote.id);
    setShowNotesList(false);
  };

  const deleteNote = async (id) => {
    const noteToDelete = stickyNotes.find(note => note.id === id);
    
    if (stickyNotes.length === 1) {
      const newNote = { id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() };
      setStickyNotes([newNote]);
      setActiveNoteId(newNote.id);
      sessionStorage.setItem(getNotesKey(), JSON.stringify([newNote]));
    } else {
      const updatedNotes = stickyNotes.filter(note => note.id !== id);
      setStickyNotes(updatedNotes);
      if (activeNoteId === id) {
        setActiveNoteId(updatedNotes[0].id);
      }
      sessionStorage.setItem(getNotesKey(), JSON.stringify(updatedNotes));
    }
    
    // Delete from database if it has a database ID
    if (noteToDelete?.dbId) {
      try {
        await djangoAPI.delete(API_CONFIG.DJANGO.AI_ASSISTANT.DELETE_MANUAL_NOTE(noteToDelete.dbId));
        console.log('✅ Note deleted from database');
      } catch (error) {
        console.error('❌ Failed to delete note from database:', error);
      }
    }
  };

  const updateNoteContent = (id, content) => {
    setStickyNotes(prev => prev.map(note =>
      note.id === id ? { ...note, content, timestamp: new Date().toLocaleString() } : note
    ));
  };

  const saveNote = async () => {
    if (!activeNote) return;
    
    // Save to sessionStorage (keep as fallback)
    sessionStorage.setItem(getNotesKey(), JSON.stringify(stickyNotes));
    
    // Save to database
    try {
      if (activeNote.dbId) {
        // Update existing note
        await djangoAPI.put(API_CONFIG.DJANGO.AI_ASSISTANT.UPDATE_MANUAL_NOTE(activeNote.dbId), {
          note_content: activeNote.content,
          color: activeNote.color,
        });
        console.log('✅ Note updated in database');
      } else {
        // Create new note
        const response = await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_MANUAL_NOTE, {
          class_name: `Class ${safeClassNumber}`,
          subject: safeSubject,
          chapter: safeChapterNumber,
          subtopic: subtopicName || '',
          note_content: activeNote.content,
          color: activeNote.color,
          note_type: 'sticky_note'
        });
        
        // Update local state with database ID
        setStickyNotes(prev => prev.map(note =>
          note.id === activeNote.id ? { ...note, dbId: response.note.note_id } : note
        ));
        console.log('✅ Note saved to database');
      }
      
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (error) {
      console.error('❌ Failed to save note to database:', error);
      // Show message anyway - data is in sessionStorage
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    }
  };

  const selectNote = (id) => {
    setActiveNoteId(id);
    setShowNotesList(false);
  };

  const getRandomColor = () => {
    const colors = ['#fef3c7', '#fecaca', '#ddd6fe', '#bfdbfe', '#a7f3d0', '#fecdd3', '#fed7aa'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatResponse = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h4 key={index} className="ai-response-heading">{line.replace('# ', '')}</h4>;
      } else if (line.startsWith('## ')) {
        return <h5 key={index} className="ai-response-subheading">{line.replace('## ', '')}</h5>;
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        return <div key={index} className="ai-response-list-item">• {line.replace(/^[-•]\s*/, '')}</div>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <div key={index} className="ai-response-text">{line}</div>;
      }
    });
  };

  const demoQuestions = [
    {
      question: `What is the main topic covered in ${currentLesson.title}?`,
      options: ["Basic Concepts", "Advanced Applications", "Historical Context", "All of the above"],
      correctAnswer: 3
    },
    {
      question: "Which of the following best describes the learning objectives?",
      options: ["Memorization", "Conceptual Understanding", "Practical Application", "Both B and C"],
      correctAnswer: 3
    },
    {
      question: "What should you focus on while studying this chapter?",
      options: ["Key Definitions", "Problem Solving", "Real-world Applications", "All of the above"],
      correctAnswer: 3
    }
  ];

  const activeNote = stickyNotes.find(note => note.id === activeNoteId);

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
         
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          .ai-response-heading {
            color: #0f766e;
            margin: 8px 0;
            font-size: 15px;
            font-weight: 600;
          }

          .ai-response-subheading {
            color: #0f766e;
            margin: 6px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .ai-response-list-item {
            margin: 4px 0;
            padding-left: 16px;
          }

          .ai-response-text {
            margin: 4px 0;
            line-height: 1.5;
          }

          video::-webkit-media-controls-download-button {
            display: none;
          }
          video {
            controlsList: "nodownload";
          }
        `}
      </style>
      
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header - Fixed with proper spacing */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '110px 32px 20px 32px',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center',
          marginTop: '0'
        }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            {safeSubject} • {currentLesson.title}
            </h1>
            {currentLesson.subtopic && (
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>
                Topic: {currentLesson.subtopic}
              </div>
            )}
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          {/* Video Section - Made more compact */}
          <div style={{
            marginBottom: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Play size={18} />
                {currentLesson.subtopic ? `Video: ${currentLesson.subtopic}` : `Video: ${currentLesson.title}`}
              </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '0',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}>
              <video
                ref={videoRef}
                src={currentLesson.file}
                controls
                controlsList="nodownload"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onEnded={handleVideoEnd}
              />
            </div>
            </div>

          {/* Tab Navigation */}
            <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0',
            border: '1px solid #e5e7eb',
            borderBottom: 'none',
            display: 'flex',
            gap: '0',
            overflowX: 'auto'
          }}>
            {[
              { id: 'overview', label: 'Overview', icon: null },
              { id: 'checklist', label: 'Lesson Checklist', icon: FileText },
              { id: 'practice', label: 'Quick Practice', icon: Play },
              { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
              { id: 'notes', label: `Notes (${stickyNotes.length})`, icon: StickyNote }
            ].map((tab) => (
                  <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                    style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab.id ? '#0f766e' : '#6b7280',
                  padding: '14px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  borderBottom: activeTab === tab.id ? '3px solid #0f766e' : '3px solid transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {tab.icon && <tab.icon size={16} />}
                {tab.label}
                  </button>
            ))}
                    </div>

          {/* Tab Content */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
            borderRadius: '0 0 12px 12px',
            padding: '20px',
            minHeight: '400px'
          }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                  📘 About {currentLesson.subtopic ? 'this Topic' : 'this Chapter'}
                </h3>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                  {currentLesson.about}
                </p>
              </div>
            )}

            {/* Checklist Tab */}
            {activeTab === 'checklist' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18}/> Lesson Checklist
                </h3>
                {checklistItems.map((item) => (
                  <div key={item.id} style={{ 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f3f4f6', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>{item.task}</span>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      background: item.status === "completed" ? "#10b981" : 
                                 item.status === "in-progress" ? "#ec4899" : "#e5e7eb",
                      color: item.status === "completed" || item.status === "in-progress" ? "white" : "#6b7280" 
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Practice Tab */}
            {activeTab === 'practice' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Quick Practice
                </h3>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} color="#f59e0b" />
                  <span style={{ fontSize: '14px', color: '#f59e0b' }}>
                    {remainingChances} {remainingChances === 1 ? 'chance' : 'chances'} remaining for this chapter
                  </span>
                </div>
                {practiceQuestions.map((q) => (
                  <div key={q.id} style={{ 
                    padding: '14px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: '#fafafa'
                  }}>
                    <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>{q.question}</span>
                    <button 
                      onClick={handleStartQuiz}
                      disabled={remainingChances <= 0}
                      style={{ 
                        backgroundColor: remainingChances > 0 ? "#0f766e" : "#9ca3af", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px",
                        padding: "8px 16px",
                        cursor: remainingChances > 0 ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Play size={14} />
                      {remainingChances > 0 ? "Start Quiz" : "No chances"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI Assistant Tab */}
            {activeTab === 'ai-assistant' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                {showHistory && (
            <div style={{ 
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    width: '90%',
                    maxWidth: '500px',
                    maxHeight: '500px',
                    overflow: 'hidden',
                    zIndex: 1001
                  }}>
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid #e5e7eb',
                fontWeight: '600', 
                color: '#1f2937', 
                display: 'flex', 
                alignItems: 'center', 
                      justifyContent: 'space-between'
                    }}>
                      <span>Search History ({chatHistory.length})</span>
                      <button
                        onClick={() => setShowHistory(false)}
                  style={{
                          background: 'none',
                          border: 'none',
                    cursor: 'pointer',
                          padding: '4px',
                          display: 'flex'
                        }}
                      >
                        <X size={16} />
                      </button>
                      </div>
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                      {chatHistory.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                          No search history yet
                    </div>
                      ) : (
                        chatHistory.map((item) => (
                          <div key={item.id} style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f3f4f6',
                            cursor: 'pointer'
                          }}>
                            <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500', marginBottom: '6px' }}>
                              Q: {item.userMessage}
                </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              A: {item.aiResponse.substring(0, 100)}...
            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.timestamp}</div>
                          </div>
                        ))
                  )}
                </div>
              </div>
                )}

              <div 
                ref={chatContainerRef}
                  style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#fafbfc', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                      <Bot size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                      Hello! I'm your AI Learning Assistant
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                        Ask me anything about this lesson, request study plans and notes.
                      </p>
                      <button
                        onClick={() => setShowHistory(true)}
                        style={{
                          marginTop: '16px',
                          padding: '8px 16px',
                          background: '#f0fdfa',
                          border: '1px solid #0f766e',
                          borderRadius: '6px',
                          color: '#0f766e',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        View History ({chatHistory.length})
                      </button>
                  </div>
                ) : (
                    <>
                      {chatMessages.map((message) => (
                    <div
                      key={message.id}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            backgroundColor: message.type === 'user' ? '#0f766e' : '#ec4899'
                          }}>
                            {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                          <div style={{
                            maxWidth: '85%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            lineHeight: '1.5',
                            fontSize: '14px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            backgroundColor: message.type === 'user' ? '#0f766e' : 'white',
                            color: message.type === 'user' ? 'white' : '#1e293b',
                            border: message.type === 'assistant' ? '1px solid #e2e8f0' : 'none',
                            borderBottomRightRadius: message.type === 'user' ? '6px' : '16px',
                            borderBottomLeftRadius: message.type === 'assistant' ? '6px' : '16px'
                          }}>
                        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                          {message.type === 'assistant' ? formatResponse(message.content) : message.content}
                        </div>
                            <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{message.timestamp}</span>
                              {message.type === 'assistant' && (
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: copiedMessageId === message.id ? '#10b981' : 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px',
                                    opacity: 0.7,
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  {copiedMessageId === message.id ? (
                                    <>
                                      <Check size={12} />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      Copy
                                    </>
                                  )}
                                </button>
                              )}
                        </div>
                      </div>
                    </div>
                      ))}
                    </>
                )}
                
                {isLoading && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: '#ec4899'
                      }}>
                        <Bot size={16} />
                    </div>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out' }}></div>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '-0.16s' }}></div>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '-0.32s' }}></div>
                        <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {showQuickActions && chatMessages.length === 0 && (
                  <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', backgroundColor: 'white', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>
                      Try asking:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => handleQuickAction('study_plan')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 12px',
                          backgroundColor: '#f8fafc',
                          color: '#0f766e',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontWeight: '500'
                        }}
                    >
                      <Calendar size={14} />
                      Study Plan
                    </button>
                    <button
                      onClick={() => handleQuickAction('notes')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 12px',
                          backgroundColor: '#f8fafc',
                          color: '#0f766e',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontWeight: '500'
                        }}
                    >
                      <FileText size={14} />
                      Get Notes
                    </button>
                  </div>
                </div>
              )}

                {chatMessages.length > 0 && (
                  <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #f1f5f9',
                    backgroundColor: '#fafbfc',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={() => setShowHistory(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontWeight: '500',
                        padding: '6px 12px'
                      }}
                    >
                      View History ({chatHistory.length})
                    </button>
                    <button
                      onClick={clearChat}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontWeight: '500',
                        padding: '6px 12px'
                      }}
                    >
                      Clear Chat
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about study plans, notes..."
                    style={{
                      flex: 1,
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      resize: 'none',
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      backgroundColor: '#fafafa',
                      transition: 'all 0.2s',
                      minHeight: '44px',
                      maxHeight: '100px',
                      outline: 'none'
                    }}
                    rows={1}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={isLoading || !userInput.trim()}
                    style={{
                      backgroundColor: (userInput.trim() && !isLoading) ? '#0f766e' : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      cursor: (userInput.trim() && !isLoading) ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      minHeight: '44px'
                    }}
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '400px', backgroundColor: activeNote?.color || '#fef3c7', borderRadius: '8px', position: 'relative' }}>
                {savedMessage && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(16, 185, 129, 0.95)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    animation: 'fadeIn 0.3s, fadeOut 0.3s 1.7s',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    ✓ Note saved successfully!
            </div>
                )}

                {showNotesList && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    width: '280px',
                    maxHeight: '350px',
                    overflow: 'auto',
                    zIndex: 100
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                      fontWeight: '600',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>All Notes ({stickyNotes.length})</span>
                      <button
                        onClick={() => setShowNotesList(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex'
                        }}
                      >
                        <X size={16} />
                      </button>
          </div>
                    {stickyNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => selectNote(note.id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          backgroundColor: note.id === activeNoteId ? '#f0fdfa' : 'transparent',
                          borderLeft: note.id === activeNoteId ? '3px solid #0f766e' : 'none'
                        }}
                      >
                        <div style={{
                          fontSize: '13px',
                          color: '#4b5563',
                          marginBottom: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {note.content.substring(0, 50) || 'Empty note'}
                          {note.content.length > 50 && '...'}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={10} />
                          {note.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <button
                    onClick={addNewNote}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      transition: 'background 0.2s'
                    }}
                    title="Add new note"
                  >
                    <Plus size={18} color="#1f2937" />
                  </button>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setShowNotesList(!showNotesList)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      title="View all notes"
                    >
                      <MoreHorizontal size={18} color="#1f2937" />
                    </button>
                    <button
                      onClick={() => activeNote && deleteNote(activeNote.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        color: '#6b7280'
                      }}
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
                  <textarea
                    ref={textareaRef}
                    value={activeNote?.content || ''}
                    onChange={(e) => activeNote && updateNoteContent(activeNote.id, e.target.value)}
                    placeholder="Take a note..."
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      resize: 'none',
                      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#1f2937'
                    }}
                  />
                </div>

                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={saveNote}
                    style={{
                      background: '#0f766e',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <button 
                onClick={handleCloseQuiz}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
              {!quizCompleted ? (
                <>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                    Question {currentQuestionIndex + 1} of {demoQuestions.length}
                  </h2>
                  <p style={{ fontSize: '16px', marginBottom: '20px', fontWeight: '500' }}>
                    {demoQuestions[currentQuestionIndex]?.question}
                  </p>
                  <div style={{ marginBottom: '20px' }}>
                    {demoQuestions[currentQuestionIndex]?.options.map((option, index) => (
                      <div 
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        style={{
                          padding: '12px 16px',
                          border: `2px solid ${selectedAnswer === index ? '#0f766e' : '#e5e7eb'}`,
                          borderRadius: '8px',
                          marginBottom: '10px',
                          cursor: 'pointer',
                          backgroundColor: selectedAnswer === index ? '#f0fdfa' : 'white',
                          transition: 'all 0.2s'
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: selectedAnswer !== null ? '#0f766e' : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {currentQuestionIndex === demoQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                    Quiz Completed!
                  </h2>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    backgroundColor: '#f0fdfa', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                      Your score: {quizScore} out of {demoQuestions.length}
                    </p>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>
                      {quizScore >= Math.ceil(demoQuestions.length * 0.8) 
                        ? 'Congratulations! You passed the quiz.' 
                        : 'Keep studying and try again.'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={handleCloseQuiz}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#e5e7eb',
                        color: '#4b5563',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                    {remainingChances > 0 && quizScore < Math.ceil(demoQuestions.length * 0.8) && (
                      <button 
                        onClick={handleRetryQuiz}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#0f766e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Try Again ({remainingChances} left)
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LessonPage;
