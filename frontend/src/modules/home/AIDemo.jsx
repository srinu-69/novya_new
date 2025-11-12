// import React, { useState, useEffect, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function AIDemo() {
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const chatEndRef = useRef(null);

//   const handleAsk = () => {
//     if (!question.trim() && !imagePreview) return;

//     const userMessage = {
//       sender: 'user',
//       text: question || '[Image uploaded]',
//       image: imagePreview,
//     };
//     setChatHistory((prev) => [...prev, userMessage]);
//     setQuestion('');
//     setImagePreview(null);
//     setIsTyping(true);

//     setTimeout(() => {
//       const aiReply = {
//         sender: 'ai',
//         text: imagePreview
//           ? 'AI scanned the image and says: "This looks like an electric circuit diagram."'
//           : `Here's an explanation for "${userMessage.text}"`,
//         videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//         quizLink: 'https://quizizz.com/',
//       };
//       setChatHistory((prev) => [...prev, aiReply]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setImagePreview(url);
//     }
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory, isTyping]);

//   return (
//     <section style={{ backgroundColor: '#F4F8FB', padding: '1rem', height: '100%' }}>
//       <div
//         style={{
//           background: '#fff',
//           borderRadius: '12px',
//           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//           padding: '1rem',
//           fontSize: '0.9rem',
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <h6
//           style={{
//             fontWeight: 'bold',
//             textAlign: 'center',
//             marginBottom: '10px',
//             color: '#2D5D7B',
//           }}
//         >
//           🤖 AI Chat Assistant
//         </h6>

//         {/* Chat Area */}
//         <div
//           style={{
//             flex: 1,
//             overflowY: 'auto',
//             background: '#F9FBFD',
//             borderRadius: '8px',
//             padding: '0.5rem',
//             marginBottom: '0.5rem',
//           }}
//         >
//           {chatHistory.map((msg, index) => (
//             <div
//               key={index}
//               style={{
//                 display: 'flex',
//                 justifyContent:
//                   msg.sender === 'user' ? 'flex-end' : 'flex-start',
//                 marginBottom: '10px',
//               }}
//             >
//               {msg.sender === 'ai' && (
//                 <div style={{ marginRight: '8px', fontSize: '1.2rem' }}>🤖</div>
//               )}
//               <div
//                 style={{
//                   backgroundColor:
//                     msg.sender === 'user' ? '#2D5D7B' : '#E4ECF1',
//                   color: msg.sender === 'user' ? '#fff' : '#000',
//                   borderRadius: '12px',
//                   padding: '8px 12px',
//                   maxWidth: '75%',
//                   fontSize: '0.85rem',
//                 }}
//               >
//                 {msg.image && (
//                   <img
//                     src={msg.image}
//                     alt="uploaded"
//                     style={{
//                       width: '100%',
//                       maxHeight: '120px',
//                       objectFit: 'contain',
//                       borderRadius: '6px',
//                       marginBottom: '6px',
//                     }}
//                   />
//                 )}
//                 <div>{msg.text}</div>
//                 {msg.sender === 'ai' && msg.videoLink && (
//                   <div style={{ marginTop: '6px' }}>
//                     <a
//                       href={msg.videoLink}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         marginRight: '5px',
//                         fontSize: '0.75rem',
//                         padding: '4px 8px',
//                         textDecoration: 'none',
//                         border: '1px solid #0d6efd',
//                         borderRadius: '6px',
//                         color: '#0d6efd',
//                       }}
//                     >
//                       🎥 Video
//                     </a>
//                     <a
//                       href={msg.quizLink}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         fontSize: '0.75rem',
//                         padding: '4px 8px',
//                         textDecoration: 'none',
//                         border: '1px solid #198754',
//                         borderRadius: '6px',
//                         color: '#198754',
//                       }}
//                     >
//                       🧠 Quiz
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//               <div style={{ marginRight: '8px', fontSize: '1.2rem' }}>🤖</div>
//               <div
//                 style={{
//                   backgroundColor: '#E4ECF1',
//                   color: '#000',
//                   borderRadius: '12px',
//                   padding: '8px 12px',
//                   fontSize: '0.85rem',
//                   display: 'flex',
//                   gap: '3px',
//                 }}
//               >
//                 <span style={dotStyle}></span>
//                 <span style={{ ...dotStyle, animationDelay: '0.2s' }}></span>
//                 <span style={{ ...dotStyle, animationDelay: '0.4s' }}></span>
//               </div>
//             </div>
//           )}

//           <div ref={chatEndRef} />
//         </div>

//         {/* Input Area */}
//         <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
//           <input
//             type="text"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
//             placeholder="Ask or upload image..."
//             style={{
//               flex: 1,
//               borderRadius: '10px',
//               border: '1px solid #ccc',
//               padding: '6px 10px',
//             }}
//           />

//           <label
//             style={{
//               fontWeight: 'bold',
//               padding: '6px 10px',
//               border: '1px solid #ced4da',
//               borderRadius: '8px',
//               backgroundColor: '#f8f9fa',
//               cursor: 'pointer',
//             }}
//           >
//             📷
//             <input
//               type="file"
//               accept="image/*"
//               capture="environment"
//               hidden
//               onChange={handleImageChange}
//             />
//           </label>

