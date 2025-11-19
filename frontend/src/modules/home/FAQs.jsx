
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
function FAQs() {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('faqs.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);
  
  const [openIndex, setOpenIndex] = useState(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [faqs, setFaqs] = useState([
    {
      question: t('faqs.questions.0.question'),
      answer: t('faqs.questions.0.answer')
    },
    {
      question: t('faqs.questions.1.question'),
      answer: t('faqs.questions.1.answer')
    },
    {
      question: t('faqs.questions.2.question'),
      answer: t('faqs.questions.2.answer')
    },
    {
      question: t('faqs.questions.3.question'),
      answer: t('faqs.questions.3.answer')
    },
    {
      question: t('faqs.questions.4.question'),
      answer: t('faqs.questions.4.answer')
    }
  ]);
 
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
 
  const handleAskQuestion = () => {
    if (!userQuestion.trim()) {
      toast.error(t('faqs.emptyQuestionError'));
      return;
    }
 
    setFaqs(prev => [
      { 
        question: userQuestion, 
        answer: t('faqs.userQuestionAnswer') 
      },
      ...prev
    ]);
    setUserQuestion('');
    toast.success(t('faqs.submitSuccess'));
  };
 
  return (
    <div className="faqs-container" style={{ paddingTop: '80px' }}>
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #F4F8FB, #E9F7FF)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#2D5D7B' }}>{t('faqs.header')}</h2>
            <p className="text-muted">{t('faqs.subtitle')}</p>
          </div>
 
          {/* Ask a Question Box */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-10 col-lg-8">
              <div
                className="p-4 shadow rounded bg-white"
                style={{ borderLeft: '5px solid #2D5D7B' }}
              >
                <h5 className="mb-3 fw-semibold" style={{ color: '#2D5D7B' }}>{t('faqs.askQuestionHeader')}</h5>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control rounded-start-pill px-4"
                    placeholder={t('faqs.placeholder')}
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                  />
                  <button
                    className="btn btn-primary rounded-end-pill px-4"
                    style={{ backgroundColor: '#2D5D7B', fontWeight: '600' }}
                    onClick={handleAskQuestion}
                  >
                    {t('faqs.submitButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          {/* FAQs Accordion */}
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div key={index} className="accordion-item mb-3 shadow-sm border-0 rounded">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    style={{
                      backgroundColor: '#fff',
                      color: '#2D5D7B',
                      fontWeight: '600',
                      fontSize: '1rem',
                      borderRadius: '8px'
                    }}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}>
                  <div className="accordion-body" style={{ backgroundColor: '#fff', color: '#333' }}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}
 
export default FAQs;