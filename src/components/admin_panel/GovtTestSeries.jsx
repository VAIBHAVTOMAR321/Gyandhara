import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import "../../assets/css/admindashboard.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import AdminLeftNav from "./AdminLeftNav";
import AdminHeader from "./AdminHeader";

const GovtTestSeries = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <AdminLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <div className="main-content-dash">
        <AdminHeader toggleSidebar={toggleSidebar} />

        <div className="dashboard-content">
          <Container fluid className="dashboard-box">
            <div className="d-flex justify-content-between align-items-center mb-4 page-header">
              <div className="d-flex align-items-center all-en-box gap-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => navigate("/AdminDashboard")}
                >
                  <FaArrowLeft className="me-1" />
                  Dashboard
                </Button>

                <h4 className="mb-0">Government Test Series</h4>
              </div>
            </div>

            {/* Page Content */}
            <div className="text-center py-5">
              <h5>Government Test Series</h5>
              <p className="text-muted">
                Your Government Test Series content will appear here.
              </p>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default GovtTestSeries;