







// import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
// import React from 'react';
// import { QuizProvider, useQuiz } from './modules/student/QuizContext';

// // Home Modules
// import Navbar from './modules/home/Navbar';
// import HeroSection from './modules/home/HeroSection';
// import Features from './modules/home/Features';
// import Courses from './modules/home/Courses';
// import CourseDetail from './modules/home/CourseDetails';
// import HowItWorks from './modules/home/HowItWorks';
// import Pricing from './modules/home/Pricing';
// import Testimonials from './modules/home/Testimonials';
// import AppDownload from './modules/home/AppDownload';
// import Footer from './modules/home/Footer';
// import FAQs from './modules/home/FAQs';
// import Contact from './modules/home/Contact';
// import FreeDemo from './modules/home/FreeDemo';
// import ProfilePage from './modules/home/ProfilePage';
// import FloatingChatBot from './modules/home/FloatingChatBot';
// import AIDemo from './modules/home/AIDemo';

// // Auth Modules
// import Login from './modules/login/Login';
// import Signup from './modules/login/Signup';
// import ForgotPassword from './modules/login/ForgotPassword';

// // Student Modules
// import Navbarrr from './modules/student/Navbarrr';
// import Home1 from './modules/student/Home1';
// import Learn from './modules/student/Learn';
// import LessonPage from './modules/student/LessonPage';
// import Practice from './modules/student/Practice';
// import Career from './modules/student/Career';
// import Mentorship from './modules/student/Mentorship';
// import Chatbox from './modules/student/Chatbox';
// import Quizzes from './modules/student/Quizzes';
// import Recordings from './modules/student/Recordings';
// import EventRegistrationPage from './modules/student/EventRegistrationPage';
// import QuickPractice from './modules/student/QuickPractice';
// import MockTest from './modules/student/MockTest';
// import UserDetailsPage from './modules/student/UserDetailsPage';

// // Practice & Mock Test Modules
// import PracticeSubjectPage from './modules/student/PracticeSubjectPage';
// import PracticeQuestionPage from './modules/student/PracticeQuestionPage';
// import MockTestSubjectPage from './modules/student/MockTestSubjectPage';
// import MockTestQuestionsPage from './modules/student/MockTestQuestionsPage';
// import MockTestSyllabus from './modules/student/MockTestSyllabus';

// // Quiz Test Page
// import QuizTestPage from './modules/student/QuizTestPage';

// // Parent Modules
// import ParentDashboard from './modules/parent/ParentDashboard';
// import Attendance from './modules/parent/Attendance';
// import ChildProfile from './modules/parent/ChildProfile';
// import Fees from './modules/parent/Fees';
// import HomeWork from './modules/parent/HomeWork';
// import MockTestReports from './modules/parent/MockTestReports';
// import Progress from './modules/parent/Progress';
// import StudyPlanner from './modules/parent/StudyPlanner';

// import './modules/parent/styles.css';

// // Protected route wrapper
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem('userToken');
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// // Role-based route wrapper
// const RoleRoute = ({ children, requiredRole }) => {
//   const userRole = localStorage.getItem('userRole');
//   if (!userRole) return <Navigate to="/login" replace />;
//   return userRole === requiredRole ? children : <Navigate to="/unauthorized" replace />;
// };

// function App() {
//   const location = useLocation();
//   const { isQuizActive } = useQuiz();

//   // Paths where Navbar/Footer should be hidden
//   const hideNavbarFooter = [
//     '/login',
//     '/signup',
//     '/forgot-password',
//     '/unauthorized',
//     '/profile',
//     '/user-details'
//   ].includes(location.pathname);

//   // Student routes detection
//   const isStudentPage = [
//     '/learn',
//     '/practice',
//     '/career',
//     '/mentorship',
//     '/student/dashboard',
//     '/lesson',
//     '/events',
//     '/practice-subject',
//     '/mock-test',
//     '/practice-questions',
//     '/mock-test-questions',
//     '/learn/quizzes',
//     '/learn/recordings',
//     '/quick-practice',
//     '/quiz-test'
//   ].some(path => location.pathname.startsWith(path));

