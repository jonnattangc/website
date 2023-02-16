import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
// <GoogleReCaptchaProvider reCaptchaKey="6LcjmTMkAAAAAKaIib9Pp0EF6ggS-vd0vl26ImK9" language="es">
// </GoogleReCaptchaProvider>

ReactDOM.render(
  <React.StrictMode>    
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
