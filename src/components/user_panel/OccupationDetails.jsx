import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Accordion, Tab, Nav } from "react-bootstrap";
import { useAuth } from "../all_login/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft, FaGraduationCap, FaChalkboardTeacher, FaBalanceScale, FaHospital, FaCode,
  FaCheckCircle, FaChartLine, FaUsers, FaMapMarkerAlt, FaUniversity, FaShieldAlt, FaLandmark,
  FaFlask, FaMoneyBillWave, FaUserShield, FaFlag, FaTrain, FaClipboardList, FaRocket, FaLightbulb,
  FaInfoCircle, FaCog, FaUserTie, FaBuilding, FaBook, FaAward, FaCertificate, FaClock, FaBookOpen,
  FaStar, FaTrophy, FaNewspaper, FaPaintBrush, FaHeartbeat, FaMicrochip, FaNetworkWired, FaDatabase,
  FaRobot, FaDna, FaSeedling, FaLaptopMedical, FaBusAlt, FaUserGraduate, FaBriefcase, FaChartBar
} from 'react-icons/fa';
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import '../../assets/css/OccupationDetails.css';

const OccupationDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { uniqueId, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const { occupation, course, prepType: initialPrepType, stream, percentage } = location.state || {};
  const [prepType, setPrepType] = useState(initialPrepType || 'private');
  const [selectedGovtExam, setSelectedGovtExam] = useState('UPSC');
  const examRoadmapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Occupation details data
  const getOccupationDetails = (occupationName) => {
    const occupations = {
      'Teacher': {
        title: 'Teacher',
        icon: <FaChalkboardTeacher className="text-primary" />,
        description: 'Teachers educate students at various levels, from primary schools to universities. They play a crucial role in shaping the future of students.',
        salaryRange: '₹3-15 LPA',
        growthPotential: 'High',
        demandLevel: 'Very High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with good percentage', duration: '2 Years', tips: ['Focus on favorite subjects', 'Participate in teaching activities', 'Develop communication skills'] },
          { step: 2, title: 'Pursue Bachelor\'s Degree', description: 'Complete BA/B.Sc/B.Com in your preferred subject', duration: '3 Years', tips: ['Choose relevant subjects', 'Maintain good record', 'Participate in college events'] },
          { step: 3, title: 'Complete B.Ed', description: 'Pursue Bachelor of Education (B.Ed) from a recognized university', duration: '2 Years', tips: ['Choose a good B.Ed college', 'Learn teaching methodologies', 'Practice teaching'] },
          { step: 4, title: 'Clear Teaching Exams', description: 'Clear CTET/TET/STET exams as per your state requirements', duration: '3-6 Months', tips: ['Study previous papers', 'Learn child psychology', 'Take mock tests'] },
          { step: 5, title: 'Apply for Teaching Positions', description: 'Apply for government or private school teaching positions', duration: 'Ongoing', tips: ['Prepare for interviews', 'Create a good resume', 'Apply to multiple schools'] }
        ],
        exams: [
          { name: 'CTET (Central Teacher Eligibility Test)', eligibility: 'B.Ed qualified', frequency: 'Twice a year', difficulty: 'Moderate' },
          { name: 'TET (Teacher Eligibility Test)', eligibility: 'B.Ed qualified', frequency: 'State-wise', difficulty: 'Moderate' },
          { name: 'STET (State Teacher Eligibility Test)', eligibility: 'B.Ed qualified', frequency: 'State-wise', difficulty: 'Moderate' },
          { name: 'UGC NET (for College Teachers)', eligibility: 'Post-Graduation', frequency: 'Twice a year', difficulty: 'High' }
        ],
        skills: ['Communication Skills', 'Patience', 'Subject Knowledge', 'Classroom Management', 'Creativity', 'Adaptability'],
        careerPath: [
          { level: 'Primary Teacher', experience: '0-5 years', salary: '₹3-6 LPA' },
          { level: 'TGT (Trained Graduate Teacher)', experience: '5-10 years', salary: '₹6-10 LPA' },
          { level: 'PGT (Post Graduate Teacher)', experience: '10-15 years', salary: '₹10-15 LPA' },
          { level: 'Vice Principal', experience: '15-20 years', salary: '₹12-18 LPA' },
          { level: 'Principal', experience: '20+ years', salary: '₹15-25 LPA' }
        ],
        topColleges: [
          { name: 'Delhi University', location: 'Delhi', ranking: 'Top 10' },
          { name: 'Jamia Millia Islamia', location: 'Delhi', ranking: 'Top 20' },
          { name: 'Banaras Hindu University', location: 'Varanasi', ranking: 'Top 10' },
          { name: 'University of Mumbai', location: 'Mumbai', ranking: 'Top 20' }
        ]
      },
      'Lawyer': {
        title: 'Lawyer',
        icon: <FaBalanceScale className="text-primary" />,
        description: 'Lawyers provide legal advice and representation to individuals, businesses, and government agencies. They play a vital role in the justice system.',
        salaryRange: '₹4-50 LPA',
        growthPotential: 'Very High',
        demandLevel: 'High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with good percentage', duration: '2 Years', tips: ['Focus on humanities subjects', 'Develop reading habits', 'Participate in debates'] },
          { step: 2, title: 'Pursue LLB', description: 'Complete LLB (3 years after graduation) or BA LLB (5 years integrated)', duration: '3-5 Years', tips: ['Choose a good law college', 'Study case laws', 'Participate in moot courts'] },
          { step: 3, title: 'Enroll with Bar Council', description: 'Register with State Bar Council after completing LLB', duration: '1-2 Months', tips: ['Complete bar council formalities', 'Get bar council registration', 'Start internship'] },
          { step: 4, title: 'Complete Internship', description: 'Intern under a senior lawyer to gain practical experience', duration: '1-2 Years', tips: ['Learn court procedures', 'Draft documents', 'Build professional network'] },
          { step: 5, title: 'Start Practice', description: 'Start independent practice or join a law firm', duration: 'Ongoing', tips: ['Build client base', 'Specialize in a field', 'Continue learning'] }
        ],
        exams: [
          { name: 'CLAT (Common Law Admission Test)', eligibility: '12th Pass', frequency: 'Once a year', difficulty: 'High' },
          { name: 'AILET (All India Law Entrance Test)', eligibility: '12th Pass', frequency: 'Once a year', difficulty: 'High' },
          { name: 'LSAT (Law School Admission Test)', eligibility: '12th Pass', frequency: 'Multiple times', difficulty: 'Moderate' }
        ],
        skills: ['Analytical Skills', 'Communication Skills', 'Research Skills', 'Negotiation Skills', 'Ethics', 'Problem Solving'],
        careerPath: [
          { level: 'Junior Lawyer', experience: '0-5 years', salary: '₹4-10 LPA' },
          { level: 'Senior Lawyer', experience: '5-10 years', salary: '₹10-25 LPA' },
          { level: 'Associate Partner', experience: '10-15 years', salary: '₹25-50 LPA' },
          { level: 'Senior Partner', experience: '15-20 years', salary: '₹50-100 LPA' },
          { level: 'Judge', experience: '20+ years', salary: '₹15-25 LPA (Government)' }
        ],
        topColleges: [
          { name: 'National Law School of India University', location: 'Bangalore', ranking: 'Top 1' },
          { name: 'NALSAR University of Law', location: 'Hyderabad', ranking: 'Top 3' },
          { name: 'National Law University', location: 'Delhi', ranking: 'Top 5' },
          { name: 'Faculty of Law, Delhi University', location: 'Delhi', ranking: 'Top 10' }
        ]
      },
      'Software Engineer': {
        title: 'Software Engineer',
        icon: <FaCode className="text-primary" />,
        description: 'Software engineers design, develop, and maintain software applications. They are the backbone of the IT industry.',
        salaryRange: '₹6-25 LPA',
        growthPotential: 'Very High',
        demandLevel: 'Very High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with Physics, Chemistry, and Mathematics', duration: '2 Years', tips: ['Focus on mathematics', 'Learn basic programming', 'Participate in coding competitions'] },
          { step: 2, title: 'Pursue B.Tech/BCA', description: 'Complete B.Tech in Computer Science/IT or BCA', duration: '3-4 Years', tips: ['Learn programming languages', 'Build projects', 'Participate in hackathons'] },
          { step: 3, title: 'Learn Programming Languages', description: 'Master programming languages like Java, Python, JavaScript, etc.', duration: 'Ongoing', tips: ['Practice daily', 'Build real projects', 'Contribute to open source'] },
          { step: 4, title: 'Build Portfolio', description: 'Create a portfolio of projects to showcase your skills', duration: '6-12 Months', tips: ['Work on diverse projects', 'Document your work', 'Host code on GitHub'] },
          { step: 5, title: 'Apply for Jobs', description: 'Apply for software engineering positions in IT companies', duration: 'Ongoing', tips: ['Prepare for interviews', 'Practice coding problems', 'Network with professionals'] }
        ],
        exams: [
          { name: 'GATE (Graduate Aptitude Test in Engineering)', eligibility: 'B.Tech', frequency: 'Once a year', difficulty: 'High' },
          { name: 'Company-specific Tests', eligibility: 'B.Tech/BCA', frequency: 'As per recruitment', difficulty: 'Moderate to High' }
        ],
        skills: ['Programming Languages', 'Problem Solving', 'Data Structures', 'Algorithms', 'Database Management', 'Version Control'],
        careerPath: [
          { level: 'Junior Developer', experience: '0-3 years', salary: '₹6-10 LPA' },
          { level: 'Senior Developer', experience: '3-6 years', salary: '₹10-18 LPA' },
          { level: 'Tech Lead', experience: '6-10 years', salary: '₹18-25 LPA' },
          { level: 'Engineering Manager', experience: '10-15 years', salary: '₹25-40 LPA' },
          { level: 'CTO', experience: '15+ years', salary: '₹40-100 LPA' }
        ],
        topColleges: [
          { name: 'IIT Bombay', location: 'Mumbai', ranking: 'Top 1' },
          { name: 'IIT Delhi', location: 'Delhi', ranking: 'Top 2' },
          { name: 'IIT Madras', location: 'Chennai', ranking: 'Top 3' },
          { name: 'BITS Pilani', location: 'Pilani', ranking: 'Top 5' }
        ]
      },
      'Doctor': {
        title: 'Doctor',
        icon: <FaHospital className="text-primary" />,
        description: 'Doctors diagnose and treat illnesses, injuries, and diseases. They are essential healthcare professionals.',
        salaryRange: '₹10-50 LPA',
        growthPotential: 'Very High',
        demandLevel: 'Very High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with Physics, Chemistry, and Biology', duration: '2 Years', tips: ['Focus on biology', 'Develop empathy', 'Volunteer in healthcare settings'] },
          { step: 2, title: 'Clear NEET Exam', description: 'Qualify NEET (National Eligibility cum Entrance Test)', duration: '1 Year', tips: ['Understand NCERT thoroughly', 'Solve previous papers', 'Take mock tests'] },
          { step: 3, title: 'Complete MBBS', description: 'Pursue MBBS (Bachelor of Medicine and Bachelor of Surgery)', duration: '5.5 Years', tips: ['Focus on studies', 'Gain clinical experience', 'Develop bedside manners'] },
          { step: 4, title: 'Complete Internship', description: 'Complete mandatory internship in hospital', duration: '1 Year', tips: ['Learn from professionals', 'Handle real cases', 'Build patient relationships'] },
          { step: 5, title: 'Specialize (Optional)', description: 'Pursue MD/MS for specialization', duration: '3 Years', tips: ['Choose specialization wisely', 'Clear NEET PG', 'Join good hospital'] }
        ],
        exams: [
          { name: 'NEET (National Eligibility cum Entrance Test)', eligibility: '12th with PCB', frequency: 'Once a year', difficulty: 'Very High' },
          { name: 'NEET PG', eligibility: 'MBBS', frequency: 'Once a year', difficulty: 'Very High' },
          { name: 'AIIMS PG', eligibility: 'MBBS', frequency: 'Once a year', difficulty: 'Very High' }
        ],
        skills: ['Medical Knowledge', 'Empathy', 'Communication Skills', 'Problem Solving', 'Decision Making', 'Patience'],
        careerPath: [
          { level: 'Junior Resident', experience: '0-3 years', salary: '₹10-15 LPA' },
          { level: 'Senior Resident', experience: '3-6 years', salary: '₹15-25 LPA' },
          { level: 'Consultant', experience: '6-10 years', salary: '₹25-40 LPA' },
          { level: 'Senior Consultant', experience: '10-15 years', salary: '₹40-60 LPA' },
          { level: 'Head of Department', experience: '15+ years', salary: '₹60-100 LPA' }
        ],
        topColleges: [
          { name: 'AIIMS Delhi', location: 'Delhi', ranking: 'Top 1' },
          { name: 'CMC Vellore', location: 'Vellore', ranking: 'Top 3' },
          { name: 'AFMC Pune', location: 'Pune', ranking: 'Top 5' },
          { name: 'Maulana Azad Medical College', location: 'Delhi', ranking: 'Top 10' }
        ]
      }
    };

    return occupations[occupationName] || {
      title: occupationName,
      icon: <FaGraduationCap className="text-primary" />,
      description: `Detailed information about ${occupationName} career path.`,
      salaryRange: 'Varies',
      growthPotential: 'High',
      demandLevel: 'High',
      steps: [
        { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with good percentage', duration: '2 Years', tips: ['Focus on academics', 'Develop skills'] },
        { step: 2, title: 'Pursue Degree', description: 'Complete relevant bachelor\'s degree', duration: '3-4 Years', tips: ['Choose a good college', 'Build skills'] },
        { step: 3, title: 'Gain Experience', description: 'Gain practical experience through internships', duration: '1-2 Years', tips: ['Learn from professionals', 'Build network'] },
        { step: 4, title: 'Start Career', description: 'Start your professional career', duration: 'Ongoing', tips: ['Apply for jobs', 'Continue learning'] }
      ],
      exams: [],
      skills: ['Communication Skills', 'Problem Solving', 'Teamwork', 'Adaptability'],
      careerPath: [
        { level: 'Entry Level', experience: '0-3 years', salary: 'Varies' },
        { level: 'Mid Level', experience: '3-7 years', salary: 'Varies' },
        { level: 'Senior Level', experience: '7-12 years', salary: 'Varies' },
        { level: 'Leadership', experience: '12+ years', salary: 'Varies' }
      ],
      topColleges: []
    };
  };

  const occupationDetails = occupation ? getOccupationDetails(occupation) : null;

   // Get related occupations based on course
   const getRelatedOccupations = () => {
     const allOccupations = ['Teacher', 'Lawyer', 'Software Engineer', 'Doctor'];
     if (!course) {
       return allOccupations.filter(occ => occ !== occupation);
     }
     const courseLower = course.toLowerCase();
     const courseOccupationMap = {
       'mbbs': ['Doctor'],
       'medicine': ['Doctor'],
       'medical': ['Doctor'],
       'b.tech': ['Software Engineer'],
       'b.sc': ['Teacher', 'Software Engineer'],
       'bca': ['Software Engineer'],
       'm.sc': ['Teacher', 'Software Engineer'],
       'engineering': ['Software Engineer'],
       'bba': ['Teacher', 'Lawyer'],
       'b.com': ['Teacher', 'Lawyer'],
       'b com': ['Teacher', 'Lawyer'],
       'ba': ['Teacher', 'Lawyer'],
       'b a': ['Teacher', 'Lawyer'],
       'llb': ['Lawyer'],
       'law': ['Lawyer'],
       'b.ed': ['Teacher'],
       'b ed': ['Teacher'],
       'education': ['Teacher'],
     };
     let related = [];
     for (const [key, occs] of Object.entries(courseOccupationMap)) {
       if (courseLower.includes(key)) {
         related = [...related, ...occs];
       }
     }
     if (related.length === 0) {
       return allOccupations.filter(occ => occ !== occupation);
     }
     return [...new Set(related)].filter(occ => occ !== occupation);
   };

   // Government Exam Details
   const getGovtExamDetails = (examType) => {
     const govtExams = {
       'IIT-JEE': {
         title: 'IIT-JEE (Joint Entrance Examination)',
         icon: <FaCog className="text-warning" />,
         description: 'Crack JEE to get admission in IITs, NITs, and other top government engineering colleges for B.Tech',
         fullPath: '12th (PCM) → JEE Main → JEE Advanced → Admission in IIT/NIT/IIIT → B.Tech → Campus Placement → Job in Top Companies',
         steps: [
           { step: 1, title: 'Complete 12th with PCM', description: 'Complete 12th with Physics, Chemistry, Mathematics (PCM)', duration: '2 Years', tips: ['Focus on NCERT concepts', 'Practice numerical problems', 'Consider joining coaching'] },
           { step: 2, title: 'Prepare for JEE Main', description: 'Cover complete syllabus of Physics, Chemistry, Mathematics for JEE Main', duration: '1-2 Years', tips: ['Solve previous papers', 'Take mock tests', 'Work on speed and accuracy'] },
           { step: 3, title: 'Appear for JEE Main', description: 'Appear for JEE Main exam (conducted twice a year)', duration: 'Exam Season', tips: ['Manage time effectively', 'Attempt easier questions first', 'Stay calm'] },
           { step: 4, title: 'Prepare for JEE Advanced (if qualified)', description: 'If qualified in JEE Main, prepare for JEE Advanced for IITs', duration: '6-12 Months', tips: ['Focus on conceptual clarity', 'Solve advanced problems', 'Take mock tests'] },
           { step: 5, title: 'Participate in Counseling', description: 'Participate in JoSAA counseling for college allocation', duration: 'After Results', tips: ['Fill choices wisely', 'Research colleges', 'Consider branch preferences'] },
           { step: 6, title: 'Complete B.Tech', description: 'Complete B.Tech from allocated college', duration: '4 Years', tips: ['Focus on studies', 'Do internships', 'Build projects'] },
           { step: 7, title: 'Campus Placement', description: 'Appear for campus placement in top companies', duration: 'Final Year', tips: ['Prepare resume', 'Practice daily', 'Apply to multiple companies'] }
         ],
         colleges: [
           { name: 'IIT Bombay', location: 'Mumbai', ranking: 'Top 1', seats: 'Total ~1000' },
           { name: 'IIT Delhi', location: 'Delhi', ranking: 'Top 2', seats: 'Total ~900' },
           { name: 'IIT Madras', location: 'Chennai', ranking: 'Top 3', seats: 'Total ~800' },
           { name: 'IIT Kharagpur', location: 'Kharagpur', ranking: 'Top 4', seats: 'Total ~900' },
           { name: 'IIT Kanpur', location: 'Kanpur', ranking: 'Top 5', seats: 'Total ~800' },
         ],
         skills: ['Physics', 'Chemistry', 'Mathematics', 'Problem Solving', 'Analytical Thinking', 'Time Management']
       },
       'NEET': {
         title: 'NEET (National Eligibility cum Entrance Test)',
         icon: <FaHospital className="text-danger" />,
         description: 'Crack NEET to get admission in Government Medical Colleges for MBBS/BDS',
         fullPath: '12th (PCB) → NEET → Admission in Government Medical College → MBBS → Internship → License → Job/PG',
         steps: [
           { step: 1, title: 'Complete 12th with PCB', description: 'Complete 12th with Physics, Chemistry, Biology (PCB)', duration: '2 Years', tips: ['Focus on biology', 'Understand NCERT thoroughly', 'Practice diagrams'] },
           { step: 2, title: 'Prepare for NEET', description: 'Cover complete syllabus of PCB for NEET', duration: '1-2 Years', tips: ['Study NCERT books', 'Solve previous papers', 'Take mock tests'] },
           { step: 3, title: 'Appear for NEET', description: 'Appear for NEET exam (conducted once a year)', duration: 'Exam Season', tips: ['Manage time', 'Maintain accuracy', 'Stay calm'] },
           { step: 4, title: 'Participate in Counseling', description: 'Participate in All India Quota counseling for college allocation', duration: 'After Results', tips: ['Fill choices wisely', 'Research colleges', 'Consider location'] },
           { step: 5, title: 'Complete MBBS', description: 'Complete MBBS course (5.5 years including internship)', duration: '5.5 Years', tips: ['Focus on studies', 'Gain clinical experience', 'Build skills'] },
           { step: 6, title: 'Complete Internship', description: 'Complete mandatory internship in hospital', duration: '1 Year', tips: ['Learn from professionals', 'Handle real cases', 'Build patient relationships'] },
           { step: 7, title: 'Start Career', description: 'Start working as doctor or pursue PG', duration: 'Ongoing', tips: ['Get medical license', 'Apply for jobs', 'Consider specialization'] }
         ],
         colleges: [
           { name: 'AIIMS Delhi', location: 'Delhi', ranking: 'Top 1', seats: 'Total ~100' },
           { name: 'Maulana Azad Medical College', location: 'Delhi', ranking: 'Top 2', seats: 'Total ~250' },
           { name: 'VMMC & Safdarjung Hospital', location: 'Delhi', ranking: 'Top 3', seats: 'Total ~200' },
           { name: 'Lady Hardinge Medical College', location: 'Delhi', ranking: 'Top 10', seats: 'Total ~200' },
         ],
         skills: ['Biology', 'Physics', 'Chemistry', 'Medical Knowledge', 'Empathy', 'Communication Skills']
       },
       'UPSC': {
         title: 'UPSC (Union Public Service Commission)',
         icon: <FaLandmark className="text-primary" />,
         description: 'Crack Civil Services Exam to become IAS, IPS, IFS and other Group A services',
         fullPath: 'Graduate → UPSC CSE (Pre+Mains+Interview) → IAS/IPS/IFS → Service',
         steps: [
           { step: 1, title: 'Complete Graduation', description: 'Complete graduation in any stream', duration: '3 Years', tips: ['Choose interesting subjects', 'Read newspapers regularly', 'Develop analytical skills'] },
           { step: 2, title: 'Basic Preparation', description: 'Start basic preparation - read NCERTs, basic books', duration: '6-12 Months', tips: ['Start with NCERT basics', 'Focus on current affairs', 'Practice answer writing'] },
           { step: 3, title: 'Deep Preparation', description: 'Deep preparation for all subjects', duration: '1-2 Years', tips: ['Read standard books', 'Practice answer writing', 'Join test series'] },
           { step: 4, title: 'Appear for UPSC Prelims', description: 'Appear for UPSC Prelims (CSAT + GS)', duration: 'Exam Season', tips: ['Clear cutoff', 'Manage time well', 'Stay focused'] },
           { step: 5, title: 'Appear for UPSC Mains', description: 'Appear for UPSC Mains (9 papers)', duration: 'Exam Season', tips: ['Structure answers properly', 'Write neatly', 'Manage time'] },
           { step: 6, title: 'Interview', description: 'Appear for Personality Test/Interview', duration: '30-45 Minutes', tips: ['Be confident', 'Stay updated on current affairs', 'Be honest'] },
           { step: 7, title: 'Service Allocation', description: 'Get allocated to service based on rank', duration: 'After Result', tips: ['Fill service preferences', 'Stay updated', 'Complete training'] }
         ],
         skills: ['Current Affairs', 'Analytical Skills', 'Communication', 'Leadership', 'Decision Making', 'Time Management']
       },
       'SSC': {
         title: 'SSC (Staff Selection Commission)',
         icon: <FaUserShield className="text-success" />,
         description: 'Crack SSC exams to get Group B and C government jobs',
         fullPath: '12th/Graduate → SSC Exams → Document Verification → Joining',
         steps: [
           { step: 1, title: 'Check Eligibility', description: 'Check eligibility for SSC exams (10th/12th/Graduate as per exam)', duration: 'Before Exam', tips: ['Check eligibility criteria', 'Choose correct exam', 'Verify age limit'] },
           { step: 2, title: 'Basic Preparation', description: 'Start preparation with basics of English, Math, Reasoning, GK', duration: '3-6 Months', tips: ['Start with NCERT basics', 'Practice daily', 'Learn formulas'] },
           { step: 3, title: 'Deep Preparation', description: 'Deep preparation for all sections', duration: '6-12 Months', tips: ['Solve previous papers', 'Take mock tests', 'Identify weak areas'] },
           { step: 4, title: 'Appear for Tier 1', description: 'Appear for CBT exam (Objective)', duration: 'Exam Season', tips: ['Clear cutoff', 'Manage time', 'Attempt all questions'] },
           { step: 5, title: 'Appear for Tier 2', description: 'Appear for Descriptive/Typing test', duration: 'After Tier 1', tips: ['Practice typing', 'Write essays', 'Practice English/Hindi'] },
           { step: 6, title: 'Document Verification', description: 'Submit documents for verification', duration: 'After Tier 2', tips: ['Keep documents ready', 'Verify details', 'Carry originals'] },
           { step: 7, title: 'Joining', description: 'Get joining letter and join department', duration: 'After DV', tips: ['Check official website', 'Report on time', 'Complete formalities'] }
         ],
         skills: ['Quantitative Aptitude', 'English', 'General Awareness', 'Reasoning', 'Computer Knowledge', 'Time Management']
       },
       'Banking': {
         title: 'Banking Exams (IBPS/SBI)',
         icon: <FaMoneyBillWave className="text-success" />,
         description: 'Crack Banking exams to get Officer/Clerk positions in Public Sector Banks',
         fullPath: 'Graduate → PO/Clerk Exam → GD/Interview → Appointment in Bank',
         steps: [
           { step: 1, title: 'Complete Graduation', description: 'Complete graduation in any stream', duration: '3 Years', tips: ['Maintain good percentage', 'Stay updated on banking news', 'Read financial news'] },
           { step: 2, title: 'Check Eligibility', description: 'Check eligibility for Banking exams', duration: 'Before Exam', tips: ['Check age limit', 'Verify required percentage', 'Confirm nationality'] },
           { step: 3, title: 'Basic Preparation', description: 'Start preparation with basics of Quant, Reasoning, English, GA', duration: '3-6 Months', tips: ['Learn formulas', 'Practice tables', 'Read newspapers'] },
           { step: 4, title: 'Appear for Preliminary', description: 'Appear for Prelims (Quant, Reasoning, English)', duration: 'Exam Season', tips: ['Clear cutoff', 'Manage time', 'Maintain accuracy'] },
           { step: 5, title: 'Appear for Mains', description: 'Appear for Mains (All sections + Computer)', duration: 'After Prelims', tips: ['Study thoroughly', 'Take mock tests', 'Improve speed'] },
           { step: 6, title: 'Group Discussion', description: 'Appear for Group Discussion', duration: 'After Mains', tips: ['Read current topics', 'Form opinions', 'Be polite'] },
           { step: 7, title: 'Personal Interview', description: 'Appear for Personal Interview', duration: 'After GD', tips: ['Be confident', 'Know about bank', 'Dress formally'] },
           { step: 8, title: 'Joining', description: 'Get joining and become PO/Clerk', duration: 'After Result', tips: ['Check website', 'Report on time', 'Complete training'] }
         ],
         skills: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge', 'Communication']
       },
       'Railway': {
         title: 'Railway Exams (RRB)',
         icon: <FaTrain className="text-warning" />,
         description: 'Crack RRB exams to get jobs in Indian Railways (Group C/D)',
         fullPath: '12th/Graduate → RRB Exam → Document Verification → Joining',
         steps: [
           { step: 1, title: 'Check Eligibility', description: 'Check eligibility for RRB exams (10th/12th/Graduate)', duration: 'Before Exam', tips: ['Check notification', 'Verify age limit', 'Confirm qualification'] },
           { step: 2, title: 'Basic Preparation', description: 'Start preparation with basics', duration: '2-3 Months', tips: ['Study NCERT', 'Practice math', 'Work on reasoning'] },
           { step: 3, title: 'Deep Preparation', description: 'Prepare for all subjects thoroughly', duration: '6-12 Months', tips: ['Solve previous papers', 'Take mock tests', 'Improve weak areas'] },
           { step: 4, title: 'Appear for CBT', description: 'Appear for Computer Based Test', duration: 'Exam Season', tips: ['Clear cutoff', 'Manage time', 'Maintain accuracy'] },
           { step: 5, title: 'Skill Test (if applicable)', description: 'Appear for Typing/Document verification', duration: 'After CBT', tips: ['Practice typing', 'Keep documents ready'] },
           { step: 6, title: 'Medical Examination', description: 'Clear medical examination', duration: 'After Skill Test', tips: ['Know medical standards', 'Stay fit', 'Be honest'] },
           { step: 7, title: 'Joining', description: 'Get joining and join Railway', duration: 'After Medical', tips: ['Check website', 'Report on time', 'Complete training'] }
         ],
         skills: ['Mathematics', 'General Intelligence', 'Reasoning', 'General Awareness', 'Basic English', 'Physical Fitness']
       },
       'StatePSC': {
         title: 'State PSC Exams',
         icon: <FaFlag className="text-info" />,
         description: 'Crack State PSC exams to get state government jobs',
         fullPath: 'Graduate → State PSC Exam → Interview → Joining',
         steps: [
           { step: 1, title: 'Complete Graduation', description: 'Complete graduation in any stream', duration: '3 Years', tips: ['Study strategically', 'Gain state-specific knowledge', 'Stay updated'] },
           { step: 2, title: 'Check State PSC Notification', description: 'Check notification for your state PSC exam', duration: 'When Notified', tips: ['Visit PSC website', 'Check eligibility', 'Know exam pattern'] },
           { step: 3, title: 'Prepare for Preliminary', description: 'Prepare for Preliminary exam (if applicable)', duration: '3-6 Months', tips: ['Study state syllabus', 'Solve previous papers', 'Take mock tests'] },
           { step: 4, title: 'Prepare for Mains', description: 'Prepare for Mains exam', duration: '6-12 Months', tips: ['Focus on state-specific topics', 'Practice answer writing', 'Study state issues'] },
           { step: 5, title: 'Interview', description: 'Appear for Personality Test', duration: 'After Mains', tips: ['Know your state', 'Be confident', 'Stay updated on state issues'] },
           { step: 6, title: 'Joining', description: 'Get joining in state department', duration: 'After Result', tips: ['Check website', 'Report on time', 'Complete formalities'] }
         ],
         skills: ['State-specific Knowledge', 'Current Affairs', 'General Studies', 'Communication', 'Leadership', 'Time Management']
       },
       'NDA': {
         title: 'NDA (National Defense Academy)',
         icon: <FaShieldAlt className="text-primary" />,
         description: 'Crack NDA to join Indian Defense Forces (Army, Navy, Air Force)',
         fullPath: '12th → NDA Exam → SSB Interview → Medical → Joining → Training',
         steps: [
           { step: 1, title: 'Complete 12th', description: 'Complete 12th in any stream (Science for Air Force/Navy)', duration: '2 Years', tips: ['Focus on fitness', 'Stay focused on studies', 'Stay updated on defense news'] },
           { step: 2, title: 'Apply for NDA', description: 'Apply for NDA when notification is out', duration: 'When Notified', tips: ['Check eligibility', 'Know exam pattern', 'Prepare required documents'] },
           { step: 3, title: 'Prepare for Written Exam', description: 'Prepare for Mathematics and General Ability', duration: '6-12 Months', tips: ['Study NCERT', 'Practice previous papers', 'Take mock tests'] },
           { step: 4, title: 'Appear for Written Exam', description: 'Appear for NDA written exam', duration: 'Exam Season', tips: ['Manage time', 'Attempt all questions', 'Stay calm'] },
           { step: 5, title: 'SSB Interview', description: 'Appear for Services Selection Board (SSB) interview', duration: '5 Days', tips: ['Be confident', 'Show leadership qualities', 'Be natural'] },
           { step: 6, title: 'Medical Examination', description: 'Clear medical examination', duration: 'During SSB', tips: ['Know medical standards', 'Stay fit', 'Be honest'] },
           { step: 7, title: 'Joining & Training', description: 'Join NDA for training', duration: '3 Years', tips: ['Stay disciplined', 'Focus on training', 'Build camaraderie'] }
         ],
         skills: ['Mathematics', 'General Knowledge', 'English', 'Physical Fitness', 'Leadership', 'Discipline']
       },
       'GATE': {
         title: 'GATE (Graduate Aptitude Test in Engineering)',
         icon: <FaFlask className="text-info" />,
         description: 'Crack GATE to get admission in M.Tech or PSU jobs',
         fullPath: 'Graduate (Engineering) → GATE → M.Tech/PSU Job',
         steps: [
           { step: 1, title: 'Complete B.Tech', description: 'Complete engineering graduation in your stream', duration: '4 Years', tips: ['Focus on studies', 'Build strong foundation', 'Learn basics'] },
           { step: 2, title: 'Check Eligibility', description: 'Check GATE eligibility for your stream', duration: 'Before Exam', tips: ['Verify GATE eligibility', 'Check relevant paper', 'Know exam pattern'] },
           { step: 3, title: 'Study GATE Syllabus', description: 'Cover complete syllabus according to your stream', duration: '6-12 Months', tips: ['Clear all concepts', 'Use standard books', 'Make notes'] },
           { step: 4, title: 'Prepare for GATE', description: 'Solve previous papers, take mock tests', duration: '6-12 Months', tips: ['Solve previous year papers', 'Take mock tests', 'Manage time'] },
           { step: 5, title: 'Appear for GATE', description: 'Appear for GATE exam', duration: 'Exam Season', tips: ['Manage time', 'Maintain accuracy', 'Stay calm'] },
           { step: 6, title: 'GATE Counseling', description: 'Participate in COAP/CCMT counseling', duration: 'After Result', tips: ['Fill choices', 'Research colleges', 'Set branch preferences'] },
           { step: 7, title: 'Complete M.Tech', description: 'Complete M.Tech or join PSU', duration: '2 Years', tips: ['Specialize in a field', 'Do projects', 'Build network'] }
         ],
         skills: ['Technical Knowledge', 'Problem Solving', 'Analytical Skills', 'Time Management', 'Core Engineering Concepts', 'Mathematics']
       }
     };
     return govtExams[examType] || null;
   };

   const govtExamTypes = ['IIT-JEE', 'NEET', 'UPSC', 'GATE', 'SSC', 'Banking', 'Railway', 'StatePSC', 'NDA'];

   const getFilteredExamTypesByStream = () => {
     if (stream === 'science') {
       return ['IIT-JEE', 'NEET', 'UPSC', 'GATE', 'Banking', 'SSC', 'Railway', 'StatePSC', 'NDA'];
     } else if (stream === 'commerce') {
       return ['UPSC', 'Banking', 'SSC', 'Railway', 'StatePSC', 'NDA'];
     } else if (stream === 'arts') {
       return ['UPSC', 'SSC', 'Banking', 'Railway', 'StatePSC', 'NDA'];
     } else if (stream === 'computer') {
       return ['IIT-JEE', 'NEET', 'UPSC', 'GATE', 'Banking', 'SSC', 'Railway', 'StatePSC', 'NDA'];
     }
     return govtExamTypes;
   };

   const filteredExamTypes = stream ? getFilteredExamTypesByStream() : govtExamTypes;

   // Update selectedGovtExam when stream or occupation changes
   useEffect(() => {
     const validExamTypes = ['IIT-JEE', 'NEET', 'UPSC', 'SSC', 'Banking', 'Railway', 'StatePSC', 'NDA', 'GATE'];
     if (stream && validExamTypes.includes(stream)) {
       setSelectedGovtExam(stream);
     } else if (occupation) {
       const occupationExamMap = {
         'Teacher': 'UPSC',
         'Doctor': 'NEET',
         'Software Engineer': 'IIT-JEE',
         'Lawyer': 'UPSC'
       };
       const defaultExam = occupationExamMap[occupation] || 'UPSC';
       setSelectedGovtExam(defaultExam);
     }
   }, [stream, occupation]);

  if (!occupation) {
    return (
      <div className="dashboard-container">
        <UserLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
        <div className="main-content-dash">
          <UserHeader toggleSidebar={toggleSidebar} />
          <Container className="dashboard-box mt-3">
            <Alert variant="warning">
              No occupation selected. Please go back and select an occupation.
            </Alert>
             <Button variant="outline-primary" onClick={() => navigate('/UserNotifications')}>
               <FaArrowLeft className="me-2" />
               Back to Guidance
             </Button>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <UserLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <div className="main-content-dash">
        <UserHeader toggleSidebar={toggleSidebar} />

        <Container className="dashboard-box mt-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading occupation details...</p>
            </div>
          ) : (
            <>
              {/* Occupation Header */}
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-box">
                    <Card.Body>
                       <div className="d-flex align-items-center">
                         <div className="occupation-icon-large me-4">
                           {occupationDetails.icon}
                         </div>
                         <div className="flex-grow-1">
                           <h2>{occupationDetails.title}</h2>
                           <p className="text-muted mb-2" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{occupationDetails.description}</p>
                           <div className="header-stats">
                             <div className="stat-item">
                               <FaChartLine className="me-1" /> Growth: {occupationDetails.growthPotential}
                             </div>
                             <div className="stat-item">
                               <FaUsers className="me-1" /> Demand: {occupationDetails.demandLevel}
                             </div>
                             <div className="stat-item">
                               <FaGraduationCap className="me-1" /> Salary: {occupationDetails.salaryRange}
                             </div>
                           </div>
                         </div>
                       </div>
                    </Card.Body>
                  </Card>
                </Col>
               </Row>

               {/* Tabs Section */}
               <Card className="shadow-box">
                 <Card.Body className="p-4">
                   <Tab.Container id="occupation-tabs" defaultActiveKey={prepType === 'govtJob' || prepType === 'govtCollege' ? 'govt-exams' : 'career-opportunities'}>
                     <Nav variant="tabs" className="mb-4">
                       {(prepType === 'govtJob' || prepType === 'govtCollege') && (
                         <Nav.Item>
                           <Nav.Link eventKey="govt-exams">
                             <FaShieldAlt className="me-2" />
                             Government Exam Prep
                           </Nav.Link>
                         </Nav.Item>
                       )}
                       <Nav.Item>
                         <Nav.Link eventKey="career-opportunities">
                           <FaRocket className="me-2" />
                           Career Opportunities
                         </Nav.Link>
                       </Nav.Item>
                       <Nav.Item>
                         <Nav.Link eventKey="step-by-step">
                           <FaClipboardList className="me-2" />
                           Step-by-Step Path
                         </Nav.Link>
                       </Nav.Item>
                       <Nav.Item>
                         <Nav.Link eventKey="skills-exams">
                           <FaStar className="me-2" />
                           Skills & Exams
                         </Nav.Link>
                       </Nav.Item>
                       <Nav.Item>
                         <Nav.Link eventKey="colleges">
                           <FaUniversity className="me-2" />
                           Top Colleges
                         </Nav.Link>
                       </Nav.Item>
                     </Nav>

                     <Tab.Content>
                       {/* Government Exams Tab */}
                       {(prepType === 'govtJob' || prepType === 'govtCollege') && (
                         <Tab.Pane eventKey="govt-exams">
                           <div className="mb-4">
                             <h5 className="mb-3">Government Exam Preparation</h5>
                             <p className="text-muted mb-4">
                               Select an exam type to see the complete roadmap and details.
                             </p>
                             <Row>
                               {filteredExamTypes.map((examType, index) => {
                                 const examDetails = getGovtExamDetails(examType);
                                 if (!examDetails) return null;
                                 return (
                                   <Col lg={4} md={6} sm={12} key={index} className="mb-4">
                                     <Card
                                       className="h-100 border exam-card"
                                       style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                       onClick={() => {
                                         setSelectedGovtExam(examType);
                                         setTimeout(() => {
                                           if (examRoadmapRef.current) {
                                             examRoadmapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                           }
                                         }, 100);
                                       }}
                                     >
                                       <Card.Body className="p-3">
                                         <div className="d-flex align-items-center gap-2 mb-2">
                                           <div className="icon-wrapper" style={{
                                             width: '45px', height: '45px', borderRadius: '8px',
                                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                                             background: 'linear-gradient(135deg, #13539d 0%, #1d71ce 100%)',
                                             fontSize: '1.2rem', color: 'white'
                                           }}>
                                             {examDetails.icon}
                                           </div>
                                           <h6 className="mb-0">{examDetails.title}</h6>
                                         </div>
                                         <p className="small text-muted mb-2">
                                           {examDetails.fullPath ? examDetails.fullPath.substring(0, 100) + '...' : ''}
                                         </p>
                                         <div className="d-flex justify-content-between align-items-center">
                                           <Badge bg="info">
                                             <FaChartLine className="me-1" />
                                             {examDetails.growthPotential || 'High'}
                                           </Badge>
                                         </div>
                                       </Card.Body>
                                     </Card>
                                   </Col>
                                 );
                               })}
                             </Row>
                           </div>

                           {selectedGovtExam && getGovtExamDetails(selectedGovtExam) && (
                             <div ref={examRoadmapRef} className="mt-4 pt-4 border-top">
                               <h5 className="mb-3">
                                 {selectedGovtExam} - Complete Roadmap
                               </h5>
                               <Card className="shadow-sm border-0" style={{ borderRadius: '10px' }}>
                                 <Card.Body className="p-4">
                                   <Alert variant="info" className="mb-4">
                                     <FaLightbulb className="me-2" />
                                     <strong>Complete Path:</strong> {getGovtExamDetails(selectedGovtExam).fullPath}
                                   </Alert>
                                   <p className="text-muted mb-4">{getGovtExamDetails(selectedGovtExam).description}</p>

                                   <h6 className="mb-3">Step-by-Step Preparation</h6>
                                   <Row>
                                     {getGovtExamDetails(selectedGovtExam).steps.map((step, idx) => (
                                       <Col md={6} key={idx}>
                                         <Card className="mb-3 border step-card">
                                           <Card.Body className="p-3">
                                             <div className="d-flex align-items-start gap-3">
                                               <div className="step-number">
                                                 <Badge bg="primary" className="rounded-circle p-3">
                                                   {step.step}
                                                 </Badge>
                                               </div>
                                               <div className="flex-grow-1">
                                                 <h6 className="mb-1">{step.title}</h6>
                                                 <p className="mb-2 fw-bold" style={{ fontSize: '1.1rem' }}>{step.description}</p>
                                                 <Badge bg="info" className="mb-2">{step.duration}</Badge>
                                                 <div className="mt-2">
                                                   <small className="text-muted d-block mb-1">Tips:</small>
                                                   <ul className="mb-0 ps-3 tips-list">
                                                     {step.tips.map((tip, tipIdx) => (
                                                       <li key={tipIdx} className="small text-muted">{tip}</li>
                                                     ))}
                                                   </ul>
                                                 </div>
                                               </div>
                                             </div>
                                           </Card.Body>
                                         </Card>
                                       </Col>
                                     ))}
                                   </Row>
                                 </Card.Body>
                               </Card>

                               {getGovtExamDetails(selectedGovtExam).colleges && getGovtExamDetails(selectedGovtExam).colleges.length > 0 && (
                                 <Card className="shadow-sm mb-4 border-0 mt-4" style={{ borderRadius: '10px' }}>
                                   <Card.Header className="bg-white border-0 pt-4 pb-0">
                                     <div className="d-flex align-items-center gap-2">
                                       <FaUniversity className="text-primary" />
                                       <h5 className="mb-0">Top Colleges</h5>
                                     </div>
                                   </Card.Header>
                                   <Card.Body className="p-4">
                                     <Row>
                                       {getGovtExamDetails(selectedGovtExam).colleges.map((college, idx) => (
                                         <Col lg={6} md={6} sm={12} key={idx} className="mb-4">
                                           <Card className="h-100 border college-card">
                                             <Card.Body className="p-3">
                                               <div className="d-flex justify-content-between align-items-start">
                                                 <div>
                                                   <h6 className="mb-1">{college.name}</h6>
                                                   <small className="text-muted">
                                                     <FaMapMarkerAlt className="me-1" /> {college.location}
                                                   </small>
                                                 </div>
                                                 <Badge bg="warning">{college.ranking}</Badge>
                                               </div>
                                             </Card.Body>
                                           </Card>
                                         </Col>
                                       ))}
                                     </Row>
                                   </Card.Body>
                                 </Card>
                               )}
                             </div>
                           )}

                           {!selectedGovtExam && (
                             <Alert variant="info">
                               <FaInfoCircle className="me-2" />
                               Please select an exam type to view details.
                             </Alert>
                           )}
                         </Tab.Pane>
                       )}

                       {/* Career Opportunities Tab */}
                       <Tab.Pane eventKey="career-opportunities">
                         <div className="mb-4">
                           <h5 className="mb-3">Available Career Opportunities</h5>
                           <p className="text-muted mb-4">
                             {course ? `Related to your course (${course}):` : 'Explore different career paths based on your interests:'}
                           </p>
                           <Row>
                             {getRelatedOccupations().map((occ, index) => {
                               const details = getOccupationDetails(occ);
                               return (
                                 <Col lg={4} md={6} sm={12} key={index} className="mb-4">
                                   <Card
                                     className="h-100 border career-opportunity-card"
                                     style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                     onClick={() => navigate('/OccupationDetails', { state: { occupation: occ, stream, percentage, course } })}
                                   >
                                     <Card.Body className="p-3">
                                       <div className="d-flex align-items-center gap-2 mb-2">
                                         <div className="icon-wrapper">
                                           {details.icon}
                                         </div>
                                         <h6 className="mb-0">{details.title}</h6>
                                       </div>
                                       <p className="small text-muted mb-2">
                                         {details.description.substring(0, 80)}...
                                       </p>
                                       <div className="d-flex justify-content-between align-items-center">
                                         <Badge bg="info">
                                           <FaChartLine className="me-1" />
                                           {details.growthPotential}
                                         </Badge>
                                       </div>
                                     </Card.Body>
                                   </Card>
                                 </Col>
                               );
                             })}
                           </Row>
                         </div>

                         {course && (
                           <div className="mb-4">
                             <h5 className="mb-3">Explore More Related Occupations</h5>
                             <div className="d-flex flex-wrap gap-2">
                               {getRelatedOccupations().map((occ, idx) => (
                                 <Button
                                   key={idx}
                                   variant="outline-primary"
                                   size="sm"
                                   onClick={() => navigate('/OccupationDetails', {
                                     state: { occupation: occ, stream, percentage, course }
                                   })}
                                 >
                                   {occ}
                                 </Button>
                               ))}
                             </div>
                           </div>
                         )}

                         <div className="mb-4">
                           <h5 className="mb-3">Career Progression: {occupationDetails.title}</h5>
                           <Row>
                             {occupationDetails.careerPath.map((level, index) => (
                               <Col lg={4} md={6} sm={12} key={index} className="mb-4">
                                 <Card className="h-100 border career-level-card">
                                   <Card.Body className="p-3 text-center">
                                     <div className="icon-wrapper">
                                       <FaTrophy />
                                     </div>
                                     <h6 className="mb-1">{level.level}</h6>
                                     <small className="text-muted d-block">{level.experience}</small>
                                     <small className="d-block text-primary fw-bold mt-1">{level.salary}</small>
                                   </Card.Body>
                                 </Card>
                               </Col>
                             ))}
                           </Row>
                         </div>
                       </Tab.Pane>

                       {/* Step-by-Step Guidance Tab */}
                       <Tab.Pane eventKey="step-by-step">
                         <h5 className="mb-3">Career Path: {occupationDetails.title}</h5>
                         <p className="text-muted mb-4">Follow these steps to build your career:</p>
                         <Row>
                           {occupationDetails.steps.map((step, index) => (
                             <Col lg={6} md={6} sm={12} key={index}>
                               <Card className="mb-3 border step-card">
                                 <Card.Body className="p-3">
                                   <div className="d-flex align-items-start gap-3">
                                     <div className="step-number">
                                       <Badge bg="primary" className="rounded-circle p-3">
                                         {step.step}
                                       </Badge>
                                     </div>
                                     <div className="flex-grow-1">
                                       <h6 className="mb-1">{step.title}</h6>
                                       <p className="mb-2 fw-bold" style={{ fontSize: '1.1rem' }}>{step.description}</p>
                                       <Badge bg="info" className="mb-2">{step.duration}</Badge>
                                       <div className="mt-2">
                                         <small className="text-muted d-block mb-1">Tips:</small>
                                         <ul className="mb-0 ps-3 tips-list">
                                           {step.tips.map((tip, idx) => (
                                             <li key={idx} className="small text-muted">{tip}</li>
                                           ))}
                                         </ul>
                                       </div>
                                     </div>
                                   </div>
                                 </Card.Body>
                               </Card>
                             </Col>
                           ))}
                         </Row>
                       </Tab.Pane>

                       {/* Skills & Exams Tab */}
                       <Tab.Pane eventKey="skills-exams">
                         <Row>
                           <Col md={6}>
                             <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                               <Card.Header className="bg-white border-0 pt-4 pb-0">
                                 <div className="d-flex align-items-center gap-2">
                                   <FaStar className="text-warning" />
                                   <h5 className="mb-0">Required Skills</h5>
                                 </div>
                               </Card.Header>
                               <Card.Body className="p-4">
                                 <div className="d-flex flex-wrap gap-2">
                                   {occupationDetails.skills.map((skill, index) => (
                                     <Badge key={index} bg="light" text="dark" className="p-2 fs-6" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                       <FaCheckCircle className="me-1 text-success" />
                                       {skill}
                                     </Badge>
                                   ))}
                                 </div>
                               </Card.Body>
                             </Card>
                           </Col>
                           <Col md={6}>
                             {occupationDetails.exams.length > 0 && (
                               <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                                 <Card.Header className="bg-white border-0 pt-4 pb-0">
                                   <div className="d-flex align-items-center gap-2">
                                     <FaClipboardList className="text-info" />
                                     <h5 className="mb-0">Entrance Exams</h5>
                                   </div>
                                 </Card.Header>
                                 <Card.Body className="p-4">
                                   {occupationDetails.exams.map((exam, index) => (
                                     <div key={index} className="mb-3 pb-3 border-bottom">
                                       <h6>{exam.name}</h6>
                                       <div className="d-flex flex-wrap gap-2">
                                         <Badge bg="info">Eligibility: {exam.eligibility}</Badge>
                                         <Badge bg="success">Frequency: {exam.frequency}</Badge>
                                         <Badge bg="warning">Difficulty: {exam.difficulty}</Badge>
                                       </div>
                                     </div>
                                   ))}
                                 </Card.Body>
                               </Card>
                             )}
                           </Col>
                         </Row>
                       </Tab.Pane>

                       {/* Top Colleges Tab */}
                       <Tab.Pane eventKey="colleges">
                         {occupationDetails.topColleges.length > 0 && (
                           <Row>
                             {occupationDetails.topColleges.map((college, index) => (
                               <Col md={6} lg={3} key={index} className="mb-4">
                                 <Card className="h-100 border college-card">
                                   <Card.Body className="p-3">
                                     <h6 className="mb-2">{college.name}</h6>
                                     <p className="mb-1 small text-muted">
                                       <FaMapMarkerAlt className="me-1" /> {college.location}
                                     </p>
                                     <Badge bg="success">{college.ranking}</Badge>
                                   </Card.Body>
                                 </Card>
                               </Col>
                             ))}
                           </Row>
                         )}
                       </Tab.Pane>
                     </Tab.Content>
                   </Tab.Container>
                 </Card.Body>
               </Card>

               {/* Back Button */}
               <div className="mt-4 text-left">
                 <Button variant="outline-secondary" size="lg" onClick={() => navigate(-1)}>
                   <FaArrowLeft className="me-2" /> Back to Career Selection
                 </Button>
               </div>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default OccupationDetails;