//   // Parent routes detection
//   const isParentPage = location.pathname.startsWith('/parent');

//   // Hide student navbar only on Quick Practice, Profile, and User Details pages
//   const hideStudentNavbar = [
//     '/quick-practice',
//     '/profile',
//     '/user-details'
//   ].some(path => location.pathname.startsWith(path));

//   // Mock test routes where chatbot should be hidden
//   const isMockTestPage = [
//     '/mock-test',
//     '/mock-test-questions',
//     '/quiz-test'
//   ].some(path => location.pathname.startsWith(path));

//   return (
//     <QuizProvider>
//       <div className="app-container">
//         {/* Home Navbar */}
//         {!hideNavbarFooter && !isStudentPage && !isParentPage && <Navbar />}

//         {/* Student Navbar */}
//         {isStudentPage && !hideStudentNavbar && <Navbarrr />}

//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<>
//             <HeroSection />
//             <Features />
//             <Courses />
//             <HowItWorks />
//             <Pricing />
//             <FloatingChatBot />
//             <Testimonials />
//             <AppDownload />
//           </>} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/course/:id" element={<CourseDetail />} />
//           <Route path="/how-it-works" element={<HowItWorks />} />
//           <Route path="/pricing" element={<Pricing />} />
//           <Route path="/testimonials" element={<Testimonials />} />
//           <Route path="/app-download" element={<AppDownload />} />
//           <Route path="/faqs" element={<FAQs />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/free-demo" element={<FreeDemo />} />
//           <Route path="/ai-demo" element={<AIDemo />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/unauthorized" element={
//             <div className="unauthorized-page text-center mt-5">
//               <h1>401 - Unauthorized Access</h1>
//               <p>You don't have permission to access this page.</p>
//               <Link to="/" className="btn btn-primary mt-3">Return Home</Link>
//             </div>
//           } />

//           {/* Profile Page - Protected */}
//           <Route path="/profile" element={
//             <ProtectedRoute>
//               <ProfilePage />
//             </ProtectedRoute>
//           } />

//           {/* Student Routes */}
//           <Route path="/student/dashboard" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><Home1 /></RoleRoute>
//             </ProtectedRoute>
//           } />

//           {/* Learn Routes */}
//           {['', 'class7', 'class8', 'class9', 'class10'].map(cls => (
//             <Route
//               key={cls}
//               path={`/learn/${cls}`}
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute requiredRole="student"><Learn /></RoleRoute>
//                 </ProtectedRoute>
//               }
//             />
//           ))}

//           {/* Lesson */}
//           <Route path="/lesson/:classId/:subject/:chapterNumber" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><LessonPage /></RoleRoute>
//             </ProtectedRoute>
//           } />

//           {/* Practice & Mock Test */}
//           <Route path="/practice" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><Practice /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/practice-subject/:subjectId" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><PracticeSubjectPage /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/practice-questions" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><PracticeQuestionPage /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/mock-test/:subjectId" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><MockTestSubjectPage syllabus={MockTestSyllabus} /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/mock-test-questions" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><MockTestQuestionsPage /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/quick-practice" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><QuickPractice /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/mock-test" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><MockTest /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/career" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><Career /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/mentorship" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><Mentorship /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/events/:eventId/register" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><EventRegistrationPage /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/learn/quizzes" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><Quizzes /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/learn/recordings" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><Recordings /></RoleRoute>
//             </ProtectedRoute>
//           } />

//           {/* User Details Page */}
//           <Route path="/user-details" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><UserDetailsPage /></RoleRoute>
//             </ProtectedRoute>
//           } />

//           {/* Quiz Test */}
//           <Route path="/quiz-test" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="student"><QuizTestPage /></RoleRoute>
//             </ProtectedRoute>
//           } />

