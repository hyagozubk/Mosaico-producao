import React, { createContext, useState, useContext } from 'react';
import Alertas from '../components/Alertas'; // Ajuste o caminho conforme a localização do seu componente Alertas

const AlertasContext = createContext();

export const useAlertas = () => useContext(AlertasContext);

export const AlertasProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts([...alerts, { id, message, type }]);
    setTimeout(() => removeAlert(id), 5001); // Remove automaticamente após 5 segundos
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertasContext.Provider value={{ addAlert }}>
      {children}
      <Alertas alerts={alerts} />
    </AlertasContext.Provider>
  );
};
