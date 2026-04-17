import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from './components/pages/Home';
import { AuthProvider, useAuth } from './components/all_login/AuthContext';
import { LanguageProvider } from './components/all_login/LanguageContext';
import UserDashboard from "./components/user_panel/UserDashboard";
import UserProfile from "./components/user_panel/UserProfile";
import StudentRegistration from './components/registration/StudentRegistration';
import Login from './components/all_login/Login';
import NavBar from "./components/nav_bar/NavBar";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppContent() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/NavBar" element={<NavBar />} />
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
    </Routes>
  );
}

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