
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   CheckCircle,
//   FileText,
//   MessageCircle,
//   X,
//   AlertCircle,
//   Play,
//   Send,
//   Bot,
//   User,
//   Calendar,
//   StickyNote,
//   Plus,
//   Trash2,
//   MoreHorizontal,
//   Clock,
//   Copy,
//   Check,
//   Coins,
//   RefreshCw
// } from 'lucide-react';

// const LessonPage = () => {
//   const { class: classNumber, subject, chapterNumber } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const videoRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const textareaRef = useRef(null);
//   const [isVideoCompleted, setIsVideoCompleted] = useState(false);
//   const [showPdf, setShowPdf] = useState(false);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [quizScore, setQuizScore] = useState(0);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [remainingChances, setRemainingChances] = useState(3);
 
//   // AI Assistant States
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showQuickActions, setShowQuickActions] = useState(true);
//   const [copiedMessageId, setCopiedMessageId] = useState(null);

//   // Sticky Notes States
//   const [stickyNotes, setStickyNotes] = useState([]);
//   const [activeNoteId, setActiveNoteId] = useState(null);
//   const [showNotesList, setShowNotesList] = useState(false);
//   const [savedMessage, setSavedMessage] = useState(false);

//   // Active Tab State
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showHistory, setShowHistory] = useState(false);

//   // Overview States
//   const [overviewContent, setOverviewContent] = useState('');
//   const [isGeneratingOverview, setIsGeneratingOverview] = useState(false);
//   const [overviewLoaded, setOverviewLoaded] = useState(false);

//   // Centralized state for the checklist
//   const [checklistStatus, setChecklistStatus] = useState({
//     videoWatched: false,
//     practiceAttempted: false,
//     quizPassed: false
//   });

//   // Video reward states
//   const [skipped, setSkipped] = useState(false);
//   const [pointsAwarded, setPointsAwarded] = useState(false);
 
//   // Coin animation states
//   const [coins, setCoins] = useState([]);
//   const [toastShown, setToastShown] = useState(false);

//   const queryParams = new URLSearchParams(location.search);
//   const chapterTitle = queryParams.get('chapterTitle') || `Chapter ${chapterNumber}`;
//   const subtopicName = queryParams.get('subtopic');

//   const getChapterKey = () => `quiz_chances_${classNumber}_${subject}_${chapterNumber}`;
//   const getChapterDateKey = () => `quiz_date_${classNumber}_${subject}_${chapterNumber}`;
//   const getVideoKey = () => `video_reward_${classNumber}_${subject}_${chapterNumber}_${subtopicName || 'main'}`;
//   const getNotesKey = () => `sticky_notes_${classNumber}_${subject}_${chapterNumber}`;
//   const getHistoryKey = () => `chat_history_${classNumber}_${subject}_${chapterNumber}`;

//   // MARK: UPDATED - Study plan functions with enhanced notification system and proper date handling
//   const saveStudyPlanToCalendar = (studyPlanContent) => {
//     try {
//       // Generate a unique ID for this study plan based on content
//       const planId = `plan_${classNumber}_${subject}_${chapterNumber}_${subtopicName || 'main'}_${Date.now()}`;
     
//       // Use current date (when user requests the study plan) as start date
//       const startDate = new Date();
     
//       // Parse the study plan and create calendar events starting from current date
//       const studyPlan = {
//         id: planId,
//         title: `${subject} - ${chapterTitle}${subtopicName ? ` - ${subtopicName}` : ''}`,
//         content: studyPlanContent,
//         subject: subject,
//         chapter: chapterTitle,
//         subtopic: subtopicName,
//         class: classNumber,
//         createdDate: startDate.toISOString(),
//         // Create study sessions starting from the current date (when user requested)
//         studySessions: generateStudySessionsFromPlan(studyPlanContent, startDate),
//         completed: false
//       };

//       // Save to localStorage
//       const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
     
//       // Check for duplicates before adding
//       const isDuplicate = existingPlans.some(plan =>
//         plan.title === studyPlan.title &&
//         plan.subject === studyPlan.subject &&
//         plan.chapter === studyPlan.chapter
//       );

//       if (isDuplicate) {
//         console.log('Study plan already exists, skipping duplicate');
//         return true;
//       }

//       const updatedPlans = [...existingPlans, studyPlan];
//       localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));

//       // Create notification with enhanced event dispatch
//       createStudyPlanNotification(studyPlan);

//       // Dispatch events to update navbar and other components
//       window.dispatchEvent(new CustomEvent('studyPlanAdded', {
//         detail: { studyPlan }
//       }));
     
//       // Force refresh notifications in navbar
//       window.dispatchEvent(new CustomEvent('refreshNotifications'));

//       console.log('Study plan saved with start date:', startDate.toLocaleDateString(), studyPlan);
//       return true;
//     } catch (error) {
//       console.error('Error saving study plan:', error);
//       return false;
//     }
//   };

//   // MARK: UPDATED - Generate study sessions starting from the provided start date
//   const generateStudySessionsFromPlan = (content, startDate) => {
//     const sessions = [];
   
//     // Use the provided start date (when user requested the study plan)
//     const studyStartDate = new Date(startDate);
   
//     // Simple parsing - you can enhance this based on your AI response format
//     const lines = content.split('\n');
//     let dayOffset = 0;
   
//     for (const line of lines) {
//       if (line.includes('Day') || line.includes('day') || line.includes('Session') || line.includes('session')) {
//         const session = {
//           id: Date.now() + sessions.length,
//           date: new Date(studyStartDate.getTime() + dayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//           title: line.trim(),
//           duration: '60 minutes', // Default duration
//           completed: false,
//           topic: line.trim()
//         };
//         sessions.push(session);
//         dayOffset++;
//       }
//     }

//     // If no specific sessions found, create a default one starting from current date
//     if (sessions.length === 0) {
//       sessions.push({
//         id: Date.now(),
//         date: studyStartDate.toISOString().split('T')[0],
//         title: `Study ${chapterTitle}`,
//         duration: '60 minutes',
//         completed: false,
//         topic: `Review ${chapterTitle} concepts`
//       });
//     }

//     console.log('Generated study sessions starting from:', studyStartDate.toLocaleDateString(), sessions);
//     return sessions;
//   };

//   // MARK: UPDATED - Enhanced notification creation with immediate dispatch
//   const createStudyPlanNotification = (studyPlan) => {
//     const notificationId = `notif_${studyPlan.id}`;
   
//     // Check if notification already exists
//     const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
//     const isDuplicateNotification = existingNotifications.some(notif => notif.id === notificationId);
   
//     if (isDuplicateNotification) {
//       console.log('Notification already exists, skipping duplicate');
//       return;
//     }

//     const notification = {
//       id: notificationId,
//       type: 'study_plan_created',
//       title: 'New Study Plan Created',
//       message: `Study plan for ${studyPlan.title} has been added to your calendar starting from ${new Date(studyPlan.createdDate).toLocaleDateString()}`,
//       date: new Date().toISOString(),
//       read: false,
//       planId: studyPlan.id
//     };

//     const updatedNotifications = [notification, ...existingNotifications];
//     localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));

//     // Enhanced event dispatch for immediate navbar update
//     window.dispatchEvent(new CustomEvent('notificationAdded', {
//       detail: { notification }
//     }));
   
//     // Additional event to force refresh
//     window.dispatchEvent(new CustomEvent('refreshNotifications'));
   
//     console.log('Notification created and events dispatched:', notification);
//   };

//   // MARK: UPDATED - Enhanced AI message handler to detect study plans
//   const handleAIMessageResponse = (content, messageType) => {
//     // Check if this is a study plan response
//     if (messageType === 'study_plan' || content.toLowerCase().includes('study plan') ||
//         content.toLowerCase().includes('day') && content.toLowerCase().includes('study')) {
     
//       // Save the study plan to calendar
//       const saved = saveStudyPlanToCalendar(content);
//       if (saved) {
//         // Add a note that it was saved to calendar
//         const startDate = new Date().toLocaleDateString();
//         return `${content}\n\n---\n*📅 This study plan has been automatically added to your calendar starting from ${startDate}!*`;
//       }
//     }
//     return content;
//   };

//   // Show toast message using React Toastify
//   const showRewardToast = (message) => {
//     toast.success(message, {
//       position: "top-center",
//       autoClose: 4000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "colored",
//     });
//   };

//   useEffect(() => {
//     const today = new Date().toDateString();
//     const chapterKey = getChapterKey();
//     const chapterDateKey = getChapterDateKey();
//     const videoKey = getVideoKey();
   
//     const storedDate = sessionStorage.getItem(chapterDateKey);
//     const storedChances = sessionStorage.getItem(chapterKey);
   
//     if (storedDate === today) {
//       setRemainingChances(parseInt(storedChances) || 3);
//     } else {
//       setRemainingChances(3);
//       sessionStorage.setItem(chapterKey, '3');
//       sessionStorage.setItem(chapterDateKey, today);
//     }

//     // Check for video reward - now specific to subtopic
//     if (sessionStorage.getItem(videoKey)) {
//       setIsVideoCompleted(true);
//       setChecklistStatus(prev => ({ ...prev, videoWatched: true }));
//       setPointsAwarded(true);
//     }

//     const savedNotes = sessionStorage.getItem(getNotesKey());
//     if (savedNotes) {
//       const parsed = JSON.parse(savedNotes);
//       setStickyNotes(parsed.length > 0 ? parsed : [{ id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() }]);
//       if (parsed.length > 0) {
//         setActiveNoteId(parsed[0].id);
//       }
//     } else {
//       const initialNote = { id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() };
//       setStickyNotes([initialNote]);
//       setActiveNoteId(initialNote.id);
//     }

//     // Load chat history
//     const savedHistory = sessionStorage.getItem(getHistoryKey());
//     if (savedHistory) {
//       setChatHistory(JSON.parse(savedHistory));
//     }
//   }, [classNumber, subject, chapterNumber, subtopicName]);

//   // Monitor seeking on video
//   useEffect(() => {
//     const video = videoRef.current;
//     if (video) {
//       const handleSeeked = () => setSkipped(true);
//       video.addEventListener('seeked', handleSeeked);
//       return () => video.removeEventListener('seeked', handleSeeked);
//     }
//   }, []);

//   useEffect(() => {
//     if (isVideoCompleted) {
//       setChecklistStatus(prev => ({ ...prev, videoWatched: true }));
//     }
//   }, [isVideoCompleted]);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chatMessages, isLoading]);

//   // Overview generation effect
//   useEffect(() => {
//     if (activeTab === 'overview' && !overviewLoaded && !isGeneratingOverview) {
//       generateOverview();
//     }
//   }, [activeTab, overviewLoaded]);

//   // Coin animation effect
//   useEffect(() => {
//     const handleCoinAnimationEnd = (coinId) => {
//       setCoins(prev => prev.filter(coin => coin.id !== coinId));
//     };

//     coins.forEach(coin => {
//       if (coin.animationCompleted && !coin.pointsAdded) {
//         // Add points to localStorage
//         const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
//         const newPoints = currentPoints + coin.value;
//         localStorage.setItem('rewardPoints', newPoints.toString());
       
