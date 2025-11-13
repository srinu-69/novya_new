import { quizTrackingAPI } from '../config/api';

/**
 * Submits a quiz attempt to the database.
 * @param {object} quizData - The data for the quiz attempt.
 */
export const submitQuizAttempt = async (quizData) => {
  try {
    const response = await quizTrackingAPI.submitAttempt(quizData);
    console.log('✅ Quiz attempt submitted to database:', response);
    return response;
  } catch (error) {
    console.error('❌ Error submitting quiz attempt to database:', error);
    throw error;
  }
};

/**
 * Submits a mock test attempt to the database.
 * @param {object} mockTestData - The data for the mock test attempt.
 */
export const submitMockTestAttempt = async (mockTestData) => {
  try {
    const response = await quizTrackingAPI.submitMockTest(mockTestData);
    console.log('✅ Mock test attempt submitted to database:', response);
    return response;
  } catch (error) {
    console.error('❌ Error submitting mock test attempt to database:', error);
    throw error;
  }
};

/**
 * Calculates quiz statistics (correct, wrong, unanswered, score).
 * @param {Array} quizQuestions - Array of quiz question objects.
 * @param {Array} userAnswers - Array of user's selected answers.
 * @returns {object} - Object containing totalQuestions, correctAnswers, wrongAnswers, unansweredQuestions, score.
 */
export const calculateQuizStats = (quizQuestions, userAnswers) => {
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unansweredQuestions = 0;

  quizQuestions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    if (userAnswer === null || userAnswer === undefined) {
      unansweredQuestions++;
    } else if (userAnswer === question.answer || userAnswer === question.answer.toString()) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }
  });

  return {
    totalQuestions: quizQuestions.length,
    correctAnswers,
    wrongAnswers,
    unansweredQuestions,
    score: correctAnswers, // Score is typically the number of correct answers
  };
};

/**
 * Get student performance data from database
 */
export const getStudentPerformance = async () => {
  try {
    console.log('🔍 Fetching student performance from database...');
    const response = await quizTrackingAPI.getPerformance();
    console.log('✅ Student performance fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching student performance:', error);
    throw error;
  }
};

/**
 * Get detailed quiz statistics from database
 */
export const getQuizStatistics = async () => {
  try {
    const response = await quizTrackingAPI.getStatistics();
    return response;
  } catch (error) {
    console.error('❌ Error fetching quiz statistics:', error);
    throw error;
  }
};

/**
 * Get recent quiz attempts for current user from database
 */
export const getRecentQuizAttempts = async (limit = 10, childEmail) => {
  try {
    console.log('🔍 Fetching recent quiz attempts from database...');
    const response = await quizTrackingAPI.getRecentAttempts({
      limit,
      childEmail,
    });
    console.log('✅ Recent quiz attempts fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching recent quiz attempts:', error);
    throw error;
  }
};

