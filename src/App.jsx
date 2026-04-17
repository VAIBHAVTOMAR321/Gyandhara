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
import { AuthProvider } from './components/all_login/AuthContext';
import { LanguageProvider } from './components/all_login/LanguageContext';
import UserDashBord from "./components/user_panel/UserDashBord";
import StudentRegistration from './components/registration/StudentRegistration';
import Login from './components/all_login/Login';










function AppContent() {
  const location = useLocation();

  const initialRender = React.useRef(true);



  const hideFooter = location.pathname.includes("/register") || location.pathname.includes("/unauthorized") || location.pathname.includes("/login");
  const hideNavBar = location.pathname.includes("/register") || location.pathname.includes("/unauthorized") || location.pathname.includes("/login");

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UserDashBord" element={<UserDashBord />} />
        </Routes>
        {!hideFooter && <Footer />}
    </>
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
