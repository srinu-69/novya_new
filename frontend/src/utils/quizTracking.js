import { quizTrackingAPI } from '../config/api';

/**
 * Submits a quiz attempt to the backend.
 * @param {object} quizData - The data for the quiz attempt.
 */
export const submitQuizAttempt = async (quizData) => {
  try {
    const response = await quizTrackingAPI.submitAttempt(quizData);
    console.log('Quiz attempt submitted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
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
    } else if (userAnswer === question.answer) {
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
 * Get student performance data
 */
export const getStudentPerformance = async () => {
  try {
    console.log('🔍 Debug - Calling getStudentPerformance...');
    const response = await quizTrackingAPI.getPerformance();
    console.log('🔍 Debug - getStudentPerformance response:', response);
    return response; // Remove .data since djangoAPI.get already returns the parsed data
  } catch (error) {
    console.error('❌ Error fetching student performance:', error);
    throw error;
  }
};

/**
 * Get detailed quiz statistics
 */
export const getQuizStatistics = async () => {
  try {
    const response = await quizTrackingAPI.getStatistics();
    return response; // Remove .data since djangoAPI.get already returns the parsed data
  } catch (error) {
    console.error('Error fetching quiz statistics:', error);
    throw error;
  }
};

/**
 * Get recent quiz attempts
 */
export const getRecentQuizAttempts = async (limit = 10) => {
  try {
    console.log('🔍 Debug - Calling getRecentQuizAttempts...');
    const response = await quizTrackingAPI.getRecentAttempts(limit);
    console.log('🔍 Debug - getRecentQuizAttempts response:', response);
    return response; // Remove .data since djangoAPI.get already returns the parsed data
  } catch (error) {
    console.error('❌ Error fetching recent quiz attempts:', error);
    throw error;
  }
};