//           {/* Parent Routes */}
//           <Route path="/parent/dashboard" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><ParentDashboard /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/attendance" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><Attendance /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/child-profile" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><ChildProfile /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/fees" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><Fees /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/homework" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><HomeWork /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/reports" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><MockTestReports /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/progress" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><Progress /></RoleRoute>
//             </ProtectedRoute>
//           } />
//           <Route path="/parent/study-planner" element={
//             <ProtectedRoute>
//               <RoleRoute requiredRole="parent"><StudyPlanner /></RoleRoute>
//             </ProtectedRoute>
//           } />

//           {/* Catch-All */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>

//         {/* Footer */}
//         {!hideNavbarFooter && !isStudentPage && !isParentPage && <Footer />}

//         {/* Student Chatbox */}
//         {isStudentPage && !hideStudentNavbar && !isMockTestPage && <div className="student-chatbox-container"><Chatbox /></div>}
//       </div>
//     </QuizProvider>
//   );
// }

// export default App;













import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import React from 'react';
import { QuizProvider } from './modules/student/QuizContext';

// Home Modules
import Navbar from './modules/home/Navbar';
import HeroSection from './modules/home/HeroSection';
import Features from './modules/home/Features';
import Courses from './modules/home/Courses';
import CourseDetail from './modules/home/CourseDetails';
import HowItWorks from './modules/home/HowItWorks';
import Pricing from './modules/home/Pricing';
import Testimonials from './modules/home/Testimonials';
import AppDownload from './modules/home/AppDownload';
import Footer from './modules/home/Footer';
import FAQs from './modules/home/FAQs';
import Contact from './modules/home/Contact';
import FreeDemo from './modules/home/FreeDemo';
import ProfilePage from './modules/home/ProfilePage';
import FloatingChatBot from './modules/home/FloatingChatBot';
import AIDemo from './modules/home/AIDemo';

// Auth Modules
import Login from './modules/login/Login';
import Signup from './modules/login/Signup';
import ForgotPassword from './modules/login/ForgotPassword';

// Student Modules
import Navbarrr from './modules/student/Navbarrr';
import Home1 from './modules/student/Home1';
import Learn from './modules/student/Learn';
import LessonPage from './modules/student/LessonPage';
import Practice from './modules/student/Practice';
import Career from './modules/student/Career';
import Chatbox from './modules/student/Chatbox';
import Quizzes from './modules/student/Quizzes';
import Recordings from './modules/student/Recordings';
import QuickPractice from './modules/student/QuickPractice';
import MockTest from './modules/student/MockTest';
import UserDetailsPage from './modules/student/UserDetailsPage';

// Practice & Mock Test Modules
import PracticeSubjectPage from './modules/student/PracticeSubjectPage';
import PracticeQuestionPage from './modules/student/PracticeQuestionPage';
import MockTestSubjectPage from './modules/student/MockTestSubjectPage';
import MockTestQuestionsPage from './modules/student/MockTestQuestionsPage';
import MockTestSyllabus from './modules/student/MockTestSyllabus';

// Quiz Test Page
import QuizTestPage from './modules/student/QuizTestPage';

// Parent Modules
import ParentDashboard from './modules/parent/ParentDashboard';
import Attendance from './modules/parent/Attendance';
import ChildProfile from './modules/parent/ChildProfile';
import Fees from './modules/parent/Fees';
import HomeWork from './modules/parent/HomeWork';
import MockTestReports from './modules/parent/MockTestReports';
import Progress from './modules/parent/Progress';
import StudyPlanner from './modules/parent/StudyPlanner';

import './modules/parent/styles.css';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Role-based route wrapper
const RoleRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) return <Navigate to="/login" replace />;
  return userRole === requiredRole ? children : <Navigate to="/unauthorized" replace />;
};

