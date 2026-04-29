import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useLanguage } from '../all_login/LanguageContext'
import heroImg from "../../assets/images/CBSEimg.png";
import '../../assets/css/home.css'

function Home() {
  const { language } = useLanguage()

  const content = {
    en: {
    platformBadge: "🎓 Gyandhara - Educational Platform",
    heroTitle: "Stream of Knowledge",
  heroSubtitle: "Welcome to Gyandhara, your all-in-one educational ecosystem designed to bridge the gap between academic learning and real-world success. We believe that education is not just about passing exams; it is about acquiring the skills, confidence, and direction necessary to thrive in a rapidly evolving global landscape. Whether you are a student looking to master new technologies or a school aiming to streamline academic management, Gyandhara provides the tools you need to succeed.",
  heroImg: heroImg,
  exploreBtn: "Explore Now",
  joinBtn: "Register Today",
      
      // For Students Section
      studentTitle: "LMS For Students 🎓",
      studentSubtitle: "Empower your future with comprehensive career guidance and learning resources",
      studentFeatures: [
        { icon: "bi-book", title: "Course Content", desc: "Access high-quality educational materials and resources" },
        { icon: "bi-trophy-fill", title: "Competitions", desc: "Participate in competitions and showcase your talents" },
        { icon: "bi-journal-check", title: "Career Guidance", desc: "Expert guidance for your academic and career journey" },
        { icon: "bi-pencil-square", title: "Quiz & Tests", desc: "Assess your knowledge with interactive quizzes" },
        { icon: "bi-graph-up", title: "Grooming Classes", desc: "Develop professional and soft skills" },
        { icon: "bi-chat-left-quote-fill", title: "Counseling", desc: "Get personalized career counseling from experts" },
        { icon: "bi-bookmark-check", title: "Govt Schemes", desc: "Learn about educational schemes and benefits" },
        { icon: "bi-briefcase-fill", title: "Job Opportunities", desc: "Discover career opportunities across various sectors" },
        { icon: "bi-calendar-event", title: "Seminar & Workshop", desc: "Attend training events and skill development workshops" },
        { icon: "bi-camera-video-fill", title: "Live Session", desc: "Join interactive live sessions with experts" }
      ],

      // For Schools Section
      schoolTitle: "LMS For Schools 🏫",
      schoolSubtitle: "Transform your institution's learning experience with Gyandhara's comprehensive platform",
      schoolFeatures: [
        { icon: "bi-house-check", title: "School Registration", desc: "Register your institution and get a dedicated dashboard" },
        { icon: "bi-people-fill", title: "Student Management", desc: "Efficiently manage student registrations and profiles" },
        { icon: "bi-question-circle-fill", title: "Events And Activities", desc: "Create and manage events and activities for your students" },
        { icon: "bi-bar-chart-line-fill", title: "Performance Tracking", desc: "Monitor student progress and learning outcomes" }
      ],
      
      // Platform Benefits
      benefitsTitle: "Why Choose Gyandhara?",
      benefits: [
        { icon: "bi-collection-play", title: "Multi-Role Platform", desc: "Dedicated interfaces for students, schools, and administrators" },
        { icon: "bi-people-fill", title: "Comprehensive Services", desc: "Career guidance, academic support, and skill development" },
        { icon: "bi-lightbulb", title: "Career Oriented", desc: "Focus on job opportunities and professional growth" },
        { icon: "bi-shield-check", title: "Secure & Reliable", desc: "Safe platform for educational and career information" },
        { icon: "bi-book-half", title: "Multiple Courses", desc: "Access a wide range of academic and skill-based courses" },
        { icon: "bi-chat-dots-fill", title: "24/7 Text Support", desc: "Round-the-clock text assistance for all your queries" },
        { icon: "bi-bar-chart-fill", title: "Data Analysis", desc: "Detailed insights and analytics for your learning journey" },
        { icon: "bi-award-fill", title: "Rewards & Certification", desc: "Get recognized for your success with verified certificates" }
      ],

      // CTA
      readyTitle: "Ready to Join Gyandhara?",
      readySub: "Start your journey towards career excellence and academic success",
      getStartedBtn: "Get Started Today",
      learnMoreBtn: "Learn More",
      signInBtn: "Sign In"
    },
    hi: {
      platformBadge: "🎓 ज्ञानधारा - शैक्षिक मंच",
      heroTitle: "ज्ञान की धारा",
      heroSubtitle: "ज्ञानधारा में आपका स्वागत है, आपका ऑल-इन-वन शैक्षिक पारिस्थितिकी तंत्र जो शैक्षणिक सीखने और वास्तविक दुनिया की सफलता के बीच की खाई को पाटने के लिए डिज़ाइन किया गया है। हमारा मानना है कि शिक्षा केवल परीक्षा पास करने के बारे में नहीं है; यह एक तेजी से विकसित हो रहे वैश्विक परिदृश्य में पनपने के लिए आवश्यक कौशल, आत्मविश्वास और दिशा प्राप्त करने के बारे में है। चाहे आप नई तकनीकों में महारत हासिल करने के इच्छुक छात्र हों या शैक्षणिक प्रबंधन को सुव्यवस्थित करने का लक्ष्य रखने वाला स्कूल, ज्ञानधारा आपको सफल होने के लिए आवश्यक उपकरण प्रदान करता है।",
      heroImg: heroImg,
      exploreBtn: "अब खोजें",
      joinBtn: "आज पंजीकृत करें",
      
      // For Students Section
      studentTitle: "छात्रों के लिए 🎓",
      studentSubtitle: "व्यापक करियर मार्गदर्शन और सीखने के संसाधनों से अपने भविष्य को सशक्त बनाएं",
      studentFeatures: [
        { icon: "bi-book", title: "कोर्स कंटेंट", desc: "उच्च गुणवत्ता वाली शैक्षिक सामग्री और संसाधनों तक पहुंच प्राप्त करें" },
        { icon: "bi-trophy-fill", title: "प्रतियोगिताएं", desc: "प्रतियोगिताओं में भाग लें और प्रतिभा प्रदर्शन करें" },
        { icon: "bi-journal-check", title: "करियर मार्गदर्शन", desc: "आपकी शैक्षणिक और करियर यात्रा के लिए विशेषज्ञ मार्गदर्शन" },
        { icon: "bi-pencil-square", title: "क्विज और टेस्ट", desc: "इंटरैक्टिव क्विज के साथ अपना ज्ञान मूल्यांकन करें" },
        { icon: "bi-graph-up", title: "संवारने की कक्षाएं", desc: "व्यावसायिक और नरम कौशल विकसित करें" },
        { icon: "bi-chat-left-quote-fill", title: "परामर्श", desc: "विशेषज्ञों से व्यक्तिगत करियर परामर्श प्राप्त करें" },
        { icon: "bi-bookmark-check", title: "सरकारी योजनाएं", desc: "शैक्षिक योजनाओं और लाभों के बारे में जानें" },
        { icon: "bi-briefcase-fill", title: "नौकरी के अवसर", desc: "विभिन्न क्षेत्रों में करियर के अवसर खोजें" },
        { icon: "bi-calendar-event", title: "सेमिनार और कार्यशाला", desc: "प्रशिक्षण कार्यक्रमों में भाग लें" },
        { icon: "bi-chat-dots-fill", title: "सहायता और प्रश्न", desc: "प्रशासकों से सहायता प्राप्त करें" },
        { icon: "bi-camera-video-fill", title: "लाइव सेशन", desc: "विशेषज्ञों के साथ इंटरैक्टिव लाइव सत्रों में शामिल हों" }
      ],

      // For Schools Section
      schoolTitle: "स्कूलों के लिए 🏫",
      schoolSubtitle: "Gyandhara के व्यापक मंच के साथ अपने संस्थान के शिक्षण अनुभव को बदलें",
      schoolFeatures: [
        { icon: "bi-house-check", title: "स्कूल पंजीकरण", desc: "अपने संस्थान को पंजीकृत करें और समर्पित डैशबोर्ड प्राप्त करें" },
        { icon: "bi-people-fill", title: "छात्र प्रबंधन", desc: "छात्र पंजीकरण और प्रोफाइल को कुशलतापूर्वक प्रबंधित करें" },
        { icon: "bi-question-circle-fill", title: "क्विज निर्माण", desc: "अपने छात्रों के लिए क्विज बनाएं और प्रबंधित करें" },
        { icon: "bi-bar-chart-line-fill", title: "प्रदर्शन ट्रैकिंग", desc: "छात्र की प्रगति और सीखने के परिणामों की निगरानी करें" }
      ],
      
      // Platform Benefits
      benefitsTitle: "Gyandhara को क्यों चुनें?",
      benefits: [
        { icon: "bi-collection-play", title: "बहु-भूमिका मंच", desc: "छात्रों, स्कूलों और प्रशासकों के लिए समर्पित इंटरफेस" },
        { icon: "bi-people-fill", title: "व्यापक सेवाएं", desc: "करियर मार्गदर्शन, शैक्षणिक सहायता और कौशल विकास" },
        { icon: "bi-lightbulb", title: "करियर केंद्रित", desc: "नौकरी के अवसरों और व्यावसायिक वृद्धि पर ध्यान केंद्रित" },
        { icon: "bi-shield-check", title: "सुरक्षित और विश्वसनीय", desc: "शैक्षिक और करियर जानकारी के लिए सुरक्षित मंच" },
        { icon: "bi-book-half", title: "एकाधिक पाठ्यक्रम", desc: "शैक्षणिक और कौशल-आधारित पाठ्यक्रमों की विस्तृत श्रृंखला तक पहुँचें" },
        { icon: "bi-chat-dots-fill", title: "24/7 टेक्स्ट सपोर्ट", desc: "आपके सभी प्रश्नों के लिए चौबीसों घंटे टेक्स्ट सहायता" },
        { icon: "bi-bar-chart-fill", title: "डेटा विश्लेषण", desc: "आपकी सीखने की यात्रा के लिए विस्तृत जानकारी और विश्लेषण" },
        { icon: "bi-award-fill", title: "पुरस्कार और प्रमाणन", desc: "सत्यापित प्रमाणपत्रों के साथ अपनी सफलता के लिए पहचान प्राप्त करें" }
      ],

      // CTA
      readyTitle: "क्या आप ज्ञानधारा से जुड़ने के लिए तैयार हैं?",
      readySub: "करियर की उत्कृष्टता और शैक्षणिक सफलता की ओर अपनी यात्रा शुरू करें",
      getStartedBtn: "आज शुरुआत करें",
      learnMoreBtn: "अधिक जानें",
      signInBtn: "साइन इन करें"
    }
  }

  const t = content[language] || content.en

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <img src={t.heroImg} alt="Gyandhara Education" className="hero-image" />
          <div className="hero-content">
            <div className="hero-badge">{t.platformBadge}</div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-gyandhara btn-primary-custom">
                <i className="bi bi-person-plus"></i> {t.joinBtn}
              </Link>
              <Link to="/login" className="btn-gyandhara btn-outline-custom-btn">
                <i className="bi bi-box-arrow-in-right"></i> {t.learnMoreBtn}
              </Link>
            </div>
          </div>
        </section>

        {/* For Students Section */}
        <section className="role-section student-section">
          <div className="role-header">
            <h2>{t.studentTitle}</h2>
            <p>{t.studentSubtitle}</p>
          </div>
          <div className="role-features-grid">
            {t.studentFeatures.map((feature, index) => (
              <div className="role-feature-card" key={index}>
                <div className="role-feature-icon-wrapper">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For Schools Section */}
        <section className="role-section school-section">
          <div className="role-header">
            <h2>{t.schoolTitle}</h2>
            <p>{t.schoolSubtitle}</p>
          </div>
          <div className="role-features-grid">
            {t.schoolFeatures.map((feature, index) => (
              <div className="role-feature-card" key={index}>
                <div className="role-feature-icon-wrapper">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Benefits Section */}
        <section className="benefits-section">
          <Container>
            <h2 className="section-title text-center mb-5">{t.benefitsTitle}</h2>
            <Row className="g-4">
              {t.benefits.map((benefit, index) => (
                <Col lg={3} md={6} sm={12} key={index}>
                  <div className="benefit-card h-100 border-0 shadow-sm">
                    <div className="benefit-icon">
                      <i className={`bi ${benefit.icon}`}></i>
                    </div>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section">
          <h2>{t.readyTitle}</h2>
          <p>{t.readySub}</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-gyandhara btn-primary-custom btn-lg">
              <i className="bi bi-rocket-fill"></i> {t.getStartedBtn}
            </Link>
            <Link to="/login" className="btn-gyandhara btn-outline-custom btn-lg">
              <i className="bi bi-box-arrow-in-right"></i> {t.signInBtn}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home