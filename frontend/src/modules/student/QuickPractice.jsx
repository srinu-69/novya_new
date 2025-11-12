import { useState, useEffect } from "react";
import QuizGrade from "./QuizGrade";
import QuizSubject from "./QuizSubject";
import QuizQuestion from "./QuizQuestion";
import { useQuiz } from "./QuizContext";
import { submitQuizAttempt, calculateQuizStats } from "../../utils/quizTracking";
import { API_CONFIG, fastAPI } from "../../config/api";
import "./Quiz.css";
 
function Quiz() {
  const { updateQuizResults } = useQuiz();
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
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // NEW: Store selected language
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStartTime, setQuizStartTime] = useState(null);
 
  // Fetch classes
  useEffect(() => {
    fastAPI.get(API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CLASSES)
      .then((data) => setClasses(data.classes))
      .catch(() => setError("Failed to load classes"));
  }, []);
 
  const fetchSubjects = (className) => {
    if (!className) return;
    setLoading(true);
    fastAPI.get(API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CHAPTERS(className))
      .then((data) => {
        setSubjects(data.chapters || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subjects");
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
          setError("Invalid subtopics data format");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subtopics");
        setLoading(false);
      });
  };
 
  // UPDATED: fetchQuiz now accepts language parameter
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
    
    console.log("Fetching quiz with URL:", url); // Debug log
    console.log("Language being sent:", language); // Debug log
    
    fastAPI.get(url)
      .then((data) => {
        console.log("Quiz data received:", data); // Debug log
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
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(`Failed to load quiz: ${error.message}`);
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
 
  // UPDATED: handleSubtopicClick now accepts language parameter
  const handleSubtopicClick = (subtopic, language = "English") => {
    console.log("Subtopic clicked:", subtopic, "Language:", language); // Debug log
    setSelectedSubtopic(subtopic);
    setSelectedLanguage(language); // Store the selected language
    setCurrentLevel(1);
    setCurrentQ(0);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
    setError(null);
    setQuizStartTime(Date.now()); // Start timing the quiz
    enterFullScreen();
    fetchQuiz(subtopic, 1, false, language); // Pass language to fetchQuiz
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
      
      try {
        // Calculate quiz statistics
        const quizStats = calculateQuizStats(quiz, userAnswers);
        const timeTakenSeconds = Math.floor((Date.now() - quizStartTime) / 1000);
        
        // Prepare quiz data for submission
        const quizData = {
          quizType: 'ai_generated',
          subject: selectedSubject || 'Unknown',
          chapter: '', // Not available in current structure
          topic: selectedSubject || 'Unknown', // Using subject as topic
          subtopic: selectedSubtopic || 'Unknown',
          className: selectedClass || 'Unknown',
          difficultyLevel: 'simple', // Default for now
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
        console.log('📤 Submitting quiz attempt to backend...', quizData);
        const submitResponse = await submitQuizAttempt(quizData);
        console.log('✅ Quiz attempt submitted successfully!', submitResponse);
        
        // Update local quiz results (existing functionality)
        updateQuizResults(score, quiz.length, currentLevel, selectedClass, selectedSubject, selectedSubtopic);
        
      } catch (error) {
        console.error('❌ Error submitting quiz attempt:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Stack trace:', error.stack);
        // Still update local results even if backend submission fails
        updateQuizResults(score, quiz.length, currentLevel, selectedClass, selectedSubject, selectedSubtopic);
        // Show error to user
        alert('Warning: Quiz results saved locally, but could not sync to server. Please check your connection.');
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
    }
  };
 
  const backToChapters = () => {
    // Only reset quiz and subtopic, keep subjects and class to avoid blinking
    setSelectedSubtopic(null);
    setQuiz([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setUserAnswers([]);
    exitFullScreen();
  };
 
  // UPDATED: retryQuiz now uses stored language
  const retryQuiz = () => {
    enterFullScreen();
    fetchQuiz(selectedSubtopic, currentLevel, true, selectedLanguage);
  };
 
  // UPDATED: nextLevel now uses stored language
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
  };
 
  const exitFullScreen = () => {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
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
        <p>Preparing your Quiz...</p>
      </div>
    );
 
  return (
    <>
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}
 
      {/* Grade Selection */}
      {!selectedClass && !error && (
        <QuizGrade classes={classes} onClassClick={handleClassClick} />
      )}
 
      {/* Subject / Subtopic Selection - UPDATED: Pass handleSubtopicClick that accepts language */}
      {selectedClass && !selectedSubtopic && !error && (
        <QuizSubject
          subjects={subjects}
          subtopics={subtopics}
          selectedSubject={selectedSubject}
          selectedClass={selectedClass}
          onClassClick={() => setSelectedClass(null)} // smooth back to grades
          onSubjectClick={handleSubjectClick}
          onSubtopicClick={handleSubtopicClick} // This now accepts (subtopic, language)
        />
      )}
 
      {/* Quiz Page */}
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
          selectedLanguage={selectedLanguage} // Pass language to QuizQuestion if needed
        />
      )}
    </>
  );
}
 
export default Quiz;