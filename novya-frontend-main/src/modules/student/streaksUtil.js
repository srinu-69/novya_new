// -----------------------------------------
// 🔥 Learning Streak Utility Functions (Frontend Only)
// -----------------------------------------
// Location: src/modules/student/streakUtils.js
// Purpose: Track daily learning streaks and assign titles/trophies.
// Storage: Uses localStorage so streak persists after logout or refresh.
// -----------------------------------------
 
// 🧮 Function to calculate and update the streak
export const updateStreak = () => {
  const today = new Date().toDateString(); // e.g., "Tue Nov 04 2025"
 
  // Get existing streak data from localStorage
  const storedData = JSON.parse(localStorage.getItem("learningStreak")) || {
    streak: 0,
    lastVisitDate: null,
  };
 
  // If the user already visited today, return as is
  if (storedData.lastVisitDate === today) {
    return storedData;
  }
 
  // Calculate difference in days between today and last visit
  const lastVisit = new Date(storedData.lastVisitDate);
  const diffDays = Math.floor(
    (new Date(today) - lastVisit) / (1000 * 60 * 60 * 24)
  );
 
  let newStreak = storedData.streak;
 
  // Continue streak if visited yesterday
  if (diffDays === 1) {
    newStreak += 1;
  }
  // Reset streak if missed a day or it's first time
  else if (diffDays > 1 || isNaN(diffDays)) {
    newStreak = 1;
  }
 
  // Update and save back to localStorage
  const updatedData = {
    streak: newStreak,
    lastVisitDate: today,
  };
 
  localStorage.setItem("learningStreak", JSON.stringify(updatedData));
  return updatedData;
};
 
// 🏆 Function to determine trophy title based on streak count
export const getTrophyTitle = (streak) => {
  if (streak >= 30) return "Learning Legend ";
  if (streak >= 15) return "Focused Mind";
  if (streak >= 7) return "Steady Learner";
  return "";
};
 
 
 