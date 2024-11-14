import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [implementation, setImplementation] = useState('0'); // Estado para a implementação selecionada
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'tlm' && password === '123') {
      onLogin();
      navigate(`/TLM-Producao?implem=${implementation}`); // Redireciona para a rota principal com a implementação selecionada
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <img className="logosss" src={process.env.PUBLIC_URL + '/assets/logonova.png'} alt="Logo" />
      <form onSubmit={handleLogin} className='main-div'>
        <h2 className='panel h2'>Identificação do usuário</h2>
        <p className='panel p'>Insira seu Usuário e senha</p>
        <div className="input-group">
          <input className='form-control'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
          />
        </div>
        <div className="input-group">
          <input className='form-control'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
        </div>
        <div className="implementacao">
          <label className='panel'>Implementação</label>
          <select className='select-imp' value={implementation} onChange={(e) => setImplementation(e.target.value)}>
            <option value="0">Implementação 0</option>
            <option value="1">Implementação 1</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
};

export default Login;