import React from 'react';
import '../styles/Alertas.css';

const Alertas = ({ alerts }) => {
  return (
    <div className="alertas-container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Alertas;
