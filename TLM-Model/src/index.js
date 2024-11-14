import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import Grid from './Grid';
import Editor from './Editor';
import MosaicForm from './mosaicEditor';
import Login from './Login';
import { AlertasProvider } from './contexts/AlertasContext';

const LOGIN_TIMEOUT = 1000 * 60 * 1000; // 5 minutos em milissegundos

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin && Date.now() - parseInt(lastLogin, 10) < LOGIN_TIMEOUT) {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    localStorage.setItem('lastLogin', Date.now().toString()); // Armazena o tempo de login
  };

  return (
    <AlertasProvider>
      <Router>
        <Routes>
          {showLogin ? (
            <Route path="/" element={<Login onLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/TLM-Producao" element={<Grid />} />
              <Route path="/TLM-Producao/Editor" element={<Editor />} />
              <Route path="/TLM-Producao/Mosaiceditor" element={<MosaicForm />} />
              <Route path="/" element={<Navigate to="/TLM-Producao" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

        </Routes>
      </Router>
    </AlertasProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
