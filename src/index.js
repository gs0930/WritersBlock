import React from 'react';
// import { hydrate } from 'react-dom';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  // document.getElementById('root')
);

reportWebVitals();
