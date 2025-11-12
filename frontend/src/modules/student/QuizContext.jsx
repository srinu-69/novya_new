 
import { createContext, useContext, useState } from 'react';
 
const QuizContext = createContext();
 
export const QuizProvider = ({ children }) => {
  const [quizResults, setQuizResults] = useState({
    totalQuizzes: 0,
    totalScore: 0,
    totalQuestions: 0,
    byLevel: {},
  });
 
  const [mockTestResults, setMockTestResults] = useState({
    totalTests: 0,
    totalScore: 0,
    totalQuestions: 0,
  });
 
  // Track if quiz is active
  const [isQuizActive, setIsQuizActive] = useState(false);
 
  const updateQuizResults = (score, totalQuestions, level) => {
    setQuizResults(prev => ({
      totalQuizzes: prev.totalQuizzes + 1,
      totalScore: prev.totalScore + score,
      totalQuestions: prev.totalQuestions + totalQuestions,
      byLevel: {
        ...prev.byLevel,
        [level]: (prev.byLevel[level] || 0) + 1,
      },
    }));
  };
 
  const updateMockTestResults = (score, totalQuestions) => {
    setMockTestResults(prev => ({
      totalTests: prev.totalTests + 1,
      totalScore: prev.totalScore + score,
      totalQuestions: prev.totalQuestions + totalQuestions,
    }));
  };
 
  const startQuiz = () => setIsQuizActive(true);
  const endQuiz = () => setIsQuizActive(false);
 
  return (
    <QuizContext.Provider
      value={{
        quizResults,
        mockTestResults,
        updateQuizResults,
        updateMockTestResults,
        isQuizActive,
        startQuiz,
        endQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
 
export const useQuiz = () => useContext(QuizContext);
 
  



// import { createContext, useContext, useState } from 'react';
 
// const QuizContext = createContext();
 
// export const QuizProvider = ({ children }) => {
//   const [quizResults, setQuizResults] = useState({
//     totalQuizzes: 0,
//     totalScore: 0,
//     totalQuestions: 0,
//     byLevel: {},
//   });
 
//   const [mockTestResults, setMockTestResults] = useState({
//     totalTests: 0,
//     totalScore: 0,
//     totalQuestions: 0,
//   });
 
//   // Track if quiz is active
//   const [isQuizActive, setIsQuizActive] = useState(false);
 
//   const updateQuizResults = (score, totalQuestions, level) => {
//     setQuizResults(prev => ({
//       totalQuizzes: prev.totalQuizzes + 1,
//       totalScore: prev.totalScore + score,
//       totalQuestions: prev.totalQuestions + totalQuestions,
//       byLevel: {
//         ...prev.byLevel,
//         [level]: (prev.byLevel[level] || 0) + 1,
//       },
//     }));
//   };
 
//   const updateMockTestResults = (score, totalQuestions) => {
//     setMockTestResults(prev => ({
//       totalTests: prev.totalTests + 1,
//       totalScore: prev.totalScore + score,
//       totalQuestions: prev.totalQuestions + totalQuestions,
//     }));
//   };
 
//   const startQuiz = () => setIsQuizActive(true);
//   const endQuiz = () => setIsQuizActive(false);
 
//   return (
//     <QuizContext.Provider
//       value={{
//         quizResults,
//         mockTestResults,
//         updateQuizResults,
//         updateMockTestResults,
//         isQuizActive,
//         startQuiz,
//         endQuiz,
//       }}
//     >
//       {children}
//     </QuizContext.Provider>
//   );
// };
 
// export const useQuiz = () => useContext(QuizContext);
 
 