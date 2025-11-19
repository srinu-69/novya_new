
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './modules/student/fontawesome'; // ✅ Correct import path
import { QuizProvider } from './modules/student/QuizContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ Router for App


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
     <QuizProvider>
      <App />
    </QuizProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals(); // ✅ Optional performance logging
