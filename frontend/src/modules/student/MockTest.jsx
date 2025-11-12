
import { useState, useEffect } from "react";
import './MockTest.css';
import Navbar from "./Navbarrr";
import { useQuiz } from "./QuizContext";
import { useNavigate } from "react-router-dom";
import { submitQuizAttempt, calculateQuizStats } from "../../utils/quizTracking";
import { API_CONFIG, fastAPI } from "../../config/api";

function MockTest() {
  const { updateMockTestResults } = useQuiz();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [mockTestStartTime, setMockTestStartTime] = useState(null);

  const classIcons = ["🏫", "📚", "🎓", "💼", "🔬", "📊"];
  const subjectIcons = ["📖", "🧮", "🔭", "🧪", "🌍", "📜", "💻", "🎨"];
  const chapterIcons = ["📝", "🔍", "💡", "⚡", "🌟", "🎯", "📊", "🔬"];

  // Hide chatbot widget
  useEffect(() => {
    const chatWidget = document.querySelector('iframe[src*="tawk"], iframe[src*="crisp"], iframe[src*="chat"], iframe[src*="bot"], iframe[src*="dialogflow"]');
    if (chatWidget) {
      chatWidget.style.display = "none";
    }

    const chatButton = document.querySelector('div[style*="z-index"][style*="bottom"][style*="right"]');
    if (chatButton && chatButton.querySelector("svg, img")) {
      chatButton.style.display = "none";
    }

    return () => {
      if (chatWidget) {
        chatWidget.style.display = "block";
      }
      if (chatButton) {
        chatButton.style.display = "block";
      }
    };
  }, []);

  // Fetch classes
  useEffect(() => {
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GET_CLASSES)
      .then(data => setClasses(data.classes || []))
      .catch(() => setError("Failed to load classes"));
  }, []);

  // Handle visibility change
  useEffect(() => {
    if (!quiz.length || isFinished || showInstructions) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setIsFinished(true);
            const passed = score > 20;
            setIsPassed(passed);
            // UPDATED: Pass class, subject, chapter to updateMockTestResults
            updateMockTestResults(score, quiz.length, selectedClass, selectedSubject, selectedChapter);
            exitFullScreen();
            setShowWarning(false);
            return newCount;
          } else {
            setShowWarning(true);
            return newCount;
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quiz, isFinished, showInstructions, score, updateMockTestResults, selectedClass, selectedSubject, selectedChapter]);

  // Handle full-screen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.mozFullScreenElement || !!document.msFullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);

      if (!isCurrentlyFullScreen && quiz.length > 0 && !isFinished && !showInstructions) {
        setWarningCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setIsFinished(true);
            const passed = score > 20;
            setIsPassed(passed);
            // UPDATED: Pass class, subject, chapter to updateMockTestResults
            updateMockTestResults(score, quiz.length, selectedClass, selectedSubject, selectedChapter);
            exitFullScreen();
            setShowWarning(false);
            return newCount;
          } else {
            setShowWarning(true);
            enterFullScreen();
            return newCount;
          }
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, [quiz, isFinished, showInstructions, score, updateMockTestResults, selectedClass, selectedSubject, selectedChapter]);

  // Auto-hide warning
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  // Timer for quiz
  useEffect(() => {
    if (quiz.length > 0 && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsFinished(true);
            const passed = score > 20;
            setIsPassed(passed);
            // UPDATED: Pass class, subject, chapter to updateMockTestResults
            updateMockTestResults(score, quiz.length, selectedClass, selectedSubject, selectedChapter);
            exitFullScreen();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, isFinished, timeLeft, score, updateMockTestResults, selectedClass, selectedSubject, selectedChapter]);

  const fetchSubjects = (className) => {
    setLoading(true);
    setError(null);
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GET_SUBJECTS(className))
      .then(data => {
        setSubjects(data.subjects || []);
        setChapters([]);
        setSelectedSubject(null);
        setSelectedChapter(null);
        setQuiz([]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load subjects: " + err.message);
        setLoading(false);
      });
  };

  const fetchChapters = (className, subject) => {
    setLoading(true);
    setError(null);
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GET_CHAPTERS(className, subject))
      .then(data => {
        const chaptersData = Array.isArray(data.chapters) ? data.chapters : [];
        setChapters(chaptersData);
        setSelectedChapter(null);
        setQuiz([]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load chapters: " + err.message);
        setChapters([]);
        setLoading(false);
      });
  };

  const fetchMockTest = (chapter, difficulty = "normal", retry = false) => {
    setLoading(true);
    setError(null);
    setShowInstructions(false);
    setTimeLeft(20 * 60);
    setSkippedQuestions([]);
    setUserAnswers(Array(50).fill(null));
    setMockTestStartTime(Date.now()); // Start timing the mock test
    
    const params = {
      class_name: selectedClass,
      subject: selectedSubject,
      chapter: chapter,
      difficulty: difficulty,
      retry: retry,
      language: selectedLanguage,
      num_questions: 50
    };
    
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GENERATE_TEST(params))
      .then(data => {
        console.log("🔍 Debug - Mock test response received:", data);
        let questions = [];
        
        if (Array.isArray(data)) {
          questions = data;
          console.log("🔍 Debug - Using data as array, length:", questions.length);
        } else if (data && Array.isArray(data.questions)) {
          questions = data.questions;
          console.log("🔍 Debug - Using data.questions, length:", questions.length);
        } else if (data && Array.isArray(data.quiz)) {
          questions = data.quiz;
          console.log("🔍 Debug - Using data.quiz, length:", questions.length);
        } else if (data && data.questions) {
          questions = Object.values(data.questions);
          console.log("🔍 Debug - Using Object.values(data.questions), length:", questions.length);
        } else {
          console.log("🔍 Debug - Invalid response format:", data);
          throw new Error("Invalid response format: " + JSON.stringify(data));
        }
        
        console.log("🔍 Debug - Final questions array length:", questions.length);
        if (questions.length === 0) {
          throw new Error("No questions received from server");
        }

        const validQuestions = questions
          .filter(q => q && q.question && q.answer && q.options)
          .map((q, index) => ({
            id: index,
            question: q.question.trim(),
            options: q.options,
            answer: q.answer
          }))
          .slice(0, 50);

        while (validQuestions.length < 50) {
          validQuestions.push({
            id: validQuestions.length,
            question: `Placeholder Question ${validQuestions.length + 1}`,
            options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
            answer: "A"
          });
        }

        setQuiz(validQuestions);
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setIsFinished(false);
        setIsPassed(false);
        setShowAnswer(false);
        setShowReviewPopup(false);
        setWarningCount(0);
        setShowWarning(false);
        setShowAnswerKey(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load mock test: " + err.message);
        setLoading(false);
        setQuiz([]);
        setShowInstructions(true);
      });
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSubjects([]);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
    fetchSubjects(className);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
    fetchChapters(selectedClass, subject);
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setShowInstructions(true);
  };

  const startQuiz = () => {
    setShowInstructions(false);
    if (quiz.length === 0) {
      fetchMockTest(selectedChapter);
      enterFullScreen();
    }
  };

  const handleAnswer = (label) => {
    setSelected(label);
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQ] = label;
    setUserAnswers(newUserAnswers);

    const newSkipped = skippedQuestions.filter(q => q !== currentQ);
    setSkippedQuestions(newSkipped);

    if (label === quiz[currentQ]?.answer) {
      setScore(score + 1);
    }
  };


  const nextQuestion = async () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(userAnswers[currentQ + 1] || null);
      setShowAnswer(false);
      setShowAnswerKey(false);
    } else {
      const passed = score > 20;
      setIsPassed(passed);
      setIsFinished(true);
      
      try {
        // Calculate mock test statistics
        const quizStats = calculateQuizStats(quiz, userAnswers);
        const timeTakenSeconds = Math.floor((Date.now() - mockTestStartTime) / 1000);
        
        // Prepare mock test data for submission
        const mockTestData = {
          quizType: 'mock_test',
          subject: selectedSubject || 'Unknown',
          chapter: selectedChapter || 'Unknown',
          topic: selectedChapter || 'Unknown', // Using chapter as topic
          subtopic: `${selectedSubject || 'Unknown'} - ${selectedChapter || 'Unknown'}`,
          className: selectedClass || 'Unknown',
          difficultyLevel: 'medium', // Mock tests are typically medium difficulty
          language: selectedLanguage || 'English',
          totalQuestions: quizStats.totalQuestions || 0,
          correctAnswers: quizStats.correctAnswers || 0,
          wrongAnswers: quizStats.wrongAnswers || 0,
          unansweredQuestions: quizStats.unansweredQuestions || 0,
          timeTakenSeconds: timeTakenSeconds || 0,
          score: quizStats.score || 0,
          quizQuestions: quiz || [], // Send actual quiz data
          userAnswers: (userAnswers || []).filter(answer => answer !== null) // Filter out null answers
        };
        
        // Submit to backend
        console.log('📤 Submitting mock test attempt to backend...', mockTestData);
        console.log('🔍 Debug - User token exists:', !!localStorage.getItem('userToken'));
        console.log('🔍 Debug - Token preview:', localStorage.getItem('userToken') ? localStorage.getItem('userToken').substring(0, 50) + '...' : 'No token');
        
        const submitResponse = await submitQuizAttempt(mockTestData);
        console.log('✅ Mock test attempt submitted successfully!', submitResponse);
        
        // Update local mock test results (existing functionality)
        updateMockTestResults(score, quiz.length, selectedClass, selectedSubject, selectedChapter);
        
      } catch (error) {
        console.error('❌ Error submitting mock test attempt:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Stack trace:', error.stack);
        console.error('❌ Error response:', error.response?.data);
        console.error('❌ Error status:', error.response?.status);
        
        // Still update local results even if backend submission fails
        updateMockTestResults(score, quiz.length, selectedClass, selectedSubject, selectedChapter);
        
        // Show more specific error to user
        const errorMessage = error.response?.status === 401 
          ? 'Authentication failed. Please log in again.'
          : error.response?.status === 403
          ? 'Access denied. Please check your permissions.'
          : error.response?.status >= 500
          ? 'Server error. Please try again later.'
          : 'Warning: Mock test results saved locally, but could not sync to server. Please check your connection.';
        
        alert(errorMessage);
      } finally {
        exitFullScreen();
      }
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(userAnswers[currentQ - 1] || null);
      setShowAnswer(false);
      setShowAnswerKey(false);
    }
  };

  const skipQuestion = () => {
    const newSkipped = [...skippedQuestions];
    if (!newSkipped.includes(currentQ)) {
      newSkipped.push(currentQ);
      setSkippedQuestions(newSkipped);
    }
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQ] = null;
    setUserAnswers(newUserAnswers);
    setSelected(null);
    
    nextQuestion();
  };

  const goToQuestion = (index) => {
    setCurrentQ(index);
    setSelected(userAnswers[index] || null);
    setShowAnswer(false);
    setShowAnswerKey(false);
  };

  const retryQuiz = () => {
    setWarningCount(0);
    setShowWarning(false);
    fetchMockTest(selectedChapter, "normal", true);
    enterFullScreen();
  };

  const nextLevel = () => {
    if (isPassed) {
      setWarningCount(0);
      setShowWarning(false);
      fetchMockTest(selectedChapter, "hard");
      enterFullScreen();
    }
  };

  const backToChapters = () => {
    setSelectedChapter(null);
    setQuiz([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
    setIsPassed(false);
    setShowAnswer(false);
    setUserAnswers([]);
    setShowInstructions(true);
    setShowReviewPopup(false);
    setWarningCount(0);
    setShowWarning(false);
    setShowAnswerKey(false);
    exitFullScreen();
  };

  const backToSubjects = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
  };

  const backToClasses = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSubjects([]);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
  };

  const backToPractice = () => {
    navigate('/practice');
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestfullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleReviewPopup = () => {
    setShowReviewPopup(!showReviewPopup);
  };


  const getBackButtonConfig = () => {
    if (quiz.length > 0 && !isFinished && !showInstructions) {
        return null;
    }
    
    if (selectedSubject && !selectedChapter) {
        return {
            text: "Back to Subjects",
            action: backToSubjects
        };
    }
    
    if (selectedClass && !selectedSubject) {
        return {
            text: "Back to Classes",
            action: backToClasses
        };
    }
    
    if (!selectedClass) {
        return {
            text: "Back to Practice",
            action: backToPractice
        };
    }
  };

  const backButtonConfig = getBackButtonConfig();

  if (loading) return (
    <div className="loading-container">
      <div className="edu-loader">
        <span role="img" aria-label="book" className="edu-icon">📚</span>
        <span role="img" aria-label="graduation" className="edu-icon">🎓</span>
        <span role="img" aria-label="lightbulb" className="edu-icon">💡</span>
      </div>
      <p>Preparing your test in {selectedLanguage}...</p>
    </div>
  );

  return (
    <>
      <Navbar isFullScreen={isFullScreen && quiz.length > 0 && !showInstructions} />
      
      {!isFullScreen && backButtonConfig && (
        <div className="navbar-back-wrapper">
          <div className="navbar-back-container">
            <button 
              className="navbar-back-button"
              onClick={backButtonConfig.action}
            >
              <span className="back-arrow">←</span>
              {backButtonConfig.text}
            </button>
          </div>
        </div>
      )}
      
      {error && !showInstructions && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}
      {showWarning && !isFinished && (
        <div className="warning-container">
          <div className="warning-icon">⚠️</div>
          <p>
            Warning {warningCount} of 3: Please stay on the test tab or in full-screen mode. The test will end after 3 warnings.
          </p>
        </div>
      )}
      {!selectedClass && !error && (
        <div className="selection-container">
          <div className="header">
            <h2>Select Your Class</h2>
            <p>Choose your academic level to begin</p>
          </div>
          <div className="cards-grid">
            {classes.map((cl, i) => (
              <div 
                key={i} 
                className="selection-card"
                onClick={() => handleClassClick(cl)}
              >
                <div className="card-icon">{classIcons[i % classIcons.length]}</div>
                <h3>{cl}</h3>
                <p>Start your learning journey</p>
                <div className="card-hover"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!selectedSubject && selectedClass && !error && (
        <div className="selection-container">
          <div className="header">
            <h2>Select Subject</h2>
            <p>Choose a subject for {selectedClass}</p>
          </div>
          <div className="cards-grid">
            {subjects.map((sub, i) => (
              <div 
                key={i} 
                className="selection-card subject-card"
                onClick={() => handleSubjectClick(sub)}
              >
                <div className="card-icon">{subjectIcons[i % subjectIcons.length]}</div>
                <h3>{sub}</h3>
                <p>Explore chapters and topics</p>
                <div className="card-hover"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!selectedChapter && selectedSubject && !error && (
        <div className="selection-container chapter-select">
          <div className="header">
            <h2>Select Chapter</h2>
            <p>Choose a chapter from {selectedSubject}</p>
          </div>
          <div className="cards-grid">
            {Array.isArray(chapters) && chapters.map((chap, i) => (
              <div 
                key={i} 
                className={`selection-card chapter-card ${selectedChapter === chap ? 'selected' : ''}`}
                onClick={() => handleChapterClick(chap)}
              >
                <div className="card-icon">{chapterIcons[i % chapterIcons.length]}</div>
                <h3>{chap}</h3>
                <p>{selectedChapter === chap ? 'Selected' : 'Click to select'}</p>
                <div className="card-hover"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(quiz.length === 0 || showInstructions) && !error && selectedChapter && (
        <div className="instructions-container">
          <div className="instructions-card">
            <div className="instructions-icon">📋</div>
            <h2>Mock Test Instructions</h2>

            <div className="instructions-content">
              <div className="instruction-item">
                <span className="instruction-icon">⏱️</span>
                <div>
                  <h3>Time Limit</h3>
                  <p>20 minutes for 50 questions</p>
                </div>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">❓</span>
                <div>
                  <h3>Question Format</h3>
                  <p>Multiple choice questions with 4 options each</p>
                </div>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">📊</span>
                <div>
                  <h3>Passing Criteria</h3>
                  <p>Score more than 20 to pass and unlock next level</p>
                </div>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">⏭️</span>
                <div>
                  <h3>Skipping Questions</h3>
                  <p>You can skip questions and come back to them later</p>
                </div>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">📝</span>
                <div>
                  <h3>Scoring</h3>
                  <p>1 point for each correct answer. No negative marking.</p>
                </div>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">🔑</span>
                <div>
                  <h3>Answer Key</h3>
                  <p>Click the 'Show Answer Key' button to reveal the correct answer for any question</p>
                </div>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">🌐</span>
                <div>
                  <h3>Language</h3>
                  <p>Questions will be generated in your selected language</p>
                </div>
              </div>
            </div>

            <div className="test-details">
              <h3>Test Details:</h3>
              <p><strong>Class:</strong> {selectedClass}</p>
              <p><strong>Subject:</strong> {selectedSubject}</p>
              <p><strong>Chapter:</strong> {selectedChapter}</p>
              <p><strong>Total Questions:</strong> 50</p>
              <p><strong>Passing Score:</strong> 21/50 or more</p>
              <p><strong>Language:</strong> {selectedLanguage}</p>
            </div>

            <div className="language-select">
              <label htmlFor="language" style={{ fontWeight: '600', marginRight: '8px', fontSize: '16px' }}>
                🌐 Select Language:
              </label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-dropdown"
                style={{
                  padding: '10px 15px',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '2px solid #007bff',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '180px',
                  fontWeight: '500'
                }}
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Malayalam">മലയാളം (Malayalam)</option>
              </select>
            </div>

            <div className="instructions-actions">
              <button className="back-button" onClick={backToChapters}>
                ← Back to Chapters
              </button>
              <button className="start-quiz-btn" onClick={startQuiz}>
                Start Test Now
              </button>
            </div>
          </div>
        </div>
      )}

      {isFinished && !error && (
        <div className={`finished-container ${isFullScreen ? "fullscreen-mode" : ""}`}>
          <div className="result-card">
            <div className={`result-icon ${isPassed ? 'pass' : 'fail'}`}>
              {isPassed ? '🎉' : '😔'}
            </div>
            <h2>{isPassed ? 'Congratulations! You Passed!' : 'Quiz Completed - Try Again'}</h2>
            
            <div className={`status-badge ${isPassed ? 'pass-badge' : 'fail-badge'}`}>
              {isPassed ? 'PASS' : 'FAIL'}
            </div>
            
            <div className="score-display">
              <div className={`score-circle ${isPassed ? 'pass-score' : 'fail-score'}`}>
                <span className="score">{score}</span>
                <span className="total">/{quiz.length}</span>
              </div>
              <p>{Math.round((score / quiz.length) * 100)}% Correct</p>
              <p className={`pass-fail-text ${isPassed ? 'pass-text' : 'fail-text'}`}>
                {isPassed 
                  ? `You scored ${score} which is greater than 20. You are eligible for next level!` 
                  : `You scored ${score} which is less than or equal to 20. Please retry the same level.`}
              </p>
              <p className="language-info">Test taken in: <strong>{selectedLanguage}</strong></p>
            </div>
            
            <div className="time-result">
              <p>Time Taken: {formatTime(20 * 60 - timeLeft)}</p>
            </div>
            
            <div className="result-actions">
              <button className="review-btn" onClick={toggleReviewPopup}>
                📋 Review Questions & Answers
              </button>
              <button className="retry-btn" onClick={retryQuiz}>
                🔄 Retry Same Level
              </button>
              {isPassed && (
                <button className="next-btn" onClick={nextLevel}>
                  🚀 Next Level
                </button>
              )}
              <button className="chapters-btn" onClick={backToChapters}>
                📚 Back to Chapters
              </button>
            </div>
            
            <div className="answers-section">
              <h3>Quick Review:</h3>
              <div className="answers-grid">
                {quiz.slice(0, 10).map((q, i) => (
                  <div key={i} className={`answer-item ${userAnswers[i] === q.answer ? 'correct' : 'incorrect'}`}>
                    <span className="q-number">Q{i + 1}</span>
                    <span className="correct-answer">{q.answer}</span>
                    <span className="user-answer">{userAnswers[i] || 'Skipped'}</span>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" onClick={toggleReviewPopup}>
                View All Questions & Answers
              </button>
            </div>
          </div>
        </div>
      )}
      {quiz.length > 0 && !isFinished && !showInstructions && !error && (
        <div className={`quiz-container ${isFullScreen ? "fullscreen-mode" : ""}`}>
          <div className="quiz-header">
            <div className="quiz-info">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${((currentQ + 1) / quiz.length) * 100}%`}}
                ></div>
              </div>
              <div className="quiz-stats">
                <span>Question {currentQ + 1} of {quiz.length}</span>
                <span className="timer">⏱️ {formatTime(timeLeft)}</span>
                <span className="language-badge">🌐 {selectedLanguage}</span>
              </div>
            </div>
            
          </div>
          <div className="question-nav">
            {quiz.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentQ ? 'active' : ''} ${
                  userAnswers[index] ? 'answered' : ''
                } ${skippedQuestions.includes(index) ? 'skipped' : ''}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="question-section">
            <h3 className="question">{currentQ + 1}. {quiz[currentQ].question}</h3>
            <div className="options-grid">
              {quiz[currentQ].options && Object.entries(quiz[currentQ].options).map(([label, opt]) => (
                <button
                  key={label}
                  className={`option-card ${
                    selected === label ? 'selected' : ''
                  } ${showAnswer || showAnswerKey ? (label === quiz[currentQ].answer ? 'correct-answer' : '') : ''}`}
                  onClick={() => handleAnswer(label)}
                  disabled={showAnswer}
                >
                  <span className="option-label">{label}</span>
                  <span className="option-text">{opt}</span>
                  {(showAnswer || showAnswerKey) && label === quiz[currentQ].answer && (
                    <span className="correct-indicator">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="quiz-navigation">
            <button 
              className="nav-btn prev-btn" 
              onClick={prevQuestion}
              disabled={currentQ === 0}
            >
              ← Previous
            </button>
            <button 
              className="nav-btn skip-btn" 
              onClick={skipQuestion}
            >
              Skip →
            </button>
            <button 
              className="nav-btn next-btn" 
              onClick={nextQuestion}
            >
              {currentQ < quiz.length - 1 ? 'Next →' : 'Finish'}
            </button>
          </div>
        </div>
      )}
      {showReviewPopup && (
        <div className="popup-overlay">
          <div className="review-popup">
            <div className="popup-header">
              <h2>Questions & Answers Review</h2>
              <button className="close-popup" onClick={toggleReviewPopup}>×</button>
            </div>
            <div className="popup-content">
              <div className="review-summary">
                <p><strong>Class:</strong> {selectedClass} | <strong>Subject:</strong> {selectedSubject} | <strong>Chapter:</strong> {selectedChapter}</p>
                <p><strong>Language:</strong> {selectedLanguage}</p>
                <p><strong>Score:</strong> {score}/{quiz.length} ({Math.round((score / quiz.length) * 100)}%)</p>
                <p><strong>Status:</strong> <span className={isPassed ? 'pass-text' : 'fail-text'}>{isPassed ? 'PASSED' : 'FAILED'}</span></p>
              </div>
              <div className="questions-review">
                {quiz.map((q, index) => (
                  <div key={index} className="question-review-item">
                    <div className="question-review-header">
                      <span className="question-number">Question {index + 1}:</span>
                      <span className={`answer-status ${userAnswers[index] === q.answer ? 'correct' : 'incorrect'}`}>
                        {userAnswers[index] === q.answer ? '✓ Correct' : userAnswers[index] ? '✗ Incorrect' : '⏭️ Skipped'}
                      </span>
                    </div>
                    <p className="review-question">{q.question}</p>
                    <div className="review-options">
                      {Object.entries(q.options).map(([label, option]) => (
                        <div 
                          key={label}
                          className={`review-option ${
                            label === q.answer ? 'correct-answer' : 
                            label === userAnswers[index] && label !== q.answer ? 'user-incorrect' : ''
                          }`}
                        >
                          <span className="option-label">{label}:</span>
                          <span className="option-text">{option}</span>
                          {label === q.answer && <span className="correct-mark"> ✓ Correct Answer</span>}
                          {label === userAnswers[index] && label !== q.answer && <span className="incorrect-mark"> ✗ Your Answer</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="popup-actions">
              <button className="popup-close-btn" onClick={toggleReviewPopup}>
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MockTest;