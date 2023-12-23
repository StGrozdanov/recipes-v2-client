import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './scss/index.scss';
import "animate.css/animate.min.css";
import reportWebVitals from './reportWebVitals';
import ScrollUponRedirect from './components/ScrollUponRedirect/ScrollUponRedirect';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollUponRedirect />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