//           <button
//             onClick={handleAsk}
//             style={{
//               backgroundColor: '#2D5D7B',
//               color: '#fff',
//               fontWeight: '600',
//               border: 'none',
//               padding: '6px 16px',
//               borderRadius: '10px',
//             }}
//           >
//             Send
//           </button>
//         </div>

//         {imagePreview && (
//           <div style={{ textAlign: 'center', marginTop: '8px' }}>
//             <img
//               src={imagePreview}
//               alt="preview"
//               style={{ maxHeight: '100px', borderRadius: '6px' }}
//             />
//             <p style={{ fontSize: '0.75rem', color: '#6c757d', margin: 0 }}>
//               Image ready to send
//             </p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// // Typing dot animation inline style
// const dotStyle = {
//   height: '8px',
//   width: '8px',
//   backgroundColor: '#444',
//   borderRadius: '50%',
//   display: 'inline-block',
//   animation: 'blink 1.4s infinite both',
//   '@keyframes blink': {
//     '0%': { opacity: 0.2 },
//     '20%': { opacity: 1 },
//     '100%': { opacity: 0.2 },
//   },
// };

// export default AIDemo;





import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

function AIDemo() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const chatEndRef = useRef(null);

  const handleAsk = () => {
    if (!question.trim() && !imagePreview) return;

    const userMessage = {
      sender: 'user',
      text: question || '[Image uploaded]',
      image: imagePreview,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion('');
    setImagePreview(null);
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        sender: 'ai',
        text: imagePreview
          ? t('aidemo.ai.imageResponse')
          : t('aidemo.ai.textResponse', { question: userMessage.text }),
        videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        quizLink: 'https://quizizz.com/',
      };
      setChatHistory((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  return (
    <section style={{ backgroundColor: '#F4F8FB', padding: '1rem', height: '100%' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          fontSize: '0.9rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h6
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '10px',
            color: '#2D5D7B',
          }}
        >
          {t('aidemo.header')}
        </h6>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#F9FBFD',
            borderRadius: '8px',
            padding: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent:
                  msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{ marginRight: '8px', fontSize: '1.2rem' }}>🤖</div>
              )}
              <div
                style={{
                  backgroundColor:
                    msg.sender === 'user' ? '#2D5D7B' : '#E4ECF1',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  maxWidth: '75%',
                  fontSize: '0.85rem',
                }}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt={t('aidemo.uploadedImageAlt')}
                    style={{
                      width: '100%',
                      maxHeight: '120px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      marginBottom: '6px',
                    }}
                  />
                )}
                <div>{msg.text}</div>
                {msg.sender === 'ai' && msg.videoLink && (
                  <div style={{ marginTop: '6px' }}>
                    <a
                      href={msg.videoLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        marginRight: '5px',
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        textDecoration: 'none',
                        border: '1px solid #0d6efd',
                        borderRadius: '6px',
                        color: '#0d6efd',
                      }}
                    >
                      {t('aidemo.videoLink')}
                    </a>
                    <a
                      href={msg.quizLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        textDecoration: 'none',
                        border: '1px solid #198754',
                        borderRadius: '6px',
                        color: '#198754',
                      }}
                    >
                      {t('aidemo.quizLink')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ marginRight: '8px', fontSize: '1.2rem' }}>🤖</div>
              <div
                style={{
                  backgroundColor: '#E4ECF1',
                  color: '#000',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  gap: '3px',
                }}
              >
                <span style={dotStyle}></span>
                <span style={{ ...dotStyle, animationDelay: '0.2s' }}></span>
                <span style={{ ...dotStyle, animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder={t('aidemo.placeholder')}
            style={{
              flex: 1,
              borderRadius: '10px',
              border: '1px solid #ccc',
              padding: '6px 10px',
            }}
          />

          <label
            style={{
              fontWeight: 'bold',
              padding: '6px 10px',
              border: '1px solid #ced4da',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
            }}
          >
            {t('aidemo.uploadIcon')}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={handleImageChange}
            />
          </label>

          <button
            onClick={handleAsk}
            style={{
              backgroundColor: '#2D5D7B',
              color: '#fff',
              fontWeight: '600',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '10px',
            }}
          >
            {t('aidemo.sendButton')}
          </button>
        </div>

        {imagePreview && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <img
              src={imagePreview}
              alt={t('aidemo.previewAlt')}
              style={{ maxHeight: '100px', borderRadius: '6px' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6c757d', margin: 0 }}>
              {t('aidemo.imageReady')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Typing dot animation inline style
const dotStyle = {
  height: '8px',
  width: '8px',
  backgroundColor: '#444',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'blink 1.4s infinite both',
  '@keyframes blink': {
    '0%': { opacity: 0.2 },
    '20%': { opacity: 1 },
    '100%': { opacity: 0.2 },
  },
};

export default AIDemo;