function App() {
  const location = useLocation();

  // Paths where Navbar/Footer should be hidden
  const hideNavbarFooter = [
    '/login',
    '/signup',
    '/forgot-password',
    '/unauthorized',
    '/profile',
    '/user-details'
  ].includes(location.pathname);

  // Student routes detection
  const isStudentPage = [
    '/learn',
    '/practice',
    '/career',
    '/student/dashboard',
    '/lesson',
    '/practice-subject',
    '/mock-test',
    '/practice-questions',
    '/mock-test-questions',
    '/learn/quizzes',
    '/learn/recordings',
    '/quick-practice',
    '/quiz-test'
  ].some(path => location.pathname.startsWith(path));

  // Parent routes detection
  const isParentPage = location.pathname.startsWith('/parent');

  // Hide student navbar only on Quick Practice, Profile, and User Details pages
  const hideStudentNavbar = [
    '/quick-practice',
    '/profile',
    '/user-details'
  ].some(path => location.pathname.startsWith(path));

  // Mock test routes where chatbot should be hidden
  const isMockTestPage = [
    '/mock-test',
    '/mock-test-questions',
    '/quiz-test'
  ].some(path => location.pathname.startsWith(path));

  return (
    <QuizProvider>
      <div className="app-container">
        {/* Home Navbar */}
        {!hideNavbarFooter && !isStudentPage && !isParentPage && <Navbar />}

        {/* Student Navbar */}
        {isStudentPage && !hideStudentNavbar && <Navbarrr />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<>
            <HeroSection />
            <Features />
            <Courses />
            <HowItWorks />
            <Pricing />
            <FloatingChatBot />
            <Testimonials />
            <AppDownload />
          </>} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/app-download" element={<AppDownload />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/free-demo" element={<FreeDemo />} />
          <Route path="/ai-demo" element={<AIDemo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={
            <div className="unauthorized-page text-center mt-5">
              <h1>401 - Unauthorized Access</h1>
              <p>You don't have permission to access this page.</p>
              <Link to="/" className="btn btn-primary mt-3">Return Home</Link>
            </div>
          } />

          {/* Profile Page - Protected */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><Home1 /></RoleRoute>
            </ProtectedRoute>
          } />
          

          {/* Learn Routes */}
          {['', 'class7', 'class8', 'class9', 'class10'].map(cls => (
            <Route
              key={cls}
              path={`/learn/${cls}`}
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="student"><Learn /></RoleRoute>
                </ProtectedRoute>
              }
            />
          ))}

          {/* Lesson */}
          <Route path="/lesson/:classId/:subject/:chapterNumber" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><LessonPage /></RoleRoute>
            </ProtectedRoute>
          } />

          {/* Practice & Mock Test */}
          <Route path="/practice" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><Practice /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/practice-subject/:subjectId" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><PracticeSubjectPage /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/practice-questions" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><PracticeQuestionPage /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/mock-test/:subjectId" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><MockTestSubjectPage syllabus={MockTestSyllabus} /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/mock-test-questions" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><MockTestQuestionsPage /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/quick-practice" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><QuickPractice /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/mock-test" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><MockTest /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/career" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><Career /></RoleRoute>
            </ProtectedRoute>
          } />

          {/* Removed Mentorship and Event Registration Routes */}

          <Route path="/learn/quizzes" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><Quizzes /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/learn/recordings" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><Recordings /></RoleRoute>
            </ProtectedRoute>
          } />

          {/* User Details Page */}
          <Route path="/user-details" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><UserDetailsPage /></RoleRoute>
            </ProtectedRoute>
          } />

          {/* Quiz Test */}
          <Route path="/quiz-test" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="student"><QuizTestPage /></RoleRoute>
            </ProtectedRoute>
          } />

          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><ParentDashboard /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/attendance" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><Attendance /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/child-profile" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><ChildProfile /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/fees" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><Fees /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/homework" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><HomeWork /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/reports" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><MockTestReports /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/progress" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><Progress /></RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/parent/study-planner" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="parent"><StudyPlanner /></RoleRoute>
            </ProtectedRoute>
          } />

          {/* Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer */}
        {!hideNavbarFooter && !isStudentPage && !isParentPage && <Footer />}

        {/* Student Chatbox */}
        {isStudentPage && !hideStudentNavbar && !isMockTestPage && <div className="student-chatbox-container"><Chatbox /></div>}
      </div>
    </QuizProvider>
  );
}

export default App;
