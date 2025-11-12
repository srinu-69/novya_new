// import React, { useEffect, useContext } from 'react';
// import { useQuiz } from './QuizContext';
 
// const QuizTestPage = () => {
//   const { startQuiz, endQuiz } = useQuiz();
 

//   return (
//     <div>
//       <h1>Quiz Test Page</h1>
//       {/* Quiz content goes here */}
//     </div>
//   );
// };
 
// export default QuizTestPage;



import React, { useEffect } from 'react';
import { useQuiz } from './QuizContext';
import { useTranslation } from 'react-i18next';
 
const QuizTestPage = () => {
  const { startQuiz, endQuiz } = useQuiz();
  const { t } = useTranslation();
 
  useEffect(() => {
    // Start quiz: hide navbar or perform any quiz initialization
    startQuiz();
 
    // Cleanup: show navbar or end quiz when leaving this page
    return () => {
      endQuiz();
    };
  }, [startQuiz, endQuiz]);
 
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{t('quiz_test_page')}</h1>
      <p>{t('quiz_content_here')}</p>
      {/* Place your Quiz component here, e.g., <Quiz /> */}
    </div>
  );
};
 
export default QuizTestPage;