





import { useState, useEffect } from "react";
import QuizGrade from "./QuizGrade";
import QuizSubject from "./QuizSubject";
import QuizQuestion from "./QuizQuestion";
import Navbar from "./Navbarrr";
import { useQuiz } from "./QuizContext";
import { useTranslation } from "react-i18next";
import { API_CONFIG, fastAPI } from "../../config/api";
import "./Quiz.css";

function Quiz() {
  const { 
    updateQuizResults, 
    rewardPoints, 
    updateRewardPoints,
    calculateEarnedPoints,
    startQuiz,
    resetQuiz,
    addEarnedPoints,
    hasAwardedPoints
  } = useQuiz();
  
  const { t } = useTranslation();
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subtopics, setSubtopics] = useState({});
  const [quiz, setQuiz] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);

  // Sync reward points from localStorage and other components
  useEffect(() => {
    // Sync reward points from localStorage on component mount
    const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
    if (savedPoints !== rewardPoints) {
      console.log(`Quiz: Syncing points from localStorage: ${savedPoints}`);
      updateRewardPoints(savedPoints);
    }

    // Listen for reward points updates from other components
    const handleRewardPointsUpdate = (event) => {
      if (event.detail && event.detail.rewardPoints !== undefined) {
        console.log(`Quiz: Received points update from event: ${event.detail.rewardPoints}`);
        updateRewardPoints(event.detail.rewardPoints);
      }
    };

    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);

    return () => {
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    };
  }, [updateRewardPoints, rewardPoints]);

  // Fetch classes - Using API Config
  useEffect(() => {
    fastAPI.get(API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CLASSES)
      .then((data) => setClasses(data.classes))
      .catch(() => setError(t('quiz_data_issue')));
  }, [t]);

  const fetchSubjects = (className) => {
    if (!className) return;
    setLoading(true);
    fastAPI.get(API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CHAPTERS(className))
      .then((data) => {
        setSubjects(data.chapters || []);
        setLoading(false);
      })
      .catch(() => {
        setError(t('quiz_data_issue'));
        setLoading(false);
      });
  };

  const fetchSubtopics = (className, subject) => {
    if (!className || !subject) return;
    setLoading(true);
    fastAPI.get(API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_SUBTOPICS(className, subject))
      .then((data) => {
        if (Array.isArray(data.subtopics)) {
          setSubtopics({ "Chapter 1": data.subtopics });
        } else if (typeof data.subtopics === "object" && data.subtopics !== null) {
          setSubtopics(data.subtopics);
        } else {
          setSubtopics({});
          setError(t('quiz_data_issue'));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(t('quiz_data_issue'));
        setLoading(false);
      });
  };

  // UPDATED: fetchQuiz now uses API config
  const fetchQuiz = (subtopic, level = 1, retry = false, language = "English") => {
    if (!subtopic) return;
    setLoading(true);
    
    // Construct URL with language parameter using API config
    const params = {
      subtopic: subtopic,
      currentLevel: level,
      retry: retry,
      language: language
    };
    const url = API_CONFIG.FASTAPI.QUICK_PRACTICE.GENERATE_QUIZ(params);
    
    console.log("Fetching quiz with URL:", url);
    console.log("Language being sent:", language);

    fastAPI.get(url)
      .then((data) => {
        console.log("Quiz data received:", data);
        if (data.error) setError(data.error);
        else {
          const cleanedQuiz = data.quiz.map((q) => {
            q.options = q.options.map((opt) => opt.replace(/^[A-D][).]\s*/, ""));
            q.answer = q.answer.replace(/^[A-D][).]\s*/, "");
            return q;
          });
          setQuiz(cleanedQuiz);
          setCurrentLevel(data.currentLevel || level);
          setCurrentQ(0);
          setSelected(null);
          setScore(0);
          setIsFinished(false);
          setShowAnswer(false);
          setUserAnswers([]);
          setError(null);
          setQuizStartTime(Date.now()); // Start timing the quiz
          
          // Start the quiz in context
          startQuiz();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(`${t('quiz_data_issue')}: ${error.message}`);
        setLoading(false);
      });
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setSelectedSubject(null);
    setSelectedSubtopic(null);
    fetchSubjects(className);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedSubtopic(null);
    fetchSubtopics(selectedClass, subject);
  };

  const handleSubtopicClick = (subtopic, language = "English") => {
    setSelectedSubtopic(subtopic);
    setSelectedLanguage(language);
    setCurrentLevel(1);
    enterFullScreen();
    fetchQuiz(subtopic, 1, false, language);
  };

  const handleAnswer = (option) => {
    setSelected(option);
    setShowAnswer(true);

    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = option;
    setUserAnswers(newAnswers);

    if (option === quiz[currentQ].answer) setScore(score + 1);
  };

  const nextQuestion = async () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
      
      // Note: Coins are awarded by updateQuizResults via addEarnedPoints
      // Don't add coins here to avoid double counting

      // Prepare quiz data for database submission
      try {
        const startTime = quizStartTime || Date.now(); // Fallback to current time if not tracked
        const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
        const quizData = {
          quizType: 'quiz', // Changed from 'ai_generated' to match backend
          type: 'quiz', // Backend expects this field
          subject: selectedSubject || 'Unknown',
          chapter: '', // Not available in quick practice
          topic: selectedSubject || 'Unknown',
          subtopic: selectedSubtopic || 'Unknown',
          className: selectedClass || 'Unknown',
          class_name: selectedClass || 'Unknown', // Backend expects this
          difficultyLevel: 'simple',
          language: selectedLanguage || 'English',
          totalQuestions: quiz.length,
          total_questions: quiz.length, // Backend expects this
          correctAnswers: score,
          wrongAnswers: quiz.length - score,
          unansweredQuestions: 0,
          timeTakenSeconds: timeTakenSeconds,
          time_taken_seconds: timeTakenSeconds, // Backend expects this
          score: score,
          quizQuestions: quiz || [],
          userAnswers: (userAnswers || []).filter(answer => answer !== null)
        };
        
        // Update results with database save
        await updateQuizResults(
          score,
          quiz.length,
          currentLevel,
          selectedClass,
          selectedSubject,
          selectedSubtopic,
          quizData // Pass quiz data for database save
        );
        
        // Dispatch event for Career page to refresh (QuizContext already dispatches, but this ensures it)
        window.dispatchEvent(new CustomEvent('quizCompleted', {
          detail: { score, totalQuestions: quiz.length, type: 'quiz' }
        }));
      } catch (error) {
        console.error('❌ Error preparing quiz data:', error);
        // Fallback: update without database save
        updateQuizResults(
          score,
          quiz.length,
          currentLevel,
          selectedClass,
          selectedSubject,
          selectedSubtopic
        );
        
        // Still dispatch event even on error
        window.dispatchEvent(new CustomEvent('quizCompleted', {
          detail: { score, totalQuestions: quiz.length, type: 'quiz' }
        }));
      }
      exitFullScreen();
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(userAnswers[currentQ - 1] || null);
      setShowAnswer(false);
    }
  };

  const backToChapters = () => {
    setSelectedSubtopic(null);
    setQuiz([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setUserAnswers([]);
    resetQuiz();
    exitFullScreen();
  };

  const retryQuiz = () => {
    // Reset all quiz state before retrying
    setScore(0);
    setCurrentQ(0);
    setSelected(null);
    setUserAnswers([]);
    setIsFinished(false);
    setShowAnswer(false);
    
    // Reset quiz context state
    resetQuiz();
    
    // Fetch new quiz with retry flag
    enterFullScreen();
    fetchQuiz(selectedSubtopic, currentLevel, true, selectedLanguage);
  };

  const nextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    fetchQuiz(selectedSubtopic, nextLvl, false, selectedLanguage);
    enterFullScreen();
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    setIsFullScreen(false);
  };

  const handlePause = () => {
    // Handle quiz pause if needed
    console.log("Quiz paused");
  };

  // Get chapter name from subtopics object
  const getChapterName = () => {
    if (!subtopics || Object.keys(subtopics).length === 0) return "Chapter 1";
    
    const chapterKey = Object.keys(subtopics)[0];
    return chapterKey || "Chapter 1";
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="edu-loader">
          <span role="img" aria-label="books" className="edu-icon">
            📚
          </span>
          <span role="img" aria-label="pencil" className="edu-icon">
            ✏️
          </span>
          <span role="img" aria-label="globe" className="edu-icon">
            🌍
          </span>
        </div>
        <p>{t('preparing_your_quiz')}</p>
      </div>
    );

  return (
    <>
      <Navbar isFullScreen={isFullScreen} />
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            {t('retry_quiz')}
          </button>
        </div>
      )}

      {!selectedClass && !error && (
        <QuizGrade classes={classes} onClassClick={handleClassClick} />
      )}

      {selectedClass && !selectedSubtopic && !error && (
        <QuizSubject
          subjects={subjects}
          subtopics={subtopics}
          selectedSubject={selectedSubject}
          selectedClass={selectedClass}
          onClassClick={() => setSelectedClass(null)}
          onSubjectClick={handleSubjectClick}
          onSubtopicClick={handleSubtopicClick}
        />
      )}

      {selectedSubtopic && !error && (
        <QuizQuestion
          quiz={quiz}
          currentQ={currentQ}
          selected={selected}
          showAnswer={showAnswer}
          score={score}
          isFinished={isFinished}
          handleAnswer={handleAnswer}
          nextQuestion={nextQuestion}
          prevQuestion={prevQuestion}
          retryQuiz={retryQuiz}
          nextLevel={nextLevel}
          backToChapters={backToChapters}
          currentLevel={currentLevel}
          userAnswers={userAnswers}
          handlePause={handlePause}
          selectedLanguage={selectedLanguage}
          selectedSubtopic={selectedSubtopic}
          classLevel={selectedClass}
          subject={selectedSubject}
          chapter={getChapterName()}
          rewardPoints={rewardPoints}
        />
      )}
    </>
  );
}

export default Quiz;