//         // Dispatch event to update navbar
//         window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
//           detail: { rewardPoints: newPoints }
//         }));
       
//         // Mark coin as processed
//         setCoins(prev => prev.map(c =>
//           c.id === coin.id ? { ...c, pointsAdded: true } : c
//         ));
       
//         // Show toast message only once when all coins are processed
//         const remainingCoins = coins.filter(c => !c.pointsAdded).length;
//         if (remainingCoins === 1 && !toastShown) {
//           setToastShown(true);
//           if (subtopicName) {
//             showRewardToast(`🎉 Congratulations! You earned 10 reward points for completing the subtopic: ${subtopicName}`);
//           } else {
//             showRewardToast(`🎉 Congratulations! You earned 10 reward points for completing the chapter: ${chapterTitle}`);
//           }
//         }
       
//         // Remove coin after a delay
//         setTimeout(() => {
//           handleCoinAnimationEnd(coin.id);
//         }, 300);
//       }
//     });
//   }, [coins]);

//   const currentLesson = {
//     title: chapterTitle,
//     subtopic: subtopicName,
//     file: `/videos/class7/maths/MicrosoftTeams-video.mp4`,
//     pdf: `/pdfs/${subject}/chapter-${chapterNumber}.pdf`,
//     about: `Learn about ${subject} concepts in ${chapterTitle}${subtopicName ? ` - ${subtopicName}` : ''}. This ${subtopicName ? 'subtopic' : 'chapter'} covers important topics that will help you build a strong foundation.`
//   };

//   const checklistItems = [
//     { id: 1, task: `Watch full video of ${currentLesson.title}${subtopicName ? ` - ${subtopicName}` : ''}`, status: checklistStatus.videoWatched ? "completed" : "in-progress" },
//     { id: 2, task: "Attempt practice quiz", status: checklistStatus.practiceAttempted ? "completed" : "pending" },
//   ];

//   const practiceQuestions = [
//     { id: 1, question: `Practice questions for ${currentLesson.title}${subtopicName ? ` - ${subtopicName}` : ''}` },
//   ];

//   const createCoinAnimation = () => {
//     const videoElement = videoRef.current;
//     if (!videoElement) return;

//     const videoRect = videoElement.getBoundingClientRect();
   
//     // Create multiple coins for better visual effect
//     const newCoins = Array.from({ length: 5 }, (_, index) => ({
//       id: Date.now() + index,
//       startX: videoRect.left + videoRect.width / 2,
//       startY: videoRect.top + videoRect.height / 2,
//       endX: window.innerWidth - 100,
//       endY: 50,
//       value: 2,
//       delay: index * 100,
//       animationCompleted: false,
//       pointsAdded: false
//     }));

//     setCoins(prev => [...prev, ...newCoins]);
//     setToastShown(false);
//   };

//   const handleVideoEnd = () => {
//     setIsVideoCompleted(true);
//     const videoKey = getVideoKey();
   
//     if (!sessionStorage.getItem(videoKey) && !skipped && !pointsAwarded) {
//       sessionStorage.setItem(videoKey, 'true');
//       setPointsAwarded(true);
//       createCoinAnimation();
//     }
//   };

//   const handleStartQuiz = () => {
//     if (remainingChances > 0) {
//       setShowQuiz(true);
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setQuizScore(0);
//       setQuizCompleted(false);
//     }
//   };

//   const handleAnswerSelect = (index) => {
//     setSelectedAnswer(index);
//   };

//   const handleNextQuestion = () => {
//     if (selectedAnswer === 0) {
//       setQuizScore(prevScore => prevScore + 1);
//     }
//     if (currentQuestionIndex < 2) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedAnswer(null);
//     } else {
//       setQuizCompleted(true);
//       const newChances = remainingChances - 1;
//       setRemainingChances(newChances);
     
//       const chapterKey = getChapterKey();
//       sessionStorage.setItem(chapterKey, newChances.toString());
     
//       const isPassed = quizScore >= 2;
//       setChecklistStatus(prev => ({
//         ...prev,
//         practiceAttempted: true,
//         quizPassed: isPassed
//       }));
//     }
//   };

//   const handleCloseQuiz = () => {
//     setShowQuiz(false);
//   };

//   const handleRetryQuiz = () => {
//     if (remainingChances > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setQuizScore(0);
//       setQuizCompleted(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!userInput.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: userInput.trim(),
//       timestamp: new Date().toLocaleTimeString()
//     };

//     setChatMessages(prev => [...prev, userMessage]);
//     setUserInput('');
//     setIsLoading(true);
//     setShowQuickActions(false);

//     try {
//       const response = await fetch('http://localhost:8000/ai-assistant/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           class_level: `Class ${classNumber}`,
//           subject: subject,
//           chapter: currentLesson.title,
//           student_question: userInput,
//           chat_history: chatMessages
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         const processedContent = handleAIMessageResponse(data.response, data.type);
       
//         const aiMessage = {
//           id: Date.now() + 1,
//           type: 'assistant',
//           content: processedContent,
//           messageType: data.type,
//           timestamp: new Date().toLocaleTimeString()
//         };
//         setChatMessages(prev => {
//           const newMessages = [...prev, aiMessage];
//           const historyEntry = {
//             id: Date.now(),
//             userMessage: userMessage.content,
//             aiResponse: aiMessage.content,
//             timestamp: new Date().toLocaleString()
//           };
//           const updatedHistory = [historyEntry, ...chatHistory];
//           setChatHistory(updatedHistory);
//           sessionStorage.setItem(getHistoryKey(), JSON.stringify(updatedHistory));
//           return newMessages;
//         });
//       } else {
//         throw new Error('Failed to get response');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: 'assistant',
//         content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
//         messageType: 'error',
//         timestamp: new Date().toLocaleTimeString()
//       };
//       setChatMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleQuickAction = async (actionType) => {
//     const topicText = subtopicName ? ` - ${subtopicName}` : '';
//     const messages = {
//       study_plan: `Can you create a study plan with topics for ${currentLesson.title}${topicText} in ${subject}?`,
//       notes: `Please provide comprehensive notes on ${currentLesson.title}${topicText} in ${subject}`,
//     };

//     const message = messages[actionType];
//     setUserInput(message);
//     setTimeout(() => {
//       sendMessage();
//     }, 100);
//   };

//   const clearChat = () => {
//     setChatMessages([]);
//     setShowQuickActions(true);
//   };

//   const copyToClipboard = async (content, messageId) => {
//     try {
//       await navigator.clipboard.writeText(content);
//       setCopiedMessageId(messageId);
//       setTimeout(() => setCopiedMessageId(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   const addNewNote = () => {
//     const newNote = {
//       id: Date.now(),
//       content: '',
//       color: getRandomColor(),
//       timestamp: new Date().toLocaleString()
//     };
//     setStickyNotes(prev => [...prev, newNote]);
//     setActiveNoteId(newNote.id);
//     setShowNotesList(false);
//   };

//   const deleteNote = (id) => {
//     if (stickyNotes.length === 1) {
//       const newNote = { id: Date.now(), content: '', color: '#fef3c7', timestamp: new Date().toLocaleString() };
//       setStickyNotes([newNote]);
//       setActiveNoteId(newNote.id);
//       sessionStorage.setItem(getNotesKey(), JSON.stringify([newNote]));
//     } else {
//       const updatedNotes = stickyNotes.filter(note => note.id !== id);
//       setStickyNotes(updatedNotes);
//       if (activeNoteId === id) {
//         setActiveNoteId(updatedNotes[0].id);
//       }
//       sessionStorage.setItem(getNotesKey(), JSON.stringify(updatedNotes));
//     }
//   };

//   const updateNoteContent = (id, content) => {
//     setStickyNotes(prev => prev.map(note =>
//       note.id === id ? { ...note, content, timestamp: new Date().toLocaleString() } : note
//     ));
//   };

//   const saveNote = () => {
//     sessionStorage.setItem(getNotesKey(), JSON.stringify(stickyNotes));
//     setSavedMessage(true);
//     setTimeout(() => setSavedMessage(false), 2000);
//   };

//   const selectNote = (id) => {
//     setActiveNoteId(id);
//     setShowNotesList(false);
//   };

//   const getRandomColor = () => {
//     const colors = ['#fef3c7', '#fecaca', '#ddd6fe', '#bfdbfe', '#a7f3d0', '#fecdd3', '#fed7aa'];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const formatResponse = (content) => {
//     return content.split('\n').map((line, index) => {
//       if (line.startsWith('# ')) {
//         return <h4 key={index} className="ai-response-heading">{line.replace('# ', '')}</h4>;
//       } else if (line.startsWith('## ')) {
//         return <h5 key={index} className="ai-response-subheading">{line.replace('## ', '')}</h5>;
//       } else if (line.startsWith('- ') || line.startsWith('• ')) {
//         return <div key={index} className="ai-response-list-item">• {line.replace(/^[-•]\s*/, '')}</div>;
//       } else if (line.trim() === '') {
//         return <br key={index} />;
//       } else {
//         return <div key={index} className="ai-response-text">{line}</div>;
//       }
//     });
//   };

//   const generateOverview = async () => {
//     setIsGeneratingOverview(true);
//     try {
//       const response = await fetch('http://localhost:8000/ai-assistant/generate-overview', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           class_level: `Class ${classNumber}`,
//           subject: subject,
//           chapter: currentLesson.title,
//           specific_topic: currentLesson.subtopic || null
//         }),
//       });

//       const data = await response.json();
     
//       if (data.success) {
//         setOverviewContent(data.overview);
//         setOverviewLoaded(true);
//       } else {
//         setOverviewContent(`
// 📖 ${currentLesson.title.toUpperCase()}${currentLesson.subtopic ? ` - ${currentLesson.subtopic.toUpperCase()}` : ''} - TOPIC OVERVIEW
// ══════════════════════════════════════════

// 🎯 QUICK SUMMARY:
// • Main Focus: ${currentLesson.title}${currentLesson.subtopic ? ` focusing on ${currentLesson.subtopic}` : ''}
// • Key Learning: Understanding core concepts and applications
// • Real-world Connection: Practical applications in daily life

// 🔍 WHAT YOU'LL LEARN:
// ────────────────────

// 📚 Core Concepts:
// • Fundamental principles and theories
// • Key definitions and terminology
// • Important relationships and patterns

// 🛠️ Important Skills:
// • Problem-solving techniques
// • Analytical thinking
// • Application of concepts

// 💡 KEY TAKEAWAYS:
// • Solid understanding of the topic
// • Ability to apply knowledge
// • Foundation for future learning

// 🌟 WHY THIS MATTERS:
// • Builds essential knowledge for academic success
// • Develops critical thinking skills
// • Prepares for advanced topics

// 📝 STUDY TIPS:
// • Review concepts regularly
// • Practice with examples
// • Ask questions when unsure
//         `);
//         setOverviewLoaded(true);
//       }
//     } catch (error) {
//       console.error('Error generating overview:', error);
//       setOverviewContent(`
// 📖 ${currentLesson.title.toUpperCase()} - OVERVIEW
// ══════════════════════════

