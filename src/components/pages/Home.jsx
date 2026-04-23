import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../all_login/LanguageContext'
import '../../assets/css/home.css'

function Home() {
  const { language } = useLanguage()

  const content = {
    en: {
      heroTitle: "Stream of Knowledge",
      heroSubtitle: "Welcome to Gyandhara - Your comprehensive educational platform offering career guidance, skill development, and academic excellence for students, schools, and administrators.",
      heroImg: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
      exploreBtn: "Explore Now",
      joinBtn: "Register Today",
      
      // For Students Section
      studentTitle: "For Students 🎓",
      studentSubtitle: "Empower your future with comprehensive career guidance and learning resources",
      studentFeatures: [
        { icon: "bi-briefcase-fill", title: "Job Openings", desc: "Discover career opportunities across various industries and sectors" },
        { icon: "bi-book-fill", title: "10th & 12th Guidance", desc: "Expert guidance for board exams and stream selection" },
        { icon: "bi-trophy-fill", title: "Competitions", desc: "Participate in competitions and showcase your talents" },
        { icon: "bi-bookmark-check", title: "Government Schemes", desc: "Learn about educational schemes and benefits" },
        { icon: "bi-star-fill", title: "Occupation Details", desc: "Explore different career paths and opportunities" },
        { icon: "bi-chat-left-quote-fill", title: "Counseling", desc: "Get personalized career counseling from experts" },
        { icon: "bi-graph-up", title: "Grooming Classes", desc: "Develop professional and soft skills" },
        { icon: "bi-pencil-square", title: "Quizzes & Tests", desc: "Assess your knowledge with interactive quizzes" },
        { icon: "bi-calendar-event", title: "Seminars & Workshops", desc: "Attend training events and skill development workshops" },
        { icon: "bi-chat-dots-fill", title: "Support & Queries", desc: "Get support and raise your concerns to administrators" }
      ],

      // For Schools Section
      schoolTitle: "For Schools 🏫",
      schoolSubtitle: "Transform your institution's learning experience with Gyandhara's comprehensive platform",
      schoolFeatures: [
        { icon: "bi-house-check", title: "School Registration", desc: "Register your institution and get a dedicated dashboard" },
        { icon: "bi-people-fill", title: "Student Management", desc: "Efficiently manage student registrations and profiles" },
        { icon: "bi-question-circle-fill", title: "Quiz Creation", desc: "Create and manage quizzes for your students" },
        { icon: "bi-bar-chart-line-fill", title: "Performance Tracking", desc: "Monitor student progress and learning outcomes" }
      ],
      
      // Platform Benefits
      benefitsTitle: "Why Choose Gyandhara?",
      benefits: [
        { icon: "bi-collection-play", title: "Multi-Role Platform", desc: "Dedicated interfaces for students, schools, and administrators" },
        { icon: "bi-people-fill", title: "Comprehensive Services", desc: "Career guidance, academic support, and skill development" },
        { icon: "bi-lightbulb", title: "Career Oriented", desc: "Focus on job opportunities and professional growth" },
        { icon: "bi-shield-check", title: "Secure & Reliable", desc: "Safe platform for educational and career information" }
      ],

      // CTA
      getStartedBtn: "Get Started Today",
      learnMoreBtn: "Learn More"
    },
    hi: {
      heroTitle: "ज्ञान की धारा",
      heroSubtitle: "Gyandhara में आपका स्वागत है - एक व्यापक शैक्षिक मंच जो छात्रों, स्कूलों और प्रशासकों के लिए करियर मार्गदर्शन, कौशल विकास और शैक्षणिक उत्कृष्टता प्रदान करता है।",
      heroImg: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
      exploreBtn: "अब खोजें",
      joinBtn: "आज पंजीकृत करें",
      
      // For Students Section
      studentTitle: "छात्रों के लिए 🎓",
      studentSubtitle: "व्यापक करियर मार्गदर्शन और सीखने के संसाधनों से अपने भविष्य को सशक्त बनाएं",
      studentFeatures: [
        { icon: "bi-briefcase-fill", title: "नौकरी के अवसर", desc: "विभिन्न उद्योगों में करियर के अवसर खोजें" },
        { icon: "bi-book-fill", title: "10वीं और 12वीं मार्गदर्शन", desc: "बोर्ड परीक्षा और स्ट्रीम चयन में विशेषज्ञ मार्गदर्शन" },
        { icon: "bi-trophy-fill", title: "प्रतियोगिताएं", desc: "प्रतियोगिताओं में भाग लें और प्रतिभा प्रदर्शन करें" },
        { icon: "bi-bookmark-check", title: "सरकारी योजनाएं", desc: "शैक्षिक योजनाओं और लाभों के बारे में जानें" },
        { icon: "bi-star-fill", title: "व्यावसायिक विवरण", desc: "विभिन्न करियर पथों का अन्वेषण करें" },
        { icon: "bi-chat-left-quote-fill", title: "परामर्श", desc: "विशेषज्ञों से व्यक्तिगत करियर परामर्श प्राप्त करें" },
        { icon: "bi-graph-up", title: "संवारने की कक्षाएं", desc: "व्यावसायिक और नरम कौशल विकसित करें" },
        { icon: "bi-pencil-square", title: "क्विज और परीक्षा", desc: "इंटरैक्टिव क्विज के साथ अपना ज्ञान मूल्यांकन करें" },
        { icon: "bi-calendar-event", title: "सेमिनार और कार्यशाला", desc: "प्रशिक्षण कार्यक्रमों में भाग लें" },
        { icon: "bi-chat-dots-fill", title: "सहायता और प्रश्न", desc: "प्रशासकों से सहायता प्राप्त करें" }
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
        { icon: "bi-shield-check", title: "सुरक्षित और विश्वसनीय", desc: "शैक्षिक और करियर जानकारी के लिए सुरक्षित मंच" }
      ],

      // CTA
      getStartedBtn: "आज शुरुआत करें",
      learnMoreBtn: "अधिक जानें"
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
            <div className="hero-badge">🎓 Gyandhara - Educational Platform</div>
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
          <h2 className="section-title">{t.benefitsTitle}</h2>
          <div className="benefits-grid">
            {t.benefits.map((benefit, index) => (
              <div className="benefit-card" key={index}>
                <div className="benefit-icon">
                  <i className={`bi ${benefit.icon}`}></i>
                </div>
                <h4>{benefit.title}</h4>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section">
          <h2>Ready to Join Gyandhara?</h2>
          <p>Start your journey towards career excellence and academic success</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-gyandhara btn-primary-custom btn-lg">
              <i className="bi bi-rocket-fill"></i> {t.getStartedBtn}
            </Link>
            <Link to="/login" className="btn-gyandhara btn-outline-custom btn-lg">
              <i className="bi bi-box-arrow-in-right"></i> Sign In
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home