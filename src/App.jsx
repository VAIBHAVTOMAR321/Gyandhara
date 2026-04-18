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
import Login from './components/all_login/Login';
import NavBar from "./components/nav_bar/NavBar";

import AdminDashBoard from "./components/admin_panel/AdminDashBoard";
import SchoolDashBoard from "./components/school_panel/SchoolDashBoard";
import SendQuery from "./components/user_panel/SendQuery";


//  Navbar Wrapper (Hide on specific routes)
function NavBarWrapper() {
  const location = useLocation();

  const hideOnRoutes = ['/UserDashboard', '/UserProfile', '/AdminDashboard', '/SchoolDashBoard', '/SendQuery'];

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
          path="/UserProfile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/UserProfile" 
          element={
            <ProtectedRoute>
              <SendQuery />
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