// This chapter covers important concepts in ${subject} that will help you build a strong foundation.

// Key areas include:
// • Understanding basic principles
// • Learning practical applications
// • Developing problem-solving skills

// Study this chapter carefully to master the concepts!
//       `);
//       setOverviewLoaded(true);
//     } finally {
//       setIsGeneratingOverview(false);
//     }
//   };

//   const formatOverview = (content) => {
//     return content.split('\n').map((line, index) => {
//       if (line.startsWith('📖') || line.startsWith('🎯') || line.startsWith('🔍') ||
//           line.startsWith('📚') || line.startsWith('🛠️') || line.startsWith('💡') ||
//           line.startsWith('🌟') || line.startsWith('📝')) {
//         return <h4 key={index} className="overview-section-heading" style={{
//           color: '#0f766e',
//           margin: '16px 0 8px 0',
//           fontSize: '16px',
//           fontWeight: '600',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px'
//         }}>{line}</h4>;
//       } else if (line.includes('════')) {
//         return <hr key={index} style={{ border: 'none', borderTop: '2px solid #0f766e', margin: '12px 0' }} />;
//       } else if (line.startsWith('•')) {
//         return <div key={index} className="overview-list-item" style={{
//           margin: '6px 0',
//           paddingLeft: '20px',
//           fontSize: '14px',
//           color: '#4b5563',
//           lineHeight: '1.5',
//           display: 'flex',
//           alignItems: 'flex-start',
//           gap: '8px'
//         }}>
//           <span style={{ color: '#0f766e', flexShrink: 0 }}>•</span>
//           <span>{line.replace('•', '').trim()}</span>
//         </div>;
//       } else if (line.trim() === '') {
//         return <br key={index} />;
//       } else {
//         return <div key={index} className="overview-text" style={{
//           fontSize: '14px',
//           color: '#4b5563',
//           lineHeight: '1.5',
//           margin: '8px 0'
//         }}>{line}</div>;
//       }
//     });
//   };

//   const demoQuestions = [
//     {
//       question: `What is the main topic covered in ${currentLesson.title}${subtopicName ? ` - ${subtopicName}` : ''}?`,
//       options: ["Basic Concepts", "Advanced Applications", "Historical Context", "All of the above"],
//       correctAnswer: 3
//     },
//     {
//       question: "Which of the following best describes the learning objectives?",
//       options: ["Memorization", "Conceptual Understanding", "Practical Application", "Both B and C"],
//       correctAnswer: 3
//     },
//     {
//       question: "What should you focus on while studying this chapter?",
//       options: ["Key Definitions", "Problem Solving", "Real-world Applications", "All of the above"],
//       correctAnswer: 3
//     }
//   ];

//   const activeNote = stickyNotes.find(note => note.id === activeNoteId);

//   return (
//     <>
//       <style>
//         {`
//           * {
//             box-sizing: border-box;
//           }
         
//           @keyframes bounce {
//             0%, 80%, 100% { transform: scale(0); }
//             40% { transform: scale(1); }
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//           }
//           @keyframes fadeOut {
//             from { opacity: 1; }
//             to { opacity: 0; }
//           }
//           @keyframes coinFly {
//             0% {
//               transform: translate(0, 0) scale(1) rotate(0deg);
//               opacity: 1;
//             }
//             70% {
//               opacity: 1;
//             }
//             100% {
//               transform: translate(var(--end-x), var(--end-y)) scale(0.3) rotate(360deg);
//               opacity: 0;
//             }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }

//           .ai-response-heading {
//             color: #0f766e;
//             margin: 8px 0;
//             font-size: 15px;
//             font-weight: 600;
//           }

//           .ai-response-subheading {
//             color: #0f766e;
//             margin: 6px 0;
//             font-size: 14px;
//             font-weight: 600;
//           }

//           .ai-response-list-item {
//             margin: 4px 0;
//             padding-left: 16px;
//           }

//           .ai-response-text {
//             margin: 4px 0;
//             line-height: 1.5;
//           }

//           .overview-section-heading {
//             color: #0f766e;
//             margin: 16px 0 8px 0;
//             fontSize: 16px;
//             fontWeight: 600;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }
         
//           .overview-list-item {
//             margin: 6px 0;
//             paddingLeft: 20px;
//             fontSize: 14px;
//             color: '#4b5563';
//             lineHeight: 1.5;
//             display: flex;
//             align-items: flex-start;
//             gap: 8px;
//           }
         
//           .overview-text {
//             fontSize: 14px;
//             color: '#4b5563';
//             lineHeight: 1.5;
//             margin: 8px 0;
//           }

//           video::-webkit-media-controls-download-button {
//             display: none;
//           }
//           video {
//             controlsList: "nodownload";
//           }

//           .coin {
//             position: fixed;
//             width: 24px;
//             height: 24px;
//             background: linear-gradient(135deg, #FFD700, #FFA500);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: bold;
//             color: #744210;
//             z-index: 10000;
//             box-shadow: 0 2px 8px rgba(255, 193, 7, 0.6);
//             border: 2px solid #FFC107;
//             animation: coinFly 1.5s ease-in-out forwards;
//           }

//           .coin-inner {
//             width: 16px;
//             height: 16px;
//             background: linear-gradient(135deg, #FFA500, #FFD700);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }
//         `}
//       </style>
     
//       <ToastContainer
//         position="top-center"
//         autoClose={4000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
     
//       {coins.map((coin) => (
//         <div
//           key={coin.id}
//           className="coin"
//           style={{
//             '--end-x': `${coin.endX - coin.startX}px`,
//             '--end-y': `${coin.endY - coin.startY}px`,
//             left: `${coin.startX}px`,
//             top: `${coin.startY}px`,
//             animationDelay: `${coin.delay}ms`
//           }}
//           onAnimationEnd={() => {
//             setCoins(prev => prev.map(c =>
//               c.id === coin.id ? { ...c, animationCompleted: true } : c
//             ));
//           }}
//         >
//           <div className="coin-inner">
//             <Coins size={10} color="#744210" />
//           </div>
//         </div>
//       ))}
     
//       <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//         <div style={{
//           backgroundColor: 'white',
//           padding: '110px 32px 20px 32px',
//           borderBottom: '1px solid #e5e7eb',
//           textAlign: 'center',
//           marginTop: '0'
//         }}>
//           <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
//             {subject} • {currentLesson.title}
//           </h1>
//           {currentLesson.subtopic && (
//             <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>
//               Topic: {currentLesson.subtopic}
//             </div>
//           )}
//         </div>

//         <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
//           <div style={{
//             marginBottom: '20px',
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             padding: '16px',
//             boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//           }}>
//             <h2 style={{
//               fontSize: '16px',
//               fontWeight: '600',
//               color: '#1f2937',
//               marginBottom: '12px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}>
//               <Play size={18} />
//               {currentLesson.subtopic ? `Video: ${currentLesson.subtopic}` : `Video: ${currentLesson.title}`}
//               {pointsAwarded && (
//                 <span style={{
//                   fontSize: '12px',
//                   background: 'linear-gradient(135deg, #10b981, #059669)',
//                   color: 'white',
//                   padding: '2px 8px',
//                   borderRadius: '12px',
//                   marginLeft: '8px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '4px'
//                 }}>
//                   <Coins size={12} />
//                   Rewarded
//                 </span>
//               )}
//             </h2>
//             <div style={{
//               position: 'relative',
//               width: '100%',
//               height: '0',
//               paddingBottom: '56.25%',
//               borderRadius: '8px',
//               overflow: 'hidden',
//               backgroundColor: '#000'
//             }}>
//               <video
//                 ref={videoRef}
//                 src={currentLesson.file}
//                 controls
//                 controlsList="nodownload"
//                 style={{
//                   position: 'absolute',
//                   top: '0',
//                   left: '0',
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'contain'
//                 }}
//                 onEnded={handleVideoEnd}
//               />
//             </div>
//             {!pointsAwarded && (
//               <div style={{
//                 marginTop: '12px',
//                 padding: '8px 12px',
//                 backgroundColor: '#f0fdfa',
//                 border: '1px solid #a7f3d0',
//                 borderRadius: '6px',
//                 fontSize: '12px',
//                 color: '#065f46',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px'
//               }}>
//                 <Coins size={14} />
//                 Complete this video to earn 10 reward points!
//               </div>
//             )}
//           </div>

