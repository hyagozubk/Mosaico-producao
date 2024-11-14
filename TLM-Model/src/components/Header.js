// src/components/Header.js
import React, { useState, useEffect } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [logoImage, setLogoImage] = useState(null);

  // Função para buscar a imagem do logo com icon_id "logo"
  const fetchLogoImage = async () => {
    try {
      const response = await fetch('https://gentle-nearly-marmoset.ngrok-free.app/api/icons/1', {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const { src, mimetype } = await response.json();
      const blob = new Blob([Uint8Array.from(src.data)], { type: mimetype });
      const imageUrl = URL.createObjectURL(blob);
      setLogoImage(imageUrl);
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  useEffect(() => {
    fetchLogoImage(); // Busca o logo ao montar o componente
  }, []);

  return (
    <header className="header">
      {logoImage ? (
        <img src={logoImage} alt="Logo" className="header-logo" />
      ) : (
        <p>Carregando logo...</p>
      )}
      <nav>
        <ul className="header-nav">
          
        </ul>
      </nav>
    </header>
  );
};

export default Header;
