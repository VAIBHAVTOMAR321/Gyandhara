import React, { useState, useContext } from "react";
import { Nav, Offcanvas, Collapse } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaImages,
  FaUsers,
  FaBook,
  FaBuilding,
  FaImage,
  FaTools,
  FaComments,
  FaCube,
  FaProjectDiagram,
  FaServer,
  FaUserCircle,
  FaCalendarAlt,
  FaPlusSquare,
  FaListUl,
  FaEdit,
  FaMusic,
  FaGlassCheers,
  FaChalkboardTeacher,
  FaIndustry,
  FaQuestionCircle,
  FaTrophy,
  FaBriefcase,
  FaGraduationCap
} from "react-icons/fa";
import axios from "axios";

import "../../assets/css/UserLeftNav.css";
import { Link } from "react-router-dom";
import gyandharaLogo from "../../assets/images/gyandharalogo.jpeg";
import {
  FaInfoCircle,
  FaBullseye,
  FaTasks
} from "react-icons/fa";

import { useAuth } from "../all_login/AuthContext";
import { useNavigate } from "react-router-dom";




const UserLeftNav = ({ sidebarOpen, setSidebarOpen, isMobile, isTablet }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(user ? user.role : null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

const menuItems = [
    {
      icon: <FaTachometerAlt />,
      label: "DASHBOARD",
      path: "/UserDashboard",
      active: true,
    },
    
     {
      icon: <FaComments />,
      label: "Send Query",
      path: "/SendQuery",
      active: true,
    },
    {
      icon: <FaGraduationCap />,
      label: "Quiz",
      path: "/UserQuiz",
    },
    {
      icon: <FaTrophy />,
      label: "Competition",
      path: "/Competition",
    },
    {
      icon: <FaBriefcase />,
      label: "Jobs & Seminars",
      path: "/JobOpenings",
    },
    {
      icon: <FaCalendarAlt />,
      label: "Events",
      path: "/UserEvents",
    },
    {
      icon: <FaUserCircle />,
      label: "PROFILE",
      path: "/UserProfile",
    },
    {
      icon: <FaChalkboardTeacher />,
      label: "Career Guidance",
      submenu: [
        {
          label: "12th Guidance",
          path: "/TwelfthGuidance",
          icon: <FaPlusSquare />,
        },
         {
          label: "10th Guidance",
          path: "/TenthGuidance",
          icon: <FaPlusSquare />,
        },
      ],
    },
     {
      icon: <FaBuilding />,
      label: "Government Schemes",
      path: "/GovernmentSchemes",
    },
     {
      icon: <FaChalkboardTeacher />,
      label: "Grooming Classes",
      path: "/GroomingClasses",
    },
    {
      icon: <FaUsers />,
      label: "School Competitions",
      path: "/SchoolCompetitions",
    },
   
   
     
     
   ];

  //  Auto-close sidebar when switching to mobile or tablet

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`user-left-nav ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <div className="sidebar-header">
          {sidebarOpen ? (
            <div className="logo-container">
              <div className="logo">
                User DashBoard
                <img src={gyandharaLogo} alt="Gyan Dhara" className="header-logo" />
              </div>
            </div>
          ) : (
            <div className="logo-container logo-collapsed">
              <img src={gyandharaLogo} alt="Gyan Dhara" className="header-logo" />
            </div>
          )}
        </div>

        <Nav className="sidebar-nav flex-column">
          
        {menuItems
  .filter(item =>
    item.allowedRoles ? item.allowedRoles.includes(userRole) : true
  )
  .map((item, index) => (
    <div key={index}>
      {/* If submenu exists */}
      {item.submenu ? (
        <Nav.Link
          className={`nav-item ${item.active ? "active" : ""}`}
          onClick={() => toggleSubmenu(index)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.label}</span>
          <span className="submenu-arrow">
            {openSubmenu === index ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        </Nav.Link>
      ) : (
        <Link
          to={item.path}
          className={`nav-item nav-link ${item.active ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.label}</span>
        </Link>
      )}

      {/* Submenu */}
      {item.submenu && (
        <Collapse in={openSubmenu === index}>
          <div className="submenu-container-user">
            {item.submenu.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                to={subItem.path}
                className="submenu-item-user nav-link"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="submenu-icon">{subItem.icon}</span>
                <span className="nav-text br-text-sub">{subItem.label}</span>
              </Link>
            ))}
          </div>
        </Collapse>
      )}
    </div>
  ))}

        </Nav>

        <div className="sidebar-footer">
          <Nav.Link
            className="nav-item logout-btn"
            onClick={() => {
              if (typeof logout === "function") {
                logout();
                navigate("/login");
              }
            }}
          >
            <span className="nav-icon">
              <FaSignOutAlt />
            </span>
            <span className="nav-text">Logout</span>
          </Nav.Link>
        </div>
      </div>

      {/*  Mobile / Tablet Sidebar (Offcanvas) */}
  <Offcanvas
  show={(isMobile || isTablet) && sidebarOpen}
  onHide={() => setSidebarOpen(false)}
  className="mobile-sidebar-user"
  placement="start"
  backdrop={true}
  scroll={false}
  enforceFocus={false} //  ADD THIS LINE — fixes close button focus issue
>
  <Offcanvas.Header closeButton className="br-offcanvas-header">
    <Offcanvas.Title className="br-off-title">Menu</Offcanvas.Title>
  </Offcanvas.Header>

  <Offcanvas.Body className="br-offcanvas">
    <Nav className="flex-column">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.submenu ? (
            <Nav.Link
              className={`nav-item ${item.active ? "active" : ""}`}
              onClick={() => toggleSubmenu(index)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text br-nav-text-mob">{item.label}</span>
              <span className="submenu-arrow">
                {openSubmenu === index ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </Nav.Link>
          ) : (
            <Link
              to={item.path}
              className={`nav-item nav-link ${item.active ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text br-nav-text-mob">{item.label}</span>
            </Link>
          )}

          {item.submenu && (
            <Collapse in={openSubmenu === index}>
              <div className="submenu-container-user">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.path}
                    className="submenu-item nav-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="nav-text">{subItem.label}</span>
                  </Link>
                ))}
              </div>
            </Collapse>
          )}
        </div>
      ))}
    </Nav>
  </Offcanvas.Body>
</Offcanvas>

    </>
  );
};

export default UserLeftNav;