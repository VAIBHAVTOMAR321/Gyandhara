import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from './components/pages/Home';
import { AuthProvider, useAuth } from './components/all_login/AuthContext';
import { LanguageProvider } from './components/all_login/LanguageContext';
import UserDashboard from "./components/user_panel/UserDashboard";
import UserProfile from "./components/user_panel/UserProfile";
import StudentRegistration from './components/registration/Registration';
import SchoolStudentRegistration from './components/school_panel/StudentRegistration';
import SchoolQuizList from './components/school_panel/SchoolQuizList';
import Login from './components/all_login/Login';
import NavBar from "./components/nav_bar/NavBar";

import AdminDashBoard from "./components/admin_panel/AdminDashBoard";
import SchoolDashBoard from "./components/school_panel/SchoolDashBoard";
import SendQuery from "./components/user_panel/SendQuery";
import StudentIssue from "./components/admin_panel/StudentIssue";
import QuizManageMent from "./components/admin_panel/QuizManageMent";
import SchoolQuiz from "./components/admin_panel/SchoolQuiz";
import UserQuiz from "./components/user_panel/UserQuiz";
import TenthGuidance from "./components/user_panel/TenthGuidance";
import OccupationDetails from "./components/user_panel/OccupationDetails";
import TwelfthGuidance from "./components/user_panel/TwelfthGuidance";
import GovernmentSchemes from "./components/user_panel/GovernmentSchemes";
import GroomingClasses from "./components/user_panel/GroomingClasses";
import Competition from "./components/user_panel/Competition";
// import TwelfthGuidance from "./components/user_panel/TwelfthGuidance";


//  Navbar Wrapper (Hide on specific routes)
function NavBarWrapper() {
  const location = useLocation();

  const hideOnRoutes = ['/UserDashboard', '/UserProfile', '/AdminDashboard', '/SchoolDashBoard', '/SendQuery', '/SchoolStudentRegistration', '/StudentIssue', '/SchoolQuiz', '/UserQuiz', '/TenthGuidance', '/TwelfthGuidance', '/OccupationDetails', '/SchoolQuizList', '/GovernmentSchemes', '/TwelfthGuidance', '/GroomingClasses', '/QuizManagement','/Competition'];

  const shouldHide = hideOnRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  if (shouldHide) return null;

  return <NavBar />;
}


// Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


//  App Content
function AppContent() {
  return (
    <>
      {/* Navbar conditionally visible */}
      <NavBarWrapper />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/StudentRegistration" element={<StudentRegistration />} />
        <Route path="/register" element={<StudentRegistration />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/UserDashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/TwelfthGuidance" 
          element={
            <ProtectedRoute>
              <TwelfthGuidance />
            </ProtectedRoute>
          } 
        />
        
         <Route 
          path="/GovernmentSchemes" 
          element={
            <ProtectedRoute>
              <GovernmentSchemes />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/UserProfile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/GroomingClasses" 
          element={
            <ProtectedRoute>
              <GroomingClasses />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/Competition"
          element={
            <ProtectedRoute>
              <Competition />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/SendQuery" 
          element={
            <ProtectedRoute>
              <SendQuery />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/StudentIssue" 
          element={
            <ProtectedRoute>
              <StudentIssue />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/QuizManagement" 
          element={
            <ProtectedRoute>
              <QuizManageMent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/SchoolQuiz" 
          element={
            <ProtectedRoute>
              <SchoolQuiz />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/AdminDashboard" 
          element={
            <ProtectedRoute>
              <AdminDashBoard />
            </ProtectedRoute>
          } 
        />
          <Route
          path="/SchoolDashBoard"
          element={
            <ProtectedRoute>
              <SchoolDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SchoolStudentRegistration"
          element={
            <ProtectedRoute>
              <SchoolStudentRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SchoolQuizList"
          element={
            <ProtectedRoute>
              <SchoolQuizList />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/UserQuiz" 
          element={
            <ProtectedRoute>
              <UserQuiz />
            </ProtectedRoute>
          } 
        />
         <Route 
           path="/TenthGuidance" 
           element={
             <ProtectedRoute>
               <TenthGuidance />
             </ProtectedRoute>
           } 
         />
         <Route 
           path="/OccupationDetails" 
           element={
             <ProtectedRoute>
               <OccupationDetails />
             </ProtectedRoute>
           } 
         />
          {/* <Route 
          path="/TwelfthGuidance" 
          element={
            <ProtectedRoute>
              <TwelfthGuidance />
            </ProtectedRoute>
          } 
        /> */}
      </Routes>
    </>
  );
}


// Main App
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;