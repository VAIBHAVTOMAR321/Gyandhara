import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../all_login/LanguageContext'
import '../../assets/css/home.css'

function Home() {
  const { language } = useLanguage()

  const content = {
    en: {
      heroTitle: "Stream of Knowledge",
      heroSubtitle: "Welcome to Gyandhara - Your gateway to unlimited learning. Explore diverse courses, connect with expert instructors, and transform your future.",
      heroImg: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
      exploreBtn: "Explore Courses",
      joinBtn: "Join Now",
      streamsTitle: "Our Knowledge Streams",
      streams: [
        {
          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
          title: "Academic Learning",
          desc: "Structured courses covering fundamental to advanced concepts in various subjects."
        },
        {
          img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop",
          title: "Technical Skills",
          desc: "Master programming, web development, data science and emerging technologies."
        },
        {
          img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
          title: "Community Learning",
          desc: "Join study groups, participate in discussions, and learn from peers worldwide."
        },
        {
          img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop",
          title: "Skill Development",
          desc: "Practical workshops and hands-on projects to build real-world expertise."
        }
      ],
      schoolsTitle: "Partner Schools",
      schoolsSubtitle: "Join leading educational institutions that trust Gyandhara for their digital learning journey",
      schoolFeatures: [
        { icon: "bi-school", title: "School Registration", desc: "Register your institution and get dedicated dashboard" },
        { icon: "bi-journal-text", title: "Course Management", desc: "Create and manage courses for your students" },
        { icon: "bi-people-fill", title: "Student Tracking", desc: "Monitor student progress and performance" },
        { icon: "bi-bar-chart-line", title: "Analytics", desc: "Detailed reports on learning outcomes" }
      ],
      registerSchoolBtn: "Register Your School",
      featuresTitle: "Why Choose Gyandhara?",
      features: [
        { icon: "bi-collection-play", title: "Rich Content", desc: "Access thousands of quality learning resources" },
        { icon: "bi-person-check", title: "Expert Instructors", desc: "Learn from industry professionals" },
        { icon: "bi-globe", title: "Global Community", desc: "Connect with learners worldwide" },
        { icon: "bi-award", title: "Certificates", desc: "Earn recognized certifications" }
      ]
    },
    hi: {
      heroTitle: "ज्ञान की धारा",
      heroSubtitle: "Gyandhara में आपका स्वागत है - असीमित सीखने का द्वार। विविध पाठ्यक्रमों का अन्वेषण करें, विशेषज्ञ प्रशिक्षकों से जुड़ें, और अपना भविष्य बदलें।",
      heroImg: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
      exploreBtn: "पाठ्यक्रम देखें",
      joinBtn: "अभी जुड़ें",
      streamsTitle: "हमारी ज्ञान धाराएं",
      streams: [
        {
          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
          title: "शैक्षणिक अध्ययन",
          desc: "विभिन्न विषयों में मूल से उन्नत अवधारणाओं को कवर करने वाले व्यवस्थित पाठ्यक्रम।"
        },
        {
          img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop",
          title: "तकनीकी कौशल",
          desc: "प्रोग्रामिंग, वेब डेवलपमेंट, डेटा साइंस और उभरती तकनीकों में महारत हासिल करें।"
        },
        {
          img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
          title: "सामुदायिक सीखना",
          desc: "अध्ययन समूहों में शामिल हों, चर्चाओं में भाग लें, और दुनिया भर के साथियों से सीखें।"
        },
        {
          img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop",
          title: "कौशल विकास",
          desc: "वास्तविक विशेषज्ञता बनाने के लिए व्यावहारिक कार्यशालाएं और परियोजनाएं।"
        }
      ],
      schoolsTitle: "सहयोगी विद्यालय",
      schoolsSubtitle: "उन प्रमुख शैक्षणिक संस्थानों से जुड़ें जो Gyandhara पर भरोसा करते हैं",
      schoolFeatures: [
        { icon: "bi-school", title: "विद्यालय पंजीकरण", desc: "अपना संस्थान पंजीकृत करें और समर्पित डैशबोर्ड प्राप्त करें" },
        { icon: "bi-journal-text", title: "पाठ्यक्रम प्रबंधन", desc: "अपने छात्रों के लिए पाठ्यक्रम बनाएं और प्रबंधित करें" },
        { icon: "bi-people-fill", title: "छात्र ट्रैकिंग", desc: "छात्रों की प्रगति और प्रदर्शन की निगरानी करें" },
        { icon: "bi-bar-chart-line", title: "विश्लेषण", desc: "सीखने के परिणामों पर विस्तृत रिपोर्ट" }
      ],
      registerSchoolBtn: "अपना विद्यालय पंजीकृत करें",
      featuresTitle: "Gyandhara क्यों चुनें?",
      features: [
        { icon: "bi-collection-play", title: "समृद्ध सामग्री", desc: "हजारों गुणवत्ता सीखने के संसाधनों तक पहुंच" },
        { icon: "bi-person-check", title: "विशेषज्ञ प्रशिक्षक", desc: "उद्योग पेशेवरों से सीखें" },
        { icon: "bi-globe", title: "वैश्विक समुदाय", desc: "दुनिया भर के शिक्षार्थियों से जुड़ें" },
        { icon: "bi-award", title: "प्रमाणपत्र", desc: "मान्यता प्राप्त प्रमाणपत्र अर्जित करें" }
      ]
    }
  }

  const t = content[language] || content.en

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <section className="hero-section">
          <img src={t.heroImg} alt="Gyandhara Education" className="hero-image" />
          <div className="hero-content">
            <div className="hero-badge">🎓 Gyandhara Education</div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-gyandhara btn-primary-custom">
                <i className="bi bi-person-plus"></i> {t.joinBtn}
              </Link>
              <Link to="/register" className="btn-gyandhara btn-outline-custom">
                <i className="bi bi-compass"></i> {t.exploreBtn}
              </Link>
            </div>
          </div>
        </section>

        <section className="streams-section">
          <h2 className="streams-title">{t.streamsTitle}</h2>
          <div className="streams-grid">
            {t.streams.map((stream, index) => (
              <div className="stream-card" key={index}>
                <div className="stream-img-wrapper">
                  <img src={stream.img} alt={stream.title} className="stream-img" />
                </div>
                <h3>{stream.title}</h3>
                <p>{stream.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="schools-section">
          <div className="schools-header">
            <h2>{t.schoolsTitle}</h2>
            <p>{t.schoolsSubtitle}</p>
          </div>
          <div className="schools-features-grid">
            {t.schoolFeatures.map((feature, index) => (
              <div className="school-feature-card" key={index}>
                <i className={`bi ${feature.icon} school-feature-icon`}></i>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="schools-cta">
            <Link to="/register" className="btn-school-register">
              <i className="bi bi-building"></i> {t.registerSchoolBtn}
            </Link>
          </div>
        </section>

        <section className="features-section">
          <h2 className="streams-title">{t.featuresTitle}</h2>
          <div className="features-grid">
            {t.features.map((feature, index) => (
              <div className="feature-item" key={index}>
                <i className={`bi ${feature.icon}`}></i>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home