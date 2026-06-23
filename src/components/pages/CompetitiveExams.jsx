import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function CompetitiveExams({ language }) {
  const navigate = useNavigate()
  const content = {
    en: {
      title: "Competitive Exam Test Series",
      subtitle: "Prepare for your dream job with our comprehensive test series for all major competitive exams",
      exams: [
        { icon: "bi-journal-text", title: "UPSC", desc: "Civil Services Examination preparation with mock tests and study material", color: "blue" },
        { icon: "bi-journal-text", title: "UKPSC", desc: "Uttarakhand Provincial Services exam series with practice tests", color: "orange" },
        { icon: "bi-journal-text", title: "SSC", desc: "Staff Selection Commission exams CGL, CHSL, JE with complete test series", color: "green" },
        { icon: "bi-shield-fill", title: "Defence (NDA/CDS/AFCAT)", desc: "NDA, CDS, AFCAT preparation with subject-wise mock tests", color: "purple" },
        { icon: "bi-journal-medical", title: "CAT/MAT/CMAT", desc: "Management entrance exam preparation with mock tests and analysis", color: "blue" },
        { icon: "bi-building", title: "State Recruitment Exams", desc: "State-wise recruitment exams with comprehensive test series", color: "orange" },
        { icon: "bi-mortarboard-fill", title: "Teaching Eligibility Exams", desc: "CTET, UPTET, BEd entrance exam preparation", color: "green" },
        { icon: "bi-person-badge-fill", title: "Police & Paramilitary", desc: "Police recruitment exams with physical training and mock tests", color: "purple" }
      ]
    },
    hi: {
      title: "प्रतियोगी परीक्षा टेस्ट सीरीज़",
      subtitle: "सभी प्रमुख प्रतियोगी परीक्षाओं के लिए हमारी व्यापक टेस्ट सीरीज़ के साथ अपने सपने की नौकरी की तैयारी करें",
      exams: [
        { icon: "bi-journal-text", title: "यूपीएससी", desc: "मॉक टेस्ट और स्टडी मैटेरियल के साथ सिविल सर्विसेज़ परीक्षा की तैयारी", color: "blue" },
        { icon: "bi-journal-text", title: "यूकेपीएससी", desc: "उत्तराखंड प्रोविंसियल सर्विसेज़ एग्ज़ाम सीरीज़ के साथ प्रैक्टिस टेस्ट", color: "orange" },
        { icon: "bi-journal-text", title: "एसएससी", desc: "कर्मचारी चयन आयोग परीक्षा सीज़ेल, चेचएसएल, जेए टेस्ट सीरीज़ के साथ पूर्ण तैयारी", color: "green" },
        { icon: "bi-shield-fill", title: "रक्षा (एनडीए/सीडीएस/एएफसीएटी)", desc: "विषयवार मॉक टेस्ट के साथ एनडीए, सीडीएस, एएफसीएटी की तैयारी", color: "purple" },
        { icon: "bi-journal-medical", title: "कैट/एमएटी/सीएमएटी", desc: "प्रबंधन प्रवेश परीक्षा की तैयारी मॉक टेस्ट और विश्लेषण के साथ", color: "blue" },
        { icon: "bi-building", title: "राज्य भर्ती परीक्षा", desc: "राज्य-वार भर्ती परीक्षा व्यापक टेस्ट सीरीज़ के साथ", color: "orange" },
        { icon: "bi-mortarboard-fill", title: "शिक्षा योग्यता परीक्षा", desc: "सीटीईटी, यूपीटीईटी, बीएड प्रवेश परीक्षा की तैयारी", color: "green" },
        { icon: "bi-person-badge-fill", title: "पुलिस और पैरामिलिट्री", desc: "भारी शारीरिक प्रशिक्षण और मॉक टेस्ट के साथ पुलिस भर्ती परीक्षा", color: "purple" }
      ]
    }
  }

  const t = content[language] || content.en

  return (
    <section className="competitive-exams-section role-section-school">
      <div className="role-header">
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </div>
      <Row className="g-4">
        {t.exams.map((exam, index) => (
          <Col lg={3} md={6} sm={12} key={index}>
            <div 
              className={`benefit-card card-${exam.color} h-100 border-0 shadow-sm exam-card`}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/Competitive')}
            >
              <div className={`benefit-icon icon-${exam.color}`}>
                <i className={`bi ${exam.icon}`}></i>
              </div>
              <h4>{exam.title}</h4>
              <p>{exam.desc}</p>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default CompetitiveExams