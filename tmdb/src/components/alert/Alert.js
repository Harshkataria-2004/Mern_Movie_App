import React, { useEffect } from 'react';
import './Alert.css'; // Add your CSS styling for the Alert component

const Alert = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