//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '12px 12px 0 0',
//             border: '1px solid #e5e7eb',
//             borderBottom: 'none',
//             display: 'flex',
//             gap: '0',
//             overflowX: 'auto'
//           }}>
//             {[
//               { id: 'overview', label: 'Overview', icon: null },
//               { id: 'checklist', label: 'Lesson Checklist', icon: FileText },
//               { id: 'practice', label: 'Quick Practice', icon: Play },
//               { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
//               { id: 'notes', label: `Notes (${stickyNotes.length})`, icon: StickyNote }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: activeTab === tab.id ? '#0f766e' : '#6b7280',
//                   padding: '14px 20px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: activeTab === tab.id ? '600' : '500',
//                   borderBottom: activeTab === tab.id ? '3px solid #0f766e' : '3px solid transparent',
//                   transition: 'all 0.2s',
//                   whiteSpace: 'nowrap',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}
//               >
//                 {tab.icon && <tab.icon size={16} />}
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div style={{
//             backgroundColor: 'white',
//             border: '1px solid #e5e7eb',
//             borderRadius: '0 0 12px 12px',
//             padding: '20px',
//             minHeight: '400px'
//           }}>
//             {activeTab === 'overview' && (
//               <div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//                   <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
//                     📘 {currentLesson.subtopic ? 'Topic Overview' : 'Chapter Overview'}
//                   </h3>
//                   <button
//                     onClick={generateOverview}
//                     disabled={isGeneratingOverview}
//                     style={{
//                       background: '#0f766e',
//                       color: 'white',
//                       border: 'none',
//                       padding: '8px 16px',
//                       borderRadius: '6px',
//                       fontSize: '12px',
//                       fontWeight: '500',
//                       cursor: isGeneratingOverview ? 'not-allowed' : 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '6px',
//                       opacity: isGeneratingOverview ? 0.6 : 1
//                     }}
//                   >
//                     {isGeneratingOverview ? (
//                       <>
//                         <div style={{ width: '12px', height: '12px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw size={14} />
//                         Refresh Overview
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {isGeneratingOverview && !overviewContent ? (
//                   <div style={{
//                     textAlign: 'center',
//                     padding: '40px 20px',
//                     color: '#64748b',
//                     backgroundColor: '#f8fafc',
//                     borderRadius: '8px'
//                   }}>
//                     <div style={{
//                       width: '40px',
//                       height: '40px',
//                       border: '3px solid #f1f5f9',
//                       borderTop: '3px solid #0f766e',
//                       borderRadius: '50%',
//                       animation: 'spin 1s linear infinite',
//                       margin: '0 auto 16px auto'
//                     }}></div>
//                     <p style={{ margin: 0, fontSize: '14px' }}>Generating comprehensive overview...</p>
//                   </div>
//                 ) : overviewContent ? (
//                   <div style={{
//                     backgroundColor: '#fafbfc',
//                     borderRadius: '8px',
//                     padding: '20px',
//                     border: '1px solid #e5e7eb'
//                   }}>
//                     {formatOverview(overviewContent)}
//                   </div>
//                 ) : (
//                   <div style={{
//                     textAlign: 'center',
//                     padding: '40px 20px',
//                     color: '#64748b',
//                     backgroundColor: '#f8fafc',
//                     borderRadius: '8px'
//                   }}>
//                     <FileText size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
//                     <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
//                       Overview not generated yet
//                     </p>
//                     <p style={{ margin: 0, fontSize: '14px' }}>
//                       Click "Refresh Overview" to generate a comprehensive overview of this {currentLesson.subtopic ? 'topic' : 'chapter'}.
//                     </p>
//                   </div>
//                 )}

//                 {!pointsAwarded && (
//                   <div style={{
//                     marginTop: '20px',
//                     padding: '16px',
//                     backgroundColor: '#fffbeb',
//                     border: '1px solid #fcd34d',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     color: '#92400e',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '12px'
//                   }}>
//                     <Coins size={20} />
//                     <div>
//                       <div style={{ fontWeight: '600', marginBottom: '4px' }}>
//                         Complete the video to earn 10 reward points!
//                       </div>
//                       <div style={{ fontSize: '13px', opacity: 0.8 }}>
//                         Watch the entire video without skipping to earn your reward.
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {pointsAwarded && (
//                   <div style={{
//                     marginTop: '20px',
//                     padding: '16px',
//                     backgroundColor: '#f0fdfa',
//                     border: '1px solid #a7f3d0',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     color: '#065f46',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '12px'
//                   }}>
//                     <Coins size={20} />
//                     <div>
//                       <div style={{ fontWeight: '600', marginBottom: '4px' }}>
//                         🎉 Reward Earned!
//                       </div>
//                       <div style={{ fontSize: '13px', opacity: 0.8 }}>
//                         You've earned 10 reward points for completing this {currentLesson.subtopic ? 'topic' : 'chapter'}!
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'checklist' && (
//               <div>
//                 <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <FileText size={18}/> Lesson Checklist
//                 </h3>
//                 {checklistItems.map((item) => (
//                   <div key={item.id} style={{
//                     padding: '12px 0',
//                     borderBottom: '1px solid #f3f4f6',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <span style={{ fontSize: '14px', color: '#4b5563' }}>{item.task}</span>
//                     <span style={{
//                       fontSize: '12px',
//                       padding: '4px 8px',
//                       borderRadius: '12px',
//                       background: item.status === "completed" ? "#10b981" :
//                                  item.status === "in-progress" ? "#ec4899" : "#e5e7eb",
//                       color: item.status === "completed" || item.status === "in-progress" ? "white" : "#6b7280"
//                     }}>
//                       {item.status}
//                     </span>
//                   </div>
//                 ))}
//                 {pointsAwarded && (
//                   <div style={{
//                     marginTop: '16px',
//                     padding: '12px',
//                     backgroundColor: '#f0fdfa',
//                     border: '1px solid #a7f3d0',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     color: '#065f46',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px'
//                   }}>
//                     <Coins size={16} />
//                     🎉 You earned 10 reward points for completing this {subtopicName ? 'subtopic' : 'chapter'}!
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'practice' && (
//               <div>
//                 <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
//                   Quick Practice
//                 </h3>
//                 <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <AlertCircle size={16} color="#f59e0b" />
//                   <span style={{ fontSize: '14px', color: '#f59e0b' }}>
//                     {remainingChances} {remainingChances === 1 ? 'chance' : 'chances'} remaining for this chapter
//                   </span>
//                 </div>
//                 {practiceQuestions.map((q) => (
//                   <div key={q.id} style={{
//                     padding: '14px 16px',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     marginBottom: '12px',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     backgroundColor: '#fafafa'
//                   }}>
//                     <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>{q.question}</span>
//                     <button
//                       onClick={handleStartQuiz}
//                       disabled={remainingChances <= 0}
//                       style={{
//                         backgroundColor: remainingChances > 0 ? "#0f766e" : "#9ca3af",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "6px",
//                         padding: "8px 16px",
//                         cursor: remainingChances > 0 ? "pointer" : "not-allowed",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px",
//                         fontSize: '14px',
//                         fontWeight: '500',
//                         transition: 'all 0.2s'
//                       }}
//                     >
//                       <Play size={14} />
//                       {remainingChances > 0 ? "Start Quiz" : "No chances"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeTab === 'ai-assistant' && (
//               <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
//                 {showHistory && (
//                   <div style={{
//                     position: 'fixed',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     backgroundColor: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
//                     border: '1px solid #e5e7eb',
//                     width: '90%',
//                     maxWidth: '500px',
//                     maxHeight: '500px',
//                     overflow: 'hidden',
//                     zIndex: 1001
//                   }}>
//                     <div style={{
//                       padding: '16px',
//                       borderBottom: '1px solid #e5e7eb',
//                       fontWeight: '600',
//                       color: '#1f2937',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between'
//                     }}>
//                       <span>Search History ({chatHistory.length})</span>
//                       <button
//                         onClick={() => setShowHistory(false)}
//                         style={{
//                           background: 'none',
//                           border: 'none',
//                           cursor: 'pointer',
//                           padding: '4px',
//                           display: 'flex'
//                         }}
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                     <div style={{ maxHeight: '400px', overflow: 'auto' }}>
//                       {chatHistory.length === 0 ? (
//                         <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
//                           No search history yet
//                         </div>
//                       ) : (
//                         chatHistory.map((item) => (
//                           <div key={item.id} style={{
//                             padding: '12px 16px',
//                             borderBottom: '1px solid #f3f4f6',
//                             cursor: 'pointer'
//                           }}>
//                             <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500', marginBottom: '6px' }}>
//                               Q: {item.userMessage}
//                             </div>
//                             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                               A: {item.aiResponse.substring(0, 100)}...
//                             </div>
//                             <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.timestamp}</div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div
//                   ref={chatContainerRef}
//                   style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#fafbfc', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
//                 >
//                   {chatMessages.length === 0 ? (
//                     <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
//                       <Bot size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
//                       <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
//                         Hello! I'm your AI Learning Assistant
//                       </p>
//                       <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
//                         Ask me anything about this lesson, request study plans and notes.
//                       </p>
//                       <button
//                         onClick={() => setShowHistory(true)}
//                         style={{
//                           marginTop: '16px',
//                           padding: '8px 16px',
//                           background: '#f0fdfa',
//                           border: '1px solid #0f766e',
//                           borderRadius: '6px',
//                           color: '#0f766e',
//                           cursor: 'pointer',
//                           fontSize: '13px',
//                           fontWeight: '500'
//                         }}
//                       >
//                         View History ({chatHistory.length})
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       {chatMessages.map((message) => (
//                         <div
//                           key={message.id}
//                           style={{
//                             display: 'flex',
//                             gap: '10px',
//                             flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
//                           }}
//                         >
//                           <div style={{
//                             width: '32px',
//                             height: '32px',
//                             borderRadius: '50%',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0,
//                             backgroundColor: message.type === 'user' ? '#0f766e' : '#ec4899'
//                           }}>
//                             {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
//                           </div>
//                           <div style={{
//                             maxWidth: '85%',
//                             padding: '12px 16px',
//                             borderRadius: '16px',
//                             lineHeight: '1.5',
//                             fontSize: '14px',
//                             boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
//                             backgroundColor: message.type === 'user' ? '#0f766e' : 'white',
//                             color: message.type === 'user' ? 'white' : '#1e293b',
//                             border: message.type === 'assistant' ? '1px solid #e2e8f0' : 'none',
//                             borderBottomRightRadius: message.type === 'user' ? '6px' : '16px',
//                             borderBottomLeftRadius: message.type === 'assistant' ? '6px' : '16px'
//                           }}>
//                             <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
//                               {message.type === 'assistant' ? formatResponse(message.content) : message.content}
//                             </div>
//                             <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                               <span>{message.timestamp}</span>
//                               {message.type === 'assistant' && (
//                                 <button
//                                   onClick={() => copyToClipboard(message.content, message.id)}
//                                   style={{
//                                     background: 'none',
//                                     border: 'none',
//                                     cursor: 'pointer',
//                                     color: copiedMessageId === message.id ? '#10b981' : 'inherit',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '4px',
//                                     padding: '4px',
//                                     opacity: 0.7,
//                                     transition: 'opacity 0.2s'
//                                   }}
//                                 >
//                                   {copiedMessageId === message.id ? (
//                                     <>
//                                       <Check size={12} />
//                                       Copied
//                                     </>
//                                   ) : (
//                                     <>
//                                       <Copy size={12} />
//                                       Copy
//                                     </>
//                                   )}
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   )}
                 
//                   {isLoading && (
//                     <div style={{ display: 'flex', gap: '10px' }}>
//                       <div style={{
//                         width: '32px',
//                         height: '32px',
//                         borderRadius: '50%',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         flexShrink: 0,
//                         backgroundColor: '#ec4899'
//                       }}>
//                         <Bot size={16} />
//                       </div>
//                       <div style={{
//                         padding: '12px 16px',
//                         borderRadius: '16px',
//                         backgroundColor: 'white',
//                         border: '1px solid #e2e8f0',
//                         display: 'flex',
//                         gap: '6px',
//                         alignItems: 'center'
//                       }}>
//                         <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out' }}></div>
//                         <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '-0.16s' }}></div>
//                         <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '-0.32s' }}></div>
//                         <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>AI is thinking...</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {showQuickActions && chatMessages.length === 0 && (
//                   <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', backgroundColor: 'white', borderRadius: '8px', marginBottom: '16px' }}>
//                     <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>
//                       Try asking:
//                     </div>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//                       <button
//                         onClick={() => handleQuickAction('study_plan')}
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                           padding: '10px 12px',
//                           backgroundColor: '#f8fafc',
//                           color: '#0f766e',
//                           border: '1px solid #e2e8f0',
//                           borderRadius: '8px',
//                           fontSize: '12px',
//                           cursor: 'pointer',
//                           transition: 'all 0.2s',
//                           fontWeight: '500'
//                         }}
//                       >
//                         <Calendar size={14} />
//                         Study Plan
//                       </button>
//                       <button
//                         onClick={() => handleQuickAction('notes')}
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                           padding: '10px 12px',
//                           backgroundColor: '#f8fafc',
//                           color: '#0f766e',
//                           border: '1px solid #e2e8f0',
//                           borderRadius: '8px',
//                           fontSize: '12px',
//                           cursor: 'pointer',
//                           transition: 'all 0.2s',
//                           fontWeight: '500'
//                         }}
//                       >
//                         <FileText size={14} />
//                         Get Notes
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {chatMessages.length > 0 && (
//                   <div style={{
//                     padding: '12px 16px',
//                     borderTop: '1px solid #f1f5f9',
//                     backgroundColor: '#fafbfc',
//                     borderRadius: '8px',
//                     marginBottom: '16px',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <button
//                       onClick={() => setShowHistory(true)}
//                       style={{
//                         background: 'none',
//                         border: 'none',
//                         color: '#64748b',
//                         fontSize: '12px',
//                         cursor: 'pointer',
//                         textDecoration: 'underline',
//                         fontWeight: '500',
//                         padding: '6px 12px'
//                       }}
//                     >
//                       View History ({chatHistory.length})
//                     </button>
//                     <button
//                       onClick={clearChat}
//                       style={{
//                         background: 'none',
//                         border: 'none',
//                         color: '#64748b',
//                         fontSize: '12px',
//                         cursor: 'pointer',
//                         textDecoration: 'underline',
//                         fontWeight: '500',
//                         padding: '6px 12px'
//                       }}
//                     >
//                       Clear Chat
//                     </button>
//                   </div>
//                 )}

//                 <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
//                   <textarea
//                     value={userInput}
//                     onChange={(e) => setUserInput(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         sendMessage();
//                       }
//                     }}
//                     placeholder="Ask about study plans, notes..."
//                     style={{
//                       flex: 1,
//                       border: '1px solid #d1d5db',
//                       borderRadius: '12px',
//                       padding: '12px 16px',
//                       fontSize: '14px',
//                       resize: 'none',
//                       fontFamily: 'inherit',
//                       lineHeight: '1.5',
//                       backgroundColor: '#fafafa',
//                       transition: 'all 0.2s',
//                       minHeight: '44px',
//                       maxHeight: '100px',
//                       outline: 'none'
//                     }}
//                     rows={1}
//                   />
//                   <button
//                     onClick={sendMessage}
//                     disabled={isLoading || !userInput.trim()}
//                     style={{
//                       backgroundColor: (userInput.trim() && !isLoading) ? '#0f766e' : '#9ca3af',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '10px',
//                       padding: '12px 16px',
//                       cursor: (userInput.trim() && !isLoading) ? 'pointer' : 'not-allowed',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '6px',
//                       fontSize: '14px',
//                       fontWeight: '500',
//                       transition: 'all 0.2s',
//                       minHeight: '44px'
//                     }}
//                   >
//                     <Send size={16} />
//                     Send
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'notes' && (
//               <div style={{ display: 'flex', flexDirection: 'column', height: '400px', backgroundColor: activeNote?.color || '#fef3c7', borderRadius: '8px', position: 'relative' }}>
//                 {savedMessage && (
//                   <div style={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     backgroundColor: 'rgba(16, 185, 129, 0.95)',
//                     color: 'white',
//                     padding: '12px 24px',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     animation: 'fadeIn 0.3s, fadeOut 0.3s 1.7s',
//                     zIndex: 10,
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
//                   }}>
//                     ✓ Note saved successfully!
//                   </div>
//                 )}

//                 {showNotesList && (
//                   <div style={{
//                     position: 'absolute',
//                     top: '50px',
//                     right: '16px',
//                     backgroundColor: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
//                     border: '1px solid #e5e7eb',
//                     width: '280px',
//                     maxHeight: '350px',
//                     overflow: 'auto',
//                     zIndex: 100
//                   }}>
//                     <div style={{
//                       padding: '12px 16px',
//                       borderBottom: '1px solid #e5e7eb',
//                       fontWeight: '600',
//                       color: '#1f2937',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between'
//                     }}>
//                       <span>All Notes ({stickyNotes.length})</span>
//                       <button
//                         onClick={() => setShowNotesList(false)}
//                         style={{
//                           background: 'none',
//                           border: 'none',
//                           cursor: 'pointer',
//                           padding: '4px',
//                           display: 'flex'
//                         }}
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                     {stickyNotes.map((note) => (
//                       <div
//                         key={note.id}
//                         onClick={() => selectNote(note.id)}
//                         style={{
//                           padding: '12px 16px',
//                           borderBottom: '1px solid #f3f4f6',
//                           cursor: 'pointer',
//                           transition: 'background 0.2s',
//                           backgroundColor: note.id === activeNoteId ? '#f0fdfa' : 'transparent',
//                           borderLeft: note.id === activeNoteId ? '3px solid #0f766e' : 'none'
//                         }}
//                       >
//                         <div style={{
//                           fontSize: '13px',
//                           color: '#4b5563',
//                           marginBottom: '4px',
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis'
//                         }}>
//                           {note.content.substring(0, 50) || 'Empty note'}
//                           {note.content.length > 50 && '...'}
//                         </div>
//                         <div style={{
//                           fontSize: '11px',
//                           color: '#9ca3af',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '4px'
//                         }}>
//                           <Clock size={10} />
//                           {note.timestamp}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '12px 16px',
//                   borderBottom: '1px solid rgba(0,0,0,0.1)'
//                 }}>
//                   <button
//                     onClick={addNewNote}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       cursor: 'pointer',
//                       padding: '6px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       borderRadius: '4px',
//                       transition: 'background 0.2s'
//                     }}
//                     title="Add new note"
//                   >
//                     <Plus size={18} color="#1f2937" />
//                   </button>
//                   <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//                     <button
//                       onClick={() => setShowNotesList(!showNotesList)}
//                       style={{
//                         background: 'none',
//                         border: 'none',
//                         cursor: 'pointer',
//                         padding: '6px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderRadius: '4px',
//                         transition: 'background 0.2s'
//                       }}
//                       title="View all notes"
//                     >
//                       <MoreHorizontal size={18} color="#1f2937" />
//                     </button>
//                     <button
//                       onClick={() => activeNote && deleteNote(activeNote.id)}
//                       style={{
//                         background: 'none',
//                         border: 'none',
//                         cursor: 'pointer',
//                         padding: '6px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderRadius: '4px',
//                         transition: 'background 0.2s',
//                         color: '#6b7280'
//                       }}
//                       title="Delete note"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>

//                 <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
//                   <textarea
//                     ref={textareaRef}
//                     value={activeNote?.content || ''}
//                     onChange={(e) => activeNote && updateNoteContent(activeNote.id, e.target.value)}
//                     placeholder="Take a note..."
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       border: 'none',
//                       outline: 'none',
//                       backgroundColor: 'transparent',
//                       resize: 'none',
//                       fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
//                       fontSize: '14px',
//                       lineHeight: '1.6',
//                       color: '#1f2937'
//                     }}
//                   />
//                 </div>

//                 <div style={{
//                   padding: '12px 16px',
//                   borderTop: '1px solid rgba(0,0,0,0.1)',
//                   backgroundColor: 'rgba(255,255,255,0.5)',
//                   display: 'flex',
//                   justifyContent: 'flex-end'
//                 }}>
//                   <button
//                     onClick={saveNote}
//                     style={{
//                       background: '#0f766e',
//                       color: 'white',
//                       border: 'none',
//                       padding: '8px 16px',
//                       borderRadius: '6px',
//                       fontSize: '13px',
//                       fontWeight: '500',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '6px'
//                     }}
//                   >
//                     Save Note
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {showQuiz && (
//           <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1000
//           }}>
//             <div style={{
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               padding: '24px',
//               width: '90%',
//               maxWidth: '500px',
//               maxHeight: '80vh',
//               overflow: 'auto',
//               position: 'relative'
//             }}>
//               <button
//                 onClick={handleCloseQuiz}
//                 style={{
//                   position: 'absolute',
//                   top: '16px',
//                   right: '16px',
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer'
//                 }}
//               >
//                 <X size={20} color="#6b7280" />
//               </button>
//               {!quizCompleted ? (
//                 <>
//                   <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
//                     Question {currentQuestionIndex + 1} of {demoQuestions.length}
//                   </h2>
//                   <p style={{ fontSize: '16px', marginBottom: '20px', fontWeight: '500' }}>
//                     {demoQuestions[currentQuestionIndex]?.question}
//                   </p>
//                   <div style={{ marginBottom: '20px' }}>
//                     {demoQuestions[currentQuestionIndex]?.options.map((option, index) => (
//                       <div
//                         key={index}
//                         onClick={() => handleAnswerSelect(index)}
//                         style={{
//                           padding: '12px 16px',
//                           border: `2px solid ${selectedAnswer === index ? '#0f766e' : '#e5e7eb'}`,
//                           borderRadius: '8px',
//                           marginBottom: '10px',
//                           cursor: 'pointer',
//                           backgroundColor: selectedAnswer === index ? '#f0fdfa' : 'white',
//                           transition: 'all 0.2s'
//                         }}
//                       >
//                         {option}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     onClick={handleNextQuestion}
//                     disabled={selectedAnswer === null}
//                     style={{
//                       width: '100%',
//                       padding: '12px',
//                       backgroundColor: selectedAnswer !== null ? '#0f766e' : '#9ca3af',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '6px',
//                       fontSize: '14px',
//                       fontWeight: '600',
//                       cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed'
//                     }}
//                   >
//                     {currentQuestionIndex === demoQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
//                     Quiz Completed!
//                   </h2>
//                   <div style={{
//                     textAlign: 'center',
//                     padding: '20px',
//                     backgroundColor: '#f0fdfa',
//                     borderRadius: '8px',
//                     marginBottom: '20px'
//                   }}>
//                     <p style={{ fontSize: '16px', marginBottom: '8px' }}>
//                       Your score: {quizScore} out of {demoQuestions.length}
//                     </p>
//                     <p style={{ fontSize: '14px', color: '#4b5563' }}>
//                       {quizScore >= Math.ceil(demoQuestions.length * 0.8)
//                         ? 'Congratulations! You passed the quiz.'
//                         : 'Keep studying and try again.'}
//                     </p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '12px' }}>
//                     <button
//                       onClick={handleCloseQuiz}
//                       style={{
//                         flex: 1,
//                         padding: '12px',
//                         backgroundColor: '#e5e7eb',
//                         color: '#4b5563',
//                         border: 'none',
//                         borderRadius: '6px',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Close
//                     </button>
//                     {remainingChances > 0 && quizScore < Math.ceil(demoQuestions.length * 0.8) && (
//                       <button
//                         onClick={handleRetryQuiz}
//                         style={{
//                           flex: 1,
//                           padding: '12px',
//                           backgroundColor: '#0f766e',
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: '6px',
//                           fontSize: '14px',
//                           fontWeight: '600',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         Try Again ({remainingChances} left)
//                       </button>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default LessonPage;













import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_CONFIG, fastAPI, djangoAPI } from '../../config/api';
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
  Check,
  Coins,
  RefreshCw
} from 'lucide-react';

const LessonPage = () => {
  const { class: classNumber, subject, chapterNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Sticky Notes States
  const [stickyNotes, setStickyNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showNotesList, setShowNotesList] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistory, setShowHistory] = useState(false);

  // Overview States
  const [overviewContent, setOverviewContent] = useState('');
  const [isGeneratingOverview, setIsGeneratingOverview] = useState(false);
  const [overviewLoaded, setOverviewLoaded] = useState(false);

  // Centralized state for the checklist
  const [checklistStatus, setChecklistStatus] = useState({
    videoWatched: false,
    practiceAttempted: false,
    quizPassed: false
  });

  // Video reward states
  const [skipped, setSkipped] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);
 
  // Coin animation states
  const [coins, setCoins] = useState([]);
  const [toastShown, setToastShown] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const chapterTitle = queryParams.get('chapterTitle') || `Chapter ${chapterNumber}`;
  const subtopicName = queryParams.get('subtopic');

  const getChapterKey = () => `quiz_chances_${classNumber}_${subject}_${chapterNumber}`;
  const getChapterDateKey = () => `quiz_date_${classNumber}_${subject}_${chapterNumber}`;
  const getVideoKey = () => `video_reward_${classNumber}_${subject}_${chapterNumber}_${subtopicName || 'main'}`;
  const getNotesKey = () => `sticky_notes_${classNumber}_${subject}_${chapterNumber}`;
  const getHistoryKey = () => `chat_history_${classNumber}_${subject}_${chapterNumber}`;

  // MARK: UPDATED - Study plan functions with current date start and enhanced notification system
  const saveStudyPlanToCalendar = async (studyPlanContent) => {
    try {
      // Generate a unique ID for this study plan based on content
      const planId = `plan_${classNumber}_${subject}_${chapterNumber}_${subtopicName || 'main'}_${Date.now()}`;
     
      // Use current date (when user requests the study plan) as start date
      const startDate = new Date();
     
      // Parse the study plan and create calendar events starting from current date
      const studyPlan = {
        id: planId,
        title: `${subject} - ${chapterTitle}${subtopicName ? ` - ${subtopicName}` : ''}`,
        content: studyPlanContent,
        subject: subject,
        chapter: chapterTitle,
        subtopic: subtopicName,
        class: classNumber,
        createdDate: startDate.toISOString(),
        // Create study sessions starting from the current date (when user requested)
        studySessions: generateStudySessionsFromPlan(studyPlanContent, startDate),
        completed: false
      };

      // Save to localStorage
      const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
     
      // Check for duplicates before adding
      const isDuplicate = existingPlans.some(plan =>
        plan.title === studyPlan.title &&
        plan.subject === studyPlan.subject &&
        plan.chapter === studyPlan.chapter
      );

      if (isDuplicate) {
        console.log('Study plan already exists, skipping duplicate');
        return true;
      }

      const updatedPlans = [...existingPlans, studyPlan];
      localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));

      // Save to backend database
      let savedPlanId = null;
      try {
        const planData = {
          class_name: `Class ${classNumber}`,
          subject: subject,
          chapter: chapterTitle,
          subtopic: subtopicName || '',
          plan_title: studyPlan.title,
          plan_content: studyPlanContent,
          plan_type: 'study_plan',
          difficulty_level: 'medium',
          estimated_duration_hours: studyPlan.studySessions?.length || 5
        };
        const planResponse = await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_STUDY_PLAN, planData);
        console.log('✅ Study plan saved to database:', planResponse);
        // Get plan_id from response if available
        if (planResponse && planResponse.study_plan && planResponse.study_plan.plan_id) {
          savedPlanId = planResponse.study_plan.plan_id.toString();
          // Update studyPlan with database plan_id
          studyPlan.databasePlanId = savedPlanId;
        } else if (planResponse && planResponse.plan_id) {
          savedPlanId = planResponse.plan_id.toString();
          studyPlan.databasePlanId = savedPlanId;
        }
      } catch (error) {
        console.error('❌ Error saving study plan to database:', error);
        console.error('❌ Error details:', error.response?.data);
        // Continue even if database save fails
      }

      // Save study sessions to calendar table
      if (studyPlan.studySessions && studyPlan.studySessions.length > 0) {
        try {
          const calendarEntries = studyPlan.studySessions.map(session => ({
            entry_date: session.date, // Already in YYYY-MM-DD format
            subject: subject,
            topic: session.topic || session.title || `Study ${chapterTitle}`,
            duration: session.duration || '60 minutes',
            class_name: `Class ${classNumber}`,
            chapter: chapterTitle,
            subtopic: subtopicName || '',
            plan_id: savedPlanId ? savedPlanId.toString() : null // Link to the saved study plan if available
          }));

          // Save multiple calendar entries at once
          const calendarResponse = await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_CALENDAR_ENTRIES, {
            entries: calendarEntries
          });
          console.log(`✅ ${calendarEntries.length} calendar entries saved to database:`, calendarResponse);
        } catch (error) {
          console.error('❌ Error saving calendar entries to database:', error);
          console.error('❌ Error details:', error.response?.data);
          // Continue even if calendar save fails
        }
      }

      // Create notification with enhanced event dispatch (use database plan_id if available)
      await createStudyPlanNotification(studyPlan);

      // Dispatch events to update navbar and other components
      window.dispatchEvent(new CustomEvent('studyPlanAdded', {
        detail: { studyPlan }
      }));
     
      // Force refresh notifications in navbar
      window.dispatchEvent(new CustomEvent('refreshNotifications'));

      console.log('Study plan saved with start date:', startDate.toLocaleDateString(), studyPlan);
      return true;
    } catch (error) {
      console.error('Error saving study plan:', error);
      return false;
    }
  };

  // MARK: UPDATED - Generate study sessions starting from the provided start date (current date)
  // const generateStudySessionsFromPlan = (content, startDate) => {
  //   const sessions = [];
   
  //   // Use the provided start date (when user requested the study plan)
  //   const studyStartDate = new Date(startDate);
   
  //   // Simple parsing - you can enhance this based on your AI response format
  //   const lines = content.split('\n');
  //   let dayOffset = 0;
   
  //   for (const line of lines) {
  //     if (line.includes('Day') || line.includes('day') || line.includes('Session') || line.includes('session')) {
  //       const sessionDate = new Date(studyStartDate);
  //       sessionDate.setDate(studyStartDate.getDate() + dayOffset);
       
  //       const session = {
  //         id: Date.now() + sessions.length,
  //         date: sessionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
  //         title: line.trim(),
  //         duration: '60 minutes', // Default duration
  //         completed: false,
  //         topic: line.trim()
  //       };
  //       sessions.push(session);
  //       dayOffset++;
  //     }
  //   }

  //   // If no specific sessions found, create a default one starting from current date
  //   if (sessions.length === 0) {
  //     sessions.push({
  //       id: Date.now(),
  //       date: studyStartDate.toISOString().split('T')[0],
  //       title: `Study ${chapterTitle}`,
  //       duration: '60 minutes',
  //       completed: false,
  //       topic: `Review ${chapterTitle} concepts`
  //     });
  //   }

  //   console.log('Generated study sessions starting from:', studyStartDate.toLocaleDateString(), sessions);
  //   return sessions;
  // };



  // MARK: UPDATED - Generate study sessions starting from the provided start date (current date)
const generateStudySessionsFromPlan = (content, startDate) => {
  const sessions = [];
 
  // Use the provided start date (when user requested the study plan)
  const studyStartDate = new Date(startDate);
 
  // Simple parsing - you can enhance this based on your AI response format
  const lines = content.split('\n');
  let dayOffset = 0; // Start from day 0 (today)
 
  for (const line of lines) {
    if (line.includes('Day') || line.includes('day') || line.includes('Session') || line.includes('session')) {
      const sessionDate = new Date(studyStartDate);
      sessionDate.setDate(studyStartDate.getDate() + dayOffset);
     
      const session = {
        id: Date.now() + sessions.length,
        date: sessionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        title: line.trim(),
        duration: '60 minutes', // Default duration
        completed: false,
        topic: line.trim()
      };
      sessions.push(session);
      dayOffset++; // Increment for next session
    }
  }

  // If no specific sessions found, create a default one starting from current date
  if (sessions.length === 0) {
    sessions.push({
      id: Date.now(),
      date: studyStartDate.toISOString().split('T')[0],
      title: `Study ${chapterTitle}`,
      duration: '60 minutes',
      completed: false,
      topic: `Review ${chapterTitle} concepts`
    });
  }

  console.log('Generated study sessions starting from:', studyStartDate.toLocaleDateString(), sessions);
  return sessions;
};

  // MARK: UPDATED - Enhanced notification creation with immediate dispatch and database save
  const createStudyPlanNotification = async (studyPlan) => {
    // Use database plan_id if available, otherwise use local ID
    const planIdForNotification = studyPlan.databasePlanId || studyPlan.id;
    const notificationId = `notif_${planIdForNotification}`;
   
    // Check if notification already exists in localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('studyNotifications') || '[]');
    const isDuplicateNotification = existingNotifications.some(notif => notif.id === notificationId);
   
    if (isDuplicateNotification) {
      console.log('Notification already exists, skipping duplicate');
      return;
    }

    const notification = {
      id: notificationId,
      type: 'study_plan_created',
      title: 'New Study Plan Created',
      message: `Study plan for ${studyPlan.title} has been added to your calendar starting from ${new Date(studyPlan.createdDate || Date.now()).toLocaleDateString()}`,
      date: new Date().toISOString(),
      read: false,
      planId: planIdForNotification.toString() // Use database plan_id if available
    };

    // Save to localStorage - check for duplicates before adding
    const isDuplicateInStorage = existingNotifications.some(notif => 
      notif.id === notificationId || 
      (notif.message === notification.message && notif.title === notification.title)
    );
    
    if (!isDuplicateInStorage) {
      const updatedNotifications = [notification, ...existingNotifications];
      localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifications));
    } else {
      console.log('⚠️ LessonPage - Duplicate notification found in localStorage, skipping add');
    }

    // Save to database
    try {
      const notificationData = {
        notification_type: 'study_plan_created',
        title: notification.title,
        message: notification.message,
        plan_id: notification.planId || null // Convert to string if needed
      };
      
      console.log('📤 LessonPage - Saving notification to database:', notificationData);
      console.log('📤 LessonPage - API endpoint:', API_CONFIG.DJANGO.NOTIFICATIONS.SAVE_STUDENT_NOTIFICATION);
      
      const response = await djangoAPI.post(API_CONFIG.DJANGO.NOTIFICATIONS.SAVE_STUDENT_NOTIFICATION, notificationData);
      
      console.log('📥 LessonPage - API response:', response);
      
      // Handle both success (201) and duplicate (200) responses
      if (response && (response.notification || response.message)) {
        if (response.message === 'Notification already exists') {
          console.log('⚠️ LessonPage - Notification already exists in database:', response.notification);
          // Update notification with existing database ID (don't add duplicate)
          if (response.notification && response.notification.notification_id) {
            notification.notificationId = response.notification.notification_id;
            // Update existing notification if found, otherwise don't add duplicate
            const existingIndex = existingNotifications.findIndex(n => 
              n.id === notificationId || 
              (n.message === notification.message && n.title === notification.title)
            );
            if (existingIndex >= 0) {
              const updatedNotifs = [...existingNotifications];
              updatedNotifs[existingIndex] = { ...updatedNotifs[existingIndex], notificationId: response.notification.notification_id };
              localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifs));
            } else {
              // Only add if not already in localStorage
              const updatedNotifs = [notification, ...existingNotifications];
              localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifs));
            }
          }
        } else {
          console.log('✅ LessonPage - Notification saved to database successfully:', response);
          // Update notification with database ID if available
          if (response.notification && response.notification.notification_id) {
            notification.notificationId = response.notification.notification_id;
            // Update localStorage - check if notification already exists
            const existingIndex = existingNotifications.findIndex(n => 
              n.id === notificationId || 
              (n.message === notification.message && n.title === notification.title)
            );
            if (existingIndex >= 0) {
              // Update existing notification
              const updatedNotifs = [...existingNotifications];
              updatedNotifs[existingIndex] = { ...updatedNotifs[existingIndex], notificationId: response.notification.notification_id };
              localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifs));
            } else {
              // Add new notification (shouldn't happen if we checked earlier, but just in case)
              const updatedNotifs = [notification, ...existingNotifications];
              localStorage.setItem('studyNotifications', JSON.stringify(updatedNotifs));
            }
          }
        }
      } else {
        console.warn('⚠️ LessonPage - Unexpected response format:', response);
      }
    } catch (error) {
      console.error('❌ LessonPage - Error saving notification to database:', error);
      console.error('❌ LessonPage - Error message:', error.message);
      console.error('❌ LessonPage - Error stack:', error.stack);
      // Fetch errors don't have .response, the error message contains the details
      console.error('❌ LessonPage - Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      // Continue even if database save fails - notification is in localStorage
    }

    // Enhanced event dispatch for immediate navbar update
    window.dispatchEvent(new CustomEvent('notificationAdded', {
      detail: { notification }
    }));
   
    // Additional event to force refresh
    window.dispatchEvent(new CustomEvent('refreshNotifications'));
   
    console.log('Notification created and events dispatched:', notification);
  };

  // MARK: UPDATED - Enhanced AI message handler to detect study plans and notes
  const handleAIMessageResponse = async (content, messageType, userMessage) => {
    const contentLower = content.toLowerCase();
    
    // Check if this is a study plan response - more comprehensive detection
    const isStudyPlan = messageType === 'study_plan' || 
                       contentLower.includes('study plan') ||
                       (contentLower.includes('day') && (contentLower.includes('study') || contentLower.includes('day 1') || contentLower.includes('day 2'))) ||
                       contentLower.includes('weekly plan') ||
                       contentLower.includes('daily schedule');
    
    if (isStudyPlan) {
      // Save the study plan to calendar and database
      try {
        console.log('📝 Detected study plan, saving to database...');
        const saved = await saveStudyPlanToCalendar(content);
        if (saved) {
          console.log('✅ Study plan saved to ai_study_plans table');
        } else {
          console.warn('⚠️ Study plan save returned false');
        }
      } catch (error) {
        console.error('❌ Error saving study plan:', error);
      }
    }
    
    // Check if this is a note response - more comprehensive detection
    const isNote = messageType === 'notes' || 
                   contentLower.includes('note') ||
                   contentLower.includes('summary') ||
                   contentLower.includes('key points') ||
                   contentLower.includes('important points') ||
                   contentLower.includes('takeaways') ||
                   (contentLower.includes('definition') && contentLower.includes('concept'));
    
    if (isNote && !isStudyPlan) { // Don't save study plans as notes
      try {
        console.log('📝 Detected AI note, saving to database...');
        const noteData = {
          class_name: `Class ${classNumber}`,
          subject: subject,
          chapter: chapterTitle,
          subtopic: subtopicName || '',
          note_title: `${subject} - ${chapterTitle}${subtopicName ? ` - ${subtopicName}` : ''} - AI Notes`,
          note_content: content,
          note_type: 'ai_generated'
        };
        await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_AI_NOTE, noteData);
        console.log('✅ AI note saved to ai_generated_notes table');
      } catch (error) {
        console.error('❌ Error saving AI note to database:', error);
      }
    }
    
    return content;
  };

  // Show toast message using React Toastify
  const showRewardToast = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const chapterKey = getChapterKey();
    const chapterDateKey = getChapterDateKey();
    const videoKey = getVideoKey();
   
    const storedDate = sessionStorage.getItem(chapterDateKey);
    const storedChances = sessionStorage.getItem(chapterKey);
   
    if (storedDate === today) {
      setRemainingChances(parseInt(storedChances) || 3);
    } else {
      setRemainingChances(3);
      sessionStorage.setItem(chapterKey, '3');
      sessionStorage.setItem(chapterDateKey, today);
    }

    // Check for video reward - check database first, then sessionStorage as fallback
    const checkVideoReward = async () => {
      try {
        const { checkVideoWatchingReward } = await import('../../utils/coinTracking');
        const rewardAlreadyGiven = await checkVideoWatchingReward(
          classNumber || 'Unknown',
          subject || 'Unknown',
          chapterNumber || 'Unknown',
          subtopicName || ''
        );
        
        if (rewardAlreadyGiven || sessionStorage.getItem(videoKey)) {
          setIsVideoCompleted(true);
          setChecklistStatus(prev => ({ ...prev, videoWatched: true }));
          setPointsAwarded(true);
        }
      } catch (error) {
        console.error('❌ Error checking video reward:', error);
        // Fallback to sessionStorage check
        if (sessionStorage.getItem(videoKey)) {
          setIsVideoCompleted(true);
          setChecklistStatus(prev => ({ ...prev, videoWatched: true }));
          setPointsAwarded(true);
        }
      }
    };
    
    checkVideoReward();

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

    // Load chat history
    const savedHistory = sessionStorage.getItem(getHistoryKey());
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, [classNumber, subject, chapterNumber, subtopicName]);

  // Monitor seeking on video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleSeeked = () => setSkipped(true);
      video.addEventListener('seeked', handleSeeked);
      return () => video.removeEventListener('seeked', handleSeeked);
    }
  }, []);

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

  // Overview generation effect
  useEffect(() => {
    if (activeTab === 'overview' && !overviewLoaded && !isGeneratingOverview) {
      generateOverview();
    }
  }, [activeTab, overviewLoaded]);

  // Coin animation effect
  useEffect(() => {
    const handleCoinAnimationEnd = (coinId) => {
      setCoins(prev => prev.filter(coin => coin.id !== coinId));
    };

    coins.forEach(coin => {
      if (coin.animationCompleted && !coin.pointsAdded) {
        // Add points to localStorage
        const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
        const newPoints = currentPoints + coin.value;
        localStorage.setItem('rewardPoints', newPoints.toString());
       
        // Dispatch event to update navbar
        window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
          detail: { rewardPoints: newPoints }
        }));
       
        // Mark coin as processed
        setCoins(prev => prev.map(c =>
          c.id === coin.id ? { ...c, pointsAdded: true } : c
        ));
       
        // Show toast message only once when all coins are processed
        const remainingCoins = coins.filter(c => !c.pointsAdded).length;
        if (remainingCoins === 1 && !toastShown) {
          setToastShown(true);
          if (subtopicName) {
            showRewardToast(`🎉 Congratulations! You earned 10 reward points for completing the subtopic: ${subtopicName}`);
          } else {
            showRewardToast(`🎉 Congratulations! You earned 10 reward points for completing the chapter: ${chapterTitle}`);
          }
        }
       
        // Remove coin after a delay
        setTimeout(() => {
          handleCoinAnimationEnd(coin.id);
        }, 300);
      }
    });
  }, [coins]);

  const currentLesson = {
    title: chapterTitle,
    subtopic: subtopicName,
    file: `/videos/class7/maths/MicrosoftTeams-video.mp4`,
    pdf: `/pdfs/${subject}/chapter-${chapterNumber}.pdf`,
    about: `Learn about ${subject} concepts in ${chapterTitle}${subtopicName ? ` - ${subtopicName}` : ''}. This ${subtopicName ? 'subtopic' : 'chapter'} covers important topics that will help you build a strong foundation.`
  };

  const checklistItems = [
    { id: 1, task: `Watch full video of ${currentLesson.title}${subtopicName ? ` - ${subtopicName}` : ''}`, status: checklistStatus.videoWatched ? "completed" : "in-progress" },
    { id: 2, task: "Attempt practice quiz", status: checklistStatus.practiceAttempted ? "completed" : "pending" },
  ];

  const practiceQuestions = [
    { id: 1, question: `Practice questions for ${currentLesson.title}${subtopicName ? ` - ${subtopicName}` : ''}` },
  ];

  const createCoinAnimation = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoRect = videoElement.getBoundingClientRect();
   
    // Create multiple coins for better visual effect
    const newCoins = Array.from({ length: 5 }, (_, index) => ({
      id: Date.now() + index,
      startX: videoRect.left + videoRect.width / 2,
      startY: videoRect.top + videoRect.height / 2,
      endX: window.innerWidth - 100,
      endY: 50,
      value: 2,
      delay: index * 100,
      animationCompleted: false,
      pointsAdded: false
    }));

    setCoins(prev => [...prev, ...newCoins]);
    setToastShown(false);
  };

  const handleVideoEnd = async () => {
    setIsVideoCompleted(true);
    const videoKey = getVideoKey();
   
    // Only award coins if video wasn't skipped and reward hasn't been given
    if (!skipped && !pointsAwarded) {
      try {
        // Check database if reward was already given for this video
        const { checkVideoWatchingReward, addCoinsForVideoWatching } = await import('../../utils/coinTracking');
        
        const rewardAlreadyGiven = await checkVideoWatchingReward(
          classNumber || 'Unknown',
          subject || 'Unknown',
          chapterNumber || 'Unknown',
          subtopicName || ''
        );
        
        if (!rewardAlreadyGiven) {
          console.log('💰 Adding video watching reward (10 coins)...');
          // Add coins to database for video watching
          const coinResult = await addCoinsForVideoWatching(
            classNumber || 'Unknown',
            subject || 'Unknown',
            chapterNumber || 'Unknown',
            subtopicName || ''
          );
          
          if (coinResult && coinResult.balance) {
            // Update localStorage with database balance (source of truth)
            const newBalance = coinResult.balance.total_coins || 0;
            localStorage.setItem('rewardPoints', newBalance.toString());
            
            // Dispatch event to sync across components
            window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
              detail: { rewardPoints: newBalance }
            }));
            
            // Mark as awarded and create coin animation
            setPointsAwarded(true);
            createCoinAnimation();
            
            // Also store in sessionStorage for UI state
            sessionStorage.setItem(videoKey, 'true');
            
            console.log('✅ Video watching reward awarded successfully (from database):', newBalance, 'coins');
          } else {
            console.error('❌ Invalid coin result from database:', coinResult);
            // Still mark as completed even if coin award fails
            setPointsAwarded(true);
            sessionStorage.setItem(videoKey, 'true');
          }
        } else {
          console.log('ℹ️ Video watching reward already given (checked from database)');
          // Mark as awarded even if reward was already given
          setPointsAwarded(true);
          sessionStorage.setItem(videoKey, 'true');
        }
      } catch (error) {
        console.error('❌ Error checking/awarding video watching reward:', error);
        // Still mark as completed even if coin operation fails
        setPointsAwarded(true);
        sessionStorage.setItem(videoKey, 'true');
      }
    }
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

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT, {
        class_level: `Class ${classNumber}`,
        subject: subject,
        chapter: currentLesson.title,
        student_question: userInput,
        chat_history: chatMessages
      });

      if (data.success) {
        // Process the AI response (this will save study plans and notes to their respective tables)
        const processedContent = await handleAIMessageResponse(data.response, data.type, userMessage);
       
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: processedContent,
          messageType: data.type,
          timestamp: new Date().toLocaleTimeString()
        };
        
        // Update state first
        setChatMessages(prev => {
          const newMessages = [...prev, aiMessage];
          return newMessages;
        });
        
        const historyEntry = {
          id: Date.now(),
          userMessage: userMessage.content,
          aiResponse: aiMessage.content,
          timestamp: new Date().toLocaleString()
        };
        const updatedHistory = [historyEntry, ...chatHistory];
        setChatHistory(updatedHistory);
        sessionStorage.setItem(getHistoryKey(), JSON.stringify(updatedHistory));
        
        // Always save chat message to ai_chat_history table (for ALL AI responses)
        try {
          const chatData = {
            class_name: `Class ${classNumber}`,
            subject: subject,
            chapter: chapterTitle,
            subtopic: subtopicName || '',
            user_message: userMessage.content,
            ai_response: aiMessage.content,
            response_type: data.type || 'general'
          };
          await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_CHAT_MESSAGE, chatData);
          console.log('✅ Chat message saved to ai_chat_history table');
        } catch (error) {
          console.error('❌ Error saving chat message to ai_chat_history:', error);
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
      study_plan: `Can you create a study plan with topics for ${currentLesson.title}${topicText} in ${subject}?`,
      notes: `Please provide comprehensive notes on ${currentLesson.title}${topicText} in ${subject}`,
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

  const deleteNote = (id) => {
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
  };

  const updateNoteContent = (id, content) => {
    setStickyNotes(prev => prev.map(note =>
      note.id === id ? { ...note, content, timestamp: new Date().toLocaleString() } : note
    ));
  };

  const saveNote = async () => {
    sessionStorage.setItem(getNotesKey(), JSON.stringify(stickyNotes));
    
    // Save manual notes to backend database
    try {
      const activeNoteToSave = stickyNotes.find(note => note.id === activeNoteId);
      if (activeNoteToSave && activeNoteToSave.content.trim()) {
        const noteData = {
          class_name: `Class ${classNumber}`,
          subject: subject,
          chapter: chapterTitle,
          subtopic: subtopicName || '',
          note_title: activeNoteToSave.content.substring(0, 200) || 'Manual Note',
          note_content: activeNoteToSave.content,
          note_type: 'manual',
          color: activeNoteToSave.color || '#fef3c7',
          is_important: false
        };
        await djangoAPI.post(API_CONFIG.DJANGO.AI_ASSISTANT.SAVE_MANUAL_NOTE, noteData);
        console.log('✅ Manual note saved to database');
      }
    } catch (error) {
      console.error('❌ Error saving manual note to database:', error);
      // Continue even if database save fails
    }
    
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
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

  const generateOverview = async () => {
    setIsGeneratingOverview(true);
    try {
      const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_OVERVIEW, {
        class_level: `Class ${classNumber}`,
        subject: subject,
        chapter: currentLesson.title,
        specific_topic: currentLesson.subtopic || null
      });
     
      if (data.success) {
        setOverviewContent(data.overview);
        setOverviewLoaded(true);
      } else {
        setOverviewContent(`
📖 ${currentLesson.title.toUpperCase()}${currentLesson.subtopic ? ` - ${currentLesson.subtopic.toUpperCase()}` : ''} - TOPIC OVERVIEW
══════════════════════════════════════════

🎯 QUICK SUMMARY:
• Main Focus: ${currentLesson.title}${currentLesson.subtopic ? ` focusing on ${currentLesson.subtopic}` : ''}
• Key Learning: Understanding core concepts and applications
• Real-world Connection: Practical applications in daily life

🔍 WHAT YOU'LL LEARN:
────────────────────

📚 Core Concepts:
• Fundamental principles and theories
• Key definitions and terminology
• Important relationships and patterns

🛠️ Important Skills:
• Problem-solving techniques
• Analytical thinking
• Application of concepts

💡 KEY TAKEAWAYS:
• Solid understanding of the topic
• Ability to apply knowledge
• Foundation for future learning

🌟 WHY THIS MATTERS:
• Builds essential knowledge for academic success
• Develops critical thinking skills
• Prepares for advanced topics

📝 STUDY TIPS:
• Review concepts regularly
• Practice with examples
• Ask questions when unsure
        `);
        setOverviewLoaded(true);
      }
    } catch (error) {
      console.error('Error generating overview:', error);
      setOverviewContent(`
📖 ${currentLesson.title.toUpperCase()} - OVERVIEW
══════════════════════════

This chapter covers important concepts in ${subject} that will help you build a strong foundation.

Key areas include:
• Understanding basic principles
• Learning practical applications
• Developing problem-solving skills

Study this chapter carefully to master the concepts!
      `);
      setOverviewLoaded(true);
    } finally {
      setIsGeneratingOverview(false);
    }
  };

  const formatOverview = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('📖') || line.startsWith('🎯') || line.startsWith('🔍') ||
          line.startsWith('📚') || line.startsWith('🛠️') || line.startsWith('💡') ||
          line.startsWith('🌟') || line.startsWith('📝')) {
        return <h4 key={index} className="overview-section-heading" style={{
          color: '#0f766e',
          margin: '16px 0 8px 0',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>{line}</h4>;
      } else if (line.includes('════')) {
        return <hr key={index} style={{ border: 'none', borderTop: '2px solid #0f766e', margin: '12px 0' }} />;
      } else if (line.startsWith('•')) {
        return <div key={index} className="overview-list-item" style={{
          margin: '6px 0',
          paddingLeft: '20px',
          fontSize: '14px',
          color: '#4b5563',
          lineHeight: '1.5',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <span style={{ color: '#0f766e', flexShrink: 0 }}>•</span>
          <span>{line.replace('•', '').trim()}</span>
        </div>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <div key={index} className="overview-text" style={{
          fontSize: '14px',
          color: '#4b5563',
          lineHeight: '1.5',
          margin: '8px 0'
        }}>{line}</div>;
      }
    });
  };

  const demoQuestions = [
    {
      question: `What is the main topic covered in ${currentLesson.title}${subtopicName ? ` - ${subtopicName}` : ''}?`,
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
          @keyframes coinFly {
            0% {
              transform: translate(0, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate(var(--end-x), var(--end-y)) scale(0.3) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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

          .overview-section-heading {
            color: #0f766e;
            margin: 16px 0 8px 0;
            fontSize: 16px;
            fontWeight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }
         
          .overview-list-item {
            margin: 6px 0;
            paddingLeft: 20px;
            fontSize: 14px;
            color: '#4b5563';
            lineHeight: 1.5;
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }
         
          .overview-text {
            fontSize: 14px;
            color: '#4b5563';
            lineHeight: 1.5;
            margin: 8px 0;
          }

          video::-webkit-media-controls-download-button {
            display: none;
          }
          video {
            controlsList: "nodownload";
          }

          .coin {
            position: fixed;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: #744210;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(255, 193, 7, 0.6);
            border: 2px solid #FFC107;
            animation: coinFly 1.5s ease-in-out forwards;
          }

          .coin-inner {
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #FFA500, #FFD700);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
     
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
     
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="coin"
          style={{
            '--end-x': `${coin.endX - coin.startX}px`,
            '--end-y': `${coin.endY - coin.startY}px`,
            left: `${coin.startX}px`,
            top: `${coin.startY}px`,
            animationDelay: `${coin.delay}ms`
          }}
          onAnimationEnd={() => {
            setCoins(prev => prev.map(c =>
              c.id === coin.id ? { ...c, animationCompleted: true } : c
            ));
          }}
        >
          <div className="coin-inner">
            <Coins size={10} color="#744210" />
          </div>
        </div>
      ))}
     
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '110px 32px 20px 32px',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center',
          marginTop: '0'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            {subject} • {currentLesson.title}
          </h1>
          {currentLesson.subtopic && (
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>
              Topic: {currentLesson.subtopic}
            </div>
          )}
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
              {pointsAwarded && (
                <span style={{
                  fontSize: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginLeft: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Coins size={12} />
                  Rewarded
                </span>
              )}
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '0',
              paddingBottom: '56.25%',
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
            {!pointsAwarded && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#f0fdfa',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Coins size={14} />
                Complete this video to earn 10 reward points!
              </div>
            )}
          </div>

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

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0 0 12px 12px',
            padding: '20px',
            minHeight: '400px'
          }}>
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    📘 {currentLesson.subtopic ? 'Topic Overview' : 'Chapter Overview'}
                  </h3>
                  <button
                    onClick={generateOverview}
                    disabled={isGeneratingOverview}
                    style={{
                      background: '#0f766e',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: isGeneratingOverview ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: isGeneratingOverview ? 0.6 : 1
                    }}
                  >
                    {isGeneratingOverview ? (
                      <>
                        <div style={{ width: '12px', height: '12px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        Refresh Overview
                      </>
                    )}
                  </button>
                </div>

                {isGeneratingOverview && !overviewContent ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid #f1f5f9',
                      borderTop: '3px solid #0f766e',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 16px auto'
                    }}></div>
                    <p style={{ margin: 0, fontSize: '14px' }}>Generating comprehensive overview...</p>
                  </div>
                ) : overviewContent ? (
                  <div style={{
                    backgroundColor: '#fafbfc',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {formatOverview(overviewContent)}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <FileText size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                      Overview not generated yet
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      Click "Refresh Overview" to generate a comprehensive overview of this {currentLesson.subtopic ? 'topic' : 'chapter'}.
                    </p>
                  </div>
                )}

                {!pointsAwarded && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fcd34d',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Coins size={20} />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        Complete the video to earn 10 reward points!
                      </div>
                      <div style={{ fontSize: '13px', opacity: 0.8 }}>
                        Watch the entire video without skipping to earn your reward.
                      </div>
                    </div>
                  </div>
                )}

                {pointsAwarded && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#f0fdfa',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Coins size={20} />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        🎉 Reward Earned!
                      </div>
                      <div style={{ fontSize: '13px', opacity: 0.8 }}>
                        You've earned 10 reward points for completing this {currentLesson.subtopic ? 'topic' : 'chapter'}!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                {pointsAwarded && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f0fdfa',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Coins size={16} />
                    🎉 You earned 10 reward points for completing this {subtopicName ? 'subtopic' : 'chapter'}!
                  </div>
                )}
              </div>
            )}

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